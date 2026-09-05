// Vercel serverless function: receives the website contact form and e-mails it
// to Innoledge via Resend. No third-party form service is involved — the message
// goes straight from this function to the Innoledge mailbox.
//
// Environment variables (Vercel -> Project -> Settings -> Environment Variables):
//   RESEND_API_KEY  required. From https://resend.com -> API Keys.
//   MAIL_TO         destination.  default: info@innoledge.com
//   MAIL_FROM       sender. default: website@innoledge.com
//                   The domain here must be verified in Resend, otherwise Resend
//                   rejects the send and the form reports a delivery failure.
//   ALLOWED_ORIGINS optional extra comma-separated origins. innoledge.com,
//                   www.innoledge.com and *.vercel.app are always allowed.
//
// Deliberately dependency-free: Node 18+ has global fetch, so main stays a plain
// static deploy with one function and no install step.

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const DEFAULT_TO = 'info@innoledge.com';
const DEFAULT_FROM = 'website@innoledge.com';

// Field name -> max accepted length. Anything longer is truncated, not rejected,
// so a long message never silently loses the whole enquiry.
const LIMITS = {
  name: 200,
  email: 200,
  phone: 60,
  location: 200,
  service: 100,
  message: 5000,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Control characters have no business in a form field. This class keeps tab and
// newline, which are legitimate inside the message body.
const CONTROL_RE = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g;
// Every field except the message is single-line. Line breaks there are the
// classic header-injection vector, so they collapse to a space rather than
// being dropped, which keeps the text readable.
const LINEBREAK_RE = /[\r\n\t]+/g;

function readBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 64 * 1024) {
        reject(new Error('payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        const type = (req.headers['content-type'] || '').toLowerCase();
        if (type.includes('application/json')) return resolve(JSON.parse(raw || '{}'));
        const parsed = {};
        for (const [key, value] of new URLSearchParams(raw)) parsed[key] = value;
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function clean(value, max, multiline) {
  let out = String(value == null ? '' : value).replace(CONTROL_RE, '');
  if (!multiline) out = out.replace(LINEBREAK_RE, ' ');
  return out.trim().slice(0, max);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function originAllowed(req) {
  const origin = req.headers.origin || '';
  if (!origin) return true; // a classic form POST may omit Origin entirely
  const extra = (process.env.ALLOWED_ORIGINS || '')
    .split(',').map((s) => s.trim()).filter(Boolean);
  if (['https://innoledge.com', 'https://www.innoledge.com', ...extra].includes(origin)) return true;
  return /^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*\.vercel\.app$/i.test(origin);
}

// Where the confirmation page's "back" link should point. A no-JS visitor who
// submitted the French form should return to the French page, so prefer the
// referring path when it is same-site, and fall back to the English page.
function backLink(req) {
  const fallback = '/contact-us/';
  const referer = req.headers.referer || '';
  if (!referer) return fallback;
  try {
    const url = new URL(referer);
    if (!/(^|\.)innoledge\.com$/i.test(url.hostname) && !/\.vercel\.app$/i.test(url.hostname)) {
      return fallback;
    }
    return url.pathname.startsWith('/') ? url.pathname : fallback;
  } catch {
    return fallback;
  }
}

// Replies are written with the core Node response API only — res.statusCode,
// res.setHeader and res.end. Vercel's Express-style res.status()/.json()/.send()
// helpers exist only when @vercel/node wraps the request, so depending on them
// makes the handler untestable outside Vercel and leaves the response's
// Content-Type up to the wrapper's type inference. Setting it explicitly is one
// less thing to be wrong.
function reply(res, status, contentType, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', contentType);
  res.end(body);
}

function replyJson(res, status, payload) {
  reply(res, status, 'application/json; charset=utf-8', JSON.stringify(payload));
}

function replyHtml(res, status, html) {
  reply(res, status, 'text/html; charset=utf-8', html);
}

// The form works without JavaScript, so replies come in two shapes: JSON for the
// enhanced submit, a small HTML page for a plain POST.
function wantsJson(req) {
  const accept = (req.headers.accept || '').toLowerCase();
  return accept.includes('application/json') || req.headers['x-requested-with'] === 'fetch';
}

function page({ title, heading, body, back }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)} – Innoledge International</title>
<meta name="robots" content="noindex">
<style>
 body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
      color:#2b2f36;background:#f6f7f9;margin:0;min-height:100vh;display:grid;place-items:center}
 main{background:#fff;border-radius:14px;padding:2.4rem 2.2rem;max-width:34rem;margin:1.5rem;
      box-shadow:0 8px 28px rgba(20,24,32,.08);text-align:center}
 h1{color:#d5682d;font-size:1.6rem;margin:0 0 .8rem}
 p{line-height:1.65;margin:0 0 1rem}
 a.btn{display:inline-block;margin-top:.6rem;background:#d5682d;color:#fff;text-decoration:none;
       padding:.75rem 1.4rem;border-radius:999px;font-weight:600}
</style></head><body><main>
<h1>${escapeHtml(heading)}</h1>
<p>${body}</p>
<a class="btn" href="${escapeHtml(back)}">Back to the website</a>
</main></body></html>`;
}

async function sendViaResend({ to, from, replyTo, subject, text, html }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: replyTo || undefined,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    // Resend puts the reason in the body; surface it to the logs, never to the visitor.
    const detail = await response.text().catch(() => '');
    throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 500)}`);
  }
  return response.json().catch(() => ({}));
}

module.exports = async (req, res) => {
  const back = backLink(req);

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return replyJson(res, 405, { ok: false, error: 'Method not allowed' });
  }
  if (!originAllowed(req)) {
    return replyJson(res, 403, { ok: false, error: 'Forbidden' });
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    return replyJson(res, 400, { ok: false, error: 'Could not read the submitted form.' });
  }

  // Honeypot: a real person never fills a hidden field. Answer as if it worked so
  // a bot gets no signal about why nothing happened.
  if (clean(body.website, 200)) {
    return wantsJson(req)
      ? replyJson(res, 200, { ok: true })
      : replyHtml(res, 200, page({
          title: 'Thank you', heading: 'Thank you',
          body: 'Your message has been sent.', back,
        }));
  }

  const fields = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    fields[key] = clean(body[key], max, key === 'message');
  }

  const problems = [];
  if (!fields.name) problems.push('your name');
  if (!fields.email) problems.push('your e-mail address');
  else if (!EMAIL_RE.test(fields.email)) problems.push('a valid e-mail address');
  if (!fields.message) problems.push('a message');

  if (problems.length) {
    const msg = `Please provide ${problems.join(', ')}.`;
    return wantsJson(req)
      ? replyJson(res, 400, { ok: false, error: msg })
      : replyHtml(res, 400, page({ title: 'Check the form', heading: 'Something is missing', body: escapeHtml(msg), back }));
  }

  const to = process.env.MAIL_TO || DEFAULT_TO;
  const from = process.env.MAIL_FROM || DEFAULT_FROM;

  const rows = [
    ['Name', fields.name],
    ['E-mail', fields.email],
    ['Phone', fields.phone],
    ['Location', fields.location],
    ['Type of service', fields.service],
  ].filter(([, value]) => value);

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Message:',
    fields.message,
    '',
    '— Sent from the innoledge.com contact form',
  ].join('\n');

  const html = `<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
${rows.map(([label, value]) => `<tr><td style="padding:4px 12px 4px 0;color:#5f6672">${escapeHtml(label)}</td><td style="padding:4px 0"><strong>${escapeHtml(value)}</strong></td></tr>`).join('\n')}
</table>
<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(fields.message)}</p>
<p style="font-family:sans-serif;font-size:12px;color:#5f6672">Sent from the innoledge.com contact form</p>`;

  try {
    await sendViaResend({
      to,
      from,
      replyTo: `${fields.name} <${fields.email}>`,
      subject: `Website enquiry from ${fields.name}${fields.service ? ` — ${fields.service}` : ''}`,
      text,
      html,
    });
  } catch (err) {
    console.error('contact form send failed:', err && err.message);
    const msg = 'Sorry, your message could not be sent. Please e-mail info@innoledge.com or call +852 2803 7784.';
    return wantsJson(req)
      ? replyJson(res, 502, { ok: false, error: msg })
      : replyHtml(res, 502, page({ title: 'Not sent', heading: 'Your message was not sent', body: escapeHtml(msg), back }));
  }

  return wantsJson(req)
    ? replyJson(res, 200, { ok: true })
    : replyHtml(res, 200, page({
        title: 'Thank you',
        heading: 'Thank you',
        body: 'Your message has been sent to Innoledge. We will be in touch shortly.',
        back,
      }));
};
