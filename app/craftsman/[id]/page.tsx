import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default async function CraftsmanPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: craftsman } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('role', 'craftsman')
    .single()

  if (!craftsman) notFound()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, customer:profiles!customer_id(full_name), order:orders(title)')
    .eq('craftsman_id', id)
    .order('created_at', { ascending: false })

  const { data: completedOffers } = await supabase
    .from('offers')
    .select('*, order:orders(title, furniture_type, created_at)')
    .eq('craftsman_id', id)
    .eq('status', 'accepted')
    .order('created_at', { ascending: false })
    .limit(10)

  const memberSince = new Date(craftsman.created_at).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-orange-600">MebelHub</Link>
        <div className="flex gap-3 text-sm">
          <Link href="/login" className="text-gray-500 hover:text-gray-700">Войти</Link>
          <Link href="/register" className="text-orange-600 font-medium hover:underline">Регистрация</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Profile header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-5">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-orange-100 text-orange-700 text-3xl font-bold">
                  {craftsman.full_name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl font-bold">{craftsman.full_name}</h1>
                  <Badge className="bg-orange-100 text-orange-700">Мастер</Badge>
                </div>

                {(craftsman.rating ?? 0) > 0 ? (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={star <= Math.round(craftsman.rating ?? 0) ? 'text-yellow-400' : 'text-gray-200'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-medium">{craftsman.rating?.toFixed(1)}</span>
                    <span className="text-sm text-gray-400">({craftsman.reviews_count} отзывов)</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 mb-2">Нет отзывов пока</p>
                )}

                <p className="text-sm text-gray-400">На платформе с {memberSince}</p>

                {craftsman.bio && (
                  <p className="mt-3 text-gray-700 text-sm leading-relaxed">{craftsman.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          {[
            { label: 'Выполнено заказов', value: completedOffers?.length ?? 0 },
            { label: 'Рейтинг', value: (craftsman.rating ?? 0) > 0 ? `${craftsman.rating?.toFixed(1)} ★` : '—' },
            { label: 'Отзывов', value: craftsman.reviews_count ?? 0 },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="pt-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{value}</div>
                <div className="text-xs text-gray-400 mt-1">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Completed orders */}
        {completedOffers && completedOffers.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Выполненные заказы</h2>
            <div className="space-y-2">
              {completedOffers.map((offer: any) => (
                <Card key={offer.id}>
                  <CardContent className="py-3 px-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{offer.order?.title}</p>
                      <p className="text-xs text-gray-400">{offer.order?.furniture_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-orange-700">{Number(offer.price).toLocaleString()} сум</p>
                      <p className="text-xs text-gray-400">{offer.delivery_days} дней</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Отзывы ({reviews?.length ?? 0})</h2>
          {!reviews?.length ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-400 text-sm">
                Пока нет отзывов
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {reviews.map((review: any) => (
                <Card key={review.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium">{review.customer?.full_name}</p>
                        <p className="text-xs text-gray-400">{review.order?.title}</p>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <span key={star} className={star <= review.rating ? 'text-yellow-400 text-sm' : 'text-gray-200 text-sm'}>★</span>
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    )}
                    <p className="text-xs text-gray-300 mt-2">
                      {new Date(review.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center bg-orange-50 rounded-xl py-6 px-4">
          <p className="text-gray-700 mb-3">Хотите заказать мебель у этого мастера?</p>
          <Link href="/register?role=customer">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              Разместить заказ
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
