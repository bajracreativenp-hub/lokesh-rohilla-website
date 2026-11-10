import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { SignJWT } from 'jose'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const code = typeof body.code === 'string' ? body.code.trim() : ''

    if (!code || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Please enter a valid 6-digit numeric verification code.' },
        { status: 400 }
      )
    }

    const cookieHeader = request.headers.get('cookie') || ''
    const cookies = Object.fromEntries(
      cookieHeader
        .split(';')
        .map((c) => c.trim().split('='))
        .filter(([k, v]) => k && v)
        .map(([k, v]) => [k, decodeURIComponent(v)])
    )

    const sessionToken = cookies['admin_otp_session']
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Verification session expired. Please request a new code.' },
        { status: 400 }
      )
    }

    const secret = process.env.PAYLOAD_SECRET || 'super-secret-lokesh-rohilla-payload-key-change-in-production'

    // Decode session
    let sessionPayloadRaw: string
    let signature: string
    try {
      const decoded = Buffer.from(sessionToken, 'base64url').toString('utf-8')
      const dotIndex = decoded.lastIndexOf('.')
      if (dotIndex === -1) throw new Error('Invalid token format')
      sessionPayloadRaw = decoded.slice(0, dotIndex)
      signature = decoded.slice(dotIndex + 1)
    } catch {
      return NextResponse.json(
        { error: 'Invalid verification session. Please request a new code.' },
        { status: 400 }
      )
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(sessionPayloadRaw)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: 'Invalid verification session signature. Please request a new code.' },
        { status: 400 }
      )
    }

    const session = JSON.parse(sessionPayloadRaw) as {
      email: string
      codeHash: string
      exp: number
      attempts: number
    }

    // Check expiration
    if (Date.now() > session.exp) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new code.' },
        { status: 400 }
      )
    }

    // Check brute-force attempts
    if (session.attempts >= 5) {
      return NextResponse.json(
        { error: 'Too many incorrect attempts. Please request a new code.' },
        { status: 429 }
      )
    }

    // Verify code hash
    const inputHash = crypto
      .createHmac('sha256', secret)
      .update(`${session.email}:${code}`)
      .digest('hex')

    if (inputHash !== session.codeHash) {
      // Increment attempts and update cookie
      const updatedPayload = JSON.stringify({
        ...session,
        attempts: session.attempts + 1,
      })
      const updatedSig = crypto.createHmac('sha256', secret).update(updatedPayload).digest('hex')
      const updatedToken = Buffer.from(`${updatedPayload}.${updatedSig}`).toString('base64url')

      const res = NextResponse.json(
        { error: `Invalid verification code. (${4 - session.attempts} attempts remaining)` },
        { status: 400 }
      )
      res.cookies.set({
        name: 'admin_otp_session',
        value: updatedToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 600,
      })
      return res
    }

    // Code is valid! Find user in Payload
    const payload = await getPayload({ config: configPromise })
    const usersResult = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: session.email,
        },
      },
      limit: 1,
    })

    const user = usersResult.docs[0] as unknown as {
      id: string | number
      email: string
      name?: string
      role?: string
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User account not found.' },
        { status: 404 }
      )
    }

    // Generate Payload CMS JWT with matching payload.secret and authVersion: 1
    const signingSecret = payload.secret || secret
    const secretKey = new TextEncoder().encode(signingSecret)
    const issuedAt = Math.floor(Date.now() / 1000)
    const exp = issuedAt + 7 * 24 * 3600 // 7 days session
    const sid = crypto.randomUUID()

    const payloadToken = await new SignJWT({
      id: user.id,
      collection: 'users',
      email: user.email,
      name: user.name,
      role: user.role,
      sid,
    })
      .setProtectedHeader({
        alg: 'HS256',
        authVersion: 1,
        typ: 'JWT',
      })
      .setIssuedAt(issuedAt)
      .setExpirationTime(exp)
      .sign(secretKey)

    const redirectUrl =
      body.redirect && typeof body.redirect === 'string' && body.redirect.startsWith('/admin')
        ? body.redirect
        : '/admin'

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful! Redirecting to studio...',
      redirect: redirectUrl,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })

    const cookieName = `${payload.config.cookiePrefix || 'payload'}-token`

    // Set Payload authentication cookie
    response.cookies.set({
      name: cookieName,
      value: payloadToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 3600,
    })

    if (cookieName !== 'payload-token') {
      response.cookies.set({
        name: 'payload-token',
        value: payloadToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 3600,
      })
    }

    // Clear the OTP session cookie
    response.cookies.set({
      name: 'admin_otp_session',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error('[Admin OTP Verify] Error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred during verification.' },
      { status: 500 }
    )
  }
}
