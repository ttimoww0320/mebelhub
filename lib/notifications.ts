import { createAdminClient } from '@/lib/supabase/admin'
import { sendTelegramMessage } from '@/lib/telegram'

export async function sendNotification({
  userId,
  title,
  body,
  link,
}: {
  userId: string
  title: string
  body: string
  link?: string
}) {
  const admin = createAdminClient()

  await admin.from('notifications').insert({ user_id: userId, title, body, link })

  const { data: profile } = await admin
    .from('profiles')
    .select('telegram_chat_id')
    .eq('id', userId)
    .single()

  if (profile?.telegram_chat_id) {
    await sendTelegramMessage(
      profile.telegram_chat_id,
      `🔔 <b>${title}</b>\n${body}`
    )
  }
}
