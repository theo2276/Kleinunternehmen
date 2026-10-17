import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { useEffect, useState, startTransition, type CSSProperties } from "react"

interface LadeIntroProps {
    papier: string
    toner: string
    gelb: string
    cyan: string
    magenta: string
    logo: string
    zeile: string
    einmalProBesuch: boolean
    style?: CSSProperties
}

const KEY = "copyteam-intro-gesehen"
const TOTAL_MS = 2400

/**
 * LadeIntro – CMYK dots fly in, slide into register (Passer) and turn into one
 * black dot, which grows into a black sheet with the yellow wordmark; the sheet
 * then slides up and reveals the page. The whole sequence is pure CSS so it runs
 * from the first paint, even before hydration, and always ends by itself.
 * JS only skips it on repeat visits, on click and for reduced motion.
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function LadeIntro(props: LadeIntroProps) {
    const {
        papier = "#F7F5F0",
        toner = "#111111",
        gelb = "#FFE500",
        cyan = "#00A3E0",
        magenta = "#E6007E",
        logo = "copyteam",
        zeile = "Kopien & Digitaldrucke · seit 1985",
        einmalProBesuch = true,
    } = props
    const [done, setDone] = useState(false)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    useEffect(() => {
        if (typeof window === "undefined") return
        let seen = false
        try {
            seen = einmalProBesuch && window.sessionStorage.getItem(KEY) === "1"
            window.sessionStorage.setItem(KEY, "1")
        } catch (e) {
            seen = false
        }
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (seen || reduce) {
            startTransition(() => setDone(true))
            return
        }
        const id = window.setTimeout(() => startTransition(() => setDone(true)), TOTAL_MS)
        return () => window.clearTimeout(id)
    }, [einmalProBesuch])

    // never block the canvas
    if (isCanvas || done) return null

    const dot = 18
    const dots = [
        { c: cyan, from: "-38vw, -30vh", row: -33 },
        { c: magenta, from: "38vw, -30vh", row: -11 },
        { c: gelb, from: "-38vw, 30vh", row: 11 },
        { c: toner, from: "38vw, 30vh", row: 33 },
    ]

    const css = `
@keyframes ctOut { 0% { transform: translateY(0); visibility: visible } 99% { visibility: visible } 100% { transform: translateY(-100%); visibility: hidden } }
@keyframes ctFill { 0% { transform: translate(-50%,-50%) scale(0) } 18% { transform: translate(-50%,-50%) scale(1) } 100% { transform: translate(-50%,-50%) scale(220) } }
@keyframes ctLogo { 0% { opacity: 0; transform: translateY(14px) } 100% { opacity: 1; transform: translateY(0) } }
${dots
    .map(
        (d, i) => `@keyframes ctDot${i} {
  0% { transform: translate(-50%,-50%) translate(${d.from}) scale(.2); opacity: 0 }
  12% { opacity: 1 }
  45% { transform: translate(-50%,-50%) translate(${d.row}px, 0) scale(1); opacity: 1 }
  62% { transform: translate(-50%,-50%) translate(${d.row}px, 0) scale(1); opacity: 1 }
  100% { transform: translate(-50%,-50%) translate(0, 0) scale(1); opacity: 1 }
}`
    )
    .join("\n")}
.ct-intro { animation: ctOut .6s cubic-bezier(.76,0,.24,1) 1.75s forwards }
@media (prefers-reduced-motion: reduce) { .ct-intro { display: none } }
`

    return (
        <div style={{ ...props.style, position: "relative", width: "100%", height: "100%", pointerEvents: "none" }}>
            <style>{css}</style>
            <div
                className="ct-intro"
                role="presentation"
                onClick={() => startTransition(() => setDone(true))}
                style={{ position: "absolute", inset: 0, background: papier, overflow: "hidden", pointerEvents: "auto", cursor: "pointer" }}
            >
                {dots.map((d, i) => (
                    <span
                        key={i}
                        style={{
                            position: "absolute", left: "50%", top: "50%", width: dot, height: dot, borderRadius: dot, background: d.c,
                            mixBlendMode: "multiply", opacity: 0,
                            animation: `ctDot${i} .85s cubic-bezier(.65,0,.35,1) ${i * 0.06}s forwards`,
                        }}
                    />
                ))}
                {/* black sheet growing out of the registered dot */}
                <span
                    style={{
                        position: "absolute", left: "50%", top: "50%", width: dot, height: dot, borderRadius: "50%", background: toner,
                        transform: "translate(-50%,-50%) scale(0)", animation: "ctFill .6s cubic-bezier(.7,0,.3,1) .9s forwards",
                    }}
                />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 24, textAlign: "center" }}>
                    <span style={{ fontFamily: '"Unbounded", "Unbounded Placeholder", sans-serif', fontWeight: 800, fontSize: "clamp(44px, 9vw, 112px)", lineHeight: 1, letterSpacing: "-0.04em", color: gelb, opacity: 0, animation: "ctLogo .5s cubic-bezier(.2,.8,.2,1) 1.15s forwards" }}>
                        {logo}
                    </span>
                    <span style={{ fontFamily: '"Instrument Sans", "Instrument Sans Placeholder", sans-serif', fontWeight: 600, fontSize: "clamp(13px, 1.6vw, 16px)", letterSpacing: "0.02em", color: "rgba(255,255,255,0.75)", opacity: 0, animation: "ctLogo .5s cubic-bezier(.2,.8,.2,1) 1.28s forwards" }}>
                        {zeile}
                    </span>
                </div>
            </div>
        </div>
    )
}

addPropertyControls(LadeIntro, {
    logo: { type: ControlType.String, title: "Logo", defaultValue: "copyteam" },
    zeile: { type: ControlType.String, title: "Zeile", defaultValue: "Kopien & Digitaldrucke · seit 1985" },
    einmalProBesuch: { type: ControlType.Boolean, title: "Nur 1× pro Besuch", defaultValue: true },
    papier: { type: ControlType.Color, title: "Papier", defaultValue: "#F7F5F0" },
    toner: { type: ControlType.Color, title: "Toner", defaultValue: "#111111" },
    gelb: { type: ControlType.Color, title: "Gelb", defaultValue: "#FFE500" },
    cyan: { type: ControlType.Color, title: "Cyan", defaultValue: "#00A3E0" },
    magenta: { type: ControlType.Color, title: "Magenta", defaultValue: "#E6007E" },
})
