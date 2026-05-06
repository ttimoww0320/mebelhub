// Variation 3: "Obsidian" — Cinematic, atmospheric, minimal text
// Full-bleed image zone + floating UI. Gold microaccents. Feels like a film title.

const ObsidianHero = () => {
  const [t, setT] = React.useState(0);
  const [tab, setTab] = React.useState(0);
  React.useEffect(() => {
    let raf;
    let start = performance.now();
    const tick = (now) => {
      setT((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Panning "shot" — fake camera move across scene
  const pan = Math.sin(t * 0.3) * 20;

  return (
    <div style={obsidianStyles.page}>
      {/* Atmospheric placeholder scene — workshop interior rendered as layered gradients + shapes */}
      <div style={obsidianStyles.scene}>
        {/* Back wall gradient */}
        <div style={obsidianStyles.backwall} />
        {/* Light beam */}
        <div style={{...obsidianStyles.lightBeam, transform: `translateX(${pan}px)`}} />
        {/* Dust particles */}
        {Array.from({length: 30}).map((_, i) => {
          const y = (((t * (10 + i % 8)) + i * 37) % 120) - 10;
          const x = 5 + (i * 13 % 90);
          const op = 0.15 + (Math.sin(t + i) * 0.1);
          return (
            <div key={i} style={{
              position: 'absolute', width: 2, height: 2, borderRadius: '50%',
              background: '#E4B668', left: `${x}%`, top: `${y}%`, opacity: op,
              filter: 'blur(0.5px)',
            }}/>
          );
        })}

        {/* Silhouette of workbench with workpiece — represented as geometric shapes */}
        <svg viewBox="0 0 1200 700" style={obsidianStyles.sceneSvg} preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="benchGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1a1510"/>
              <stop offset="1" stopColor="#05040a"/>
            </linearGradient>
            <radialGradient id="spotlight" cx="0.5" cy="0.3" r="0.5">
              <stop offset="0" stopColor="#E4B668" stopOpacity="0.12"/>
              <stop offset="1" stopColor="#E4B668" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <rect width="1200" height="700" fill="url(#spotlight)" transform={`translate(${pan},0)`}/>
          {/* Floor */}
          <polygon points="0,620 1200,620 1200,700 0,700" fill="#06080c"/>
          {/* Workbench */}
          <g transform={`translate(${-pan * 0.5}, 0)`}>
            <rect x="200" y="440" width="800" height="20" fill="#1a120a" stroke="#2a1f14" strokeWidth="1"/>
            <rect x="220" y="460" width="20" height="160" fill="#0f0a06"/>
            <rect x="960" y="460" width="20" height="160" fill="#0f0a06"/>
            {/* Workpiece — a partially built cabinet */}
            <rect x="450" y="280" width="240" height="160" fill="#241a10" stroke="#3a2a18" strokeWidth="1"/>
            <line x1="570" y1="280" x2="570" y2="440" stroke="#0a0604" strokeWidth="1"/>
            <rect x="458" y="288" width="108" height="144" fill="none" stroke="#3a2a18" strokeWidth="0.5"/>
            <rect x="574" y="288" width="108" height="144" fill="none" stroke="#3a2a18" strokeWidth="0.5"/>
            {/* Gold handle glint */}
            <circle cx={565 + Math.sin(t) * 0.5} cy="360" r="1.5" fill="#E4B668"/>
            <circle cx="575" cy="360" r="1.5" fill="#E4B668"/>
            {/* Tools silhouette */}
            <rect x="720" y="420" width="100" height="4" fill="#0a0604"/>
            <rect x="730" y="416" width="12" height="8" fill="#0a0604"/>
            {/* Clamp */}
            <rect x="380" y="432" width="30" height="12" fill="#0a0604"/>
          </g>
          {/* Foreground haze */}
          <rect width="1200" height="700" fill="url(#benchGrad)" opacity="0.4"/>
        </svg>

        {/* Vignette */}
        <div style={obsidianStyles.vignette} />

        {/* Film grain */}
        <div style={obsidianStyles.grain} />
      </div>

      {/* Floating Top nav */}
      <div style={obsidianStyles.topnav}>
        <div style={obsidianStyles.logoBlock}>
          <div style={obsidianStyles.logoGlyph}>M</div>
          <div>
            <div style={obsidianStyles.logoName}>MEBELHUB</div>
            <div style={obsidianStyles.logoTag}>SINCE 2024 · TASHKENT</div>
          </div>
        </div>
        <nav style={obsidianStyles.nav}>
          <span style={obsidianStyles.navLink}>Discover</span>
          <span style={obsidianStyles.navLink}>Makers</span>
          <span style={obsidianStyles.navLink}>Commission</span>
          <span style={obsidianStyles.navLink}>Journal</span>
        </nav>
        <div style={obsidianStyles.topRight}>
          <div style={obsidianStyles.lang}>RU / UZ / EN</div>
          <button style={obsidianStyles.enterBtn}>Войти</button>
        </div>
      </div>

      {/* Centered hero content — sparse */}
      <div style={obsidianStyles.center}>
        <div style={obsidianStyles.markText}>— №001 · Ателье мастеров Ташкента</div>
        <h1 style={obsidianStyles.h1}>
          Здесь рождается<br/>
          <span style={obsidianStyles.h1Italic}>ваша мебель.</span>
        </h1>

        {/* Floating search panel — glassy */}
        <div style={obsidianStyles.searchPanel}>
          <div style={obsidianStyles.tabs}>
            {['Заказать на заказ', 'Найти мастера', 'Посмотреть работы'].map((label, i) => (
              <button
                key={i}
                onClick={() => setTab(i)}
                style={{...obsidianStyles.tab, ...(tab === i ? obsidianStyles.tabActive : {})}}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={obsidianStyles.searchBody}>
            <div style={obsidianStyles.searchField}>
              <div style={obsidianStyles.fieldLabel}>Что нужно</div>
              <div style={obsidianStyles.fieldValue}>
                {tab === 0 && 'Кухонный гарнитур'}
                {tab === 1 && 'По материалу и стилю'}
                {tab === 2 && 'Все категории'}
                <span style={obsidianStyles.fieldCaret}>▾</span>
              </div>
            </div>
            <div style={obsidianStyles.fieldDivider}/>
            <div style={obsidianStyles.searchField}>
              <div style={obsidianStyles.fieldLabel}>Район Ташкента</div>
              <div style={obsidianStyles.fieldValue}>Мирабадский<span style={obsidianStyles.fieldCaret}>▾</span></div>
            </div>
            <div style={obsidianStyles.fieldDivider}/>
            <div style={obsidianStyles.searchField}>
              <div style={obsidianStyles.fieldLabel}>Бюджет</div>
              <div style={obsidianStyles.fieldValue}>1 000 — 3 000 $<span style={obsidianStyles.fieldCaret}>▾</span></div>
            </div>
            <button style={obsidianStyles.searchBtn}>
              <span>Начать</span>
              <span style={obsidianStyles.searchBtnArrow}>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom credits */}
      <div style={obsidianStyles.credits}>
        <div style={obsidianStyles.creditsLeft}>
          <span style={obsidianStyles.recordingDot}/>
          <span>Съёмка из мастерской «Дуб и Латунь» · Юнусабад</span>
        </div>
        <div style={obsidianStyles.creditsCenter}>
          <span>01</span>
          <span style={obsidianStyles.creditsBar}/>
          <span style={{color: 'rgba(232,230,225,0.5)'}}>04</span>
        </div>
        <div style={obsidianStyles.creditsRight}>
          <span>SCROLL</span>
          <span style={obsidianStyles.scrollArrow}>↓</span>
        </div>
      </div>
    </div>
  );
};

const obsidianStyles = {
  page: {
    width: '100%', height: '100%', background: '#05060a', color: '#E8E6E1',
    fontFamily: '"Inter Tight", -apple-system, sans-serif',
    position: 'relative', overflow: 'hidden',
  },
  scene: { position: 'absolute', inset: 0 },
  backwall: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse at 55% 40%, #1a150e 0%, #0a0806 40%, #05040a 80%)',
  },
  lightBeam: {
    position: 'absolute', top: '-10%', left: '30%', width: '40%', height: '90%',
    background: 'linear-gradient(180deg, rgba(228,182,104,0.08) 0%, rgba(228,182,104,0) 60%)',
    transform: 'skewX(-10deg)', filter: 'blur(20px)',
  },
  sceneSvg: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
  vignette: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
    pointerEvents: 'none',
  },
  grain: {
    position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
    backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22/></filter><rect width=%22100%22 height=%22100%22 filter=%22url(%23n)%22/></svg>")',
  },

  topnav: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5,
    display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
    padding: '24px 48px', gap: 40,
  },
  logoBlock: { display: 'flex', alignItems: 'center', gap: 12 },
  logoGlyph: {
    width: 42, height: 42, borderRadius: '50%',
    background: 'linear-gradient(135deg, #E4B668, #A07832)',
    color: '#0a0806', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 500, fontStyle: 'italic',
  },
  logoName: { fontSize: 13, letterSpacing: '0.22em', fontWeight: 500 },
  logoTag: { fontSize: 9, fontFamily: 'monospace', color: 'rgba(232,230,225,0.5)', letterSpacing: '0.14em', marginTop: 2 },
  nav: { display: 'flex', gap: 36 },
  navLink: { fontSize: 12, color: 'rgba(232,230,225,0.8)', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' },
  topRight: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 20 },
  lang: { fontFamily: 'monospace', fontSize: 10, color: 'rgba(232,230,225,0.5)', letterSpacing: '0.12em' },
  enterBtn: {
    background: 'rgba(232,230,225,0.05)', backdropFilter: 'blur(12px)',
    border: '1px solid rgba(232,230,225,0.15)', color: '#E8E6E1',
    padding: '9px 20px', fontSize: 11, letterSpacing: '0.12em',
    textTransform: 'uppercase', cursor: 'pointer', borderRadius: 100,
  },

  center: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32,
    width: '90%', maxWidth: 900, zIndex: 4,
  },
  markText: {
    fontFamily: 'monospace', fontSize: 11, color: '#E4B668',
    letterSpacing: '0.2em', textTransform: 'uppercase',
  },
  h1: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: 96, lineHeight: 0.95, fontWeight: 300, letterSpacing: '-0.035em',
    margin: 0, textAlign: 'center',
    textShadow: '0 4px 40px rgba(0,0,0,0.6)',
  },
  h1Italic: { fontStyle: 'italic', color: '#E4B668', fontWeight: 300 },

  searchPanel: {
    background: 'rgba(10,8,6,0.6)', backdropFilter: 'blur(20px)',
    border: '1px solid rgba(228,182,104,0.2)',
    padding: 0, minWidth: 720, borderRadius: 4,
    boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
  },
  tabs: { display: 'flex', borderBottom: '1px solid rgba(228,182,104,0.15)' },
  tab: {
    flex: 1, background: 'transparent', border: 'none', color: 'rgba(232,230,225,0.55)',
    padding: '14px 20px', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
    cursor: 'pointer', borderBottom: '2px solid transparent', transition: 'all 0.2s',
  },
  tabActive: {
    color: '#E4B668', borderBottomColor: '#E4B668',
    background: 'rgba(228,182,104,0.05)',
  },
  searchBody: { display: 'flex', alignItems: 'stretch' },
  searchField: { flex: 1, padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer' },
  fieldDivider: { width: 1, background: 'rgba(228,182,104,0.15)' },
  fieldLabel: { fontFamily: 'monospace', fontSize: 9, color: 'rgba(232,230,225,0.45)', letterSpacing: '0.16em', textTransform: 'uppercase' },
  fieldValue: { fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  fieldCaret: { color: '#E4B668', fontSize: 10 },
  searchBtn: {
    background: '#E4B668', color: '#0a0806', border: 'none', padding: '0 36px',
    fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
  },
  searchBtnArrow: { fontSize: 18 },

  credits: {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5,
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'center',
    padding: '22px 48px', fontFamily: 'monospace', fontSize: 10,
    color: 'rgba(232,230,225,0.7)', letterSpacing: '0.14em', textTransform: 'uppercase',
  },
  creditsLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  recordingDot: { width: 6, height: 6, borderRadius: '50%', background: '#c83030', boxShadow: '0 0 8px #c83030', animation: 'none' },
  creditsCenter: { display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center' },
  creditsBar: { width: 120, height: 1, background: 'linear-gradient(90deg, #E4B668 30%, rgba(232,230,225,0.2) 30%)' },
  creditsRight: { display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' },
  scrollArrow: { color: '#E4B668' },
};

window.ObsidianHero = ObsidianHero;
