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

async function diagnose() {
    const { data, error } = await supabase
        .from('brochures')
        .select('id, slug, image, title')
        .eq('id', 'git-hokkaido-lavender-2024')
        .single();

    if (error) {
        console.error("Diagnostic Error:", error.message);
    } else {
        console.log("Current Record State:", JSON.stringify(data, null, 2));
    }
    process.exit(0);
}

diagnose();
