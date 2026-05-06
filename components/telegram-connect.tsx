'use client'

import { useState } from 'react'
import { G, BG, BG2, BORDER, MUTE, SUCCESS } from '@/lib/tokens'

export default function TelegramConnect({ connected }: { connected: boolean }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(connected)

  async function handleConnect() {
    setLoading(true)
    const res = await fetch('/api/telegram/connect', { method: 'POST' })
    const { url } = await res.json()
    window.open(url, '_blank')
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: SUCCESS }}>
        <span>✓</span>
        <span>Telegram подключён</span>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleConnect}
      disabled={loading}
      style={{
        background: loading ? BG2 : G,
        color: loading ? MUTE : BG,
        border: 'none',
        padding: '12px 20px',
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '0.06em',
        cursor: loading ? 'default' : 'pointer',
        borderRadius: 2,
        fontFamily: 'inherit',
      }}
    >
      {loading ? 'Открываем…' : '📱 Подключить Telegram'}
    </button>
  )
}
