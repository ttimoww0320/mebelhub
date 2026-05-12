export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminDashboard() {
  const admin = createAdminClient()

  const [
    { count: totalUsers },
    { count: totalCustomers },
    { count: totalCraftsmen },
    { count: verifiedCraftsmen },
    { count: pendingVerification },
    { count: totalOrders },
    { count: openOrders },
    { count: inProgressOrders },
    { count: completedOrders },
    { count: totalOffers },
    { count: totalReviews },
    { count: paidPayments },
  ] = await Promise.all([
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    admin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'craftsman'),
    admin.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'craftsman').eq('verified', true),
    admin.from('profiles').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending'),
    admin.from('orders').select('*', { count: 'exact', head: true }),
    admin.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    admin.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
    admin.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    admin.from('offers').select('*', { count: 'exact', head: true }),
    admin.from('reviews').select('*', { count: 'exact', head: true }),
    admin.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'paid'),
  ])

  // Recent activity - last 10 orders
  const { data: recentOrders } = await admin
    .from('orders')
    .select('id, title, status, created_at, customer:profiles!customer_id(full_name)')
    .order('created_at', { ascending: false })
    .limit(8)

  const statusColors: Record<string, string> = {
    open:        'bg-blue-100 text-blue-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    completed:   'bg-green-100 text-green-700',
    cancelled:   'bg-red-100 text-red-700',
  }
  const statusLabels: Record<string, string> = {
    open: 'Открыт', in_progress: 'В работе', completed: 'Завершён', cancelled: 'Отменён',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Статистика</h1>
      <p className="text-sm text-gray-400 mb-8">Общий обзор платформы</p>

      {/* Users */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Пользователи</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Всего',          value: totalUsers,          color: 'text-gray-900' },
            { label: 'Заказчиков',     value: totalCustomers,      color: 'text-blue-600' },
            { label: 'Мастеров',       value: totalCraftsmen,      color: 'text-purple-600' },
            { label: 'Верифицировано', value: verifiedCraftsmen,   color: 'text-green-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-5 border border-gray-100">
              <div className={`text-3xl font-bold ${color}`}>{value ?? 0}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Заказы</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Всего',      value: totalOrders,      color: 'text-gray-900' },
            { label: 'Открытых',   value: openOrders,       color: 'text-blue-600' },
            { label: 'В работе',   value: inProgressOrders, color: 'text-yellow-600' },
            { label: 'Завершено',  value: completedOrders,  color: 'text-green-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-5 border border-gray-100">
              <div className={`text-3xl font-bold ${color}`}>{value ?? 0}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Other metrics */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Активность</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Офферов подано',       value: totalOffers,       color: 'text-gray-900' },
            { label: 'Отзывов',              value: totalReviews,      color: 'text-gray-900' },
            { label: 'Платежей прошло',      value: paidPayments,      color: 'text-green-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-5 border border-gray-100">
              <div className={`text-3xl font-bold ${color}`}>{value ?? 0}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending verification alert */}
      {(pendingVerification ?? 0) > 0 && (
        <div className="mb-8 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="font-semibold text-orange-800">
              {pendingVerification} заявок на верификацию
            </span>
            <span className="text-orange-600 text-sm ml-2">ожидают проверки</span>
          </div>
          <a href="/admin/verification" className="text-sm font-medium text-orange-700 hover:underline">
            Проверить →
          </a>
        </div>
      )}

      {/* Recent orders */}
      <div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Последние заказы</div>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {recentOrders?.map((order, i) => (
            <div key={order.id} className={`flex items-center justify-between px-5 py-3.5 ${i !== 0 ? 'border-t border-gray-50' : ''}`}>
              <div>
                <div className="text-sm font-medium text-gray-900">{order.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {(order.customer as any)?.full_name} · {new Date(order.created_at).toLocaleDateString('ru-RU')}
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                {statusLabels[order.status]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
