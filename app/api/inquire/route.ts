import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// We instantiate this inside the handler or via a getter to avoid build-time crashes if the API key is missing
const getResend = () => {
    const key = process.env.RESEND_API_KEY;
    if (!key && process.env.NODE_ENV === 'production') {
        console.warn("RESEND_API_KEY is missing in production environment");
    }
    return new Resend(key || 're_placeholder');
};

const inquirySchema = z.object({
    pax: z.number().min(1),
    adults: z.number().min(1),
    children_6_11: z.union([z.number(), z.string()]).optional(),
    infants_under_6: z.union([z.number(), z.string()]).optional(),
    travel_dates: z.string().min(1),
    package_slug: z.string().optional(),
    room_category: z.string().optional(),
    places_of_visit: z.string().optional(),
    estimated_budget: z.string().optional(),
    newsletter_optin: z.boolean().optional(),
    guest_full_name: z.string().optional().nullable(),
    guest_email: z.string().email().optional().nullable().or(z.literal('')),
    guest_agency_name: z.string().optional().nullable(),
    guest_license_number: z.string().optional().nullable(),
    guest_phone: z.string().optional().nullable()
});

export async function POST(req: Request) {
    try {
        const rawBody = await req.json();
        const body = inquirySchema.parse(rawBody);
        
        const {
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

        // Server-side Supabase client instantiated per request
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // 0. Get Authenticated User from Session (Optional for Selective Launch)
        const { data: { user } } = await supabase.auth.getUser();
        let agentProfile = null;

        if (user) {
            // 0a. Fetch Agent Profile
            const { data: profile } = await supabase
                .from('agent_profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            agentProfile = profile;
        }

        const numChildren611 = children_6_11 ? parseInt(String(children_6_11)) : 0;
        const numInfantsUnder6 = infants_under_6 ? parseInt(String(infants_under_6)) : 0;

        // 1. Save Inquiry to Supabase
        const inquiryData: any = {
            pax,
            adults,
            children_6_11: numChildren611,
            infants_under_6: numInfantsUnder6,
            travel_dates,
            package_slug,
            room_category,
            places_of_visit,
            estimated_budget,
            newsletter_optin,
            // Link to agent if logged in
            agent_id: user?.id || null,
            // Save guest details if not logged in
            guest_full_name: user ? null : body.guest_full_name,
            guest_email: user ? null : body.guest_email,
            guest_agency_name: user ? null : body.guest_agency_name,
            guest_license_number: user ? null : body.guest_license_number,
            guest_phone: user ? null : body.guest_phone
        };

        const { data: inquiry, error: inquiryError } = await supabase
            .from('inquiries')
            .insert([inquiryData])
            .select()
            .single();

        if (inquiryError) throw inquiryError;

        // 2. Prepare Email Content
        const agentName = agentProfile?.full_name || body.guest_full_name || 'Guest User';
        const agencyName = agentProfile?.agency_name || body.guest_agency_name || 'Independent/Guest';
        const licenseNo = agentProfile?.license_number || body.guest_license_number || 'N/A';
        const agentEmail = agentProfile?.email || body.guest_email || 'N/A';
        const agentPhone = agentProfile?.phone || body.guest_phone || 'N/A';
        const isVerified = agentProfile?.is_verified || false;

        const emailSubject = `New B2B Inquiry: ${agencyName} - ${agentName}`;
        const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #334155;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
          <div style="background-color: #0f172a; padding: 30px; text-align: center;">
            <h1 style="color: #C5A059; margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px;">New B2B Inquiry</h1>
          </div>
          <div style="padding: 30px;">
            <p style="margin-top: 0; font-size: 15px; color: #475569;">A new lead has been captured via the Feel Japan with K B2B Portal.</p>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Agent Details</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9; width: 35%;">Agency Name</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${agencyName}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Agent Name</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${agentName}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">License No</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${licenseNo}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Email</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${agentEmail}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Phone</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${agentPhone}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">User Type</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${user ? 'Partner (' + user.id + ')' : 'Guest'}</td></tr>
              </table>
            </div>

            <div style="background-color: ${isVerified ? '#f0fdf4' : '#fffbeb'}; border-left: 4px solid ${isVerified ? '#22c55e' : '#f59e0b'}; padding: 16px; margin-bottom: 25px; border-radius: 0 8px 8px 0;">
              <strong style="color: ${isVerified ? '#166534' : '#b45309'}; font-size: 14px; display: block; margin-bottom: 4px;">${isVerified ? '✓ Verified Partner' : '⚠ Unverified / Guest'}</strong>
              <span style="color: ${isVerified ? '#15803d' : '#d97706'}; font-size: 13px;">${isVerified ? 'Partner is pre-verified in the portal.' : 'Manual validation required for guest/unverified submission.'}</span>
            </div>

            <div>
              <h3 style="color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Itinerary Requirements</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9; width: 35%;">Package</td><td style="padding: 8px 0; color: #0f172a; font-weight: 600; border-bottom: 1px solid #f1f5f9;">${package_slug || 'Custom Architecture'}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Dates</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${travel_dates}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Pax</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${pax} Total (A:${adults} C:${numChildren611} I:${numInfantsUnder6})</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Category</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${room_category}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; border-bottom: 1px solid #f1f5f9;">Budget</td><td style="padding: 8px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9;">${estimated_budget}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;">Destinations</td><td style="padding: 8px 0; color: #0f172a; line-height: 1.5;">${places_of_visit}</td></tr>
              </table>
            </div>
          </div>
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1.5px;">Feel Japan with K • B2B Portal • Secure Transmission</p>
          </div>
        </div>
      </div>
    `;

        // 3. Send Emails via Resend
        const resend = getResend();
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
        const supportEmail = process.env.SUPPORT_EMAIL || 'admin@pintarweb.com';

        // 3a. Internal Notification (Email)
        const { data: internalData, error: internalError } = await resend.emails.send({
            from: fromEmail,
            to: supportEmail,
            subject: emailSubject,
            html: emailHtml,
        });

        // 3b. Internal Notification (WhatsApp - Optional)
        try {
            if (isVerified || !user) {
                const message = `New Inquiry: ${agencyName} (${agentName})\n` +
                    `- Dates: ${travel_dates}\n` +
                    `- Pax: ${pax}\n` +
                    `- Destinations: ${places_of_visit || 'N/A'}`;

                await fetch(`https://api.whatsapp.com/send?phone=${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`);
            }
        } catch (waError) {
            console.error('WhatsApp notification failed:', waError);
        }

        // 3b. Client Acknowledgment (Auto-Reply)
        const clientSubject = `Inquiry Confirmed: Feel Japan with K Bespoke (Ref: ${inquiry.id.substring(0, 8)})`;
        const clientHtml = `
            <div style="font-family: 'Georgia', serif; background-color: #f8fafc; padding: 40px 20px; color: #334155;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-top: 4px solid #C5A059; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                <div style="padding: 40px;">
                  <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="color: #0f172a; font-size: 28px; font-weight: normal; margin: 0 0 10px 0; letter-spacing: 1px;">Feel Japan with K</h1>
                    <p style="color: #C5A059; font-family: -apple-system, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; margin: 0;">Bespoke Travel Architecture</p>
                  </div>
                  
                  <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #334155;">Dear ${agentName},</p>
                  
                  <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #334155;">We wish to formally acknowledge receipt of your bespoke travel request for <strong>${agencyName}</strong>. Your inquiry has been successfully transmitted to our team of travel designers.</p>
                  
                  <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #334155;">At Feel Japan with K, we treat every itinerary as a unique piece of architecture. A member of our concierge team will carefully review your requirements and reach out to you within 24 to 48 business hours.</p>
                  
                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 25px; text-align: center; margin-bottom: 30px;">
                    <p style="font-family: -apple-system, sans-serif; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">Reference Details</p>
                    <p style="font-size: 18px; color: #0f172a; margin: 0 0 5px 0;"><strong>${package_slug || 'Bespoke Arrangement'}</strong></p>
                    <p style="font-family: -apple-system, sans-serif; font-size: 13px; color: #64748b; margin: 0;">Transmission ID: ${inquiry.id.substring(0, 8).toUpperCase()}</p>
                  </div>

                  <p style="font-size: 16px; line-height: 1.6; margin-bottom: 5px; color: #334155;">Warm regards,</p>
                  <p style="font-size: 16px; font-style: italic; color: #C5A059; margin: 0;">The Feel Japan with K Concierge Team</p>
                </div>
                <div style="background-color: #0f172a; padding: 25px; text-align: center;">
                  <p style="font-family: -apple-system, sans-serif; font-size: 11px; color: #94a3b8; margin: 0; letter-spacing: 0.5px;">This is an automated acknowledgment. Please do not reply directly to this email.</p>
                </div>
              </div>
            </div>
        `;

        const { data: clientResData, error: clientResError } = await resend.emails.send({
            from: fromEmail,
            to: agentEmail, // Send to the agent
            subject: clientSubject,
            html: clientHtml,
        });

        // 4. Log Communication to Supabase
        if (inquiry) {
            // Log Internal
            await supabase.from('inquiry_communications').insert([{
                inquiry_id: inquiry.id,
                type: 'email',
                subject: emailSubject,
                content: emailHtml,
                resend_id: internalData?.id || null,
                status: internalError ? 'failed' : 'sent',
                error_message: internalError ? JSON.stringify(internalError) : null
            }]);

            // Log Client Acknowledgement
            await supabase.from('inquiry_communications').insert([{
                inquiry_id: inquiry.id,
                type: 'email',
                direction: 'outbound',
                subject: clientSubject,
                content: clientHtml,
                resend_id: clientResData?.id || null,
                status: clientResError ? 'failed' : 'sent',
                error_message: clientResError ? JSON.stringify(clientResError) : null
            }]);
        }

        return NextResponse.json({ success: true, inquiryId: inquiry?.id });

    } catch (error: any) {
        console.error('Inquiry API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
