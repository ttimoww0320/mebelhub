import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendNotification } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const {
    title, description, furniture_type, style,
    width_cm, height_cm, depth_cm,
    budget_min, budget_max, material, deadline, images,
  } = body

  const admin = createAdminClient()

  const { data: order, error } = await admin
    .from('orders')
    .insert({
      customer_id: user.id,
      title,
      description,
      furniture_type,
      style,
      width_cm,
      height_cm,
      depth_cm,
      budget_min,
      budget_max,
      material,
      deadline,
      images,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  await sendNotification({
    userId: user.id,
    title: 'Заказ опубликован',
    body: `Ваш заказ "${title}" размещён. Мастера уже видят его и скоро пришлют предложения.`,
    link: `/orders/${order.id}`,
  })

  return NextResponse.json({ ok: true, orderId: order.id })
}
