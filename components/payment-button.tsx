'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function PaymentButton({ offerId, price }: { offerId: string; price: number }) {
  const [loading, setLoading] = useState<'payme' | 'click' | null>(null)

  const deposit = Math.round(price * 0.30)

  async function pay(provider: 'payme' | 'click') {
    setLoading(provider)
    const res = await fetch('/api/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId, provider }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert(data.error || 'Ошибка при создании платежа')
      setLoading(null)
    }
  }

  return (
    <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
      <p className="text-sm font-medium text-gray-800 mb-1">Депозит для подтверждения заказа</p>
      <p className="text-xs text-gray-500 mb-3">
        30% от суммы оффера — <span className="font-semibold text-orange-700">{deposit.toLocaleString()} сум</span>.
        Остаток оплачивается напрямую мастеру.
      </p>
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => pay('payme')}
          disabled={!!loading}
          className="bg-[#00AAFF] hover:bg-[#0099EE] text-white font-semibold px-5"
        >
          {loading === 'payme' ? 'Перенаправляем...' : 'Payme'}
        </Button>
        <Button
          onClick={() => pay('click')}
          disabled={!!loading}
          className="bg-[#6ABD45] hover:bg-[#5CAF38] text-white font-semibold px-5"
        >
          {loading === 'click' ? 'Перенаправляем...' : 'Click'}
        </Button>
      </div>
    </div>
  )
}
