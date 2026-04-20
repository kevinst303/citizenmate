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
const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL || 'CitizenMate <noreply@mail.tigotechnology.com>';

// ── Email types ──

export type EmailTemplate =
  | 'purchase_confirmation'
  | 'premium_expiry_warning'
  | 'welcome';

// ── Send email ──

export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  const client = getResendClient();

  if (!client) {
    console.log(`[email] Would send to ${to}: ${subject}`);
    return { success: true, dev: true };
  }

  try {
    const result = await client.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
      text,
      replyTo: replyTo || 'support@citizenmate.com.au',
    });

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

  return sendEmail({
    to: email,
    subject: '🎉 Your Exam Sprint Pass is Active — CitizenMate',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0d9488; font-size: 28px; margin: 0;">🇦🇺 CitizenMate</h1>
        </div>
        
        <h2 style="color: #1e293b; font-size: 22px;">You're all set, mate! 🎉</h2>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          Your <strong style="color: #0d9488;">Exam Sprint Pass</strong> is now active. 
          You have <strong>60 days</strong> of full access to everything CitizenMate offers.
        </p>
        
        <div style="background: #f0fdfa; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <p style="margin: 0; color: #1e293b; font-size: 14px;">
            <strong>Access expires:</strong> ${expiryDate}
          </p>
        </div>
        
        <h3 style="color: #1e293b; font-size: 16px;">What's included:</h3>
        <ul style="color: #475569; font-size: 14px; line-height: 2;">
          <li>✅ All 15 mock tests with unlimited retakes</li>
          <li>✅ Complete bilingual study mode</li>
          <li>✅ Unlimited AI tutor explanations</li>
          <li>✅ 500+ practice questions</li>
          <li>✅ Readiness score & analytics</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://citizenmate.com.au/dashboard" 
             style="display: inline-block; background: #0d9488; color: white; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: bold; font-size: 16px;">
            Start Studying →
          </a>
        </div>
        
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 40px;">
          Questions? Email us at <a href="mailto:support@citizenmate.com.au" style="color: #0d9488;">support@citizenmate.com.au</a>
        </p>
      </div>
    `,
    text: `Your Exam Sprint Pass is now active! You have 60 days of full access until ${expiryDate}. Start studying at https://citizenmate.com.au/dashboard`,
  });
}

export async function sendPremiumExpiryWarning(email: string, daysLeft: number) {
  return sendEmail({
    to: email,
    subject: `⏰ Your Sprint Pass expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'} — CitizenMate`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0d9488; font-size: 28px; margin: 0;">🇦🇺 CitizenMate</h1>
        </div>
        
        <h2 style="color: #1e293b; font-size: 22px;">Your Sprint Pass expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}</h2>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          Make the most of your remaining access — take a few more mock tests and review any weak areas.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://citizenmate.com.au/practice" 
             style="display: inline-block; background: #0d9488; color: white; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: bold; font-size: 16px;">
            Take a Mock Test →
          </a>
        </div>
        
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          Need more time? You can purchase a new Sprint Pass after expiry.
        </p>
      </div>
    `,
    text: `Your Sprint Pass expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Take a mock test at https://citizenmate.com.au/practice`,
  });
}

export async function sendWelcomeEmail(email: string, name?: string) {
  const greeting = name ? `Hi ${name}` : 'Welcome';

  return sendEmail({
    to: email,
    subject: 'Welcome to CitizenMate 🇦🇺 — Your Citizenship Test Prep Starts Here',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0d9488; font-size: 28px; margin: 0;">🇦🇺 CitizenMate</h1>
        </div>
        
        <h2 style="color: #1e293b; font-size: 22px;">${greeting}!</h2>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          Thanks for signing up for CitizenMate — Australia's smartest citizenship test prep platform.
        </p>
        
        <h3 style="color: #1e293b; font-size: 16px;">Here's how to get started:</h3>
        <ol style="color: #475569; font-size: 14px; line-height: 2;">
          <li>📖 <strong>Study the topics</strong> — Start with the free chapters</li>
          <li>📝 <strong>Take a free mock test</strong> — See where you stand</li>
          <li>🤖 <strong>Ask the AI Tutor</strong> — Get explanations in your language</li>
        </ol>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://citizenmate.com.au/dashboard" 
             style="display: inline-block; background: #0d9488; color: white; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: bold; font-size: 16px;">
            Go to Dashboard →
          </a>
        </div>
        
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 40px;">
          You received this email because you signed up at citizenmate.com.au. 
          <a href="https://citizenmate.com.au/privacy" style="color: #0d9488;">Privacy Policy</a>
        </p>
      </div>
    `,
    text: `${greeting}! Thanks for signing up for CitizenMate. Start studying at https://citizenmate.com.au/dashboard`,
  });
}
