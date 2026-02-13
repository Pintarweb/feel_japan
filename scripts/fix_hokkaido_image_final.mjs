import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Validated Hokkaido Lavender Image (Non-Plus)
const finalReliableUrl = 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop';

async function fixImage() {
    const { error } = await supabase
        .from('brochures')
        .update({
            image: finalReliableUrl
        })
        .eq('id', 'git-hokkaido-lavender-2024');

    if (error) {
        console.error("Update Error:", error.message);
        process.exit(1);
    } else {
        console.log("Hokkaido image updated to high-reliability URL.");
        process.exit(0);
    }
}

fixImage();
