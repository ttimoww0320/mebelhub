'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BlockButton({ userId, blocked }: { userId: string; blocked: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle() {
    if (!confirm(blocked ? 'Разблокировать пользователя?' : 'Заблокировать пользователя?')) return
    setLoading(true)
    await fetch('/api/admin/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, blocked: !blocked }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
        blocked
          ? 'bg-green-50 text-green-700 hover:bg-green-100'
          : 'bg-red-50 text-red-600 hover:bg-red-100'
      }`}
    >
      {loading ? '...' : blocked ? 'Разблокировать' : 'Заблокировать'}
    </button>
  )
}
