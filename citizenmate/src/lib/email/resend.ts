import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

interface SendEmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailParams): Promise<void> {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_mock_key') {
    console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
    return;
  }

  try {
    await resend.emails.send({
      from: 'CitizenMate <hello@citizenmate.com.au>',
      to,
      subject,
      ...(html ? { html } : { text: text || subject }),
    });
  } catch (err) {
    console.error('[Email] Failed to send:', err);
  }
}

export async function sendPurchaseConfirmation(
  email: string,
  expiresAt: string
): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://citizenmate.com.au';
  const formattedDate = new Date(expiresAt).toLocaleDateString('en-AU');

  await sendEmail({
    to: email,
    subject: 'Your CitizenMate Premium is active!',
    html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <h1 style="color:#0f766e;">Premium Active!</h1>
      <p>Your CitizenMate Premium subscription is now active.</p>
      <p>Access expires: <strong>${formattedDate}</strong></p>
      <a href="${siteUrl}/dashboard" style="display:inline-block;padding:12px 24px;background:#0f766e;color:white;text-decoration:none;border-radius:8px;">Go to Dashboard</a>
    </div>`,
  });
}
