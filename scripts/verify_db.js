
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env from the project root
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log('Verifying is_archived column existence...');
    const { data, error } = await supabase
        .from('brochures')
        .select('is_archived, campaign_start, campaign_end')
        .limit(1);

    if (error) {
        if (error.code === '42703') {
            console.error('❌ One or more columns (is_archived, campaign_start, campaign_end) DO NOT EXIST.');
        } else {
            console.error('❌ Error during verification:', error.message);
        }
    } else {
        console.log('✅ All columns (is_archived, campaign_start, campaign_end) VERIFIED successfully.');
    }
}

verify();
