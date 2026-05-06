import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { full_name, phone, bio, role } = body

  if (!full_name?.trim()) {
    return NextResponse.json({ error: 'Имя обязательно' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.from('profiles').upsert({
    id: user.id,
    email: user.email ?? '',
    full_name: full_name.trim(),
    phone: phone?.trim() || null,
    bio: bio?.trim() || null,
    role: role ?? 'customer',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
