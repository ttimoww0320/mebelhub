import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
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
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-orange-50 text-orange-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          Маркетплейс мебели на заказ · Ташкент
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Опишите мебель —<br />
          <span className="text-orange-600">мастера предложят цену</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Не ищите мастера сами. Разместите заказ бесплатно и получите несколько предложений от проверенных мебельщиков Ташкента.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register?role=customer">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-10 text-base">
              Разместить заказ бесплатно
            </Button>
          </Link>
          <Link href="/register?role=craftsman">
            <Button size="lg" variant="outline" className="px-10 text-base">
              Я мастер — хочу заказы
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4">Регистрация занимает 1 минуту</p>
      </section>

      {/* Stats */}
      <section className="border-y bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center px-6">
          {[
            { value: '500+', label: 'Заказов размещено' },
            { value: '120+', label: 'Мастеров в Ташкенте' },
            { value: '4.8★', label: 'Средний рейтинг' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-bold text-orange-600">{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Как это работает</h2>
          <p className="text-center text-gray-500 mb-14">Три шага — и у вас готовая мебель</p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: '1',
                title: 'Опишите заказ',
                desc: 'Укажите размеры, стиль, материал и бюджет. Прикрепите фото для вдохновения. Это займёт 5 минут.',
                icon: '📋',
              },
              {
                step: '2',
                title: 'Получите офферы',
                desc: 'Мастера Ташкента увидят ваш заказ и пришлют предложения с ценой, сроком и комментарием.',
                icon: '💬',
              },
              {
                step: '3',
                title: 'Выберите мастера',
                desc: 'Сравните офферы, посмотрите рейтинг и отзывы — выберите лучшего и договоритесь в чате.',
                icon: '✅',
              },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="text-center">
                <div className="text-4xl mb-4">{icon}</div>
                <div className="w-8 h-8 rounded-full bg-orange-600 text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
                  {step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For whom */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 border">
            <div className="text-3xl mb-4">🏠</div>
            <h3 className="text-xl font-bold mb-3">Для заказчиков</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              {[
                'Размещение заказа — бесплатно',
                'Несколько предложений от разных мастеров',
                'Реальные отзывы и рейтинги',
                'Чат с мастером внутри платформы',
                'Уведомления в Telegram',
              ].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-orange-500">✓</span> {item}
                </li>
              ))}
            </ul>
            <Link href="/register?role=customer" className="mt-6 block">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">Разместить заказ</Button>
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-8 border">
            <div className="text-3xl mb-4">🔨</div>
            <h3 className="text-xl font-bold mb-3">Для мастеров</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              {[
                'Лента заказов по вашей специализации',
                'Фильтрация по типу мебели и бюджету',
                'Прямой контакт с заказчиком',
                'Портфолио и страница мастера',
                'Уведомления о новых заказах',
              ].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-orange-500">✓</span> {item}
                </li>
              ))}
            </ul>
            <Link href="/register?role=craftsman" className="mt-6 block">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">Начать принимать заказы</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Furniture types */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Любая мебель на заказ</h2>
          <p className="text-center text-gray-500 mb-12">Мастера работают со всеми видами мебели</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🛋️', name: 'Диваны' },
              { icon: '🛏️', name: 'Кровати' },
              { icon: '🚪', name: 'Шкафы' },
              { icon: '🪑', name: 'Стулья' },
              { icon: '🍽️', name: 'Столы' },
              { icon: '📚', name: 'Стеллажи' },
              { icon: '🪞', name: 'Тумбы' },
              { icon: '✨', name: 'Прочее' },
            ].map(({ icon, name }) => (
              <div key={name} className="flex flex-col items-center justify-center bg-gray-50 rounded-xl py-6 hover:bg-orange-50 transition-colors cursor-default">
                <span className="text-3xl mb-2">{icon}</span>
                <span className="text-sm font-medium text-gray-700">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-600 py-20 px-6 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Готовы разместить заказ?</h2>
        <p className="text-orange-100 mb-8 text-lg">Это бесплатно. Первые предложения придут уже через час.</p>
        <Link href="/register?role=customer">
          <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 px-10 text-base font-semibold">
            Начать бесплатно
          </Button>
        </Link>
      </section>

      <footer className="py-10 px-6 border-t">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span className="font-bold text-orange-600 text-base">MebelHub</span>
          <span>© 2025 MebelHub — Ташкент, Узбекистан</span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-gray-600">Войти</Link>
            <Link href="/register" className="hover:text-gray-600">Регистрация</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
