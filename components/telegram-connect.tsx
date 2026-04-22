'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

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
      <div className="flex items-center gap-2 text-sm text-green-600">
        <span>✓</span>
        <span>Telegram подключён</span>
      </div>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="border-blue-400 text-blue-600 hover:bg-blue-50"
      onClick={handleConnect}
      disabled={loading}
    >
      {loading ? 'Открываем...' : '📱 Подключить Telegram'}
    </Button>
  )
}
