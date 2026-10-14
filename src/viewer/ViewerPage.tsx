import { useEffect, useRef, useState } from 'react'
import { ModelStage } from '../three/ModelStage'
import { VARIANTS, buildBox, buildJar, loadJarAssets, type Jar, type JarAssets, type JarVariant } from '../three/jarModel'
import './viewer.css'

const titleCase = (s: string) => s.replace(/\b\w+/g, w => w[0] + w.slice(1).toLowerCase())

function initialVariant(): JarVariant['id'] {
  const v = new URLSearchParams(window.location.search).get('v')
  return VARIANTS.some(x => x.id === v) ? (v as JarVariant['id']) : 'clay'
}

export function ViewerPage() {
  const hostRef = useRef<HTMLDivElement>(null)
  const stage = useRef<ModelStage | null>(null)
  const lid = useRef<Jar['lid'] | null>(null)
  const [assets, setAssets] = useState<JarAssets | null>(null)
  const [variant, setVariant] = useState(initialVariant)
  const [open, setOpen] = useState(false)
  const [boxed, setBoxed] = useState(false)
  const v = VARIANTS.find(x => x.id === variant)!

  useEffect(() => {
    const s = new ModelStage(hostRef.current!)
    stage.current = s
    let live = true
    loadJarAssets().then(a => { if (live) setAssets(a) })
    return () => { live = false; s.dispose(); stage.current = null }
  }, [])

  useEffect(() => {
    const s = stage.current
    if (!s || !assets) return
    const jar = buildJar(v, assets)
    lid.current = jar.lid
    if (boxed) {
      const b = buildBox(assets)
      jar.group.position.y = 0.0025
      b.group.add(jar.group)
      s.name = 'haxxed-' + v.id + '-courier-box'
      s.setObject(b.group)
    } else {
      s.name = 'haxxed-' + v.id
      s.setObject(jar.group)
    }
  }, [assets, v, boxed])

  useEffect(() => {
    lid.current?.position.set(0, open ? 0.03 : 0, open ? -0.03 : 0)
    if (lid.current) lid.current.rotation.x = open ? -0.55 : 0
  }, [open, assets, v, boxed])

  useEffect(() => { document.title = titleCase(v.name) + ' — HAXXED Jar 3D' }, [v])

  return (
    <div className="viewer">
      <div className="viewer__ui">
        <a className="viewer__k" href="/">← Back to HAXXED</a>
        <h1>{titleCase(v.name)}</h1>
        <div className="viewer__k">Drag to spin · scroll to zoom</div>
        <div className="viewer__row">
          {VARIANTS.map(x => (
            <button key={x.id} type="button" className={x.id === variant ? 'on' : ''} aria-pressed={x.id === variant} onClick={() => setVariant(x.id)}>{titleCase(x.name)}</button>
          ))}
        </div>
        <div className="viewer__row">
          {!boxed && <button type="button" className={open ? 'on' : ''} aria-pressed={open} onClick={() => setOpen(o => !o)}>{open ? 'Close the lid' : 'Open the lid'}</button>}
          <button type="button" className={boxed ? 'on' : ''} aria-pressed={boxed} onClick={() => setBoxed(b => !b)}>Courier box</button>
        </div>
      </div>
      <div ref={hostRef} className="viewer__stage" />
      <div className="viewer__note">Drag to orbit · scroll to zoom · right-drag to pan</div>
      <div className="viewer__toolbar">
        <button type="button" disabled={!assets} onClick={() => stage.current?.exportObj()}>Download OBJ + MTL</button>
        <button type="button" disabled={!assets} onClick={() => stage.current?.exportGlb()}>Download GLB</button>
      </div>
    </div>
  )
}
