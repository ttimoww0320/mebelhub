import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyClickSign } from '@/lib/click'

export async function POST(req: NextRequest) {
  const body = await req.formData()
  const params = Object.fromEntries(body.entries()) as Record<string, string>

  if (!verifyClickSign({
    click_trans_id: params.click_trans_id,
    service_id: params.service_id,
    merchant_trans_id: params.merchant_trans_id,
    amount: params.amount,
    action: params.action,
    sign_time: params.sign_time,
    sign_string: params.sign_string,
  })) {
    return NextResponse.json({ error: -1, error_note: 'Invalid sign' })
  }

  const admin = createAdminClient()
  const paymentId = params.merchant_trans_id

  const { data: payment } = await admin.from('payments').select('*').eq('id', paymentId).single()
  if (!payment) return NextResponse.json({ error: -5, error_note: 'Payment not found' })

  if (payment.status === 'paid') {
    return NextResponse.json({ error: -4, error_note: 'Already paid' })
  }

  await admin.from('payments').update({
    provider_transaction_id: params.click_trans_id,
  }).eq('id', paymentId)

  return NextResponse.json({
    click_trans_id: params.click_trans_id,
    merchant_trans_id: paymentId,
    merchant_prepare_id: paymentId,
    error: 0,
    error_note: 'Success',
  })
}
