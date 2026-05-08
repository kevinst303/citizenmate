import { createHmac } from "crypto";

const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

export function generateUnsubscribeToken(userId: string): string {
  return createHmac("sha256", UNSUBSCRIBE_SECRET || "").update(userId).digest("hex");
}

export function verifyUnsubscribeToken(userId: string, token: string): boolean {
  if (!UNSUBSCRIBE_SECRET) return false;
  const expected = generateUnsubscribeToken(userId);
  if (token.length !== expected.length) return false;
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return result === 0;
}

export function generateUnsubscribeUrl(userId: string, origin: string): string {
  const token = generateUnsubscribeToken(userId);
  return `${origin}/api/unsubscribe?id=${encodeURIComponent(userId)}&token=${encodeURIComponent(token)}`;
}
