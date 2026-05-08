import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendNotification } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { offerId, orderId } = await req.json()
  const admin = createAdminClient()

  // Verify this customer owns the order
  const { data: order } = await admin
    .from('orders')
    .select('customer_id, status, title')
    .eq('id', orderId)
    .single()

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (order.customer_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (order.status !== 'open') return NextResponse.json({ error: 'Order is not open' }, { status: 400 })

  // Accept this offer, reject all others
  await admin.from('offers').update({ status: 'rejected' })
    .eq('order_id', orderId)
    .neq('id', offerId)

  await admin.from('offers').update({ status: 'accepted' }).eq('id', offerId)
  await admin.from('orders').update({ status: 'in_progress' }).eq('id', orderId)

  const { data: offer } = await admin.from('offers').select('craftsman_id, price').eq('id', offerId).single()
  if (offer) {
    await sendNotification({
      userId: offer.craftsman_id,
      title: 'Ваш оффер принят!',
      body: `Заказчик принял ваше предложение по заказу "${order.title ?? ''}". Свяжитесь для начала работы.`,
      link: `/orders/${orderId}`,
    })
  }

  return NextResponse.json({ ok: true })
}
