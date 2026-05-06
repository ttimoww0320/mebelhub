// Home page — hero + how it works + live orders feed + featured works + masters + CTA

const HomePage = ({ onNav }) => {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      setT(((now - start) / 1000) % 9);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const p = (delay, dur = 1) => {
    const x = Math.max(0, Math.min(1, (t - delay) / dur));
    return 1 - Math.pow(1 - x, 3);
  };
  const iso = (x, y, z) => [0.866*x - 0.866*y, 0.5*x + 0.5*y - z];
  const SX = 40, SY = 40, CX = 300, CY = 330;
  const pt = (x, y, z) => {
    const [a, b] = iso(x, y, z);
    return [CX + a*SX, CY + b*SY];
  };
  const pts = (arr) => arr.map(([x,y,z]) => pt(x,y,z).join(',')).join(' ');
  const fly = (delay, amount = 4) => {
    const pv = p(delay, 0.9);
    return { dz: (1 - pv) * amount, op: Math.min(1, pv * 3) };
  };
  const topFace = (x0, y0, z, x1, y1) => pts([[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]]);
  const frontFace = (x0, x1, y, z0, z1) => pts([[x0,y,z0],[x1,y,z0],[x1,y,z1],[x0,y,z1]]);
  const sideFace = (x, y0, y1, z0, z1) => pts([[x,y0,z0],[x,y1,z0],[x,y1,z1],[x,y0,z1]]);

  return (
    <div style={{ background: mhTheme.bg, color: mhTheme.text }}>
      {/* HERO */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, padding: '60px 40px 40px', alignItems: 'center', minHeight: 640 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: mhTheme.textMute, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            <span style={{ color: mhTheme.gold, fontSize: 8 }}>●</span>
            <span>Маркетплейс мебели на заказ · Ташкент</span>
          </div>
          <h1 style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: 82, lineHeight: 0.95, fontWeight: 300, letterSpacing: '-0.03em', margin: 0 }}>
            Мебель,<br/>
            <em style={{ fontStyle: 'italic', color: mhTheme.gold, fontWeight: 300 }}>созданная</em> для вас<br/>
            <span style={{ color: 'rgba(232,230,225,0.45)' }}>руками мастеров.</span>
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: mhTheme.textDim, maxWidth: 460, margin: 0 }}>
            Опишите вашу идею — и получите предложения от проверенных мебельщиков.
            Не ищите мастера. Мастер найдёт вас.
          </p>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <button onClick={() => onNav('order')} style={{
              background: mhTheme.gold, color: mhTheme.bg, border: 'none', padding: '16px 24px',
              fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 14, borderRadius: 2,
            }}>
              <span>Разместить заказ</span><span style={{ fontSize: 16 }}>→</span>
            </button>
            <button onClick={() => onNav('masters')} style={{
              background: 'transparent', color: mhTheme.text, border: `1px solid ${mhTheme.borderStrong}`,
              padding: '16px 24px', fontSize: 13, fontWeight: 500, letterSpacing: '0.06em', cursor: 'pointer', borderRadius: 2,
            }}>Посмотреть мастеров</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 16 }}>
            {[['500','+','Заказов\nразмещено'],['120','+','Мастеров\nв Ташкенте'],['4.8','★','Средний\nрейтинг']].map(([n, suf, lbl], i) => (
              <React.Fragment key={i}>
                {i > 0 && <div style={{ width: 1, height: 32, background: mhTheme.border }}/>}
                <div>
                  <div style={{ fontFamily: '"Fraunces", serif', fontSize: 34, fontWeight: 300, letterSpacing: '-0.02em' }}>
                    {n}<span style={{ color: mhTheme.gold, fontSize: 20, marginLeft: suf === '★' ? 4 : 2 }}>{suf}</span>
                  </div>
                  <div style={{ fontSize: 11, color: mhTheme.textMute, lineHeight: 1.3, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'pre-line' }}>{lbl}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Hero animation */}
        <div style={{ position: 'relative', minHeight: 500, height: '100%' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, #15181F 0%, #0A0D12 70%)', border: `1px solid ${mhTheme.border}`, overflow: 'hidden' }}>
            <svg viewBox="0 0 600 600" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="h_top" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#4a3c2e"/><stop offset="1" stopColor="#2d231a"/>
                </linearGradient>
                <linearGradient id="h_front" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#3a2f23"/><stop offset="1" stopColor="#1c1510"/>
                </linearGradient>
                <linearGradient id="h_side" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#2d241c"/><stop offset="1" stopColor="#14100a"/>
                </linearGradient>
                <linearGradient id="h_gold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#F0C878"/><stop offset="1" stopColor="#A07832"/>
                </linearGradient>
                <radialGradient id="h_glow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0" stopColor="#E4B668" stopOpacity="0.6"/>
                  <stop offset="1" stopColor="#E4B668" stopOpacity="0"/>
                </radialGradient>
              </defs>
              {/* grid floor */}
              <g opacity="0.2" stroke="#3a3a40" strokeWidth="0.5">
                {Array.from({length: 11}).map((_, i) => {
                  const [x1,y1] = pt(i-3, -2, 0), [x2,y2] = pt(i-3, 5, 0);
                  return <line key={'g1'+i} x1={x1} y1={y1} x2={x2} y2={y2}/>;
                })}
                {Array.from({length: 11}).map((_, i) => {
                  const [x1,y1] = pt(-3, i-2, 0), [x2,y2] = pt(5, i-2, 0);
                  return <line key={'g2'+i} x1={x1} y1={y1} x2={x2} y2={y2}/>;
                })}
              </g>
              {/* Ground shadow */}
              {(() => {
                const [sx, sy] = pt(0,0,0), [ex,ey] = pt(4,2,0);
                return <ellipse cx={(sx+ex)/2} cy={(sy+ey)/2 + 4} rx="110" ry="22" fill="#000" opacity={0.3 * p(1.5, 1)}/>;
              })()}
              {/* BOTTOM */}
              {(() => { const f = fly(1.5); return (
                <g opacity={f.op} transform={`translate(0, ${-f.dz*SY})`}>
                  <polygon points={topFace(0,0,0.15,4,2)} fill="url(#h_top)" stroke="#000" strokeWidth="0.3"/>
                  <polygon points={frontFace(0,4,0,0,0.15)} fill="url(#h_front)" stroke="#000" strokeWidth="0.3"/>
                  <polygon points={sideFace(4,0,2,0,0.15)} fill="url(#h_side)" stroke="#000" strokeWidth="0.3"/>
                </g>);})()}
              {/* BACK */}
              {(() => { const f = fly(0); return (
                <g opacity={f.op} transform={`translate(0, ${-f.dz*SY})`}>
                  <polygon points={pts([[0,2,0.15],[4,2,0.15],[4,2,5],[0,2,5]])} fill="url(#h_side)" stroke="#000" strokeWidth="0.3"/>
                </g>);})()}
              {/* LEFT */}
              {(() => { const f = fly(0.5); return (
                <g opacity={f.op} transform={`translate(0, ${-f.dz*SY})`}>
                  <polygon points={pts([[0,0,0.15],[0,2,0.15],[0,2,5],[0,0,5]])} fill="url(#h_front)" stroke="#000" strokeWidth="0.3"/>
                </g>);})()}
              {/* RIGHT */}
              {(() => { const f = fly(1.0); return (
                <g opacity={f.op} transform={`translate(0, ${-f.dz*SY})`}>
                  <polygon points={pts([[4,0,0.15],[4,2,0.15],[4,2,5],[4,0,5]])} fill="url(#h_side)" stroke="#000" strokeWidth="0.3"/>
                </g>);})()}
              {/* SHELF */}
              {(() => { const f = fly(2.0); return (
                <g opacity={f.op*0.9} transform={`translate(0, ${-f.dz*SY})`}>
                  <polygon points={topFace(0,0,2.5,4,2)} fill="url(#h_top)" stroke="#000" strokeWidth="0.3" opacity="0.8"/>
                </g>);})()}
              {/* TOP */}
              {(() => { const f = fly(2.5); return (
                <g opacity={f.op} transform={`translate(0, ${-f.dz*SY})`}>
                  <polygon points={topFace(0,0,5.15,4,2)} fill="url(#h_top)" stroke="#000" strokeWidth="0.3"/>
                  <polygon points={frontFace(0,4,0,5,5.15)} fill="url(#h_front)" stroke="#000" strokeWidth="0.3"/>
                  <polygon points={sideFace(4,0,2,5,5.15)} fill="url(#h_side)" stroke="#000" strokeWidth="0.3"/>
                </g>);})()}
              {/* DOOR L */}
              {(() => { const f = fly(3.0); return (
                <g opacity={f.op} transform={`translate(0, ${-f.dz*SY})`}>
                  <polygon points={pts([[0,0,0.15],[2,0,0.15],[2,0,5],[0,0,5]])} fill="url(#h_front)" stroke="#000" strokeWidth="0.3"/>
                </g>);})()}
              {/* DOOR R */}
              {(() => { const f = fly(3.5); return (
                <g opacity={f.op} transform={`translate(0, ${-f.dz*SY})`}>
                  <polygon points={pts([[2,0,0.15],[4,0,0.15],[4,0,5],[2,0,5]])} fill="url(#h_front)" stroke="#000" strokeWidth="0.3"/>
                </g>);})()}
              {/* HANDLES */}
              {(() => {
                const op = p(4.0, 0.5);
                const [h1x,h1y] = pt(1.7,0,2.2), [h1x2,h1y2] = pt(1.7,0,2.8);
                const [h2x,h2y] = pt(2.3,0,2.2), [h2x2,h2y2] = pt(2.3,0,2.8);
                return (
                  <g opacity={op}>
                    <line x1={h1x} y1={h1y} x2={h1x2} y2={h1y2} stroke="url(#h_gold)" strokeWidth="3.5" strokeLinecap="round"/>
                    <line x1={h2x} y1={h2y} x2={h2x2} y2={h2y2} stroke="url(#h_gold)" strokeWidth="3.5" strokeLinecap="round"/>
                  </g>);})()}
              {/* GLINTS */}
              {(() => {
                const op = p(4.5, 0.5);
                const corners = [[0,0,5],[4,0,5],[4,2,5],[0,2,5],[0,0,0.15],[4,0,0.15]];
                return <g opacity={op}>{corners.map(([x,y,z], i) => {
                  const [px, py] = pt(x,y,z);
                  return <g key={i}><circle cx={px} cy={py} r="8" fill="url(#h_glow)"/><circle cx={px} cy={py} r="1.8" fill="#F0C878"/></g>;
                })}</g>;})()}
            </svg>
            <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: 'rgba(10,13,18,0.7)', border: `1px solid ${mhTheme.border}`, fontSize: 11, color: mhTheme.textDim, backdropFilter: 'blur(8px)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: mhTheme.success, animation: 'pulse 2s infinite' }}/>
              <span>Мастер Улугбек · сборка комода</span>
            </div>
            <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24 }}>
              <div style={{ fontSize: 10, color: mhTheme.gold, letterSpacing: '0.14em', textTransform: 'uppercase' }}>В процессе</div>
              <div style={{ fontFamily: '"Fraunces", serif', fontSize: 20, fontWeight: 300, fontStyle: 'italic', marginTop: 4 }}>Комод «Бухара» · дуб · латунная фурнитура</div>
            </div>
          </div>
        </div>
      </section>

      {/* CAT STRIP */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 40, padding: '22px 40px', borderTop: `1px solid ${mhTheme.border}`, borderBottom: `1px solid ${mhTheme.border}` }}>
        <div style={{ fontSize: 10, color: mhTheme.textMute, letterSpacing: '0.16em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Что можно заказать</div>
        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          {MH_CATEGORIES.map(c => (
            <span key={c.id} style={{ fontSize: 13, color: mhTheme.textDim, cursor: 'pointer' }}>{c.name} <span style={{ color: mhTheme.textMute, fontSize: 10 }}>{c.count}</span></span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section style={{ padding: '100px 40px', borderBottom: `1px solid ${mhTheme.border}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 60, marginBottom: 60 }}>
          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.14em', paddingBottom: 14, borderBottom: `1px solid ${mhTheme.gold}`, alignSelf: 'flex-start', marginBottom: 20, display: 'inline-block' }}>§ 01 · ПРОЦЕСС</div>
            <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 52, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>
              Как это<br/><em style={{ color: mhTheme.gold }}>работает</em>
            </h2>
          </div>
          <div style={{ fontSize: 16, color: mhTheme.textDim, lineHeight: 1.6, maxWidth: 540, alignSelf: 'end' }}>
            Три шага от идеи до готовой мебели. Без посредников, без торга вслепую, без риска работы с непроверенным мастером.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, background: mhTheme.border }}>
          {[
            { n: '01', t: 'Опишите заказ', d: 'Укажите размеры, стиль, материал и бюджет. Прикрепите фото для вдохновения. 5 минут — и заявка опубликована.' },
            { n: '02', t: 'Получите офферы', d: 'Мастера Ташкента увидят ваш заказ и пришлют предложения с ценой, сроком и 3D-эскизом. Обычно — в течение часа.' },
            { n: '03', t: 'Выберите мастера', d: 'Сравните офферы, посмотрите портфолио, прочитайте отзывы. Договоритесь в чате и заключите сделку.' },
          ].map(s => (
            <div key={s.n} style={{ background: mhTheme.bg, padding: '40px 32px', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 280 }}>
              <div style={{ fontFamily: '"Fraunces", serif', fontSize: 64, fontWeight: 300, color: mhTheme.gold, fontStyle: 'italic', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontFamily: '"Fraunces", serif', fontSize: 24, fontWeight: 400, letterSpacing: '-0.02em' }}>{s.t}</div>
              <div style={{ fontSize: 14, color: mhTheme.textDim, lineHeight: 1.6 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE FEED */}
      <section style={{ padding: '100px 40px', borderBottom: `1px solid ${mhTheme.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.14em', marginBottom: 16 }}>§ 02 · ЛЕНТА · LIVE</div>
            <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 52, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>
              Сейчас заказывают
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: mhTheme.textDim, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: mhTheme.success, animation: 'pulse 2s infinite' }}/>
            Обновляется в реальном времени
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {MH_ORDERS_FEED.map((o, i) => (
            <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '50px 1fr auto auto auto', gap: 24, padding: '22px 0', borderBottom: `1px solid ${mhTheme.border}`, borderTop: i === 0 ? `1px solid ${mhTheme.border}` : 'none', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.textMute }}>#{String(i+1).padStart(2,'0')}</div>
              <div style={{ fontSize: 17, fontWeight: 400 }}>{o.title}</div>
              <div style={{ fontSize: 12, color: mhTheme.textDim }}>{o.district}</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: mhTheme.gold, letterSpacing: '0.04em' }}>{o.budget}</div>
              <div style={{ fontSize: 12, color: mhTheme.textMute, minWidth: 100, textAlign: 'right' }}>{o.offers} офферов · {o.time}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED WORKS */}
      <section style={{ padding: '100px 40px', borderBottom: `1px solid ${mhTheme.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.14em', marginBottom: 16 }}>§ 03 · РАБОТЫ</div>
            <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 52, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>
              Сделано<br/><em style={{ color: mhTheme.gold }}>мастерами</em>
            </h2>
          </div>
          <span onClick={() => onNav('works')} style={{ fontSize: 12, color: mhTheme.textDim, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>Все работы →</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {MH_WORKS.slice(0, 6).map(w => {
            const master = MH_MASTERS.find(m => m.id === w.master);
            return (
              <div key={w.id} style={{ display: 'flex', flexDirection: 'column', gap: 14, cursor: 'pointer' }} onClick={() => onNav('master:'+w.master)}>
                <WorkThumb work={w}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 400, fontStyle: 'italic', letterSpacing: '-0.01em' }}>{w.title}</div>
                    <div style={{ fontSize: 12, color: mhTheme.textMute, marginTop: 4 }}>{w.material}</div>
                  </div>
                  <div style={{ fontSize: 11, color: mhTheme.textDim, textAlign: 'right' }}>{master.shop}<br/><span style={{ color: mhTheme.textMute }}>{w.year}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MASTERS TEASER */}
      <section style={{ padding: '100px 40px', borderBottom: `1px solid ${mhTheme.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.14em', marginBottom: 16 }}>§ 04 · МАСТЕРА</div>
            <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 52, fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>
              Проверенные мебельщики Ташкента
            </h2>
          </div>
          <span onClick={() => onNav('masters')} style={{ fontSize: 12, color: mhTheme.textDim, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>Все мастера →</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, background: mhTheme.border }}>
          {MH_MASTERS.slice(0, 3).map(m => (
            <div key={m.id} onClick={() => onNav('master:'+m.id)} style={{ background: mhTheme.bg, padding: 32, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: m.accent, border: `1px solid ${mhTheme.borderStrong}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Fraunces", serif', fontSize: 18, color: mhTheme.gold, fontStyle: 'italic' }}>{m.name.split(' ').map(w => w[0]).join('')}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: mhTheme.textMute, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>{m.shop}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: mhTheme.textDim, lineHeight: 1.5 }}>{m.bio.slice(0, 110)}…</div>
              <div style={{ display: 'flex', gap: 16, marginTop: 'auto', paddingTop: 18, borderTop: `1px dashed ${mhTheme.border}`, fontSize: 11, color: mhTheme.textMute, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                <span><span style={{ color: mhTheme.gold }}>★ {m.rating}</span> · {m.reviews} отзывов</span>
                <span>·</span>
                <span>С {m.since}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '120px 40px', textAlign: 'center', background: `radial-gradient(ellipse at center, ${mhTheme.bgElev} 0%, ${mhTheme.bg} 80%)` }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.14em', marginBottom: 24 }}>● ГОТОВЫ НАЧАТЬ?</div>
        <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 84, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 0.95, margin: 0, maxWidth: 1000, marginLeft: 'auto', marginRight: 'auto' }}>
          Ваша идея — <em style={{ color: mhTheme.gold }}>наши руки.</em>
        </h2>
        <p style={{ fontSize: 17, color: mhTheme.textDim, marginTop: 28, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.55 }}>
          Размещение заказа бесплатно. Первые предложения придут в течение часа.
        </p>
        <button onClick={() => onNav('order')} style={{
          background: mhTheme.gold, color: mhTheme.bg, border: 'none', padding: '20px 36px',
          fontSize: 14, fontWeight: 600, letterSpacing: '0.08em', cursor: 'pointer',
          marginTop: 36, borderRadius: 2, display: 'inline-flex', alignItems: 'center', gap: 16, textTransform: 'uppercase',
        }}>
          Разместить заказ<span style={{ fontSize: 18 }}>→</span>
        </button>
      </section>
    </div>
  );
};

window.HomePage = HomePage;
