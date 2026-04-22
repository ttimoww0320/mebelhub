'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

const PAYME_ENABLED = !!process.env.NEXT_PUBLIC_PAYME_ENABLED
const CLICK_ENABLED = !!process.env.NEXT_PUBLIC_CLICK_ENABLED

export default function PaymentButton({ offerId, price }: { offerId: string; price: number }) {
  const [loading, setLoading] = useState<'payme' | 'click' | 'cash' | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  async function payOnline(provider: 'payme' | 'click') {
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

  async function payCash() {
    setLoading('cash')
    const res = await fetch('/api/payments/cash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId }),
    })
    const data = await res.json()
    if (data.ok) {
      window.location.reload()
    } else {
      alert(data.error || 'Ошибка')
      setLoading(null)
    }
  }

  if (!confirmed) {
    return (
      <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
        <p className="text-sm font-semibold text-gray-800 mb-1">Подтвердите заказ</p>
        <p className="text-sm text-gray-500 mb-4">
          Выберите способ оплаты чтобы подтвердить заказ мастеру.
        </p>
        <Button
          className="bg-orange-600 hover:bg-orange-700 text-white"
          onClick={() => setConfirmed(true)}
        >
          Выбрать способ оплаты
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 space-y-3">
      <p className="text-sm font-semibold text-gray-800">Выберите способ оплаты</p>
      <p className="text-xs text-gray-500">
        Сумма заказа: <span className="font-semibold text-orange-700">{Number(price).toLocaleString()} сум</span>
      </p>

      <div className="space-y-2">
        {/* Cash - always available */}
        <button
          onClick={payCash}
          disabled={!!loading}
          className="w-full flex items-center gap-3 p-3 bg-white border-2 border-gray-200 hover:border-orange-400 rounded-xl transition-colors text-left disabled:opacity-50"
        >
          <span className="text-2xl">💵</span>
          <div>
            <p className="text-sm font-semibold text-gray-800">Оплата наличными</p>
            <p className="text-xs text-gray-400">Расплатитесь напрямую с мастером</p>
          </div>
          {loading === 'cash' && <span className="ml-auto text-xs text-gray-400">...</span>}
        </button>

        {/* Payme - only when configured */}
        {PAYME_ENABLED && (
          <button
            onClick={() => payOnline('payme')}
            disabled={!!loading}
            className="w-full flex items-center gap-3 p-3 bg-white border-2 border-gray-200 hover:border-blue-400 rounded-xl transition-colors text-left disabled:opacity-50"
          >
            <span className="text-2xl font-bold text-[#00AAFF]">P</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">Payme</p>
              <p className="text-xs text-gray-400">Онлайн оплата картой</p>
            </div>
            {loading === 'payme' && <span className="ml-auto text-xs text-gray-400">...</span>}
          </button>
        )}

        {/* Click - only when configured */}
        {CLICK_ENABLED && (
          <button
            onClick={() => payOnline('click')}
            disabled={!!loading}
            className="w-full flex items-center gap-3 p-3 bg-white border-2 border-gray-200 hover:border-green-400 rounded-xl transition-colors text-left disabled:opacity-50"
          >
            <span className="text-2xl font-bold text-[#6ABD45]">C</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">Click</p>
              <p className="text-xs text-gray-400">Онлайн оплата картой</p>
            </div>
            {loading === 'click' && <span className="ml-auto text-xs text-gray-400">...</span>}
          </button>
        )}
      </div>

      <button
        className="text-xs text-gray-400 hover:text-gray-600"
        onClick={() => setConfirmed(false)}
      >
        Отмена
      </button>
    </div>
  )
}
