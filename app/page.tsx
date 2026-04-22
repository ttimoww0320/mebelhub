import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-orange-600">MebelHub</span>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="outline">Войти</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-orange-600 hover:bg-orange-700">Регистрация</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Мебель на заказ —<br />
          <span className="text-orange-600">просто и быстро</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Опишите вашу мебель, загрузите фото — и мастера Ташкента сами предложат вам цену и сроки.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register?role=customer">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8">
              Разместить заказ
            </Button>
          </Link>
          <Link href="/register?role=craftsman">
            <Button size="lg" variant="outline" className="px-8">
              Я мастер
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Как это работает</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Опишите заказ', desc: 'Укажите размеры, стиль, материал и бюджет. Прикрепите фото для вдохновения.' },
              { step: '2', title: 'Получите офферы', desc: 'Мастера Ташкента увидят ваш заказ и пришлют свои предложения с ценой и сроком.' },
              { step: '3', title: 'Выберите мастера', desc: 'Сравните офферы, посмотрите портфолио и выберите лучшего.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-orange-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-gray-400 text-sm">
        © 2024 MebelHub — Ташкент
      </footer>
    </main>
  )
}
