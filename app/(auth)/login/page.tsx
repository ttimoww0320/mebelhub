'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { G, BG, BG2, BORDER, BORDER2, TEXT, DIM, MUTE, MONO, HEAD } from '@/lib/tokens'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const justRegistered = searchParams.get('registered') === '1'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Неверный email или пароль')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (data.user.email === 'toirovtimurmalik@gmail.com') {
      router.push('/admin')
    } else if (profile?.role === 'craftsman') {
      router.push('/dashboard')
    } else {
      router.push('/orders')
    }
  }

  const inputStyle = {
    width: '100%',
    background: BG2,
    border: `1px solid ${BORDER2}`,
    color: TEXT,
    padding: '14px 16px',
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
    borderRadius: 2,
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: TEXT, marginBottom: 48, justifyContent: 'center' }}>
          <span style={{ color: G, fontSize: 14 }}>◆</span>
          <span style={{ fontSize: 13, letterSpacing: '0.18em', fontWeight: 500 }}>MEBELHUB</span>
        </Link>

        <div style={{ border: `1px solid ${BORDER2}`, padding: '40px 36px', background: BG2 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 12 }}>§ ВХОД</div>
          <h1 style={{ fontFamily: HEAD, fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 32px', lineHeight: 1 }}>
            Войти в аккаунт
          </h1>

          {justRegistered && (
            <div style={{ marginBottom: 24, padding: '14px 16px', border: `1px solid rgba(74,222,128,0.3)`, background: 'rgba(74,222,128,0.06)', fontSize: 13, color: '#4ade80', lineHeight: 1.5 }}>
              Аккаунт создан! Войдите с вашим email и паролем.
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>ПАРОЛЬ</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{ ...inputStyle, paddingRight: 80 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: MUTE, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.08em' }}
                >
                  {showPassword ? 'СКРЫТЬ' : 'ПОКАЗАТЬ'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '12px 14px', border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.06)', fontSize: 13, color: 'rgba(248,113,113,0.9)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ background: loading ? BG : G, color: loading ? MUTE : BG, border: 'none', padding: '16px', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', cursor: loading ? 'default' : 'pointer', borderRadius: 2, fontFamily: 'inherit', marginTop: 4 }}
            >
              {loading ? 'Входим…' : 'Войти →'}
            </button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <Link href="/forgot-password" style={{ color: MUTE, textDecoration: 'none' }}>Забыли пароль?</Link>
            <Link href="/register" style={{ color: G, textDecoration: 'none' }}>Нет аккаунта →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
