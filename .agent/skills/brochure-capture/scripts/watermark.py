import fitz  # PyMuPDF
import os
import argparse
from pathlib import Path

def add_watermark(pdf_path, output_path=None, watermark_path=None):
    if not os.path.exists(pdf_path):
        print(f"Error: PDF not found at {pdf_path}")
        return

    wm_path = watermark_path if watermark_path else "assets/feel-japan-logo.png"
    if not os.path.exists(wm_path):
        # Try finding it relative to current script or project root if not absolute
        # Fallback logic could be added here
        print(f"Error: Watermark image not found at {wm_path}")
        return

    try:
        doc = fitz.open(pdf_path)
        
        # rect for watermark: bottom-right
        # Typical A4 is 595 x 842 points
        # Let's put it 20 points from right and bottom, size 100x50 approx (adjust as needed)
        
        img_width = 100
        img_height = 50 
        
        for page in doc:
            page_width = page.rect.width
            page_height = page.rect.height
            
            # Position: Bottom Right
            rect = fitz.Rect(
                page_width - img_width - 20, 
                page_height - img_height - 20, 
                page_width - 20, 
                page_height - 20
            )
            
            page.insert_image(
                rect,
                filename=wm_path,
                keep_proportion=True,
                overlay=True
            )

        # Save
        # To avoid permission errors on Windows if file is open, we might need a temp file approach
        # but fitz usually handles overwrite fine if closed.
        save_path = output_path if output_path else pdf_path
        
        # If overwriting, save to temp then move
        if save_path == pdf_path:
            temp_path = pdf_path + ".tmp"
            doc.save(temp_path, incremental=False, encryption=fitz.PDF_ENCRYPT_KEEP)
            doc.close()
            os.replace(temp_path, pdf_path)
        else:
            doc.save(save_path, incremental=False, encryption=fitz.PDF_ENCRYPT_KEEP)
            doc.close()
            
        print(f"Watermarked {pdf_path}")
        
    except Exception as e:
        print(f"Error watermarking {pdf_path}: {e}")

def main():
    parser = argparse.ArgumentParser(description="Add watermark to PDF.")
    parser.add_argument("path", help="Path to the PDF file or directory of PDFs")
    args = parser.parse_args()
    
    target = args.path
    
    if os.path.isfile(target):
        add_watermark(target)
    elif os.path.isdir(target):
        for root, _, files in os.walk(target):
            for file in files:
                if file.lower().endswith(".pdf"):
                    add_watermark(os.path.join(root, file))

if __name__ == "__main__":
    main()
