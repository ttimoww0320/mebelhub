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

  // Find or create user
  const { data: existing } = await admin.auth.admin.listUsers()
  const existingUser = existing?.users?.find(u => u.email === email)

  if (!existingUser) {
    const { error } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      password,
      user_metadata: { full_name: fullName, role: 'customer' },
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Update profile
  const userId = existingUser?.id || (await admin.auth.admin.listUsers()).data.users.find(u => u.email === email)?.id
  if (userId) {
    await admin.from('profiles').update({
      telegram_chat_id: Number(id),
      full_name: fullName,
    }).eq('id', userId)
  }

  return NextResponse.json({ email, password })
}
