// Masters catalog + single master page

const MastersPage = ({ onNav }) => {
  const [search, setSearch] = React.useState('');
  const [filterCat, setFilterCat] = React.useState(null);
  const [filterDist, setFilterDist] = React.useState(null);
  const [sort, setSort] = React.useState('rating');

  const filtered = MH_MASTERS.filter(m => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.shop.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterDist && m.district !== filterDist) return false;
    return true;
  }).sort((a,b) => {
    if (sort === 'rating') return b.rating - a.rating;
    if (sort === 'price') return a.priceFrom - b.priceFrom;
    if (sort === 'reviews') return b.reviews - a.reviews;
    return 0;
  });

  return (
    <div style={{ background: mhTheme.bg, color: mhTheme.text, minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{ padding: '60px 40px 40px', borderBottom: `1px solid ${mhTheme.border}` }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.14em', marginBottom: 16 }}>§ МАСТЕРА / 120</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 40 }}>
          <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: 76, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 0.95, margin: 0 }}>
            Мебельщики<br/><em style={{ color: mhTheme.gold }}>Ташкента</em>
          </h1>
          <div style={{ fontSize: 15, color: mhTheme.textDim, maxWidth: 440, lineHeight: 1.55 }}>
            Все мастера проходят проверку: документы, мастерская, минимум 5 выполненных работ с отзывами.
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ padding: '24px 40px', borderBottom: `1px solid ${mhTheme.border}`, display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 16, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: mhTheme.bgElev, border: `1px solid ${mhTheme.border}` }}>
          <span style={{ color: mhTheme.textMute, fontSize: 14 }}>⌕</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по имени или мастерской…"
            style={{ background: 'transparent', border: 'none', color: mhTheme.text, fontSize: 14, outline: 'none', width: '100%', fontFamily: 'inherit' }}
          />
        </div>
        <select value={filterDist || ''} onChange={e => setFilterDist(e.target.value || null)} style={{ background: mhTheme.bgElev, border: `1px solid ${mhTheme.border}`, color: mhTheme.text, padding: '12px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          <option value="">Все районы</option>
          {MH_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: mhTheme.bgElev, border: `1px solid ${mhTheme.border}`, color: mhTheme.text, padding: '12px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          <option value="rating">Сортировка: рейтинг</option>
          <option value="reviews">Больше отзывов</option>
          <option value="price">Ниже цена</option>
        </select>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.textMute, letterSpacing: '0.08em' }}>{filtered.length} / {MH_MASTERS.length}</div>
      </div>

      {/* Master cards */}
      <div style={{ padding: '40px 40px 80px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, background: mhTheme.border }}>
        {filtered.map(m => {
          const works = MH_WORKS.filter(w => w.master === m.id);
          return (
            <div key={m.id} onClick={() => onNav('master:'+m.id)} style={{ background: mhTheme.bg, padding: 32, cursor: 'pointer', display: 'grid', gridTemplateColumns: '140px 1fr', gap: 24, transition: 'background 0.15s' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ aspectRatio: '1/1', background: m.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Fraunces", serif', fontSize: 42, color: mhTheme.gold, fontStyle: 'italic', border: `1px solid ${mhTheme.borderStrong}` }}>
                  {m.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: mhTheme.textMute, textAlign: 'center', letterSpacing: '0.08em' }}>
                  CRAFT · {String(MH_MASTERS.indexOf(m) + 1).padStart(3, '0')}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: '"Fraunces", serif', fontSize: 26, fontWeight: 400, letterSpacing: '-0.01em' }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: mhTheme.gold, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>{m.shop}</div>
                </div>
                <div style={{ fontSize: 13, color: mhTheme.textDim, lineHeight: 1.5 }}>{m.bio.slice(0, 120)}…</div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  {m.speciality.map(s => (
                    <span key={s} style={{ fontSize: 11, color: mhTheme.text, border: `1px solid ${mhTheme.border}`, padding: '4px 10px' }}>{s}</span>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 8, paddingTop: 16, borderTop: `1px dashed ${mhTheme.border}` }}>
                  <div>
                    <div style={{ fontFamily: '"Fraunces", serif', fontSize: 20, fontWeight: 400 }}><span style={{ color: mhTheme.gold }}>★</span> {m.rating}</div>
                    <div style={{ fontSize: 10, color: mhTheme.textMute, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{m.reviews} отзывов</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: '"Fraunces", serif', fontSize: 20, fontWeight: 400 }}>{m.worksCount}</div>
                    <div style={{ fontSize: 10, color: mhTheme.textMute, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>работ</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: '"Fraunces", serif', fontSize: 20, fontWeight: 400 }}>от <span style={{ color: mhTheme.gold }}>${m.priceFrom}</span></div>
                    <div style={{ fontSize: 10, color: mhTheme.textMute, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>средний чек</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: '"Fraunces", serif', fontSize: 20, fontWeight: 400 }}>{m.avgDays}д</div>
                    <div style={{ fontSize: 10, color: mhTheme.textMute, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>срок</div>
                  </div>
                </div>
                {works.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 8 }}>
                    {works.slice(0, 3).map(w => <div key={w.id} style={{ aspectRatio: '1/1' }}><WorkThumb work={w} size="sm"/></div>)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Single master page
const MasterPage = ({ masterId, onNav }) => {
  const m = MH_MASTERS.find(x => x.id === masterId);
  const works = MH_WORKS.filter(w => w.master === masterId);
  const [tab, setTab] = React.useState('works');

  if (!m) return <div style={{ padding: 40, color: mhTheme.text }}>Мастер не найден</div>;

  return (
    <div style={{ background: mhTheme.bg, color: mhTheme.text }}>
      {/* Breadcrumb */}
      <div style={{ padding: '20px 40px', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.textMute, letterSpacing: '0.1em' }}>
        <span onClick={() => onNav('masters')} style={{ cursor: 'pointer' }}>МАСТЕРА</span> / <span style={{ color: mhTheme.gold }}>{m.name.toUpperCase()}</span>
      </div>

      {/* Hero */}
      <div style={{ padding: '40px 40px 60px', borderBottom: `1px solid ${mhTheme.border}`, display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 60 }}>
        <div>
          <div style={{ aspectRatio: '3/4', background: m.accent, border: `1px solid ${mhTheme.borderStrong}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ fontFamily: '"Fraunces", serif', fontSize: 96, color: mhTheme.gold, fontStyle: 'italic', fontWeight: 300 }}>
              {m.name.split(' ').map(w => w[0]).join('')}
            </div>
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: mhTheme.textMute, letterSpacing: '0.1em', display: 'flex', justifyContent: 'space-between' }}>
              <span>PORTRAIT · 01</span>
              <span>{m.shop.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div style={{ fontSize: 13, color: mhTheme.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>{m.shop}</div>
            <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: 72, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 0.95, margin: 0 }}>
              {m.name}
            </h1>
            <div style={{ display: 'flex', gap: 20, marginTop: 20, fontSize: 14, color: mhTheme.textDim }}>
              <span><span style={{ color: mhTheme.gold }}>★ {m.rating}</span> · {m.reviews} отзывов</span>
              <span>·</span><span>{m.district} район</span>
              <span>·</span><span>С {m.since}</span>
            </div>
          </div>
          <p style={{ fontSize: 17, color: mhTheme.text, lineHeight: 1.6, margin: 0, maxWidth: 600 }}>{m.bio}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto) 1fr', gap: '12px 20px', padding: '24px 0', borderTop: `1px solid ${mhTheme.border}`, borderBottom: `1px solid ${mhTheme.border}`, marginTop: 8 }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.textMute, letterSpacing: '0.1em' }}>СТИЛЬ</span>
            <span style={{ fontSize: 14, gridColumn: '2/4' }}>{m.style}</span>

            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.textMute, letterSpacing: '0.1em' }}>МАТЕРИАЛЫ</span>
            <span style={{ fontSize: 14, gridColumn: '2/4' }}>{m.materials.join(' · ')}</span>

            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.textMute, letterSpacing: '0.1em' }}>СПЕЦИАЛИЗАЦИЯ</span>
            <span style={{ fontSize: 14, gridColumn: '2/4' }}>{m.speciality.join(' · ')}</span>

            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.textMute, letterSpacing: '0.1em' }}>ЧЕК</span>
            <span style={{ fontSize: 14, gridColumn: '2/4' }}>от ${m.priceFrom} · срок {m.avgDays} дн.</span>
          </div>

          <div style={{ display: 'flex', gap: 14 }}>
            <button onClick={() => onNav('chat:'+m.id)} style={{ background: mhTheme.gold, color: mhTheme.bg, border: 'none', padding: '16px 24px', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 14 }}>
              Написать мастеру <span>→</span>
            </button>
            <button onClick={() => onNav('order')} style={{ background: 'transparent', color: mhTheme.text, border: `1px solid ${mhTheme.borderStrong}`, padding: '16px 24px', fontSize: 13, fontWeight: 500, letterSpacing: '0.06em', cursor: 'pointer', borderRadius: 2 }}>
              Заказать проект
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '0 40px', borderBottom: `1px solid ${mhTheme.border}`, gap: 40 }}>
        {[['works','Работы ('+works.length+')'],['reviews','Отзывы ('+m.reviews+')'],['process','Процесс']].map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            background: 'transparent', border: 'none', color: tab === id ? mhTheme.text : mhTheme.textMute,
            padding: '20px 0', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
            borderBottom: tab === id ? `1px solid ${mhTheme.gold}` : '1px solid transparent', fontFamily: 'inherit',
          }}>{lbl}</button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'works' && (
        <div style={{ padding: '40px 40px 80px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {works.map(w => (
            <div key={w.id} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <WorkThumb work={w}/>
              <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22, fontStyle: 'italic' }}>{w.title}</div>
              <div style={{ fontSize: 12, color: mhTheme.textMute }}>{w.material} · {w.year}</div>
            </div>
          ))}
          {works.length === 0 && <div style={{ color: mhTheme.textMute }}>Работы скоро появятся.</div>}
        </div>
      )}
      {tab === 'reviews' && (
        <div style={{ padding: '40px 40px 80px', maxWidth: 900 }}>
          {[
            { name: 'Азиза Р.', rating: 5, date: '3 нед назад', text: 'Сделали кухонный гарнитур точно в срок, качество — отличное. Мастер присылал фото на каждом этапе, отвечал на все вопросы. Рекомендую.' },
            { name: 'Тимур К.', rating: 5, date: '1 мес назад', text: 'Заказывал комод в спальню. Работа ювелирная, латунная фурнитура — огонь. Стоило дороже обычных магазинов, но качество несравнимо.' },
            { name: 'Мадина С.', rating: 4, date: '2 мес назад', text: 'Шкаф-купе получился красивый, но сдвинули сроки на неделю. В остальном — всё отлично, мастер человек слова.' },
          ].map((r, i) => (
            <div key={i} style={{ padding: '28px 0', borderBottom: `1px solid ${mhTheme.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 500 }}>{r.name}</div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.textMute, letterSpacing: '0.08em' }}>{r.date}</div>
              </div>
              <div style={{ color: mhTheme.gold, marginBottom: 10, fontSize: 14 }}>{'★'.repeat(r.rating)}<span style={{ color: mhTheme.textMute }}>{'★'.repeat(5-r.rating)}</span></div>
              <div style={{ fontSize: 15, color: mhTheme.textDim, lineHeight: 1.6 }}>{r.text}</div>
            </div>
          ))}
        </div>
      )}
      {tab === 'process' && (
        <div style={{ padding: '40px 40px 80px', maxWidth: 900 }}>
          {[
            ['Встреча и обмер', 'Приезжаю к вам домой или в офис с рулеткой и блокнотом. Делаю замеры, обсуждаем стиль, показываю образцы дерева и фурнитуры.'],
            ['3D-эскиз', 'Через 3-5 дней присылаю детальный 3D-проект с размерами и сметой. Вносим правки до полного согласования.'],
            ['Предоплата и закупка', 'После подписания договора вы вносите 30%. Я закупаю материалы и фурнитуру у проверенных поставщиков.'],
            ['Производство', 'Работа в мастерской занимает 20-35 дней. Присылаю фото на ключевых этапах — сборка каркасов, покраска, сборка.'],
            ['Установка', 'Доставка и монтаж у вас. После установки вы проверяете работу, подписываем акт приёма, вносите финальную оплату.'],
          ].map(([t, d], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 24, padding: '24px 0', borderTop: i === 0 ? `1px solid ${mhTheme.border}` : 'none', borderBottom: `1px solid ${mhTheme.border}` }}>
              <div style={{ fontFamily: '"Fraunces", serif', fontSize: 36, fontStyle: 'italic', color: mhTheme.gold, fontWeight: 300, lineHeight: 1 }}>0{i+1}</div>
              <div>
                <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 400, marginBottom: 8 }}>{t}</div>
                <div style={{ fontSize: 14, color: mhTheme.textDim, lineHeight: 1.6 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

window.MastersPage = MastersPage;
window.MasterPage = MasterPage;
