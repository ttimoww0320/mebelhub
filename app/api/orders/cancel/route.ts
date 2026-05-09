import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendNotification } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orderId } = await req.json()
  const admin = createAdminClient()

  const { data: order } = await admin
    .from('orders')
    .select('customer_id, status, title')
    .eq('id', orderId)
    .single()

  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (order.customer_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (!['open', 'in_progress'].includes(order.status)) {
    return NextResponse.json({ error: 'Cannot cancel this order' }, { status: 400 })
  }

  await admin.from('orders').update({ status: 'cancelled' }).eq('id', orderId)

  // Notify all craftsmen who submitted offers
  const { data: offers } = await admin
    .from('offers')
    .select('craftsman_id, status')
    .eq('order_id', orderId)
    .in('status', ['pending', 'accepted'])

  if (offers?.length) {
    await Promise.all(offers.map(o =>
      sendNotification({
        userId: o.craftsman_id,
        title: 'Заказ отменён',
        body: `Заказчик отменил заказ "${order.title ?? ''}". Вы можете откликнуться на другие заказы.`,
        link: '/dashboard',
      })
    ))
  }

  return NextResponse.json({ ok: true })
}
