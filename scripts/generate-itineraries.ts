import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Fetching brochure slugs from Supabase...');
    const { data, error } = await supabase.from('brochures').select('slug');

    if (error) {
        console.error('Error fetching brochures:', error);
        process.exit(1);
    }

    const slugs = data?.map(d => `/brochures/${d.slug}`) || [];
    const outputPath = path.join(process.cwd(), 'itineraries.json');

    fs.writeFileSync(outputPath, JSON.stringify(slugs, null, 2));
    console.log(`Wrote ${slugs.length} slugs to ${outputPath}`);
}

main().catch(console.error);
