// Orbit viewer with studio lighting, a soft ground shadow, and OBJ+MTL / GLB export.
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

type StdMat = THREE.Material & { color?: THREE.Color; roughness?: number; map?: THREE.Texture | null }

export class ModelStage {
  name = 'model'
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(45, 1, 0.01, 500)
  private controls: OrbitControls
  private key: THREE.DirectionalLight
  private ground: THREE.Mesh
  private object: THREE.Object3D | null = null
  private ro: ResizeObserver
  private host: HTMLElement

  constructor(host: HTMLElement, { autorotate = true } = {}) {
    this.host = host
    const renderer = this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.domElement.style.display = 'block'
    host.appendChild(renderer.domElement)

    this.camera.position.set(3, 2.2, 4)
    const controls = this.controls = new OrbitControls(this.camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.autoRotate = autorotate
    controls.autoRotateSpeed = 1.2
    controls.addEventListener('start', () => { controls.autoRotate = false })

    // Neutral studio: sky/ground wash, a shadow-casting key light, and a dim back fill.
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2c4, 1.0))
    const key = this.key = new THREE.DirectionalLight(0xffffff, 2.2)
    key.position.set(4, 7, 5)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.bias = -0.0002
    this.scene.add(key)
    const fill = new THREE.DirectionalLight(0xfff4e6, 0.5)
    fill.position.set(-5, 3, -4)
    this.scene.add(fill)

    const ground = this.ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.18 }))
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    this.scene.add(ground)

    this.ro = new ResizeObserver(() => this.fit())
    this.ro.observe(host)
    this.fit()
    renderer.setAnimationLoop(() => { controls.update(); renderer.render(this.scene, this.camera) })
  }

  private fit() {
    const w = this.host.clientWidth || 1, h = this.host.clientHeight || 1
    this.renderer.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  /** Show the object: enables shadows, rests it on the ground and frames the camera to its bounds. */
  setObject(object: THREE.Object3D) {
    if (this.object) this.scene.remove(this.object)
    this.object = object
    object.traverse(o => { if (o instanceof THREE.Mesh) { o.castShadow = true; o.receiveShadow = true } })
    const box = new THREE.Box3().setFromObject(object)
    if (!box.isEmpty()) {
      this.ground.position.y = box.min.y
      const sphere = box.getBoundingSphere(new THREE.Sphere())
      const dist = sphere.radius / Math.tan(this.camera.fov * Math.PI / 360) * 1.35
      const dir = new THREE.Vector3(1, 0.55, 1.25).normalize()
      this.camera.position.copy(sphere.center).add(dir.multiplyScalar(dist))
      this.camera.near = Math.max(dist / 100, 0.01)
      this.camera.far = dist * 100
      this.camera.updateProjectionMatrix()
      this.controls.target.copy(sphere.center)
      this.controls.update()
      const span = sphere.radius * 3, sc = this.key.shadow.camera
      sc.left = -span; sc.right = span; sc.top = span; sc.bottom = -span
      sc.updateProjectionMatrix()
    }
    this.scene.add(object)
  }

  private get basename() { return this.name.replace(/[^\w.-]+/g, '_') }

  /** Every mesh and material needs a unique name for OBJ o/usemtl lines. */
  private nameParts() {
    const mats: StdMat[] = []
    const seen = new Set<string>()
    let meshI = 0, matI = 0
    this.object?.traverse(o => {
      if (!(o instanceof THREE.Mesh)) return
      if (!o.name) o.name = 'part_' + meshI
      meshI++
      for (const m of (Array.isArray(o.material) ? o.material : [o.material]) as StdMat[]) {
        if (!m || mats.includes(m)) continue
        if (!m.name) m.name = 'mat_' + matI++
        while (seen.has(m.name)) m.name = m.name + '_' + matI++
        seen.add(m.name)
        mats.push(m)
      }
    })
    return mats
  }

  async exportObj() {
    if (!this.object) return
    const { OBJExporter } = await import('three/addons/exporters/OBJExporter.js')
    const mats = this.nameParts(), base = this.basename
    const obj = 'mtllib ' + base + '.mtl\n' + new OBJExporter().parse(this.object)
    let mtl = '# Exported by HAXXED jar viewer\n'
    for (const m of mats) {
      const c = m.color ?? { r: 0.8, g: 0.8, b: 0.8 }
      const rough = typeof m.roughness === 'number' ? m.roughness : 0.5
      mtl += 'newmtl ' + m.name + '\n'
      mtl += 'Kd ' + c.r.toFixed(4) + ' ' + c.g.toFixed(4) + ' ' + c.b.toFixed(4) + '\n'
      mtl += 'Ks 0.2000 0.2000 0.2000\n'
      mtl += 'Ns ' + Math.round((1 - rough) * 200) + '\n'
      mtl += 'd ' + m.opacity.toFixed(4) + '\n\n'
    }
    download(new Blob([obj], { type: 'text/plain' }), base + '.obj')
    download(new Blob([mtl], { type: 'text/plain' }), base + '.mtl')
  }

  async exportGlb() {
    if (!this.object) return
    const { GLTFExporter } = await import('three/addons/exporters/GLTFExporter.js')
    this.nameParts()
    const buf = await new GLTFExporter().parseAsync(this.object, { binary: true })
    download(new Blob([buf as ArrayBuffer], { type: 'model/gltf-binary' }), this.basename + '.glb')
  }

  dispose() {
    this.renderer.setAnimationLoop(null)
    this.ro.disconnect()
    this.controls.dispose()
    this.renderer.dispose()
    this.renderer.domElement.remove()
  }
}
