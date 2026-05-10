'use client'

import { useState } from 'react'
import Link from 'next/link'
import { G, BG, BG2, BORDER, BORDER2, TEXT, DIM, MUTE, MONO, HEAD, SUCCESS } from '@/lib/tokens'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [sentMethod, setSentMethod] = useState<'telegram' | 'email'>('email')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Ошибка')
      return
    }

    setSentMethod(data.method ?? 'email')
    setSent(true)
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: TEXT, marginBottom: 48, justifyContent: 'center' }}>
          <span style={{ color: G, fontSize: 14 }}>◆</span>
          <span style={{ fontSize: 13, letterSpacing: '0.18em', fontWeight: 500 }}>MEBELHUB</span>
        </Link>

        <div style={{ border: `1px solid ${BORDER2}`, padding: '40px 36px', background: BG2 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 12 }}>§ СБРОС ПАРОЛЯ</div>
          <h1 style={{ fontFamily: HEAD, fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 28px', lineHeight: 1 }}>
            Забыли пароль?
          </h1>

          {sent ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: '16px 18px', border: `1px solid rgba(74,222,128,0.3)`, background: 'rgba(74,222,128,0.06)', fontSize: 14, color: SUCCESS, lineHeight: 1.6 }}>
                {sentMethod === 'telegram'
                  ? '✓ Ссылка для сброса пароля отправлена в ваш Telegram!'
                  : '✓ Ссылка для сброса пароля отправлена на ваш email!'}
              </div>
              <p style={{ fontSize: 13, color: MUTE, lineHeight: 1.6, margin: 0 }}>
                {sentMethod === 'telegram'
                  ? 'Откройте Telegram и перейдите по ссылке. Ссылка действует 1 час.'
                  : 'Проверьте почту (и папку «Спам»). Ссылка действует 1 час.'}
              </p>
              <Link href="/login" style={{ fontSize: 13, color: G, textDecoration: 'none' }}>← Вернуться ко входу</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ fontSize: 13, color: DIM, lineHeight: 1.6, margin: 0 }}>
                Введите ваш email — отправим ссылку для сброса пароля в Telegram или на почту.
              </p>
              <div>
                <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{ width: '100%', background: BG, border: `1px solid ${BORDER2}`, color: TEXT, padding: '14px 16px', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const, borderRadius: 2 }}
                />
              </div>
              {error && (
                <div style={{ padding: '12px 14px', border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.06)', fontSize: 13, color: 'rgba(248,113,113,0.9)' }}>
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{ background: loading ? BG : G, color: loading ? MUTE : BG, border: 'none', padding: '16px', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', cursor: loading ? 'default' : 'pointer', borderRadius: 2, fontFamily: 'inherit' }}
              >
                {loading ? 'Отправляем…' : 'Отправить ссылку →'}
              </button>
            </form>
          )}

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${BORDER}`, textAlign: 'center', fontSize: 13 }}>
            <Link href="/login" style={{ color: G, textDecoration: 'none' }}>← Вернуться ко входу</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
