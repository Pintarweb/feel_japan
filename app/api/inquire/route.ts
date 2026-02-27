import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { z } from 'zod';
import * as React from 'react';
import { render } from '@react-email/components';
import InquiryNotification from '@/emails/InquiryNotification';
import ClientAcknowledgment from '@/emails/ClientAcknowledgment';

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
  children_cwb: z.union([z.number(), z.string()]).optional(),
  children_cnb: z.union([z.number(), z.string()]).optional(),
  infants_0_2: z.union([z.number(), z.string()]).optional(),
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

    // Server-side Supabase client with cookies
    const supabase = await createClient();

    // Let's get the user, without throwing if unauthenticated
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user || null;

    let body;
    try {
      body = inquirySchema.parse(rawBody);
    } catch (zodError: any) {
      console.error("Zod Validation Error:", zodError.errors || zodError);
      return NextResponse.json({ error: "Invalid form data.", details: zodError.errors }, { status: 400 });
    }

    const {
      pax,
      adults,
      children_cwb,
      children_cnb,
      infants_0_2,
      travel_dates,
      package_slug,
      room_category,
      places_of_visit,
      estimated_budget,
      newsletter_optin
    } = body;

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

    const numChildrenCWB = children_cwb ? parseInt(String(children_cwb)) : 0;
    const numChildrenCNB = children_cnb ? parseInt(String(children_cnb)) : 0;
    const numInfants0to2 = infants_0_2 ? parseInt(String(infants_0_2)) : 0;

    // 1. Save Inquiry to Supabase
    const inquiryData: any = {
      pax,
      adults,
      children_6_11: numChildrenCWB + numChildrenCNB,
      infants_0_2: numInfants0to2,
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
    const emailHtml = await render(
      React.createElement(InquiryNotification, {
        agencyName,
        agentName,
        licenseNo,
        agentEmail,
        agentPhone,
        userId: user ? user.id : null,
        isVerified,
        packageSlug: package_slug || '',
        travelDates: travel_dates,
        pax,
        adults,
        childrenCWB: numChildrenCWB,
        childrenCNB: numChildrenCNB,
        infants0to2: numInfants0to2,
        roomCategory: room_category || '',
        estimatedBudget: estimated_budget || '',
        placesOfVisit: places_of_visit || ''
      })
    );

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
    const clientHtml = await render(
      React.createElement(ClientAcknowledgment, {
        agentName,
        agencyName,
        packageSlug: package_slug || '',
        inquiryId: inquiry.id
      })
    );

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
