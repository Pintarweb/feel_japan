import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { Resend } from 'resend';

const getResend = () => {
    const key = process.env.RESEND_API_KEY;
    if (!key && process.env.NODE_ENV === 'production') {
        console.warn("RESEND_API_KEY is missing in production environment");
    }
    return new Resend(key || 're_placeholder');
};

export async function POST(req: Request) {
    try {
        const { company_name, contact_name, email, brochure_slug } = await req.json();
        const supabase = await createClient();

        // DB Insert
        const { error } = await supabase
            .from('pricing_requests')
            .insert([{ company_name, contact_name, email, brochure_slug }]);

        if (error) {
            console.error("Supabase insert error:", error);
            throw error;
        }

        // Attempt to notify admin
        try {
            const resend = getResend();
            const sendTo = process.env.SUPPORT_EMAIL || 'support@feeljapanwithk.com';
            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || 'Feel Japan <notifications@updates.feeljapanwithk.com>',
                to: sendTo,
                subject: `New Pricing Request: ${company_name}`,
                html: `
          <h3>New Agent Pricing Request Submitted</h3>
          <p><strong>Brochure Requested:</strong> ${brochure_slug}</p>
          <hr/>
          <p><strong>Company / Agency Name:</strong> ${company_name}</p>
          <p><strong>Contact Person:</strong> ${contact_name}</p>
          <p><strong>Email Address:</strong> ${email}</p>
        `
            });
        } catch (e) {
            console.error('Failed to send pricing notification email:', e);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Pricing request error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
