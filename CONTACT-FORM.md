# Contact form — how it works and the one thing to set

The contact form posts to `api/contact.js`, a Vercel serverless function that
e-mails the enquiry straight to Innoledge through [Resend](https://resend.com).
There is no third-party form service in the path — no Formspree, no Ninja Forms,
no WordPress.

Pages using it: `contact-us/` (English) and `fr/contactez-nous/` (French).

## Required before it can send

Set **one** environment variable in Vercel → Project `innoledge-com` → Settings →
Environment Variables (add it to Production *and* Preview):

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | An API key from resend.com → API Keys |

Until that key exists the form accepts input, then reports "your message could not
be sent" and shows the fallback address and phone number. Nothing is lost
silently, and the reason is written to the function log.

### Also worth setting

| Variable | Default if unset | Why you might set it |
| --- | --- | --- |
| `MAIL_FROM` | `website@innoledge.com` | Must be on a domain **verified in Resend**, otherwise Resend rejects the send. Verify `innoledge.com` there, or point this at a domain you have verified. |
| `MAIL_TO` | `info@innoledge.com` | Only if enquiries should go somewhere else. |
| `ALLOWED_ORIGINS` | — | Extra origins allowed to post, comma-separated. `innoledge.com`, `www.innoledge.com` and `*.vercel.app` are always allowed. |

## What the function does

- Accepts `POST` only; anything else gets 405.
- Rejects submissions whose `Origin` is not Innoledge or a Vercel preview (403).
- Requires name, a syntactically valid e-mail, and a message. Phone, location and
  type of service are optional.
- Truncates over-long input rather than rejecting it, so a long enquiry still arrives.
- Strips control characters, and collapses line breaks in every single-line field —
  line breaks there are the classic mail-header injection vector. The message body
  keeps its line breaks.
- Escapes HTML in the message before putting it in the HTML part of the mail.
- Sets `Reply-To` to the enquirer, so replying from the mailbox goes to them.
- Has a hidden honeypot field; a bot that fills it gets a normal-looking success
  page and nothing is sent.

## Without JavaScript

The form is a plain `POST` and works with JavaScript disabled — the function
replies with its own small confirmation page, and the "back" link returns to
whichever language page the visitor came from. With JavaScript on, submission
happens in place and the result appears under the button.

## Testing it locally

`api/contact.js` is dependency-free (it uses the built-in `fetch`), so there is
nothing to install. To exercise it without sending real mail, stub `global.fetch`
and call the exported handler directly with a fake request and response — the
handler is an ordinary `(req, res)` function.
