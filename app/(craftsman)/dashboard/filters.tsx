'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { G, BG2, BORDER, TEXT, DIM, MUTE, MONO } from '@/lib/tokens'

const TYPES: { id: string; label: string }[] = [
  { id: 'kitchen',  label: 'Кухни' },
  { id: 'wardrobe', label: 'Гардеробные' },
  { id: 'sofa',     label: 'Диваны' },
  { id: 'bed',      label: 'Кровати' },
  { id: 'cabinet',  label: 'Шкафы' },
  { id: 'chair',    label: 'Стулья' },
  { id: 'table',    label: 'Столы' },
  { id: 'shelf',    label: 'Стеллажи' },
  { id: 'dresser',  label: 'Комоды' },
]

export default function Filters() {
  const router = useRouter()
  const params = useSearchParams()
  const activeType = params.get('type') || ''
  const budgetMax = params.get('budget') || ''

  function update(key: string, value: string) {
    const p = new URLSearchParams(params.toString())
    if (value) { p.set(key, value) } else { p.delete(key) }
    router.push(`/dashboard?${p.toString()}`)
  }

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontFamily: MONO, fontSize: 10, color: G, letterSpacing: '0.14em', marginBottom: 14 }}>ФИЛЬТР · ТИП</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {TYPES.map(({ id, label }) => (
          <button key={id} onClick={() => update('type', activeType === id ? '' : id)} style={{
            background: activeType === id ? G : 'transparent',
            color: activeType === id ? '#0A0D12' : DIM,
            border: `1px solid ${activeType === id ? G : BORDER}`,
            padding: '8px 14px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
            letterSpacing: '0.04em', borderRadius: 2,
          }}>{label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="number"
            placeholder="Макс. бюджет · USD"
            defaultValue={budgetMax}
            onChange={e => update('budget', e.target.value)}
            style={{ background: BG2, border: `1px solid ${BORDER}`, color: TEXT, padding: '10px 16px', fontSize: 13, outline: 'none', fontFamily: 'inherit', width: 200 }}
          />
        </div>
        {(activeType || budgetMax) && (
          <button onClick={() => router.push('/dashboard')} style={{
            background: 'transparent', color: MUTE, border: `1px solid ${BORDER}`,
            padding: '10px 16px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 2,
          }}>Сбросить</button>
        )}
      </div>
    </div>
  )
}
