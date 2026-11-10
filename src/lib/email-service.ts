export type SendEmailOptions = {
  to: string
  subject: string
  html: string
  text?: string
}

export type SendEmailResult = {
  sent: boolean
  provider: string
  error?: string
}

/**
 * Universal Email Sender
 * Automatically uses Resend, Brevo, or falls back to server console logging in dev/local mode.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailOptions): Promise<SendEmailResult> {
  const plainText = text || html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

  // 1. Resend API (Zero dependencies, native fetch)
  if (process.env.RESEND_API_KEY) {
    try {
      const from = process.env.EMAIL_FROM || 'Lokesh Rohilla Studio <onboarding@resend.dev>'
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          html,
          text: plainText,
        }),
      })

      if (res.ok) {
        return { sent: true, provider: 'resend' }
      } else {
        const errorText = await res.text()
        console.warn('[EmailService] Resend API error:', errorText)
      }
    } catch (err) {
      console.warn('[EmailService] Resend request failed:', err)
    }
  }

  // 2. Brevo (Sendinblue) API
  if (process.env.BREVO_API_KEY) {
    try {
      const fromEmail = process.env.EMAIL_FROM || 'connect@lokeshrohilla.com'
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Lokesh Rohilla Studio', email: fromEmail },
          to: [{ email: to }],
          subject,
          htmlContent: html,
          textContent: plainText,
        }),
      })

      if (res.ok) {
        return { sent: true, provider: 'brevo' }
      }
    } catch (err) {
      console.warn('[EmailService] Brevo request failed:', err)
    }
  }

  // 3. Fallback / Dev Mode: Always log to server terminal so nobody is ever locked out
  console.log('\n============================================================')
  console.log('[LOKESH ROHILLA CMS — ADMIN EMAIL DISPATCH]')
  console.log(`To: ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`Content:\n${plainText}`)
  console.log('============================================================\n')

  return { sent: false, provider: 'console-log' }
}
