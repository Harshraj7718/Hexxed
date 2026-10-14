// Scroll-driven hero scene: jar intro → lid opens → variant chapters → packed into the courier box.
// The page drives it with setProgress (0–1 across the hero section) and setPointer (-0.5…0.5).
import * as THREE from 'three'
import { VARIANTS, buildBox, buildJar, loadJarAssets, type CourierBox, type Jar } from './jarModel'

const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const S = (a: number, b: number, x: number) => { const t = cl((x - a) / (b - a)); return t * t * (3 - 2 * t) }
const lerp = (a: number, b: number, k: number) => a + (b - a) * k
const easeIO = (k: number) => k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2
const variantFor = (p: number) => p < 0.555 ? 0 : p < 0.685 ? 1 : 2

export class HeroScene {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50)
  private pivot = new THREE.Group()
  private shadow: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
  private jars: Jar[] = []
  private box: CourierBox | null = null
  private ro: ResizeObserver
  private raf = 0
  private disposed = false
  private t0 = performance.now()
  private tp = 0; private p = 0
  private tmx = 0; private tmy = 0; private mx = 0; private my = 0
  private shown = 0; private swapT = 1; private swapTo = 0
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const renderer = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05

    this.camera.position.set(0, 1.15, 3.5)
    this.camera.lookAt(0, 0.22, 0)

    // Soft studio environment for the plastic sheen.
    const pm = new THREE.PMREMGenerator(renderer)
    const env = new THREE.Scene()
    env.add(new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({ color: 0x6f6d68, side: THREE.BackSide })))
    const panel = (w: number, h: number, pos: [number, number, number], rot: [number, number, number], k: number) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k), side: THREE.DoubleSide }))
      m.position.set(...pos); m.rotation.set(...rot); env.add(m)
    }
    panel(6, 2, [0, 4.5, 0], [Math.PI / 2, 0, 0], 3)
    panel(2, 4, [-4.5, 1, 1], [0, Math.PI / 2, 0], 2.2)
    panel(2, 4, [4.5, 1, -1], [0, -Math.PI / 2, 0], 1.4)
    panel(5, 1.2, [0, 1.5, 4.5], [0, Math.PI, 0], 1.2)
    this.scene.environment = pm.fromScene(env, 0.04).texture
    const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(-2, 4, 3); this.scene.add(key)
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xbdb8ad, 0.35))

    // Contact shadow.
    const sc = document.createElement('canvas'); sc.width = sc.height = 256
    const sx = sc.getContext('2d')!
    const gr = sx.createRadialGradient(128, 128, 0, 128, 128, 128)
    gr.addColorStop(0, 'rgba(20,18,15,.55)'); gr.addColorStop(0.45, 'rgba(20,18,15,.25)'); gr.addColorStop(1, 'rgba(20,18,15,0)')
    sx.fillStyle = gr; sx.fillRect(0, 0, 256, 256)
    this.shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false, opacity: 0 }))
    this.shadow.rotation.x = -Math.PI / 2
    this.scene.add(this.shadow)

    this.pivot.position.y = 0.26
    this.scene.add(this.pivot)

    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(canvas)
    this.resize()
    void this.load()
  }

  private async load() {
    const assets = await loadJarAssets()
    if (this.disposed) return
    this.jars = VARIANTS.map(v => {
      const j = buildJar(v, assets)
      j.group.scale.setScalar(10)
      j.group.position.y = -0.24
      j.group.visible = false
      this.pivot.add(j.group)
      return j
    })
    this.jars[0].group.visible = true
    const box = this.box = buildBox(assets)
    box.group.scale.setScalar(10)
    box.group.visible = false
    this.scene.add(box.group)
    this.t0 = performance.now()
    this.raf = requestAnimationFrame(this.frame)
  }

  setProgress(p: number) { this.tp = p }
  setPointer(mx: number, my: number) { this.tmx = mx; this.tmy = my }

  private resize() {
    const w = this.canvas.clientWidth || 1, h = this.canvas.clientHeight || 1
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  private frame = (now: number) => {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.frame)
    const rc = this.canvas.getBoundingClientRect()
    if (rc.bottom < 0 || rc.top > innerHeight) return
    this.step(now)
    this.renderer.render(this.scene, this.camera)
  }

  private step(now: number) {
    const { camera, pivot, jars, shadow } = this
    const box = this.box!
    const t = (now - this.t0) / 1000
    this.p += (this.tp - this.p) * 0.08
    this.mx += (this.tmx - this.mx) * 0.06
    this.my += (this.tmy - this.my) * 0.06
    const { p, mx, my } = this

    const intro = 1 - Math.pow(1 - cl(t / 1.8), 3)
    const open = S(0.14, 0.22, p) * (1 - S(0.31, 0.37, p))
    const side = S(0.38, 0.45, p) * (1 - S(0.79, 0.84, p))
    const pack = S(0.79, 0.84, p)
    const boxIn = S(0.80, 0.86, p), drop = S(0.855, 0.915, p)
    const c1 = S(0.915, 0.945, p), c2 = S(0.94, 0.97, p), seal = S(0.965, 0.99, p)
    const wide = camera.aspect > 1.1

    // Variant swap: spin + shrink "pop", switching meshes at the midpoint.
    const want = variantFor(p)
    if (want !== this.swapTo && this.swapT >= 1) { this.swapTo = want; this.swapT = 0 }
    if (this.swapT < 1) {
      this.swapT = Math.min(1, this.swapT + 1 / 42)
      if (this.swapT >= 0.5 && this.shown !== this.swapTo) {
        jars[this.shown].group.visible = false
        this.shown = this.swapTo
        jars[this.shown].group.visible = true
      }
    }
    const pop = this.swapT < 1 ? Math.sin(Math.PI * this.swapT) : 0
    const swapSpin = this.swapT < 1 ? (1 - Math.pow(1 - this.swapT, 3)) * Math.PI * 2 : 0
    const free = 1 - pack

    const s0 = (0.6 + 0.4 * intro) * (1 - (wide ? 0.12 : 0.3) * side) * (1 - 0.55 * pop)
    const scale = lerp(s0, 0.98, pack)
    pivot.scale.setScalar(scale)
    pivot.rotation.order = 'YXZ'
    pivot.rotation.y = -0.35 + t * 0.22 * free + p * Math.PI * 4 + swapSpin + mx * 0.5 * free - (1 - intro) * 2.2
    pivot.rotation.x = lerp(0.38 + open * 0.42 + my * 0.18 - side * 0.12, 0, pack)
    pivot.rotation.z = (Math.sin(t * 0.8) * 0.03 + mx * -0.08) * free

    const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 3.6 * camera.aspect
    pivot.position.x = wide ? side * halfW * 0.42 : 0
    const yFree = 0.26 + Math.sin(t * 1.3) * 0.02 + open * 0.06 + (wide ? 0 : side * 0.5)
    const yPack = lerp(1.15, 0.03 + 0.24 * 0.98 + 0.004, easeIO(drop))
    pivot.position.y = lerp(yFree, yPack, pack)
    pivot.visible = seal < 1

    const j = jars[this.shown]
    j.lid.position.set(0, open * 0.034, -open * 0.022)
    j.lid.rotation.x = -open * 0.6

    box.group.visible = boxIn > 0.001
    box.group.position.y = lerp(-1.4, 0, easeIO(boxIn))
    box.group.rotation.y = (1 - boxIn) * 0.9 - seal * 0.38 + Math.sin(t * 0.6) * 0.04 * seal + mx * 0.25 * seal
    box.group.rotation.x = my * 0.08 * seal
    const A = 1.95
    box.flaps.flap_left.rotation.z = A * (1 - c1) + Math.sin(t * 2) * 0.03 * (1 - c1)
    box.flaps.flap_right.rotation.z = -A * (1 - c1) - Math.sin(t * 2 + 1) * 0.03 * (1 - c1)
    box.flaps.flap_front.rotation.x = A * (1 - c2)
    box.flaps.flap_back.rotation.x = -A * (1 - c2)
    box.tape.visible = seal > 0.01
    box.tape.scale.set(1, 1, Math.max(0.01, seal))

    const look = S(0.80, 0.88, p) * (1 - 0.6 * S(0.95, 1.0, p))
    const zBase = 3.5 * Math.max(1, 1.15 / camera.aspect)
    camera.position.set(0, lerp(1.15, 2.3, look), zBase + pack * 1.5)
    camera.lookAt(0, lerp(0.22, 0.3, pack), 0)

    shadow.position.set(pivot.position.x * free, -0.02, 0)
    shadow.scale.setScalar(lerp(1.5 * scale * (1 - Math.sin(t * 1.3) * 0.04), 1.9, boxIn))
    shadow.material.opacity = intro
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    this.ro.disconnect()
    this.scene.traverse(o => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose()
        ;(Array.isArray(o.material) ? o.material : [o.material]).forEach((m: THREE.Material & { map?: THREE.Texture | null }) => { m.map?.dispose(); m.dispose() })
      }
    })
    this.renderer.dispose()
  }
}
