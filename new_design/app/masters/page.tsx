import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default async function MastersPage() {
  const supabase = await createClient()

  const { data: masters } = await supabase
    .from('profiles')
    .select('id, full_name, bio, rating, reviews_count, verified')
    .eq('role', 'craftsman')
    .order('rating', { ascending: false, nullsFirst: false })
    .order('reviews_count', { ascending: false })
    .limit(30)

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="text-xl font-bold text-orange-600">MebelHub</Link>
        <div className="flex gap-3 text-sm">
          <Link href="/login" className="text-gray-500 hover:text-gray-700">Войти</Link>
          <Link href="/register" className="text-orange-600 font-medium hover:underline">Регистрация</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Мастера Ташкента</h1>
          <p className="text-gray-500">Проверенные мебельщики, отсортированные по рейтингу</p>
        </div>

        {!masters?.length ? (
          <div className="text-center py-20 text-gray-400">
            <p>Мастера скоро появятся</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {masters.map((master: any, index: number) => (
              <Link key={master.id} href={`/craftsman/${master.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-5">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-lg">
                            {master.full_name?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {index < 3 && (
                          <span className="absolute -top-1 -left-1 text-sm">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-gray-900">{master.full_name}</span>
                          {master.verified && (
                            <Badge className="bg-green-100 text-green-700 text-xs">✓ Проверен</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm mb-2">
                          {(master.rating ?? 0) > 0 ? (
                            <>
                              <span className="text-yellow-500 font-semibold">★ {Number(master.rating).toFixed(1)}</span>
                              <span className="text-gray-400">{master.reviews_count} отзывов</span>
                            </>
                          ) : (
                            <span className="text-gray-400">Новый мастер</span>
                          )}
                        </div>
                        {master.bio && (
                          <p className="text-sm text-gray-500 line-clamp-2">{master.bio}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="text-gray-500 mb-4">Хотите найти мастера для своего заказа?</p>
          <Link href="/register?role=customer">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Разместить заказ бесплатно
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
