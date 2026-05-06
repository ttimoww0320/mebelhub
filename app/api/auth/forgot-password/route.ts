import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const API = `https://api.telegram.org/bot${BOT_TOKEN}`

async function sendMessage(chatId: number, text: string, disablePreview = false) {
  await fetch(`${API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: disablePreview }),
  })
}

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Введите email' }, { status: 400 })

  const admin = createAdminClient()

  const { data: profile } = await admin
    .from('profiles')
    .select('telegram_chat_id')
    .eq('email', email)
    .maybeSingle()

  if (!profile) {
    return NextResponse.json({ error: 'Пользователь с таким email не найден' }, { status: 404 })
  }

  if (!profile.telegram_chat_id) {
    return NextResponse.json({ error: 'telegram_not_connected' }, { status: 400 })
  }

  const origin = req.headers.get('origin') || 'http://localhost:3000'

  const { data, error } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: { redirectTo: `${origin}/reset-password` },
  })

  if (error || !data?.properties?.action_link) {
    return NextResponse.json({ error: 'Не удалось создать ссылку сброса' }, { status: 500 })
  }

  await sendMessage(
    profile.telegram_chat_id,
    `🔐 <b>Сброс пароля MebelHub</b>\n\nВы запросили сброс пароля.\n\n<a href="${data.properties.action_link}">👉 Нажмите здесь чтобы задать новый пароль</a>\n\nСсылка действует 1 час. Если вы не запрашивали сброс — проигнорируйте это сообщение.`,
    true
  )

  return NextResponse.json({ ok: true })
}
