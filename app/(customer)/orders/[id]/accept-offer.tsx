'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function AcceptOffer({ offerId, orderId }: { offerId: string; orderId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleAccept() {
    setLoading(true)
    const supabase = createClient()

    await supabase.from('offers').update({ status: 'accepted' }).eq('id', offerId)
    await supabase.from('orders').update({ status: 'in_progress' }).eq('id', orderId)

    router.refresh()
  }

  return (
    <div className="mt-3 pt-3 border-t">
      <Button
        size="sm"
        className="bg-green-600 hover:bg-green-700 text-white"
        onClick={handleAccept}
        disabled={loading}
      >
        {loading ? 'Принимаем...' : 'Принять предложение'}
      </Button>
    </div>
  )
}
