import Link from 'next/link'
import HeroAnimation from '@/components/hero-animation'
import { WorkIllustration } from '@/components/work-illustration'
import { MH_WORKS, MH_CATEGORIES, MH_MASTERS, MH_ORDERS_FEED } from '@/lib/mock-data'
import PublicNav from '@/components/public-nav'
import { createClient } from '@/lib/supabase/server'
import { G, BG, BG2, BORDER, BORDER2, TEXT, DIM, MUTE, MONO, HEAD } from '@/lib/tokens'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const ctaHref = user ? '/orders/new' : '/register?role=customer'

  return (
    <div style={{ background: BG, color: TEXT, minHeight: '100vh' }}>

      <PublicNav />

      {/* HERO */}
      <section style={{ display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:40, padding:'60px 40px 40px', alignItems:'center', minHeight:640 }}>
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
            {[['500','+','Заказов\nразмещено'],['120','+','Мастеров\nв Ташкенте'],['4.8','★','Средний\nрейтинг']].map(([n,suf,lbl],i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:24 }}>
                {i>0 && <div style={{ width:1, height:32, background:BORDER }}/>}
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
      <section style={{ padding:'100px 40px', borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:60, marginBottom:60 }}>
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
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2, background:BORDER }}>
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
      <section style={{ padding:'100px 40px', borderBottom:`1px solid ${BORDER}` }}>
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
          {MH_ORDERS_FEED.map((o, i) => (
            <div key={o.id} style={{ display:'grid', gridTemplateColumns:'50px 1fr auto auto auto', gap:24, padding:'22px 0', borderBottom:`1px solid ${BORDER}`, borderTop:i===0?`1px solid ${BORDER}`:'none', alignItems:'center' }}>
              <div style={{ fontFamily:MONO, fontSize:11, color:MUTE }}>#{String(i+1).padStart(2,'0')}</div>
              <div style={{ fontSize:17, fontWeight:400 }}>{o.title}</div>
              <div style={{ fontSize:12, color:DIM }}>{o.district}</div>
              <div style={{ fontFamily:MONO, fontSize:12, color:G, letterSpacing:'0.04em' }}>{o.budget}</div>
              <div style={{ fontSize:12, color:MUTE, minWidth:140, textAlign:'right' }}>{o.offers} офферов · {o.time}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED WORKS */}
      <section style={{ padding:'100px 40px', borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'end', marginBottom:48 }}>
          <div>
            <div style={{ fontFamily:MONO, fontSize:11, color:G, letterSpacing:'0.14em', marginBottom:16 }}>§ 03 · РАБОТЫ</div>
            <h2 style={{ fontFamily:HEAD, fontSize:52, fontWeight:300, letterSpacing:'-0.02em', lineHeight:1, margin:0 }}>
              Сделано<br/><em style={{ color:G }}>мастерами</em>
            </h2>
          </div>
          <Link href="/works" style={{ fontSize:12, color:DIM, letterSpacing:'0.12em', textTransform:'uppercase', textDecoration:'none' }}>Все работы →</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
          {MH_WORKS.slice(0,6).map(w => {
            const master = MH_MASTERS.find(m => m.id === w.master)
            return (
              <Link key={w.id} href={`/craftsman/${w.master}`} style={{ display:'flex', flexDirection:'column', gap:14, textDecoration:'none', color:TEXT }}>
                <WorkIllustration work={w}/>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start' }}>
                  <div>
                    <div style={{ fontFamily:HEAD, fontSize:22, fontWeight:400, fontStyle:'italic', letterSpacing:'-0.01em' }}>{w.title}</div>
                    <div style={{ fontSize:12, color:MUTE, marginTop:4 }}>{w.material}</div>
                  </div>
                  <div style={{ fontSize:11, color:DIM, textAlign:'right' }}>
                    {master?.shop}<br/><span style={{ color:MUTE }}>{w.year}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* MASTERS TEASER */}
      <section style={{ padding:'100px 40px', borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'end', marginBottom:48 }}>
          <div>
            <div style={{ fontFamily:MONO, fontSize:11, color:G, letterSpacing:'0.14em', marginBottom:16 }}>§ 04 · МАСТЕРА</div>
            <h2 style={{ fontFamily:HEAD, fontSize:52, fontWeight:300, letterSpacing:'-0.02em', lineHeight:1, margin:0 }}>Проверенные мебельщики Ташкента</h2>
          </div>
          <Link href="/masters" style={{ fontSize:12, color:DIM, letterSpacing:'0.12em', textTransform:'uppercase', textDecoration:'none' }}>Все мастера →</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2, background:BORDER }}>
          {MH_MASTERS.slice(0,3).map(m => (
            <Link key={m.id} href={`/craftsman/${m.id}`} style={{ background:BG, padding:32, textDecoration:'none', color:TEXT, display:'flex', flexDirection:'column', gap:18 }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:48, height:48, borderRadius:'50%', background:m.accent, border:`1px solid ${BORDER2}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:HEAD, fontSize:18, color:G, fontStyle:'italic' }}>
                  {m.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize:15, fontWeight:500 }}>{m.name}</div>
                  <div style={{ fontSize:11, color:MUTE, letterSpacing:'0.08em', textTransform:'uppercase', marginTop:2 }}>{m.shop}</div>
                </div>
              </div>
              <div style={{ fontSize:13, color:DIM, lineHeight:1.5 }}>{m.bio.slice(0,110)}…</div>
              <div style={{ display:'flex', gap:16, marginTop:'auto', paddingTop:18, borderTop:`1px dashed ${BORDER}`, fontSize:11, color:MUTE, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                <span><span style={{ color:G }}>★ {m.rating}</span> · {m.reviews} отзывов</span>
                <span>·</span>
                <span>С {m.since}</span>
              </div>
            </Link>
          ))}
        </div>
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
      <footer style={{ padding:'60px 40px 40px', borderTop:`1px solid ${BORDER}`, background:BG, color:DIM, fontSize:12, display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr 1fr', gap:40 }}>
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
            {['Журнал','Работы','Справочник материалов','Частые вопросы'].map(l => <span key={l}>{l}</span>)}
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
