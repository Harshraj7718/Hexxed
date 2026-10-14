// HAXXED 100g jar + courier box — shared model builder (meters, y-up, base at y=0).
// Meshes and materials are named so OBJ/GLB exports carry readable part names.
import * as THREE from 'three'

export type JarVariant = {
  id: 'clay' | 'define' | 'cream'
  name: string
  line: string
  accent: string
  body: string
  lid: string
  product: string
  rough: number
  hold: number
  shine: number
}

export const VARIANTS: JarVariant[] = [
  { id: 'clay', name: 'CLAY POMADE', line: 'EXTREME HOLD / NATURAL FINISH', accent: '#4a3c34', body: '#cfcfcb', lid: '#f3f2ee', product: '#9a8a7c', rough: 0.55, hold: 5, shine: 3 },
  { id: 'define', name: 'DEFINE CREAM', line: '2X SOFTNESS & SMOOTHNESS', accent: '#2c7a6e', body: '#f1f1ed', lid: '#f6f5f1', product: '#eaf1ec', rough: 0.7, hold: 1, shine: 1 },
  { id: 'cream', name: 'CREAM POMADE', line: 'HIGH HOLD / HIGH SHINE', accent: '#4636a6', body: '#f1f1ed', lid: '#f6f5f1', product: '#e2dcf3', rough: 0.22, hold: 5, shine: 4 },
]

export type JarAssets = { logo: HTMLImageElement | null }

export async function loadJarAssets(base = '/'): Promise<JarAssets> {
  try {
    await Promise.all([
      document.fonts.load('150px "Permanent Marker"'),
      document.fonts.load('600 46px "Geist"'),
      document.fonts.load('400 46px "Geist"'),
    ])
  } catch {
    // Fonts are cosmetic for the canvas textures; fall back silently.
  }
  const logo = await new Promise<HTMLImageElement | null>(res => {
    const i = new Image()
    i.onload = () => res(i)
    i.onerror = () => res(null)
    i.src = base + 'assets/haxxed-logo.png'
  })
  return { logo }
}

const dots = (n: number, total = 5) => '●'.repeat(Math.round(n)) + '○'.repeat(total - Math.round(n))

function canvas2d(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')!] as const
}

function spacing(x: CanvasRenderingContext2D, v: string) {
  if ('letterSpacing' in x) (x as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = v
}

function labelCanvas(v: JarVariant) {
  const W = 4096, H = 360
  const [c, x] = canvas2d(W, H)
  x.fillStyle = v.body; x.fillRect(0, 0, W, H)
  x.textAlign = 'center'
  x.fillStyle = v.accent
  x.font = '150px "Permanent Marker", "Geist", sans-serif'
  x.fillText(v.name, W / 2, 175)
  x.fillStyle = '#26221f'
  x.font = '600 44px "Geist", sans-serif'
  spacing(x, '8px')
  x.fillText(v.line, W / 2, 250)
  x.font = '400 28px "Geist", sans-serif'
  x.fillText('NET WT. 100gms / 3.52oz', W / 2, 310)
  x.font = '600 30px "Geist", sans-serif'
  x.fillText('MADE WITH SIMPLE &', W * 0.79, 150)
  x.fillText('CLEAN INGREDIENTS', W * 0.79, 195)
  x.fillText('HOLD ' + dots(v.hold) + '   SHINE ' + dots(v.shine), W * 0.79, 255)
  x.font = '400 28px "Geist", sans-serif'
  ;['Water-soluble. No sulphates.', 'No parabens. Rinses clean', 'with plain water.'].forEach((t, i) => x.fillText(t, W * 0.21, 150 + i * 46))
  return c
}

function lidCanvas(v: JarVariant, logo: HTMLImageElement | null) {
  const S = 1024
  const [c, x] = canvas2d(S, S)
  x.fillStyle = v.lid; x.beginPath(); x.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2); x.fill()
  x.strokeStyle = v.accent; x.lineWidth = 5
  x.beginPath(); x.arc(S / 2, S / 2, S / 2 - 34, 0, Math.PI * 2); x.stroke()
  if (logo) { const w = 420, h = w * logo.height / logo.width; x.drawImage(logo, (S - w) / 2, 150, w, h) }
  x.textAlign = 'center'
  x.fillStyle = v.accent
  x.font = '120px "Permanent Marker", "Geist", sans-serif'
  const [a, b] = v.name.split(' ')
  x.fillText(a, S / 2, 545); x.fillText(b, S / 2, 665)
  x.fillStyle = '#26221f'
  x.font = '600 30px "Geist", sans-serif'
  spacing(x, '6px')
  x.fillText('HOLD ' + dots(v.hold) + '  SHINE ' + dots(v.shine), S / 2, 790)
  return c
}

function boxLabelCanvas(logo: HTMLImageElement | null) {
  const W = 1024, H = 640
  const [c, x] = canvas2d(W, H)
  x.fillStyle = '#f7f6f1'; x.fillRect(0, 0, W, H)
  x.strokeStyle = '#141412'; x.lineWidth = 10; x.strokeRect(20, 20, W - 40, H - 40)
  if (logo) { const w = 330, h = w * logo.height / logo.width; x.drawImage(logo, 60, 50, w, h) }
  x.fillStyle = '#FAF418'; x.fillRect(60, 250, W - 120, 120)
  x.fillStyle = '#141412'
  x.font = '600 74px "Geist", sans-serif'
  spacing(x, '4px')
  x.fillText('READY TO SHIP ✦', 86, 336)
  x.font = '400 34px "Geist", sans-serif'
  spacing(x, '1px')
  x.fillText('Fragile: good hair inside.', 64, 440)
  x.fillText('Free delivery · Made in India', 64, 492)
  let bx = 640
  for (let i = 0; i < 48; i++) { const w = [3, 6, 9][(i * 7) % 3]; x.fillRect(bx, 420, w, 150); bx += w + 4; if (bx > W - 70) break }
  return c
}

function tapeCanvas() {
  const W = 2048, H = 128
  const [c, x] = canvas2d(W, H)
  x.fillStyle = '#FAF418'; x.fillRect(0, 0, W, H)
  x.fillStyle = '#141412'
  x.font = '600 56px "Geist", sans-serif'
  spacing(x, '10px')
  for (let i = 0; i < 6; i++) x.fillText('HAXXED ✦', 40 + i * 360, 86)
  return c
}

const tex = (cv: HTMLCanvasElement) => {
  const t = new THREE.CanvasTexture(cv)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

export type FlapName = 'flap_left' | 'flap_right' | 'flap_front' | 'flap_back'
export type CourierBox = { group: THREE.Group; flaps: Record<FlapName, THREE.Group>; tape: THREE.Group; dims: { W: number; D: number; H: number } }

// Courier box (meters). Flap pivots are exposed so callers can animate open/close.
export function buildBox(assets: JarAssets): CourierBox {
  const W = 0.1, D = 0.1, H = 0.062, T = 0.0016
  const kraft = new THREE.MeshStandardMaterial({ name: 'kraft_board', color: '#c49764', roughness: 0.92, metalness: 0 })
  const kraftIn = new THREE.MeshStandardMaterial({ name: 'kraft_inner', color: '#a87d4f', roughness: 0.95, metalness: 0 })
  const labelM = new THREE.MeshStandardMaterial({ name: 'ship_label', map: tex(boxLabelCanvas(assets.logo)), roughness: 0.6, metalness: 0 })
  const tapeM = new THREE.MeshStandardMaterial({ name: 'haxxed_tape', map: tex(tapeCanvas()), roughness: 0.35, metalness: 0 })
  const g = new THREE.Group(); g.name = 'courier_box'
  const slab = (name: string, w: number, h: number, d: number, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), kraft)
    mesh.name = name; mesh.position.set(x, y, z); mesh.castShadow = true
    return mesh
  }
  g.add(slab('box_base', W, T, D, 0, T / 2, 0))
  g.add(slab('wall_front', W, H, T, 0, H / 2, D / 2 - T / 2))
  g.add(slab('wall_back', W, H, T, 0, H / 2, -D / 2 + T / 2))
  g.add(slab('wall_left', T, H, D - T * 2, -W / 2 + T / 2, H / 2, 0))
  g.add(slab('wall_right', T, H, D - T * 2, W / 2 - T / 2, H / 2, 0))
  const liner = new THREE.Mesh(new THREE.BoxGeometry(W - T * 2.2, 0.0008, D - T * 2.2), kraftIn)
  liner.name = 'box_floor'; liner.position.y = T + 0.0005; g.add(liner)

  const flaps = {} as Record<FlapName, THREE.Group>
  const flap = (name: FlapName, px: number, pz: number, mx: number, mz: number, w: number, d: number, y: number) => {
    const pivot = new THREE.Group(); pivot.name = name + '_hinge'; pivot.position.set(px, H + y, pz)
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, T, d), kraft); m.name = name; m.position.set(mx, 0, mz); m.castShadow = true
    pivot.add(m); g.add(pivot); flaps[name] = pivot
  }
  flap('flap_left', -W / 2, 0, W / 4, 0, W / 2, D - 0.002, T / 2)
  flap('flap_right', W / 2, 0, -W / 4, 0, W / 2, D - 0.002, T / 2)
  flap('flap_front', 0, D / 2, 0, -D / 4, W, D / 2, T * 1.5)
  flap('flap_back', 0, -D / 2, 0, D / 4, W, D / 2, T * 1.5)

  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.064, 0.04), labelM)
  label.name = 'ship_label'; label.position.set(0, H * 0.42, D / 2 + 0.0006); g.add(label)

  const tape = new THREE.Group(); tape.name = 'tape'
  const tapePlain = new THREE.MeshStandardMaterial({ name: 'haxxed_tape_plain', color: '#FAF418', roughness: 0.35, metalness: 0 })
  const tapeTop = new THREE.Mesh(new THREE.BoxGeometry(D + 0.0008, 0.0004, 0.022), [tapePlain, tapePlain, tapeM, tapePlain, tapePlain, tapePlain])
  tapeTop.name = 'tape_top'; tapeTop.rotation.y = Math.PI / 2; tapeTop.position.y = H + T * 2.3; tape.add(tapeTop)
  const tapeF = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.016, 0.0004), tapePlain)
  tapeF.name = 'tape_front'; tapeF.position.set(0, H - 0.008 + T * 2, D / 2 + 0.0008); tape.add(tapeF)
  const tapeB = tapeF.clone(); tapeB.name = 'tape_back'; tapeB.position.z = -D / 2 - 0.0008; tape.add(tapeB)
  g.add(tape)

  return { group: g, flaps, tape, dims: { W, D, H } }
}

export type Jar = { group: THREE.Group; lid: THREE.Group }

export function buildJar(v: JarVariant, assets: JarAssets): Jar {
  const V2 = (a: number, b: number) => new THREE.Vector2(a, b)
  const mat = {
    body: new THREE.MeshStandardMaterial({ name: 'jar_plastic_' + v.id, color: v.body, roughness: 0.32, metalness: 0, side: THREE.DoubleSide }),
    lid: new THREE.MeshStandardMaterial({ name: 'lid_plastic_' + v.id, color: v.lid, roughness: 0.28, metalness: 0, side: THREE.DoubleSide }),
    label: new THREE.MeshStandardMaterial({ name: 'label_' + v.id, map: tex(labelCanvas(v)), roughness: 0.42, metalness: 0 }),
    decal: new THREE.MeshStandardMaterial({ name: 'lid_print_' + v.id, map: tex(lidCanvas(v, assets.logo)), roughness: 0.3, metalness: 0, transparent: true }),
    product: new THREE.MeshStandardMaterial({ name: 'formula_' + v.id, color: v.product, roughness: v.rough, metalness: 0 }),
  }
  const g = new THREE.Group(); g.name = 'haxxed_jar_' + v.id

  const body = new THREE.Mesh(new THREE.LatheGeometry([
    V2(0, 0.004), V2(0.0385, 0.004), V2(0.0385, 0.0322), V2(0.0405, 0.0322), V2(0.0405, 0.0302),
    V2(0.042, 0.0298), V2(0.042, 0.004), V2(0.0414, 0.0014), V2(0.0398, 0.0002), V2(0, 0),
  ], 96), mat.body)
  body.name = 'jar_body'; body.castShadow = true; g.add(body)

  const label = new THREE.Mesh(new THREE.CylinderGeometry(0.04215, 0.04215, 0.0235, 128, 1, true, Math.PI, Math.PI * 2), mat.label)
  label.name = 'jar_label'; label.position.y = 0.0162; g.add(label)

  const pts: THREE.Vector2[] = []
  for (let i = 0; i <= 32; i++) {
    const r = 0.0384 * i / 32
    pts.push(V2(r, 0.0276 + 0.0024 * Math.exp(-Math.pow(r / 0.007, 2)) + 0.0004 * Math.sin(r * 700)))
  }
  pts.reverse()
  const product = new THREE.Mesh(new THREE.LatheGeometry(pts, 96), mat.product)
  product.name = 'formula'; g.add(product)

  const lid = new THREE.Group(); lid.name = 'lid'
  const shell = new THREE.Mesh(new THREE.LatheGeometry([
    V2(0, 0.0446), V2(0.0406, 0.0446), V2(0.0406, 0.0303), V2(0.0426, 0.0303), V2(0.0436, 0.0313),
    V2(0.0436, 0.0438), V2(0.0430, 0.0461), V2(0.0414, 0.0473), V2(0.0385, 0.0478), V2(0, 0.0478),
  ].reverse(), 96), mat.lid)
  shell.name = 'lid_shell'; shell.castShadow = true; lid.add(shell)
  const decal = new THREE.Mesh(new THREE.CircleGeometry(0.0372, 96), mat.decal)
  decal.name = 'lid_print'; decal.rotation.x = -Math.PI / 2; decal.position.y = 0.0479; lid.add(decal)
  g.add(lid)

  return { group: g, lid }
}
