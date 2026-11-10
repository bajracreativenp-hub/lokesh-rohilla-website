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
      const from = process.env.EMAIL_FROM || 'Lokesh Rohilla Studio <login@lokeshrohilla.com>'
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
        console.warn('[EmailService] Resend SDK error for', to, ':', error)
        // If Resend failed (e.g. sandbox restriction: can only send to account owner email),
        // try sending a copy to the testing account email if different
        if (
          error.message?.includes('You can only send testing emails to your own email address') &&
          !to.includes('bajracreative.np@gmail.com')
        ) {
          try {
            const fallbackRes = await resend.emails.send({
              from,
              to: ['bajracreative.np@gmail.com'],
              subject: `[Admin OTP for ${to}] ${subject}`,
              html: `<p><strong>Admin Login Code for ${to}:</strong></p>` + html,
              text: `Admin Login Code for ${to}:\n` + plainText,
            })
            if (!fallbackRes.error && fallbackRes.data) {
              return {
                sent: true,
                provider: 'resend-sandbox-fallback',
                error: `Resend sandbox sent code to your Resend account email (bajracreative.np@gmail.com) because ${to} domain is not verified.`,
              }
            }
          } catch (fbErr) {
            console.warn('[EmailService] Resend fallback attempt failed:', fbErr)
          }
        }

        return {
          sent: false,
          provider: 'resend',
          error: error.message || 'Resend error',
        }
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err)
      console.warn('[EmailService] Resend SDK exception:', errMsg)
      return { sent: false, provider: 'resend', error: errMsg }
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
