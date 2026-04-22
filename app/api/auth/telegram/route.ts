import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

function verifyTelegramData(data: Record<string, string>): boolean {
  const token = process.env.TELEGRAM_BOT_TOKEN!
  const secret = crypto.createHash('sha256').update(token).digest()
  const { hash, ...rest } = data
  const checkString = Object.keys(rest)
    .sort()
    .map(k => `${k}=${rest[k]}`)
    .join('\n')
  const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex')
  return hmac === hash
}

export async function POST(req: NextRequest) {
  const data = await req.json()

  if (!verifyTelegramData(data)) {
    return NextResponse.json({ error: 'Invalid Telegram data' }, { status: 401 })
  }

  const { id, first_name, last_name, username } = data
  const fullName = [first_name, last_name].filter(Boolean).join(' ')
  const email = `tg_${id}@mebelhub.uz`
  const admin = createAdminClient()

  // Find or create user
  let userId: string

  const { data: existing } = await admin.auth.admin.listUsers()
  const existingUser = existing?.users?.find(u => u.email === email)

  if (existingUser) {
    userId = existingUser.id
  } else {
    const { data: newUser, error } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      password: crypto.randomBytes(32).toString('hex'),
      user_metadata: { full_name: fullName, role: 'customer' },
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    userId = newUser.user.id
  }

  // Update telegram_chat_id
  await admin.from('profiles').update({
    telegram_chat_id: Number(id),
    full_name: fullName,
  }).eq('id', userId)

  // Create session
  const { data: session, error: sessionError } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  })

  if (sessionError) return NextResponse.json({ error: sessionError.message }, { status: 400 })

  return NextResponse.json({
    userId,
    email,
    magic_link: session.properties?.action_link
  })
}
