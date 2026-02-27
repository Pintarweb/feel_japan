import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updatePaymentTerms() {
    console.log("Fetching brochures...");

    // First, fetch all brochures
    const { data: brochures, error: fetchError } = await supabase
        .from('brochures')
        .select('id, payment_terms');

    if (fetchError) {
        console.error("Error fetching brochures:", fetchError);
        process.exit(1);
    }

    if (!brochures || brochures.length === 0) {
        console.log("No brochures found.");
        return;
    }

    console.log(`Found ${brochures.length} brochures. Updating payment terms...`);

    const newFinalPaymentText = '1 month before arrival';

    let updateCount = 0;
    let skipCount = 0;

    for (const brochure of brochures) {
        const paymentTerms = brochure.payment_terms || {};

        // Only update if it contains the old pattern or if we're forcing an update
        if (paymentTerms.finalPayment !== newFinalPaymentText) {
            const updatedPaymentTerms = {
                ...paymentTerms,
                finalPayment: newFinalPaymentText
            };

            const { error: updateError } = await supabase
                .from('brochures')
                .update({ payment_terms: updatedPaymentTerms })
                .eq('id', brochure.id);

            if (updateError) {
                console.error(`Error updating brochure ${brochure.id}:`, updateError);
            } else {
                updateCount++;
                console.log(`Updated brochure ${brochure.id}`);
            }
        } else {
            skipCount++;
        }
    }

    console.log(`\nUpdate complete.`);
    console.log(`Successfully updated: ${updateCount}`);
    console.log(`Already up-to-date: ${skipCount}`);
}

updatePaymentTerms().catch(console.error);
