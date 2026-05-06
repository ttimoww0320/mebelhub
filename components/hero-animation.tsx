'use client'

import { useEffect, useState } from 'react'

export default function HeroAnimation() {
  const [t, setT] = useState(0)

  useEffect(() => {
    let raf: number
    const start = performance.now()
    const tick = (now: number) => {
      setT(((now - start) / 1000) % 9)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const ease = (delay: number, dur = 1) => {
    const x = Math.max(0, Math.min(1, (t - delay) / dur))
    return 1 - Math.pow(1 - x, 3)
  }
  const SX = 40, SY = 40, CX = 300, CY = 330
  const iso = (x: number, y: number, z: number): [number, number] => [0.866*x - 0.866*y, 0.5*x + 0.5*y - z]
  const pt = (x: number, y: number, z: number): [number, number] => {
    const [a, b] = iso(x, y, z); return [CX + a*SX, CY + b*SY]
  }
  const pts = (arr: [number,number,number][]) => arr.map(([x,y,z]) => pt(x,y,z).join(',')).join(' ')
  const fly = (delay: number, amount = 4) => {
    const pv = ease(delay, 0.9)
    return { dz: (1 - pv) * amount, op: Math.min(1, pv * 3) }
  }
  const topFace = (x0: number, y0: number, z: number, x1: number, y1: number) =>
    pts([[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]])
  const frontFace = (x0: number, x1: number, y: number, z0: number, z1: number) =>
    pts([[x0,y,z0],[x1,y,z0],[x1,y,z1],[x0,y,z1]])
  const sideFace = (x: number, y0: number, y1: number, z0: number, z1: number) =>
    pts([[x,y0,z0],[x,y1,z0],[x,y1,z1],[x,y0,z1]])

  return (
    <div style={{ position: 'relative', height: '100%', minHeight: 500 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, #15181F 0%, #0A0D12 70%)',
        border: '1px solid rgba(232,230,225,0.08)',
        overflow: 'hidden',
      }}>
        <svg viewBox="0 0 600 600" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="ht" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4a3c2e"/><stop offset="1" stopColor="#2d231a"/>
            </linearGradient>
            <linearGradient id="hf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a2f23"/><stop offset="1" stopColor="#1c1510"/>
            </linearGradient>
            <linearGradient id="hs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2d241c"/><stop offset="1" stopColor="#14100a"/>
            </linearGradient>
            <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#F0C878"/><stop offset="1" stopColor="#A07832"/>
            </linearGradient>
            <radialGradient id="hgl" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#E4B668" stopOpacity="0.6"/>
              <stop offset="1" stopColor="#E4B668" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <g opacity="0.2" stroke="#3a3a40" strokeWidth="0.5">
            {Array.from({length:11}).map((_,i)=>{ const [x1,y1]=pt(i-3,-2,0),[x2,y2]=pt(i-3,5,0); return <line key={'a'+i} x1={x1} y1={y1} x2={x2} y2={y2}/> })}
            {Array.from({length:11}).map((_,i)=>{ const [x1,y1]=pt(-3,i-2,0),[x2,y2]=pt(5,i-2,0); return <line key={'b'+i} x1={x1} y1={y1} x2={x2} y2={y2}/> })}
          </g>
          {(()=>{ const [sx,sy]=pt(0,0,0),[ex,ey]=pt(4,2,0); return <ellipse cx={(sx+ex)/2} cy={(sy+ey)/2+4} rx="110" ry="22" fill="#000" opacity={0.3*ease(1.5,1)}/> })()}
          {(()=>{ const f=fly(1.5); return (<g opacity={f.op} transform={`translate(0,${-f.dz*SY})`}><polygon points={topFace(0,0,0.15,4,2)} fill="url(#ht)" stroke="#000" strokeWidth="0.3"/><polygon points={frontFace(0,4,0,0,0.15)} fill="url(#hf)" stroke="#000" strokeWidth="0.3"/><polygon points={sideFace(4,0,2,0,0.15)} fill="url(#hs)" stroke="#000" strokeWidth="0.3"/></g>) })()}
          {(()=>{ const f=fly(0); return (<g opacity={f.op} transform={`translate(0,${-f.dz*SY})`}><polygon points={pts([[0,2,0.15],[4,2,0.15],[4,2,5],[0,2,5]])} fill="url(#hs)" stroke="#000" strokeWidth="0.3"/></g>) })()}
          {(()=>{ const f=fly(0.5); return (<g opacity={f.op} transform={`translate(0,${-f.dz*SY})`}><polygon points={pts([[0,0,0.15],[0,2,0.15],[0,2,5],[0,0,5]])} fill="url(#hf)" stroke="#000" strokeWidth="0.3"/></g>) })()}
          {(()=>{ const f=fly(1.0); return (<g opacity={f.op} transform={`translate(0,${-f.dz*SY})`}><polygon points={pts([[4,0,0.15],[4,2,0.15],[4,2,5],[4,0,5]])} fill="url(#hs)" stroke="#000" strokeWidth="0.3"/></g>) })()}
          {(()=>{ const f=fly(2.0); return (<g opacity={f.op*0.9} transform={`translate(0,${-f.dz*SY})`}><polygon points={topFace(0,0,2.5,4,2)} fill="url(#ht)" stroke="#000" strokeWidth="0.3" opacity="0.8"/></g>) })()}
          {(()=>{ const f=fly(2.5); return (<g opacity={f.op} transform={`translate(0,${-f.dz*SY})`}><polygon points={topFace(0,0,5.15,4,2)} fill="url(#ht)" stroke="#000" strokeWidth="0.3"/><polygon points={frontFace(0,4,0,5,5.15)} fill="url(#hf)" stroke="#000" strokeWidth="0.3"/><polygon points={sideFace(4,0,2,5,5.15)} fill="url(#hs)" stroke="#000" strokeWidth="0.3"/></g>) })()}
          {(()=>{ const f=fly(3.0); return (<g opacity={f.op} transform={`translate(0,${-f.dz*SY})`}><polygon points={pts([[0,0,0.15],[2,0,0.15],[2,0,5],[0,0,5]])} fill="url(#hf)" stroke="#000" strokeWidth="0.3"/></g>) })()}
          {(()=>{ const f=fly(3.5); return (<g opacity={f.op} transform={`translate(0,${-f.dz*SY})`}><polygon points={pts([[2,0,0.15],[4,0,0.15],[4,0,5],[2,0,5]])} fill="url(#hf)" stroke="#000" strokeWidth="0.3"/></g>) })()}
          {(()=>{
            const op=ease(4.0,0.5)
            const [h1x,h1y]=pt(1.7,0,2.2),[h1x2,h1y2]=pt(1.7,0,2.8)
            const [h2x,h2y]=pt(2.3,0,2.2),[h2x2,h2y2]=pt(2.3,0,2.8)
            return (<g opacity={op}><line x1={h1x} y1={h1y} x2={h1x2} y2={h1y2} stroke="url(#hg)" strokeWidth="3.5" strokeLinecap="round"/><line x1={h2x} y1={h2y} x2={h2x2} y2={h2y2} stroke="url(#hg)" strokeWidth="3.5" strokeLinecap="round"/></g>)
          })()}
          {(()=>{
            const op=ease(4.5,0.5)
            const corners:[number,number,number][] = [[0,0,5],[4,0,5],[4,2,5],[0,2,5],[0,0,0.15],[4,0,0.15]]
            return (<g opacity={op}>{corners.map(([x,y,z],i)=>{ const [px,py]=pt(x,y,z); return <g key={i}><circle cx={px} cy={py} r="8" fill="url(#hgl)"/><circle cx={px} cy={py} r="1.8" fill="#F0C878"/></g> })}</g>)
          })()}
        </svg>
        <div style={{ position:'absolute', top:20, left:20, display:'flex', alignItems:'center', gap:10, padding:'8px 14px', background:'rgba(10,13,18,0.7)', border:'1px solid rgba(232,230,225,0.08)', fontSize:11, color:'rgba(232,230,225,0.65)', backdropFilter:'blur(8px)' }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#7AC07A' }}/>
          <span>Мастер Улугбек · сборка комода</span>
        </div>
        <div style={{ position:'absolute', bottom:24, left:24, right:24 }}>
          <div style={{ fontSize:10, color:'#E4B668', letterSpacing:'0.14em', textTransform:'uppercase' }}>В процессе</div>
          <div style={{ fontFamily:'var(--font-heading)', fontSize:20, fontWeight:300, fontStyle:'italic', marginTop:4, color:'#E8E6E1' }}>
            Комод «Бухара» · дуб · латунная фурнитура
          </div>
        </div>
      </div>
    </div>
  )
}
