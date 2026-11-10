'use client'

import React, { useState, useEffect, useRef } from 'react'

export function AdminOtpLogin() {
  const [mode, setMode] = useState<'code' | 'password'>('code')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [devCode, setDevCode] = useState<string | null>(null)
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  const codeInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  useEffect(() => {
    if (step === 'code') {
      setTimeout(() => codeInputRef.current?.focus(), 100)
    }
  }, [step])

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)
    setDevCode(null)
    setErrorDetail(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin-otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification code.')
      }

      setStep('code')
      setCountdown(45)
      setSuccessMsg(data.message || `We sent a 6-digit login code to ${trimmedEmail}`)

      if (data.devCode) {
        setDevCode(data.devCode)
      }
      if (data.errorDetail) {
        setErrorDetail(data.errorDetail)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send code.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const cleanCode = code.trim().replace(/\s+/g, '')
    if (!cleanCode || cleanCode.length !== 6) {
      setError('Please enter the full 6-digit verification code.')
      return
    }

    setLoading(true)
    try {
      const searchParams = new URLSearchParams(window.location.search)
      const redirect = searchParams.get('redirect') || '/admin'

      const res = await fetch('/api/admin-otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, redirect }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Invalid code. Please try again.')
      }

      setSuccessMsg('Code verified! Loading your dashboard...')
      window.location.href = data.redirect || redirect || '/admin'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed.')
      setLoading(false)
    }
  }

  return (
    <div className="lr-otp-card">
      {/* Brand Badge */}
      <div className="lr-otp-badge-row">
        <div className="lr-otp-logo-square">LR</div>
        <div>
          <div className="lr-otp-brand-title">Lokesh Rohilla Studio</div>
          <div className="lr-otp-brand-sub">Secure Administrative Access</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="lr-otp-tabs">
        <button
          type="button"
          onClick={() => {
            setMode('code')
            setError(null)
          }}
          className={`lr-otp-tab ${mode === 'code' ? 'lr-otp-tab-active' : ''}`}
        >
          ✉️ Email Code (OTP)
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('password')
            setError(null)
          }}
          className={`lr-otp-tab ${mode === 'password' ? 'lr-otp-tab-active' : ''}`}
        >
          🔑 Password Login
        </button>
      </div>

      {mode === 'code' ? (
        <div className="lr-otp-body">
          {error && <div className="lr-otp-alert lr-otp-alert-error">{error}</div>}
          {successMsg && <div className="lr-otp-alert lr-otp-alert-success">{successMsg}</div>}

          {devCode && (
            <div className="lr-otp-alert lr-otp-alert-info">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700 }}>⚡ Instant Access Code:</span>
                <button
                  type="button"
                  onClick={() => setCode(devCode)}
                  style={{
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '6px',
                    border: '1px solid #93c5fd',
                    background: '#ffffff',
                    color: '#1d4ed8',
                    cursor: 'pointer',
                  }}
                >
                  Auto-fill Code
                </button>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '4px', color: '#1e40af', margin: '4px 0' }}>
                {devCode}
              </div>
              {errorDetail ? (
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px', lineHeight: 1.4 }}>
                  ℹ️ {errorDetail}
                </div>
              ) : null}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendCode} className="lr-otp-form">
              <label htmlFor="otp-email" className="lr-otp-label">
                Admin Email Address
              </label>
              <div className="lr-otp-input-wrap">
                <input
                  id="otp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@lokeshrohilla.com or bajracreative.np@gmail.com"
                  required
                  autoFocus
                  className="lr-otp-input"
                />
              </div>
              <p className="lr-otp-hint">
                Tip: Resend testing domain delivers to <strong>bajracreative.np@gmail.com</strong> (or use admin@lokeshrohilla.com with on-screen code).
              </p>

              <button type="submit" disabled={loading} className="lr-otp-btn-primary">
                {loading ? 'Sending Code...' : 'Send Login Code →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="lr-otp-form">
              <div className="lr-otp-email-badge">
                <span>Code for: <strong>{email}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setStep('email')
                    setCode('')
                    setError(null)
                    setDevCode(null)
                    setErrorDetail(null)
                  }}
                  className="lr-otp-link-btn"
                >
                  Change
                </button>
              </div>

              <label htmlFor="otp-code" className="lr-otp-label">
                Enter 6-Digit Verification Code
              </label>
              <input
                ref={codeInputRef}
                id="otp-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '')
                  setCode(val)
                  if (val.length === 6) {
                    setError(null)
                  }
                }}
                placeholder="••••••"
                required
                className="lr-otp-input-code"
              />

              <button type="submit" disabled={loading || code.length !== 6} className="lr-otp-btn-primary">
                {loading ? 'Verifying...' : 'Verify & Log In →'}
              </button>

              <div className="lr-otp-resend-row">
                {countdown > 0 ? (
                  <span className="lr-otp-timer">Resend available in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={loading}
                    className="lr-otp-link-btn"
                  >
                    Didn&apos;t receive it? Resend code
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="lr-otp-password-note">
          <p>
            Please use the standard email and password form below to log in directly.
          </p>
        </div>
      )}
    </div>
  )
}

export default AdminOtpLogin
