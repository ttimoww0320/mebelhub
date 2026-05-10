import Link from 'next/link'
import PublicNav from '@/components/public-nav'
import { G, BG, BORDER, TEXT, DIM, MUTE, MONO, HEAD } from '@/lib/tokens'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Условия использования — MebelHub',
  description: 'Правила работы маркетплейса MebelHub для заказчиков и мастеров.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ paddingBottom: 40, borderBottom: `1px solid ${BORDER}`, marginBottom: 40 }}>
      <h2 style={{ fontFamily: HEAD, fontSize: 32, fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 20px', color: TEXT }}>{title}</h2>
      <div style={{ fontSize: 15, color: DIM, lineHeight: 1.75 }}>{children}</div>
    </div>
  )
}

export default function TermsPage() {
  return (
    <div style={{ background: BG, color: TEXT, minHeight: '100vh' }}>
      <PublicNav />

      <div className="px-page" style={{ paddingTop: 60, paddingBottom: 80, maxWidth: 800 }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 16 }}>§ ДОКУМЕНТЫ</div>
        <h1 style={{ fontFamily: HEAD, fontSize: 64, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1, margin: '0 0 12px' }}>
          Условия<br/><em style={{ color: G }}>использования</em>
        </h1>
        <p style={{ fontSize: 13, color: MUTE, marginBottom: 60 }}>Последнее обновление: май 2026 г.</p>

        <Section title="1. Общие положения">
          <p>MebelHub — это онлайн-платформа, которая соединяет заказчиков с мастерами по изготовлению мебели на заказ в Ташкенте. Регистрируясь на платформе, вы соглашаетесь с настоящими условиями использования.</p>
          <p style={{ marginTop: 12 }}>Платформа не является стороной договора между заказчиком и мастером — она лишь предоставляет инструменты для их взаимодействия.</p>
        </Section>

        <Section title="2. Регистрация и аккаунт">
          <p>Для использования платформы необходимо зарегистрироваться, указав реальные данные. Использование чужих данных запрещено. Вы несёте ответственность за сохранность пароля и все действия, совершённые с вашего аккаунта.</p>
          <p style={{ marginTop: 12 }}>Платформа оставляет за собой право заблокировать аккаунт при нарушении правил.</p>
        </Section>

        <Section title="3. Правила для заказчиков">
          <p>Заказчик обязуется:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 8 }}>Указывать корректные требования при размещении заказа</li>
            <li style={{ marginBottom: 8 }}>Своевременно отвечать на офферы мастеров</li>
            <li style={{ marginBottom: 8 }}>Оплачивать работу в соответствии с договорённостями с мастером</li>
            <li>Оставлять честные отзывы после завершения заказа</li>
          </ul>
        </Section>

        <Section title="4. Правила для мастеров">
          <p>Мастер обязуется:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 8 }}>Проходить верификацию для повышения доверия заказчиков</li>
            <li style={{ marginBottom: 8 }}>Выполнять заказы в оговорённые сроки и по указанной цене</li>
            <li style={{ marginBottom: 8 }}>Не отправлять спам-офферы без намерения выполнить заказ</li>
            <li>Предоставлять актуальное портфолио</li>
          </ul>
        </Section>

        <Section title="5. Верификация мастеров">
          <p>Верификация подтверждает личность мастера и наличие мастерской. Бейдж «Проверен» означает, что документы мастера проверены администратором платформы. Платформа не гарантирует качество выполнения работ.</p>
        </Section>

        <Section title="6. Ответственность платформы">
          <p>MebelHub не несёт ответственности за:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li style={{ marginBottom: 8 }}>Качество работ, выполненных мастерами</li>
            <li style={{ marginBottom: 8 }}>Споры между заказчиком и мастером</li>
            <li>Задержки или неисполнение обязательств сторон</li>
          </ul>
        </Section>

        <Section title="7. Платежи">
          <p>Платформа не участвует в финансовых расчётах между заказчиком и мастером. Все договорённости об оплате — исключительно между сторонами сделки. Размещение заказа на платформе бесплатно.</p>
        </Section>

        <Section title="8. Изменения условий">
          <p>Платформа оставляет за собой право изменять условия использования. Актуальная версия всегда доступна на этой странице. Продолжение использования платформы означает согласие с новыми условиями.</p>
        </Section>

        <div style={{ fontSize: 13, color: MUTE }}>
          По вопросам: <span style={{ color: G }}>hello@mebelhub.uz</span>
          {' · '}
          <Link href="/privacy" style={{ color: G, textDecoration: 'none' }}>Политика конфиденциальности →</Link>
        </div>
      </div>
    </div>
  )
}
