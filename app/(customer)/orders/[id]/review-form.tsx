'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReviewForm({ orderId, craftsmanId }: { orderId: string; craftsmanId: string }) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) return
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('reviews').insert({
      order_id: orderId,
      customer_id: user.id,
      craftsman_id: craftsmanId,
      rating,
      comment: comment || null,
    })

    // Update craftsman rating
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('craftsman_id', craftsmanId)

    if (reviews) {
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      await supabase.from('profiles').update({
        rating: Math.round(avg * 100) / 100,
        reviews_count: reviews.length,
      }).eq('id', craftsmanId)
    }

    router.refresh()
  }

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-lg">Оставить отзыв</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Оценка *</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="text-3xl transition-colors"
                >
                  <span className={(hovered || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Расскажите о качестве работы, соблюдении сроков..."
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>
          <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white" disabled={loading || !rating}>
            {loading ? 'Отправляем...' : 'Отправить отзыв'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
