import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ADMIN_TELEGRAM_ID = process.env.ADMIN_TELEGRAM_ID
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { docUrl } = await req.json()
  const admin = createAdminClient()

  await admin.from('profiles').update({
    verification_status: 'pending',
    verification_doc_url: docUrl,
  }).eq('id', user.id)

  const { data: profile } = await admin
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  // Notify admin via Telegram
  if (ADMIN_TELEGRAM_ID && TELEGRAM_BOT_TOKEN) {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_TELEGRAM_ID,
        text: `📋 Новая заявка на верификацию!\n\nМастер: ${profile?.full_name}\nID: ${user.id}\n\nПроверьте на: https://mebelhub-production.up.railway.app/admin`,
      }),
    })
  }

  return NextResponse.json({ ok: true })
}
