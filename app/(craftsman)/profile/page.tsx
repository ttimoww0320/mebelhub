'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { G, BG, BG2, BORDER, BORDER2, TEXT, DIM, MUTE, MONO, HEAD, SUCCESS } from '@/lib/tokens'
import type { Profile } from '@/types'

const VS_LABEL: Record<string, string> = {
  none:     'Не подана',
  pending:  'На проверке',
  verified: 'Проверен ✓',
  rejected: 'Отклонён',
}
const VS_COLOR: Record<string, string> = {
  none:     MUTE,
  pending:  'rgba(250,204,21,0.8)',
  verified: SUCCESS,
  rejected: 'rgba(248,113,113,0.8)',
}

const OFFER_STATUS: Record<string, string> = {
  pending:  'Ожидает',
  accepted: 'Принято',
  rejected: 'Отклонено',
}
const OFFER_COLOR: Record<string, string> = {
  pending:  DIM,
  accepted: SUCCESS,
  rejected: 'rgba(248,113,113,0.7)',
}

const CATEGORIES = ['Кухни', 'Шкафы', 'Диваны', 'Кровати', 'Столы', 'Комоды', 'Прочее']

export default function CraftsmanProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone]     = useState('')
  const [bio, setBio]         = useState('')
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [saveError, setSaveError] = useState('')
  const [offers, setOffers]   = useState<any[]>([])
  const [docFile, setDocFile] = useState<File | null>(null)
  const [docLoading, setDocLoading] = useState(false)
  const [docMsg, setDocMsg]   = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // Works
  const [works, setWorks]           = useState<any[]>([])
  const [workTitle, setWorkTitle]   = useState('')
  const [workDesc, setWorkDesc]     = useState('')
  const [workCat, setWorkCat]       = useState(CATEGORIES[0])
  const [workPrice, setWorkPrice]   = useState('')
  const [workFile, setWorkFile]     = useState<File | null>(null)
  const [workLoading, setWorkLoading] = useState(false)
  const [workMsg, setWorkMsg]       = useState('')
  const workFileRef = useRef<HTMLInputElement>(null)
  const [userId, setUserId]         = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user
      if (!user) return
      setUserId(user.id)
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      if (data) {
        setProfile(data)
        setFullName(data.full_name)
        setPhone(data.phone || '')
        setBio(data.bio || '')
      }
      const { data: offersData } = await supabase
        .from('offers')
        .select('*, order:orders(title, status)')
        .eq('craftsman_id', user.id)
        .order('created_at', { ascending: false })
      setOffers(offersData || [])

      const { data: worksData } = await supabase
        .from('works')
        .select('*')
        .eq('craftsman_id', user.id)
        .order('created_at', { ascending: false })
      setWorks(worksData || [])
    })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) { setSaving(false); return }
    const res = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, phone, bio, role: 'craftsman' }),
    })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) { setSaveError('Ошибка: ' + (json.error ?? res.status)); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleVerificationSubmit() {
    if (!docFile || !profile) return
    setDocLoading(true)
    setDocMsg('')
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user
    if (!user) return

    const ext = docFile.name.split('.').pop()
    const path = `${user.id}/doc_${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('verification-docs').upload(path, docFile)
    if (uploadError) { setDocMsg('Ошибка загрузки: ' + uploadError.message); setDocLoading(false); return }

    const { data: urlData } = supabase.storage.from('verification-docs').getPublicUrl(path)
    const submitRes = await fetch('/api/verification/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docUrl: urlData.publicUrl }),
    })
    if (!submitRes.ok) {
      setDocMsg('Ошибка отправки. Попробуйте ещё раз.')
      setDocLoading(false)
      return
    }

    setProfile(prev => prev ? { ...prev, verification_status: 'pending' } : prev)
    setDocMsg('Документ отправлен! Мы уведомим вас в Telegram в течение 1–2 дней.')
    setDocFile(null)
    setDocLoading(false)
  }

  async function handleAddWork() {
    if (!workTitle || !workFile || !userId) return
    setWorkLoading(true)
    setWorkMsg('')
    const supabase = createClient()

    const ext = workFile.name.split('.').pop()
    const path = `${userId}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('works').upload(path, workFile)
    if (uploadError) { setWorkMsg('Ошибка загрузки: ' + uploadError.message); setWorkLoading(false); return }

    const { data: urlData } = supabase.storage.from('works').getPublicUrl(path)

    const { data: newWork, error: insertError } = await supabase.from('works').insert({
      craftsman_id: userId,
      title: workTitle,
      description: workDesc || null,
      category: workCat,
      image_url: urlData.publicUrl,
      price: workPrice ? parseInt(workPrice) : null,
    }).select().single()

    setWorkLoading(false)
    if (insertError) { setWorkMsg('Ошибка сохранения: ' + insertError.message); return }

    setWorks(prev => [newWork, ...prev])
    setWorkTitle('')
    setWorkDesc('')
    setWorkPrice('')
    setWorkFile(null)
    setWorkMsg('Работа добавлена!')
    setTimeout(() => setWorkMsg(''), 3000)
  }

  async function handleDeleteWork(workId: string, imageUrl: string) {
    const supabase = createClient()
    const pathMatch = imageUrl.match(/\/storage\/v1\/object\/public\/works\/(.+)/)
    if (pathMatch) {
      await supabase.storage.from('works').remove([decodeURIComponent(pathMatch[1])])
    }
    await supabase.from('works').delete().eq('id', workId)
    setWorks(prev => prev.filter(w => w.id !== workId))
  }

  if (!profile) return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em' }}>ЗАГРУЗКА···</div>
    </div>
  )

  const vs = (profile as any).verification_status || 'none'
  const initials = profile.full_name?.split(' ').map((w: string) => w[0]).join('').slice(0, 2) ?? '?'

  return (
    <div style={{ background: BG, color: TEXT, minHeight: '100vh' }}>

      {/* Header */}
      <div className="px-page" style={{ paddingTop: 40, paddingBottom: 40, borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: BG2, border: `1px solid ${BORDER2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HEAD, fontSize: 28, color: G, fontStyle: 'italic' }}>
            {initials}
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 8 }}>§ МОЙ ПРОФИЛЬ</div>
            <h1 style={{ fontFamily: HEAD, fontSize: 48, fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1, margin: '0 0 10px' }}>
              {(profile as any).company_name || profile.full_name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: VS_COLOR[vs], letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                ◆ {VS_LABEL[vs]}
              </span>
              {(profile.rating ?? 0) > 0 && (
                <span style={{ fontSize: 12, color: DIM }}>★ {Number(profile.rating).toFixed(1)} · {profile.reviews_count} отзывов</span>
              )}
            </div>
          </div>
        </div>
        <a href="/dashboard" style={{ fontSize: 13, color: DIM, textDecoration: 'none', border: `1px solid ${BORDER}`, padding: '10px 18px', borderRadius: 2 }}>
          ← Лента заказов
        </a>
      </div>

      <div className="grid-2 px-page" style={{ paddingTop: 40, paddingBottom: 40 }}>

        {/* Left: Edit form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

          {/* Profile form */}
          <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: 32 }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 24 }}>РЕДАКТИРОВАТЬ ПРОФИЛЬ</div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>ИМЯ И ФАМИЛИЯ</label>
                <input value={fullName} onChange={e => setFullName(e.target.value)} required
                  style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, color: TEXT, padding: '14px 16px', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>ТЕЛЕФОН</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+998 90 123 45 67"
                  style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, color: TEXT, padding: '14px 16px', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>О СЕБЕ · ОПЫТ</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={5}
                  placeholder="Специализация, опыт работы, выполненные проекты…"
                  style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, color: TEXT, padding: '14px 16px', fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.55, boxSizing: 'border-box' }} />
              </div>
              {saveError && (
                <div style={{ fontSize: 13, color: 'rgba(248,113,113,0.9)', padding: '12px 16px', border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.06)' }}>
                  {saveError}
                </div>
              )}
              <button type="submit" disabled={saving}
                style={{ background: saved ? 'rgba(74,222,128,0.15)' : G, color: saved ? SUCCESS : BG, border: saved ? `1px solid ${SUCCESS}` : 'none', padding: '14px 24px', fontSize: 13, fontWeight: 600, letterSpacing: '0.06em', cursor: saving ? 'default' : 'pointer', borderRadius: 2, fontFamily: 'inherit', alignSelf: 'flex-start' }}>
                {saved ? '✓ Сохранено' : saving ? 'Сохраняем…' : 'Сохранить изменения'}
              </button>
            </form>
          </div>

          {/* Verification */}
          <div style={{ background: BG2, border: `1px solid ${vs === 'none' || vs === 'rejected' ? G : BORDER}`, padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em' }}>ВЕРИФИКАЦИЯ</div>
              <span style={{ fontFamily: MONO, fontSize: 10, color: VS_COLOR[vs], letterSpacing: '0.1em', textTransform: 'uppercase' }}>{VS_LABEL[vs]}</span>
            </div>

            {vs === 'verified' && (
              <p style={{ fontSize: 14, color: SUCCESS, lineHeight: 1.6 }}>
                ✓ Ваш профиль верифицирован. Заказчики видят бейдж "Проверен" на вашей странице.
              </p>
            )}
            {vs === 'pending' && (
              <p style={{ fontSize: 14, color: DIM, lineHeight: 1.6 }}>
                Документ на проверке. Мы уведомим вас в Telegram когда проверка завершится.
              </p>
            )}
            {(vs === 'none' || vs === 'rejected') && (
              <>
                {vs === 'rejected' && <p style={{ fontSize: 13, color: 'rgba(248,113,113,0.8)', marginBottom: 16 }}>Документ отклонён. Загрузите другой документ.</p>}
                <p style={{ fontSize: 13, color: DIM, lineHeight: 1.6, marginBottom: 20 }}>
                  Загрузите фото паспорта или свидетельства ИП — это повышает доверие заказчиков и увеличивает шанс получить заказ.
                </p>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{ border: `1px dashed ${docFile ? G : BORDER2}`, padding: '28px 24px', textAlign: 'center', cursor: 'pointer', marginBottom: 16, background: docFile ? 'rgba(228,182,104,0.04)' : 'transparent' }}>
                  {docFile ? (
                    <div style={{ fontSize: 13, color: G }}>{docFile.name}</div>
                  ) : (
                    <>
                      <div style={{ fontSize: 24, color: MUTE, marginBottom: 8 }}>+</div>
                      <div style={{ fontSize: 13, color: DIM }}>Нажмите чтобы выбрать файл</div>
                      <div style={{ fontSize: 11, color: MUTE, marginTop: 4 }}>JPG, PNG или PDF</div>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => setDocFile(e.target.files?.[0] || null)} />
                </div>
                {docMsg && <p style={{ fontSize: 13, color: SUCCESS, marginBottom: 16 }}>{docMsg}</p>}
                <button onClick={handleVerificationSubmit} disabled={!docFile || docLoading}
                  style={{ background: docFile && !docLoading ? G : BG, color: docFile && !docLoading ? BG : MUTE, border: 'none', padding: '12px 22px', fontSize: 13, fontWeight: 600, cursor: docFile && !docLoading ? 'pointer' : 'default', borderRadius: 2, fontFamily: 'inherit' }}>
                  {docLoading ? 'Отправляем…' : 'Отправить на проверку'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right: My offers */}
        <div>
          <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: 32 }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 24 }}>
              МОИ ПРЕДЛОЖЕНИЯ · {offers.length}
            </div>
            {offers.length === 0 ? (
              <div style={{ fontSize: 13, color: MUTE, padding: '20px 0' }}>Вы ещё не отправляли предложений</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {offers.map((offer, i) => (
                  <div key={offer.id} style={{
                    padding: '18px 0',
                    borderBottom: i < offers.length - 1 ? `1px solid ${BORDER}` : 'none',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{offer.order?.title}</div>
                      <div style={{ fontSize: 11, color: MUTE }}>${Number(offer.price).toLocaleString()} · {offer.delivery_days} дней</div>
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: OFFER_COLOR[offer.status] ?? DIM, letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0 }}>
                      {OFFER_STATUS[offer.status] ?? offer.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio section */}
      <div className="px-page" style={{ paddingBottom: 60 }}>
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 40 }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 32 }}>
            § МОИ РАБОТЫ · {works.length}
          </div>

          {/* Add work form */}
          <div style={{ background: BG2, border: `1px solid ${BORDER}`, padding: 32, marginBottom: 32 }}>
            <div style={{ fontFamily: MONO, fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 24 }}>ДОБАВИТЬ РАБОТУ</div>
            <div className="grid-2-sm">
              <div>
                <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>НАЗВАНИЕ *</label>
                <input value={workTitle} onChange={e => setWorkTitle(e.target.value)} placeholder="Кухонный гарнитур «Минимал»"
                  style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, color: TEXT, padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>КАТЕГОРИЯ</label>
                <select value={workCat} onChange={e => setWorkCat(e.target.value)}
                  style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, color: TEXT, padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>ОПИСАНИЕ</label>
                <textarea value={workDesc} onChange={e => setWorkDesc(e.target.value)} rows={3}
                  placeholder="Материалы, размеры, особенности…"
                  style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, color: TEXT, padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.55, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>ЦЕНА (необязательно)</label>
                <input value={workPrice} onChange={e => setWorkPrice(e.target.value)} type="number" placeholder="1500000"
                  style={{ width: '100%', background: BG, border: `1px solid ${BORDER}`, color: TEXT, padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontFamily: MONO, fontSize: 10, color: MUTE, letterSpacing: '0.12em', display: 'block', marginBottom: 8 }}>ФОТО *</label>
                <div onClick={() => workFileRef.current?.click()}
                  style={{ border: `1px dashed ${workFile ? G : BORDER2}`, padding: '12px 14px', cursor: 'pointer', background: workFile ? 'rgba(228,182,104,0.04)' : 'transparent', textAlign: 'center' }}>
                  <span style={{ fontSize: 13, color: workFile ? G : MUTE }}>{workFile ? workFile.name : '+ Выбрать фото'}</span>
                  <input ref={workFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setWorkFile(e.target.files?.[0] || null)} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20 }}>
              <button onClick={handleAddWork} disabled={!workTitle || !workFile || workLoading}
                style={{ background: workTitle && workFile && !workLoading ? G : BG, color: workTitle && workFile && !workLoading ? BG : MUTE, border: 'none', padding: '12px 24px', fontSize: 13, fontWeight: 600, cursor: workTitle && workFile && !workLoading ? 'pointer' : 'default', borderRadius: 2, fontFamily: 'inherit' }}>
                {workLoading ? 'Загружаем…' : 'Добавить работу'}
              </button>
              {workMsg && <span style={{ fontSize: 13, color: SUCCESS }}>{workMsg}</span>}
            </div>
          </div>

          {/* Works grid */}
          {works.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: MUTE, fontSize: 14 }}>
              Вы ещё не добавили ни одной работы
            </div>
          ) : (
            <div className="grid-3" style={{ gap: 2, background: BORDER }}>
              {works.map(work => (
                <div key={work.id} style={{ background: BG, padding: 0, position: 'relative' }}>
                  {work.image_url && (
                    <img src={work.image_url} alt={work.title}
                      style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
                  )}
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ fontFamily: HEAD, fontSize: 18, marginBottom: 4 }}>{work.title}</div>
                    <div style={{ fontSize: 11, color: G, fontFamily: MONO, letterSpacing: '0.1em', marginBottom: 6 }}>{work.category}</div>
                    {work.description && <div style={{ fontSize: 13, color: DIM, lineHeight: 1.5, marginBottom: 8 }}>{work.description}</div>}
                    {work.price && <div style={{ fontSize: 14, color: G }}>{Number(work.price).toLocaleString()} сум</div>}
                  </div>
                  <button onClick={() => handleDeleteWork(work.id, work.image_url)}
                    style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(10,13,18,0.8)', border: `1px solid ${BORDER2}`, color: 'rgba(248,113,113,0.8)', padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2 }}>
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
