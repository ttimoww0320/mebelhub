'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { G, BG, BG2, BORDER, TEXT, DIM, MUTE, MONO, HEAD, SUCCESS } from '@/lib/tokens'
import TelegramConnect from '@/components/telegram-connect'

export default function SettingsPage() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone]       = useState('')
  const [email, setEmail]       = useState('')
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [saveError, setSaveError] = useState('')
  const [connected, setConnected] = useState(false)
  const [loaded, setLoaded]     = useState(false)
  const [userId, setUserId]     = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user
      if (!user) { setLoaded(true); return }
      setUserId(user.id)
      setEmail(user.email ?? '')
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      if (data) {
        setFullName(data.full_name ?? '')
        setPhone(data.phone ?? '')
        setConnected(!!data.telegram_chat_id)
      }
      setLoaded(true)
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setSaving(true)
    setSaveError('')
    const res = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, phone, role: 'customer' }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) {
      setSaveError('Ошибка: ' + (data.error ?? res.status))
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!loaded) return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em' }}>ЗАГРУЗКА···</div>
    </div>
  )

  return (
    <div style={{ background: BG, color: TEXT, minHeight: '100vh' }}>

      {/* Header */}
      <div className="px-page" style={{ paddingTop: 40, paddingBottom: 40, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 10 }}>§ НАСТРОЙКИ</div>
        <h1 style={{ fontFamily: HEAD, fontSize: 60, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
          Настройки <em style={{ color: G }}>аккаунта</em>
        </h1>
      </div>

      <div className="grid-2 px-page" style={{ paddingTop: 40, paddingBottom: 40 }}>

        {/* Profile form */}
        <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: 32 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 24 }}>ЛИЧНЫЕ ДАННЫЕ</div>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>ИМЯ И ФАМИЛИЯ</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)} required
                style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, color: TEXT, padding: '14px 16px', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>ТЕЛЕФОН</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+998 90 123 45 67"
                style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, color: TEXT, padding: '14px 16px', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>EMAIL</label>
              <input value={email} disabled
                style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, color: MUTE, padding: '14px 16px', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', cursor: 'default' }} />
              <div style={{ fontSize: 11, color: MUTE, marginTop: 6 }}>Email нельзя изменить</div>
            </div>
            {saveError && (
              <div style={{ fontSize: 13, color: 'rgba(248,113,113,0.9)', padding: '12px 16px', border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.06)' }}>
                {saveError}
              </div>
            )}
            <button type="submit" disabled={saving}
              style={{ background: saved ? 'rgba(74,222,128,0.15)' : G, color: saved ? SUCCESS : BG, border: saved ? `1px solid ${SUCCESS}` : 'none', padding: '14px 24px', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', cursor: saving ? 'default' : 'pointer', borderRadius: 2, fontFamily: 'inherit', alignSelf: 'flex-start' }}>
              {saved ? '✓ Сохранено' : saving ? 'Сохраняем…' : 'Сохранить изменения'}
            </button>
          </form>
        </div>

        {/* Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: 32 }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 20 }}>УВЕДОМЛЕНИЯ · TELEGRAM</div>
            <p style={{ fontSize: 14, color: DIM, lineHeight: 1.6, marginBottom: 24 }}>
              Подключите Telegram чтобы мгновенно получать уведомления о новых предложениях от мастеров.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: connected ? SUCCESS : MUTE }} />
              <span style={{ fontFamily: MONO, fontSize: 11, color: connected ? SUCCESS : MUTE, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                {connected ? 'Подключено' : 'Не подключено'}
              </span>
            </div>
            <TelegramConnect connected={connected} />
          </div>

          <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: 32 }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 20 }}>БЕЗОПАСНОСТЬ</div>
            <div style={{ fontSize: 13, color: DIM, lineHeight: 1.6 }}>
              Для смены пароля воспользуйтесь ссылкой "Забыли пароль?" на странице входа.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
