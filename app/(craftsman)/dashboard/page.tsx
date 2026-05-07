import Link from 'next/link'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { G, BG, BG2, BORDER, TEXT, DIM, MUTE, MONO, HEAD } from '@/lib/tokens'
import Filters from './filters'

export default async function CraftsmanDashboard({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; budget?: string }>
}) {
  const { type, budget } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { count: offersSent }, { count: activeCount }] = await Promise.all([
    supabase.from('profiles').select('full_name, company_name, rating, reviews_count, verified, verification_status').eq('id', user.id).maybeSingle(),
    supabase.from('offers').select('id', { count: 'exact', head: true }).eq('craftsman_id', user.id),
    supabase.from('offers').select('id', { count: 'exact', head: true }).eq('craftsman_id', user.id).eq('status', 'accepted'),
  ])

  let query = supabase
    .from('orders')
    .select('*, customer:profiles!customer_id(full_name), offers(count)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(20)

  if (type) query = query.eq('furniture_type', type)
  if (budget) query = query.lte('budget_max', Number(budget))

  const { data: orders } = await query

  const firstName = (profile as any)?.company_name || profile?.full_name?.split(' ')[0] || 'Мастер'
  const vs = (profile as any)?.verification_status || 'none'

  return (
    <div style={{ background: BG, color: TEXT, minHeight: '100vh' }}>

      {/* Header */}
      <div className="px-page" style={{ paddingTop: 40, paddingBottom: 40, borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 10 }}>§ ЛЕНТА ЗАКАЗОВ</div>
          <h1 style={{ fontFamily: HEAD, fontSize: 60, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
            Привет, <em style={{ color: G }}>{firstName}</em>
          </h1>
        </div>
        <Link href="/profile" style={{ fontSize: 13, color: DIM, textDecoration: 'none', border: `1px solid ${BORDER}`, padding: '10px 18px', borderRadius: 2 }}>
          Мой профиль →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid-4 px-page" style={{ paddingTop: 40, gap: 2, background: BORDER }}>
        {([
          [String(orders?.length ?? 0),  'открытых',  'заказов сейчас'],
          [String(offersSent ?? 0),       'офферов',   'отправлено всего'],
          [String(activeCount ?? 0),      'в работе',  'прямо сейчас'],
          [profile?.rating ? Number(profile.rating).toFixed(1) : '—', 'рейтинг', `${profile?.reviews_count ?? 0} отзывов`],
        ] as const).map(([n, l1, l2], i) => (
          <div key={i} style={{ background: BG, padding: 28 }}>
            <div style={{ fontFamily: HEAD, fontSize: 52, fontWeight: 300, letterSpacing: '-0.02em', color: G }}>{n}</div>
            <div style={{ fontSize: 12, color: DIM, marginTop: 6 }}>{l1}</div>
            <div style={{ fontSize: 11, color: MUTE, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{l2}</div>
          </div>
        ))}
      </div>

      {/* Verification banner */}
      {vs === 'none' && (
        <div className="px-page" style={{ marginTop: 32, padding: '20px 24px', border: `1px solid ${G}`, background: 'rgba(228,182,104,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: G, letterSpacing: '0.12em', marginBottom: 6 }}>◆ ВЕРИФИКАЦИЯ</div>
            <div style={{ fontSize: 14, color: TEXT }}>Пройдите верификацию — заказчики доверяют проверенным мастерам больше</div>
          </div>
          <Link href="/profile" style={{ background: G, color: BG, textDecoration: 'none', padding: '10px 18px', fontSize: 12, fontWeight: 600, borderRadius: 2, whiteSpace: 'nowrap' }}>
            Пройти верификацию →
          </Link>
        </div>
      )}
      {vs === 'pending' && (
        <div className="px-page" style={{ marginTop: 32, padding: '20px 24px', border: `1px solid rgba(250,204,21,0.4)`, background: 'rgba(250,204,21,0.04)' }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(250,204,21,0.8)', letterSpacing: '0.12em', marginBottom: 6 }}>◆ ВЕРИФИКАЦИЯ НА ПРОВЕРКЕ</div>
          <div style={{ fontSize: 14, color: DIM }}>Ваш документ на проверке. Мы уведомим вас в Telegram в течение 1–2 дней.</div>
        </div>
      )}

      {/* Orders feed */}
      <div className="px-page" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 24 }}>§ ОТКРЫТЫЕ ЗАКАЗЫ</div>
        <Suspense>
          <Filters />
        </Suspense>

        {!orders?.length ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: MUTE }}>
            <div style={{ fontFamily: HEAD, fontSize: 32, fontWeight: 300 }}>Заказов по фильтру нет</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {orders.map((order, i) => {
              const offersCount = (order.offers as any)?.[0]?.count ?? 0
              return (
                <Link key={order.id} href={`/orders/${order.id}`} className="order-row-d" style={{
                  padding: '28px 0',
                  borderTop: `1px solid ${BORDER}`,
                  ...(i === orders.length - 1 ? { borderBottom: `1px solid ${BORDER}` } : {}),
                  textDecoration: 'none', color: TEXT,
                }}>
                  <div>
                    <div style={{ fontFamily: HEAD, fontSize: 22, marginBottom: 6 }}>{order.title}</div>
                    <div style={{ fontSize: 12, color: MUTE, lineHeight: 1.5 }}>
                      {order.description?.slice(0, 80)}{order.description?.length > 80 ? '…' : ''}
                    </div>
                  </div>
                  <div className="mob-hide">
                    <div style={{ fontSize: 12, color: DIM }}>{order.furniture_type}</div>
                    {order.style && <div style={{ fontSize: 11, color: MUTE, marginTop: 4 }}>{order.style}</div>}
                  </div>
                  <div className="mob-hide">
                    <div style={{ fontFamily: HEAD, fontSize: 20, color: G }}>
                      {order.budget_max ? `$${Number(order.budget_max).toLocaleString()}` : '—'}
                    </div>
                    <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>бюджет</div>
                  </div>
                  <div className="mob-hide">
                    <div style={{ fontSize: 13, color: DIM }}>{offersCount} офферов</div>
                  </div>
                  <div style={{ fontSize: 18, color: DIM }}>→</div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
