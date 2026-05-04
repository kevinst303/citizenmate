import { Resend } from 'resend';

// ===== Email Service =====
// Uses Resend for transactional emails to users.
// Falls back gracefully when not configured (dev mode).

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (resendClient) return resendClient;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not configured — emails will be logged only');
    return null;
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

// ── Default sender ──
const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || 'CitizenMate <hello@citizenmate.com.au>';

// ── Send email ──

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
  templateId,
  variables,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
  templateId?: string;
  variables?: Record<string, unknown>;
}) {
  const client = getResendClient();

  if (!client) {
    console.log(`[email] Would send to ${to}: ${subject}`);
    if (templateId) console.log(`[email] With templateId ${templateId}`, variables);
    return { success: true, dev: true };
  }

  try {
    const payload: any = {
      from: FROM_ADDRESS,
      to,
      subject,
      replyTo: replyTo || 'support@citizenmate.com.au',
    };

    if (templateId) {
      payload.template = {
        id: templateId,
        variables: variables || {},
      };
    } else {
      if (html) payload.html = html;
      if (text) payload.text = text;
    }

    const result = await client.emails.send(payload);

    console.log(`[email] Sent "${subject}" to ${to}`, result);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error(`[email] Failed to send "${subject}" to ${to}:`, error);
    return { success: false, error };
  }
}

// ── Pre-built Templates ──

export async function sendPurchaseConfirmation(email: string, expiresAt: string) {
  const expiryDate = new Date(expiresAt).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const templateId = process.env.RESEND_TEMPLATE_PURCHASE;
  if (!templateId) console.warn('[email] Missing RESEND_TEMPLATE_PURCHASE env var');

  return sendEmail({
    to: email,
    subject: '🎉 Your Exam Sprint Pass is Active — CitizenMate',
    templateId,
    variables: { expiryDate },
  });
}

export async function sendPremiumExpiryWarning(email: string, daysLeft: number) {
  const templateId = process.env.RESEND_TEMPLATE_EXPIRY_WARNING;
  if (!templateId) console.warn('[email] Missing RESEND_TEMPLATE_EXPIRY_WARNING env var');

  return sendEmail({
    to: email,
    subject: `⏰ Your Sprint Pass expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'} — CitizenMate`,
    templateId,
    variables: { daysLeft },
  });
}

export async function sendWelcomeEmail(email: string, name?: string) {
  const templateId = process.env.RESEND_TEMPLATE_WELCOME;
  if (!templateId) console.warn('[email] Missing RESEND_TEMPLATE_WELCOME env var');

  return sendEmail({
    to: email,
    subject: 'Welcome to CitizenMate 🇦🇺 — Your Citizenship Test Prep Starts Here',
    templateId,
    variables: { userName: name || 'there' },
  });
}
