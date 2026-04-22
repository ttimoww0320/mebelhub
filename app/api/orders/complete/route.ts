import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orderId } = await req.json()
  const admin = createAdminClient()

  const { data: order } = await admin
    .from('orders')
    .select('customer_id, status')
    .eq('id', orderId)
    .single()

  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (order.customer_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (order.status === 'completed') return NextResponse.json({ ok: true })

  await admin.from('orders').update({ status: 'completed' }).eq('id', orderId)

  return NextResponse.json({ ok: true })
}
