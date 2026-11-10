import { Resend } from 'resend'

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

let resendInstance: Resend | null = null

function getResend(): Resend | null {
  if (!resendInstance && process.env.RESEND_API_KEY) {
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

/**
 * Universal Email Sender
 * Uses official Resend SDK, Brevo fallback, or server console fallback in dev mode.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailOptions): Promise<SendEmailResult> {
  const plainText = text || html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

  // 1. Official Resend SDK
  const resend = getResend()
  if (resend) {
    try {
      const from = process.env.EMAIL_FROM || 'Lokesh Rohilla Studio <onboarding@resend.dev>'
      const { data, error } = await resend.emails.send({
        from,
        to: [to],
        subject,
        html,
        text: plainText,
      })

      if (!error && data) {
        return { sent: true, provider: 'resend' }
      }

      if (error) {
        console.warn('[EmailService] Resend SDK error:', error)
      }
    } catch (err) {
      console.warn('[EmailService] Resend SDK exception:', err)
    }
  }

  // 2. Brevo (Sendinblue) API fallback
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
