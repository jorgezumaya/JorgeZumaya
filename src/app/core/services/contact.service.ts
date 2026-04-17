import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const URL_RE = /https?:\/\/[^\s]+|www\.[^\s]+/gi;

@Injectable({ providedIn: 'root' })
export class ContactService {
  private firestore = inject(Firestore);

  private withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`[contact] ${label} timed out after ${ms}ms`)), ms),
      ),
    ]);
  }

  async submit(payload: ContactSubmission): Promise<void> {
    const data = { ...payload, createdAt: serverTimestamp(), userAgent: navigator.userAgent };
    console.log('[contact] writing contactSubmissions...');
    await this.withTimeout(
      addDoc(collection(this.firestore, 'contactSubmissions'), data),
      10_000,
      'contactSubmissions write',
    );
    console.log('[contact] writing mail...');
    await this.withTimeout(
      addDoc(collection(this.firestore, 'mail'), {
        to: 'jorge.juarez087@gmail.com',
        message: {
          subject: `Portfolio contact: ${payload.subject}`,
          text: this.buildPlainText(payload),
          html: this.buildHtml(payload),
        },
      }),
      10_000,
      'mail write',
    );
    console.log('[contact] done');
  }

  private extractUrls(text: string): string[] {
    return [...new Set(text.match(URL_RE) ?? [])];
  }

  private buildPlainText(p: ContactSubmission): string {
    const urls = this.extractUrls(p.name + ' ' + p.message);
    const linkSection = urls.length
      ? `\n\n--- Links found ---\n${urls.map((u) => `• ${u}`).join('\n')}`
      : '';
    return `Name: ${p.name}\nEmail: ${p.email}\n\nMessage:\n${p.message}${linkSection}`;
  }

  private buildHtml(p: ContactSubmission): string {
    const urls = this.extractUrls(p.name + ' ' + p.message);
    const escapedMessage = p.message
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(URL_RE, (url) => `<a href="${url}" style="color:#ff3d00;">${url}</a>`)
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

        <!-- Header -->
        <tr>
          <td style="background:#ff3d00;padding:24px 32px;">
            <p style="margin:0;font-family:monospace;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#0a0a0a;opacity:0.7;">jorgezumaya.me</p>
            <h1 style="margin:4px 0 0;font-size:20px;font-weight:700;color:#0a0a0a;letter-spacing:-0.02em;">New Portfolio Contact</h1>
          </td>
        </tr>

        <!-- Meta -->
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

        <!-- Message -->
        <tr>
          <td style="padding:24px 32px 0;">
            <p style="margin:0 0 8px;font-family:monospace;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a8a;">Message</p>
            <div style="background:#1c1c1c;border-left:3px solid #ff3d00;border-radius:0 4px 4px 0;padding:16px 20px;font-size:15px;line-height:1.7;color:#fafafa;">${escapedMessage}</div>
          </td>
        </tr>

        <!-- Links section (only if URLs found) -->
        ${linksSection}

        <!-- Footer -->
        <tr>
          <td style="padding:24px 32px;margin-top:24px;">
            <p style="margin:0;font-family:monospace;font-size:11px;color:#8a8a8a;">Submitted via <a href="https://jorgezumaya.me/contact" style="color:#ff3d00;text-decoration:none;">jorgezumaya.me/contact</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
  }
}
