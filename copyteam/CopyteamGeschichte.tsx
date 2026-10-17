import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

type Station = { datum?: string; titel?: string; text?: string; bild?: { src: string; alt?: string } }
interface Props { stationen?: Station[]; akzent?: string; style?: React.CSSProperties }
const EMPTY: Station[] = [{"datum":"Jahr ergänzen","titel":"Die Anfänge","text":"Platzhalter: Hier erzählen wir, wie copyteam entstanden ist und was den Laden von Anfang an ausgemacht hat.","bild":{"src":"https://images.unsplash.com/photo-1581508512961-0e3b9524db40?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900","alt":"Stockfoto einer historischen Druckmaschine – Bildplatzhalter"}},{"datum":"Jahr ergänzen","titel":"Der nächste Schritt","text":"Platzhalter: Hier ist Raum für einen wichtigen Meilenstein – etwa einen Umzug, neue Technik oder die Erweiterung des Angebots.","bild":{"src":"https://images.unsplash.com/photo-1591285687558-632ddc5e026a?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900","alt":"Stockfoto aus einer Druckwerkstatt – Bildplatzhalter"}},{"datum":"Heute","titel":"copyteam heute","text":"Platzhalter: Hier stellen wir den heutigen Laden, das Team und die Menschen vor, die täglich hinter den Aufträgen stehen.","bild":{"src":"https://images.unsplash.com/photo-1727517786578-ff2bb896b852?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=900","alt":"Stockfoto aus einem Produktionsbetrieb – Bildplatzhalter"}}]

/**
 * @framerIntrinsicWidth 1136
 * @framerIntrinsicHeight 1060
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function CopyteamGeschichte({ stationen, akzent = "#FFE500", style }: Props) {
    const list = stationen?.length ? stationen.map((station, index) => ({ ...EMPTY[index], ...station, text: station.text || EMPTY[index]?.text, bild: station.bild?.src ? station.bild : EMPTY[index]?.bild })) : EMPTY
    const canvas = RenderTarget.current() === RenderTarget.canvas
    const root = React.useRef<HTMLDivElement>(null)
    const dots = React.useRef<(HTMLDivElement | null)[]>([])
    const [narrow, setNarrow] = React.useState(false)
    const [progress, setProgress] = React.useState(canvas ? 1 : 0)
    const [active, setActive] = React.useState<boolean[]>(list.map(() => canvas))

    React.useEffect(() => {
        const el = root.current
        if (!el || typeof ResizeObserver === "undefined") return
        const observer = new ResizeObserver(() => setNarrow(el.clientWidth < 760))
        setNarrow(el.clientWidth < 760)
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    React.useEffect(() => {
        if (canvas || typeof window === "undefined") return
        const el = root.current
        if (!el) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setProgress(1)
            setActive(list.map(() => true))
            return
        }
        let raf = 0
        const measure = () => {
            raf = 0
            const r = el.getBoundingClientRect()
            const line = window.innerHeight * 0.68
            const next = Math.max(0, Math.min(1, (line - r.top) / Math.max(1, r.height)))
            setProgress(p => Math.abs(p - next) < 0.001 ? p : next)
            const states = dots.current.slice(0, list.length).map(dot => dot ? dot.getBoundingClientRect().top <= line : false)
            setActive(old => old.length === states.length && old.every((v, i) => v === states[i]) ? old : states)
        }
        const request = () => { if (!raf) raf = window.requestAnimationFrame(measure) }
        measure()
        window.addEventListener("scroll", request, { passive: true, capture: true })
        window.addEventListener("resize", request)
        return () => {
            window.removeEventListener("scroll", request, true)
            window.removeEventListener("resize", request)
            if (raf) window.cancelAnimationFrame(raf)
        }
    }, [canvas, list.length, narrow])

    const bone = (width: string, height: number, color = "rgba(255,255,255,0.12)") =>
        <div aria-hidden="true" style={{ width, maxWidth: "100%", height, background: color, borderRadius: 2 }} />

    return <div ref={root} aria-label="Timeline zur Geschichte von copyteam, Platzhalter" style={{ ...style, position: "relative", width: "100%", color: "#FFFFFF", fontFamily: '"Instrument Sans", sans-serif' }}>
        <div aria-hidden="true" style={{ position: "absolute", top: 0, bottom: 0, left: narrow ? 11 : "50%", width: 2, marginLeft: -1, background: "rgba(255,255,255,0.18)" }} />
        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: narrow ? 11 : "50%", width: 2, marginLeft: -1, height: progress * 100 + "%", background: akzent, transition: "height .12s linear" }} />
        <ol style={{ listStyle: "none", margin: 0, padding: narrow ? "16px 0 16px 44px" : "40px 0", display: "flex", flexDirection: "column", gap: narrow ? 64 : 104 }}>
            {list.map((station, index) => {
                const right = index % 2 === 1
                const on = canvas || active[index]
                const empty = !station.datum && !station.titel && !station.text
                const content = <div aria-label={empty ? "Platzhalter für Datum und Geschichte" : undefined} style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: narrow || right ? "flex-start" : "flex-end", textAlign: narrow || right ? "left" : "right", opacity: on ? 1 : 0.55, transition: "opacity .5s ease" }}>
                    {station.datum ? <span style={{ color: akzent, fontSize: 14, fontWeight: 700 }}>{station.datum}</span> : bone("92px", 12, akzent)}
                    {station.titel ? <h3 style={{ margin: 0, fontFamily: '"Fraunces", serif', fontSize: narrow ? 30 : 38, lineHeight: 1.1 }}>{station.titel}</h3> : <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: narrow || right ? "flex-start" : "flex-end", width: "100%" }}>{bone("82%", 25)}{bone("58%", 25)}</div>}
                    {station.text ? <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, opacity: 0.7 }}>{station.text}</p> : <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: narrow || right ? "flex-start" : "flex-end", width: "100%", marginTop: 5 }}>{bone("100%", 9)}{bone("94%", 9)}{bone("72%", 9)}</div>}
                </div>
                const photo = <figure style={{ margin: 0, width: "100%", maxWidth: 380, justifySelf: right ? "end" : "start", padding: 10, boxSizing: "border-box", background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.2)", transform: narrow ? "none" : "rotate(" + (right ? 2 : -2) + "deg)", opacity: on ? 1 : 0.65, transition: "opacity .6s ease" }}>
                    {station.bild?.src ? <img src={station.bild.src} alt={station.bild.alt || ""} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} /> : <div role="img" aria-label="Platzhalter für ein historisches Foto" style={{ width: "100%", aspectRatio: "1.38", background: "rgba(255,255,255,0.035)", border: "1px dashed rgba(255,255,255,0.18)", boxSizing: "border-box" }} />}
                </figure>
                return <li key={index} style={{ position: "relative", minWidth: 0 }}>
                    <div ref={el => { dots.current[index] = el }} aria-hidden="true" style={{ position: "absolute", top: narrow ? 0 : "50%", left: narrow ? -33 : "50%", width: 16, height: 16, marginLeft: -8, marginTop: narrow ? 0 : -8, boxSizing: "border-box", borderRadius: "50%", background: on ? akzent : "#111111", border: "2px solid " + (on ? akzent : "rgba(255,255,255,0.4)"), boxShadow: on ? "0 0 0 6px rgba(255,229,0,0.12)" : "none", transition: "background .4s, box-shadow .4s" }} />
                    <div style={{ display: narrow ? "flex" : "grid", flexDirection: "column", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", columnGap: 120, rowGap: 28, alignItems: narrow ? "stretch" : "center" }}>{narrow ? <>{content}{photo}</> : right ? <>{photo}{content}</> : <>{content}{photo}</>}</div>
                </li>
            })}
        </ol>
    </div>
}

addPropertyControls(CopyteamGeschichte, {
    stationen: { type: ControlType.Array, title: "Stationen", defaultValue: EMPTY, control: { type: ControlType.Object, controls: {
        datum: { type: ControlType.String, title: "Datum", defaultValue: "" },
        titel: { type: ControlType.String, title: "Titel", defaultValue: "" },
        text: { type: ControlType.String, title: "Geschichte", displayTextArea: true, defaultValue: "" },
        bild: { type: ControlType.ResponsiveImage, title: "Foto" },
    } } },
    akzent: { type: ControlType.Color, title: "Akzent", defaultValue: "#FFE500" },
})
