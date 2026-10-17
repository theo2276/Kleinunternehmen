import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

/**
 * Zeitstrahl – vertical history timeline. A centre line fills with the accent colour
 * while scrolling, each station's dot lights up when the line reaches it, and the
 * station photo "focuses" from blurred to sharp. Zig-zag on wide screens, single
 * column with the line on the left on phones.
 *
 * @framerSupportedLayoutWidth fill
 * @framerSupportedLayoutHeight auto
 */

type Station = { datum: string; titel: string; text: string; bild?: any; alt?: string }

const U = "https://framerusercontent.com/images/"
const DEFAULT: Station[] = [
    {
        datum: "Vor über 30 Jahren",
        titel: "Die FotoStube Heiko Hornig",
        text: "Heiko Hornig gründet das Studio in der Bühlstraße. Daraus wird eine feste Größe in der Göttinger Fotografenszene.",
        bild: `${U}nhmDqQkJsjrvqjbb63GnkgOoWo.jpg`,
        alt: "Das gelbe Eckhaus der FotoStube Hornig in der Bühlstraße 38",
    },
    {
        datum: "1. März 2015",
        titel: "Übergabe an Sebastian Kassner",
        text: "Der langjährige Mitarbeiter übernimmt die FotoStube – und führt sie unter ihrem bekannten Namen weiter.",
        bild: `${U}2irzEuB9LzYsqhoivqQcaPp0mX0.jpg`,
        alt: "Sebastian Kassner mit Kamera",
    },
    {
        datum: "Heute",
        titel: "Fotografenmeister",
        text: "Zertifiziert für das elektronische Passfoto. Vom Passbild bis zur Hochzeit – im Studio, bei Ihnen zu Hause oder draußen.",
        bild: `${U}So1QTzLyiMgSBlXSAPmPihGxt7s.jpg`,
        alt: "Shooting im Studio der FotoStube Hornig",
    },
]

const src = (b: any): string => (typeof b === "string" ? b : b && typeof b.src === "string" ? b.src : "")

export default function Zeitstrahl(props: any) {
    const { stationen, schrift, akzent, papier, linie, style } = props
    const liste: Station[] = Array.isArray(stationen) && stationen.length ? stationen : DEFAULT
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    const box = React.useRef<HTMLDivElement>(null)
    const knoten = React.useRef<(HTMLDivElement | null)[]>([])
    const [fort, setFort] = React.useState(isCanvas ? 1 : 0) // 0..1 fill of the line
    const [aktiv, setAktiv] = React.useState<boolean[]>(liste.map(() => isCanvas))
    const [schmal, setSchmal] = React.useState(false)

    React.useEffect(() => {
        const el = box.current
        if (!el) return
        const ro = new ResizeObserver(() => setSchmal(el.offsetWidth < 760))
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    React.useEffect(() => {
        if (isCanvas) return
        const el = box.current
        if (!el) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setFort(1)
            setAktiv(liste.map(() => true))
            return
        }
        let raf = 0
        const messen = () => {
            raf = 0
            const r = el.getBoundingClientRect()
            const ziel = window.innerHeight * 0.62 // the "reading line"
            const f = Math.max(0, Math.min(1, (ziel - r.top) / r.height))
            setFort(f)
            setAktiv(
                knoten.current.map((k) => {
                    if (!k) return false
                    const kr = k.getBoundingClientRect()
                    return kr.top + kr.height / 2 <= ziel
                })
            )
        }
        const anfordern = () => {
            if (!raf) raf = requestAnimationFrame(messen)
        }
        messen()
        window.addEventListener("scroll", anfordern, { passive: true })
        window.addEventListener("resize", anfordern)
        return () => {
            window.removeEventListener("scroll", anfordern)
            window.removeEventListener("resize", anfordern)
            if (raf) cancelAnimationFrame(raf)
        }
    }, [isCanvas, liste.length])

    const linieX = schmal ? 11 : "50%"

    return (
        <div ref={box} style={{ ...style, position: "relative", width: "100%", fontFamily: schrift, color: papier }}>
            {/* track + fill */}
            <div aria-hidden style={{ position: "absolute", top: 0, bottom: 0, left: linieX, width: 2, marginLeft: -1, background: linie, borderRadius: 2 }} />
            <div
                aria-hidden
                style={{
                    position: "absolute", top: 0, left: linieX, width: 2, marginLeft: -1, borderRadius: 2,
                    height: `${fort * 100}%`, background: `linear-gradient(to bottom, color-mix(in srgb, ${akzent} 0%, transparent), ${akzent} 80px)`,
                    boxShadow: `0 0 14px ${akzent}`, transition: "height .12s linear",
                }}
            />

            <ol style={{ listStyle: "none", margin: 0, padding: schmal ? "8px 0 8px 44px" : "40px 0", display: "flex", flexDirection: "column", gap: schmal ? 64 : 120 }}>
                {liste.map((s, i) => {
                    const an = aktiv[i]
                    const rechts = i % 2 === 1 // zig-zag: text right, photo left
                    const bild = src(s.bild)
                    const text = (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: schmal ? "left" : rechts ? "left" : "right", alignItems: schmal ? "flex-start" : rechts ? "flex-start" : "flex-end", opacity: an ? 1 : 0.45, transform: an ? "none" : "translateY(16px)", transition: "opacity .7s ease, transform .7s cubic-bezier(.2,.7,.2,1)" }}>
                            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.02em", color: akzent }}>{s.datum}</span>
                            <span style={{ fontSize: schmal ? 26 : 34, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 440, ...({ textWrap: "balance" } as any) }}>{s.titel}</span>
                            <span style={{ fontSize: schmal ? 16 : 17, lineHeight: 1.55, maxWidth: 420, color: "rgba(246,241,233,0.72)" }}>{s.text}</span>
                        </div>
                    )
                    const foto = bild ? (
                        <div style={{ display: "flex", justifyContent: schmal ? "flex-start" : rechts ? "flex-end" : "flex-start" }}>
                            <figure
                                style={{
                                    margin: 0, padding: 10, paddingBottom: 12, background: "#F6F1E9", borderRadius: 3,
                                    width: schmal ? "min(100%, 320px)" : 360, boxShadow: "0 28px 60px rgba(0,0,0,0.45)",
                                    transform: `rotate(${rechts ? 2 : -2}deg) translateY(${an ? 0 : 24}px)`,
                                    transition: "transform 1s cubic-bezier(.2,.7,.2,1)",
                                }}
                            >
                                <img
                                    src={bild}
                                    alt={s.alt || s.titel}
                                    loading="lazy"
                                    draggable={false}
                                    style={{
                                        display: "block", width: "100%", height: "auto", borderRadius: 1,
                                        filter: an ? "blur(0px) saturate(1)" : "blur(10px) saturate(0.6)",
                                        transition: "filter 1.1s cubic-bezier(.2,.7,.2,1)",
                                    }}
                                />
                            </figure>
                        </div>
                    ) : null

                    const punkt = (
                        <div
                            ref={(el) => { knoten.current[i] = el }}
                            aria-hidden
                            style={{
                                position: "absolute", top: schmal ? 4 : "50%", left: schmal ? 11 - 44 : "50%",
                                width: 18, height: 18, marginLeft: -9, marginTop: schmal ? 0 : -9, borderRadius: 18,
                                background: an ? akzent : "#0E0D0C", border: `2px solid ${an ? akzent : "rgba(246,241,233,0.35)"}`,
                                boxShadow: an ? `0 0 0 6px color-mix(in srgb, ${akzent} 20%, transparent), 0 0 22px ${akzent}` : "none",
                                transition: "background .4s, border-color .4s, box-shadow .6s",
                            }}
                        />
                    )

                    return (
                        <li key={i} style={{ position: "relative" }}>
                            {punkt}
                            {schmal ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                    {text}
                                    {foto}
                                </div>
                            ) : (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 120, alignItems: "center" }}>
                                    {rechts ? foto : text}
                                    {rechts ? text : foto}
                                </div>
                            )}
                        </li>
                    )
                })}
            </ol>
        </div>
    )
}

Zeitstrahl.defaultProps = {
    stationen: [],
    schrift: '"Familjen Grotesk", sans-serif',
    akzent: "#EBA800",
    papier: "#F6F1E9",
    linie: "rgba(246,241,233,0.14)",
}

addPropertyControls(Zeitstrahl, {
    stationen: {
        type: ControlType.Array,
        title: "Stationen",
        description: "Leer lassen = die drei Stationen der FotoStube.",
        control: {
            type: ControlType.Object,
            controls: {
                datum: { type: ControlType.String, title: "Datum" },
                titel: { type: ControlType.String, title: "Titel" },
                text: { type: ControlType.String, title: "Text", displayTextArea: true },
                bild: { type: ControlType.ResponsiveImage, title: "Bild" },
                alt: { type: ControlType.String, title: "Bildbeschreibung" },
            },
        },
    },
    schrift: { type: ControlType.String, title: "Schrift", defaultValue: '"Familjen Grotesk", sans-serif' },
    akzent: { type: ControlType.Color, title: "Akzent", defaultValue: "#EBA800" },
    papier: { type: ControlType.Color, title: "Text", defaultValue: "#F6F1E9" },
    linie: { type: ControlType.Color, title: "Linie", defaultValue: "rgba(246,241,233,0.14)" },
})
