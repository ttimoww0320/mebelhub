import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { paymeCheckoutUrl } from '@/lib/payme'
import { clickCheckoutUrl } from '@/lib/click'

const DEPOSIT_PERCENT = 0.30 // 30% deposit

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { offerId, provider } = await req.json()
  if (!offerId || !['payme', 'click'].includes(provider)) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: offer } = await admin
    .from('offers')
    .select('*, order:orders(customer_id, status)')
    .eq('id', offerId)
    .eq('status', 'accepted')
    .single()

  if (!offer) return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
  if ((offer.order as any)?.customer_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Check if payment already exists
  const { data: existing } = await admin
    .from('payments')
    .select('id, status')
    .eq('offer_id', offerId)
    .neq('status', 'failed')
    .maybeSingle()

  if (existing?.status === 'paid') {
    return NextResponse.json({ error: 'Already paid' }, { status: 400 })
  }

  const depositAmount = Math.round(Number(offer.price) * DEPOSIT_PERCENT)

  // Reuse pending payment or create new
  let paymentId = existing?.id
  if (!paymentId) {
    const { data: payment, error } = await admin.from('payments').insert({
      order_id: offer.order_id,
      offer_id: offerId,
      customer_id: user.id,
      amount: depositAmount,
      provider,
    }).select('id').single()

    if (error || !payment) return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
    paymentId = payment.id
  }

  const url = provider === 'payme'
    ? paymeCheckoutUrl(paymentId, depositAmount)
    : clickCheckoutUrl(paymentId, depositAmount)

  return NextResponse.json({ url, paymentId })
}
