import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

/**
 * Filmrolle – a subtle 35 mm film strip running down the page in the background.
 * Sprocket holes on both sides, every few frames a (desaturated) gallery photo,
 * the strip travels with the scroll (slower than the page) plus a slow drift.
 * Meant to sit absolutely positioned behind section content (zIndex 0).
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */

const U = "https://framerusercontent.com/images/"
const DEFAULT = [
    "flO7T4M4sMQgJZ0O3gzccOMI7y4", "rDQttS4bFbt5nY6U9NU7ouQJR0U", "EZ7TarLhKuDyiGB35YNUUhuwU",
    "AnSA78w7ZTMnxLzYhzwLkPMGKA", "slFyPO8M51dui5BxkuXeqPCU24", "UOWPITZGL0zpepyTfjHYVlV4mM",
    "7A9pH0QMH9CAzJ6LTE16qNTAVK0", "jMPRZcFggMwPDSc0axVLTmGxWk", "Nt5o0b4owczfmaDjCz7kYXP6C4",
    "1jbeMm9ajfztiRMKhWXEhKwKLlg", "eDinIruoffz3dsqSlZrVCwb2zSo", "qnc3hZzmmv4z2VRFVh0NsmnU",
].map((id) => `${U}${id}.jpg`)

// soft fade where the strip begins and ends
const FADE = "linear-gradient(to bottom, transparent 0px, #000 120px, #000 calc(100% - 160px), transparent 100%)"

// which frames carry a photo: pattern repeats, leaves dark empty frames in between
const MUSTER = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1]

function urlOf(item: any): string | null {
    if (!item) return null
    if (typeof item === "string") return item
    if (typeof item.src === "string") return item.src
    for (const k of Object.keys(item)) {
        const v = item[k]
        if (v && typeof v === "object" && typeof v.src === "string") return v.src
    }
    return null
}

export default function Filmrolle(props: any) {
    const { bilder, breite, start, deckkraft, drehung, tempo, parallax, vorFusszeile, zeiten, schrift, style } = props
    // opening hours printed into some empty frames: "MO–FR|10–18" entries separated by ";"
    const zeitFelder = React.useMemo(
        () => String(zeiten || "").split(";").map((t) => t.split("|").map((x) => x.trim())).filter((t) => t[0]),
        [zeiten]
    )
    const urls = React.useMemo(() => {
        const l = (Array.isArray(bilder) ? bilder : []).map(urlOf).filter(Boolean) as string[]
        return l.length ? l : DEFAULT
    }, [bilder])
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const strip = React.useRef<HTMLDivElement>(null)
    const root = React.useRef<HTMLDivElement>(null)
    const [endInset, setEndInset] = React.useState(0)

    // stop the strip above the site footer (the footer lives in the layout template,
    // so it is measured in the DOM instead of being a fixed number)
    React.useEffect(() => {
        if (isCanvas || !vorFusszeile) return
        const measure = () => {
            const el = root.current
            const footer = document.querySelector('[data-framer-name="Footer"]') as HTMLElement | null
            if (!el || !footer) return
            const r = el.getBoundingClientRect()
            const f = footer.getBoundingClientRect()
            setEndInset(Math.max(0, Math.round(r.bottom - f.top)))
        }
        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(document.body)
        window.addEventListener("resize", measure)
        return () => {
            ro.disconnect()
            window.removeEventListener("resize", measure)
        }
    }, [isCanvas, vorFusszeile])

    const W = breite
    const band = Math.round(W * 0.14) // sprocket band on each side
    const frameW = W - band * 2
    const frameH = Math.round(frameW * 0.68)
    const gap = Math.round(W * 0.08)
    const step = frameH + gap
    const count = 24
    const setH = step * count

    React.useEffect(() => {
        if (isCanvas) return
        const el = strip.current
        if (!el) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        let raf = 0
        const t0 = performance.now()
        const tick = (now: number) => {
            const drift = ((now - t0) / 1000) * tempo
            const y = -((window.scrollY * parallax + drift) % setH)
            el.style.transform = `translate3d(0, ${y}px, 0)`
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [isCanvas, tempo, parallax, setH])

    const holes = `repeating-linear-gradient(to bottom, transparent 0px, transparent ${Math.round(band * 0.45)}px, rgba(246,241,233,0.55) ${Math.round(band * 0.45)}px, rgba(246,241,233,0.55) ${Math.round(band * 0.45) + Math.round(band * 0.7)}px, transparent ${Math.round(band * 0.45) + Math.round(band * 0.7)}px, transparent ${Math.round(band * 1.6)}px)`

    const frames: React.ReactNode[] = []
    let leer = 0
    for (let k = 0; k < count * 4; k++) {
        const hasPhoto = MUSTER[k % MUSTER.length] === 1
        const u = urls[k % urls.length]
        // every second empty frame carries the opening hours, alternating entries
        let zeit: string[] | null = null
        if (!hasPhoto) {
            if (zeitFelder.length && leer % 2 === 0) zeit = zeitFelder[(leer / 2) % zeitFelder.length]
            leer++
        }
        frames.push(
            <div key={k} style={{ position: "absolute", left: band, top: k * step + gap / 2, width: frameW, height: frameH, borderRadius: 2, overflow: "hidden", background: "#1a1816" }}>
                {hasPhoto && (
                    <img src={u} alt="" loading="lazy" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "grayscale(0.55) sepia(0.25) contrast(1.05) brightness(0.85)" }} />
                )}
                {zeit && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: Math.round(frameW * 0.03), fontFamily: schrift, color: "#EBA800", textTransform: "uppercase", lineHeight: 1, textAlign: "center", background: "radial-gradient(80% 70% at 50% 50%, rgba(235,168,0,0.10), rgba(235,168,0,0) 70%)" }}>
                        <span style={{ fontSize: Math.max(8, Math.round(frameW * 0.11)), fontWeight: 600, letterSpacing: "0.14em", opacity: 0.8 }}>{zeit[0]}</span>
                        {zeit[1] && <span style={{ fontSize: Math.max(11, Math.round(frameW * 0.2)), fontWeight: 700, letterSpacing: "-0.02em" }}>{zeit[1]}</span>}
                        {zeit[2] && <span style={{ fontSize: Math.max(7, Math.round(frameW * 0.08)), fontWeight: 600, letterSpacing: "0.18em", opacity: 0.7 }}>{zeit[2]}</span>}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div ref={root} aria-hidden style={{ ...style, position: "relative", width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: start, bottom: endInset, right: 0, width: W, transform: `rotate(${drehung}deg)`, transformOrigin: "50% 0%", opacity: deckkraft, overflow: "hidden", WebkitMaskImage: FADE, maskImage: FADE }}>
                <div
                    ref={strip}
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: W,
                        height: setH * 4,
                        background: "#0E0D0C",
                        willChange: "transform",
                    }}
                >
                    <div style={{ position: "absolute", left: Math.round(band * 0.3), top: 0, width: Math.round(band * 0.4), height: "100%", background: holes, borderRadius: 2 }} />
                    <div style={{ position: "absolute", right: Math.round(band * 0.3), top: 0, width: Math.round(band * 0.4), height: "100%", background: holes, borderRadius: 2 }} />
                    {frames}
                </div>
            </div>
        </div>
    )
}

Filmrolle.defaultProps = {
    bilder: [],
    breite: 170,
    start: 820,
    deckkraft: 0.55,
    drehung: 1.2,
    tempo: 6,
    parallax: 0.35,
    vorFusszeile: true,
    zeiten: "Mo–Fr|10–18|Uhr; Sa|10–13|Uhr",
    schrift: '"Familjen Grotesk", sans-serif',
}

addPropertyControls(Filmrolle, {
    bilder: { type: ControlType.Array, title: "Bilder", control: { type: ControlType.Object, controls: { bild: { type: ControlType.ResponsiveImage, title: "Bild" } } } },
    breite: { type: ControlType.Number, title: "Breite", min: 60, max: 400, step: 5, unit: "px", defaultValue: 170 },
    start: { type: ControlType.Number, title: "Beginn ab", min: 0, max: 3000, step: 10, unit: "px", defaultValue: 820 },
    deckkraft: { type: ControlType.Number, title: "Deckkraft", min: 0.05, max: 1, step: 0.05, defaultValue: 0.55 },
    drehung: { type: ControlType.Number, title: "Neigung", min: -20, max: 20, step: 0.5, unit: "°", defaultValue: 1.2 },
    tempo: { type: ControlType.Number, title: "Laufen", min: 0, max: 60, step: 1, defaultValue: 6 },
    parallax: { type: ControlType.Number, title: "Mit Scrollen", min: 0, max: 1, step: 0.05, defaultValue: 0.35 },
    vorFusszeile: { type: ControlType.Boolean, title: "Endet vor Fußzeile", defaultValue: true },
    zeiten: { type: ControlType.String, title: "Zeiten im Film", defaultValue: "Mo–Fr|10–18|Uhr; Sa|10–13|Uhr", description: "Felder mit ; trennen, Zeilen mit |. Leer = keine Zeiten." },
    schrift: { type: ControlType.String, title: "Schrift", defaultValue: '"Familjen Grotesk", sans-serif' },
})
