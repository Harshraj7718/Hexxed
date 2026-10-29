type Shape = { t: 'path' | 'circle' | 'rect'; d?: string; cx?: number; cy?: number; r?: number; x?: number; y?: number; w?: number; h?: number; rx?: number }

const p = (d: string): Shape => ({ t: 'path', d })
const c = (cx: number, cy: number, r: number): Shape => ({ t: 'circle', cx, cy, r })
const rc = (x: number, y: number, w: number, h: number, rx = 0): Shape => ({ t: 'rect', x, y, w, h, rx })

/** Line-art illustrations that draw themselves in. blob = the yellow shape behind the drawing. */
const ART: Record<string, { blob: [number, number, number]; shapes: Shape[] }> = {
  // Parcel with motion lines: shipping
  parcel: {
    blob: [130, 140, 78],
    shapes: [
      p('M50 100 L130 64 L210 100 L210 180 L130 216 L50 180 Z'),
      p('M50 100 L130 138 L210 100'),
      p('M130 138 V216'),
      p('M90 82 L170 118 V150 L90 114 Z'),
      p('M14 60h40M2 82h34M20 104h22'),
    ],
  },
  // Jar with a question mark: FAQ
  faq: {
    blob: [130, 140, 80],
    shapes: [
      rc(62, 96, 136, 24, 4),
      p('M70 120 h120 v84 a14 14 0 0 1 -14 14 h-92 a14 14 0 0 1 -14 -14z'),
      p('M104 150 a22 22 0 1 1 33 19 c-7 4 -8 8 -8 15'),
      p('M129 198 v.5'),
      p('M214 70l6 12 12 6-12 6-6 12-6-12-12-6 12-6z'),
    ],
  },
  // Envelope with a chat bubble: contact
  mail: {
    blob: [120, 150, 76],
    shapes: [
      rc(36, 100, 168, 112, 8),
      p('M36 108 L120 168 L204 108'),
      p('M150 34 h70 a10 10 0 0 1 10 10 v34 a10 10 0 0 1 -10 10 h-34 l-16 16 v-16 h-20 a10 10 0 0 1 -10 -10 v-34 a10 10 0 0 1 10 -10z'),
      p('M158 56h54M158 68h34'),
    ],
  },
  // Comb and scissors: story
  barber: {
    blob: [130, 140, 80],
    shapes: [
      rc(30, 54, 150, 26, 6),
      p('M44 80v34M64 80v34M84 80v34M104 80v34M124 80v34M144 80v34M164 80v34'),
      p('M80 232 L178 168'),
      p('M80 168 L178 232'),
      c(196, 160, 18),
      c(196, 240, 18),
    ],
  },
  // Jar, tube and sparkle: catalog
  shelf: {
    blob: [130, 150, 84],
    shapes: [
      rc(30, 130, 110, 20, 4),
      p('M36 150 h98 v62 a12 12 0 0 1 -12 12 h-74 a12 12 0 0 1 -12 -12z'),
      p('M172 90 h40 l-4 40 h-32z'),
      p('M168 130 h48 v92 a8 8 0 0 1 -8 8 h-32 a8 8 0 0 1 -8 -8z'),
      p('M70 180h30'),
      p('M60 52l6 14 14 6-14 6-6 14-6-14-14-6 14-6z'),
    ],
  },
}

export function Doodle({ v, className = '' }: { v: keyof typeof ART; className?: string }) {
  const a = ART[v]
  return (
    <svg className={('doodle ' + className).trim()} viewBox="0 0 260 260" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle className="doodle__blob" cx={a.blob[0]} cy={a.blob[1]} r={a.blob[2]} />
      <g className="doodle__ink">
        {a.shapes.map((s, i) => {
          const style = { animationDelay: 0.25 + i * 0.18 + 's' }
          if (s.t === 'circle') return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} pathLength={1} style={style} />
          if (s.t === 'rect') return <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} pathLength={1} style={style} />
          return <path key={i} d={s.d} pathLength={1} style={style} />
        })}
      </g>
    </svg>
  )
}
