import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PublicNav from '@/components/public-nav'
import TelegramBanner from '@/components/telegram-banner'

export const dynamic = 'force-dynamic'

export default async function CraftsmanLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'craftsman') redirect('/orders')

  return (
    <div>
      <PublicNav />
      <TelegramBanner />
      <main>{children}</main>
    </div>
  )
}
