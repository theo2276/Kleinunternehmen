import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

/**
 * Oeffnungsstatus – shows "Jetzt geöffnet / Jetzt geschlossen" live, based on the
 * opening hours, Lower Saxony public holidays and an optional closure period.
 * Time is always evaluated in Europe/Berlin, independent of the visitor's clock.
 * Before hydration (static HTML) it shows the plain opening hours only, so the
 * prerendered page never shows a stale status.
 *
 * @framerSupportedLayoutWidth auto
 * @framerSupportedLayoutHeight auto
 */

const TAGE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]

// Gauss/Meeus algorithm for Easter Sunday (Gregorian)
function ostersonntag(y: number) {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100
    const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25)
    const g = Math.floor((b - f + 1) / 3)
    const h = (19 * a + b - d - g + 15) % 30
    const i = Math.floor(c / 4), k = c % 4
    const l = (32 + 2 * e + 2 * i - h - k) % 7
    const m = Math.floor((a + 11 * h + 22 * l) / 451)
    const month = Math.floor((h + l - 7 * m + 114) / 31)
    const day = ((h + l - 7 * m + 114) % 31) + 1
    return Date.UTC(y, month - 1, day)
}

const key = (y: number, m: number, d: number) => `${y}-${m}-${d}`

// public holidays in Niedersachsen
function feiertage(y: number): Set<string> {
    const s = new Set<string>()
    const fix = [[1, 1], [5, 1], [10, 3], [10, 31], [12, 25], [12, 26]]
    fix.forEach(([m, d]) => s.add(key(y, m, d)))
    const o = ostersonntag(y)
    ;[-2, 1, 39, 50].forEach((off) => {
        const t = new Date(o + off * 86400000)
        s.add(key(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()))
    })
    return s
}

// current date/time parts in Berlin
function berlinJetzt() {
    const parts = new Intl.DateTimeFormat("de-DE", {
        timeZone: "Europe/Berlin",
        year: "numeric", month: "numeric", day: "numeric",
        hour: "numeric", minute: "numeric", hour12: false,
    }).formatToParts(new Date())
    const g = (t: string) => Number(parts.find((p) => p.type === t)?.value)
    const y = g("year"), m = g("month"), d = g("day")
    const h = g("hour") % 24, min = g("minute")
    const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
    return { y, m, d, wd, stunde: h + min / 60 }
}

function uhr(x: number) {
    const h = Math.floor(x), m = Math.round((x - h) * 60)
    return m ? `${h}:${String(m).padStart(2, "0")} Uhr` : `${h} Uhr`
}

function fmtZeiten(p: any) {
    const z = (a: number, b: number) => `${String(a).replace(".5", ":30")}–${String(b).replace(".5", ":30")}`
    return `Mo–Fr ${z(p.wtVon, p.wtBis)} Uhr · Sa ${z(p.saVon, p.saBis)} Uhr`
}

function parseDatum(v: any): number | null {
    if (!v) return null
    const t = new Date(v)
    if (isNaN(t.getTime())) return null
    return Date.UTC(t.getFullYear(), t.getMonth(), t.getDate())
}

type Status = { offen: boolean; text: string }

// A closure period entered on any instance (e.g. in the navigation) applies to all
// instances on the page, so it only has to be entered once.
let geteilt: { von: any; bis: any; text: string } | null = null
// manual "shop closed" switch, also shared across instances
let geteiltZu: { an: boolean; text: string } | null = null
const EVT = "oez-urlaub"
function schalter(p: any) {
    return p.zuSchalter ? { an: true, text: p.zuText || "Heute geschlossen" } : geteiltZu
}
function urlaubVon(p: any) {
    return p.urlaubVon && p.urlaubBis ? { von: p.urlaubVon, bis: p.urlaubBis, text: p.urlaubText } : geteilt
}

function berechne(p: any): Status {
    const sz = schalter(p)
    if (sz && sz.an) return { offen: false, text: sz.text }
    const j = berlinJetzt()
    const zeiten = (wd: number): [number, number] | null =>
        wd >= 1 && wd <= 5 ? [p.wtVon, p.wtBis] : wd === 6 && p.saOffen ? [p.saVon, p.saBis] : null
    const u = urlaubVon(p)
    const uVon = parseDatum(u?.von), uBis = parseDatum(u?.bis)
    const istZu = (t: number) => {
        const d = new Date(t)
        const y = d.getUTCFullYear()
        if (feiertage(y).has(key(y, d.getUTCMonth() + 1, d.getUTCDate()))) return "feiertag"
        if (uVon !== null && uBis !== null && t >= uVon && t <= uBis) return "urlaub"
        return null
    }
    const heute = Date.UTC(j.y, j.m - 1, j.d)
    const grundHeute = istZu(heute)
    const zHeute = zeiten(j.wd)

    if (!grundHeute && zHeute && j.stunde >= zHeute[0] && j.stunde < zHeute[1]) {
        return { offen: true, text: `Jetzt geöffnet · bis ${uhr(zHeute[1])}` }
    }

    // next opening
    for (let i = 0; i <= 60; i++) {
        const t = heute + i * 86400000
        const wd = new Date(t).getUTCDay()
        const z = zeiten(wd)
        if (!z || istZu(t)) continue
        if (i === 0 && j.stunde >= z[0]) continue
        const wann = i === 0 ? "heute" : i === 1 ? "morgen" : TAGE[wd]
        const prefix =
            grundHeute === "feiertag" ? "Heute Feiertag" :
            grundHeute === "urlaub" ? (u?.text || "Betriebsferien") :
            "Jetzt geschlossen"
        return { offen: false, text: `${prefix} · öffnet ${wann} ${uhr(z[0])}` }
    }
    return { offen: false, text: "Jetzt geschlossen" }
}

export default function Oeffnungsstatus(props: any) {
    const { variante, schrift, textFarbe, akzent, zuFarbe, flaeche, rand, style } = props
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const [status, setStatus] = React.useState<Status | null>(null)

    React.useEffect(() => {
        if (isCanvas) return
        if (props.urlaubVon && props.urlaubBis) {
            geteilt = { von: props.urlaubVon, bis: props.urlaubBis, text: props.urlaubText }
            window.dispatchEvent(new Event(EVT))
        }
        if (props.zuSchalter) {
            geteiltZu = { an: true, text: props.zuText || "Heute geschlossen" }
            window.dispatchEvent(new Event(EVT))
        }
        const tick = () => setStatus(berechne(props))
        tick()
        const id = window.setInterval(tick, 30000)
        window.addEventListener(EVT, tick)
        return () => {
            window.clearInterval(id)
            window.removeEventListener(EVT, tick)
        }
    }, [isCanvas, props.wtVon, props.wtBis, props.saVon, props.saBis, props.saOffen, props.urlaubVon, props.urlaubBis, props.urlaubText, props.zuSchalter, props.zuText])

    const zeiten = fmtZeiten(props)
    // canvas: show the "open" look so the design can be judged
    const s: Status | null = isCanvas
        ? props.zuSchalter
            ? { offen: false, text: props.zuText || "Heute geschlossen" }
            : { offen: true, text: `Jetzt geöffnet · bis ${uhr(props.wtBis)}` }
        : status
    const offen = s ? s.offen : true
    const punktFarbe = offen ? akzent : zuFarbe

    // open: yellow dot with a pulse; closed: red dot with a solid ring and a slower pulse
    const punkt = (
        <span style={{ position: "relative", width: 9, height: 9, flex: "none", display: "inline-block" }}>
            <span style={{ position: "absolute", inset: 0, borderRadius: 9, background: punktFarbe, boxShadow: offen ? "none" : `0 0 0 3px color-mix(in srgb, ${zuFarbe} 28%, transparent), 0 0 10px color-mix(in srgb, ${zuFarbe} 60%, transparent)` }} />
            {s && (
                <span style={{ position: "absolute", inset: -4, borderRadius: 16, background: punktFarbe, opacity: 0.35, animation: `oezPuls ${offen ? 2.2 : 3.2}s ease-out infinite` }} />
            )}
        </span>
    )
    const keyframes = <style>{`@keyframes oezPuls{0%{transform:scale(.4);opacity:.5}100%{transform:scale(1.6);opacity:0}}@media (prefers-reduced-motion: reduce){[data-oez] span{animation:none!important}}`}</style>

    if (variante === "nav") {
        return (
            <div data-oez style={{ ...style, display: "inline-flex", alignItems: "center", gap: 8, fontFamily: schrift, fontSize: 13, fontWeight: 600, lineHeight: 1.2, color: textFarbe, whiteSpace: "nowrap" }} aria-live="polite">
                {keyframes}
                {punkt}
                <span>{s ? (s.offen ? s.text.replace("Jetzt geöffnet · bis", "Geöffnet bis") : s.text.includes("öffnet ") ? "Öffnet " + s.text.split("öffnet ")[1] : s.text) : zeiten}</span>
            </div>
        )
    }

    return (
        <div
            data-oez
            aria-live="polite"
            style={{
                ...style,
                display: "inline-flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center",
                columnGap: 12, rowGap: 4,
                padding: "10px 18px 10px 14px", borderRadius: 100,
                background: variante === "hell" ? flaeche : "rgba(14,13,12,0.55)",
                border: variante === "hell" ? `1px solid ${rand}` : "1px solid rgba(246,241,233,0.22)",
                backdropFilter: variante === "hell" ? "none" : "blur(14px)", WebkitBackdropFilter: variante === "hell" ? "none" : "blur(14px)",
                fontFamily: schrift, fontSize: 14, lineHeight: 1.3, color: textFarbe, textAlign: "center",
            }}
        >
            {keyframes}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
                {punkt}
                {s ? s.text : "Öffnungszeiten"}
            </span>
            <span style={{ opacity: 0.72, fontWeight: 500 }}>{zeiten}</span>
        </div>
    )
}

Oeffnungsstatus.defaultProps = {
    variante: "hell",
    wtVon: 10, wtBis: 18, saOffen: true, saVon: 10, saBis: 15,
    urlaubVon: undefined, urlaubBis: undefined, urlaubText: "Betriebsferien",
    zuSchalter: false, zuText: "Heute geschlossen",
    schrift: '"Instrument Sans", "Instrument Sans Placeholder", sans-serif',
    textFarbe: "#111111", akzent: "#1FA34A", zuFarbe: "#E5405E",
    flaeche: "#EFEBE4", rand: "#D8D2C7",
}

addPropertyControls(Oeffnungsstatus, {
    variante: { type: ControlType.Enum, title: "Variante", options: ["hell", "hero", "nav"], optionTitles: ["Pille hell", "Pille dunkel", "Kompakt"], defaultValue: "hell" },
    wtVon: { type: ControlType.Number, title: "Mo–Fr ab", min: 0, max: 24, step: 0.5, defaultValue: 10 },
    wtBis: { type: ControlType.Number, title: "Mo–Fr bis", min: 0, max: 24, step: 0.5, defaultValue: 18 },
    saOffen: { type: ControlType.Boolean, title: "Samstag offen", defaultValue: true },
    saVon: { type: ControlType.Number, title: "Sa ab", min: 0, max: 24, step: 0.5, defaultValue: 10, hidden: (p: any) => !p.saOffen },
    saBis: { type: ControlType.Number, title: "Sa bis", min: 0, max: 24, step: 0.5, defaultValue: 15, hidden: (p: any) => !p.saOffen },
    urlaubVon: { type: ControlType.Date, title: "Geschlossen ab" },
    urlaubBis: { type: ControlType.Date, title: "Geschlossen bis" },
    urlaubText: { type: ControlType.String, title: "Text dafür", defaultValue: "Betriebsferien" },
    zuSchalter: { type: ControlType.Boolean, title: "Geschäft geschlossen", enabledTitle: "Zu", disabledTitle: "Normal", defaultValue: false },
    zuText: { type: ControlType.String, title: "Text wenn zu", defaultValue: "Heute geschlossen" },
    schrift: { type: ControlType.String, title: "Schrift", defaultValue: '"Instrument Sans", "Instrument Sans Placeholder", sans-serif' },
    textFarbe: { type: ControlType.Color, title: "Text", defaultValue: "#111111" },
    akzent: { type: ControlType.Color, title: "Punkt geöffnet", defaultValue: "#1FA34A" },
    flaeche: { type: ControlType.Color, title: "Fläche (hell)", defaultValue: "#EFEBE4", hidden: (p: any) => p.variante !== "hell" },
    rand: { type: ControlType.Color, title: "Rand (hell)", defaultValue: "#D8D2C7", hidden: (p: any) => p.variante !== "hell" },
    zuFarbe: { type: ControlType.Color, title: "Punkt geschlossen", defaultValue: "#E5405E" },
})
