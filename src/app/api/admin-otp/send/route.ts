import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { sendEmail } from '@/lib/email-service'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.toLowerCase().trim() : ''

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })
    const secret = process.env.PAYLOAD_SECRET || 'super-secret-lokesh-rohilla-payload-key-change-in-production'

    // Verify user exists in Payload users collection
    const usersResult = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    let existingUser = usersResult.docs[0]

    // If user does not exist yet, allow known admin/owner emails to register automatically
    if (!existingUser && (email === 'bajracreative.np@gmail.com' || email === 'connect@lokeshrohilla.com')) {
      try {
        existingUser = await payload.create({
          collection: 'users',
          data: {
            email,
            password: crypto.randomBytes(16).toString('hex'),
            name: email.includes('bajra') ? 'Bajra Creative' : 'Lokesh Rohilla',
            role: 'admin',
          },
        })
      } catch (createErr) {
        console.warn('Could not auto-create admin user:', createErr)
      }
    }

    if (!existingUser) {
      return NextResponse.json(
        { error: `No admin account found for "${email}". Please enter your registered email address.` },
        { status: 404 }
      )
    }

    // Generate random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Compute secure HMAC hash: code + email + secret
    const codeHash = crypto
      .createHmac('sha256', secret)
      .update(`${email}:${code}`)
      .digest('hex')

    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Signed session payload
    const sessionPayload = JSON.stringify({
      email,
      codeHash,
      exp: expiresAt,
      attempts: 0,
      iat: Date.now(),
    })

    const sessionSignature = crypto
      .createHmac('sha256', secret)
      .update(sessionPayload)
      .digest('hex')

    const sessionToken = Buffer.from(`${sessionPayload}.${sessionSignature}`).toString('base64url')

    // Email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fd; margin: 0; padding: 32px 16px; color: #0b1730; }
          .container { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px 32px; box-shadow: 0 4px 12px rgba(11,23,48,0.04); }
          .logo { display: inline-block; font-size: 14px; font-weight: 800; color: #1e5ae6; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 20px; }
          h1 { font-size: 22px; font-weight: 800; color: #0b1730; margin: 0 0 12px 0; letter-spacing: -0.02em; }
          p { font-size: 14px; line-height: 1.6; color: #5d6679; margin: 0 0 20px 0; }
          .code-box { background: #eef2fa; border: 1.5px solid #bfdbfe; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
          .code { font-family: ui-monospace, Menlo, Monaco, Consolas, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #1e5ae6; }
          .expiry { font-size: 12px; font-weight: 600; color: #8c96ab; margin-top: 10px; }
          .footer { font-size: 12px; color: #8c96ab; border-top: 1px solid #eef2fa; padding-top: 20px; margin-top: 28px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Lokesh Rohilla • Admin Access</div>
          <h1>Your Login Verification Code</h1>
          <p>Hello ${(existingUser as { name?: string }).name || 'there'},</p>
          <p>Enter the 6-digit verification code below to securely log in to your Lokesh Rohilla Studio dashboard:</p>
          <div class="code-box">
            <div class="code">${code}</div>
            <div class="expiry">Valid for 10 minutes (single-use)</div>
          </div>
          <p>If you did not request this login code, you can safely ignore this email.</p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Lokesh Rohilla Studio. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `

    const { sent, provider, error: emailError } = await sendEmail({
      to: email,
      subject: `${code} is your Lokesh Rohilla Admin Login Code`,
      html: emailHtml,
      text: `Your Lokesh Rohilla admin verification code is: ${code}. Valid for 10 minutes.`,
    })

    const response = NextResponse.json({
      success: true,
      message: sent
        ? `Verification code sent to ${email}!`
        : `Code generated! (Resend Sandbox note: verification domain pending).`,
      email,
      // If email was rejected by Resend due to unverified domain or sandbox limitation,
      // show devCode directly so you are NEVER blocked!
      devCode: sent ? undefined : code,
      errorDetail: emailError || undefined,
      provider,
    })

    // Set signed session cookie
    response.cookies.set({
      name: 'admin_otp_session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 600, // 10 minutes
    })

    return response
  } catch (error) {
    console.error('[Admin OTP Send] Error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred while sending verification code.' },
      { status: 500 }
    )
  }
}
