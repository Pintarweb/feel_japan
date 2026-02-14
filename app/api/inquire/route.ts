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
      <div style="font-family: serif; color: #001F3F; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 40px; border-radius: 20px;">
        <h1 style="color: #C5A059; border-bottom: 2px solid #C5A059; padding-bottom: 10px;">New Inquiry Received</h1>
        <p>A new lead has been captured via the Feel Japan with K B2B Portal (Linked to Agent Profile).</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin: 20px 0;">
          <p><strong>Agency:</strong> ${agencyName}</p>
          <p><strong>License No:</strong> ${licenseNo}</p>
          
          <div style="background: ${isVerified ? '#D4EDDA' : '#FFF3CD'}; padding: 15px; border: 1px solid ${isVerified ? '#C3E6CB' : '#FFEEBA'}; border-radius: 5px; margin-top: 10px;">
             <strong style="color: ${isVerified ? '#155724' : '#856404'}; font-size: 12px;">${isVerified ? '✅ VERIFIED PARTNER' : '⚠️ UNVERIFIED/GUEST'}</strong>
             <p style="margin: 5px 0 10px 0; font-size: 11px; color: ${isVerified ? '#155724' : '#856404'};">Status: ${isVerified ? 'Partner is pre-verified in the portal.' : 'Manual validation required for guest/unverified submission.'}</p>
          </div>

          <p style="margin-top: 15px;"><strong>Agent Name:</strong> ${agentName}</p>
          <p><strong>Email:</strong> ${agentEmail}</p>
          <p><strong>Phone:</strong> ${agentPhone}</p>
          <p><strong>User Type:</strong> ${user ? `Partner (${user.id})` : 'Guest'}</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Itinerary Interest</h3>
          <p><strong>Package:</strong> ${package_slug || 'Custom Architecture'}</p>
          <p><strong>Dates:</strong> ${travel_dates}</p>
          <p><strong>Pax:</strong> ${pax} (Adults: ${adults}, Children: ${children_6_11}, Infants: ${infants_under_6})</p>
          <p><strong>Category:</strong> ${room_category}</p>
          <p><strong>Budget:</strong> ${estimated_budget}</p>
          <p><strong>Destinations:</strong> ${places_of_visit}</p>
        </div>

        <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 2px; text-align: center; margin-top: 40px;">
          FEEL JAPAN WITH K • B2B PORTAL • SECURE TRANSMISSION
        </p>
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
            <div style="font-family: serif; color: #001F3F; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 40px; border-radius: 20px; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #C5A059; font-style: italic; margin-bottom: 5px;">Feel Japan with K</h2>
                    <p style="font-[10px]; text-transform: uppercase; letter-spacing: 3px; color: #999;">Bespoke Travel Architecture</p>
                </div>
                
                <p>Dear ${agentName},</p>
                
                <p>We wish to formally acknowledge receipt of your bespoke travel request for <strong>${agencyName}</strong>. Your inquiry has been successfully transmitted to our team of travel designers at <strong>Feel Japan with K</strong>.</p>
                
                <p>At Feel Japan with K, we treat every itinerary as a unique piece of architecture. Your request has been linked to your professional profile.</p>
                
                <p>A member of our team will review your requirements and reach out to you within 24-48 business hours.</p>
                
                <div style="margin: 30px 0; padding: 20px; background: #fcfaf5; border-left: 3px solid #C5A059; font-size: 13px;">
                    <strong>Reference ID:</strong> ${inquiry.id}<br/>
                    <strong>Package Interest:</strong> ${package_slug || 'Bespoke Arrangement'}
                </div>

                <p style="font-size: 12px; color: #666; margin-top: 40px;">
                    Warm regards,<br/>
                    <strong>The Feel Japan with K Concierge Team</strong>
                </p>
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
