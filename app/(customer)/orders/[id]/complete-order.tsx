'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function CompleteOrder({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [error, setError] = useState('')

  async function handleComplete() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/orders/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    })
    const data = await res.json()
    if (data.ok) {
      window.location.reload()
    } else {
      setError(data.error || 'Ошибка')
      setLoading(false)
    }
  }

  if (!confirm) {
    return (
      <Button
        variant="outline"
        className="border-green-500 text-green-700 hover:bg-green-50 font-medium"
        onClick={() => setConfirm(true)}
      >
        ✓ Мебель получена — закрыть сделку
      </Button>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-700 font-medium">Вы уверены? После закрытия нужно будет оставить отзыв.</p>
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={handleComplete}
          disabled={loading}
        >
          {loading ? 'Закрываем...' : 'Да, всё получил — закрыть сделку'}
        </Button>
        <Button variant="outline" onClick={() => setConfirm(false)} disabled={loading}>
          Отмена
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
