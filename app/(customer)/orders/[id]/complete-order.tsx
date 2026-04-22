'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function CompleteOrder({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)

  async function handleComplete() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('orders').update({ status: 'completed' }).eq('id', orderId)
    router.refresh()
  }

  if (!confirm) {
    return (
      <Button
        variant="outline"
        className="border-green-400 text-green-700 hover:bg-green-50"
        onClick={() => setConfirm(true)}
      >
        ✓ Мебель получена — закрыть заказ
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm text-gray-600">Подтвердите закрытие заказа:</span>
      <Button
        className="bg-green-600 hover:bg-green-700 text-white"
        onClick={handleComplete}
        disabled={loading}
      >
        {loading ? 'Закрываем...' : 'Да, всё получил'}
      </Button>
      <Button variant="outline" onClick={() => setConfirm(false)} disabled={loading}>
        Отмена
      </Button>
    </div>
  )
}
