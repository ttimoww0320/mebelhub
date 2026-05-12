export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import AdminVerifyButtons from './verify-buttons'
import { G, BG, BG2, BORDER, BORDER2, TEXT, DIM, MUTE, MONO, HEAD } from '@/lib/tokens'

const ADMIN_EMAIL = 'toirovtimurmalik@gmail.com'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== ADMIN_EMAIL) redirect('/login')

  const admin = createAdminClient()

  const { data: pending } = await admin
    .from('profiles')
    .select('id, full_name, phone, bio, rating, reviews_count, verification_doc_url, created_at')
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: true })

  return (
    <div style={{ background: BG, color: TEXT, minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>

        <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 16 }}>
          § АДМИНИСТРАТОР
        </div>
        <h1 style={{ fontFamily: HEAD, fontSize: 48, fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
          Верификация мастеров
        </h1>
        <p style={{ color: DIM, fontSize: 14, margin: '0 0 48px' }}>
          Заявок на рассмотрении: {pending?.length ?? 0}
        </p>

        {!pending?.length ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: MUTE }}>
            <div style={{ fontFamily: HEAD, fontSize: 28, fontWeight: 300, marginBottom: 8 }}>Заявок нет</div>
            <div style={{ fontSize: 13 }}>Все заявки обработаны</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: BORDER }}>
            {pending.map((craftsman) => (
              <div key={craftsman.id} style={{ background: BG2, padding: '28px 32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: HEAD, fontSize: 22, marginBottom: 6 }}>{craftsman.full_name}</div>
                    {craftsman.phone && (
                      <div style={{ fontSize: 13, color: DIM, marginBottom: 4 }}>{craftsman.phone}</div>
                    )}
                    {craftsman.bio && (
                      <div style={{ fontSize: 13, color: DIM, lineHeight: 1.5, maxWidth: 480, marginBottom: 8 }}>
                        {craftsman.bio.slice(0, 160)}{craftsman.bio.length > 160 ? '…' : ''}
                      </div>
                    )}
                    <div style={{ fontFamily: MONO, fontSize: 11, color: MUTE, letterSpacing: '0.06em' }}>
                      Регистрация: {new Date(craftsman.created_at).toLocaleDateString('ru-RU')}
                      {(craftsman.rating ?? 0) > 0 && ` · ★ ${craftsman.rating} (${craftsman.reviews_count} отз.)`}
                    </div>
                    {craftsman.verification_doc_url && (
                      <a
                        href={craftsman.verification_doc_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-block', marginTop: 12, fontSize: 12, color: G, textDecoration: 'none', border: `1px solid ${BORDER2}`, padding: '6px 14px', borderRadius: 2 }}
                      >
                        Открыть документ →
                      </a>
                    )}
                  </div>
                  <AdminVerifyButtons craftsmanId={craftsman.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
