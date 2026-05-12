export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'
import AdminVerifyButtons from '../verify-buttons'

export default async function AdminVerificationPage() {
  const admin = createAdminClient()

  const { data: pending } = await admin
    .from('profiles')
    .select('id, full_name, phone, bio, rating, reviews_count, verification_doc_url, created_at')
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: true })

  const { data: recent } = await admin
    .from('profiles')
    .select('id, full_name, verified, verification_status, created_at')
    .in('verification_status', ['verified', 'rejected'])
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Верификация мастеров</h1>
      <p className="text-sm text-gray-400 mb-8">
        Заявок на рассмотрении: <span className="font-semibold text-orange-600">{pending?.length ?? 0}</span>
      </p>

      {/* Pending */}
      {!pending?.length ? (
        <div className="bg-white rounded-xl border border-gray-100 text-center py-16 text-gray-400 text-sm mb-8">
          Нет заявок на верификацию
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-10">
          {pending.map((craftsman) => (
            <div key={craftsman.id} className="bg-white rounded-xl border border-orange-100 p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="font-semibold text-lg text-gray-900">{craftsman.full_name}</div>
                  {craftsman.phone && <div className="text-sm text-gray-500 mt-1">{craftsman.phone}</div>}
                  {craftsman.bio && (
                    <div className="text-sm text-gray-600 mt-2 max-w-lg line-clamp-2">{craftsman.bio}</div>
                  )}
                  <div className="text-xs text-gray-400 mt-2">
                    Регистрация: {new Date(craftsman.created_at).toLocaleDateString('ru-RU')}
                    {(craftsman.rating ?? 0) > 0 && ` · ★ ${craftsman.rating} (${craftsman.reviews_count} отз.)`}
                  </div>
                  {craftsman.verification_doc_url && (
                    <a
                      href={craftsman.verification_doc_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-sm text-orange-600 hover:underline"
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

      {/* Recent decisions */}
      {(recent?.length ?? 0) > 0 && (
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Последние решения</div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {recent?.map((c, i) => (
              <div key={c.id} className={`flex items-center justify-between px-5 py-3.5 ${i !== 0 ? 'border-t border-gray-50' : ''}`}>
                <div className="text-sm text-gray-700">{c.full_name}</div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  c.verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {c.verified ? 'Одобрен' : 'Отклонён'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
