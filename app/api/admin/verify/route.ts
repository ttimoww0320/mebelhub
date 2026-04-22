import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

const ADMIN_EMAIL = 'toirovtimurmalik@gmail.com'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { craftsmanId, action } = await req.json()
  if (!craftsmanId || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const admin = createAdminClient()

  const updates =
    action === 'approve'
      ? { verified: true, verification_status: 'verified' }
      : { verified: false, verification_status: 'rejected' }

  const { error } = await admin.from('profiles').update(updates).eq('id', craftsmanId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notify craftsman via Telegram if connected
  const { data: profile } = await admin
    .from('profiles')
    .select('telegram_chat_id, full_name')
    .eq('id', craftsmanId)
    .single()

  if (profile?.telegram_chat_id) {
    const msg =
      action === 'approve'
        ? `✅ Поздравляем, ${profile.full_name}! Ваш профиль на MebelHub верифицирован. Теперь у вас есть бейдж "Проверен ✓".`
        : `❌ ${profile.full_name}, ваш документ для верификации на MebelHub был отклонён. Пожалуйста, загрузите другой документ в профиле.`

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: profile.telegram_chat_id, text: msg }),
    })
  }

  return NextResponse.json({ ok: true })
}
