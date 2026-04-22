import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Order } from '@/types'
import Filters from './filters'

export default async function CraftsmanDashboard({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; budget?: string }>
}) {
  const { type, budget } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: craftsmanProfile } = user
    ? await supabase.from('profiles').select('full_name, rating, reviews_count, verified, verification_status').eq('id', user.id).single()
    : { data: null }

  let query = supabase
    .from('orders')
    .select('*, customer:profiles!customer_id(full_name), offers(count)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(20)

  if (type) query = query.eq('furniture_type', type)
  if (budget) query = query.lte('budget_max', Number(budget))

  const { data: orders } = await query

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Лента заказов</h1>
          <p className="text-gray-500 text-sm mt-1">Открытые заказы от заказчиков Ташкента</p>
        </div>
        {craftsmanProfile && (
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 text-sm">
            {(craftsmanProfile.rating ?? 0) > 0 ? (
              <span className="text-yellow-600 font-semibold">★ {Number(craftsmanProfile.rating).toFixed(1)}</span>
            ) : (
              <span className="text-gray-400">Нет рейтинга</span>
            )}
            {craftsmanProfile.reviews_count > 0 && (
              <span className="text-gray-400">{craftsmanProfile.reviews_count} отзывов</span>
            )}
            {craftsmanProfile.verified && (
              <span className="text-green-600 font-medium">✓ Проверен</span>
            )}
            {!craftsmanProfile.verified && craftsmanProfile.verification_status === 'none' && (
              <Link href="/profile" className="text-orange-500 hover:underline">Пройти верификацию →</Link>
            )}
          </div>
        )}
      </div>
      <Suspense>
        <Filters />
      </Suspense>

      {!orders?.length ? (
        <div className="text-center py-20 text-gray-400">
          <p>Пока нет открытых заказов</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link href={`/orders/${order.id}`} key={order.id}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.title}</CardTitle>
                      <p className="text-sm text-gray-400 mt-1">
                        от {(order.customer as any)?.full_name}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Открыт</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{order.description}</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="bg-gray-100 px-2 py-1 rounded">{order.furniture_type}</span>
                    {order.style && <span className="bg-gray-100 px-2 py-1 rounded">{order.style}</span>}
                    {(order.width_cm || order.height_cm) && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {[order.width_cm, order.height_cm, order.depth_cm].filter(Boolean).join(' × ')} см
                      </span>
                    )}
                    {order.budget_max && (
                      <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded font-medium">
                        до {Number(order.budget_max).toLocaleString()} сум
                      </span>
                    )}
                    <span className="text-gray-400">
                      {(order.offers as any)?.[0]?.count || 0} офферов
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
