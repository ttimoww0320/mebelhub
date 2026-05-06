import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { G, BG, BG2, BORDER, TEXT, DIM, MUTE, MONO, HEAD, SUCCESS } from '@/lib/tokens'

const STATUS_COLOR: Record<string, string> = {
  in_progress: G,
  completed:   SUCCESS,
  cancelled:   'rgba(248,113,113,0.8)',
}
const STATUS_RU: Record<string, string> = {
  in_progress: 'В работе',
  completed:   'Завершён',
  cancelled:   'Отменён',
}

export default async function CraftsmanMyOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: offers } = await supabase
    .from('offers')
    .select('*, order:orders(*, customer:profiles!customer_id(full_name))')
    .eq('craftsman_id', user.id)
    .order('created_at', { ascending: false })

  const allOffers = offers ?? []
  const accepted   = allOffers.filter((o: any) => o.status === 'accepted' && o.order?.status === 'in_progress')
  const completed  = allOffers.filter((o: any) => o.order?.status === 'completed')
  const pending    = allOffers.filter((o: any) => o.status === 'pending')
  const rejected   = allOffers.filter((o: any) => o.status === 'rejected')

  return (
    <div style={{ background: BG, color: TEXT, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ padding: '40px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 10 }}>§ МОИ ЗАКАЗЫ</div>
          <h1 style={{ fontFamily: HEAD, fontSize: 60, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
            Мои <em style={{ color: G }}>заказы</em>
          </h1>
        </div>
        <Link href="/dashboard" style={{ fontSize: 13, color: DIM, textDecoration: 'none', border: `1px solid ${BORDER}`, padding: '10px 18px', borderRadius: 2 }}>
          ← Лента заказов
        </Link>
      </div>

      {/* Stats */}
      <div style={{ padding: '40px 40px 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, background: BORDER }}>
        {([
          [String(accepted.length),  'в работе',   'активных'],
          [String(completed.length), 'завершено',  'заказов'],
          [String(pending.length),   'ожидают',    'ответа заказчика'],
          [String(rejected.length),  'отклонено',  'предложений'],
        ] as const).map(([n, l1, l2], i) => (
          <div key={i} style={{ background: BG, padding: 28 }}>
            <div style={{ fontFamily: HEAD, fontSize: 52, fontWeight: 300, letterSpacing: '-0.02em', color: G }}>{n}</div>
            <div style={{ fontSize: 12, color: DIM, marginTop: 6 }}>{l1}</div>
            <div style={{ fontSize: 11, color: MUTE, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{l2}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '40px' }}>
        {allOffers.length === 0 ? (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <div style={{ fontFamily: HEAD, fontSize: 36, fontWeight: 300, marginBottom: 16, color: DIM }}>
              Вы ещё не отправляли предложений
            </div>
            <Link href="/dashboard" style={{ background: G, color: BG, textDecoration: 'none', padding: '14px 24px', fontSize: 13, fontWeight: 600, borderRadius: 2 }}>
              Перейти в ленту заказов →
            </Link>
          </div>
        ) : (
          <>
            {accepted.length > 0 && (
              <Section title="В работе" color={G} offers={accepted} />
            )}
            {pending.length > 0 && (
              <Section title="Ожидают ответа" color={DIM} offers={pending} />
            )}
            {completed.length > 0 && (
              <Section title="Завершённые" color={SUCCESS} offers={completed} />
            )}
            {rejected.length > 0 && (
              <Section title="Отклонённые" color="rgba(248,113,113,0.7)" offers={rejected} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Section({ title, color, offers }: { title: string; color: string; offers: any[] }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
        <div style={{ fontFamily: MONO, fontSize: 11, color, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          {title} · {offers.length}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {offers.map((offer: any, i: number) => {
          const order = offer.order
          if (!order) return null
          const statusColor = STATUS_COLOR[order.status] ?? DIM
          return (
            <Link key={offer.id} href={`/orders/${order.id}`} style={{
              padding: '24px 0',
              borderTop: `1px solid ${BORDER}`,
              ...(i === offers.length - 1 ? { borderBottom: `1px solid ${BORDER}` } : {}),
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 24, alignItems: 'center',
              textDecoration: 'none', color: TEXT,
            }}>
              <div>
                <div style={{ fontFamily: HEAD, fontSize: 20, marginBottom: 4 }}>{order.title}</div>
                <div style={{ fontSize: 12, color: MUTE }}>
                  Заказчик: {order.customer?.full_name}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: statusColor, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {STATUS_RU[order.status] ?? order.status}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: HEAD, fontSize: 20, color: G }}>${Number(offer.price).toLocaleString()}</div>
                <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>{offer.delivery_days} дней</div>
              </div>
              <div style={{ fontSize: 18, color: DIM }}>→</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
