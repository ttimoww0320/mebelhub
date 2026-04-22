import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Order } from '@/types'

const statusLabel: Record<Order['status'], string> = {
  open: 'Открыт',
  in_progress: 'В работе',
  completed: 'Завершён',
  cancelled: 'Отменён',
}

const statusColor: Record<Order['status'], string> = {
  open: 'bg-green-100 text-green-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default async function CustomerOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, offers(count)')
    .eq('customer_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">Мои заказы</h1>
        <Link href="/orders/new">
          <Button className="bg-orange-600 hover:bg-orange-700 text-sm sm:text-base">+ Новый заказ</Button>
        </Link>
      </div>

      {!orders?.length ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-4">У вас пока нет заказов</p>
          <Link href="/orders/new">
            <Button className="bg-orange-600 hover:bg-orange-700">Создать первый заказ</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link href={`/orders/${order.id}`} key={order.id}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{order.title}</CardTitle>
                    <Badge className={statusColor[order.status as Order['status']]}>
                      {statusLabel[order.status as Order['status']]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{order.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{order.furniture_type}</span>
                    {order.budget_max && <span>до {order.budget_max.toLocaleString()} сум</span>}
                    <span>{(order.offers as any)?.[0]?.count || 0} офферов</span>
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
