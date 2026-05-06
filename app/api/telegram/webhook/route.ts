import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const API = `https://api.telegram.org/bot${BOT_TOKEN}`

async function sendMessage(chatId: number, text: string, extra?: object) {
  await fetch(`${API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', ...extra }),
  })
}

async function requestPhone(chatId: number, name: string) {
  await sendMessage(chatId, `✅ Аккаунт подключён, ${name}!\n\nПоделитесь номером телефона чтобы мы могли связать ваш профиль с Telegram.`, {
    reply_markup: {
      keyboard: [[{ text: '📱 Поделиться номером', request_contact: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const message = body.message
  if (!message) return NextResponse.json({ ok: true })

  const chatId: number = message.chat.id
  const text: string = message.text || ''
  const tgUsername: string | null = message.from?.username ?? null
  const admin = createAdminClient()

  // /start <token> — первичное подключение
  if (text.startsWith('/start')) {
    const token = text.split(' ')[1]

    if (!token) {
      await sendMessage(chatId, '👋 Привет! Чтобы подключить аккаунт MebelHub, зайдите в настройки профиля и нажмите «Подключить Telegram».')
      return NextResponse.json({ ok: true })
    }

    const { data: profile } = await admin
      .from('profiles')
      .select('id, full_name')
      .eq('telegram_token', token)
      .single()

    if (!profile) {
      await sendMessage(chatId, '❌ Ссылка недействительна. Попробуйте снова из профиля.')
      return NextResponse.json({ ok: true })
    }

    await admin.from('profiles').update({
      telegram_chat_id: chatId,
      telegram_token: null,
      ...(tgUsername ? { telegram_username: tgUsername } : {}),
    }).eq('id', profile.id)

    await requestPhone(chatId, profile.full_name)
    return NextResponse.json({ ok: true })
  }

  // Пользователь поделился контактом
  if (message.contact) {
    const phone = message.contact.phone_number

    const { data: profile } = await admin
      .from('profiles')
      .select('id, phone')
      .eq('telegram_chat_id', chatId)
      .single()

    if (profile) {
      await admin.from('profiles').update({
        telegram_phone: phone,
        // Обновляем основной номер только если он ещё не заполнен
        ...(!profile.phone ? { phone } : {}),
      }).eq('id', profile.id)

      await sendMessage(chatId, `✅ Номер <b>${phone}</b> сохранён!\n\nТеперь вы будете получать уведомления здесь.`, {
        reply_markup: { remove_keyboard: true },
      })
    }

    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: true })
}
