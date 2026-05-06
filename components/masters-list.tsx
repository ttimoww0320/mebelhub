'use client'

import { useState } from 'react'
import Link from 'next/link'
import { G, BG, BG2, BORDER, BORDER2, TEXT, DIM, MUTE, MONO, HEAD, SUCCESS } from '@/lib/tokens'

type Master = {
  id: string
  full_name: string
  company_name: string | null
  bio: string | null
  rating: number | null
  reviews_count: number | null
  verified: boolean | null
  verification_status: string | null
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase()
}

const ACCENTS = ['#1a1f2e', '#1f2a1a', '#2a1a1a', '#1a2a2a', '#2a1f10', '#1a1a2a']
function accent(id: string) {
  const n = id.charCodeAt(0) + id.charCodeAt(id.length - 1)
  return ACCENTS[n % ACCENTS.length]
}

export default function MastersList({ masters }: { masters: Master[] }) {
  const [search, setSearch] = useState('')
  const [sort,   setSort]   = useState('rating')
  const [onlyVerified, setOnlyVerified] = useState(false)

  const filtered = masters.filter(m => {
    if (onlyVerified && !m.verified) return false
    if (search) {
      const q = search.toLowerCase()
      const nameMatch = m.full_name.toLowerCase().includes(q)
      const companyMatch = m.company_name?.toLowerCase().includes(q) ?? false
      if (!nameMatch && !companyMatch) return false
    }
    return true
  }).sort((a, b) => {
    if (sort === 'rating')  return (b.rating ?? 0) - (a.rating ?? 0)
    if (sort === 'reviews') return (b.reviews_count ?? 0) - (a.reviews_count ?? 0)
    return 0
  })

  return (
    <>
      {/* Filter bar */}
      <div style={{ padding:'24px 40px', borderBottom:`1px solid ${BORDER}`, display:'grid', gridTemplateColumns:'1fr auto auto auto', gap:16, alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:BG2, border:`1px solid ${BORDER}` }}>
          <span style={{ color:MUTE, fontSize:14 }}>⌕</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по имени…"
            style={{ background:'transparent', border:'none', color:TEXT, fontSize:14, outline:'none', width:'100%', fontFamily:'inherit' }}
          />
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{ background:BG2, border:`1px solid ${BORDER}`, color:TEXT, padding:'12px 16px', fontSize:13, cursor:'pointer', fontFamily:'inherit' }}
        >
          <option value="rating">Сортировка: рейтинг</option>
          <option value="reviews">Больше отзывов</option>
        </select>
        <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:MUTE, cursor:'pointer', whiteSpace:'nowrap' }}>
          <input type="checkbox" checked={onlyVerified} onChange={e => setOnlyVerified(e.target.checked)} />
          Только проверенные
        </label>
        <div style={{ fontFamily:MONO, fontSize:11, color:MUTE, letterSpacing:'0.08em' }}>{filtered.length} / {masters.length}</div>
      </div>

      {/* Master cards */}
      <div style={{ padding:'40px 40px 80px', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:2, background:BORDER }}>
        {filtered.map((m, idx) => (
          <Link key={m.id} href={`/craftsman/${m.id}`} style={{ background:BG, padding:32, textDecoration:'none', color:TEXT, display:'grid', gridTemplateColumns:'140px 1fr', gap:24 }}>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ aspectRatio:'1/1', background:accent(m.id), display:'flex', alignItems:'center', justifyContent:'center', fontFamily:HEAD, fontSize:42, color:G, fontStyle:'italic', border:`1px solid ${BORDER2}` }}>
                {initials(m.full_name)}
              </div>
              <div style={{ fontFamily:MONO, fontSize:10, color:MUTE, textAlign:'center', letterSpacing:'0.08em' }}>
                CRAFT · {String(idx + 1).padStart(3, '0')}
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ fontFamily:HEAD, fontSize:26, fontWeight:400, letterSpacing:'-0.01em' }}>{m.company_name || m.full_name}</div>
                  {m.verified && (
                    <span style={{ fontSize:10, color:G, fontFamily:MONO, letterSpacing:'0.08em', border:`1px solid ${G}`, padding:'2px 8px' }}>✓ ПРОВЕРЕН</span>
                  )}
                </div>
              </div>
              {m.bio && (
                <div style={{ fontSize:13, color:DIM, lineHeight:1.5 }}>{m.bio.slice(0, 120)}{m.bio.length > 120 ? '…' : ''}</div>
              )}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14, marginTop:'auto', paddingTop:16, borderTop:`1px dashed ${BORDER}` }}>
                <div>
                  <div style={{ fontFamily:HEAD, fontSize:20, fontWeight:400 }}>
                    <span style={{ color:G }}>★</span> {m.rating ?? '—'}
                  </div>
                  <div style={{ fontSize:10, color:MUTE, textTransform:'uppercase', letterSpacing:'0.08em', marginTop:2 }}>{m.reviews_count ?? 0} отзывов</div>
                </div>
                <div>
                  <div style={{ fontSize:11, color: m.verified ? SUCCESS : MUTE, fontFamily:MONO, letterSpacing:'0.08em', marginTop:4 }}>
                    {m.verified ? '● Верифицирован' : m.verification_status === 'pending' ? '○ На проверке' : '○ Не верифицирован'}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div style={{ background:BG, padding:60, gridColumn:'1/-1', textAlign:'center', color:MUTE, fontSize:14 }}>
            Мастера не найдены
          </div>
        )}
      </div>
    </>
  )
}
