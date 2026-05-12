'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function del() {
    if (!confirm('Удалить этот отзыв? Рейтинг мастера будет пересчитан.')) return
    setLoading(true)
    await fetch('/api/admin/delete-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={del}
      disabled={loading}
      className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors disabled:opacity-50 shrink-0"
    >
      {loading ? '...' : 'Удалить'}
    </button>
  )
}
