'use client'

import { useState } from 'react'
import { G, BG, BG2, BORDER, BORDER2, TEXT, DIM, MUTE, MONO } from '@/lib/tokens'

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

  const rowStyle = (active: boolean): React.CSSProperties => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 16px',
    background: BG,
    border: `1px solid ${active ? G : BORDER2}`,
    borderRadius: 2,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'border-color 0.15s',
    opacity: loading && !active ? 0.5 : 1,
  })

  if (!confirmed) {
    return (
      <div style={{ padding: '20px 24px', border: `1px solid ${BORDER2}`, background: BG2, borderRadius: 2 }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: G, letterSpacing: '0.12em', marginBottom: 10 }}>
          ◆ ОПЛАТА
        </div>
        <div style={{ fontSize: 14, color: TEXT, marginBottom: 6 }}>Подтвердите заказ</div>
        <div style={{ fontSize: 13, color: DIM, marginBottom: 20 }}>
          Выберите способ оплаты, чтобы подтвердить заказ мастеру.
        </div>
        <button
          onClick={() => setConfirmed(true)}
          style={{
            background: G, color: BG, border: 'none',
            padding: '12px 24px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', borderRadius: 2, fontFamily: 'inherit',
          }}
        >
          Выбрать способ оплаты
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px 24px', border: `1px solid ${BORDER2}`, background: BG2, borderRadius: 2 }}>
      <div style={{ fontFamily: MONO, fontSize: 10, color: G, letterSpacing: '0.12em', marginBottom: 10 }}>
        ◆ ОПЛАТА
      </div>
      <div style={{ fontSize: 13, color: DIM, marginBottom: 20 }}>
        Сумма заказа: <span style={{ color: G, fontWeight: 600 }}>${Number(price).toLocaleString()}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          onClick={payCash}
          disabled={!!loading}
          style={rowStyle(loading === 'cash')}
        >
          <span style={{ fontSize: 22 }}>💵</span>
          <div>
            <div style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>Оплата наличными</div>
            <div style={{ fontSize: 12, color: MUTE, marginTop: 2 }}>Расплатитесь напрямую с мастером</div>
          </div>
          {loading === 'cash' && <span style={{ marginLeft: 'auto', fontSize: 12, color: MUTE }}>...</span>}
        </button>

        {PAYME_ENABLED && (
          <button
            onClick={() => payOnline('payme')}
            disabled={!!loading}
            style={rowStyle(loading === 'payme')}
          >
            <span style={{ fontSize: 20, fontWeight: 700, color: '#00AAFF' }}>P</span>
            <div>
              <div style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>Payme</div>
              <div style={{ fontSize: 12, color: MUTE, marginTop: 2 }}>Онлайн оплата картой</div>
            </div>
            {loading === 'payme' && <span style={{ marginLeft: 'auto', fontSize: 12, color: MUTE }}>...</span>}
          </button>
        )}

        {CLICK_ENABLED && (
          <button
            onClick={() => payOnline('click')}
            disabled={!!loading}
            style={rowStyle(loading === 'click')}
          >
            <span style={{ fontSize: 20, fontWeight: 700, color: '#6ABD45' }}>C</span>
            <div>
              <div style={{ fontSize: 13, color: TEXT, fontWeight: 500 }}>Click</div>
              <div style={{ fontSize: 12, color: MUTE, marginTop: 2 }}>Онлайн оплата картой</div>
            </div>
            {loading === 'click' && <span style={{ marginLeft: 'auto', fontSize: 12, color: MUTE }}>...</span>}
          </button>
        )}
      </div>

      <button
        onClick={() => setConfirmed(false)}
        style={{
          marginTop: 16, background: 'none', border: 'none',
          fontSize: 12, color: MUTE, cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        Отмена
      </button>
    </div>
  )
}
