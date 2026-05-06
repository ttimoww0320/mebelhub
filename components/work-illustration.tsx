'use client'

import { useEffect, useRef, useState } from 'react'
import type { Work } from '@/lib/mock-data'


// ---- SVG math ----
const iso = (x: number, y: number, z: number): [number, number] => [0.866*x - 0.866*y, 0.5*x + 0.5*y - z]
const wiPt = (cx: number, cy: number, sx: number, sy: number, x: number, y: number, z: number): [number, number] => {
  const [a, b] = iso(x, y, z); return [cx + a*sx, cy + b*sy]
}
const wiPts = (cx: number, cy: number, sx: number, sy: number, arr: [number,number,number][]) =>
  arr.map(([x,y,z]) => wiPt(cx,cy,sx,sy,x,y,z).join(',')).join(' ')

// ---- Animation helper ----
const EASE = 'cubic-bezier(0.16,1,0.3,1)'
const KF = `@keyframes wiA{from{transform:translateY(-38px);opacity:0}to{transform:translateY(0);opacity:1}}`
const ps = (i: number, on: boolean): React.CSSProperties =>
  on ? { animation: `wiA 0.72s ${EASE} ${i * 160}ms both` } : { opacity: 0 }

// ---- Frame ----
type FrameCtx = { id: string; cx: number; cy: number; sx: number; sy: number }
type FrameProps = { work: Work; children: (ctx: FrameCtx) => React.ReactNode }

function WIFrame({ work, children }: FrameProps) {
  const id = `wi_${work.id}`
  return (
    <div style={{ position:'relative', width:'100%', aspectRatio:'4/5', background:`linear-gradient(170deg,${work.palette[1]} 0%,${work.palette[0]} 70%,#000 100%)`, overflow:'hidden' }}>
      <svg viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" style={{ width:'100%', height:'100%', display:'block' }}>
        <defs>
          <style>{KF}</style>
          <linearGradient id={`${id}_top`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={work.palette[2]} stopOpacity="0.4"/>
            <stop offset="0.5" stopColor={work.palette[1]}/>
            <stop offset="1" stopColor={work.palette[0]}/>
          </linearGradient>
          <linearGradient id={`${id}_front`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={work.palette[1]}/><stop offset="1" stopColor={work.palette[0]}/>
          </linearGradient>
          <linearGradient id={`${id}_side`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={work.palette[0]}/><stop offset="1" stopColor="#000"/>
          </linearGradient>
          <linearGradient id={`${id}_gold`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F0C878"/><stop offset="1" stopColor="#A07832"/>
          </linearGradient>
          <radialGradient id={`${id}_glow`} cx="0.5" cy="0.5" r="0.6">
            <stop offset="0" stopColor={work.palette[2]} stopOpacity="0.3"/>
            <stop offset="1" stopColor={work.palette[0]} stopOpacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx="300" cy="380" rx="260" ry="180" fill={`url(#${id}_glow)`}/>
        <g opacity="0.08" stroke={work.palette[2]} strokeWidth="0.5">
          {Array.from({length:9}).map((_,i) => {
            const [x1,y1]=wiPt(300,560,55,55,i-4,-3,0), [x2,y2]=wiPt(300,560,55,55,i-4,5,0)
            return <line key={'gx'+i} x1={x1} y1={y1} x2={x2} y2={y2}/>
          })}
          {Array.from({length:9}).map((_,i) => {
            const [x1,y1]=wiPt(300,560,55,55,-4,i-3,0), [x2,y2]=wiPt(300,560,55,55,4,i-3,0)
            return <line key={'gy'+i} x1={x1} y1={y1} x2={x2} y2={y2}/>
          })}
        </g>
        {children({ id, cx:300, cy:560, sx:55, sy:55 })}
        <rect width="600" height="750" fill={work.palette[2]} opacity="0.02"/>
      </svg>
    </div>
  )
}

// ---- Box primitive ----
type BoxProps = { id:string; cx:number; cy:number; sx:number; sy:number; x0:number; x1:number; y0:number; y1:number; z0:number; z1:number; stroke?:string; strokeWidth?:number }
function WIBox({ id, cx, cy, sx, sy, x0, x1, y0, y1, z0, z1, stroke='#000', strokeWidth=0.4 }: BoxProps) {
  const top   = wiPts(cx,cy,sx,sy,[[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]])
  const front = wiPts(cx,cy,sx,sy,[[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]])
  const side  = wiPts(cx,cy,sx,sy,[[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]])
  return (
    <g>
      <polygon points={front} fill={`url(#${id}_front)`} stroke={stroke} strokeWidth={strokeWidth}/>
      <polygon points={side}  fill={`url(#${id}_side)`}  stroke={stroke} strokeWidth={strokeWidth}/>
      <polygon points={top}   fill={`url(#${id}_top)`}   stroke={stroke} strokeWidth={strokeWidth}/>
    </g>
  )
}

// ---- Illustrations ----
function WIDresser({ work, triggered=true }: { work:Work; triggered?:boolean }) {
  return (
    <WIFrame work={work}>{({ id, cx, cy, sx, sy }) => (
      <g>
        <g style={ps(0, triggered)}>
          {([[0.3,0.3],[2.7,0.3],[0.3,1.7],[2.7,1.7]] as [number,number][]).map(([x,y],i) => (
            <polygon key={'l'+i} points={wiPts(cx,cy,sx,sy,[[x-.08,y-.08,0],[x+.08,y-.08,0],[x+.08,y+.08,0],[x-.08,y+.08,0],[x-.08,y+.08,.4],[x+.08,y+.08,.4],[x+.08,y-.08,.4],[x-.08,y-.08,.4]])} fill={work.palette[0]} stroke="#000" strokeWidth="0.3"/>
          ))}
        </g>
        <g style={ps(1, triggered)}>
          <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.2} x1={2.8} y0={0.2} y1={1.8} z0={0.4} z1={2.8}/>
        </g>
        <g style={ps(2, triggered)}>
          {[1.0,1.6,2.2].map((z,i) => {
            const p1=wiPt(cx,cy,sx,sy,0.2,0.2,z), p2=wiPt(cx,cy,sx,sy,2.8,0.2,z)
            return <line key={'s'+i} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#000" strokeWidth="0.5" opacity="0.6"/>
          })}
        </g>
        <g style={ps(3, triggered)}>
          {[0.7,1.3,1.9,2.5].map((z,i) => {
            const [h1x,h1y]=wiPt(cx,cy,sx,sy,1.1,0.2,z), [h2x,h2y]=wiPt(cx,cy,sx,sy,1.9,0.2,z)
            return <g key={'h'+i}><line x1={h1x} y1={h1y} x2={h2x} y2={h2y} stroke={`url(#${id}_gold)`} strokeWidth="2.2" strokeLinecap="round"/><circle cx={h1x} cy={h1y} r="1.8" fill="#F0C878"/><circle cx={h2x} cy={h2y} r="1.8" fill="#F0C878"/></g>
          })}
        </g>
      </g>
    )}</WIFrame>
  )
}

function WIWardrobe({ work, triggered=true }: { work:Work; triggered?:boolean }) {
  return (
    <WIFrame work={work}>{({ id, cx, cy, sx, sy }) => (
      <g>
        <g style={ps(0, triggered)}>
          <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.1} x1={3.2} y0={0.2} y1={1.5} z0={0} z1={5.2}/>
        </g>
        <g style={ps(1, triggered)}>
          {(()=>{ const p1=wiPt(cx,cy,sx,sy,1.65,0.2,0), p2=wiPt(cx,cy,sx,sy,1.65,0.2,5.2); return <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#000" strokeWidth="0.6" opacity="0.7"/> })()}
        </g>
        <g style={ps(2, triggered)}>
          {[1.2,2.4,3.6,4.4].map((z,i) => {
            const p1=wiPt(cx,cy,sx,sy,0.1,0.2,z), p2=wiPt(cx,cy,sx,sy,3.2,0.2,z)
            return <line key={'g'+i} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke={work.palette[2]} strokeWidth="0.3" opacity="0.25"/>
          })}
        </g>
        <g style={ps(3, triggered)}>
          {[1.45,1.85].map((x,i) => {
            const [x1,y1]=wiPt(cx,cy,sx,sy,x,0.2,2.2), [x2,y2]=wiPt(cx,cy,sx,sy,x,0.2,3.2)
            return <line key={'h'+i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#${id}_gold)`} strokeWidth="2.5" strokeLinecap="round"/>
          })}
        </g>
      </g>
    )}</WIFrame>
  )
}

function WITable({ work, triggered=true }: { work:Work; triggered?:boolean }) {
  return (
    <WIFrame work={work}>{({ id, cx, cy, sx, sy }) => (
      <g>
        <g style={ps(0, triggered)}>
          {([[0.4,0.3],[3.3,0.3],[0.4,1.8],[3.3,1.8]] as [number,number][]).map(([x,y],i) => {
            const top=wiPt(cx,cy,sx,sy,x,y,2.2), bot=wiPt(cx,cy,sx,sy,x,y,0)
            return <line key={'l'+i} x1={top[0]} y1={top[1]} x2={bot[0]} y2={bot[1]} stroke={`url(#${id}_gold)`} strokeWidth="3" strokeLinecap="square"/>
          })}
        </g>
        <g style={ps(1, triggered)}>
          <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.1} x1={3.6} y0={0.1} y1={2.0} z0={2.2} z1={2.45}/>
        </g>
        <g style={ps(2, triggered)}>
          {(()=>{
            const pts: [number,number,number][] = [[0.1,1.05,2.45],[0.8,1.0,2.45],[1.5,1.15,2.45],[2.2,0.95,2.45],[3.0,1.1,2.45],[3.6,1.0,2.45]]
            const d = 'M' + pts.map(p => wiPt(cx,cy,sx,sy,...p).join(',')).join(' L')
            return <path d={d} stroke={`url(#${id}_gold)`} strokeWidth="4" fill="none" opacity="0.7"/>
          })()}
        </g>
        <g style={ps(3, triggered)}>
          {(()=>{
            const [vx,vy]=wiPt(cx,cy,sx,sy,2.6,1.0,2.45)
            return (<g><ellipse cx={vx} cy={vy-28} rx="12" ry="6" fill={work.palette[0]} stroke="#000" strokeWidth="0.3"/><path d={`M${vx-10},${vy-28} L${vx-12},${vy-2} L${vx+12},${vy-2} L${vx+10},${vy-28} Z`} fill={`url(#${id}_side)`} stroke="#000" strokeWidth="0.3"/><path d={`M${vx-2},${vy-30} Q${vx-12},${vy-60} ${vx-18},${vy-85}`} stroke={work.palette[2]} strokeWidth="1" fill="none" opacity="0.7"/><path d={`M${vx+2},${vy-30} Q${vx+8},${vy-55} ${vx+14},${vy-75}`} stroke={work.palette[2]} strokeWidth="1" fill="none" opacity="0.7"/></g>)
          })()}
        </g>
      </g>
    )}</WIFrame>
  )
}

function WISofa({ work, triggered=true }: { work:Work; triggered?:boolean }) {
  return (
    <WIFrame work={work}>{({ id, cx, cy, sx, sy }) => (
      <g>
        <g style={ps(0, triggered)}>
          {([[0.25,0.4],[3.45,0.4],[0.25,1.6],[3.45,1.6]] as [number,number][]).map(([x,y],i) => {
            const top=wiPt(cx,cy,sx,sy,x,y,0.3), bot=wiPt(cx,cy,sx,sy,x,y,0)
            return <line key={'l'+i} x1={top[0]} y1={top[1]} x2={bot[0]} y2={bot[1]} stroke={`url(#${id}_gold)`} strokeWidth="3"/>
          })}
        </g>
        <g style={ps(1, triggered)}>
          <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.2} x1={3.5} y0={0.3} y1={1.8} z0={0.3} z1={0.9}/>
        </g>
        <g style={ps(2, triggered)}>
          <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.2} x1={3.5} y0={1.4} y1={1.8} z0={0.9} z1={2.2}/>
        </g>
        <g style={ps(3, triggered)}>
          <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.2} x1={0.5} y0={0.3} y1={1.8} z0={0.9} z1={1.6}/>
          <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={3.2} x1={3.5} y0={0.3} y1={1.8} z0={0.9} z1={1.6}/>
        </g>
        <g style={ps(4, triggered)}>
          {[0.9,2.6].map((x,i) => {
            const [px,py]=wiPt(cx,cy,sx,sy,x,1.1,0.95)
            return <ellipse key={'p'+i} cx={px} cy={py-12} rx="24" ry="14" fill={work.palette[2]} opacity="0.35" stroke="#000" strokeWidth="0.3"/>
          })}
        </g>
      </g>
    )}</WIFrame>
  )
}

function WIKitchen({ work, triggered=true }: { work:Work; triggered?:boolean }) {
  return (
    <WIFrame work={work}>{({ id, cx, cy, sx, sy }) => (
      <g>
        <g style={ps(0, triggered)}>
          <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0} x1={4} y0={0.2} y1={1.3} z0={0} z1={1.8}/>
        </g>
        <g style={ps(1, triggered)}>
          <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={-.1} x1={4.1} y0={0.15} y1={1.35} z0={1.8} z1={1.95}/>
        </g>
        <g style={ps(2, triggered)}>
          <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0} x1={4} y0={1.0} y1={1.3} z0={3.0} z1={4.8}/>
        </g>
        <g style={ps(3, triggered)}>
          {[1.0,2.0,3.0].map((x,i) => {
            const p1=wiPt(cx,cy,sx,sy,x,0.2,0), p2=wiPt(cx,cy,sx,sy,x,0.2,1.8)
            const p3=wiPt(cx,cy,sx,sy,x,1.0,3.0), p4=wiPt(cx,cy,sx,sy,x,1.0,4.8)
            return <g key={'d'+i}><line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#000" strokeWidth="0.5" opacity="0.6"/><line x1={p3[0]} y1={p3[1]} x2={p4[0]} y2={p4[1]} stroke="#000" strokeWidth="0.5" opacity="0.6"/></g>
          })}
          {[0.5,1.5,2.5,3.5].map((x,i) => {
            const [h1x,h1y]=wiPt(cx,cy,sx,sy,x-.15,0.2,1.2), [h2x,h2y]=wiPt(cx,cy,sx,sy,x+.15,0.2,1.2)
            const [hh1x,hh1y]=wiPt(cx,cy,sx,sy,x-.15,1.0,3.9), [hh2x,hh2y]=wiPt(cx,cy,sx,sy,x+.15,1.0,3.9)
            return <g key={'h'+i}><line x1={h1x} y1={h1y} x2={h2x} y2={h2y} stroke={`url(#${id}_gold)`} strokeWidth="2" strokeLinecap="round"/><line x1={hh1x} y1={hh1y} x2={hh2x} y2={hh2y} stroke={`url(#${id}_gold)`} strokeWidth="2" strokeLinecap="round"/></g>
          })}
        </g>
        <g style={ps(4, triggered)}>
          {(()=>{ const p=wiPt(cx,cy,sx,sy,1.5,0.75,1.95); return (<g><ellipse cx={p[0]} cy={p[1]} rx="28" ry="14" fill="#000" opacity="0.5"/><circle cx={p[0]} cy={p[1]-12} r="2" fill={`url(#${id}_gold)`}/><line x1={p[0]} y1={p[1]-14} x2={p[0]} y2={p[1]-22} stroke={`url(#${id}_gold)`} strokeWidth="1.5"/></g>) })()}
        </g>
      </g>
    )}</WIFrame>
  )
}

function WIBed({ work, triggered=true }: { work:Work; triggered?:boolean }) {
  return (
    <WIFrame work={work}>{({ id, cx, cy, sx, sy }) => (
      <g>
        <g style={ps(0, triggered)}>
          <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.2} x1={3.4} y0={0.2} y1={2.3} z0={0.2} z1={0.8}/>
        </g>
        <g style={ps(1, triggered)}>
          <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.25} x1={3.35} y0={0.25} y1={2.25} z0={0.8} z1={1.2}/>
        </g>
        <g style={ps(2, triggered)}>
          <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.1} x1={3.5} y0={2.15} y1={2.4} z0={0.2} z1={3.0}/>
        </g>
        <g style={ps(3, triggered)}>
          {[0.7,1.3,1.9,2.5,3.1].map((x,i) => {
            const [px,py]=wiPt(cx,cy,sx,sy,x,2.15,2.3)
            return <circle key={'t'+i} cx={px} cy={py} r="2" fill={`url(#${id}_gold)`}/>
          })}
        </g>
        <g style={ps(4, triggered)}>
          {[1.0,2.6].map((x,i) => {
            const [px,py]=wiPt(cx,cy,sx,sy,x,2.0,1.2)
            return <ellipse key={'pi'+i} cx={px} cy={py-10} rx="32" ry="14" fill={work.palette[2]} opacity="0.45" stroke="#000" strokeWidth="0.3"/>
          })}
        </g>
      </g>
    )}</WIFrame>
  )
}

function WIShelf({ work, triggered=true }: { work:Work; triggered?:boolean }) {
  return (
    <WIFrame work={work}>{({ id, cx, cy, sx, sy }) => (
      <g>
        <g style={ps(0, triggered)}>
          <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.2} x1={0.4} y0={0.3} y1={1.3} z0={0} z1={5.0}/>
          <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={3.0} x1={3.2} y0={0.3} y1={1.3} z0={0} z1={5.0}/>
        </g>
        <g style={ps(1, triggered)}>
          {[0,1.2,2.4,3.6,4.8].map((z,i) => (
            <WIBox key={'sh'+i} id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.2} x1={3.2} y0={0.3} y1={1.3} z0={z} z1={z+0.15}/>
          ))}
        </g>
        <g style={ps(2, triggered)}>
          {[1.35,2.55].map((z,shi) => (
            <g key={'bk'+shi}>
              {[0.5,0.75,1.0,1.3,1.65,2.0,2.3,2.6,2.85].map((x,i) => {
                const h = 0.7 + ((i*31 + shi*17) % 35) / 100
                return <WIBox key={'b'+i} id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={x} x1={x+0.2} y0={0.5} y1={1.1} z0={z} z1={z+h}/>
              })}
            </g>
          ))}
        </g>
        <g style={ps(3, triggered)}>
          {(()=>{ const [vx,vy]=wiPt(cx,cy,sx,sy,1.7,0.8,4.95); return <path d={`M${vx-8},${vy-35} L${vx-10},${vy-2} L${vx+10},${vy-2} L${vx+8},${vy-35} Z`} fill={`url(#${id}_gold)`}/> })()}
        </g>
      </g>
    )}</WIFrame>
  )
}

function WICabinet({ work, triggered=true }: { work:Work; triggered?:boolean }) {
  return (
    <WIFrame work={work}>{({ id, cx, cy, sx, sy }) => (
      <g>
        <g style={ps(0, triggered)}>
          {([[0.3,0.3],[3.0,0.3],[0.3,1.6],[3.0,1.6]] as [number,number][]).map(([x,y],i) => (
            <polygon key={'l'+i} points={wiPts(cx,cy,sx,sy,[[x-.06,y-.06,0],[x+.06,y-.06,0],[x+.06,y+.06,0],[x-.06,y+.06,0],[x-.06,y+.06,.5],[x+.06,y+.06,.5],[x+.06,y-.06,.5],[x-.06,y-.06,.5]])} fill={work.palette[0]} stroke="#000" strokeWidth="0.3"/>
          ))}
        </g>
        <g style={ps(1, triggered)}>
          <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.2} x1={3.1} y0={0.2} y1={1.7} z0={0.5} z1={2.2}/>
        </g>
        <g style={ps(2, triggered)}>
          {(()=>{ const p1=wiPt(cx,cy,sx,sy,1.65,0.2,0.5), p2=wiPt(cx,cy,sx,sy,1.65,0.2,2.2); return <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#000" strokeWidth="0.6"/> })()}
          {[0,1].map(i => {
            const x0=0.35+i*1.45, x1=1.45+i*1.45
            return <polygon key={'dp'+i} points={wiPts(cx,cy,sx,sy,[[x0,0.2,0.7],[x1,0.2,0.7],[x1,0.2,2.0],[x0,0.2,2.0]])} fill="none" stroke={work.palette[2]} strokeWidth="0.5" opacity="0.5"/>
          })}
        </g>
        <g style={ps(3, triggered)}>
          {[1.5,1.8].map((x,i) => {
            const [px,py]=wiPt(cx,cy,sx,sy,x,0.2,1.35)
            return <circle key={'k'+i} cx={px} cy={py} r="3" fill={`url(#${id}_gold)`} stroke="#000" strokeWidth="0.3"/>
          })}
        </g>
        <g style={ps(4, triggered)}>
          {(()=>{
            const [bx,by]=wiPt(cx,cy,sx,sy,2.5,0.9,2.2)
            return <g><rect x={bx-16} y={by-14} width="32" height="5" fill={work.palette[2]} stroke="#000" strokeWidth="0.3"/><rect x={bx-14} y={by-19} width="28" height="5" fill={`url(#${id}_gold)`} opacity="0.8"/><rect x={bx-18} y={by-24} width="36" height="5" fill={work.palette[0]} stroke="#000" strokeWidth="0.3"/></g>
          })()}
        </g>
      </g>
    )}</WIFrame>
  )
}

// ---- Registry ----
const ILLUSTRATIONS: Record<string, (props:{ work:Work; triggered?:boolean }) => React.ReactElement> = {
  dresser: WIDresser, wardrobe: WIWardrobe, table: WITable, sofa: WISofa,
  kitchen: WIKitchen, bed: WIBed, shelf: WIShelf, cabinet: WICabinet, chair: WICabinet,
}

// Static version (always visible, used in craftsman profile tabs)
export function WorkIllustration({ work }: { work:Work }) {
  const Comp = ILLUSTRATIONS[work.category] ?? WICabinet
  return <Comp work={work} triggered={true}/>
}

// Animated version — triggers assembly when card scrolls into view
export function AnimatedWorkIllustration({ work }: { work:Work }) {
  const ref = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const Comp = ILLUSTRATIONS[work.category] ?? WICabinet
  return (
    <div ref={ref}>
      <Comp work={work} triggered={triggered}/>
    </div>
  )
}
