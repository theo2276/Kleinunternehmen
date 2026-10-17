import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { useEffect, useRef, useState, startTransition, type CSSProperties } from "react"

type FormatId = "A4" | "A3" | "A2" | "A1" | "A0"

interface Format {
    id: FormatId
    w: number // mm
    h: number // mm
    a4: number // how many A4 sheets fit
    passt: string[]
    preise: [string, string][]
}

interface FormatskalaProps {
    tonerHell: string
    linie: string
    gelb: string
    toner: string
    preiseLink: string
    style?: CSSProperties
}

const SANS = '"Instrument Sans", "Instrument Sans Placeholder", system-ui, sans-serif'
const SERIF = '"Fraunces", "Fraunces Placeholder", Georgia, serif'
const WIDE = '"Unbounded", "Unbounded Placeholder", sans-serif'

// prices from copyteam's price lists
const FORMATS: Format[] = [
    { id: "A0", w: 841, h: 1189, a4: 16, passt: ["Wissenschaftliche Poster", "Baupläne", "Messe- und Konferenzposter"],
      preise: [["Plot im Sofortdruck", "ab 30,00 €"], ["CAD-Druck (A0+)", "ab 9,00 €"], ["Überformat & Langformat bis 30 m", "auf Anfrage"]] },
    { id: "A1", w: 594, h: 841, a4: 8, passt: ["Poster & Plakate", "Pläne", "Präsentationen"],
      preise: [["Plot im Sofortdruck", "ab 20,00 €"], ["CAD-Druck", "ab 5,00 €"]] },
    { id: "A2", w: 420, h: 594, a4: 4, passt: ["Plakate", "Veranstaltungsposter", "Kalender"],
      preise: [["Plot im Sofortdruck", "ab 12,00 €"], ["CAD-Druck", "ab 2,50 €"]] },
    { id: "A3", w: 297, h: 420, a4: 2, passt: ["Kleine Plakate", "Speisekarten", "Aushänge"],
      preise: [["Laminieren", "ab 2,90 €"], ["Drucke & Kopien A3", "auf Anfrage"]] },
    { id: "A4", w: 210, h: 297, a4: 1, passt: ["Haus- und Abschlussarbeiten", "Flyer", "Briefe & Bewerbungen"],
      preise: [["Kopie / Druck s/w", "ab 4 ct"], ["Druck Farbe (Serie)", "ab 20 ct"], ["Laminieren", "ab 1,50 €"]] },
]

/**
 * Formatskala – the DIN A series drawn to scale as nested sheets (A4…A0).
 * Hover or tap a sheet to see its size, how many A4 sheets fit, typical uses
 * and the matching prices. Sheets grow in one by one when scrolled into view.
 *
 * @framerIntrinsicWidth 1216
 * @framerIntrinsicHeight 600
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function Formatskala(props: FormatskalaProps) {
    const {
        tonerHell = "#FFFFFF",
        linie = "rgba(255,255,255,0.45)",
        gelb = "#FFE500",
        toner = "#111111",
        preiseLink = "/preise",
    } = props
    const [sel, setSel] = useState<FormatId>("A2")
    const [hover, setHover] = useState<FormatId | null>(null)
    const [shown, setShown] = useState(RenderTarget.current() === RenderTarget.canvas)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (typeof window === "undefined" || shown) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
            startTransition(() => setShown(true))
            return
        }
        const el = ref.current
        if (!el) return
        const io = new IntersectionObserver((entries) => {
            if (entries.some((e) => e.isIntersecting)) {
                startTransition(() => setShown(true))
                io.disconnect()
            }
        }, { threshold: 0.3 })
        io.observe(el)
        return () => io.disconnect()
    }, [shown])

    const active = hover ?? sel
    const A0 = FORMATS[0]
    const pick = (id: FormatId) => startTransition(() => setSel(id))

    return (
        <div ref={ref} style={{ ...props.style, position: "relative", width: "100%", display: "flex", flexWrap: "wrap", gap: "40px 72px", alignItems: "flex-start" }}>
            {/* Bögen */}
            <div style={{ flex: "0 1 auto", minWidth: 0 }}>
                <svg
                    viewBox={`-4 -4 ${A0.w + 8} ${A0.h + 8}`}
                    role="group"
                    aria-label="DIN-A-Formate maßstabsgetreu"
                    onMouseLeave={() => startTransition(() => setHover(null))}
                    style={{ display: "block", height: "clamp(320px, 46vw, 560px)", width: "auto", maxWidth: "100%", overflow: "visible" }}
                >
                    {FORMATS.map((x, i) => {
                        const on = x.id === active
                        const inner = i > FORMATS.findIndex((y) => y.id === active) // smaller sheet lying on the yellow one
                        const delay = (FORMATS.length - 1 - i) * 0.12
                        return (
                            <g
                                key={x.id}
                                role="button"
                                tabIndex={0}
                                aria-label={`${x.id}, ${x.w} × ${x.h} mm`}
                                aria-pressed={x.id === sel}
                                onMouseEnter={() => startTransition(() => setHover(x.id))}
                                onClick={() => pick(x.id)}
                                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pick(x.id)}
                                style={{
                                    cursor: "pointer",
                                    outline: "none",
                                    transformOrigin: `0px ${A0.h}px`,
                                    transform: shown ? "scale(1)" : "scale(0.15)",
                                    opacity: shown ? 1 : 0,
                                    transition: `transform .9s cubic-bezier(.2,.8,.2,1) ${delay}s, opacity .5s ease ${delay}s`,
                                }}
                            >
                                <rect
                                    x={0}
                                    y={A0.h - x.h}
                                    width={x.w}
                                    height={x.h}
                                    fill={on ? gelb : inner ? "rgba(17,17,17,0.04)" : x.id === "A4" ? "rgba(255,229,0,0.12)" : "rgba(255,255,255,0.015)"}
                                    stroke={on ? gelb : inner ? "rgba(17,17,17,0.45)" : linie}
                                    strokeWidth={on ? 4 : 2}
                                    vectorEffect="non-scaling-stroke"
                                    style={{ transition: "fill .25s, stroke .25s" }}
                                />
                                <text
                                    x={x.w - 18}
                                    y={A0.h - x.h + (x.id === "A0" ? 70 : x.id === "A4" ? 44 : 56)}
                                    textAnchor="end"
                                    style={{ fontFamily: WIDE, fontWeight: 800, fontSize: x.id === "A0" ? 64 : x.id === "A4" ? 36 : 46, letterSpacing: "-0.03em", fill: on || inner ? toner : x.id === "A0" ? gelb : tonerHell, transition: "fill .25s", pointerEvents: "none" }}
                                >
                                    {x.id}
                                </text>
                            </g>
                        )
                    })}
                </svg>
            </div>

            {/* Info */}
            <div aria-live="polite" style={{ flex: "1 1 340px", minWidth: 0, display: "flex", flexDirection: "column", gap: 24, color: tonerHell }}>
                <div role="tablist" aria-label="Format wählen" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {[...FORMATS].reverse().map((x) => {
                        const on = x.id === active
                        return (
                            <button key={x.id} type="button" role="tab" aria-selected={x.id === sel} onClick={() => pick(x.id)}
                                onMouseEnter={() => startTransition(() => setHover(x.id))} onMouseLeave={() => startTransition(() => setHover(null))}
                                style={{ fontFamily: SANS, fontWeight: 600, fontSize: 15, padding: "9px 16px", borderRadius: 100, cursor: "pointer",
                                    border: `1px solid ${on ? gelb : "rgba(255,255,255,0.3)"}`, background: on ? gelb : "transparent", color: on ? toner : tonerHell, transition: "background .2s, color .2s" }}>
                                {x.id}
                            </button>
                        )
                    })}
                </div>

                {/* All formats share a grid cell so the tallest reserves space at every width. */}
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", minWidth: 0 }}>
                    {FORMATS.map((f) => (
                        <div key={f.id} aria-hidden={f.id !== active}
                            style={{ gridArea: "1 / 1", minWidth: 0, alignSelf: "start", display: "flex", flexDirection: "column", gap: 24,
                                visibility: f.id === active ? "visible" : "hidden", pointerEvents: f.id === active ? "auto" : "none" }}>
                            <div style={{ display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap" }}>
                                <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(56px, 7vw, 88px)", lineHeight: 0.9, letterSpacing: "-0.04em", color: gelb }}>{f.id}</span>
                                <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 20, fontVariantNumeric: "tabular-nums" }}>{f.w} × {f.h} mm</span>
                                    <span style={{ fontFamily: SANS, fontSize: 15, opacity: 0.65 }}>{f.a4 === 1 ? "das Standardblatt" : `so groß wie ${f.a4} A4-Blätter`}</span>
                                </span>
                            </div>
            
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase", color: gelb }}>Passt für</span>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {f.passt.map((p) => (
                                        <span key={p} style={{ fontFamily: SANS, fontSize: 14, padding: "7px 12px", borderRadius: 100, background: "rgba(255,255,255,0.08)" }}>{p}</span>
                                    ))}
                                </div>
                            </div>
            
                            <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(255,255,255,0.14)" }}>
                                {/* Keep three row slots, including an invisible slot for two-price formats. */}
                                {Array.from({ length: Math.max(...FORMATS.map((format) => format.preise.length)) }, (_, rowIndex) => {
                                    const row = f.preise[rowIndex]
                                    return (
                                        <div key={rowIndex} aria-hidden={!row}
                                            style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "14px 0", minHeight: 53,
                                                boxSizing: "border-box", flexShrink: 0, lineHeight: "24px", visibility: row && f.id === active ? "visible" : "hidden",
                                                borderBottom: "1px solid rgba(255,255,255,0.14)" }}>
                                            <span style={{ fontFamily: SANS, fontSize: 16 }}>{row?.[0] ?? "\u00a0"}</span>
                                            <span style={{ fontFamily: SANS, fontSize: 16, fontWeight: 600, color: gelb, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{row?.[1] ?? "\u00a0"}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <a href={preiseLink} style={{ alignSelf: "flex-start", fontFamily: SANS, fontWeight: 600, fontSize: 15, color: toner, background: gelb, borderRadius: 100, padding: "15px 24px", textDecoration: "none" }}>
                    Alle Preise im Preisfinder
                </a>
            </div>
        </div>
    )
}

addPropertyControls(Formatskala, {
    tonerHell: { type: ControlType.Color, title: "Text", defaultValue: "#FFFFFF" },
    linie: { type: ControlType.Color, title: "Linien", defaultValue: "rgba(255,255,255,0.45)" },
    gelb: { type: ControlType.Color, title: "Akzent", defaultValue: "#FFE500" },
    toner: { type: ControlType.Color, title: "Toner", defaultValue: "#111111" },
    preiseLink: { type: ControlType.Link, title: "Preise-Link", defaultValue: "/preise" },
})
