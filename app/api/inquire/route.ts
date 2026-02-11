import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We instantiate this inside the handler or via a getter to avoid build-time crashes if the API key is missing
const getResend = () => {
    const key = process.env.RESEND_API_KEY;
    if (!key && process.env.NODE_ENV === 'production') {
        console.warn("RESEND_API_KEY is missing in production environment");
    }
    return new Resend(key || 're_placeholder');
};

// Server-side Supabase client (using Service Role would be better for internal logs, but Anon works if RLS allows)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            agency_name,
            name,
            email,
            phone,
            pax,
            adults,
            children_6_11,
            infants_under_6,
            travel_dates,
            package_slug,
            room_category,
            places_of_visit,
            estimated_budget,
            newsletter_optin
        } = body;

        // 1. Save Inquiry to Supabase
        const { data: inquiry, error: inquiryError } = await supabase
            .from('inquiries')
            .insert([{
                agency_name,
                name,
                email,
                phone,
                pax,
                adults,
                children_6_11,
                infants_under_6,
                travel_dates,
                package_slug,
                room_category,
                places_of_visit,
                estimated_budget,
                newsletter_optin
            }])
            .select()
            .single();

        if (inquiryError) throw inquiryError;

        // 2. Prepare Email Content
        const emailSubject = `New B2B Inquiry: ${agency_name} - ${name}`;
        const emailHtml = `
      <div style="font-family: serif; color: #001F3F; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 40px; border-radius: 20px;">
        <h1 style="color: #C5A059; border-bottom: 2px solid #C5A059; padding-bottom: 10px;">New Inquiry Received</h1>
        <p>A new high-value lead has been captured via the Feel Japan Portal.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Agency Details</h3>
          <p><strong>Agency:</strong> ${agency_name}</p>
          <p><strong>Contact:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Itinerary Interest</h3>
          <p><strong>Package:</strong> ${package_slug}</p>
          <p><strong>Dates:</strong> ${travel_dates}</p>
          <p><strong>Pax:</strong> ${pax} (Adults: ${adults}, Children: ${children_6_11}, Infants: ${infants_under_6})</p>
          <p><strong>Category:</strong> ${room_category}</p>
          <p><strong>Budget:</strong> ${estimated_budget}</p>
          <p><strong>Destinations:</strong> ${places_of_visit}</p>
        </div>

        <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 2px; text-align: center; margin-top: 40px;">
          FEEL JAPAN B2B PORTAL • SECURE TRANSMISSION
        </p>
      </div>
    `;

        // 3. Send Email via Resend
        const resend = getResend();
        const { data: resendData, error: resendError } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: process.env.SUPPORT_EMAIL || 'admin@pintarweb.com', // Use support email
            subject: emailSubject,
            html: emailHtml,
        });

        // 4. Log Communication to Supabase
        if (inquiry) {
            await supabase.from('inquiry_communications').insert([{
                inquiry_id: inquiry.id,
                type: 'email',
                subject: emailSubject,
                content: emailHtml,
                resend_id: resendData?.id || null,
                status: resendError ? 'failed' : 'sent'
            }]);
        }

        return NextResponse.json({ success: true, inquiryId: inquiry?.id });

    } catch (error: any) {
        console.error('Inquiry API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
