'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function AcceptOffer({ offerId, orderId }: { offerId: string; orderId: string }) {
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)

  async function handleAccept() {
    setLoading(true)
    const res = await fetch('/api/offers/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId, orderId }),
    })
    const data = await res.json()
    if (data.ok) {
      window.location.reload()
    } else {
      alert(data.error || 'Ошибка')
      setLoading(false)
    }
  }

  if (!confirm) {
    return (
      <div className="mt-3 pt-3 border-t">
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => setConfirm(true)}
        >
          Принять предложение
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-3 pt-3 border-t space-y-2">
      <p className="text-sm text-gray-600">Вы уверены? Остальные предложения будут отклонены.</p>
      <div className="flex gap-2">
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={handleAccept}
          disabled={loading}
        >
          {loading ? 'Принимаем...' : 'Да, выбрать этого мастера'}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setConfirm(false)} disabled={loading}>
          Отмена
        </Button>
      </div>
    </div>
  )
}
