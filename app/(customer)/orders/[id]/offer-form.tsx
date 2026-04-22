'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function OfferForm({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [price, setPrice] = useState('')
  const [days, setDays] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, price: Number(price), delivery_days: Number(days), comment }),
    })

    if (!res.ok) {
      setError('Ошибка при отправке предложения')
      setLoading(false)
      return
    }

    router.refresh()
  }

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-lg">Отправить предложение</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Цена (сум) *</Label>
              <Input type="number" placeholder="3 500 000" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Срок (дней) *</Label>
              <Input type="number" placeholder="14" value={days} onChange={e => setDays(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Комментарий *</Label>
            <Textarea
              placeholder="Расскажите о себе, своём опыте и почему вы подходите для этого заказа..."
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={loading}>
            {loading ? 'Отправляем...' : 'Отправить предложение'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
