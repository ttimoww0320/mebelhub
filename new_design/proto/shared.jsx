// Shared UI: theme, Nav, Footer, WorkThumb (placeholder imagery), icons

const mhTheme = {
  bg: '#0A0D12',
  bgElev: '#11151C',
  bgSubtle: '#161B23',
  border: 'rgba(232,230,225,0.08)',
  borderStrong: 'rgba(232,230,225,0.18)',
  text: '#E8E6E1',
  textDim: 'rgba(232,230,225,0.65)',
  textMute: 'rgba(232,230,225,0.4)',
  gold: '#E4B668',
  goldDark: '#A07832',
  goldBg: 'rgba(228,182,104,0.1)',
  success: '#7AC07A',
  danger: '#D47A68',
};

// Placeholder artwork: stripe-based abstract "furniture photo"
// Generates a unique-ish image using seeded values → deterministic per id
const mhHash = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const WorkThumb = ({ work, size = 'md', style = {} }) => {
  // Delegate to the rich illustration component when available
  if (window.WorkIllustration) {
    return (
      <div style={{ width: '100%', aspectRatio: size === 'sm' ? '1/1' : '4/5', overflow: 'hidden', ...style }}>
        <window.WorkIllustration work={work}/>
      </div>
    );
  }
  // Fallback solid
  return <div style={{ width: '100%', aspectRatio: size === 'sm' ? '1/1' : '4/5', background: work.palette[1], ...style }}/>;
};

// Top navigation — shared across all pages
const MHNav = ({ current, onNav, onOrder }) => {
  const items = [
    { id: 'home', label: 'Главная' },
    { id: 'masters', label: 'Мастера' },
    { id: 'works', label: 'Работы' },
    { id: 'order', label: 'Разместить заказ' },
    { id: 'dashboard', label: 'Кабинет' },
  ];
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 40px', borderBottom: `1px solid ${mhTheme.border}`,
      background: mhTheme.bg, position: 'sticky', top: 0, zIndex: 20,
    }}>
      <div onClick={() => onNav('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <span style={{ color: mhTheme.gold, fontSize: 14 }}>◆</span>
        <span style={{ fontSize: 13, letterSpacing: '0.18em', fontWeight: 500 }}>MEBELHUB</span>
      </div>
      <nav style={{ display: 'flex', gap: 28 }}>
        {items.map(it => (
          <span
            key={it.id}
            onClick={() => onNav(it.id)}
            style={{
              fontSize: 13, cursor: 'pointer',
              color: current === it.id ? mhTheme.text : mhTheme.textDim,
              position: 'relative', padding: '4px 0',
              borderBottom: current === it.id ? `1px solid ${mhTheme.gold}` : '1px solid transparent',
            }}
          >{it.label}</span>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{ fontSize: 13, color: mhTheme.textDim, cursor: 'pointer' }}>Войти</span>
        <button
          onClick={onOrder}
          style={{
            background: mhTheme.gold, color: mhTheme.bg, border: 'none',
            padding: '10px 18px', fontSize: 12, fontWeight: 600,
            letterSpacing: '0.04em', cursor: 'pointer', borderRadius: 2,
          }}
        >Разместить заказ</button>
      </div>
    </header>
  );
};

const MHFooter = () => (
  <footer style={{
    padding: '60px 40px 40px', borderTop: `1px solid ${mhTheme.border}`,
    background: mhTheme.bg, color: mhTheme.textDim, fontSize: 12,
    display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 40,
  }}>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ color: mhTheme.gold, fontSize: 14 }}>◆</span>
        <span style={{ fontSize: 13, letterSpacing: '0.18em', fontWeight: 500, color: mhTheme.text }}>MEBELHUB</span>
      </div>
      <div style={{ lineHeight: 1.6, maxWidth: 340 }}>
        Маркетплейс мебели на заказ. Соединяем заказчиков с проверенными мастерами Ташкента.
      </div>
      <div style={{ marginTop: 24, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.08em', color: mhTheme.textMute }}>
        EST. 2024 · ТАШКЕНТ · УЗБЕКИСТАН
      </div>
    </div>
    <div>
      <div style={{ fontSize: 10, color: mhTheme.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>Платформа</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span>Как это работает</span><span>Для заказчиков</span><span>Для мастеров</span><span>Гарантии и оплата</span>
      </div>
    </div>
    <div>
      <div style={{ fontSize: 10, color: mhTheme.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>Ресурсы</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span>Журнал</span><span>Работы</span><span>Справочник материалов</span><span>Частые вопросы</span>
      </div>
    </div>
    <div>
      <div style={{ fontSize: 10, color: mhTheme.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>Контакты</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span>hello@mebelhub.uz</span><span>+998 71 200 00 00</span><span>Telegram: @mebelhub</span>
      </div>
    </div>
  </footer>
);

Object.assign(window, { mhTheme, WorkThumb, MHNav, MHFooter, mhHash });
