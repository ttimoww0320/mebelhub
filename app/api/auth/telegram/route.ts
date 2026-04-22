import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
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

function makePassword(telegramId: string): string {
  const secret = process.env.TELEGRAM_BOT_TOKEN!
  return crypto.createHmac('sha256', secret).update(telegramId).digest('hex')
}

export async function POST(req: NextRequest) {
  const data = await req.json()

  if (!verifyTelegramData(data)) {
    return NextResponse.json({ error: 'Invalid Telegram data' }, { status: 401 })
  }

  const { id, first_name, last_name } = data
  const fullName = [first_name, last_name].filter(Boolean).join(' ')
  const email = `tg_${id}@mebelhub.uz`
  const password = makePassword(String(id))
  const admin = createAdminClient()

  // Try to create user, ignore if already exists
  let userId: string | null = null

  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    password,
    user_metadata: { full_name: fullName, role: 'customer' },
  })

  if (createError) {
    // User already exists — find them
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 })
    const found = list?.users?.find(u => u.email === email)
    if (!found) return NextResponse.json({ error: 'User not found: ' + createError.message }, { status: 400 })
    userId = found.id
  } else {
    userId = newUser.user.id
  }

  await admin.from('profiles').update({
    telegram_chat_id: Number(id),
    full_name: fullName,
  }).eq('id', userId)

  return NextResponse.json({ email, password })
}
