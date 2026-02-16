import json
import os
import argparse
import asyncio
from playwright.async_api import async_playwright
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

# Add current directory to path so we can import watermark
# Assuming capture.py and watermark.py are in the same directory
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)
from watermark import add_watermark

# Load environment variables (from project root .env.local)
project_root = os.path.abspath(os.path.join(current_dir, "../../../.."))
dotenv_path = os.path.join(project_root, ".env.local")
load_dotenv(dotenv_path)

# Constants
ITINERARIES_FILE = os.path.join(project_root, "itineraries.json")
PDF_OUTPUT_DIR = os.path.join(project_root, "dist/brochures")
BASE_URL = "http://localhost:3000" # Assuming local server
WATERMARK_IMAGE = os.path.join(project_root, "assets/feel-japan-logo.png")

# Supabase Setup
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") # Use Service Role for Storage if possible, or anon key
BUCKET_NAME = "brochures"

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Warning: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in .env.local")
    # Tries to continue without upload if keys missing, maybe just capture

async def capture_brochure(page, url_slug, output_path):
    full_url = f"{BASE_URL}{url_slug}"
    print(f"Navigating to {full_url}...")
    try:
        # Increase timeout for heavy pages
        await page.goto(full_url, wait_until="networkidle", timeout=60000)
        # Additional wait just in case
        await page.wait_for_timeout(3000)
        
        print(f"Generating PDF for {url_slug}...")
        await page.pdf(
            path=output_path, 
            format="A4", 
            print_background=True,
            margin={"top": "0cm", "right": "0cm", "bottom": "0cm", "left": "0cm"}
        )
        print(f"Saved raw PDF to {output_path}")
        return True
    except Exception as e:
        print(f"Error capturing {url_slug}: {e}")
        return False

def upload_to_supabase(file_path, filename):
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Skipping upload: Supabase credentials missing.")
        return False
        
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        with open(file_path, 'rb') as f:
            print(f"Uploading {filename} to bucket '{BUCKET_NAME}'...")
            
            # Check if file exists first to decide update vs upload (though 'upsert' option is cleaner if available)
            # The python lib 'upload' usually fails if exists. 'upsert' param might be needed.
            # Using 'upsert' option in file_options if available, or fetch/remove.
            
            # Simple approach: try upload, if 409 error (exists), try update.
            # Python SDK signature: storage.from_(...).upload(path, file, file_options={"upsert": "true"})
            
            res = supabase.storage.from_(BUCKET_NAME).upload(
                path=filename, 
                file=f, 
                file_options={"upsert": "true", "content-type": "application/pdf"}
            )
            print(f"Upload successful: {res}")
            return True
    except Exception as e:
        print(f"Error uploading {filename}: {e}")
        return False

async def main():
    parser = argparse.ArgumentParser(description="Capture brochures as PDFs.")
    parser.add_argument("--force", action="store_true", help="Force re-capture of existing PDFs")
    args = parser.parse_args()

    # Ensure output directory exists
    os.makedirs(PDF_OUTPUT_DIR, exist_ok=True)

    # 1. Read URLs
    if not os.path.exists(ITINERARIES_FILE):
        print(f"Error: {ITINERARIES_FILE} not found.")
        return

    try:
        with open(ITINERARIES_FILE, 'r') as f:
            data = json.load(f)
            itineraries = data if isinstance(data, list) else data.get("itineraries", [])
    except json.JSONDecodeError:
        print(f"Error: Failed to decode {ITINERARIES_FILE}.")
        return

    async with async_playwright() as p:
        # 2. Browser Setup
        print("Launching browser...")
        browser = await p.chromium.launch()
        page = await browser.new_page()

        for item in itineraries:
            # Extract slug
            if isinstance(item, str):
                slug = item
            elif isinstance(item, dict):
                slug = item.get("slug") or item.get("url")
            else:
                continue
                
            if not slug:
                continue

            # Ensure slug starts with /
            if not slug.startswith("/"):
                slug = "/" + slug

            # Construct filename
            filename = slug.strip("/").replace("/", "-") + ".pdf"
            output_path = os.path.join(PDF_OUTPUT_DIR, filename)
            
            # Check constraints (local check)
            # We recreate locally first. Upload runs if capture runs OR logic updated to upload existing.
            # Here: Capture -> Watermark -> Upload
            
            should_capture = args.force or not os.path.exists(output_path)
            
            if should_capture:
                success = await capture_brochure(page, slug, output_path)
                if not success:
                    continue
                
                # 4. Watermark
                # Call imported function. Need to update it to take correct paths if needed.
                # Assuming add_watermark updates in place or saves to same path.
                print(f"Watermarking {filename}...")
                add_watermark(output_path, watermark_path=WATERMARK_IMAGE) 
            else:
                print(f"Skipping capture for {slug} (PDF exists locally).")

            # 5. Upload (Always try to upload if it exists locally, or only if captured? 
            # Let's upload to ensure sync)
            if os.path.exists(output_path):
                upload_to_supabase(output_path, filename)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
