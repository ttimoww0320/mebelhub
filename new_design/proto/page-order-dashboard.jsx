// Order page (TZ form) + Dashboard + Chat + Works page

const OrderPage = ({ onNav }) => {
  const [step, setStep] = React.useState(1);
  const [cat, setCat] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [dims, setDims] = React.useState({ w: '', h: '', d: '' });
  const [material, setMaterial] = React.useState(null);
  const [style, setStyle] = React.useState(null);
  const [budget, setBudget] = React.useState(2000);
  const [deadline, setDeadline] = React.useState(30);
  const [district, setDistrict] = React.useState(null);
  const [desc, setDesc] = React.useState('');

  const steps = ['Категория','Параметры','Бюджет и срок','Описание','Готово'];
  const canNext = () => {
    if (step === 1) return !!cat;
    if (step === 2) return material && style;
    if (step === 3) return !!district;
    return true;
  };

  return (
    <div style={{ background: mhTheme.bg, color: mhTheme.text, minHeight: '100vh' }}>
      <div style={{ padding: '40px 40px 0' }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.14em', marginBottom: 10 }}>§ РАЗМЕЩЕНИЕ ЗАКАЗА · DOC-001</div>
        <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: 60, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
          Опишите <em style={{ color: mhTheme.gold }}>вашу мебель</em>
        </h1>
      </div>

      {/* Stepper */}
      <div style={{ padding: '40px 40px 0', display: 'flex', gap: 0 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ flex: 1, padding: '14px 16px', borderTop: `2px solid ${step > i ? mhTheme.gold : step === i+1 ? mhTheme.gold : mhTheme.border}`, opacity: step >= i+1 ? 1 : 0.5 }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: step >= i+1 ? mhTheme.gold : mhTheme.textMute, letterSpacing: '0.1em', marginBottom: 4 }}>0{i+1}</div>
            <div style={{ fontSize: 13, fontWeight: step === i+1 ? 600 : 400 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '60px 40px 40px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 60, alignItems: 'start' }}>
        <div>
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 36, fontWeight: 300, margin: '0 0 8px' }}>Что хотите заказать?</h2>
              <p style={{ color: mhTheme.textDim, margin: '0 0 32px', fontSize: 15 }}>Выберите категорию — мы покажем только подходящих мастеров.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {MH_CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => setCat(c.id)} style={{
                    background: cat === c.id ? mhTheme.goldBg : mhTheme.bgElev,
                    border: `1px solid ${cat === c.id ? mhTheme.gold : mhTheme.border}`,
                    padding: '24px 18px', textAlign: 'left', cursor: 'pointer', color: mhTheme.text, fontFamily: 'inherit',
                  }}>
                    <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22, fontWeight: 400, marginBottom: 4 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: mhTheme.textMute, letterSpacing: '0.08em' }}>{c.count} активных заказов</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 36, fontWeight: 300, margin: 0 }}>Параметры изделия</h2>
              <div>
                <label style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.12em', display: 'block', marginBottom: 10 }}>НАЗВАНИЕ ПРОЕКТА</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Например: Кухонный гарнитур U-образный"
                  style={{ width: '100%', background: mhTheme.bgElev, border: `1px solid ${mhTheme.border}`, color: mhTheme.text, padding: '16px 18px', fontSize: 15, outline: 'none', fontFamily: 'inherit' }}/>
              </div>
              <div>
                <label style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.12em', display: 'block', marginBottom: 10 }}>РАЗМЕРЫ · ММ</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {[['w','ширина'],['h','высота'],['d','глубина']].map(([k, lbl]) => (
                    <div key={k} style={{ position: 'relative' }}>
                      <input value={dims[k]} onChange={e => setDims({...dims, [k]: e.target.value})} placeholder="0"
                        style={{ width: '100%', background: mhTheme.bgElev, border: `1px solid ${mhTheme.border}`, color: mhTheme.text, padding: '16px 18px', fontSize: 15, outline: 'none', fontFamily: 'inherit', paddingRight: 80 }}/>
                      <span style={{ position: 'absolute', right: 18, top: 16, fontSize: 11, color: mhTheme.textMute, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{lbl}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.12em', display: 'block', marginBottom: 10 }}>МАТЕРИАЛ</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {MH_MATERIALS.map(m => (
                    <button key={m} onClick={() => setMaterial(m)} style={{
                      background: material === m ? mhTheme.gold : 'transparent',
                      color: material === m ? mhTheme.bg : mhTheme.text,
                      border: `1px solid ${material === m ? mhTheme.gold : mhTheme.border}`,
                      padding: '10px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                    }}>{m}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.12em', display: 'block', marginBottom: 10 }}>СТИЛЬ</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {MH_STYLES.map(s => (
                    <button key={s} onClick={() => setStyle(s)} style={{
                      background: style === s ? mhTheme.gold : 'transparent',
                      color: style === s ? mhTheme.bg : mhTheme.text,
                      border: `1px solid ${style === s ? mhTheme.gold : mhTheme.border}`,
                      padding: '10px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
              <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 36, fontWeight: 300, margin: 0 }}>Бюджет и сроки</h2>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <label style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.12em' }}>БЮДЖЕТ · USD</label>
                  <span style={{ fontFamily: '"Fraunces", serif', fontSize: 28, color: mhTheme.gold }}>
                    ${budget.toLocaleString()} — ${(budget * 1.4 | 0).toLocaleString()}
                  </span>
                </div>
                <input type="range" min="200" max="10000" step="100" value={budget} onChange={e => setBudget(+e.target.value)}
                  style={{ width: '100%', accentColor: mhTheme.gold }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: mhTheme.textMute, marginTop: 6, fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.08em' }}>
                  <span>$200</span><span>$10,000+</span>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <label style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.12em' }}>ЖЕЛАЕМЫЙ СРОК · ДНИ</label>
                  <span style={{ fontFamily: '"Fraunces", serif', fontSize: 28, color: mhTheme.gold }}>{deadline} дней</span>
                </div>
                <input type="range" min="7" max="90" step="1" value={deadline} onChange={e => setDeadline(+e.target.value)}
                  style={{ width: '100%', accentColor: mhTheme.gold }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: mhTheme.textMute, marginTop: 6, fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.08em' }}>
                  <span>1 нед</span><span>3 мес</span>
                </div>
              </div>
              <div>
                <label style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.12em', display: 'block', marginBottom: 10 }}>РАЙОН ДЛЯ ДОСТАВКИ</label>
                <select value={district || ''} onChange={e => setDistrict(e.target.value || null)} style={{ width: '100%', background: mhTheme.bgElev, border: `1px solid ${mhTheme.border}`, color: mhTheme.text, padding: '16px 18px', fontSize: 15, outline: 'none', fontFamily: 'inherit' }}>
                  <option value="">Выберите район</option>
                  {MH_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 36, fontWeight: 300, margin: 0 }}>Расскажите подробности</h2>
              <p style={{ color: mhTheme.textDim, margin: 0 }}>Чем детальнее опишете — тем точнее будут офферы.</p>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={8}
                placeholder="Особенности, пожелания по фурнитуре, референсы, сложные решения, условия монтажа…"
                style={{ width: '100%', background: mhTheme.bgElev, border: `1px solid ${mhTheme.border}`, color: mhTheme.text, padding: 18, fontSize: 15, outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.55 }}/>
              <div style={{ border: `1px dashed ${mhTheme.borderStrong}`, padding: 24, textAlign: 'center', color: mhTheme.textDim, cursor: 'pointer' }}>
                <div style={{ fontSize: 32, color: mhTheme.gold, marginBottom: 6 }}>+</div>
                <div style={{ fontSize: 13 }}>Добавьте фото для референса</div>
                <div style={{ fontSize: 11, color: mhTheme.textMute, marginTop: 4 }}>JPG, PNG · до 10 МБ</div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 64, color: mhTheme.gold, marginBottom: 20 }}>✓</div>
              <h2 style={{ fontFamily: '"Fraunces", serif', fontSize: 48, fontWeight: 300, margin: '0 0 16px' }}>
                Заказ <em style={{ color: mhTheme.gold }}>опубликован</em>
              </h2>
              <p style={{ color: mhTheme.textDim, maxWidth: 520, margin: '0 auto 32px', fontSize: 16, lineHeight: 1.55 }}>
                Мастера уже видят ваше ТЗ. Первые предложения обычно приходят в течение часа. Мы уведомим вас в Telegram.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                <button onClick={() => onNav('dashboard')} style={{ background: mhTheme.gold, color: mhTheme.bg, border: 'none', padding: '16px 24px', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer', borderRadius: 2 }}>Перейти в кабинет →</button>
                <button onClick={() => onNav('home')} style={{ background: 'transparent', color: mhTheme.text, border: `1px solid ${mhTheme.borderStrong}`, padding: '16px 24px', fontSize: 13, fontWeight: 500, letterSpacing: '0.06em', cursor: 'pointer', borderRadius: 2 }}>На главную</button>
              </div>
            </div>
          )}

          {step < 5 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, paddingTop: 24, borderTop: `1px solid ${mhTheme.border}` }}>
              <button onClick={() => setStep(Math.max(1, step-1))} disabled={step === 1} style={{ background: 'transparent', color: step === 1 ? mhTheme.textMute : mhTheme.text, border: `1px solid ${mhTheme.border}`, padding: '14px 22px', fontSize: 13, cursor: step === 1 ? 'default' : 'pointer', borderRadius: 2, fontFamily: 'inherit' }}>← Назад</button>
              <button onClick={() => canNext() && setStep(step+1)} disabled={!canNext()} style={{ background: canNext() ? mhTheme.gold : mhTheme.bgElev, color: canNext() ? mhTheme.bg : mhTheme.textMute, border: 'none', padding: '14px 26px', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', cursor: canNext() ? 'pointer' : 'default', borderRadius: 2, fontFamily: 'inherit' }}>
                {step === 4 ? 'Опубликовать →' : 'Далее →'}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar summary */}
        <aside style={{ background: mhTheme.bgElev, padding: 28, border: `1px solid ${mhTheme.border}`, position: 'sticky', top: 100 }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: mhTheme.gold, letterSpacing: '0.14em', marginBottom: 20 }}>ВАШ ЗАКАЗ · ПРЕДПРОСМОТР</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px 14px', fontSize: 13 }}>
            <span style={{ color: mhTheme.textMute, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.1em' }}>КАТЕГОРИЯ</span>
            <span>{cat ? MH_CATEGORIES.find(c => c.id === cat).name : '—'}</span>
            <span style={{ color: mhTheme.textMute, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.1em' }}>МАТЕРИАЛ</span>
            <span>{material || '—'}</span>
            <span style={{ color: mhTheme.textMute, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.1em' }}>СТИЛЬ</span>
            <span>{style || '—'}</span>
            <span style={{ color: mhTheme.textMute, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.1em' }}>РАЗМЕРЫ</span>
            <span>{dims.w || dims.h || dims.d ? `${dims.w||'?'}×${dims.h||'?'}×${dims.d||'?'} мм` : '—'}</span>
            <span style={{ color: mhTheme.textMute, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.1em' }}>БЮДЖЕТ</span>
            <span style={{ color: mhTheme.gold }}>${budget.toLocaleString()}—${(budget * 1.4 | 0).toLocaleString()}</span>
            <span style={{ color: mhTheme.textMute, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.1em' }}>СРОК</span>
            <span>{deadline} дней</span>
            <span style={{ color: mhTheme.textMute, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.1em' }}>РАЙОН</span>
            <span>{district || '—'}</span>
          </div>
          <div style={{ marginTop: 24, padding: '18px 0', borderTop: `1px solid ${mhTheme.border}`, fontSize: 11, color: mhTheme.textMute, letterSpacing: '0.08em' }}>
            Размещение бесплатно. Оплата — только за выбранный проект.
          </div>
        </aside>
      </div>
    </div>
  );
};

// Dashboard
const DashboardPage = ({ onNav }) => {
  return (
    <div style={{ background: mhTheme.bg, color: mhTheme.text, minHeight: '100vh' }}>
      <div style={{ padding: '40px 40px', borderBottom: `1px solid ${mhTheme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.14em', marginBottom: 10 }}>§ ЛИЧНЫЙ КАБИНЕТ</div>
          <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: 60, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
            Добро пожаловать,<br/><em style={{ color: mhTheme.gold }}>Азиза</em>
          </h1>
        </div>
        <button onClick={() => onNav('order')} style={{ background: mhTheme.gold, color: mhTheme.bg, border: 'none', padding: '14px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}>+ Новый заказ</button>
      </div>

      {/* Stats row */}
      <div style={{ padding: '40px 40px 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, background: mhTheme.border }}>
        {[['2','активных','заказа'],['8','офферов','получено'],['1','в работе','комод'],['4.9','★','рейтинг']].map(([n, l1, l2], i) => (
          <div key={i} style={{ background: mhTheme.bg, padding: 28 }}>
            <div style={{ fontFamily: '"Fraunces", serif', fontSize: 52, fontWeight: 300, letterSpacing: '-0.02em', color: mhTheme.gold }}>{n}</div>
            <div style={{ fontSize: 12, color: mhTheme.textDim, marginTop: 6 }}>{l1}</div>
            <div style={{ fontSize: 11, color: mhTheme.textMute, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{l2}</div>
          </div>
        ))}
      </div>

      {/* Active orders */}
      <div style={{ padding: '40px' }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.14em', marginBottom: 20 }}>§ ВАШИ ЗАКАЗЫ</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { title: 'Кухонный гарнитур · U-образный', status: 'В работе', progress: 65, master: 'Улугбек Арипов', offers: 3, price: '$2,850', daysLeft: 18 },
            { title: 'Обеденный стол · орех', status: 'Сбор офферов', progress: 0, master: null, offers: 5, price: '$900—1,400', daysLeft: null },
          ].map((o, i) => (
            <div key={i} onClick={() => onNav('chat:m01')} style={{ padding: '28px 0', borderTop: `1px solid ${mhTheme.border}`, borderBottom: i === 1 ? `1px solid ${mhTheme.border}` : 'none', cursor: 'pointer', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 24, alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: '"Fraunces", serif', fontSize: 24, marginBottom: 6 }}>{o.title}</div>
                <div style={{ fontSize: 12, color: mhTheme.textMute }}>
                  {o.master ? `Мастер: ${o.master}` : `${o.offers} офферов ожидают рассмотрения`}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: mhTheme.gold, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>{o.status}</div>
                {o.progress > 0 && (
                  <>
                    <div style={{ height: 2, background: mhTheme.border, position: 'relative' }}>
                      <div style={{ height: '100%', width: `${o.progress}%`, background: mhTheme.gold }}/>
                    </div>
                    <div style={{ fontSize: 10, color: mhTheme.textMute, marginTop: 4, fontFamily: '"JetBrains Mono", monospace' }}>{o.progress}% · {o.daysLeft} дн до сдачи</div>
                  </>
                )}
              </div>
              <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22, color: mhTheme.gold }}>{o.price}</div>
              <div style={{ fontSize: 18, color: mhTheme.textDim }}>→</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent offers */}
      <div style={{ padding: '40px' }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.14em', marginBottom: 20 }}>§ НОВЫЕ ОФФЕРЫ · СТОЛ</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, background: mhTheme.border }}>
          {MH_MASTERS.slice(0, 3).map(m => (
            <div key={m.id} style={{ background: mhTheme.bgElev, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: m.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Fraunces", serif', color: mhTheme.gold, fontSize: 16, fontStyle: 'italic' }}>{m.name.split(' ').map(w => w[0]).join('')}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: mhTheme.textMute }}>★ {m.rating} · {m.reviews} отзывов</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: mhTheme.textDim, lineHeight: 1.5 }}>Сделаю стол из массива ореха, столешница 1800×900. Матовый лак, латунные ножки.</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', paddingTop: 14, borderTop: `1px solid ${mhTheme.border}` }}>
                <div>
                  <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22, color: mhTheme.gold }}>${m.priceFrom + 300}</div>
                  <div style={{ fontSize: 10, color: mhTheme.textMute, fontFamily: '"JetBrains Mono", monospace' }}>{m.avgDays} дней</div>
                </div>
                <button onClick={e => { e.stopPropagation(); onNav('chat:'+m.id); }} style={{ background: 'transparent', color: mhTheme.gold, border: `1px solid ${mhTheme.gold}`, padding: '8px 14px', fontSize: 12, cursor: 'pointer', borderRadius: 2 }}>Открыть чат →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Chat page
const ChatPage = ({ masterId, onNav }) => {
  const m = MH_MASTERS.find(x => x.id === masterId) || MH_MASTERS[0];
  const [messages, setMessages] = React.useState(MH_CHAT_MESSAGES);
  const [input, setInput] = React.useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'me', name: 'Вы', text: input, time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'master', name: m.name, text: 'Понял, уточню и вернусь с ответом в течение дня.', time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1200);
  };

  return (
    <div style={{ background: mhTheme.bg, color: mhTheme.text, minHeight: '100vh', display: 'grid', gridTemplateColumns: '300px 1fr 320px' }}>
      {/* Left: conversations */}
      <aside style={{ borderRight: `1px solid ${mhTheme.border}`, padding: '30px 0' }}>
        <div style={{ padding: '0 24px 20px', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.14em' }}>§ ЧАТЫ · 4</div>
        {MH_MASTERS.slice(0, 4).map(mx => (
          <div key={mx.id} onClick={() => onNav('chat:'+mx.id)} style={{
            padding: '16px 24px', borderLeft: mx.id === m.id ? `2px solid ${mhTheme.gold}` : '2px solid transparent',
            background: mx.id === m.id ? mhTheme.bgElev : 'transparent',
            cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: mx.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Fraunces", serif', color: mhTheme.gold, fontSize: 14, fontStyle: 'italic' }}>{mx.name.split(' ').map(w => w[0]).join('')}</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mx.name}</div>
              <div style={{ fontSize: 11, color: mhTheme.textMute, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mx.shop}</div>
            </div>
          </div>
        ))}
      </aside>

      {/* Center: messages */}
      <main style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ padding: '20px 32px', borderBottom: `1px solid ${mhTheme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22 }}>{m.name}</div>
            <div style={{ fontSize: 11, color: mhTheme.success, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: mhTheme.success }}/>Онлайн
            </div>
          </div>
          <button onClick={() => onNav('master:'+m.id)} style={{ background: 'transparent', color: mhTheme.gold, border: `1px solid ${mhTheme.gold}`, padding: '8px 14px', fontSize: 12, cursor: 'pointer', borderRadius: 2 }}>Профиль →</button>
        </div>
        <div style={{ flex: 1, padding: '30px 32px', display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto', maxHeight: '70vh' }}>
          <div style={{ textAlign: 'center', fontSize: 11, color: mhTheme.textMute, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '8px 0' }}>Сегодня</div>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '66%',
                background: msg.from === 'me' ? mhTheme.goldBg : mhTheme.bgElev,
                border: `1px solid ${msg.from === 'me' ? mhTheme.gold : mhTheme.border}`,
                padding: '14px 18px', borderRadius: 2,
              }}>
                <div style={{ fontSize: 14, lineHeight: 1.5 }}>{msg.text}</div>
                {msg.attachment && (
                  <div style={{ marginTop: 10, padding: '10px 14px', background: mhTheme.bg, border: `1px solid ${mhTheme.border}`, fontSize: 12, color: mhTheme.gold, fontFamily: '"JetBrains Mono", monospace', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span>📎</span>{msg.attachment}
                  </div>
                )}
                <div style={{ fontSize: 10, color: mhTheme.textMute, marginTop: 8, fontFamily: '"JetBrains Mono", monospace' }}>{msg.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '16px 32px', borderTop: `1px solid ${mhTheme.border}`, display: 'flex', gap: 12 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Напишите сообщение…"
            style={{ flex: 1, background: mhTheme.bgElev, border: `1px solid ${mhTheme.border}`, color: mhTheme.text, padding: '14px 18px', fontSize: 14, outline: 'none', fontFamily: 'inherit', borderRadius: 2 }}/>
          <button onClick={send} style={{ background: mhTheme.gold, color: mhTheme.bg, border: 'none', padding: '0 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}>Отправить →</button>
        </div>
      </main>

      {/* Right: order details */}
      <aside style={{ borderLeft: `1px solid ${mhTheme.border}`, padding: 28 }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: mhTheme.gold, letterSpacing: '0.14em', marginBottom: 16 }}>ЗАКАЗ · #001</div>
        <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22, marginBottom: 20 }}>Кухонный гарнитур U-образный</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 14px', fontSize: 13 }}>
          <span style={{ color: mhTheme.textMute, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.1em' }}>СТАТУС</span>
          <span style={{ color: mhTheme.gold }}>Согласование</span>
          <span style={{ color: mhTheme.textMute, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.1em' }}>ЦЕНА</span>
          <span>$2,850</span>
          <span style={{ color: mhTheme.textMute, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.1em' }}>СРОК</span>
          <span>28 дней</span>
          <span style={{ color: mhTheme.textMute, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.1em' }}>МАТЕРИАЛ</span>
          <span>Дуб · матовый лак</span>
        </div>
        <button style={{ width: '100%', background: mhTheme.gold, color: mhTheme.bg, border: 'none', padding: '14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 28, borderRadius: 2 }}>Принять оффер →</button>
        <button style={{ width: '100%', background: 'transparent', color: mhTheme.textDim, border: `1px solid ${mhTheme.border}`, padding: '14px', fontSize: 13, cursor: 'pointer', marginTop: 8, borderRadius: 2 }}>Запросить правку</button>
      </aside>
    </div>
  );
};

// Works page (portfolio gallery)
const WorksPage = ({ onNav }) => {
  const [cat, setCat] = React.useState(null);
  const filtered = cat ? MH_WORKS.filter(w => w.category === cat) : MH_WORKS;
  return (
    <div style={{ background: mhTheme.bg, color: mhTheme.text, minHeight: '100vh' }}>
      <div style={{ padding: '60px 40px 40px', borderBottom: `1px solid ${mhTheme.border}` }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: mhTheme.gold, letterSpacing: '0.14em', marginBottom: 16 }}>§ ПОРТФОЛИО · {MH_WORKS.length} РАБОТ</div>
        <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: 76, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 0.95, margin: 0 }}>
          Сделано <em style={{ color: mhTheme.gold }}>мастерами</em>
        </h1>
      </div>
      <div style={{ padding: '20px 40px', borderBottom: `1px solid ${mhTheme.border}`, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={() => setCat(null)} style={{ background: !cat ? mhTheme.gold : 'transparent', color: !cat ? mhTheme.bg : mhTheme.text, border: `1px solid ${!cat ? mhTheme.gold : mhTheme.border}`, padding: '8px 14px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Все</button>
        {MH_CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{ background: cat === c.id ? mhTheme.gold : 'transparent', color: cat === c.id ? mhTheme.bg : mhTheme.text, border: `1px solid ${cat === c.id ? mhTheme.gold : mhTheme.border}`, padding: '8px 14px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>{c.name}</button>
        ))}
      </div>
      <div style={{ padding: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {filtered.map(w => {
          const master = MH_MASTERS.find(mx => mx.id === w.master);
          return (
            <div key={w.id} onClick={() => onNav('master:'+w.master)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <WorkThumb work={w}/>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: '"Fraunces", serif', fontSize: 22, fontStyle: 'italic' }}>{w.title}</div>
                  <div style={{ fontSize: 12, color: mhTheme.textMute, marginTop: 4 }}>{w.material}</div>
                </div>
                <div style={{ fontSize: 11, color: mhTheme.textDim, textAlign: 'right' }}>{master.shop}<br/><span style={{ color: mhTheme.textMute }}>{w.year}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

Object.assign(window, { OrderPage, DashboardPage, ChatPage, WorksPage });
