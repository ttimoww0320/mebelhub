'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

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
    <div className="flex gap-2 shrink-0">
      <Button
        size="sm"
        className="bg-green-600 hover:bg-green-700 text-white"
        disabled={!!loading}
        onClick={() => handle('approve')}
      >
        {loading === 'approve' ? '...' : 'Одобрить'}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="border-red-300 text-red-600 hover:bg-red-50"
        disabled={!!loading}
        onClick={() => handle('reject')}
      >
        {loading === 'reject' ? '...' : 'Отклонить'}
      </Button>
    </div>
  )
}
