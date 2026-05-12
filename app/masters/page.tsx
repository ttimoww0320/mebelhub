export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Мастера мебели в Ташкенте — MebelHub',
  description: 'Проверенные мастера по изготовлению мебели на заказ. Рейтинги, портфолио, верификация.',
}

import MastersList from '@/components/masters-list'
import PublicNav from '@/components/public-nav'
import { createAdminClient } from '@/lib/supabase/admin'
import { G, BG, BORDER, TEXT, DIM, MONO, HEAD } from '@/lib/tokens'

export default async function MastersPage() {
  const admin = createAdminClient()
  const { data: masters } = await admin
    .from('profiles')
    .select('id, full_name, company_name, bio, rating, reviews_count, verified, verification_status, works(count)')
    .eq('role', 'craftsman')
    .eq('verified', true)
    .order('rating', { ascending: false })

  const list = masters ?? []

  return (
    <div style={{ background:BG, color:TEXT, minHeight:'100vh' }}>
      <PublicNav />

      <div style={{ padding:'60px 40px 40px', borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ fontFamily:MONO, fontSize:11, color:G, letterSpacing:'0.14em', marginBottom:16 }}>
          § МАСТЕРА / {list.length}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'end', gap:40 }}>
          <h1 style={{ fontFamily:HEAD, fontSize:76, fontWeight:300, letterSpacing:'-0.03em', lineHeight:0.95, margin:0 }}>
            Мебельщики<br/><em style={{ color:G }}>Ташкента</em>
          </h1>
          <div style={{ fontSize:15, color:DIM, maxWidth:440, lineHeight:1.55 }}>
            Все мастера проходят проверку: документы, мастерская, минимум 5 выполненных работ с отзывами.
          </div>
        </div>
      </div>

      <MastersList masters={list} />
    </div>
  )
}
