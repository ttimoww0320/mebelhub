import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendTelegramMessage } from '@/lib/telegram'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const message = body.message
  if (!message) return NextResponse.json({ ok: true })

  const chatId = message.chat.id
  const text: string = message.text || ''
  const admin = createAdminClient()

  // /start <token>
  if (text.startsWith('/start')) {
    const token = text.split(' ')[1]

    if (!token) {
      await sendTelegramMessage(chatId, '👋 Привет! Чтобы подключить аккаунт MebelHub, зайдите в настройки профиля и нажмите "Подключить Telegram".')
      return NextResponse.json({ ok: true })
    }

    const { data: profile } = await admin
      .from('profiles')
      .select('id, full_name')
      .eq('telegram_token', token)
      .single()

    if (!profile) {
      await sendTelegramMessage(chatId, '❌ Неверная ссылка. Попробуйте снова из профиля.')
      return NextResponse.json({ ok: true })
    }

    await admin.from('profiles').update({
      telegram_chat_id: chatId,
      telegram_token: null,
    }).eq('id', profile.id)

    await sendTelegramMessage(chatId, `✅ Аккаунт подключён! Привет, ${profile.full_name}! Теперь вы будете получать уведомления здесь.`)
  }

  return NextResponse.json({ ok: true })
}
