import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const getResend = () => {
    const key = process.env.RESEND_API_KEY;
    if (!key && process.env.NODE_ENV === 'production') {
        console.warn("RESEND_API_KEY is missing in production environment");
    }
    return new Resend(key || 're_placeholder');
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            agency_name,
            license_number,
            address,
            full_name,
            designation,
            phone,
            email
        } = body;

        const resend = getResend();
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
        const supportEmail = process.env.SUPPORT_EMAIL || 'admin@pintarweb.com';

        // 1. Internal Notification (To Admin)
        const adminSubject = `🚨 Partner Access Request: ${agency_name}`;
        const adminHtml = `
            <div style="font-family: sans-serif; color: #001F3F; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 40px; border-radius: 20px;">
                <h2 style="color: #C5A059; border-bottom: 2px solid #C5A059; padding-bottom: 10px;">New Partner Enrollment</h2>
                <p>A new agency has requested access to the B2B Partner Portal.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #001F3F;">Agency Details</h3>
                    <p><strong>Agency:</strong> ${agency_name}</p>
                    <p><strong>License No:</strong> ${license_number}</p>
                    <p><strong>Address:</strong> ${address}</p>
                </div>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #001F3F;">Contact Person</h3>
                    <p><strong>Name:</strong> ${full_name}</p>
                    <p><strong>Designation:</strong> ${designation}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                </div>

                <div style="background: #FFF3CD; padding: 20px; border: 1px solid #FFEEBA; border-radius: 15px; margin-top: 20px; text-align: center;">
                    <strong style="color: #856404; display: block; margin-bottom: 10px;">⚠️ ACTION REQUIRED: License Verification</strong>
                    <a href="https://www.motac.gov.my/en/kategori-semakan-new/travel-agency-tobtab/" target="_blank" style="background: #856404; color: white; padding: 12px 24px; text-decoration: none; font-size: 14px; border-radius: 8px; font-weight: bold; display: inline-block;">Verify on MOTAC Portal &rarr;</a>
                </div>

                <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 2px; text-align: center; margin-top: 40px;">
                    FEEL JAPAN WITH K • B2B PORTAL • SECURE TRANSMISSION
                </p>
            </div>
        `;

        const { error: adminError } = await resend.emails.send({
            from: fromEmail,
            to: supportEmail,
            subject: adminSubject,
            html: adminHtml,
        });

        // 2. User Welcome Email (To Agent)
        const userSubject = `Welcome to Feel Japan with K Partner Network`;
        const userHtml = `
            <div style="font-family: serif; color: #001F3F; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 40px; border-radius: 20px; line-height: 1.6;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #C5A059; font-style: italic; margin-bottom: 5px;">Feel Japan with K</h2>
                    <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #999;">Bespoke Travel Architecture</p>
                </div>
                
                <p>Dear ${full_name},</p>
                
                <p>Thank you for requesting access to the <strong>Feel Japan with K Partner Network</strong>. We have received the enrollment details for <strong>${agency_name}</strong>.</p>
                
                <p>Our team is currently reviewing your agency credentials and travel license. This professional verification process typically takes 1-2 business hours.</p>
                
                <div style="margin: 30px 0; padding: 20px; background: #fcfaf5; border-left: 3px solid #C5A059; font-size: 14px;">
                    <strong>Next Steps:</strong>
                    <ol style="margin-top: 10px; padding-left: 20px;">
                        <li>Verify your email using the Login Link sent separately.</li>
                        <li>Once verified, your account will be placed in the "Review" queue.</li>
                        <li>You will receive a notification once your full partner access is activated.</li>
                    </ol>
                </div>

                <p>In the meantime, you can explore our public itineraries and heritage collections on the main portal.</p>
                
                <p style="font-size: 12px; color: #666; margin-top: 40px;">
                    Warm regards,<br/>
                    <strong>The Feel Japan with K Partner Relations Team</strong>
                </p>
            </div>
        `;

        const { error: userError } = await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: userSubject,
            html: userHtml,
        });

        if (adminError || userError) {
            console.error('Email Notification Error:', { adminError, userError });
            // We don't necessarily want to fail the whole signup if just the notification fails,
            // but for tracking we'll log it.
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Signup Notification API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
