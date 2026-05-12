export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

const STATUS_LABELS: Record<string, string> = {
  open: 'Открыт', in_progress: 'В работе', completed: 'Завершён', cancelled: 'Отменён',
}
const STATUS_COLORS: Record<string, string> = {
  open:        'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed:   'bg-green-100 text-green-700',
  cancelled:   'bg-red-100 text-red-700',
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const admin = createAdminClient()

  let query = admin
    .from('orders')
    .select('id, title, furniture_type, budget_max, status, created_at, customer:profiles!customer_id(full_name), offers(count)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (status) query = query.eq('status', status)

  const { data: orders } = await query

  const tabs = [
    { value: '',            label: 'Все' },
    { value: 'open',        label: 'Открытые' },
    { value: 'in_progress', label: 'В работе' },
    { value: 'completed',   label: 'Завершённые' },
    { value: 'cancelled',   label: 'Отменённые' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Заказы</h1>
      <p className="text-sm text-gray-400 mb-6">{orders?.length ?? 0} найдено</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 flex-wrap">
        {tabs.map(tab => (
          <a
            key={tab.value}
            href={tab.value ? `/admin/orders?status=${tab.value}` : '/admin/orders'}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              (status || '') === tab.value
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Заказ</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Заказчик</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Бюджет</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Офферов</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Статус</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Дата</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order, i) => {
              const offersCount = (order.offers as any)?.[0]?.count ?? 0
              return (
                <tr key={order.id} className={i !== 0 ? 'border-t border-gray-50' : ''}>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-gray-900 max-w-[200px] truncate">{order.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{order.furniture_type}</div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {(order.customer as any)?.full_name ?? '—'}
                  </td>
                  <td className="px-5 py-3.5 text-gray-700 font-medium">
                    {order.budget_max ? `$${Number(order.budget_max).toLocaleString()}` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{offersCount}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">
                    {new Date(order.created_at).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/orders/${order.id}`}
                      target="_blank"
                      className="text-xs text-orange-600 hover:underline"
                    >
                      Открыть →
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {!orders?.length && (
          <div className="text-center py-16 text-gray-400 text-sm">Заказов не найдено</div>
        )}
      </div>
    </div>
  )
}
