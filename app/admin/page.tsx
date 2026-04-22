import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import AdminVerifyButtons from './verify-buttons'

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">Панель администратора</h1>
      <p className="text-gray-500 text-sm mb-8">Верификация мастеров</p>

      {!pending?.length ? (
        <div className="text-center py-20 text-gray-400">
          <p>Нет заявок на верификацию</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((craftsman: any) => (
            <div key={craftsman.id} className="border rounded-xl p-5 bg-white shadow-sm">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-semibold text-lg">{craftsman.full_name}</p>
                  {craftsman.phone && <p className="text-sm text-gray-500">{craftsman.phone}</p>}
                  {craftsman.bio && (
                    <p className="text-sm text-gray-600 mt-1 max-w-md line-clamp-2">{craftsman.bio}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Регистрация: {new Date(craftsman.created_at).toLocaleDateString('ru-RU')}
                    {(craftsman.rating ?? 0) > 0 && ` · ★ ${craftsman.rating} (${craftsman.reviews_count} отзывов)`}
                  </p>
                </div>
                <AdminVerifyButtons craftsmanId={craftsman.id} />
              </div>

              {craftsman.verification_doc_url && (
                <div className="mt-4">
                  <p className="text-xs text-gray-400 mb-2">Документ:</p>
                  <a
                    href={craftsman.verification_doc_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline text-sm"
                  >
                    Открыть документ →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
