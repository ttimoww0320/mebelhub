'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { G, BG, BORDER, MUTE } from '@/lib/tokens'

export default function CancelOfferButton({ offerId }: { offerId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCancel() {
    if (!confirm('Отозвать оффер? Его нельзя будет восстановить.')) return
    setLoading(true)
    const res = await fetch('/api/offers/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offerId }),
    })
    setLoading(false)
    if (res.ok) router.refresh()
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      style={{ background: 'transparent', border: `1px solid ${BORDER}`, color: MUTE, padding: '6px 14px', fontSize: 11, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', letterSpacing: '0.08em', borderRadius: 2, flexShrink: 0 }}
    >
      {loading ? '…' : 'Отозвать'}
    </button>
  )
}
