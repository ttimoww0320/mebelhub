// Variation 1: "Atelier" — Editorial dark, large serif, isometric assembly animation
// Cabinet/sideboard that assembles panel-by-panel with gold dowel joints.

const AtelierHero = () => {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      setT(((now - start) / 1000) % 9); // 9-second loop (7s build + 2s hold)
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // progress helper: returns 0..1 with ease-out cubic, starting at `delay`
  const p = (delay, dur = 1) => {
    const x = Math.max(0, Math.min(1, (t - delay) / dur));
    return 1 - Math.pow(1 - x, 3);
  };

  // Isometric projection: from "box" (world) coords to 2D
  // Use a standard 30° isometric-ish; we'll use simple matrix
  // x-axis → (+0.866, +0.5), y-axis → (-0.866, +0.5), z-axis (up) → (0, -1)
  const iso = (x, y, z) => {
    const sx = 0.866 * x - 0.866 * y;
    const sy = 0.5 * x + 0.5 * y - z;
    return [sx, sy];
  };
  // Scale and center
  const SX = 40, SY = 40, CX = 300, CY = 330;
  const pt = (x, y, z) => {
    const [a, b] = iso(x, y, z);
    return [CX + a * SX, CY + b * SY];
  };
  const pts = (arr) => arr.map(([x,y,z]) => pt(x,y,z).join(',')).join(' ');

  // Cabinet dimensions in "world" grid units
  // Size: 4 wide (x), 2 deep (y), 5 tall (z). Base at z=0, top at z=5
  // Panels fly in from above (dz offset) and settle to 0

  // Stages (with delays):
  // 0.0 - back panel
  // 0.5 - left side
  // 1.0 - right side
  // 1.5 - bottom
  // 2.0 - middle shelf
  // 2.5 - top
  // 3.0 - left door (closed on front-left)
  // 3.5 - right door (closed on front-right)
  // 4.0 - gold handles appear
  // 4.5 - gold dowel glints
  // hold until 7
  const fly = (delay, amount = 4) => {
    const pv = p(delay, 0.9);
    return { dz: (1 - pv) * amount, op: Math.min(1, pv * 3) };
  };

  // Panel helpers — build quads for isometric box faces
  const topFace = (x0, y0, z, x1, y1) => pts([[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]]);
  const frontFace = (x0, x1, y, z0, z1) => pts([[x0,y,z0],[x1,y,z0],[x1,y,z1],[x0,y,z1]]);
  const sideFace = (x, y0, y1, z0, z1) => pts([[x,y0,z0],[x,y1,z0],[x,y1,z1],[x,y0,z1]]);

  return (
    <div style={atelierStyles.page}>
      <div style={atelierStyles.topbar}>
        <div style={atelierStyles.logo}>
          <span style={atelierStyles.logoMark}>◆</span>
          <span style={atelierStyles.logoText}>MEBELHUB</span>
        </div>
        <nav style={atelierStyles.nav}>
          <span style={atelierStyles.navItem}>Мастера</span>
          <span style={atelierStyles.navItem}>Работы</span>
          <span style={atelierStyles.navItem}>Как это работает</span>
          <span style={atelierStyles.navItem}>Журнал</span>
        </nav>
        <div style={atelierStyles.topActions}>
          <span style={atelierStyles.navItem}>Войти</span>
          <button style={atelierStyles.ctaSmall}>Разместить заказ</button>
        </div>
      </div>

      <div style={atelierStyles.heroGrid}>
        <div style={atelierStyles.heroLeft}>
          <div style={atelierStyles.eyebrow}>
            <span style={atelierStyles.eyebrowDot}>●</span>
            <span>Маркетплейс мебели на заказ · Ташкент</span>
          </div>

          <h1 style={atelierStyles.h1}>
            Мебель,<br/>
            <em style={atelierStyles.em}>созданная</em> для вас<br/>
            <span style={atelierStyles.h1Dim}>руками мастеров.</span>
          </h1>

          <p style={atelierStyles.lede}>
            Опишите вашу идею — и получите предложения от проверенных мебельщиков.
            Не ищите мастера. Мастер найдёт вас.
          </p>

          <div style={atelierStyles.heroCtas}>
            <button style={atelierStyles.ctaPrimary}>
              <span>Разместить заказ</span>
              <span style={atelierStyles.ctaArrow}>→</span>
            </button>
            <button style={atelierStyles.ctaGhost}>Я мастер</button>
          </div>

          <div style={atelierStyles.statsRow}>
            <div style={atelierStyles.stat}>
              <div style={atelierStyles.statNum}>500<span style={atelierStyles.statPlus}>+</span></div>
              <div style={atelierStyles.statLabel}>Заказов<br/>размещено</div>
            </div>
            <div style={atelierStyles.statDivider} />
            <div style={atelierStyles.stat}>
              <div style={atelierStyles.statNum}>120<span style={atelierStyles.statPlus}>+</span></div>
              <div style={atelierStyles.statLabel}>Мастеров<br/>в Ташкенте</div>
            </div>
            <div style={atelierStyles.statDivider} />
            <div style={atelierStyles.stat}>
              <div style={atelierStyles.statNum}>4.8<span style={atelierStyles.statStar}>★</span></div>
              <div style={atelierStyles.statLabel}>Средний<br/>рейтинг</div>
            </div>
          </div>
        </div>

        <div style={atelierStyles.heroRight}>
          <div style={atelierStyles.stage}>
            <svg viewBox="0 0 600 600" style={atelierStyles.svg}>
              <defs>
                <linearGradient id="woodTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#4a3c2e"/>
                  <stop offset="1" stopColor="#2d231a"/>
                </linearGradient>
                <linearGradient id="woodFront" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#3a2f23"/>
                  <stop offset="1" stopColor="#1c1510"/>
                </linearGradient>
                <linearGradient id="woodSide" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#2d241c"/>
                  <stop offset="1" stopColor="#14100a"/>
                </linearGradient>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#F0C878"/>
                  <stop offset="1" stopColor="#A07832"/>
                </linearGradient>
                <radialGradient id="goldGlow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0" stopColor="#E4B668" stopOpacity="0.6"/>
                  <stop offset="1" stopColor="#E4B668" stopOpacity="0"/>
                </radialGradient>
              </defs>

              {/* Ground shadow */}
              {(() => {
                const [sx, sy] = pt(0, 0, 0);
                const [ex, ey] = pt(4, 2, 0);
                const cx = (sx + ex) / 2, cy = (sy + ey) / 2;
                return <ellipse cx={cx} cy={cy+4} rx="110" ry="22" fill="#000" opacity={0.3 * p(1.5, 1)}/>;
              })()}

              {/* Isometric floor grid */}
              <g opacity="0.2" stroke="#3a3a40" strokeWidth="0.5">
                {Array.from({length: 11}).map((_, i) => {
                  const [x1,y1] = pt(i-3, -2, 0);
                  const [x2,y2] = pt(i-3, 5, 0);
                  return <line key={'g1'+i} x1={x1} y1={y1} x2={x2} y2={y2}/>;
                })}
                {Array.from({length: 11}).map((_, i) => {
                  const [x1,y1] = pt(-3, i-2, 0);
                  const [x2,y2] = pt(5, i-2, 0);
                  return <line key={'g2'+i} x1={x1} y1={y1} x2={x2} y2={y2}/>;
                })}
              </g>

              {/* Callout labels fade after stage */}
              <g opacity={Math.max(0, 1 - p(7, 1)) * 0.45} fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#8a7050">
                <text x="440" y="120">h · 2100</text>
                <line x1="420" y1="122" x2="380" y2="140" stroke="#8a7050" strokeWidth="0.4"/>
                <text x="80" y="490">w · 1800</text>
                <line x1="130" y1="485" x2="170" y2="470" stroke="#8a7050" strokeWidth="0.4"/>
                <text x="40" y="180">oak · matte</text>
              </g>

              {/* BOTTOM panel — x:0..4, y:0..2, z:0 (thin) */}
              {(() => {
                const f = fly(1.5);
                return (
                  <g opacity={f.op} transform={`translate(0, ${-f.dz * SY})`}>
                    <polygon points={topFace(0, 0, 0.15, 4, 2)} fill="url(#woodTop)" stroke="#000" strokeWidth="0.3"/>
                    <polygon points={frontFace(0, 4, 0, 0, 0.15)} fill="url(#woodFront)" stroke="#000" strokeWidth="0.3"/>
                    <polygon points={sideFace(4, 0, 2, 0, 0.15)} fill="url(#woodSide)" stroke="#000" strokeWidth="0.3"/>
                  </g>
                );
              })()}

              {/* BACK panel — x:0..4, y:2 (back), z:0.15..5 */}
              {(() => {
                const f = fly(0.0);
                return (
                  <g opacity={f.op} transform={`translate(0, ${-f.dz * SY})`}>
                    <polygon points={pts([[0,2,0.15],[4,2,0.15],[4,2,5],[0,2,5]])} fill="url(#woodSide)" stroke="#000" strokeWidth="0.3"/>
                  </g>
                );
              })()}

              {/* LEFT side — x:0, y:0..2, z:0.15..5 */}
              {(() => {
                const f = fly(0.5);
                return (
                  <g opacity={f.op} transform={`translate(0, ${-f.dz * SY})`}>
                    <polygon points={pts([[0,0,0.15],[0,2,0.15],[0,2,5],[0,0,5]])} fill="url(#woodFront)" stroke="#000" strokeWidth="0.3"/>
                  </g>
                );
              })()}

              {/* RIGHT side — x:4, y:0..2, z:0.15..5 */}
              {(() => {
                const f = fly(1.0);
                return (
                  <g opacity={f.op} transform={`translate(0, ${-f.dz * SY})`}>
                    <polygon points={pts([[4,0,0.15],[4,2,0.15],[4,2,5],[4,0,5]])} fill="url(#woodSide)" stroke="#000" strokeWidth="0.3"/>
                  </g>
                );
              })()}

              {/* MIDDLE shelf — x:0..4, y:0..2, at z:2.5 */}
              {(() => {
                const f = fly(2.0);
                return (
                  <g opacity={f.op * 0.9} transform={`translate(0, ${-f.dz * SY})`}>
                    <polygon points={topFace(0, 0, 2.5, 4, 2)} fill="url(#woodTop)" stroke="#000" strokeWidth="0.3" opacity="0.8"/>
                  </g>
                );
              })()}

              {/* TOP panel — x:0..4, y:0..2, z:5..5.15 */}
              {(() => {
                const f = fly(2.5);
                return (
                  <g opacity={f.op} transform={`translate(0, ${-f.dz * SY})`}>
                    <polygon points={topFace(0, 0, 5.15, 4, 2)} fill="url(#woodTop)" stroke="#000" strokeWidth="0.3"/>
                    <polygon points={frontFace(0, 4, 0, 5, 5.15)} fill="url(#woodFront)" stroke="#000" strokeWidth="0.3"/>
                    <polygon points={sideFace(4, 0, 2, 5, 5.15)} fill="url(#woodSide)" stroke="#000" strokeWidth="0.3"/>
                  </g>
                );
              })()}

              {/* LEFT DOOR — on front face, x:0..2, y:0, z:0.15..5 */}
              {(() => {
                const f = fly(3.0);
                return (
                  <g opacity={f.op} transform={`translate(0, ${-f.dz * SY})`}>
                    <polygon points={pts([[0,0,0.15],[2,0,0.15],[2,0,5],[0,0,5]])} fill="url(#woodFront)" stroke="#000" strokeWidth="0.3"/>
                    {/* subtle vertical grain line */}
                    <line {...(() => { const [x1,y1]=pt(1,0,0.3); const [x2,y2]=pt(1,0,4.8); return {x1,y1,x2,y2}; })()} stroke="#000" strokeWidth="0.3" opacity="0.25"/>
                  </g>
                );
              })()}

              {/* RIGHT DOOR — x:2..4, y:0, z:0.15..5 */}
              {(() => {
                const f = fly(3.5);
                return (
                  <g opacity={f.op} transform={`translate(0, ${-f.dz * SY})`}>
                    <polygon points={pts([[2,0,0.15],[4,0,0.15],[4,0,5],[2,0,5]])} fill="url(#woodFront)" stroke="#000" strokeWidth="0.3"/>
                    <line {...(() => { const [x1,y1]=pt(3,0,0.3); const [x2,y2]=pt(3,0,4.8); return {x1,y1,x2,y2}; })()} stroke="#000" strokeWidth="0.3" opacity="0.25"/>
                  </g>
                );
              })()}

              {/* GOLD HANDLES — vertical bars near door split */}
              {(() => {
                const op = p(4.0, 0.5);
                // left handle at x=1.7, y=0, z=2.2..2.8
                const [h1x, h1y] = pt(1.7, 0, 2.2);
                const [h1x2, h1y2] = pt(1.7, 0, 2.8);
                const [h2x, h2y] = pt(2.3, 0, 2.2);
                const [h2x2, h2y2] = pt(2.3, 0, 2.8);
                return (
                  <g opacity={op}>
                    <line x1={h1x} y1={h1y} x2={h1x2} y2={h1y2} stroke="url(#goldGrad)" strokeWidth="3.5" strokeLinecap="round"/>
                    <line x1={h2x} y1={h2y} x2={h2x2} y2={h2y2} stroke="url(#goldGrad)" strokeWidth="3.5" strokeLinecap="round"/>
                  </g>
                );
              })()}

              {/* GOLD DOWEL GLINTS at corners */}
              {(() => {
                const op = p(4.5, 0.5);
                const corners = [
                  [0, 0, 5], [4, 0, 5], [4, 2, 5], [0, 2, 5],
                  [0, 0, 0.15], [4, 0, 0.15],
                ];
                return (
                  <g opacity={op}>
                    {corners.map(([x,y,z], i) => {
                      const [px, py] = pt(x, y, z);
                      return (
                        <g key={i}>
                          <circle cx={px} cy={py} r="8" fill="url(#goldGlow)"/>
                          <circle cx={px} cy={py} r="1.8" fill="#F0C878"/>
                        </g>
                      );
                    })}
                  </g>
                );
              })()}

              {/* Final signature flourish — subtle gold inlay line across top */}
              {(() => {
                const op = p(5.5, 0.8) * (1 - p(8.5, 0.5));
                const [x1, y1] = pt(0.2, 0, 4.95);
                const [x2, y2] = pt(3.8, 0, 4.95);
                return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#goldGrad)" strokeWidth="0.6" opacity={op * 0.7}/>;
              })()}
            </svg>

            <div style={atelierStyles.ticker}>
              <div style={atelierStyles.tickerDot}></div>
              <span>Мастер Улугбек · сборка комода · 3 мин назад</span>
            </div>
            <div style={atelierStyles.caption}>
              <div style={atelierStyles.captionLabel}>В процессе</div>
              <div style={atelierStyles.captionTitle}>Комод «Бухара» · дуб · латунная фурнитура</div>
            </div>
          </div>
        </div>
      </div>

      <div style={atelierStyles.catStrip}>
        <div style={atelierStyles.catLabel}>Что можно заказать</div>
        <div style={atelierStyles.catList}>
          {['Диваны','Кровати','Шкафы','Стулья','Столы','Стеллажи','Тумбы','Гардеробные','Кухни'].map(c => (
            <span key={c} style={atelierStyles.catItem}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const atelierStyles = {
  page: {
    width: '100%', height: '100%', background: '#0A0D12', color: '#E8E6E1',
    fontFamily: '"Inter Tight", -apple-system, sans-serif', display: 'flex', flexDirection: 'column',
    overflow: 'hidden', position: 'relative',
  },
  topbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 40px', borderBottom: '1px solid rgba(232,230,225,0.08)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoMark: { color: '#E4B668', fontSize: 14 },
  logoText: { fontSize: 13, letterSpacing: '0.18em', fontWeight: 500 },
  nav: { display: 'flex', gap: 28 },
  navItem: { fontSize: 13, color: 'rgba(232,230,225,0.7)', cursor: 'pointer' },
  topActions: { display: 'flex', alignItems: 'center', gap: 20 },
  ctaSmall: {
    background: '#E4B668', color: '#0A0D12', border: 'none', padding: '10px 18px',
    fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', cursor: 'pointer', borderRadius: 2,
  },

  heroGrid: {
    flex: 1, display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40,
    padding: '60px 40px 40px', alignItems: 'center',
  },
  heroLeft: { display: 'flex', flexDirection: 'column', gap: 28 },
  eyebrow: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: 'rgba(232,230,225,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase' },
  eyebrowDot: { color: '#E4B668', fontSize: 8 },
  h1: {
    fontFamily: '"Fraunces", Georgia, serif',
    fontSize: 82, lineHeight: 0.95, fontWeight: 300, letterSpacing: '-0.03em',
    margin: 0,
  },
  em: { fontStyle: 'italic', color: '#E4B668', fontWeight: 300 },
  h1Dim: { color: 'rgba(232,230,225,0.45)' },
  lede: {
    fontSize: 16, lineHeight: 1.55, color: 'rgba(232,230,225,0.7)',
    maxWidth: 460, margin: 0,
  },
  heroCtas: { display: 'flex', gap: 14, alignItems: 'center' },
  ctaPrimary: {
    background: '#E4B668', color: '#0A0D12', border: 'none', padding: '16px 24px',
    fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 14, borderRadius: 2,
  },
  ctaArrow: { fontSize: 16 },
  ctaGhost: {
    background: 'transparent', color: '#E8E6E1', border: '1px solid rgba(232,230,225,0.2)',
    padding: '16px 24px', fontSize: 13, fontWeight: 500, letterSpacing: '0.06em',
    cursor: 'pointer', borderRadius: 2,
  },

  statsRow: { display: 'flex', alignItems: 'center', gap: 24, marginTop: 16 },
  stat: { display: 'flex', flexDirection: 'column', gap: 4 },
  statNum: { fontFamily: '"Fraunces", serif', fontSize: 34, fontWeight: 300, letterSpacing: '-0.02em' },
  statPlus: { color: '#E4B668', fontSize: 20, marginLeft: 2 },
  statStar: { color: '#E4B668', fontSize: 20, marginLeft: 4 },
  statLabel: { fontSize: 11, color: 'rgba(232,230,225,0.5)', lineHeight: 1.3, textTransform: 'uppercase', letterSpacing: '0.08em' },
  statDivider: { width: 1, height: 32, background: 'rgba(232,230,225,0.12)' },

  heroRight: { position: 'relative', height: '100%', minHeight: 500 },
  stage: {
    position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, #15181F 0%, #0A0D12 70%)',
    border: '1px solid rgba(232,230,225,0.06)', overflow: 'hidden',
  },
  svg: { width: '100%', height: '100%' },
  ticker: {
    position: 'absolute', top: 20, left: 20, display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 14px', background: 'rgba(10,13,18,0.7)', border: '1px solid rgba(232,230,225,0.1)',
    fontSize: 11, color: 'rgba(232,230,225,0.8)', letterSpacing: '0.05em',
    backdropFilter: 'blur(8px)',
  },
  tickerDot: { width: 6, height: 6, borderRadius: '50%', background: '#7AC07A', animation: 'pulse 2s infinite' },
  caption: {
    position: 'absolute', bottom: 24, left: 24, right: 24,
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  captionLabel: { fontSize: 10, color: '#E4B668', letterSpacing: '0.14em', textTransform: 'uppercase' },
  captionTitle: { fontFamily: '"Fraunces", serif', fontSize: 20, fontWeight: 300, fontStyle: 'italic' },

  catStrip: {
    display: 'flex', alignItems: 'center', gap: 40, padding: '22px 40px',
    borderTop: '1px solid rgba(232,230,225,0.08)',
  },
  catLabel: { fontSize: 10, color: 'rgba(232,230,225,0.4)', letterSpacing: '0.16em', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  catList: { display: 'flex', gap: 28, flexWrap: 'wrap' },
  catItem: { fontSize: 13, color: 'rgba(232,230,225,0.7)', cursor: 'pointer' },
};

window.AtelierHero = AtelierHero;
