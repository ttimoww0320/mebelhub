import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = crypto.randomBytes(16).toString('hex')
  const admin = createAdminClient()
  await admin.from('profiles').update({ telegram_token: token }).eq('id', user.id)

  const botUsername = 'Mebel_Hubb_Bot'
  const url = `https://t.me/${botUsername}?start=${token}`

  return NextResponse.json({ url })
}
