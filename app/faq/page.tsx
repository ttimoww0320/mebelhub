import Link from 'next/link'
import PublicNav from '@/components/public-nav'
import { G, BG, BG2, BORDER, TEXT, DIM, MUTE, MONO, HEAD } from '@/lib/tokens'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Частые вопросы — MebelHub',
  description: 'Ответы на самые частые вопросы о работе маркетплейса MebelHub.',
}

const CUSTOMER_FAQ = [
  {
    q: 'Сколько стоит разместить заказ?',
    a: 'Бесплатно. Вы создаёте ТЗ, мастера сами присылают предложения. Платите только выбранному мастеру и только за его работу.',
  },
  {
    q: 'Как быстро придут офферы?',
    a: 'Обычно первые предложения появляются в течение 1–2 часов после публикации. Вы получите уведомление в Telegram или на сайте.',
  },
  {
    q: 'Как выбрать мастера?',
    a: 'Смотрите портфолио, рейтинг, количество отзывов и бейдж верификации. Задавайте вопросы прямо в чате — он открывается сразу после отклика мастера.',
  },
  {
    q: 'Как происходит оплата?',
    a: 'Оплата напрямую мастеру — наличными или переводом. Платформа не участвует в финансовых расчётах. Условия оплаты обсудите с мастером в чате.',
  },
  {
    q: 'Что если мастер сорвёт сроки или сделает некачественно?',
    a: 'Платформа не является стороной договора, поэтому решение споров — ваша договорённость с мастером. Рекомендуем выбирать верифицированных мастеров с хорошим рейтингом и оформлять договор.',
  },
  {
    q: 'Можно ли отменить заказ?',
    a: 'Да — пока заказ в статусе «Открыт» или «В работе». Все мастера с офферами получат уведомление об отмене.',
  },
  {
    q: 'Как оставить отзыв?',
    a: 'После того как вы нажмёте «Завершить заказ», откроется форма для отзыва. Отзыв влияет на рейтинг мастера.',
  },
]

const MASTER_FAQ = [
  {
    q: 'Как начать получать заказы?',
    a: 'Зарегистрируйтесь как мастер, заполните профиль и добавьте портфолио. Затем в ленте заказов выбирайте подходящие проекты и отправляйте офферы.',
  },
  {
    q: 'Что такое верификация и зачем она нужна?',
    a: 'Верификация подтверждает вашу личность и существование мастерской. Верифицированные мастера отображаются выше в поиске и вызывают больше доверия у заказчиков. Для верификации загрузите паспорт или свидетельство ИП в профиле.',
  },
  {
    q: 'Сколько стоит работа на платформе?',
    a: 'Пока полностью бесплатно. Платформа не берёт комиссию с заказов.',
  },
  {
    q: 'Как правильно составить оффер?',
    a: 'Укажите реальную цену и сроки. В комментарии расскажите о своём опыте с похожими проектами и что входит в стоимость. Конкретные офферы принимаются охотнее.',
  },
  {
    q: 'Что делать если заказчик не реагирует?',
    a: 'Напишите в чате — сообщение придёт заказчику как уведомление в Telegram. Если связь не установить, платформа не может принудить заказчика к ответу.',
  },
  {
    q: 'Как подключить Telegram-уведомления?',
    a: 'В настройках профиля нажмите «Подключить Telegram» — получите ссылку для запуска бота @Mebel_Hubb_Bot. После подключения все уведомления будут приходить в Telegram.',
  },
]

function FaqBlock({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((item, i) => (
        <div key={i} style={{ padding: '28px 0', borderTop: `1px solid ${BORDER}`, ...(i === items.length - 1 ? { borderBottom: `1px solid ${BORDER}` } : {}) }}>
          <div style={{ fontFamily: HEAD, fontSize: 22, fontWeight: 400, marginBottom: 12, letterSpacing: '-0.01em' }}>{item.q}</div>
          <div style={{ fontSize: 15, color: DIM, lineHeight: 1.7 }}>{item.a}</div>
        </div>
      ))}
    </div>
  )
}

export default function FaqPage() {
  return (
    <div style={{ background: BG, color: TEXT, minHeight: '100vh' }}>
      <PublicNav />

      <div className="px-page" style={{ paddingTop: 60, paddingBottom: 80 }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 16 }}>§ FAQ</div>
        <h1 style={{ fontFamily: HEAD, fontSize: 72, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1, margin: '0 0 60px' }}>
          Частые<br/><em style={{ color: G }}>вопросы</em>
        </h1>

        <div className="grid-1-2" style={{ gap: 60, alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: 32 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: G, letterSpacing: '0.14em', marginBottom: 20 }}>БЫСТРАЯ НАВИГАЦИЯ</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="#customers" style={{ color: DIM, textDecoration: 'none', fontSize: 14 }}>— Для заказчиков</a>
                <a href="#masters" style={{ color: DIM, textDecoration: 'none', fontSize: 14 }}>— Для мастеров</a>
              </div>
              <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 13, color: MUTE, lineHeight: 1.6 }}>
                  Не нашли ответ? Напишите нам:
                </div>
                <div style={{ fontSize: 14, color: G, marginTop: 8 }}>hello@mebelhub.uz</div>
              </div>
            </div>
          </div>

          <div>
            <h2 id="customers" style={{ fontFamily: HEAD, fontSize: 40, fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 32px' }}>
              Для заказчиков
            </h2>
            <FaqBlock items={CUSTOMER_FAQ} />

            <h2 id="masters" style={{ fontFamily: HEAD, fontSize: 40, fontWeight: 300, letterSpacing: '-0.02em', margin: '60px 0 32px' }}>
              Для мастеров
            </h2>
            <FaqBlock items={MASTER_FAQ} />
          </div>
        </div>

        <div style={{ marginTop: 80, padding: '40px', background: BG2, border: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 8 }}>ГОТОВЫ НАЧАТЬ?</div>
            <div style={{ fontFamily: HEAD, fontSize: 28, fontWeight: 300 }}>Разместите заказ — это бесплатно</div>
          </div>
          <Link href="/register?role=customer" style={{ background: G, color: BG, padding: '16px 24px', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', textDecoration: 'none', borderRadius: 2 }}>
            Создать аккаунт →
          </Link>
        </div>
      </div>
    </div>
  )
}
