import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import OfferForm from './offer-form'
import AcceptOffer from './accept-offer'
import Chat from './chat'
import ReviewForm from './review-form'

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: order } = await supabase
    .from('orders')
    .select('*, customer:profiles!customer_id(*), offers(*, craftsman:profiles!craftsman_id(*))')
    .eq('id', id)
    .single()

  if (!order) notFound()

  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }

  const isOwner = user?.id === order.customer_id
  const isCraftsman = profile?.role === 'craftsman'
  const hasOffer = order.offers?.some((o: any) => o.craftsman_id === user?.id)
  const acceptedOffer = order.offers?.find((o: any) => o.status === 'accepted')

  const { data: existingReview } = isOwner && order.status === 'completed'
    ? await supabase.from('reviews').select('id').eq('order_id', id).single()
    : { data: null }

  const dims = [order.width_cm, order.height_cm, order.depth_cm].filter(Boolean)

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Order header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl font-bold">{order.title}</h1>
          <Badge className="bg-green-100 text-green-800">{order.status === 'open' ? 'Открыт' : order.status}</Badge>
        </div>
        <p className="text-gray-500 text-sm">
          Заказчик: {(order.customer as any)?.full_name} · {new Date(order.created_at).toLocaleDateString('ru-RU')}
        </p>
      </div>

      {/* Images */}
      {order.images?.length > 0 && (
        <div className="flex gap-3 flex-wrap mb-6">
          {order.images.map((url: string, i: number) => (
            <img key={i} src={url} alt="" className="w-32 h-32 object-cover rounded-lg border" />
          ))}
        </div>
      )}

      {/* Details */}
      <Card className="mb-6">
        <CardContent className="pt-6 space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Описание</p>
            <p className="text-gray-800">{order.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-400">Тип: </span>{order.furniture_type}</div>
            {order.style && <div><span className="text-gray-400">Стиль: </span>{order.style}</div>}
            {dims.length > 0 && <div><span className="text-gray-400">Размеры: </span>{dims.join(' × ')} см</div>}
            {order.material && <div><span className="text-gray-400">Материал: </span>{order.material}</div>}
            {order.color && <div><span className="text-gray-400">Цвет: </span>{order.color}</div>}
            {order.deadline && <div><span className="text-gray-400">Срок: </span>{new Date(order.deadline).toLocaleDateString('ru-RU')}</div>}
          </div>
          {(order.budget_min || order.budget_max) && (
            <div className="bg-orange-50 rounded-lg px-4 py-3">
              <span className="text-sm text-gray-500">Бюджет: </span>
              <span className="font-semibold text-orange-700">
                {order.budget_min ? `${Number(order.budget_min).toLocaleString()} — ` : 'до '}
                {Number(order.budget_max).toLocaleString()} сум
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Offer form for craftsmen */}
      {isCraftsman && !hasOffer && order.status === 'open' && (
        <OfferForm orderId={order.id} />
      )}

      {/* Review form */}
      {isOwner && order.status === 'completed' && !existingReview && acceptedOffer && (
        <ReviewForm orderId={order.id} craftsmanId={acceptedOffer.craftsman_id} />
      )}

      {/* Offers list */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Предложения мастеров ({order.offers?.length || 0})
        </h2>
        {!order.offers?.length ? (
          <p className="text-gray-400 text-center py-10">Пока нет предложений</p>
        ) : (
          <div className="space-y-4">
            {order.offers.map((offer: any) => (
              <Card key={offer.id} className={offer.status === 'accepted' ? 'border-green-400' : ''}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>{offer.craftsman?.full_name?.[0] ?? '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Link href={`/craftsman/${offer.craftsman_id}`} className="font-medium hover:text-orange-600 hover:underline">
                            {offer.craftsman?.full_name}
                          </Link>
                          {(offer.craftsman?.rating ?? 0) > 0 && (
                            <span className="text-xs text-gray-400">★ {offer.craftsman?.rating?.toFixed(1)}</span>
                          )}
                        </div>
                        {offer.status === 'accepted' && (
                          <Badge className="bg-green-100 text-green-800">Принято</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{offer.comment}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="font-semibold text-orange-700">{Number(offer.price).toLocaleString()} сум</span>
                        <span className="text-gray-400">{offer.delivery_days} дней</span>
                      </div>
                    </div>
                  </div>
                  {isOwner && offer.status === 'pending' && order.status === 'open' && (
                    <AcceptOffer offerId={offer.id} orderId={order.id} />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Chat */}
      {user && (isOwner || hasOffer) && (
        <div className="mt-8">
          <Chat orderId={order.id} currentUserId={user.id} />
        </div>
      )}
    </div>
  )
}
