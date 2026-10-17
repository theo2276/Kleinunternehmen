import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

/**
 * Intro – loading intro for the home page: a camera aperture turns (focusing),
 * a studio flash fires, then the aperture opens towards the viewer and reveals the page.
 * Pure CSS animation, so it starts with the first paint (before hydration).
 * Shown once per browser session; click skips; reduced motion = quick fade.
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */

const KEY = "fsh-intro-gesehen"

function blendePfade(farbe: string) {
    const n = 7, R = 50, r = 17, cx = 50, cy = 50, rot = -0.35
    const P = Array.from({ length: n }, (_, i) => {
        const a = rot + (i * 2 * Math.PI) / n
        return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
    })
    const hit = (A: number[], B: number[]) => {
        const dx = B[0] - A[0], dy = B[1] - A[1], fx = A[0] - cx, fy = A[1] - cy
        const a = dx * dx + dy * dy, b = 2 * (fx * dx + fy * dy), c = fx * fx + fy * fy - R * R
        const t = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a)
        return [A[0] + t * dx, A[1] + t * dy]
    }
    const Q = P.map((p, i) => hit(p, P[(i + 1) % n]))
    const f = (v: number) => v.toFixed(2)
    return P.map((_, i) => {
        const a = P[(i + 1) % n], q1 = Q[i], q2 = Q[(i + 1) % n], b = P[(i + 2) % n]
        return (
            <path key={i} d={`M${f(a[0])} ${f(a[1])} L${f(q1[0])} ${f(q1[1])} A${R} ${R} 0 0 1 ${f(q2[0])} ${f(q2[1])} L${f(b[0])} ${f(b[1])} Z`}
                fill={farbe} fillOpacity={i % 2 ? 0.82 : 1} stroke="#0E0D0C" strokeWidth={0.7} strokeLinejoin="round" />
        )
    })
}

const CSS = `
.fsh-intro { position: fixed; inset: 0; z-index: 2147483000; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 28px;
  background: #0E0D0C; pointer-events: auto; animation: fshBg 1.85s cubic-bezier(.7,0,.2,1) forwards; }
.fsh-intro .blende { width: min(34vw, 220px); aspect-ratio: 1; animation: fshBlende 1.85s cubic-bezier(.6,0,.2,1) forwards; will-change: transform, opacity; }
.fsh-intro .blende svg { width: 100%; height: 100%; display: block; overflow: visible; }
.fsh-intro .marke { font-weight: 700; font-size: clamp(22px, 3.2vw, 34px); letter-spacing: -0.03em; color: #F6F1E9; animation: fshMarke 1.85s ease forwards; }
.fsh-intro .unter { font-weight: 600; font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase; color: #EBA800; margin-top: -18px; animation: fshMarke 1.85s ease forwards; }
.fsh-intro .blitz { position: absolute; inset: 0; background: #fff; opacity: 0; pointer-events: none; animation: fshBlitz 1.85s linear forwards; }
@keyframes fshBlende {
  0% { transform: rotate(-70deg) scale(.86); opacity: 0; }
  18% { opacity: 1; }
  52% { transform: rotate(0deg) scale(1); opacity: 1; }
  62% { transform: rotate(8deg) scale(1.04); opacity: 1; }
  100% { transform: rotate(40deg) scale(14); opacity: 0; }
}
@keyframes fshMarke { 0% { opacity: 0; transform: translateY(8px); } 22% { opacity: 1; transform: none; } 55% { opacity: 1; } 68% { opacity: 0; } 100% { opacity: 0; } }
@keyframes fshBlitz { 0%, 54% { opacity: 0; } 57% { opacity: .85; } 66% { opacity: 0; } 100% { opacity: 0; } }
@keyframes fshBg { 0%, 62% { background-color: rgba(14,13,12,1); visibility: visible; } 99% { background-color: rgba(14,13,12,0); visibility: visible; } 100% { background-color: rgba(14,13,12,0); visibility: hidden; pointer-events: none; } }
@media (prefers-reduced-motion: reduce) {
  .fsh-intro, .fsh-intro .blende, .fsh-intro .marke, .fsh-intro .unter, .fsh-intro .blitz { animation: none !important; }
  .fsh-intro { animation: fshRuhig .6s ease .2s forwards !important; }
  .fsh-intro .blitz { display: none; }
}
@keyframes fshRuhig { to { opacity: 0; visibility: hidden; pointer-events: none; } }
.fsh-intro.weg { display: none !important; }
`

export default function Intro(props: any) {
    const { farbe, unterzeile, style } = props
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const [weg, setWeg] = React.useState(false)

    React.useEffect(() => {
        if (isCanvas) return
        let gesehen = false
        try {
            gesehen = sessionStorage.getItem(KEY) === "1"
            sessionStorage.setItem(KEY, "1")
        } catch {}
        if (gesehen) { setWeg(true); return }
        const t = window.setTimeout(() => setWeg(true), 2000)
        return () => window.clearTimeout(t)
    }, [isCanvas])

    if (isCanvas) {
        return (
            <div style={{ ...style, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(14,13,12,0.85)", color: "#EBA800", fontSize: 12, fontWeight: 700, borderRadius: 6 }}>
                Lade-Intro
            </div>
        )
    }

    return (
        <div aria-hidden={true} className={"fsh-intro" + (weg ? " weg" : "")} onClick={() => setWeg(true)}>
            <style>{CSS}</style>
            <div className="blende">
                <svg viewBox="-2 -2 104 104">
                    <circle cx="50" cy="50" r="51.5" fill="none" stroke={farbe} strokeOpacity={0.35} strokeWidth={0.8} />
                    {blendePfade(farbe)}
                </svg>
            </div>
            <div className="marke">FotoStube Hornig</div>
            {unterzeile && <div className="unter">{unterzeile}</div>}
            <div className="blitz" />
        </div>
    )
}

Intro.defaultProps = { farbe: "#EBA800", unterzeile: "Fotostudio · Göttingen" }

addPropertyControls(Intro, {
    farbe: { type: ControlType.Color, title: "Blende", defaultValue: "#EBA800" },
    unterzeile: { type: ControlType.String, title: "Unterzeile", defaultValue: "Fotostudio · Göttingen" },
})
