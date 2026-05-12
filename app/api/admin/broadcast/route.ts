import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendNotification } from '@/lib/notifications'

const ADMIN_EMAIL = 'toirovtimurmalik@gmail.com'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { title, body, target } = await req.json()
  if (!title?.trim() || !body?.trim() || !['all', 'customers', 'craftsmen'].includes(target)) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const admin = createAdminClient()

  let query = admin.from('profiles').select('id').eq('blocked', false)
  if (target === 'customers') query = query.eq('role', 'customer')
  if (target === 'craftsmen') query = query.eq('role', 'craftsman')

  const { data: recipients } = await query

  if (!recipients?.length) return NextResponse.json({ sent: 0 })

  // Send in batches of 20 to avoid overloading
  const BATCH = 20
  for (let i = 0; i < recipients.length; i += BATCH) {
    const batch = recipients.slice(i, i + BATCH)
    await Promise.all(batch.map(r => sendNotification({ userId: r.id, title, body })))
  }

  return NextResponse.json({ sent: recipients.length })
}
