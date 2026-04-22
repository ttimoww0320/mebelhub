import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const statusLabel: Record<string, string> = {
  open:        'Открыт',
  in_progress: 'В работе',
  completed:   'Завершён',
  cancelled:   'Отменён',
}

const statusColor: Record<string, string> = {
  open:        'bg-green-100 text-green-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed:   'bg-gray-100 text-gray-800',
  cancelled:   'bg-red-100 text-red-800',
}

export default async function CraftsmanMyOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Orders where this craftsman's offer was accepted
  const { data: offers } = await supabase
    .from('offers')
    .select('*, order:orders(*, customer:profiles!customer_id(full_name))')
    .eq('craftsman_id', user.id)
    .eq('status', 'accepted')
    .order('created_at', { ascending: false })

  const active = offers?.filter((o: any) => o.order?.status === 'in_progress') ?? []
  const completed = offers?.filter((o: any) => o.order?.status === 'completed') ?? []
  const all = [...active, ...completed]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="text-2xl font-bold mb-2">Мои заказы</h1>
      <p className="text-gray-500 text-sm mb-8">Заказы где ваше предложение было принято</p>

      {!all.length ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">Пока нет принятых заказов</p>
          <p className="text-sm">Когда заказчик примет ваше предложение — заказ появится здесь</p>
          <Link href="/dashboard" className="mt-4 inline-block text-orange-600 hover:underline text-sm">
            Перейти в ленту заказов →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {active.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                В работе ({active.length})
              </h2>
              <div className="space-y-3">
                {active.map((offer: any) => (
                  <OrderCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          )}

          {completed.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Завершённые ({completed.length})
              </h2>
              <div className="space-y-3">
                {completed.map((offer: any) => (
                  <OrderCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function OrderCard({ offer }: { offer: any }) {
  const order = offer.order
  if (!order) return null

  return (
    <Link href={`/orders/${order.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <CardTitle className="text-base">{order.title}</CardTitle>
            <Badge className={statusColor[order.status] ?? 'bg-gray-100 text-gray-600'}>
              {statusLabel[order.status] ?? order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{order.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <span>Заказчик: <span className="text-gray-600">{order.customer?.full_name}</span></span>
            <span className="font-semibold text-orange-700">{Number(offer.price).toLocaleString()} сум</span>
            <span>{offer.delivery_days} дней</span>
            {order.furniture_type && <span>{order.furniture_type}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
