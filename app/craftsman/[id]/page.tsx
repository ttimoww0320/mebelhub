import { notFound } from 'next/navigation'
import Link from 'next/link'
import PublicNav from '@/components/public-nav'
import { createAdminClient } from '@/lib/supabase/admin'
import { G, BG, BG2, BORDER, BORDER2, TEXT, DIM, MUTE, MONO, HEAD, SUCCESS } from '@/lib/tokens'

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase()
}

const ACCENTS = ['#1a1f2e', '#1f2a1a', '#2a1a1a', '#1a2a2a', '#2a1f10', '#1a1a2a']
function accent(id: string) {
  const n = id.charCodeAt(0) + id.charCodeAt(id.length - 1)
  return ACCENTS[n % ACCENTS.length]
}

export default async function CraftsmanPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const [{ data: master }, { data: works }] = await Promise.all([
    admin.from('profiles')
      .select('id, full_name, company_name, bio, rating, reviews_count, verified, verification_status, phone')
      .eq('id', id)
      .eq('role', 'craftsman')
      .maybeSingle(),
    admin.from('works')
      .select('*')
      .eq('craftsman_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!master) notFound()

  const displayName = master.company_name || master.full_name

  return (
    <div style={{ background: BG, color: TEXT, minHeight: '100vh' }}>
      <PublicNav />

      {/* Breadcrumb */}
      <div className="px-page" style={{ paddingTop: 20, paddingBottom: 20, fontFamily: MONO, fontSize: 11, color: MUTE, letterSpacing: '0.1em' }}>
        <Link href="/masters" style={{ color: MUTE, textDecoration: 'none' }}>МАСТЕРА</Link>
        {' / '}
        <span style={{ color: G }}>{displayName.toUpperCase()}</span>
      </div>

      {/* Hero */}
      <div className="grid-2 px-page" style={{ paddingTop: 40, paddingBottom: 60, borderBottom: `1px solid ${BORDER}`, gap: 60 }}>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1, background: accent(master.id), border: `1px solid ${BORDER2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ fontFamily: HEAD, fontSize: 96, color: G, fontStyle: 'italic', fontWeight: 300 }}>{initials(master.full_name)}</div>
            {master.verified && (
              <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: MONO, fontSize: 10, color: G, letterSpacing: '0.1em', border: `1px solid ${G}`, padding: '4px 10px', background: BG }}>
                ✓ ПРОВЕРЕН
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div style={{ fontSize: 13, color: G, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
              {master.verified ? 'Верифицированный мастер' : 'Мастер'}
            </div>
            <h1 style={{ fontFamily: HEAD, fontSize: 72, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 0.95, margin: 0 }}>
              {displayName}
            </h1>
            <div style={{ display: 'flex', gap: 20, marginTop: 20, fontSize: 14, color: DIM }}>
              <span><span style={{ color: G }}>★ {master.rating ?? '—'}</span> · {master.reviews_count ?? 0} отзывов</span>
              <span>·</span>
              <span>{works?.length ?? 0} работ в портфолио</span>
            </div>
          </div>

          <div style={{ padding: '24px 0', borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: MUTE, letterSpacing: '0.1em', marginBottom: 8 }}>СТАТУС</div>
            <div style={{ fontSize: 14, color: master.verified ? SUCCESS : MUTE }}>
              {master.verified
                ? '● Профиль верифицирован — документы проверены администратором'
                : master.verification_status === 'pending'
                ? '○ Заявка на верификацию на рассмотрении'
                : '○ Профиль не верифицирован'}
            </div>
          </div>

          {master.bio && (
            <div>
              <div style={{ fontFamily: MONO, fontSize: 11, color: MUTE, letterSpacing: '0.1em', marginBottom: 12 }}>О КОМПАНИИ</div>
              <p style={{ fontSize: 15, color: DIM, lineHeight: 1.7, margin: 0 }}>{master.bio}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 14 }}>
            <Link href={`/orders/new?craftsman=${master.id}`} style={{ background: G, color: BG, padding: '16px 24px', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textDecoration: 'none', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 14 }}>
              Заказать проект <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Portfolio */}
      <div className="px-page" style={{ paddingTop: 60, paddingBottom: 80 }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 8 }}>§ ПОРТФОЛИО</div>
        <h2 style={{ fontFamily: HEAD, fontSize: 48, fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 40px' }}>
          Работы <em style={{ color: G }}>мастера</em>
        </h2>

        {!works?.length ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: MUTE, fontSize: 14 }}>
            Мастер пока не добавил работы
          </div>
        ) : (
          <div className="grid-3" style={{ gap: 2, background: BORDER }}>
            {works.map(work => (
              <div key={work.id} style={{ background: BG, display: 'flex', flexDirection: 'column' }}>
                {work.image_url && (
                  <img src={work.image_url} alt={work.title}
                    style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
                )}
                <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontFamily: HEAD, fontSize: 22, fontStyle: 'italic' }}>{work.title}</div>
                  <div style={{ fontSize: 11, color: G, fontFamily: MONO, letterSpacing: '0.1em' }}>{work.category}</div>
                  {work.description && (
                    <div style={{ fontSize: 13, color: DIM, lineHeight: 1.6 }}>{work.description}</div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 16 }}>
                    {work.price ? (
                      <div style={{ fontSize: 16, color: G, fontFamily: HEAD }}>{Number(work.price).toLocaleString()} сум</div>
                    ) : <div />}
                    <Link
                      href={`/orders/new?title=${encodeURIComponent('Похожее на: ' + work.title)}`}
                      style={{ fontSize: 11, color: G, border: `1px solid ${G}`, padding: '8px 14px', textDecoration: 'none', fontFamily: MONO, letterSpacing: '0.08em' }}
                    >
                      ЗАКАЗАТЬ ПОХОЖЕЕ →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
