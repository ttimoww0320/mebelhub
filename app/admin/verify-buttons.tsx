'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { G, BG, BORDER2 } from '@/lib/tokens'

export default function AdminVerifyButtons({ craftsmanId }: { craftsmanId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)

  async function handle(action: 'approve' | 'reject') {
    setLoading(action)
    await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ craftsmanId, action }),
    })
    setLoading(null)
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
      <button
        disabled={!!loading}
        onClick={() => handle('approve')}
        style={{
          background: G, color: BG, border: 'none',
          padding: '10px 20px', fontSize: 12, fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          borderRadius: 2, fontFamily: 'inherit',
        }}
      >
        {loading === 'approve' ? '...' : 'Одобрить'}
      </button>
      <button
        disabled={!!loading}
        onClick={() => handle('reject')}
        style={{
          background: 'transparent', color: '#ef4444',
          border: `1px solid rgba(239,68,68,0.4)`,
          padding: '10px 20px', fontSize: 12, fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          borderRadius: 2, fontFamily: 'inherit',
        }}
      >
        {loading === 'reject' ? '...' : 'Отклонить'}
      </button>
    </div>
  )
}
