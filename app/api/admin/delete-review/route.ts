import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ADMIN_EMAIL = 'toirovtimurmalik@gmail.com'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { reviewId } = await req.json()
  if (!reviewId) return NextResponse.json({ error: 'Missing reviewId' }, { status: 400 })

  const admin = createAdminClient()

  const { data: review } = await admin.from('reviews').select('craftsman_id').eq('id', reviewId).single()
  if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await admin.from('reviews').delete().eq('id', reviewId)

  // Recalculate rating after deletion
  await admin.rpc('recalc_craftsman_rating', { craftsman_id: review.craftsman_id })

  return NextResponse.json({ ok: true })
}
