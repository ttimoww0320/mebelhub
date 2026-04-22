import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { offerId } = await req.json()
  const admin = createAdminClient()

  const { data: offer } = await admin
    .from('offers')
    .select('*, order:orders(customer_id)')
    .eq('id', offerId)
    .eq('status', 'accepted')
    .single()

  if (!offer) return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
  if ((offer.order as any)?.customer_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Check no payment exists yet
  const { data: existing } = await admin
    .from('payments')
    .select('id, status')
    .eq('offer_id', offerId)
    .maybeSingle()

  if (existing?.status === 'paid') {
    return NextResponse.json({ ok: true })
  }

  if (existing) {
    await admin.from('payments').update({ status: 'paid', provider: 'cash' }).eq('id', existing.id)
  } else {
    await admin.from('payments').insert({
      order_id: offer.order_id,
      offer_id: offerId,
      customer_id: user.id,
      amount: Math.round(Number(offer.price) * 0.30),
      provider: 'cash',
      status: 'paid',
    })
  }

  await admin.from('orders').update({ status: 'in_progress' }).eq('id', offer.order_id)

  return NextResponse.json({ ok: true })
}
