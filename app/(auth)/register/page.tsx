'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { G, BG, BG2, BORDER, BORDER2, TEXT, DIM, MUTE, MONO, HEAD } from '@/lib/tokens'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') || 'customer'

  const [role, setRole] = useState<'customer' | 'craftsman'>(defaultRole as 'customer' | 'craftsman')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      setLoading(false)
      return
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName, company_name: companyName, role, phone }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Ошибка при регистрации')
      setLoading(false)
      return
    }

    router.push('/login?registered=1')
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
          <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 12 }}>§ РЕГИСТРАЦИЯ</div>
          <h1 style={{ fontFamily: HEAD, fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 28px', lineHeight: 1 }}>
            Создать аккаунт
          </h1>

          {/* Role toggle */}
          <div className="grid-2-sm" style={{ gap: 2, background: BORDER, marginBottom: 28 }}>
            {(['customer', 'craftsman'] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  background: role === r ? G : BG,
                  color: role === r ? BG : MUTE,
                  border: 'none',
                  padding: '12px',
                  fontSize: 12,
                  fontWeight: role === r ? 600 : 400,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {r === 'customer' ? 'ЗАКАЗЧИК' : 'МАСТЕР'}
              </button>
            ))}
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>ИМЯ И ФАМИЛИЯ</label>
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Алишер Каримов"
                required
                style={inputStyle}
              />
            </div>

            {role === 'craftsman' && (
              <div>
                <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>НАЗВАНИЕ КОМПАНИИ</label>
                <input
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="ООО «МебельПро»"
                  required
                  style={inputStyle}
                />
              </div>
            )}

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
              <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>ТЕЛЕФОН <span style={{ color: MUTE, fontWeight: 400 }}>(необязательно)</span></label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
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
                  placeholder="Минимум 6 символов"
                  required
                  minLength={6}
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

            <div>
              <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>ПОДТВЕРДИТЕ ПАРОЛЬ</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
                required
                style={{ ...inputStyle, borderColor: confirmPassword && confirmPassword !== password ? 'rgba(248,113,113,0.6)' : undefined }}
              />
              {confirmPassword && confirmPassword !== password && (
                <div style={{ fontSize: 11, color: 'rgba(248,113,113,0.8)', marginTop: 6 }}>Пароли не совпадают</div>
              )}
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
              {loading ? 'Создаём аккаунт…' : 'Зарегистрироваться →'}
            </button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${BORDER}`, textAlign: 'center', fontSize: 13 }}>
            <span style={{ color: MUTE }}>Уже есть аккаунт? </span>
            <Link href="/login" style={{ color: G, textDecoration: 'none' }}>Войти →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
