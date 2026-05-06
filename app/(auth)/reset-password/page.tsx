'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { G, BG, BG2, BORDER, BORDER2, TEXT, DIM, MUTE, MONO, HEAD, SUCCESS } from '@/lib/tokens'

function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)

    const urlError = params.get('error')
    if (urlError) {
      setError('Ссылка недействительна или истекла. Запросите новую.')
      setReady(true)
      return
    }

    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const type = params.get('type')

    if (accessToken && refreshToken && type === 'recovery') {
      const supabase = createClient()
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ error: sessionError }) => {
          if (sessionError) {
            setError('Не удалось применить ссылку. Запросите новую.')
          }
          setReady(true)
        })
    } else {
      setError('Ссылка недействительна. Запросите новую.')
      setReady(true)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Пароли не совпадают')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (updateError) {
      setError(updateError.message)
      return
    }
    setDone(true)
    setTimeout(() => router.push('/login'), 2000)
  }

  const inputStyle = {
    width: '100%',
    background: BG,
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
          <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 12 }}>§ НОВЫЙ ПАРОЛЬ</div>
          <h1 style={{ fontFamily: HEAD, fontSize: 36, fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 28px', lineHeight: 1 }}>
            Задать пароль
          </h1>

          {done ? (
            <div style={{ padding: '16px 18px', border: `1px solid rgba(74,222,128,0.3)`, background: 'rgba(74,222,128,0.06)', fontSize: 14, color: SUCCESS, lineHeight: 1.6 }}>
              ✓ Пароль изменён! Перенаправляем на страницу входа…
            </div>
          ) : !ready ? (
            <div style={{ fontSize: 13, color: MUTE, fontFamily: MONO, letterSpacing: '0.1em', textAlign: 'center', padding: '20px 0' }}>
              ПРОВЕРЯЕМ ССЫЛКУ…
            </div>
          ) : error ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: '14px 16px', border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.06)', fontSize: 13, color: 'rgba(248,113,113,0.9)', lineHeight: 1.6 }}>
                {error}
              </div>
              <Link href="/forgot-password" style={{ background: G, color: BG, padding: '14px', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textDecoration: 'none', borderRadius: 2, textAlign: 'center' }}>
                Запросить новую ссылку →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>НОВЫЙ ПАРОЛЬ</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                  required
                  minLength={6}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>ПОВТОРИТЕ ПАРОЛЬ</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Повторите новый пароль"
                  required
                  style={inputStyle}
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
                {loading ? 'Сохраняем…' : 'Сохранить новый пароль →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
