
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Manually load env vars since dotenv might have issues with relative paths in some contexts
const envPath = path.resolve(__dirname, '..', '.env.local');
const envConfig = dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials.');
    console.log('Tried loading from:', envPath);
    console.log('Got env:', envConfig.parsed);
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateItineraries() {
    console.log('Connecting to Supabase...');
    const { data, error } = await supabase
        .from('brochures')
        .select('slug')
        .or('is_archived.eq.false,is_archived.is.null');

    if (error) {
        console.error('Error fetching brochures:', error);
        process.exit(1);
    }

    if (!data || data.length === 0) {
        console.log('No active brochures found in database.');
    } else {
        const itineraries = data.map((item: any) => `/brochures/${item.slug}`);
        const outputPath = path.resolve(__dirname, '..', 'itineraries.json');

        fs.writeFileSync(outputPath, JSON.stringify(itineraries, null, 2));
        console.log(`Successfully generated itineraries.json with ${itineraries.length} URLs.`);
        console.log('URLs:', itineraries);
    }
}

generateItineraries();
