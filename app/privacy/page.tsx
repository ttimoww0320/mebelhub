import Link from 'next/link'
import PublicNav from '@/components/public-nav'
import { G, BG, BORDER, TEXT, DIM, MUTE, MONO, HEAD } from '@/lib/tokens'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности — MebelHub',
  description: 'Как MebelHub обрабатывает и защищает ваши персональные данные.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ paddingBottom: 40, borderBottom: `1px solid ${BORDER}`, marginBottom: 40 }}>
      <h2 style={{ fontFamily: HEAD, fontSize: 32, fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 20px', color: TEXT }}>{title}</h2>
      <div style={{ fontSize: 15, color: DIM, lineHeight: 1.75 }}>{children}</div>
    </div>
  )
}

export default function PrivacyPage() {
  return (
    <div style={{ background: BG, color: TEXT, minHeight: '100vh' }}>
      <PublicNav />

      <div className="px-page" style={{ paddingTop: 60, paddingBottom: 80, maxWidth: 800 }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 16 }}>§ ДОКУМЕНТЫ</div>
        <h1 style={{ fontFamily: HEAD, fontSize: 64, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1, margin: '0 0 12px' }}>
          Политика<br/><em style={{ color: G }}>конфиденциальности</em>
        </h1>
        <p style={{ fontSize: 13, color: MUTE, marginBottom: 60 }}>Последнее обновление: май 2026 г.</p>

        <Section title="1. Какие данные мы собираем">
          <p>При регистрации и использовании платформы мы собираем:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 8 }}>Имя, email и номер телефона</li>
            <li style={{ marginBottom: 8 }}>Данные Telegram (при подключении бота)</li>
            <li style={{ marginBottom: 8 }}>Фотографии работ и верификационные документы (для мастеров)</li>
            <li>Информацию о заказах, офферах и переписке</li>
          </ul>
        </Section>

        <Section title="2. Как мы используем данные">
          <p>Собранные данные используются для:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 8 }}>Обеспечения работы платформы (регистрация, вход, заказы)</li>
            <li style={{ marginBottom: 8 }}>Отправки уведомлений через сайт и Telegram</li>
            <li style={{ marginBottom: 8 }}>Верификации мастеров</li>
            <li>Улучшения качества сервиса</li>
          </ul>
          <p style={{ marginTop: 12 }}>Мы не продаём ваши данные третьим лицам.</p>
        </Section>

        <Section title="3. Хранение данных">
          <p>Данные хранятся на защищённых серверах Supabase (ЕС). Пароли хранятся в зашифрованном виде. Верификационные документы доступны только администраторам платформы.</p>
        </Section>

        <Section title="4. Передача данных третьим лицам">
          <p>Мы используем следующих третьих лиц для работы платформы:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 8 }}><b style={{ color: TEXT }}>Supabase</b> — база данных и аутентификация</li>
            <li style={{ marginBottom: 8 }}><b style={{ color: TEXT }}>Vercel</b> — хостинг платформы</li>
            <li><b style={{ color: TEXT }}>Telegram</b> — доставка уведомлений (только если вы подключили бота)</li>
          </ul>
        </Section>

        <Section title="5. Ваши права">
          <p>Вы вправе:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 8 }}>Запросить удаление своего аккаунта и данных</li>
            <li style={{ marginBottom: 8 }}>Изменить или удалить личную информацию в настройках профиля</li>
            <li>Отключить Telegram-уведомления в любой момент</li>
          </ul>
          <p style={{ marginTop: 12 }}>Для удаления аккаунта напишите на <span style={{ color: G }}>hello@mebelhub.uz</span></p>
        </Section>

        <Section title="6. Cookies">
          <p>Платформа использует только необходимые cookie для поддержания сессии пользователя. Мы не используем рекламные или аналитические cookie.</p>
        </Section>

        <div style={{ fontSize: 13, color: MUTE }}>
          По вопросам конфиденциальности: <span style={{ color: G }}>hello@mebelhub.uz</span>
          {' · '}
          <Link href="/terms" style={{ color: G, textDecoration: 'none' }}>Условия использования →</Link>
        </div>
      </div>
    </div>
  )
}
