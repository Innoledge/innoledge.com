// Vercel serverless function: receives the website contact / Rafaelo® enquiry forms
// and e-mails them to Innoledge. No third-party form service involved.
//
// Environment variables (Vercel project settings):
//   MAIL_TO         destination address                       default: info@innoledge.com
//   MAIL_FROM       sender address accepted by the mail provider, e.g. website@innoledge.com
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS   SMTP account used to send (Innoledge mailbox)
//   RESEND_API_KEY  optional alternative to SMTP (https://resend.com); used when SMTP_HOST is empty
//   ALLOWED_ORIGINS optional comma-separated extra Origin values (innoledge.com and *.vercel.app are always allowed)

const nodemailer = require('nodemailer');

const MAX_LEN = { name: 200, email: 200, phone: 60, company: 200, message: 5000, subject: 200, topic: 100 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL_RE = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g;

function parseBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > 64 * 1024) { reject(new Error('payload too large')); req.destroy(); } });
    req.on('end', () => {
      try {
        const ct = (req.headers['content-type'] || '').toLowerCase();
        if (ct.includes('application/json')) return resolve(JSON.parse(raw || '{}'));
        const out = {};
        for (const [k, v] of new URLSearchParams(raw)) out[k] = v;
        resolve(out);
      } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function clean(v, max) {
  return String(v == null ? '' : v).replace(CONTROL_RE, '').trim().slice(0, max);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function safeNext(next, fallback) {
  // Only same-site relative paths are accepted as redirect targets.
  if (typeof next === 'string' && /^\/(?!\/)[A-Za-z0-9\-._~/%?#=&]*$/.test(next)) return next;
  return fallback;
}

function originAllowed(req) {
  const origin = req.headers.origin || '';
  if (!origin) return true; // classic form posts may omit Origin
  const extra = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (['https://innoledge.com', 'https://www.innoledge.com', ...extra].includes(origin)) return true;
  return /^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*\.vercel\.app$/i.test(origin);
}

async function send({ to, from, replyTo, subject, text, html }) {
  if (process.env.SMTP_HOST) {
    const port = Number(process.env.SMTP_PORT || 587);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    await transport.sendMail({ to, from, replyTo, subject, text, html });
    return 'smtp';
  }
  if (process.env.RESEND_API_KEY) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: [to], from, reply_to: replyTo, subject, text, html }),
    });
    if (!r.ok) throw new Error(`Resend error ${r.status}: ${await r.text()}`);
    return 'resend';
  }
  throw new Error('No mail transport configured (set SMTP_HOST/SMTP_USER/SMTP_PASS or RESEND_API_KEY)');
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }
  if (!originAllowed(req)) return res.status(403).send('Forbidden');

  let body;
  try { body = await parseBody(req); } catch (e) { return res.status(400).send('Bad Request'); }

  const wantsJson = (req.headers.accept || '').includes('application/json');
  const fail = (status, msg) => (wantsJson ? res.status(status).json({ ok: false, error: msg }) : res.status(status).send(msg));
  const next = safeNext(body.next, '/contact-us/thank-you/');

  // Honeypot: real users never fill this hidden field. Pretend success.
  if (clean(body._honey, 500)) { res.statusCode = 303; res.setHeader('Location', next); return res.end(); }

  const name = clean(body.name, MAX_LEN.name);
  const email = clean(body.email, MAX_LEN.email);
  const phone = clean(body.phone, MAX_LEN.phone);
  const company = clean(body.company, MAX_LEN.company);
  const message = clean(body.message, MAX_LEN.message);
  const topic = clean(body.topic, MAX_LEN.topic);
  const subjectIn = clean(body.subject, MAX_LEN.subject).replace(/[\r\n]+/g, ' ');
  const consent = body.consent === 'yes' || body.consent === 'on' || body.consent === true;

  if (!name || !email || !message) return fail(400, 'Name, e-mail and message are required.');
  if (!EMAIL_RE.test(email)) return fail(400, 'Please enter a valid e-mail address.');
  if (!consent) return fail(400, 'Consent is required.');

  const to = process.env.MAIL_TO || 'info@innoledge.com';
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || 'website@innoledge.com';
  const subject = subjectIn || 'Website enquiry – innoledge.com';
  const page = clean(req.headers.referer || '', 500);
  const rows = [['Name', name], ['E-mail', email], ['Phone', phone], ['Company', company], ['Topic', topic], ['Page', page]].filter(([, v]) => v);
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + '\n\nMessage:\n' + message;
  const html = '<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">' +
    rows.map(([k, v]) => `<tr><th align="left">${k}</th><td>${escapeHtml(v)}</td></tr>`).join('') +
    `<tr><th align="left" valign="top">Message</th><td>${escapeHtml(message).replace(/\n/g, '<br>')}</td></tr></table>`;

  try {
    await send({ to, from, replyTo: `"${name.replace(/["<>]/g, '')}" <${email}>`, subject, text, html });
  } catch (e) {
    console.error('contact form: mail send failed:', e.message);
    return fail(502, 'Sorry, your message could not be sent. Please e-mail info@innoledge.com or call +852 2803 7784.');
  }

  if (wantsJson) return res.status(200).json({ ok: true });
  res.statusCode = 303;
  res.setHeader('Location', next);
  return res.end();
};
