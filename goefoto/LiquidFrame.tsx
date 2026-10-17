import {
    useEffect,
    useRef,
    useState,
    useCallback,
    startTransition,
    type CSSProperties,
    type PointerEvent as RPointerEvent,
} from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { useInView } from "framer-motion"

interface Img {
    src: string
    srcSet?: string
    alt?: string
}

interface LiquidFrameProps {
    image1?: Img
    image2?: Img
    image3?: Img
    image4?: Img
    image5?: Img
    image6?: Img
    title1: string
    title2: string
    title3: string
    title4: string
    title5: string
    title6: string
    autoplay: boolean
    interval: number
    duration: number
    strength: number
    zoom: number
    focusY: number
    zoom1: number
    zoom2: number
    zoom3: number
    zoom4: number
    zoom5: number
    zoom6: number
    fx1: number
    fx2: number
    fx3: number
    fx4: number
    fx5: number
    fx6: number
    fy1: number
    fy2: number
    fy3: number
    fy4: number
    fy5: number
    fy6: number
    accent: string
    frameWidth: number
    showThumbs: boolean
    style?: CSSProperties
}

const MONO = '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace'

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.0,1.0); }`

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uA;
uniform sampler2D uB;
uniform vec2 uRes;
uniform vec2 uSizeA;
uniform vec2 uSizeB;
uniform float uP;
uniform float uStrength;
uniform float uZoomA;
uniform float uZoomB;
uniform vec2 uFocA;
uniform vec2 uFocB;
uniform float uSeed;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i=floor(p); vec2 f=fract(p);
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),
             mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.0; float a=0.5;
  for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.03; a*=0.5; }
  return v;
}
vec2 cover(vec2 uv, vec2 size, float zoom, vec2 foc){
  float rs=uRes.x/uRes.y; float ri=size.x/size.y;
  vec2 s = rs<ri ? vec2(rs/ri,1.0) : vec2(1.0,ri/rs);
  s/=zoom;
  vec2 o=vec2((1.0-s.x)*foc.x,(1.0-s.y)*(1.0-foc.y));
  return clamp(uv*s+o, 0.0, 1.0);
}
void main(){
  vec2 uv=vUv;
  float n=fbm(uv*vec2(2.2,3.0)+uSeed);
  vec2 d=vec2(fbm(uv*2.0+uSeed+1.7), fbm(uv*2.0+uSeed+9.2))-0.5;
  float wave=sin(uP*3.14159265);
  float dist=uStrength*wave;
  vec4 a=texture2D(uA, cover(uv+d*dist*0.55, uSizeA, uZoomA, uFocA));
  vec4 b=texture2D(uB, cover(uv-d*dist*0.55, uSizeB, uZoomB, uFocB));
  float edge=uv.x*0.55+n*0.45;
  float p=uP*1.35;
  float m=smoothstep(p-0.16, p, edge);
  vec4 col=mix(b,a,m);
  float rim=(1.0-smoothstep(0.0,0.035,abs(edge-(p-0.08))))*wave*0.16;
  gl_FragColor=vec4(col.rgb+rim, 1.0);
}`

function easeInOut(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Liquid Frame – Bild-Slider mit flüssigem Übergang im Kontaktbogen-Stil
 *
 * @framerIntrinsicWidth 440
 * @framerIntrinsicHeight 640
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function LiquidFrame(props: LiquidFrameProps) {
    const {
        image1 = {
            src: "https://framerusercontent.com/images/nsM6l3ByK6kD5DV4RlXzJ5WNs.png",
            alt: "Iris-Fotografie",
        },
        image2,
        image3,
        image4,
        image5,
        image6,
        autoplay = true,
        interval = 5,
        duration = 1.6,
        strength = 0.6,
        zoom = 1,
        focusY = 0.5,
        accent = "#2B2BF2",
        frameWidth = 3,
        showThumbs = true,
    } = props

    const frame = (z?: number, fx?: number, fy?: number) => ({
        zoom: z && z > 0 ? z : zoom,
        fx: typeof fx === "number" && fx >= 0 ? fx : 0.5,
        fy: typeof fy === "number" && fy >= 0 ? fy : focusY,
    })
    const slides = [
        { img: image1, title: props.title1, ...frame(props.zoom1, props.fx1, props.fy1) },
        { img: image2, title: props.title2, ...frame(props.zoom2, props.fx2, props.fy2) },
        { img: image3, title: props.title3, ...frame(props.zoom3, props.fx3, props.fy3) },
        { img: image4, title: props.title4, ...frame(props.zoom4, props.fx4, props.fy4) },
        { img: image5, title: props.title5, ...frame(props.zoom5, props.fx5, props.fy5) },
        { img: image6, title: props.title6, ...frame(props.zoom6, props.fx6, props.fy6) },
    ].filter((s) => s.img && s.img.src) as { img: Img; title: string; zoom: number; fx: number; fy: number }[]
    const slidesRef = useRef(slides)
    slidesRef.current = slides
    const count = slides.length

    const isStatic = useIsStaticRenderer()
    const rootRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const barRef = useRef<HTMLDivElement>(null)
    const inView = useInView(rootRef)

    const [index, setIndex] = useState(0)
    const [webgl, setWebgl] = useState(true)
    const [hover, setHover] = useState(false)

    const glRef = useRef<{
        gl: WebGLRenderingContext
        prog: WebGLProgram
        tex: (WebGLTexture | null)[]
        sizes: [number, number][]
        loaded: boolean[]
        u: Record<string, WebGLUniformLocation | null>
    } | null>(null)
    const animRef = useRef({ from: 0, to: 0, p: 0, running: false, seed: 0 })
    const indexRef = useRef(0)
    const elapsedRef = useRef(0)

    // ---------- WebGL setup ----------
    const draw = useCallback(() => {
        const g = glRef.current
        const c = canvasRef.current
        if (!g || !c) return
        const { gl, u, tex, sizes } = g
        const a = animRef.current
        const from = a.running ? a.from : indexRef.current
        const to = a.running ? a.to : indexRef.current
        gl.viewport(0, 0, c.width, c.height)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, tex[from])
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, tex[to])
        gl.uniform2f(u.uRes, c.width, c.height)
        gl.uniform2f(u.uSizeA, sizes[from][0], sizes[from][1])
        gl.uniform2f(u.uSizeB, sizes[to][0], sizes[to][1])
        gl.uniform1f(u.uP, a.running ? a.p : 0)
        gl.uniform1f(u.uStrength, strength)
        const sl = slidesRef.current
        const fa = sl[from] || { zoom: 1, fx: 0.5, fy: 0.5 }
        const fb = sl[to] || { zoom: 1, fx: 0.5, fy: 0.5 }
        gl.uniform1f(u.uZoomA, fa.zoom)
        gl.uniform1f(u.uZoomB, fb.zoom)
        gl.uniform2f(u.uFocA, fa.fx, fa.fy)
        gl.uniform2f(u.uFocB, fb.fx, fb.fy)
        gl.uniform1f(u.uSeed, a.seed)
        gl.drawArrays(gl.TRIANGLES, 0, 6)
    }, [strength, zoom, focusY])

    useEffect(() => {
        if (isStatic || typeof window === "undefined") return
        const c = canvasRef.current
        if (!c) return
        const gl = c.getContext("webgl", { premultipliedAlpha: false, antialias: false })
        if (!gl) {
            startTransition(() => setWebgl(false))
            return
        }
        const compile = (type: number, src: string) => {
            const s = gl.createShader(type)!
            gl.shaderSource(s, src)
            gl.compileShader(s)
            return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
        }
        const vs = compile(gl.VERTEX_SHADER, VERT)
        const fs = compile(gl.FRAGMENT_SHADER, FRAG)
        if (!vs || !fs) {
            startTransition(() => setWebgl(false))
            return
        }
        const prog = gl.createProgram()!
        gl.attachShader(prog, vs)
        gl.attachShader(prog, fs)
        gl.linkProgram(prog)
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            startTransition(() => setWebgl(false))
            return
        }
        gl.useProgram(prog)
        const buf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buf)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
        )
        const loc = gl.getAttribLocation(prog, "aPos")
        gl.enableVertexAttribArray(loc)
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
        const names = ["uA", "uB", "uRes", "uSizeA", "uSizeB", "uP", "uStrength", "uZoomA", "uZoomB", "uFocA", "uFocB", "uSeed"]
        const u: Record<string, WebGLUniformLocation | null> = {}
        names.forEach((n) => (u[n] = gl.getUniformLocation(prog, n)))
        gl.uniform1i(u.uA, 0)
        gl.uniform1i(u.uB, 1)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

        const tex: (WebGLTexture | null)[] = []
        const sizes: [number, number][] = []
        const loaded: boolean[] = []
        let cancelled = false
        slides.forEach((s, i) => {
            const t = gl.createTexture()
            gl.bindTexture(gl.TEXTURE_2D, t)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([10, 10, 10, 255]))
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            tex[i] = t
            sizes[i] = [1, 1]
            loaded[i] = false
            const im = new Image()
            im.crossOrigin = "anonymous"
            im.onload = () => {
                if (cancelled) return
                try {
                    gl.bindTexture(gl.TEXTURE_2D, t)
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im)
                    sizes[i] = [im.naturalWidth, im.naturalHeight]
                    loaded[i] = true
                    draw()
                } catch (e) {
                    startTransition(() => setWebgl(false))
                }
            }
            im.onerror = () => {
                if (!cancelled) startTransition(() => setWebgl(false))
            }
            im.src = s.img.src
        })
        glRef.current = { gl, prog, tex, sizes, loaded, u }

        const ro = new ResizeObserver(() => {
            const st = stageRef.current
            if (!st) return
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            const w = Math.max(1, Math.round(st.clientWidth * dpr))
            const h = Math.max(1, Math.round(st.clientHeight * dpr))
            if (c.width !== w || c.height !== h) {
                c.width = w
                c.height = h
                draw()
            }
        })
        if (stageRef.current) ro.observe(stageRef.current)
        return () => {
            cancelled = true
            ro.disconnect()
            tex.forEach((t) => t && gl.deleteTexture(t))
            gl.deleteProgram(prog)
            glRef.current = null
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStatic, count, image1?.src, image2?.src, image3?.src, image4?.src, image5?.src, image6?.src])

    const frameKey = slides.map((x) => `${x.zoom}|${x.fx}|${x.fy}`).join(",")
    useEffect(() => {
        draw()
    }, [draw, frameKey])

    // ---------- Transition ----------
    const goTo = useCallback(
        (next: number) => {
            if (count < 2) return
            const a = animRef.current
            if (a.running) return
            const to = ((next % count) + count) % count
            if (to === indexRef.current) return
            elapsedRef.current = 0
            const reduce =
                typeof window !== "undefined" &&
                window.matchMedia &&
                window.matchMedia("(prefers-reduced-motion: reduce)").matches
            if (!webgl || !glRef.current || reduce) {
                indexRef.current = to
                startTransition(() => setIndex(to))
                draw()
                return
            }
            a.from = indexRef.current
            a.to = to
            a.p = 0
            a.running = true
            a.seed = Math.random() * 10
            indexRef.current = to
            startTransition(() => setIndex(to))
            const start = performance.now()
            const dur = Math.max(0.3, duration) * 1000
            const step = (now: number) => {
                const t = Math.min(1, (now - start) / dur)
                a.p = easeInOut(t)
                draw()
                if (t < 1) requestAnimationFrame(step)
                else {
                    a.running = false
                    draw()
                }
            }
            requestAnimationFrame(step)
        },
        [count, webgl, duration, draw]
    )

    // ---------- Autoplay with progress line ----------
    useEffect(() => {
        if (isStatic || !autoplay || count < 2 || !inView) return
        let raf = 0
        let last = performance.now()
        const tick = (now: number) => {
            const dt = (now - last) / 1000
            last = now
            if (!hover && !animRef.current.running) elapsedRef.current += dt
            const p = Math.min(1, elapsedRef.current / Math.max(1, interval))
            if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
            if (p >= 1) goTo(indexRef.current + 1)
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [isStatic, autoplay, count, inView, hover, interval, goTo])

    // ---------- Swipe ----------
    const downX = useRef<number | null>(null)
    const onDown = (e: RPointerEvent) => {
        downX.current = e.clientX
    }
    const onUp = (e: RPointerEvent) => {
        if (downX.current === null) return
        const dx = e.clientX - downX.current
        downX.current = null
        if (Math.abs(dx) > 40) goTo(indexRef.current + (dx < 0 ? 1 : -1))
    }

    const pad = (n: number) => String(n).padStart(2, "0")
    const cur = slides[index] || slides[0]
    const fallbackImg = (i: number, visible: boolean): CSSProperties => ({
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: `${(slides[i]?.fx ?? 0.5) * 100}% ${(slides[i]?.fy ?? focusY) * 100}%`,
        transform: `scale(${slides[i]?.zoom ?? zoom})`,
        transformOrigin: `${(slides[i]?.fx ?? 0.5) * 100}% ${(slides[i]?.fy ?? focusY) * 100}%`,
        opacity: visible ? 1 : 0,
        transition: `opacity ${duration}s ease`,
    })

    const btn: CSSProperties = {
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(10,10,10,0.35)",
        border: "1px solid rgba(255,255,255,0.55)",
        color: "#fff",
        cursor: "pointer",
        padding: 0,
        backdropFilter: "blur(2px)",
    }

    return (
        <div
            ref={rootRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Ausgewählte Arbeiten"
            style={{
                ...props.style,
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontFamily: MONO,
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div
                ref={stageRef}
                onPointerDown={onDown}
                onPointerUp={onUp}
                style={{
                    position: "relative",
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                    background: "#0A0A0A",
                    boxShadow: `inset 0 0 0 ${frameWidth}px ${accent}`,
                    touchAction: "pan-y",
                    userSelect: "none",
                }}
            >
                {(isStatic || !webgl) &&
                    slides.map((s, i) => (
                        <img
                            key={i}
                            src={s.img.src}
                            srcSet={s.img.srcSet}
                            alt={s.img.alt || s.title || ""}
                            style={fallbackImg(i, i === (isStatic ? 0 : index))}
                            draggable={false}
                        />
                    ))}
                {!isStatic && webgl && (
                    <canvas
                        ref={canvasRef}
                        role="img"
                        aria-label={cur?.img.alt || cur?.title || ""}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
                    />
                )}
                {/* Rahmen über dem Bild */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        boxShadow: `inset 0 0 0 ${frameWidth}px ${accent}`,
                        pointerEvents: "none",
                    }}
                />
                {count > 1 && (
                    <>
                        <div
                            style={{
                                position: "absolute",
                                top: 18,
                                left: 20,
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                color: "#fff",
                                fontSize: 12,
                                letterSpacing: "0.06em",
                            }}
                        >
                            <span>{pad(index + 1)}</span>
                            <span
                                style={{
                                    position: "relative",
                                    width: 56,
                                    height: 1,
                                    background: "rgba(255,255,255,0.35)",
                                    overflow: "hidden",
                                }}
                            >
                                <span
                                    ref={barRef as any}
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        background: "#fff",
                                        transformOrigin: "0 50%",
                                        transform: "scaleX(0)",
                                    }}
                                />
                            </span>
                            <span style={{ opacity: 0.7 }}>{pad(count)}</span>
                        </div>
                        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6 }}>
                            <button aria-label="Vorheriges Bild" style={btn} onClick={() => goTo(indexRef.current - 1)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M19 12H5M11 6l-6 6 6 6" />
                                </svg>
                            </button>
                            <button aria-label="Nächstes Bild" style={btn} onClick={() => goTo(indexRef.current + 1)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: accent,
                    fontSize: 12,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    lineHeight: 1.3,
                }}
                aria-live="polite"
            >
                <span>
                    {pad(index + 1)}A — {cur?.title || ""}
                </span>
                <span>✕ Auswahl</span>
            </div>

            {showThumbs && count > 1 && (
                <div style={{ display: "flex", gap: 6 }}>
                    {slides.map((s, i) => (
                        <button
                            key={i}
                            aria-label={`Bild ${i + 1}: ${s.title || ""}`}
                            aria-current={i === index}
                            onClick={() => goTo(i)}
                            style={{
                                flex: 1,
                                minWidth: 0,
                                height: 52,
                                padding: 0,
                                border: "none",
                                cursor: "pointer",
                                background: `#0A0A0A url(${s.img.src}) center/cover no-repeat`,
                                boxShadow: i === index ? `inset 0 0 0 2px ${accent}` : "none",
                                opacity: i === index ? 1 : 0.45,
                                transition: "opacity .3s ease",
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

addPropertyControls(LiquidFrame, {
    image1: { type: ControlType.ResponsiveImage, title: "Bild 1" },
    title1: { type: ControlType.String, title: "Titel 1", defaultValue: "Iris-Fotografie" },
    image2: { type: ControlType.ResponsiveImage, title: "Bild 2" },
    title2: { type: ControlType.String, title: "Titel 2", defaultValue: "Portrait" },
    image3: { type: ControlType.ResponsiveImage, title: "Bild 3" },
    title3: { type: ControlType.String, title: "Titel 3", defaultValue: "Business" },
    image4: { type: ControlType.ResponsiveImage, title: "Bild 4" },
    title4: { type: ControlType.String, title: "Titel 4", defaultValue: "Tiere" },
    image5: { type: ControlType.ResponsiveImage, title: "Bild 5" },
    title5: { type: ControlType.String, title: "Titel 5", defaultValue: "Hochzeit" },
    image6: { type: ControlType.ResponsiveImage, title: "Bild 6" },
    title6: { type: ControlType.String, title: "Titel 6", defaultValue: "Baby" },
    autoplay: { type: ControlType.Boolean, title: "Autoplay", defaultValue: true },
    interval: { type: ControlType.Number, title: "Intervall", defaultValue: 5, min: 2, max: 15, step: 0.5, unit: "s", hidden: (p) => !p.autoplay },
    duration: { type: ControlType.Number, title: "Übergang", defaultValue: 1.6, min: 0.4, max: 4, step: 0.1, unit: "s" },
    strength: { type: ControlType.Number, title: "Flüssigkeit", defaultValue: 0.6, min: 0, max: 1.5, step: 0.05 },
    zoom: { type: ControlType.Number, title: "Zoom", defaultValue: 1, min: 1, max: 1.6, step: 0.01 },
    focusY: { type: ControlType.Number, title: "Fokus Y", defaultValue: 0.5, min: 0, max: 1, step: 0.01 },
    zoom1: { type: ControlType.Number, title: "Zoom 1", defaultValue: 0, min: 0, max: 2, step: 0.01, description: "0 = allgemeiner Zoom" },
    fx1: { type: ControlType.Number, title: "Fokus X 1", defaultValue: 0.5, min: 0, max: 1, step: 0.01 },
    fy1: { type: ControlType.Number, title: "Fokus Y 1", defaultValue: -1, min: -1, max: 1, step: 0.01, description: "-1 = allgemeiner Fokus Y" },
    zoom2: { type: ControlType.Number, title: "Zoom 2", defaultValue: 0, min: 0, max: 2, step: 0.01, description: "0 = allgemeiner Zoom" },
    fx2: { type: ControlType.Number, title: "Fokus X 2", defaultValue: 0.5, min: 0, max: 1, step: 0.01 },
    fy2: { type: ControlType.Number, title: "Fokus Y 2", defaultValue: -1, min: -1, max: 1, step: 0.01, description: "-1 = allgemeiner Fokus Y" },
    zoom3: { type: ControlType.Number, title: "Zoom 3", defaultValue: 0, min: 0, max: 2, step: 0.01, description: "0 = allgemeiner Zoom" },
    fx3: { type: ControlType.Number, title: "Fokus X 3", defaultValue: 0.5, min: 0, max: 1, step: 0.01 },
    fy3: { type: ControlType.Number, title: "Fokus Y 3", defaultValue: -1, min: -1, max: 1, step: 0.01, description: "-1 = allgemeiner Fokus Y" },
    zoom4: { type: ControlType.Number, title: "Zoom 4", defaultValue: 0, min: 0, max: 2, step: 0.01, description: "0 = allgemeiner Zoom" },
    fx4: { type: ControlType.Number, title: "Fokus X 4", defaultValue: 0.5, min: 0, max: 1, step: 0.01 },
    fy4: { type: ControlType.Number, title: "Fokus Y 4", defaultValue: -1, min: -1, max: 1, step: 0.01, description: "-1 = allgemeiner Fokus Y" },
    zoom5: { type: ControlType.Number, title: "Zoom 5", defaultValue: 0, min: 0, max: 2, step: 0.01, description: "0 = allgemeiner Zoom" },
    fx5: { type: ControlType.Number, title: "Fokus X 5", defaultValue: 0.5, min: 0, max: 1, step: 0.01 },
    fy5: { type: ControlType.Number, title: "Fokus Y 5", defaultValue: -1, min: -1, max: 1, step: 0.01, description: "-1 = allgemeiner Fokus Y" },
    zoom6: { type: ControlType.Number, title: "Zoom 6", defaultValue: 0, min: 0, max: 2, step: 0.01, description: "0 = allgemeiner Zoom" },
    fx6: { type: ControlType.Number, title: "Fokus X 6", defaultValue: 0.5, min: 0, max: 1, step: 0.01 },
    fy6: { type: ControlType.Number, title: "Fokus Y 6", defaultValue: -1, min: -1, max: 1, step: 0.01, description: "-1 = allgemeiner Fokus Y" },
    accent: { type: ControlType.Color, title: "Akzent", defaultValue: "#2B2BF2" },
    frameWidth: { type: ControlType.Number, title: "Rahmen", defaultValue: 3, min: 0, max: 8, step: 1, unit: "px" },
    showThumbs: { type: ControlType.Boolean, title: "Vorschaubilder", defaultValue: true },
})
