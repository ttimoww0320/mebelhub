import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { offerId } = await req.json()
  if (!offerId) return NextResponse.json({ error: 'Missing offerId' }, { status: 400 })

  const admin = createAdminClient()

  const { data: offer } = await admin
    .from('offers')
    .select('craftsman_id, status')
    .eq('id', offerId)
    .single()

  if (!offer) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (offer.craftsman_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (offer.status !== 'pending') return NextResponse.json({ error: 'Нельзя отозвать принятый или отклонённый оффер' }, { status: 400 })

  await admin.from('offers').delete().eq('id', offerId)

  return NextResponse.json({ ok: true })
}
