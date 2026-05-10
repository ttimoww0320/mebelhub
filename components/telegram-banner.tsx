'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { G, BG2, BORDER, TEXT, DIM, MUTE, MONO } from '@/lib/tokens'

export default function TelegramBanner() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [settingsLink, setSettingsLink] = useState('/settings')

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('tg_banner_dismissed')) {
      return
    }
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return
      const { data } = await supabase
        .from('profiles')
        .select('telegram_chat_id, role')
        .eq('id', session.user.id)
        .single()
      if (data && !data.telegram_chat_id) {
        setSettingsLink(data.role === 'craftsman' ? '/profile' : '/settings')
        setShow(true)
      }
    })
  }, [])

  function dismiss() {
    sessionStorage.setItem('tg_banner_dismissed', '1')
    setDismissed(true)
  }

  if (!show || dismissed) return null

  return (
    <div style={{ margin: '24px 40px 0', padding: '16px 20px', background: BG2, border: `1px solid rgba(228,182,104,0.35)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 20 }}>💬</span>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: G, letterSpacing: '0.12em', marginBottom: 4 }}>TELEGRAM НЕ ПОДКЛЮЧЁН</div>
          <div style={{ fontSize: 13, color: DIM }}>Подключите Telegram чтобы получать уведомления о заказах, офферах и сообщениях</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <a href={settingsLink} style={{ background: G, color: '#0A0D12', padding: '8px 16px', fontSize: 12, fontWeight: 600, textDecoration: 'none', borderRadius: 2, letterSpacing: '0.06em' }}>
          Подключить →
        </a>
        <button onClick={dismiss} style={{ background: 'transparent', border: `1px solid ${BORDER}`, color: MUTE, padding: '8px 12px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>
          Закрыть
        </button>
      </div>
    </div>
  )
}
