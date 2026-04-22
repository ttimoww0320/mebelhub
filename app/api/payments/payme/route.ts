import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyPaymeAuth, PaymeError, sumToTiyin } from '@/lib/payme'

function ok(id: number, result: object) {
  return NextResponse.json({ jsonrpc: '2.0', id, result })
}

function err(id: number, error: { code: number; message: object }) {
  return NextResponse.json({ jsonrpc: '2.0', id, error: { ...error, data: null } })
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!verifyPaymeAuth(auth)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { method, params, id } = body
  const admin = createAdminClient()

  // --- CheckPerformTransaction ---
  if (method === 'CheckPerformTransaction') {
    const paymentId = params?.account?.payment_id
    const { data: payment } = await admin.from('payments').select('*').eq('id', paymentId).single()
    if (!payment) return err(id, PaymeError.ORDER_NOT_FOUND)

    const expected = sumToTiyin(payment.amount)
    if (params.amount !== expected) return err(id, PaymeError.WRONG_AMOUNT)

    return ok(id, { allow: true })
  }

  // --- CreateTransaction ---
  if (method === 'CreateTransaction') {
    const paymentId = params?.account?.payment_id
    const transId = params?.id
    const { data: payment } = await admin.from('payments').select('*').eq('id', paymentId).single()
    if (!payment) return err(id, PaymeError.ORDER_NOT_FOUND)

    const expected = sumToTiyin(payment.amount)
    if (params.amount !== expected) return err(id, PaymeError.WRONG_AMOUNT)

    if (payment.status === 'paid') return err(id, PaymeError.CANT_PERFORM)

    await admin.from('payments').update({
      provider_transaction_id: transId,
      status: 'pending',
    }).eq('id', paymentId)

    return ok(id, {
      create_time: Date.now(),
      transaction: paymentId,
      state: 1,
    })
  }

  // --- PerformTransaction ---
  if (method === 'PerformTransaction') {
    const transId = params?.id
    const { data: payment } = await admin
      .from('payments')
      .select('*')
      .eq('provider_transaction_id', transId)
      .single()

    if (!payment) return err(id, PaymeError.TRANSACTION_NOT_FOUND)
    if (payment.status === 'paid') {
      return ok(id, { perform_time: Date.now(), transaction: payment.id, state: 2 })
    }
    if (payment.status !== 'pending') return err(id, PaymeError.CANT_PERFORM)

    await admin.from('payments').update({ status: 'paid' }).eq('id', payment.id)
    await admin.from('orders').update({ status: 'in_progress' }).eq('id', payment.order_id)

    return ok(id, { perform_time: Date.now(), transaction: payment.id, state: 2 })
  }

  // --- CancelTransaction ---
  if (method === 'CancelTransaction') {
    const transId = params?.id
    const { data: payment } = await admin
      .from('payments')
      .select('*')
      .eq('provider_transaction_id', transId)
      .single()

    if (!payment) return err(id, PaymeError.TRANSACTION_NOT_FOUND)
    if (payment.status === 'paid') return err(id, PaymeError.CANT_CANCEL)

    await admin.from('payments').update({ status: 'failed' }).eq('id', payment.id)

    return ok(id, { cancel_time: Date.now(), transaction: payment.id, state: -1 })
  }

  // --- CheckTransaction ---
  if (method === 'CheckTransaction') {
    const transId = params?.id
    const { data: payment } = await admin
      .from('payments')
      .select('*')
      .eq('provider_transaction_id', transId)
      .single()

    if (!payment) return err(id, PaymeError.TRANSACTION_NOT_FOUND)

    const state = payment.status === 'paid' ? 2 : payment.status === 'failed' ? -1 : 1

    return ok(id, {
      create_time: new Date(payment.created_at).getTime(),
      perform_time: payment.status === 'paid' ? Date.now() : 0,
      cancel_time: payment.status === 'failed' ? Date.now() : 0,
      transaction: payment.id,
      state,
      reason: null,
    })
  }

  return NextResponse.json({ error: 'Unknown method' }, { status: 400 })
}
