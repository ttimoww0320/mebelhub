export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { G, BG, BG2, BORDER, TEXT, DIM, MUTE, MONO, HEAD } from '@/lib/tokens'
import type { Order, Offer } from '@/types'

type OrderWithOffers = Order & { offers: Offer[] }

const STATUS_RU: Record<Order['status'], string> = {
  open:        'Сбор офферов',
  in_progress: 'В работе',
  completed:   'Завершён',
  cancelled:   'Отменён',
}

export default async function CustomerOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
    supabase
      .from('orders')
      .select('*, offers(id, status, price, delivery_days, craftsman:profiles!craftsman_id(full_name))')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Привет'
  const allOrders = (orders as OrderWithOffers[] | null) ?? []

  const activeCount   = allOrders.filter(o => o.status === 'open' || o.status === 'in_progress').length
  const offersTotal   = allOrders.reduce((s, o) => s + (o.offers?.length ?? 0), 0)
  const inProgressCount = allOrders.filter(o => o.status === 'in_progress').length

  return (
    <div style={{ background: BG, color: TEXT, minHeight: '100vh' }}>
      <div className="px-page" style={{ paddingTop: 40, paddingBottom: 40, borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 10 }}>§ ЛИЧНЫЙ КАБИНЕТ</div>
          <h1 style={{ fontFamily: HEAD, fontSize: 60, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
            Добро пожаловать,<br /><em style={{ color: G }}>{firstName}</em>
          </h1>
        </div>
        <Link href="/orders/new" style={{ background: G, color: BG, textDecoration: 'none', padding: '14px 22px', fontSize: 13, fontWeight: 600, borderRadius: 2 }}>+ Новый заказ</Link>
      </div>

      {/* Stats row */}
      <div className="grid-4 px-page" style={{ paddingTop: 40, gap: 2, background: BORDER }}>
        {([
          [String(activeCount),      'активных',  'заказов'],
          [String(offersTotal),       'офферов',   'получено'],
          [String(inProgressCount),   'в работе',  'прямо сейчас'],
          [String(allOrders.length),  'заказов',   'всего'],
        ] as const).map(([n, l1, l2], i) => (
          <div key={i} style={{ background: BG, padding: 28 }}>
            <div style={{ fontFamily: HEAD, fontSize: 52, fontWeight: 300, letterSpacing: '-0.02em', color: G }}>{n}</div>
            <div style={{ fontSize: 12, color: DIM, marginTop: 6 }}>{l1}</div>
            <div style={{ fontSize: 11, color: MUTE, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{l2}</div>
          </div>
        ))}
      </div>

      {/* Orders list */}
      <div className="px-page" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 20 }}>§ ВАШИ ЗАКАЗЫ</div>

        {allOrders.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: MUTE }}>
            <div style={{ fontFamily: HEAD, fontSize: 32, fontWeight: 300, marginBottom: 16 }}>Заказов пока нет</div>
            <Link href="/orders/new" style={{ background: G, color: BG, textDecoration: 'none', padding: '14px 22px', fontSize: 13, fontWeight: 600, borderRadius: 2 }}>
              Разместить первый заказ →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {allOrders.map((o, i) => {
              const accepted = o.offers?.find(of => of.status === 'accepted')
              const pendingCount = o.offers?.filter(of => of.status === 'pending').length ?? 0
              const masterName = (accepted as any)?.craftsman?.full_name ?? null

              return (
                <Link key={o.id} href={`/orders/${o.id}`} className="order-row" style={{
                  padding: '28px 0',
                  borderTop: `1px solid ${BORDER}`,
                  ...(i === allOrders.length - 1 ? { borderBottom: `1px solid ${BORDER}` } : {}),
                  textDecoration: 'none', color: TEXT,
                }}>
                  <div>
                    <div style={{ fontFamily: HEAD, fontSize: 24, marginBottom: 6 }}>{o.title}</div>
                    <div style={{ fontSize: 12, color: MUTE }}>
                      {masterName
                        ? `Мастер: ${masterName}`
                        : pendingCount > 0
                          ? `${pendingCount} ${pendingCount === 1 ? 'оффер ожидает' : 'офферов ожидают'} рассмотрения`
                          : 'Ждём офферов от мастеров'}
                    </div>
                  </div>
                  <div className="mob-hide">
                    <div style={{ fontFamily: MONO, fontSize: 10, color: G, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      {STATUS_RU[o.status]}
                    </div>
                  </div>
                  <div className="mob-hide" style={{ fontFamily: HEAD, fontSize: 22, color: accepted ? G : DIM }}>
                    {accepted ? `$${(accepted as any).price?.toLocaleString()}` : o.budget_min ? `$${o.budget_min.toLocaleString()}+` : '—'}
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
