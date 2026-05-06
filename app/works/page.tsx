import Link from 'next/link'
import PublicNav from '@/components/public-nav'
import { createAdminClient } from '@/lib/supabase/admin'
import { G, BG, BG2, BORDER, TEXT, DIM, MUTE, MONO, HEAD } from '@/lib/tokens'

export default async function WorksPage() {
  const admin = createAdminClient()
  const { data: works } = await admin
    .from('works')
    .select('*, craftsman:profiles!craftsman_id(id, full_name, company_name, verified)')
    .order('created_at', { ascending: false })

  const list = works ?? []

  return (
    <div style={{ background: BG, color: TEXT, minHeight: '100vh' }}>
      <PublicNav />

      {/* Header */}
      <div style={{ padding: '60px 40px 40px', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 16 }}>
          § ПОРТФОЛИО · {list.length} РАБОТ
        </div>
        <h1 style={{ fontFamily: HEAD, fontSize: 76, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 0.95, margin: 0 }}>
          Сделано <em style={{ color: G }}>мастерами</em>
        </h1>
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 40px', color: MUTE, fontSize: 14 }}>
          Мастера ещё не добавили работы. Загляните позже.
        </div>
      ) : (
        <div style={{ padding: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, background: BORDER }}>
          {list.map(work => {
            const craftsman = work.craftsman as any
            const craftsmanName = craftsman?.company_name || craftsman?.full_name || 'Мастер'
            return (
              <div key={work.id} style={{ background: BG, display: 'flex', flexDirection: 'column' }}>
                {work.image_url ? (
                  <img src={work.image_url} alt={work.title}
                    style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '4/3', background: BG2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: MUTE, fontSize: 32 }}>◆</span>
                  </div>
                )}
                <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontFamily: HEAD, fontSize: 22, fontStyle: 'italic' }}>{work.title}</div>
                  <div style={{ fontSize: 11, color: G, fontFamily: MONO, letterSpacing: '0.1em' }}>{work.category}</div>
                  {work.description && (
                    <div style={{ fontSize: 13, color: DIM, lineHeight: 1.6 }}>{work.description.slice(0, 100)}{work.description.length > 100 ? '…' : ''}</div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 16, borderTop: `1px dashed ${BORDER}` }}>
                    <div>
                      {work.price && (
                        <div style={{ fontSize: 16, color: G, fontFamily: HEAD, marginBottom: 4 }}>{Number(work.price).toLocaleString()} сум</div>
                      )}
                      <Link href={`/craftsman/${craftsman?.id}`} style={{ fontSize: 11, color: MUTE, textDecoration: 'none', fontFamily: MONO, letterSpacing: '0.08em' }}>
                        {craftsmanName}{craftsman?.verified ? ' ✓' : ''}
                      </Link>
                    </div>
                    <Link
                      href={`/orders/new?title=${encodeURIComponent('Похожее на: ' + work.title)}`}
                      style={{ fontSize: 11, color: G, border: `1px solid ${G}`, padding: '8px 14px', textDecoration: 'none', fontFamily: MONO, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}
                    >
                      ЗАКАЗАТЬ →
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
