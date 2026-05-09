'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MH_CATEGORIES, MH_DISTRICTS, MH_MATERIALS, MH_STYLES } from '@/lib/mock-data'
import { G, BG, BG2, BORDER, BORDER2, TEXT, DIM, MUTE, MONO, HEAD } from '@/lib/tokens'

const STEPS = ['Категория', 'Параметры', 'Бюджет и срок', 'Описание', 'Готово']

export default function NewOrderPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [cat, setCat] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [dims, setDims] = useState({ w: '', h: '', d: '' })
  const [material, setMaterial] = useState<string | null>(null)
  const [style, setStyle] = useState<string | null>(null)
  const [budget, setBudget] = useState(2000)
  const [deadline, setDeadline] = useState(30)
  const [district, setDistrict] = useState<string | null>(null)
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [refFiles, setRefFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canNext = () => {
    if (step === 1) return !!cat
    if (step === 2) return !!(material && style)
    if (step === 3) return !!district
    return true
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) { router.push('/login'); return }
    const user = session.user

    const deadlineDate = new Date()
    deadlineDate.setDate(deadlineDate.getDate() + deadline)

    // Upload reference files
    const imageUrls: string[] = []
    for (const file of refFiles) {
      const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin'
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data: up } = await supabase.storage.from('order-images').upload(path, file)
      if (up) {
        const { data: { publicUrl } } = supabase.storage.from('order-images').getPublicUrl(path)
        imageUrls.push(publicUrl)
      }
    }

    const desc_full = [desc, district ? `Район доставки: ${district}` : ''].filter(Boolean).join('\n\n')
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title || MH_CATEGORIES.find(c => c.id === cat)?.name || 'Мой заказ',
        description: desc_full,
        furniture_type: cat,
        style: style,
        width_cm: dims.w ? Math.round(Number(dims.w) / 10) : null,
        height_cm: dims.h ? Math.round(Number(dims.h) / 10) : null,
        depth_cm: dims.d ? Math.round(Number(dims.d) / 10) : null,
        budget_min: budget,
        budget_max: Math.floor(budget * 1.4),
        material: material,
        deadline: deadlineDate.toISOString().split('T')[0],
        images: imageUrls,
      }),
    })

    if (!res.ok) { setError('Ошибка при создании заказа. Попробуйте снова.'); setLoading(false); return }
    setStep(5)
    setLoading(false)
  }

  return (
    <div style={{ background: BG, color: TEXT, minHeight: '100vh' }}>
      <div style={{ padding: '40px 40px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 10 }}>§ РАЗМЕЩЕНИЕ ЗАКАЗА · DOC-001</div>
          <h1 style={{ fontFamily: HEAD, fontSize: 60, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
            Опишите <em style={{ color: G }}>вашу мебель</em>
          </h1>
        </div>
        <button
          onClick={() => router.back()}
          style={{ background: 'transparent', border: `1px solid ${BORDER2}`, color: DIM, padding: '10px 18px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.08em', borderRadius: 2, marginTop: 8, flexShrink: 0 }}
        >
          ← На главную
        </button>
      </div>

      {/* Stepper */}
      <div style={{ padding: '40px 40px 0', display: 'flex', gap: 0 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, padding: '14px 16px', borderTop: `2px solid ${step > i || step === i + 1 ? G : BORDER}`, opacity: step >= i + 1 ? 1 : 0.5 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: step >= i + 1 ? G : MUTE, letterSpacing: '0.1em', marginBottom: 4 }}>0{i + 1}</div>
            <div style={{ fontSize: 13, fontWeight: step === i + 1 ? 600 : 400 }}>{s}</div>
          </div>
        ))}
      </div>

      <div className="grid-sidebar px-page" style={{ paddingTop: 60, paddingBottom: 40 }}>
        <div>
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: HEAD, fontSize: 36, fontWeight: 300, margin: '0 0 8px' }}>Что хотите заказать?</h2>
              <p style={{ color: DIM, margin: '0 0 32px', fontSize: 15 }}>Выберите категорию — мы покажем только подходящих мастеров.</p>
              <div className="grid-3" style={{ gap: 12 }}>
                {MH_CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => setCat(c.id)} style={{
                    background: cat === c.id ? 'rgba(228,182,104,0.08)' : BG2,
                    border: `1px solid ${cat === c.id ? G : BORDER}`,
                    padding: '24px 18px', textAlign: 'left', cursor: 'pointer', color: TEXT, fontFamily: 'inherit',
                  }}>
                    <div style={{ fontFamily: HEAD, fontSize: 22, fontWeight: 400, marginBottom: 4 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: MUTE, letterSpacing: '0.08em' }}>{c.count} активных заказов</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <h2 style={{ fontFamily: HEAD, fontSize: 36, fontWeight: 300, margin: 0 }}>Параметры изделия</h2>
              <div>
                <label style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.12em', display: 'block', marginBottom: 10 }}>НАЗВАНИЕ ПРОЕКТА</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Например: Кухонный гарнитур U-образный"
                  style={{ width: '100%', background: BG2, border: `1px solid ${BORDER}`, color: TEXT, padding: '16px 18px', fontSize: 15, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.12em', display: 'block', marginBottom: 10 }}>РАЗМЕРЫ · ММ</label>
                <div className="grid-3" style={{ gap: 12 }}>
                  {(['w', 'h', 'd'] as const).map((k, ki) => (
                    <div key={k} style={{ position: 'relative' }}>
                      <input value={dims[k]} onChange={e => setDims({ ...dims, [k]: e.target.value })} placeholder="0"
                        style={{ width: '100%', background: BG2, border: `1px solid ${BORDER}`, color: TEXT, padding: '16px 80px 16px 18px', fontSize: 15, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                      <span style={{ position: 'absolute', right: 18, top: 16, fontSize: 11, color: MUTE, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{['ширина','высота','глубина'][ki]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.12em', display: 'block', marginBottom: 10 }}>МАТЕРИАЛ</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {MH_MATERIALS.map(m => (
                    <button key={m} onClick={() => setMaterial(m)} style={{
                      background: material === m ? G : 'transparent', color: material === m ? BG : TEXT,
                      border: `1px solid ${material === m ? G : BORDER}`,
                      padding: '10px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                    }}>{m}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.12em', display: 'block', marginBottom: 10 }}>СТИЛЬ</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {MH_STYLES.map(s => (
                    <button key={s} onClick={() => setStyle(s)} style={{
                      background: style === s ? G : 'transparent', color: style === s ? BG : TEXT,
                      border: `1px solid ${style === s ? G : BORDER}`,
                      padding: '10px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
              <h2 style={{ fontFamily: HEAD, fontSize: 36, fontWeight: 300, margin: 0 }}>Бюджет и сроки</h2>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <label style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.12em' }}>БЮДЖЕТ · USD</label>
                  <span style={{ fontFamily: HEAD, fontSize: 28, color: G }}>${budget.toLocaleString()} — ${Math.floor(budget * 1.4).toLocaleString()}</span>
                </div>
                <input type="range" min="200" max="10000" step="100" value={budget} onChange={e => setBudget(+e.target.value)}
                  style={{ width: '100%', accentColor: G }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTE, marginTop: 6, fontFamily: MONO, letterSpacing: '0.08em' }}>
                  <span>$200</span><span>$10,000+</span>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <label style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.12em' }}>ЖЕЛАЕМЫЙ СРОК · ДНИ</label>
                  <span style={{ fontFamily: HEAD, fontSize: 28, color: G }}>{deadline} дней</span>
                </div>
                <input type="range" min="7" max="90" step="1" value={deadline} onChange={e => setDeadline(+e.target.value)}
                  style={{ width: '100%', accentColor: G }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTE, marginTop: 6, fontFamily: MONO, letterSpacing: '0.08em' }}>
                  <span>1 нед</span><span>3 мес</span>
                </div>
              </div>
              <div>
                <label style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.12em', display: 'block', marginBottom: 10 }}>РАЙОН ДЛЯ ДОСТАВКИ</label>
                <select value={district || ''} onChange={e => setDistrict(e.target.value || null)}
                  style={{ width: '100%', background: BG2, border: `1px solid ${BORDER}`, color: TEXT, padding: '16px 18px', fontSize: 15, outline: 'none', fontFamily: 'inherit' }}>
                  <option value="">Выберите район</option>
                  {MH_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <h2 style={{ fontFamily: HEAD, fontSize: 36, fontWeight: 300, margin: 0 }}>Расскажите подробности</h2>
              <p style={{ color: DIM, margin: 0 }}>Чем детальнее опишете — тем точнее будут офферы.</p>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={8}
                placeholder="Особенности, пожелания по фурнитуре, референсы, сложные решения, условия монтажа…"
                style={{ width: '100%', background: BG2, border: `1px solid ${BORDER}`, color: TEXT, padding: 18, fontSize: 15, outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.55, boxSizing: 'border-box' }} />
              <input
                ref={fileInputRef}
                type="file"
                accept="*/*"
                multiple
                style={{ display: 'none' }}
                onChange={e => setRefFiles(prev => [...prev, ...Array.from(e.target.files ?? [])])}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{ border: `1px dashed ${BORDER2}`, padding: 24, textAlign: 'center', color: DIM, cursor: 'pointer' }}
              >
                <div style={{ fontSize: 32, color: G, marginBottom: 6 }}>+</div>
                <div style={{ fontSize: 13 }}>Добавьте файлы для референса</div>
                <div style={{ fontSize: 11, color: MUTE, marginTop: 4 }}>Фото, видео, любые форматы</div>
              </div>
              {refFiles.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {refFiles.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: BG2, border: `1px solid ${BORDER}`, padding: '10px 14px', fontSize: 13 }}>
                      <span style={{ color: DIM, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                      <button
                        onClick={() => setRefFiles(prev => prev.filter((_, j) => j !== i))}
                        style={{ background: 'none', border: 'none', color: MUTE, cursor: 'pointer', fontSize: 16, padding: '0 0 0 12px', flexShrink: 0 }}
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 64, color: G, marginBottom: 20 }}>✓</div>
              <h2 style={{ fontFamily: HEAD, fontSize: 48, fontWeight: 300, margin: '0 0 16px' }}>
                Заказ <em style={{ color: G }}>опубликован</em>
              </h2>
              <p style={{ color: DIM, maxWidth: 520, margin: '0 auto 32px', fontSize: 16, lineHeight: 1.55 }}>
                Мастера уже видят ваше ТЗ. Первые предложения обычно приходят в течение часа. Мы уведомим вас в Telegram.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                <button onClick={() => router.push('/orders')} style={{ background: G, color: BG, border: 'none', padding: '16px 24px', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', cursor: 'pointer', borderRadius: 2 }}>Перейти в кабинет →</button>
                <button onClick={() => router.push('/')} style={{ background: 'transparent', color: TEXT, border: `1px solid ${BORDER2}`, padding: '16px 24px', fontSize: 13, fontWeight: 500, letterSpacing: '0.06em', cursor: 'pointer', borderRadius: 2 }}>На главную</button>
              </div>
            </div>
          )}

          {step < 5 && (
            <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${BORDER}` }}>
              {error && <div style={{ color: '#f87171', fontSize: 13, marginBottom: 16 }}>{error}</div>}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
                  style={{ background: 'transparent', color: step === 1 ? MUTE : TEXT, border: `1px solid ${BORDER}`, padding: '14px 22px', fontSize: 13, cursor: step === 1 ? 'default' : 'pointer', borderRadius: 2, fontFamily: 'inherit' }}>← Назад</button>
                <button
                  onClick={() => {
                    if (!canNext()) return
                    if (step === 4) handleSubmit()
                    else setStep(step + 1)
                  }}
                  disabled={!canNext() || loading}
                  style={{ background: canNext() && !loading ? G : BG2, color: canNext() && !loading ? BG : MUTE, border: 'none', padding: '14px 26px', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', cursor: canNext() && !loading ? 'pointer' : 'default', borderRadius: 2, fontFamily: 'inherit' }}>
                  {step === 4 ? (loading ? 'Публикация…' : 'Опубликовать →') : 'Далее →'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar summary */}
        <aside style={{ background: BG2, padding: 28, border: `1px solid ${BORDER}`, position: 'sticky', top: 100 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: G, letterSpacing: '0.14em', marginBottom: 20 }}>ВАШ ЗАКАЗ · ПРЕДПРОСМОТР</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px 14px', fontSize: 13 }}>
            <span style={{ color: MUTE, fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em' }}>КАТЕГОРИЯ</span>
            <span>{cat ? MH_CATEGORIES.find(c => c.id === cat)?.name ?? '—' : '—'}</span>
            <span style={{ color: MUTE, fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em' }}>МАТЕРИАЛ</span>
            <span>{material ?? '—'}</span>
            <span style={{ color: MUTE, fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em' }}>СТИЛЬ</span>
            <span>{style ?? '—'}</span>
            <span style={{ color: MUTE, fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em' }}>РАЗМЕРЫ</span>
            <span>{dims.w || dims.h || dims.d ? `${dims.w||'?'}×${dims.h||'?'}×${dims.d||'?'} мм` : '—'}</span>
            <span style={{ color: MUTE, fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em' }}>БЮДЖЕТ</span>
            <span style={{ color: G }}>${budget.toLocaleString()}—${Math.floor(budget * 1.4).toLocaleString()}</span>
            <span style={{ color: MUTE, fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em' }}>СРОК</span>
            <span>{deadline} дней</span>
            <span style={{ color: MUTE, fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em' }}>РАЙОН</span>
            <span>{district ?? '—'}</span>
          </div>
          <div style={{ marginTop: 24, padding: '18px 0', borderTop: `1px solid ${BORDER}`, fontSize: 11, color: MUTE, letterSpacing: '0.08em' }}>
            Размещение бесплатно. Оплата — только за выбранный проект.
          </div>
        </aside>
      </div>
    </div>
  )
}
