import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const API = `https://api.telegram.org/bot${BOT_TOKEN}`

async function sendTg(chatId: number, text: string) {
  await fetch(`${API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  })
}

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Введите email' }, { status: 400 })

  const admin = createAdminClient()
  const origin = req.headers.get('origin') || 'https://mebelhub.vercel.app'

  const { data: profile } = await admin
    .from('profiles')
    .select('telegram_chat_id')
    .eq('email', email)
    .maybeSingle()

  if (!profile) {
    // Don't reveal whether email exists
    return NextResponse.json({ ok: true, method: 'email' })
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: { redirectTo: `${origin}/reset-password` },
  })

  if (error || !data?.properties?.action_link) {
    return NextResponse.json({ error: 'Не удалось создать ссылку сброса' }, { status: 500 })
  }

  const link = data.properties.action_link

  if (profile.telegram_chat_id) {
    // Send via Telegram
    await sendTg(
      profile.telegram_chat_id,
      `🔐 <b>Сброс пароля MebelHub</b>\n\nВы запросили сброс пароля.\n\n<a href="${link}">👉 Нажмите здесь чтобы задать новый пароль</a>\n\nСсылка действует 1 час. Если вы не запрашивали сброс — проигнорируйте это сообщение.`
    )
    return NextResponse.json({ ok: true, method: 'telegram' })
  }

  // Fallback: use Supabase built-in email reset
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  await fetch(`${supabaseUrl}/auth/v1/recover`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({ email, gotrue_meta_security: {} }),
  })

  return NextResponse.json({ ok: true, method: 'email' })
}
