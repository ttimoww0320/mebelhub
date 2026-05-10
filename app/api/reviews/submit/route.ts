import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendNotification } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orderId, craftsmanId, rating, comment } = await req.json()
  if (!orderId || !craftsmanId || !rating) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Verify the order belongs to this customer and is completed
  const { data: order } = await admin
    .from('orders')
    .select('customer_id, status')
    .eq('id', orderId)
    .single()

  if (!order || order.customer_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (order.status !== 'completed') {
    return NextResponse.json({ error: 'Order not completed' }, { status: 400 })
  }

  // Prevent duplicate reviews for the same order
  const { data: existingReview } = await admin
    .from('reviews')
    .select('id')
    .eq('order_id', orderId)
    .eq('customer_id', user.id)
    .maybeSingle()
  if (existingReview) return NextResponse.json({ error: 'Вы уже оставили отзыв по этому заказу' }, { status: 400 })

  const { error: insertError } = await admin.from('reviews').insert({
    order_id: orderId,
    customer_id: user.id,
    craftsman_id: craftsmanId,
    rating,
    comment: comment || null,
  })

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 400 })

  // Notify craftsman about new review
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)
  await sendNotification({
    userId: craftsmanId,
    title: 'Новый отзыв о вашей работе',
    body: `${stars}${comment ? ' — ' + comment : ''}`,
    link: '/profile',
  })

  // Recalculate craftsman rating
  const { data: reviews } = await admin
    .from('reviews')
    .select('rating')
    .eq('craftsman_id', craftsmanId)

  if (reviews?.length) {
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    await admin.from('profiles').update({
      rating: Math.round(avg * 100) / 100,
      reviews_count: reviews.length,
    }).eq('id', craftsmanId)
  }

  return NextResponse.json({ ok: true })
}
