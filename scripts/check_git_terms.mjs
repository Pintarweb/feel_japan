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

async function checkGitTerms() {
    const { data, error } = await supabase
        .from('brochures')
        .select('title, payment_terms')
        .eq('category', 'GIT')
        .limit(1);

    if (error) {
        console.error("Error fetching brochure:", error.message);
        process.exit(1);
    } else {
        console.log("Example GIT Brochure Terms:", JSON.stringify(data?.[0], null, 2));
        process.exit(0);
    }
}

checkGitTerms();
