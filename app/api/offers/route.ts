import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendNotification } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { order_id, price, delivery_days, comment } = await req.json()

  // Prevent duplicate offers from the same craftsman
  const { data: existing } = await supabase
    .from('offers')
    .select('id')
    .eq('order_id', order_id)
    .eq('craftsman_id', user.id)
    .maybeSingle()
  if (existing) return NextResponse.json({ error: 'Вы уже подали оффер на этот заказ' }, { status: 400 })

  const { data: offer, error } = await supabase.from('offers').insert({
    order_id,
    craftsman_id: user.id,
    price,
    delivery_days,
    comment,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Notify customer
  const { data: order } = await supabase
    .from('orders')
    .select('customer_id, title')
    .eq('id', order_id)
    .single()

  const { data: craftsman } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  if (order) {
    await sendNotification({
      userId: order.customer_id,
      title: 'Новое предложение',
      body: `${craftsman?.full_name} отправил предложение на ваш заказ "${order.title}"`,
      link: `/orders/${order_id}`,
    })

    await sendNotification({
      userId: user.id,
      title: 'Оффер отправлен',
      body: `Вы предложили $${price} на заказ "${order.title}". Ждите ответа заказчика.`,
      link: `/orders/${order_id}`,
    })
  }

  return NextResponse.json({ offer })
}
