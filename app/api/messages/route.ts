import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendNotification } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orderId, body } = await req.json()
  if (!orderId || !body?.trim()) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const admin = createAdminClient()

  const { data: message, error } = await admin
    .from('messages')
    .insert({ order_id: orderId, sender_id: user.id, body: body.trim() })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Find the other party to notify
  const { data: order } = await admin
    .from('orders')
    .select('customer_id, title')
    .eq('id', orderId)
    .single()

  if (!order) return NextResponse.json({ message })

  const { data: sender } = await admin
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const senderName = sender?.full_name ?? 'Собеседник'
  const preview = body.trim().length > 60 ? body.trim().slice(0, 60) + '…' : body.trim()

  if (user.id === order.customer_id) {
    // Customer wrote → notify craftsman
    const { data: offer } = await admin
      .from('offers')
      .select('craftsman_id')
      .eq('order_id', orderId)
      .eq('status', 'accepted')
      .maybeSingle()

    if (offer) {
      await sendNotification({
        userId: offer.craftsman_id,
        title: `${senderName} написал в чате`,
        body: preview,
        link: `/orders/${orderId}`,
      })
    }
  } else {
    // Craftsman wrote → notify customer
    await sendNotification({
      userId: order.customer_id,
      title: `${senderName} написал в чате`,
      body: preview,
      link: `/orders/${orderId}`,
    })
  }

  return NextResponse.json({ message })
}
