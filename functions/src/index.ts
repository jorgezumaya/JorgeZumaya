import { createHash } from 'node:crypto';
import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';

initializeApp();
const db = getFirestore();

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const URL_RE = /https?:\/\/[^\s]+|www\.[^\s]+/gi;
const ALLOWED_ORIGINS = ['https://jorgezumaya.me', 'http://localhost:4200'];

interface Payload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const submitContact = onRequest({ region: 'us-east1' }, async (req, res) => {
  const origin = req.headers.origin ?? '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
  }
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, subject, message } = (req.body ?? {}) as Partial<Payload>;

  // Validate
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    res.status(400).json({ error: 'All fields are required.' });
    return;
  }
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    res.status(400).json({ error: 'Invalid email address.' });
    return;
  }
  if (message.trim().length < 10) {
    res.status(400).json({ error: 'Message too short.' });
    return;
  }
  if (message.length > 2000) {
    res.status(400).json({ error: 'Message too long.' });
    return;
  }
  if (URL_RE.test(subject)) {
    res.status(400).json({ error: 'Links not permitted in subject.' });
    return;
  }

  // Rate limit by hashed IP
  const rawIp =
    ((req.headers['x-forwarded-for'] as string) ?? '').split(',')[0].trim() ||
    req.ip ||
    'unknown';
  const ipHash = createHash('sha256').update(rawIp).digest('hex').slice(0, 16);
  const rateRef = db.collection('rateLimits').doc(ipHash);
  const rateDoc = await rateRef.get();
  const now = Date.now();

  if (rateDoc.exists) {
    const data = rateDoc.data() as { count: number; resetAt: FirebaseFirestore.Timestamp };
    if (data.resetAt.toMillis() > now) {
      if (data.count >= RATE_LIMIT) {
        res.status(429).json({ error: 'Too many submissions. Please try again in an hour.' });
        return;
      }
      await rateRef.update({ count: FieldValue.increment(1) });
    } else {
      await rateRef.set({ count: 1, resetAt: new Date(now + RATE_WINDOW_MS) });
    }
  } else {
    await rateRef.set({ count: 1, resetAt: new Date(now + RATE_WINDOW_MS) });
  }

  // Store submission (admin SDK bypasses Firestore rules)
  await db.collection('contactSubmissions').add({
    name,
    email,
    subject,
    message,
    createdAt: FieldValue.serverTimestamp(),
    ipHash,
  });

  // Trigger email via extension
  await db.collection('mail').add({
    to: 'jorge.juarez087@gmail.com',
    message: {
      subject: `Portfolio contact: ${subject}`,
      text: buildPlainText({ name, email, subject, message }),
      html: buildHtml({ name, email, subject, message }),
    },
  });

  res.status(200).json({ ok: true });
});

function buildPlainText(p: Payload): string {
  const urls = extractUrls(p.name + ' ' + p.message);
  const linkSection = urls.length
    ? `\n\n--- Links found ---\n${urls.map((u) => `• ${u}`).join('\n')}`
    : '';
  return `Name: ${p.name}\nEmail: ${p.email}\n\nMessage:\n${p.message}${linkSection}`;
}

function buildHtml(p: Payload): string {
  const urls = extractUrls(p.name + ' ' + p.message);
  const escapedMessage = p.message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(new RegExp(URL_RE.source, 'gi'), (url) => `<a href="${url}" style="color:#ff3d00;">${url}</a>`)
    .replace(/\n/g, '<br>');

  const linksSection = urls.length
    ? `<tr><td style="padding:24px 32px 0;">
        <p style="margin:0 0 8px;font-family:monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a8a;">Links Found</p>
        <ul style="margin:0;padding:0 0 0 16px;">
          ${urls.map((u) => `<li style="margin-bottom:6px;"><a href="${u}" style="color:#ffb300;font-family:monospace;font-size:13px;word-break:break-all;">${u}</a></li>`).join('')}
        </ul>
      </td></tr>`
    : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Inter',system-ui,sans-serif;color:#fafafa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#141414;border-radius:8px;overflow:hidden;border:1px solid #242424;">
        <tr>
          <td style="background:#ff3d00;padding:24px 32px;">
            <p style="margin:0;font-family:monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#0a0a0a;opacity:0.7;">jorgezumaya.me</p>
            <h1 style="margin:4px 0 0;font-size:20px;font-weight:700;color:#0a0a0a;letter-spacing:-0.02em;">New Portfolio Contact</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom:12px;border-bottom:1px solid #242424;">
                  <p style="margin:0 0 2px;font-family:monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a8a;">From</p>
                  <p style="margin:0;font-size:15px;color:#fafafa;">${p.name} &nbsp;<a href="mailto:${p.email}" style="color:#ff3d00;text-decoration:none;">${p.email}</a></p>
                </td>
              </tr>
              <tr>
                <td style="padding-top:12px;">
                  <p style="margin:0 0 2px;font-family:monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a8a;">Subject</p>
                  <p style="margin:0;font-size:15px;color:#fafafa;">${p.subject}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 0;">
            <p style="margin:0 0 8px;font-family:monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a8a;">Message</p>
            <div style="background:#1c1c1c;border-left:3px solid #ff3d00;border-radius:0 4px 4px 0;padding:16px 20px;font-size:15px;line-height:1.7;color:#fafafa;">${escapedMessage}</div>
          </td>
        </tr>
        ${linksSection}
        <tr>
          <td style="padding:24px 32px;">
            <p style="margin:0;font-family:monospace;font-size:11px;color:#8a8a8a;">Submitted via <a href="https://jorgezumaya.me/contact" style="color:#ff3d00;text-decoration:none;">jorgezumaya.me/contact</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function extractUrls(text: string): string[] {
  return [...new Set(text.match(URL_RE) ?? [])];
}
