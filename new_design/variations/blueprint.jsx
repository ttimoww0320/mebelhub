// Variation 2: "Blueprint" — Technical, architectural, grid-driven
// Drafting aesthetic — thin lines, dimensioning, hero with a blueprint coming to life

const BlueprintHero = () => {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf;
    let start = performance.now();
    const tick = (now) => {
      setT(((now - start) / 1000) % 10);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Blueprint lines draw, then fill renders
  const draw = Math.max(0, Math.min(1, t / 3.5));
  const fill = Math.max(0, Math.min(1, (t - 3.5) / 2));
  const fade = Math.max(0, Math.min(1, (t - 7.5) / 1));

  return (
    <div style={blueprintStyles.page}>
      {/* Corner crosshairs */}
      <div style={{...blueprintStyles.crosshair, top: 16, left: 16}}>+</div>
      <div style={{...blueprintStyles.crosshair, top: 16, right: 16}}>+</div>
      <div style={{...blueprintStyles.crosshair, bottom: 16, left: 16}}>+</div>
      <div style={{...blueprintStyles.crosshair, bottom: 16, right: 16}}>+</div>

      {/* Top */}
      <header style={blueprintStyles.header}>
        <div style={blueprintStyles.headerLeft}>
          <div style={blueprintStyles.logoBox}>M/H</div>
          <div style={blueprintStyles.fileInfo}>
            <div style={blueprintStyles.fileName}>MEBELHUB · TASHKENT</div>
            <div style={blueprintStyles.fileMeta}>DOC-001 · REV.04 · 2026</div>
          </div>
        </div>
        <nav style={blueprintStyles.nav}>
          <span style={blueprintStyles.navLink}>01 / Мастера</span>
          <span style={blueprintStyles.navLink}>02 / Работы</span>
          <span style={blueprintStyles.navLink}>03 / Процесс</span>
          <span style={blueprintStyles.navLink}>04 / Гарантии</span>
        </nav>
        <div style={blueprintStyles.headerRight}>
          <span style={blueprintStyles.navLink}>Войти</span>
          <button style={blueprintStyles.ctaBtn}>Начать проект →</button>
        </div>
      </header>

      {/* Main grid */}
      <main style={blueprintStyles.main}>
        {/* Left: Big headline */}
        <section style={blueprintStyles.leftCol}>
          <div style={blueprintStyles.sectionMarker}>§ 01 · Предложение</div>

          <h1 style={blueprintStyles.h1}>
            Точность<br/>
            <span style={blueprintStyles.h1Accent}>ремесленника.</span><br/>
            Масштаб<br/>
            <span style={blueprintStyles.h1Dim}>маркетплейса.</span>
          </h1>

          <div style={blueprintStyles.specs}>
            <div style={blueprintStyles.specRow}>
              <span style={blueprintStyles.specKey}>Заказ</span>
              <span style={blueprintStyles.specVal}>— бесплатно, 5 минут</span>
            </div>
            <div style={blueprintStyles.specRow}>
              <span style={blueprintStyles.specKey}>Офферы</span>
              <span style={blueprintStyles.specVal}>— в течение часа</span>
            </div>
            <div style={blueprintStyles.specRow}>
              <span style={blueprintStyles.specKey}>Мастера</span>
              <span style={blueprintStyles.specVal}>— проверенные, с портфолио</span>
            </div>
            <div style={blueprintStyles.specRow}>
              <span style={blueprintStyles.specKey}>Оплата</span>
              <span style={blueprintStyles.specVal}>— безопасная, поэтапно</span>
            </div>
          </div>

          <div style={blueprintStyles.ctaRow}>
            <button style={blueprintStyles.ctaPrimary}>
              Разместить ТЗ
              <span style={blueprintStyles.ctaPlus}>+</span>
            </button>
            <button style={blueprintStyles.ctaSecondary}>
              Я мастер
            </button>
          </div>
        </section>

        {/* Right: Blueprint animation */}
        <section style={blueprintStyles.rightCol}>
          {/* Title bar above drawing */}
          <div style={blueprintStyles.drawingHeader}>
            <div style={blueprintStyles.drawingTitle}>DWG. 01 — CABINET · OAK · 1800×400×2100</div>
            <div style={blueprintStyles.drawingRev}>SCALE 1:20</div>
          </div>

          <div style={blueprintStyles.drawing}>
            <svg viewBox="0 0 500 500" style={blueprintStyles.svg}>
              <defs>
                <pattern id="bpGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a2430" strokeWidth="0.3"/>
                </pattern>
                <pattern id="bpGridMajor" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#24334a" strokeWidth="0.5"/>
                </pattern>
                <linearGradient id="cabFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#3a3026" stopOpacity="0.8"/>
                  <stop offset="1" stopColor="#1a1410" stopOpacity="0.8"/>
                </linearGradient>
              </defs>
              <rect width="500" height="500" fill="url(#bpGrid)"/>
              <rect width="500" height="500" fill="url(#bpGridMajor)"/>

              {/* Fill appears second */}
              <g opacity={fill * (1 - fade * 0.3)}>
                <rect x="110" y="120" width="280" height="300" fill="url(#cabFill)"/>
                {/* Door handles */}
                <rect x="248" y="250" width="4" height="40" fill="#E4B668"/>
              </g>

              {/* Blueprint strokes — outline of cabinet drawing progressively */}
              <g stroke="#7FB4D4" strokeWidth="1" fill="none" strokeLinecap="square"
                 opacity={1 - fade * 0.5}>
                {/* outer box — dashed-like progressive draw using strokeDasharray */}
                <rect x="110" y="120" width="280" height="300"
                      strokeDasharray="1160"
                      strokeDashoffset={1160 * (1 - Math.min(1, draw * 2))}/>
                {/* center divider */}
                <line x1="250" y1="120" x2="250" y2="420"
                      strokeDasharray="300"
                      strokeDashoffset={300 * (1 - Math.max(0, Math.min(1, (draw - 0.3) / 0.3)))}/>
                {/* shelves */}
                <line x1="110" y1="200" x2="390" y2="200"
                      strokeDasharray="280"
                      strokeDashoffset={280 * (1 - Math.max(0, Math.min(1, (draw - 0.5) / 0.3)))}/>
                <line x1="110" y1="320" x2="390" y2="320"
                      strokeDasharray="280"
                      strokeDashoffset={280 * (1 - Math.max(0, Math.min(1, (draw - 0.6) / 0.3)))}/>
                {/* handles */}
                <circle cx="230" cy="270" r="3"
                        strokeDasharray="20"
                        strokeDashoffset={20 * (1 - Math.max(0, Math.min(1, (draw - 0.85) / 0.15)))}/>
                <circle cx="270" cy="270" r="3"
                        strokeDasharray="20"
                        strokeDashoffset={20 * (1 - Math.max(0, Math.min(1, (draw - 0.85) / 0.15)))}/>
              </g>

              {/* Dimension lines — appear after outlines */}
              <g stroke="#E4B668" strokeWidth="0.5" fill="#E4B668" fontFamily="monospace" fontSize="9"
                 opacity={Math.max(0, Math.min(1, (draw - 0.8) / 0.2)) * (1 - fade)}>
                {/* Width dim */}
                <line x1="110" y1="100" x2="390" y2="100"/>
                <line x1="110" y1="95" x2="110" y2="105"/>
                <line x1="390" y1="95" x2="390" y2="105"/>
                <text x="235" y="93" textAnchor="middle" stroke="none">1800</text>
                {/* Height dim */}
                <line x1="420" y1="120" x2="420" y2="420"/>
                <line x1="415" y1="120" x2="425" y2="120"/>
                <line x1="415" y1="420" x2="425" y2="420"/>
                <text x="430" y="273" stroke="none">2100</text>
              </g>

              {/* Annotations */}
              <g fontFamily="monospace" fontSize="8" fill="#7FB4D4"
                 opacity={Math.max(0, Math.min(1, (draw - 0.9) / 0.1)) * (1 - fade)}>
                <line x1="200" y1="270" x2="70" y2="440" stroke="#7FB4D4" strokeWidth="0.3"/>
                <circle cx="200" cy="270" r="2" fill="#E4B668"/>
                <text x="50" y="455">(1) ДУБ · МАТОВЫЙ ЛАК</text>
                <line x1="320" y1="160" x2="440" y2="70" stroke="#7FB4D4" strokeWidth="0.3"/>
                <circle cx="320" cy="160" r="2" fill="#E4B668"/>
                <text x="390" y="60">(2) ЛАТУНЬ</text>
              </g>
            </svg>
          </div>

          <div style={blueprintStyles.drawingFooter}>
            <span>CRAFT. Улугбек А.</span>
            <span>·</span>
            <span>EST. 2018</span>
            <span>·</span>
            <span style={{color: '#E4B668'}}>● В ПРОЦЕССЕ</span>
          </div>
        </section>
      </main>

      {/* Bottom strip — live ticker */}
      <footer style={blueprintStyles.footer}>
        <div style={blueprintStyles.tickerLabel}>ЛЕНТА ЗАКАЗОВ</div>
        <div style={blueprintStyles.tickerContent}>
          <span>→ Кухня · Юнусабад · бюджет $2,400</span>
          <span style={blueprintStyles.tickerSep}>◆</span>
          <span>→ Гардеробная · Мирабад · 3 оффера</span>
          <span style={blueprintStyles.tickerSep}>◆</span>
          <span>→ Обеденный стол · Чиланзар · в работе</span>
        </div>
        <div style={blueprintStyles.tickerClock}>03:42 UTC+5</div>
      </footer>
    </div>
  );
};

const blueprintStyles = {
  page: {
    width: '100%', height: '100%', background: '#0B121C', color: '#D8DEE9',
    fontFamily: '"Inter Tight", -apple-system, sans-serif',
    display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
  },
  crosshair: { position: 'absolute', color: '#E4B668', fontSize: 12, opacity: 0.5 },
  header: {
    display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', alignItems: 'center',
    padding: '20px 48px', borderBottom: '1px solid rgba(216,222,233,0.08)',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  logoBox: {
    width: 36, height: 36, border: '1px solid #E4B668', color: '#E4B668',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
  },
  fileInfo: { display: 'flex', flexDirection: 'column', gap: 2 },
  fileName: { fontSize: 11, letterSpacing: '0.18em', fontWeight: 600 },
  fileMeta: { fontSize: 9, fontFamily: 'monospace', color: 'rgba(216,222,233,0.5)', letterSpacing: '0.08em' },
  nav: { display: 'flex', justifyContent: 'center', gap: 28 },
  navLink: { fontFamily: 'monospace', fontSize: 11, color: 'rgba(216,222,233,0.7)', letterSpacing: '0.06em', cursor: 'pointer' },
  headerRight: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 20 },
  ctaBtn: {
    background: 'transparent', color: '#E4B668', border: '1px solid #E4B668',
    padding: '10px 18px', fontSize: 11, fontFamily: 'monospace',
    letterSpacing: '0.06em', cursor: 'pointer',
  },

  main: {
    flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr',
    padding: '50px 48px 30px', gap: 48,
  },
  leftCol: { display: 'flex', flexDirection: 'column', gap: 28 },
  sectionMarker: {
    fontFamily: 'monospace', fontSize: 11, color: '#E4B668',
    letterSpacing: '0.14em', paddingBottom: 14,
    borderBottom: '1px solid rgba(228,182,104,0.3)', alignSelf: 'flex-start',
    paddingRight: 40,
  },
  h1: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: 76, lineHeight: 0.96, fontWeight: 300, letterSpacing: '-0.03em',
    margin: 0, color: '#E8EEF5',
  },
  h1Accent: { color: '#E4B668', fontStyle: 'italic' },
  h1Dim: { color: 'rgba(216,222,233,0.35)' },

  specs: {
    display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 20,
    borderTop: '1px dashed rgba(216,222,233,0.15)', marginTop: 10,
  },
  specRow: { display: 'flex', gap: 14, fontSize: 14 },
  specKey: { fontFamily: 'monospace', fontSize: 11, color: 'rgba(216,222,233,0.5)', letterSpacing: '0.08em', minWidth: 80, paddingTop: 2 },
  specVal: { color: 'rgba(232,238,245,0.85)' },

  ctaRow: { display: 'flex', gap: 12, marginTop: 8 },
  ctaPrimary: {
    background: '#E4B668', color: '#0B121C', border: 'none',
    padding: '16px 24px', fontSize: 12, fontFamily: 'monospace',
    fontWeight: 700, letterSpacing: '0.1em', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 14,
  },
  ctaPlus: { fontSize: 16 },
  ctaSecondary: {
    background: 'transparent', color: '#D8DEE9', border: '1px solid rgba(216,222,233,0.25)',
    padding: '16px 24px', fontSize: 12, fontFamily: 'monospace', letterSpacing: '0.1em', cursor: 'pointer',
  },

  rightCol: { display: 'flex', flexDirection: 'column' },
  drawingHeader: {
    display: 'flex', justifyContent: 'space-between', padding: '8px 14px',
    background: 'rgba(228,182,104,0.08)', border: '1px solid rgba(228,182,104,0.25)',
    fontFamily: 'monospace', fontSize: 10, color: '#E4B668', letterSpacing: '0.1em',
  },
  drawingTitle: {},
  drawingRev: {},
  drawing: {
    flex: 1, border: '1px solid rgba(228,182,104,0.25)', borderTop: 'none',
    background: '#0A0F17', position: 'relative', minHeight: 380,
  },
  svg: { width: '100%', height: '100%' },
  drawingFooter: {
    display: 'flex', gap: 14, padding: '8px 14px',
    background: 'rgba(228,182,104,0.04)', border: '1px solid rgba(228,182,104,0.25)', borderTop: 'none',
    fontFamily: 'monospace', fontSize: 10, color: 'rgba(216,222,233,0.7)', letterSpacing: '0.08em',
  },

  footer: {
    display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 30, alignItems: 'center',
    padding: '14px 48px', borderTop: '1px solid rgba(216,222,233,0.08)',
    fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.1em',
  },
  tickerLabel: { color: '#E4B668' },
  tickerContent: { display: 'flex', gap: 18, color: 'rgba(216,222,233,0.7)' },
  tickerSep: { color: '#E4B668' },
  tickerClock: { color: 'rgba(216,222,233,0.5)' },
};

window.BlueprintHero = BlueprintHero;
