// "…was born." logo: flowing liquid-chrome bands over a bevelled HAXXED logo, with a thin yellow streak.
// Original shader (not the Framer LiquidMetal component).
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))

const VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}'
const FS = `precision highp float;varying vec2 v;uniform sampler2D T;uniform float t;uniform vec2 px;uniform vec2 m;
float h21(vec2 q){return fract(sin(dot(q,vec2(41.3,289.1)))*45758.5);}
float vn(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 q){return .6*vn(q)+.3*vn(q*2.1+7.)+.1*vn(q*4.3-3.);}
vec3 chrome(float b){float f=fract(b);float c=.5+.5*cos(6.2831*f);c=pow(c,1.6);vec3 col=mix(vec3(.05,.05,.06),vec3(.97,.97,.95),c);col+=vec3(.98,.95,.09)*smoothstep(.955,.99,fract(b+.41))*.9;return col;}
void main(){vec2 uv=vec2(v.x,1.-v.y);vec4 s=texture2D(T,uv);float a=s.g;if(a<.003){gl_FragColor=vec4(0.);return;}
float hx=texture2D(T,uv+vec2(px.x,0.)).r-texture2D(T,uv-vec2(px.x,0.)).r;float hy=texture2D(T,uv+vec2(0.,px.y)).r-texture2D(T,uv-vec2(0.,px.y)).r;
vec2 n=vec2(hx,hy)*6.;float bev=1.-s.r;
float w=fbm(uv*vec2(3.,1.6)+vec2(t*.07,-t*.05));
float b=(uv.x*.9-uv.y*1.4)*1.6+n.x*.9-n.y*1.3+bev*.55+w*.45-t*.06+(m.x-.5)*.25;
vec3 col=vec3(chrome(b+.012).r,chrome(b).g,chrome(b-.016).b);
col+=pow(max(0.,bev-.35),2.)*.35;
gl_FragColor=vec4(col*a,a);}`

export class LiquidMetal {
  speed: number
  private gl: WebGLRenderingContext | null = null
  private uT: WebGLUniformLocation | null = null
  private uM: WebGLUniformLocation | null = null
  private ready = false
  private m: [number, number] = [0.5, 0.5]
  private sm: [number, number] = [0.5, 0.5]
  private t0 = performance.now()
  private cv: HTMLCanvasElement
  private logoSrc: string

  /** False when WebGL or the shader is unavailable — render the plain logo instead. */
  readonly ok: boolean

  constructor(cv: HTMLCanvasElement, logoSrc: string, speed: number) {
    this.cv = cv
    this.logoSrc = logoSrc
    this.speed = speed
    this.ok = this.init()
  }

  private init() {
    const gl = this.cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true })
    if (!gl) return false
    const sh = (src: string, type: number) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src); gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null }
      return s
    }
    const a = sh(VS, gl.VERTEX_SHADER), b = sh(FS, gl.FRAGMENT_SHADER)
    if (!a || !b) return false
    const pr = gl.createProgram()!
    gl.attachShader(pr, a); gl.attachShader(pr, b); gl.linkProgram(pr)
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return false
    gl.useProgram(pr)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(pr, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    this.gl = gl
    this.uT = gl.getUniformLocation(pr, 't')
    this.uM = gl.getUniformLocation(pr, 'm')
    const uPx = gl.getUniformLocation(pr, 'px')

    // Texture: R = blurred alpha (bevel height), G = sharp alpha (mask).
    const img = new Image()
    img.onload = () => {
      const W = 1200, H = 600, pad = 30
      const draw = (blur: number) => {
        const c = document.createElement('canvas'); c.width = W; c.height = H
        const x = c.getContext('2d')!
        if (blur) x.filter = 'blur(' + blur + 'px)'
        x.drawImage(img, pad, pad, W - pad * 2, H - pad * 2)
        return x.getImageData(0, 0, W, H).data
      }
      const sharp = draw(0), soft = draw(7)
      const out = new Uint8Array(W * H * 4)
      for (let i = 0; i < W * H; i++) { out[i * 4] = soft[i * 4 + 3]; out[i * 4 + 1] = sharp[i * 4 + 3]; out[i * 4 + 2] = 0; out[i * 4 + 3] = 255 }
      const tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, out)
      gl.uniform2f(uPx, 2 / W, 2 / H)
      this.ready = true
    }
    img.src = this.logoSrc
    window.addEventListener('mousemove', this.onMove)
    return true
  }

  private onMove = (e: MouseEvent) => {
    const rc = this.cv.getBoundingClientRect()
    if (rc.width) this.m = [cl((e.clientX - rc.left) / rc.width), cl((e.clientY - rc.top) / rc.height)]
  }

  /** Call every animation frame; `visible` lets the caller skip work while the logo is faded out. */
  frame(visible: boolean) {
    const gl = this.gl
    if (!gl || !this.ready || !visible) return
    const rc = this.cv.getBoundingClientRect()
    if (rc.bottom < 0 || rc.top > innerHeight) return
    const dpr = Math.min(2, devicePixelRatio || 1), w = Math.round(rc.width * dpr), h = Math.round(rc.height * dpr)
    if (this.cv.width !== w || this.cv.height !== h) { this.cv.width = w; this.cv.height = h }
    gl.viewport(0, 0, w, h)
    this.sm[0] += (this.m[0] - this.sm[0]) * 0.05
    this.sm[1] += (this.m[1] - this.sm[1]) * 0.05
    gl.uniform1f(this.uT, (performance.now() - this.t0) / 1000 * this.speed)
    gl.uniform2f(this.uM, this.sm[0], this.sm[1])
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  dispose() {
    window.removeEventListener('mousemove', this.onMove)
    this.gl?.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
