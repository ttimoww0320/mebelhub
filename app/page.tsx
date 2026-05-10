export const dynamic = 'force-dynamic'

import Link from 'next/link'
import HeroAnimation from '@/components/hero-animation'
import { MH_CATEGORIES } from '@/lib/mock-data'
import PublicNav from '@/components/public-nav'
import { createClient } from '@/lib/supabase/server'
import { G, BG, BG2, BORDER, BORDER2, TEXT, DIM, MUTE, MONO, HEAD } from '@/lib/tokens'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 2) return 'только что'
  if (mins < 60) return `${mins} мин назад`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} ч назад`
  const days = Math.floor(hours / 24)
  return `${days} дн назад`
}

function fmtBudget(min?: number | null, max?: number | null): string {
  if (!min && !max) return '—'
  if (min && max) return `$${min.toLocaleString('ru-RU')}–$${max.toLocaleString('ru-RU')}`
  if (min) return `от $${min.toLocaleString('ru-RU')}`
  return `до $${max!.toLocaleString('ru-RU')}`
}

const ACCENT_COLORS = ['#3a2d1f','#2a2e38','#382416','#2e2a22','#3a2e1a','#26261e','#1f2830','#2a1d30']
function accentForId(id: string): string {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return ACCENT_COLORS[h % ACCENT_COLORS.length]
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const ctaHref = user ? '/orders/new' : '/register?role=customer'

  const [
    { data: orders },
    { data: works },
    { data: masters },
    { count: ordersCount },
    { count: mastersCount },
    { data: ratingRows },
  ] = await Promise.all([
    supabase
      .from('orders')
      .select('id, title, furniture_type, budget_min, budget_max, created_at, offers(count)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('works')
      .select('id, title, category, description, price, craftsman_id, image_url, craftsman:profiles!craftsman_id(id, full_name)')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('profiles')
      .select('id, full_name, bio, rating, reviews_count, verification_status')
      .eq('role', 'craftsman')
      .eq('verification_status', 'verified')
      .order('rating', { ascending: false })
      .limit(3),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'craftsman').eq('verification_status', 'verified'),
    supabase.from('profiles').select('rating').eq('role', 'craftsman').gt('rating', 0),
  ])

  const avgRating = ratingRows && ratingRows.length > 0
    ? (ratingRows.reduce((s: number, p: any) => s + Number(p.rating), 0) / ratingRows.length).toFixed(1)
    : '—'

  const stats = [
    [String(ordersCount ?? 0), '+', 'Заказов\nразмещено'],
    [String(mastersCount ?? 0), '+', 'Мастеров\nв Ташкенте'],
    [avgRating, '★', 'Средний\nрейтинг'],
  ]

  return (
    <div style={{ background: BG, color: TEXT, minHeight: '100vh' }}>

      <PublicNav />

      {/* HERO */}
      <section className="grid-hero px-page" style={{ paddingTop:60, paddingBottom:40 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:11, color:MUTE, letterSpacing:'0.12em', textTransform:'uppercase' }}>
            <span style={{ color:G, fontSize:8 }}>●</span>
            <span>Маркетплейс мебели на заказ · Ташкент</span>
          </div>
          <h1 style={{ fontFamily:HEAD, fontSize:82, lineHeight:0.95, fontWeight:300, letterSpacing:'-0.03em', margin:0 }}>
            Мебель,<br/>
            <em style={{ fontStyle:'italic', color:G, fontWeight:300 }}>созданная</em> для вас<br/>
            <span style={{ color:'rgba(232,230,225,0.45)' }}>руками мастеров.</span>
          </h1>
          <p style={{ fontSize:16, lineHeight:1.55, color:DIM, maxWidth:460, margin:0 }}>
            Опишите вашу идею — и получите предложения от проверенных мебельщиков.
            Не ищите мастера. Мастер найдёт вас.
          </p>
          <div style={{ display:'flex', gap:14, alignItems:'center' }}>
            <Link href={ctaHref} style={{ background:G, color:BG, padding:'16px 24px', fontSize:13, fontWeight:600, letterSpacing:'0.06em', textDecoration:'none', display:'flex', alignItems:'center', gap:14, borderRadius:2 }}>
              <span>Разместить заказ</span><span style={{ fontSize:16 }}>→</span>
            </Link>
            <Link href="/masters" style={{ background:'transparent', color:TEXT, border:`1px solid ${BORDER2}`, padding:'16px 24px', fontSize:13, fontWeight:500, letterSpacing:'0.06em', textDecoration:'none', borderRadius:2 }}>
              Посмотреть мастеров
            </Link>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:24, marginTop:16 }}>
            {stats.map(([n, suf, lbl], i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:24 }}>
                {i > 0 && <div style={{ width:1, height:32, background:BORDER }}/>}
                <div>
                  <div style={{ fontFamily:HEAD, fontSize:34, fontWeight:300, letterSpacing:'-0.02em' }}>
                    {n}<span style={{ color:G, fontSize:20, marginLeft:suf==='★'?4:2 }}>{suf}</span>
                  </div>
                  <div style={{ fontSize:11, color:MUTE, lineHeight:1.3, textTransform:'uppercase', letterSpacing:'0.08em', whiteSpace:'pre-line' }}>{lbl}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <HeroAnimation/>
      </section>

      {/* CAT STRIP */}
      <div style={{ display:'flex', alignItems:'center', gap:40, padding:'22px 40px', borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ fontSize:10, color:MUTE, letterSpacing:'0.16em', textTransform:'uppercase', whiteSpace:'nowrap' }}>Что можно заказать</div>
        <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
          {MH_CATEGORIES.map(c => (
            <span key={c.id} style={{ fontSize:13, color:DIM }}>{c.name} <span style={{ color:MUTE, fontSize:10 }}>{c.count}</span></span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="px-page py-sect" style={{ borderBottom:`1px solid ${BORDER}` }}>
        <div className="grid-1-2" style={{ marginBottom:60 }}>
          <div>
            <div style={{ fontFamily:MONO, fontSize:11, color:G, letterSpacing:'0.14em', paddingBottom:14, borderBottom:`1px solid ${G}`, display:'inline-block', marginBottom:20 }}>§ 01 · ПРОЦЕСС</div>
            <h2 style={{ fontFamily:HEAD, fontSize:52, fontWeight:300, letterSpacing:'-0.02em', lineHeight:1, margin:0 }}>
              Как это<br/><em style={{ color:G }}>работает</em>
            </h2>
          </div>
          <div style={{ fontSize:16, color:DIM, lineHeight:1.6, maxWidth:540, alignSelf:'end' }}>
            Три шага от идеи до готовой мебели. Без посредников, без торга вслепую, без риска работы с непроверенным мастером.
          </div>
        </div>
        <div className="grid-3" style={{ gap:2, background:BORDER }}>
          {[
            { n:'01', t:'Опишите заказ', d:'Укажите размеры, стиль, материал и бюджет. Прикрепите фото для вдохновения. 5 минут — и заявка опубликована.' },
            { n:'02', t:'Получите офферы', d:'Мастера Ташкента увидят ваш заказ и пришлют предложения с ценой, сроком и 3D-эскизом. Обычно — в течение часа.' },
            { n:'03', t:'Выберите мастера', d:'Сравните офферы, посмотрите портфолио, прочитайте отзывы. Договоритесь в чате и заключите сделку.' },
          ].map(s => (
            <div key={s.n} style={{ background:BG, padding:'40px 32px', display:'flex', flexDirection:'column', gap:16, minHeight:280 }}>
              <div style={{ fontFamily:HEAD, fontSize:64, fontWeight:300, color:G, fontStyle:'italic', lineHeight:1 }}>{s.n}</div>
              <div style={{ fontFamily:HEAD, fontSize:24, fontWeight:400, letterSpacing:'-0.02em' }}>{s.t}</div>
              <div style={{ fontSize:14, color:DIM, lineHeight:1.6 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE FEED */}
      <section className="px-page py-sect" style={{ borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'end', marginBottom:48 }}>
          <div>
            <div style={{ fontFamily:MONO, fontSize:11, color:G, letterSpacing:'0.14em', marginBottom:16 }}>§ 02 · ЛЕНТА · LIVE</div>
            <h2 style={{ fontFamily:HEAD, fontSize:52, fontWeight:300, letterSpacing:'-0.02em', lineHeight:1, margin:0 }}>Сейчас заказывают</h2>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:11, color:DIM, letterSpacing:'0.12em', textTransform:'uppercase' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#7AC07A' }}/>Обновляется в реальном времени
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column' }}>
          {!orders?.length ? (
            <div style={{ padding:'40px 0', textAlign:'center', color:MUTE, fontSize:14 }}>
              Пока нет открытых заказов. <Link href={ctaHref} style={{ color:G, textDecoration:'none' }}>Разместите первый →</Link>
            </div>
          ) : orders.map((o, i) => {
            const offerCount = (o as any).offers?.[0]?.count ?? 0
            return (
              <div key={o.id} className="order-row-5" style={{ padding:'22px 0', borderBottom:`1px solid ${BORDER}`, borderTop:i===0?`1px solid ${BORDER}`:'none' }}>
                <div style={{ fontFamily:MONO, fontSize:11, color:MUTE }}>#{String(i+1).padStart(2,'0')}</div>
                <div style={{ fontSize:17, fontWeight:400 }}>{o.title}</div>
                <div style={{ fontSize:12, color:DIM }}>{(o as any).furniture_type ?? '—'}</div>
                <div style={{ fontFamily:MONO, fontSize:12, color:G, letterSpacing:'0.04em' }}>{fmtBudget((o as any).budget_min, (o as any).budget_max)}</div>
                <div style={{ fontSize:12, color:MUTE, minWidth:140, textAlign:'right' }}>{offerCount} офферов · {timeAgo(o.created_at)}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* FEATURED WORKS */}
      <section className="px-page py-sect" style={{ borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'end', marginBottom:48 }}>
          <div>
            <div style={{ fontFamily:MONO, fontSize:11, color:G, letterSpacing:'0.14em', marginBottom:16 }}>§ 03 · РАБОТЫ</div>
            <h2 style={{ fontFamily:HEAD, fontSize:52, fontWeight:300, letterSpacing:'-0.02em', lineHeight:1, margin:0 }}>
              Сделано<br/><em style={{ color:G }}>мастерами</em>
            </h2>
          </div>
          <Link href="/works" style={{ fontSize:12, color:DIM, letterSpacing:'0.12em', textTransform:'uppercase', textDecoration:'none' }}>Все работы →</Link>
        </div>
        {!works?.length ? (
          <div style={{ padding:'40px 0', textAlign:'center', color:MUTE, fontSize:14 }}>Работы мастеров появятся здесь</div>
        ) : (
          <div className="grid-3-gap">
            {works.map(w => {
              const craftsman = (w as any).craftsman
              return (
                <Link key={w.id} href={`/craftsman/${w.craftsman_id}`} style={{ display:'flex', flexDirection:'column', gap:14, textDecoration:'none', color:TEXT }}>
                  {w.image_url ? (
                    <img src={w.image_url} alt={w.title} style={{ width:'100%', aspectRatio:'4/3', objectFit:'cover', display:'block' }} />
                  ) : (
                    <div style={{ width:'100%', aspectRatio:'4/3', background:BG2, border:`1px solid ${BORDER}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontFamily:HEAD, fontSize:32, color:MUTE, fontStyle:'italic' }}>{w.category?.[0] ?? '?'}</span>
                    </div>
                  )}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start' }}>
                    <div>
                      <div style={{ fontFamily:HEAD, fontSize:22, fontWeight:400, fontStyle:'italic', letterSpacing:'-0.01em' }}>{w.title}</div>
                      <div style={{ fontSize:12, color:MUTE, marginTop:4 }}>{w.category}</div>
                    </div>
                    <div style={{ fontSize:11, color:DIM, textAlign:'right', flexShrink:0 }}>
                      {craftsman?.full_name ?? ''}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* MASTERS TEASER */}
      <section className="px-page py-sect" style={{ borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'end', marginBottom:48 }}>
          <div>
            <div style={{ fontFamily:MONO, fontSize:11, color:G, letterSpacing:'0.14em', marginBottom:16 }}>§ 04 · МАСТЕРА</div>
            <h2 style={{ fontFamily:HEAD, fontSize:52, fontWeight:300, letterSpacing:'-0.02em', lineHeight:1, margin:0 }}>Проверенные мебельщики Ташкента</h2>
          </div>
          <Link href="/masters" style={{ fontSize:12, color:DIM, letterSpacing:'0.12em', textTransform:'uppercase', textDecoration:'none' }}>Все мастера →</Link>
        </div>
        {!masters?.length ? (
          <div style={{ padding:'40px 0', textAlign:'center', color:MUTE, fontSize:14 }}>Верифицированные мастера появятся здесь</div>
        ) : (
          <div className="grid-3" style={{ gap:2, background:BORDER }}>
            {masters.map(m => {
              const initials = (m.full_name ?? '?').split(' ').map((w: string) => w[0]).join('').slice(0, 2)
              const accent = accentForId(m.id)
              const bio = m.bio ?? ''
              return (
                <Link key={m.id} href={`/craftsman/${m.id}`} style={{ background:BG, padding:32, textDecoration:'none', color:TEXT, display:'flex', flexDirection:'column', gap:18 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{ width:48, height:48, borderRadius:'50%', background:accent, border:`1px solid ${BORDER2}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:HEAD, fontSize:18, color:G, fontStyle:'italic', flexShrink:0 }}>
                      {initials}
                    </div>
                    <div>
                      <div style={{ fontSize:15, fontWeight:500 }}>{m.full_name}</div>
                      <div style={{ fontSize:11, color:MUTE, letterSpacing:'0.08em', textTransform:'uppercase', marginTop:2 }}>Верифицирован ✓</div>
                    </div>
                  </div>
                  {bio && (
                    <div style={{ fontSize:13, color:DIM, lineHeight:1.5 }}>{bio.slice(0, 110)}{bio.length > 110 ? '…' : ''}</div>
                  )}
                  <div style={{ display:'flex', gap:16, marginTop:'auto', paddingTop:18, borderTop:`1px dashed ${BORDER}`, fontSize:11, color:MUTE, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                    {(m.rating ?? 0) > 0 ? (
                      <span><span style={{ color:G }}>★ {Number(m.rating).toFixed(1)}</span> · {m.reviews_count ?? 0} отзывов</span>
                    ) : (
                      <span style={{ color:MUTE }}>Новый мастер</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* FINAL CTA */}
      <section style={{ padding:'120px 40px', textAlign:'center', background:`radial-gradient(ellipse at center, ${BG2} 0%, ${BG} 80%)` }}>
        <div style={{ fontFamily:MONO, fontSize:11, color:G, letterSpacing:'0.14em', marginBottom:24 }}>● ГОТОВЫ НАЧАТЬ?</div>
        <h2 style={{ fontFamily:HEAD, fontSize:84, fontWeight:300, letterSpacing:'-0.03em', lineHeight:0.95, margin:'0 auto', maxWidth:1000 }}>
          Ваша идея — <em style={{ color:G }}>наши руки.</em>
        </h2>
        <p style={{ fontSize:17, color:DIM, marginTop:28, maxWidth:520, marginLeft:'auto', marginRight:'auto', lineHeight:1.55 }}>
          Размещение заказа бесплатно. Первые предложения придут в течение часа.
        </p>
        <Link href={ctaHref} style={{ background:G, color:BG, padding:'20px 36px', fontSize:14, fontWeight:600, letterSpacing:'0.08em', textDecoration:'none', marginTop:36, borderRadius:2, display:'inline-flex', alignItems:'center', gap:16, textTransform:'uppercase' }}>
          Разместить заказ<span style={{ fontSize:18 }}>→</span>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="grid-footer px-page" style={{ paddingTop:60, paddingBottom:40, borderTop:`1px solid ${BORDER}`, background:BG, color:DIM, fontSize:12 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <span style={{ color:G, fontSize:14 }}>◆</span>
            <span style={{ fontSize:13, letterSpacing:'0.18em', fontWeight:500, color:TEXT }}>MEBELHUB</span>
          </div>
          <div style={{ lineHeight:1.6, maxWidth:340 }}>Маркетплейс мебели на заказ. Соединяем заказчиков с проверенными мастерами Ташкента.</div>
          <div style={{ marginTop:24, fontFamily:MONO, fontSize:10, letterSpacing:'0.08em', color:MUTE }}>EST. 2024 · ТАШКЕНТ · УЗБЕКИСТАН</div>
        </div>
        <div>
          <div style={{ fontSize:10, color:G, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:14 }}>Платформа</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {['Как это работает','Для заказчиков','Для мастеров','Гарантии и оплата'].map(l => <span key={l}>{l}</span>)}
          </div>
        </div>
        <div>
          <div style={{ fontSize:10, color:G, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:14 }}>Ресурсы</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <Link href="/faq" style={{ color:DIM, textDecoration:'none' }}>Частые вопросы</Link>
            <Link href="/works" style={{ color:DIM, textDecoration:'none' }}>Работы мастеров</Link>
            <Link href="/terms" style={{ color:DIM, textDecoration:'none' }}>Условия использования</Link>
            <Link href="/privacy" style={{ color:DIM, textDecoration:'none' }}>Конфиденциальность</Link>
          </div>
        </div>
        <div>
          <div style={{ fontSize:10, color:G, letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:14 }}>Контакты</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <span>hello@mebelhub.uz</span>
            <span>+998 71 200 00 00</span>
            <span>Telegram: @mebelhub</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
