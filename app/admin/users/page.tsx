export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'
import BlockButton from './block-button'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; q?: string }>
}) {
  const { role, q } = await searchParams
  const admin = createAdminClient()

  let query = admin
    .from('profiles')
    .select('id, email, full_name, company_name, role, verified, verification_status, blocked, created_at, telegram_chat_id')
    .order('created_at', { ascending: false })

  if (role === 'customer' || role === 'craftsman') query = query.eq('role', role)
  if (q) query = query.ilike('full_name', `%${q}%`)

  const { data: users } = await query.limit(100)

  const roleLabels: Record<string, string> = { customer: 'Заказчик', craftsman: 'Мастер' }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Пользователи</h1>
      <p className="text-sm text-gray-400 mb-6">{users?.length ?? 0} найдено</p>

      {/* Filters */}
      <form className="flex gap-3 mb-6 flex-wrap">
        <input
          name="q"
          defaultValue={q}
          placeholder="Поиск по имени..."
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-orange-400 w-56"
        />
        <select
          name="role"
          defaultValue={role || ''}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-orange-400 bg-white"
        >
          <option value="">Все роли</option>
          <option value="customer">Заказчики</option>
          <option value="craftsman">Мастера</option>
        </select>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-5 py-2 rounded-lg transition-colors"
        >
          Найти
        </button>
        {(role || q) && (
          <a href="/admin/users" className="text-sm text-gray-400 hover:text-gray-600 flex items-center px-2">
            Сбросить
          </a>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Имя</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Роль</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Статус</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Telegram</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Дата</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, i) => (
              <tr key={user.id} className={`${i !== 0 ? 'border-t border-gray-50' : ''} ${user.blocked ? 'opacity-50' : ''}`}>
                <td className="px-5 py-3.5">
                  <div className="font-medium text-gray-900">{user.full_name}</div>
                  {user.company_name && <div className="text-xs text-gray-400">{user.company_name}</div>}
                </td>
                <td className="px-5 py-3.5 text-gray-500">{user.email}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    user.role === 'craftsman' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {user.role === 'craftsman' && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      user.verified ? 'bg-green-100 text-green-700' :
                      user.verification_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {user.verified ? 'Верифицирован' :
                       user.verification_status === 'pending' ? 'На проверке' : 'Не верифицирован'}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  {user.telegram_chat_id
                    ? <span className="text-xs text-green-600 font-medium">✓ Подключён</span>
                    : <span className="text-xs text-gray-300">—</span>
                  }
                </td>
                <td className="px-5 py-3.5 text-gray-400 text-xs">
                  {new Date(user.created_at).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-5 py-3.5">
                  <BlockButton userId={user.id} blocked={user.blocked ?? false} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!users?.length && (
          <div className="text-center py-16 text-gray-400 text-sm">Пользователей не найдено</div>
        )}
      </div>
    </div>
  )
}
