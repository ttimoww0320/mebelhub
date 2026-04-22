import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import PaymentButton from '@/components/payment-button'
import CompleteOrder from './complete-order'
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

  const { data: existingPayment } = isOwner && acceptedOffer
    ? await supabase.from('payments').select('status').eq('offer_id', acceptedOffer.id).maybeSingle()
    : { data: null }

  const dims = [order.width_cm, order.height_cm, order.depth_cm].filter(Boolean)

  // Sort offers: accepted first, then by craftsman rating desc
  const sortedOffers = [...(order.offers ?? [])].sort((a: any, b: any) => {
    if (a.status === 'accepted') return -1
    if (b.status === 'accepted') return 1
    return (b.craftsman?.rating ?? 0) - (a.craftsman?.rating ?? 0)
  })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Status banner for customer */}
      {isOwner && (
        <div className="mb-5">
          {order.status === 'open' && !acceptedOffer && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
              📬 Ваш заказ опубликован. Ожидайте предложений от мастеров — они появятся ниже.
            </div>
          )}
          {acceptedOffer && existingPayment?.status !== 'paid' && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-700 font-medium">
              ⚡ Вы выбрали мастера! Оплатите депозит 30% ниже чтобы подтвердить заказ.
            </div>
          )}
          {existingPayment?.status === 'paid' && order.status !== 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">
              ✓ Депозит оплачен. Мастер работает над вашим заказом.
            </div>
          )}
          {order.status === 'completed' && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 font-medium">
              ✅ Заказ завершён.
            </div>
          )}
        </div>
      )}

      {/* Order header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl font-bold">{order.title}</h1>
          <Badge className={
            order.status === 'open' ? 'bg-green-100 text-green-800' :
            order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            order.status === 'completed' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }>
            {order.status === 'open' ? 'Открыт' :
             order.status === 'in_progress' ? 'В работе' :
             order.status === 'completed' ? 'Завершён' : 'Отменён'}
          </Badge>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
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

      {/* Payment deposit */}
      {isOwner && acceptedOffer && existingPayment?.status !== 'paid' && (
        <PaymentButton offerId={acceptedOffer.id} price={Number(acceptedOffer.price)} />
      )}

      {isOwner && acceptedOffer && existingPayment?.status === 'paid' && order.status !== 'completed' && (
        <div className="my-4 p-4 bg-green-50 border border-green-200 rounded-xl space-y-3">
          <p className="text-sm text-green-700 font-medium">✓ Депозит оплачен — заказ в работе</p>
          <CompleteOrder orderId={order.id} />
        </div>
      )}

      {/* Completed: review prompt */}
      {isOwner && order.status === 'completed' && (
        <div className="my-4 p-4 bg-gray-50 border rounded-xl text-sm text-gray-600">
          🎉 Заказ завершён! {existingReview ? 'Спасибо за ваш отзыв.' : 'Оцените работу мастера — это поможет другим заказчикам.'}
        </div>
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
        {!sortedOffers.length ? (
          <p className="text-gray-400 text-center py-10">Пока нет предложений</p>
        ) : (
          <div className="space-y-4">
            {sortedOffers.map((offer: any) => (
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
                            <span className="text-xs text-yellow-600 font-medium">★ {offer.craftsman?.rating?.toFixed(1)}</span>
                          )}
                          {offer.craftsman?.verified && (
                            <span className="text-xs text-green-600 font-medium">✓ Проверен</span>
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
