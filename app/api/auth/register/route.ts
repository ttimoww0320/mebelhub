import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Supabase не настроен — добавьте ключи в .env.local' }, { status: 503 })
  }

  const { email, password, full_name, company_name, role, phone } = await req.json()

  if (!email || !password || !full_name || !role) {
    return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  const { error: profileError } = await admin.from('profiles').upsert({
    id: data.user.id,
    email,
    full_name,
    company_name: role === 'craftsman' ? (company_name || null) : null,
    role,
    phone: phone || null,
  })

  if (profileError) {
    return NextResponse.json({ error: 'Аккаунт создан, но профиль не сохранился: ' + profileError.message }, { status: 500 })
  }

  return NextResponse.json({ user: data.user })
}
