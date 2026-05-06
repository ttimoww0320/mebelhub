// Isometric furniture illustrations — one component per work
// Uses the same iso projection as the hero animation

const WI_iso = (x, y, z) => [0.866*x - 0.866*y, 0.5*x + 0.5*y - z];
const WI_pt = (cx, cy, sx, sy, x, y, z) => {
  const [a, b] = WI_iso(x, y, z);
  return [cx + a*sx, cy + b*sy];
};
const WI_pts = (cx, cy, sx, sy, arr) => arr.map(([x,y,z]) => {
  const [px, py] = WI_pt(cx, cy, sx, sy, x, y, z);
  return `${px},${py}`;
}).join(' ');

// Shared SVG gradient defs — inject once per thumb
const WIDefs = ({ id, palette }) => {
  const [c1, c2, c3] = palette;
  return (
    <defs>
      <linearGradient id={`${id}_top`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={c3} stopOpacity="0.4"/>
        <stop offset="0.5" stopColor={c2}/>
        <stop offset="1" stopColor={c1}/>
      </linearGradient>
      <linearGradient id={`${id}_front`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={c2}/>
        <stop offset="1" stopColor={c1}/>
      </linearGradient>
      <linearGradient id={`${id}_side`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={c1}/>
        <stop offset="1" stopColor="#000"/>
      </linearGradient>
      <linearGradient id={`${id}_gold`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F0C878"/>
        <stop offset="1" stopColor="#A07832"/>
      </linearGradient>
      <radialGradient id={`${id}_glow`} cx="0.5" cy="0.5" r="0.6">
        <stop offset="0" stopColor={c3} stopOpacity="0.3"/>
        <stop offset="1" stopColor={c1} stopOpacity="0"/>
      </radialGradient>
    </defs>
  );
};

// Wrap an SVG figure in the shared thumb frame
const WIFrame = ({ work, children }) => {
  const id = `wi_${work.id}`;
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '4/5',
      background: `linear-gradient(170deg, ${work.palette[1]} 0%, ${work.palette[0]} 70%, #000 100%)`,
      overflow: 'hidden',
    }}>
      <svg viewBox="0 0 600 750" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
        <WIDefs id={id} palette={work.palette}/>
        {/* Ambient glow */}
        <ellipse cx="300" cy="380" rx="260" ry="180" fill={`url(#${id}_glow)`}/>
        {/* Grid floor */}
        <g opacity="0.08" stroke={work.palette[2]} strokeWidth="0.5">
          {Array.from({length: 9}).map((_, i) => {
            const [x1,y1] = WI_pt(300, 560, 55, 55, i-4, -3, 0);
            const [x2,y2] = WI_pt(300, 560, 55, 55, i-4, 5, 0);
            return <line key={'gx'+i} x1={x1} y1={y1} x2={x2} y2={y2}/>;
          })}
          {Array.from({length: 9}).map((_, i) => {
            const [x1,y1] = WI_pt(300, 560, 55, 55, -4, i-3, 0);
            const [x2,y2] = WI_pt(300, 560, 55, 55, 4, i-3, 0);
            return <line key={'gy'+i} x1={x1} y1={y1} x2={x2} y2={y2}/>;
          })}
        </g>
        {children({ id, cx: 300, cy: 560, sx: 55, sy: 55 })}
        {/* Film grain overlay */}
        <rect width="600" height="750" fill={work.palette[2]} opacity="0.02"/>
      </svg>
    </div>
  );
};

// Helper: draw a box with top/front/side faces
const WIBox = ({ id, cx, cy, sx, sy, x0, x1, y0, y1, z0, z1, stroke = "#000", strokeWidth = 0.4 }) => {
  const top = WI_pts(cx, cy, sx, sy, [[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]]);
  const front = WI_pts(cx, cy, sx, sy, [[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]]);
  const side = WI_pts(cx, cy, sx, sy, [[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]]);
  return (
    <g>
      <polygon points={front} fill={`url(#${id}_front)`} stroke={stroke} strokeWidth={strokeWidth}/>
      <polygon points={side} fill={`url(#${id}_side)`} stroke={stroke} strokeWidth={strokeWidth}/>
      <polygon points={top} fill={`url(#${id}_top)`} stroke={stroke} strokeWidth={strokeWidth}/>
    </g>
  );
};

// ————— Illustrations —————

const WIDresser = ({ work }) => (
  <WIFrame work={work}>{({ id, cx, cy, sx, sy }) => {
    const c = work.palette;
    // Dresser: 4 drawers, legs
    return (
      <g>
        {/* Legs */}
        {[[0.3, 0.3], [2.7, 0.3], [0.3, 1.7], [2.7, 1.7]].map(([x, y], i) => (
          <polygon key={'l'+i} points={WI_pts(cx, cy, sx, sy, [[x-0.08,y-0.08,0],[x+0.08,y-0.08,0],[x+0.08,y+0.08,0],[x-0.08,y+0.08,0],[x-0.08,y+0.08,0.4],[x+0.08,y+0.08,0.4],[x+0.08,y-0.08,0.4],[x-0.08,y-0.08,0.4]])} fill={c[0]} stroke="#000" strokeWidth="0.3"/>
        ))}
        {/* Main body */}
        <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.2} x1={2.8} y0={0.2} y1={1.8} z0={0.4} z1={2.8}/>
        {/* Drawer separators */}
        {[1.0, 1.6, 2.2].map((z, i) => {
          const p1 = WI_pt(cx, cy, sx, sy, 0.2, 0.2, z);
          const p2 = WI_pt(cx, cy, sx, sy, 2.8, 0.2, z);
          return <line key={'sep'+i} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#000" strokeWidth="0.5" opacity="0.6"/>;
        })}
        {/* Gold handles */}
        {[0.7, 1.3, 1.9, 2.5].map((z, i) => {
          const [h1x, h1y] = WI_pt(cx, cy, sx, sy, 1.1, 0.2, z);
          const [h2x, h2y] = WI_pt(cx, cy, sx, sy, 1.9, 0.2, z);
          return (
            <g key={'h'+i}>
              <line x1={h1x} y1={h1y} x2={h2x} y2={h2y} stroke={`url(#${id}_gold)`} strokeWidth="2.2" strokeLinecap="round"/>
              <circle cx={h1x} cy={h1y} r="1.8" fill="#F0C878"/>
              <circle cx={h2x} cy={h2y} r="1.8" fill="#F0C878"/>
            </g>
          );
        })}
      </g>
    );
  }}</WIFrame>
);

const WIWardrobe = ({ work }) => (
  <WIFrame work={work}>{({ id, cx, cy, sx, sy }) => (
    <g>
      {/* Tall wardrobe */}
      <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.1} x1={3.2} y0={0.2} y1={1.5} z0={0} z1={5.2}/>
      {/* Door split line */}
      {(() => {
        const p1 = WI_pt(cx, cy, sx, sy, 1.65, 0.2, 0);
        const p2 = WI_pt(cx, cy, sx, sy, 1.65, 0.2, 5.2);
        return <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#000" strokeWidth="0.6" opacity="0.7"/>;
      })()}
      {/* Horizontal grain lines */}
      {[1.2, 2.4, 3.6, 4.4].map((z, i) => {
        const p1 = WI_pt(cx, cy, sx, sy, 0.1, 0.2, z);
        const p2 = WI_pt(cx, cy, sx, sy, 3.2, 0.2, z);
        return <line key={'g'+i} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke={work.palette[2]} strokeWidth="0.3" opacity="0.25"/>;
      })}
      {/* Gold vertical handles */}
      {[1.45, 1.85].map((x, i) => {
        const [x1, y1] = WI_pt(cx, cy, sx, sy, x, 0.2, 2.2);
        const [x2, y2] = WI_pt(cx, cy, sx, sy, x, 0.2, 3.2);
        return <line key={'h'+i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#${id}_gold)`} strokeWidth="2.5" strokeLinecap="round"/>;
      })}
    </g>
  )}</WIFrame>
);

const WITable = ({ work }) => (
  <WIFrame work={work}>{({ id, cx, cy, sx, sy }) => {
    const c = work.palette;
    return (
      <g>
        {/* Legs (4 slim gold legs) */}
        {[[0.4, 0.3], [3.3, 0.3], [0.4, 1.8], [3.3, 1.8]].map(([x, y], i) => {
          const top = WI_pt(cx, cy, sx, sy, x, y, 2.2);
          const bot = WI_pt(cx, cy, sx, sy, x, y, 0);
          return <line key={'l'+i} x1={top[0]} y1={top[1]} x2={bot[0]} y2={bot[1]} stroke={`url(#${id}_gold)`} strokeWidth="3" strokeLinecap="square"/>;
        })}
        {/* Slab tabletop */}
        <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.1} x1={3.6} y0={0.1} y1={2.0} z0={2.2} z1={2.45}/>
        {/* River epoxy line */}
        {(() => {
          const pts = [[0.1, 1.05, 2.45],[0.8, 1.0, 2.45],[1.5, 1.15, 2.45],[2.2, 0.95, 2.45],[3.0, 1.1, 2.45],[3.6, 1.0, 2.45]];
          const topPts = pts.map(p => WI_pt(cx, cy, sx, sy, ...p));
          const pathD = 'M' + topPts.map(p => p.join(',')).join(' L');
          return <path d={pathD} stroke={`url(#${id}_gold)`} strokeWidth="4" fill="none" opacity="0.7"/>;
        })()}
        {/* Vase on table */}
        {(() => {
          const [vx, vy] = WI_pt(cx, cy, sx, sy, 2.6, 1.0, 2.45);
          return (
            <g>
              <ellipse cx={vx} cy={vy - 28} rx="12" ry="6" fill={c[0]} stroke="#000" strokeWidth="0.3"/>
              <path d={`M${vx-10},${vy-28} L${vx-12},${vy-2} L${vx+12},${vy-2} L${vx+10},${vy-28} Z`} fill={`url(#${id}_side)`} stroke="#000" strokeWidth="0.3"/>
              {/* branches */}
              <path d={`M${vx-2},${vy-30} Q${vx-12},${vy-60} ${vx-18},${vy-85}`} stroke={c[2]} strokeWidth="1" fill="none" opacity="0.7"/>
              <path d={`M${vx+2},${vy-30} Q${vx+8},${vy-55} ${vx+14},${vy-75}`} stroke={c[2]} strokeWidth="1" fill="none" opacity="0.7"/>
            </g>
          );
        })()}
      </g>
    );
  }}</WIFrame>
);

const WISofa = ({ work }) => (
  <WIFrame work={work}>{({ id, cx, cy, sx, sy }) => (
    <g>
      {/* Legs */}
      {[[0.25, 0.4], [3.45, 0.4], [0.25, 1.6], [3.45, 1.6]].map(([x, y], i) => {
        const top = WI_pt(cx, cy, sx, sy, x, y, 0.3);
        const bot = WI_pt(cx, cy, sx, sy, x, y, 0);
        return <line key={'l'+i} x1={top[0]} y1={top[1]} x2={bot[0]} y2={bot[1]} stroke={`url(#${id}_gold)`} strokeWidth="3"/>;
      })}
      {/* Base */}
      <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.2} x1={3.5} y0={0.3} y1={1.8} z0={0.3} z1={0.9}/>
      {/* Back cushion */}
      <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.2} x1={3.5} y0={1.4} y1={1.8} z0={0.9} z1={2.2}/>
      {/* Arms */}
      <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.2} x1={0.5} y0={0.3} y1={1.8} z0={0.9} z1={1.6}/>
      <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={3.2} x1={3.5} y0={0.3} y1={1.8} z0={0.9} z1={1.6}/>
      {/* Seat cushion divider */}
      {(() => {
        const p1 = WI_pt(cx, cy, sx, sy, 1.85, 0.3, 0.9);
        const p2 = WI_pt(cx, cy, sx, sy, 1.85, 1.4, 0.9);
        return <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#000" strokeWidth="0.6" opacity="0.5"/>;
      })()}
      {/* Throw pillows */}
      {[0.9, 2.6].map((x, i) => {
        const [px, py] = WI_pt(cx, cy, sx, sy, x, 1.1, 0.95);
        return <ellipse key={'p'+i} cx={px} cy={py - 12} rx="24" ry="14" fill={work.palette[2]} opacity="0.35" stroke="#000" strokeWidth="0.3"/>;
      })}
    </g>
  )}</WIFrame>
);

const WIKitchen = ({ work }) => (
  <WIFrame work={work}>{({ id, cx, cy, sx, sy }) => {
    const c = work.palette;
    return (
      <g>
        {/* Lower cabinets */}
        <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0} x1={4} y0={0.2} y1={1.3} z0={0} z1={1.8}/>
        {/* Countertop */}
        <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={-0.1} x1={4.1} y0={0.15} y1={1.35} z0={1.8} z1={1.95}/>
        {/* Upper cabinets */}
        <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0} x1={4} y0={1.0} y1={1.3} z0={3.0} z1={4.8}/>
        {/* Cabinet divisions (vertical lines on front) */}
        {[1.0, 2.0, 3.0].map((x, i) => {
          const p1 = WI_pt(cx, cy, sx, sy, x, 0.2, 0);
          const p2 = WI_pt(cx, cy, sx, sy, x, 0.2, 1.8);
          const p3 = WI_pt(cx, cy, sx, sy, x, 1.0, 3.0);
          const p4 = WI_pt(cx, cy, sx, sy, x, 1.0, 4.8);
          return (
            <g key={'d'+i}>
              <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#000" strokeWidth="0.5" opacity="0.6"/>
              <line x1={p3[0]} y1={p3[1]} x2={p4[0]} y2={p4[1]} stroke="#000" strokeWidth="0.5" opacity="0.6"/>
            </g>
          );
        })}
        {/* Drawer separator */}
        {(() => {
          const p1 = WI_pt(cx, cy, sx, sy, 0, 0.2, 0.6);
          const p2 = WI_pt(cx, cy, sx, sy, 4, 0.2, 0.6);
          return <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#000" strokeWidth="0.4" opacity="0.5"/>;
        })()}
        {/* Gold handles */}
        {[0.5, 1.5, 2.5, 3.5].map((x, i) => {
          const [h1x, h1y] = WI_pt(cx, cy, sx, sy, x - 0.15, 0.2, 1.2);
          const [h2x, h2y] = WI_pt(cx, cy, sx, sy, x + 0.15, 0.2, 1.2);
          const [hh1x, hh1y] = WI_pt(cx, cy, sx, sy, x - 0.15, 1.0, 3.9);
          const [hh2x, hh2y] = WI_pt(cx, cy, sx, sy, x + 0.15, 1.0, 3.9);
          return (
            <g key={'h'+i}>
              <line x1={h1x} y1={h1y} x2={h2x} y2={h2y} stroke={`url(#${id}_gold)`} strokeWidth="2" strokeLinecap="round"/>
              <line x1={hh1x} y1={hh1y} x2={hh2x} y2={hh2y} stroke={`url(#${id}_gold)`} strokeWidth="2" strokeLinecap="round"/>
            </g>
          );
        })}
        {/* Sink recess */}
        {(() => {
          const p = WI_pt(cx, cy, sx, sy, 1.5, 0.75, 1.95);
          return (
            <g>
              <ellipse cx={p[0]} cy={p[1]} rx="28" ry="14" fill="#000" opacity="0.5"/>
              <circle cx={p[0]} cy={p[1] - 12} r="2" fill={`url(#${id}_gold)`}/>
              <line x1={p[0]} y1={p[1] - 14} x2={p[0]} y2={p[1] - 22} stroke={`url(#${id}_gold)`} strokeWidth="1.5"/>
            </g>
          );
        })()}
      </g>
    );
  }}</WIFrame>
);

const WIBed = ({ work }) => (
  <WIFrame work={work}>{({ id, cx, cy, sx, sy }) => (
    <g>
      {/* Bed frame */}
      <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.2} x1={3.4} y0={0.2} y1={2.3} z0={0.2} z1={0.8}/>
      {/* Mattress */}
      <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.25} x1={3.35} y0={0.25} y1={2.25} z0={0.8} z1={1.2}/>
      {/* Headboard */}
      <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.1} x1={3.5} y0={2.15} y1={2.4} z0={0.2} z1={3.0}/>
      {/* Headboard tufting — gold dots */}
      {[0.7, 1.3, 1.9, 2.5, 3.1].map((x, i) => {
        const [px, py] = WI_pt(cx, cy, sx, sy, x, 2.15, 2.3);
        return <circle key={'t'+i} cx={px} cy={py} r="2" fill={`url(#${id}_gold)`}/>;
      })}
      {/* Pillows */}
      {[1.0, 2.6].map((x, i) => {
        const [px, py] = WI_pt(cx, cy, sx, sy, x, 2.0, 1.2);
        return (
          <ellipse key={'pi'+i} cx={px} cy={py - 10} rx="32" ry="14" fill={work.palette[2]} opacity="0.45" stroke="#000" strokeWidth="0.3"/>
        );
      })}
      {/* Blanket fold line */}
      {(() => {
        const p1 = WI_pt(cx, cy, sx, sy, 0.25, 1.2, 1.2);
        const p2 = WI_pt(cx, cy, sx, sy, 3.35, 1.2, 1.2);
        return <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#000" strokeWidth="0.4" opacity="0.4"/>;
      })()}
    </g>
  )}</WIFrame>
);

const WIShelf = ({ work }) => (
  <WIFrame work={work}>{({ id, cx, cy, sx, sy }) => {
    const c = work.palette;
    return (
      <g>
        {/* Side panels */}
        <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.2} x1={0.4} y0={0.3} y1={1.3} z0={0} z1={5.0}/>
        <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={3.0} x1={3.2} y0={0.3} y1={1.3} z0={0} z1={5.0}/>
        {/* Shelves */}
        {[0, 1.2, 2.4, 3.6, 4.8].map((z, i) => (
          <WIBox key={'sh'+i} id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.2} x1={3.2} y0={0.3} y1={1.3} z0={z} z1={z + 0.15}/>
        ))}
        {/* Books on middle shelves */}
        {[1.35, 2.55].map((z, shi) => (
          <g key={'bk'+shi}>
            {[0.5, 0.75, 1.0, 1.3, 1.65, 2.0, 2.3, 2.6, 2.85].map((x, i) => {
              const h = 0.7 + ((i * 31 + shi * 17) % 35) / 100;
              const col = [c[0], c[2], '#2a1a0a', '#1a2a3a'][i % 4];
              return <WIBox key={'b'+i} id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={x} x1={x + 0.2} y0={0.5} y1={1.1} z0={z} z1={z + h}/>;
            })}
          </g>
        ))}
        {/* Top accent: vase */}
        {(() => {
          const [vx, vy] = WI_pt(cx, cy, sx, sy, 1.7, 0.8, 4.95);
          return (
            <g>
              <path d={`M${vx-8},${vy-35} L${vx-10},${vy-2} L${vx+10},${vy-2} L${vx+8},${vy-35} Z`} fill={`url(#${id}_gold)`}/>
            </g>
          );
        })()}
      </g>
    );
  }}</WIFrame>
);

const WICabinet = ({ work }) => (
  <WIFrame work={work}>{({ id, cx, cy, sx, sy }) => (
    <g>
      {/* Legs */}
      {[[0.3, 0.3], [3.0, 0.3], [0.3, 1.6], [3.0, 1.6]].map(([x, y], i) => (
        <polygon key={'l'+i} points={WI_pts(cx, cy, sx, sy, [[x-0.06,y-0.06,0],[x+0.06,y-0.06,0],[x+0.06,y+0.06,0],[x-0.06,y+0.06,0],[x-0.06,y+0.06,0.5],[x+0.06,y+0.06,0.5],[x+0.06,y-0.06,0.5],[x-0.06,y-0.06,0.5]])} fill={work.palette[0]} stroke="#000" strokeWidth="0.3"/>
      ))}
      {/* Cabinet body */}
      <WIBox id={id} cx={cx} cy={cy} sx={sx} sy={sy} x0={0.2} x1={3.1} y0={0.2} y1={1.7} z0={0.5} z1={2.2}/>
      {/* Door split */}
      {(() => {
        const p1 = WI_pt(cx, cy, sx, sy, 1.65, 0.2, 0.5);
        const p2 = WI_pt(cx, cy, sx, sy, 1.65, 0.2, 2.2);
        return <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#000" strokeWidth="0.6"/>;
      })()}
      {/* Panel insets (doors with beveled inner frame) */}
      {[0, 1].map(i => {
        const x0 = 0.35 + i * 1.45;
        const x1 = 1.45 + i * 1.45;
        return (
          <polygon key={'dp'+i} points={WI_pts(cx, cy, sx, sy, [[x0, 0.2, 0.7],[x1, 0.2, 0.7],[x1, 0.2, 2.0],[x0, 0.2, 2.0]])} fill="none" stroke={work.palette[2]} strokeWidth="0.5" opacity="0.5"/>
        );
      })}
      {/* Gold knobs */}
      {[1.5, 1.8].map((x, i) => {
        const [px, py] = WI_pt(cx, cy, sx, sy, x, 0.2, 1.35);
        return <circle key={'k'+i} cx={px} cy={py} r="3" fill={`url(#${id}_gold)`} stroke="#000" strokeWidth="0.3"/>;
      })}
      {/* Top accessory: leather-bound book stack */}
      {(() => {
        const [bx, by] = WI_pt(cx, cy, sx, sy, 2.5, 0.9, 2.2);
        return (
          <g>
            <rect x={bx - 16} y={by - 14} width="32" height="5" fill={work.palette[2]} stroke="#000" strokeWidth="0.3"/>
            <rect x={bx - 14} y={by - 19} width="28" height="5" fill={`url(#${id}_gold)`} opacity="0.8"/>
            <rect x={bx - 18} y={by - 24} width="36" height="5" fill={work.palette[0]} stroke="#000" strokeWidth="0.3"/>
          </g>
        );
      })()}
    </g>
  )}</WIFrame>
);

// Router: pick illustration based on work.category
const WORK_ILLUSTRATIONS = {
  dresser: WIDresser,
  wardrobe: WIWardrobe,
  table: WITable,
  sofa: WISofa,
  kitchen: WIKitchen,
  bed: WIBed,
  shelf: WIShelf,
  cabinet: WICabinet,
  chair: WICabinet, // fallback
};

const WorkIllustration = ({ work }) => {
  const Comp = WORK_ILLUSTRATIONS[work.category] || WICabinet;
  return <Comp work={work}/>;
};

window.WorkIllustration = WorkIllustration;
