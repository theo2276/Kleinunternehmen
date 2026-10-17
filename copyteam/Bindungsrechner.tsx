import { addPropertyControls, ControlType } from "framer"
import { useEffect, useMemo, useState, startTransition, type CSSProperties } from "react"

type BindingId = "spirale" | "draht" | "leim" | "heft"

interface Tier {
    max: number
    price: number
}

interface Binding {
    id: BindingId
    name: string
    sub: string
    minutes: number
    cutoffHours: number
    tiers: Tier[]
    color: string
}

interface BindungsrechnerProps {
    ink: string
    paper: string
    line: string
    grey: string
    yellow: string
    cyan: string
    magenta: string
    orderLink: string
    pricesLink: string
    style?: CSSProperties
}

const SANS = '"Instrument Sans", "Instrument Sans Placeholder", system-ui, sans-serif'
const SERIF = '"Fraunces", "Fraunces Placeholder", Georgia, serif'

// Staffelpreise laut Preisliste (Blattangaben für 80-g-Papier)
const SW_TIERS: Tier[] = [
    { max: 20, price: 0.15 },
    { max: 50, price: 0.13 },
    { max: 100, price: 0.11 },
    { max: 250, price: 0.1 },
    { max: 500, price: 0.09 },
    { max: 750, price: 0.08 },
    { max: 1000, price: 0.07 },
    { max: 2500, price: 0.06 },
    { max: 5000, price: 0.055 },
    { max: 10000, price: 0.05 },
    { max: 20000, price: 0.045 },
    { max: Infinity, price: 0.04 },
]
const COLOR_TIERS: Tier[] = [
    { max: 5, price: 0.95 },
    { max: 10, price: 0.9 },
    { max: 15, price: 0.85 },
    { max: 20, price: 0.8 },
    { max: Infinity, price: 0.75 },
]
const SYSTEM_FEE = 0.5
const FOIL = 0.5
const OWN_MATERIAL = 1

function tierPrice(tiers: Tier[], count: number): number | null {
    const t = tiers.find((x) => count <= x.max)
    return t ? t.price : null
}

function euro(v: number): string {
    return v.toLocaleString("de-DE", { style: "currency", currency: "EUR" })
}

function cent(v: number): string {
    return `${(v * 100).toLocaleString("de-DE", { maximumFractionDigits: 1 })} ct`
}

// --- Abgabeschluss: Berliner Zeit + Feiertage Niedersachsen (wie im Bauteil Oeffnungsstatus) ---
const OPEN: Record<number, [number, number] | null> = { 0: null, 1: [10, 18], 2: [10, 18], 3: [10, 18], 4: [10, 18], 5: [10, 18], 6: [10, 15] }
const WOCHENTAG = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"]

// Gauss/Meeus algorithm for Easter Sunday (Gregorian), as UTC timestamp
function easterSunday(y: number): number {
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

const dayKey = (t: number) => {
    const d = new Date(t)
    return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
}

// public holidays in Lower Saxony
function isHoliday(t: number): boolean {
    const y = new Date(t).getUTCFullYear()
    const fixed = [[1, 1], [5, 1], [10, 3], [10, 31], [12, 25], [12, 26]].map(([m, d]) => dayKey(Date.UTC(y, m - 1, d)))
    const e = easterSunday(y)
    const moving = [-2, 1, 39, 50].map((off) => dayKey(e + off * 86400000)) // Karfreitag, Ostermontag, Himmelfahrt, Pfingstmontag
    return fixed.includes(dayKey(t)) || moving.includes(dayKey(t))
}

interface BerlinNow { day: number; weekday: number; hour: number }

function berlinNow(): BerlinNow {
    const parts = new Intl.DateTimeFormat("de-DE", {
        timeZone: "Europe/Berlin", year: "numeric", month: "numeric", day: "numeric",
        hour: "numeric", minute: "numeric", hour12: false,
    }).formatToParts(new Date())
    const g = (type: string) => Number(parts.find((p) => p.type === type)?.value)
    const day = Date.UTC(g("year"), g("month") - 1, g("day"))
    return { day, weekday: new Date(day).getUTCDay(), hour: (g("hour") % 24) + g("minute") / 60 }
}

function cutoffMessage(cutoffHours: number, now: BerlinNow | null): string {
    if (!now) return `Mo–Fr bis ${18 - cutoffHours}:00 Uhr, Sa bis ${15 - cutoffHours}:00 Uhr abgeben`
    for (let i = 0; i <= 30; i++) {
        const t = now.day + i * 86400000
        const wd = new Date(t).getUTCDay()
        const hours = OPEN[wd]
        if (!hours || isHoliday(t)) continue
        const cutoff = hours[1] - cutoffHours
        if (i === 0 && now.hour >= cutoff) continue
        if (i === 0) return `Heute bis ${cutoff}:00 Uhr abgeben – heute noch fertig`
        const reason = isHoliday(now.day) ? "Heute Feiertag" : !OPEN[now.weekday] ? "Heute geschlossen" : "Heute nicht mehr"
        const d = new Date(t)
        const when = i === 1 ? `morgen (${WOCHENTAG[wd]})` : `${WOCHENTAG[wd]}, ${d.getUTCDate()}.${d.getUTCMonth() + 1}.`
        return `${reason} – ${when} bis ${cutoff}:00 Uhr abgeben`
    }
    return "Abgabe bitte telefonisch absprechen"
}

/**
 * Preisrechner für Bindungen von Abschlussarbeiten
 *
 * @framerIntrinsicWidth 1216
 * @framerIntrinsicHeight 640
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function Bindungsrechner(props: BindungsrechnerProps) {
    const {
        ink = "#111111",
        paper = "#EFEBE4",
        line = "#D8D2C7",
        grey = "#6B675F",
        yellow = "#FFE500",
        cyan = "#00A3E0",
        magenta = "#E6007E",
        orderLink = "/kontakt",
        pricesLink = "/preise",
    } = props

    const bindings: Binding[] = [
        { id: "spirale", name: "Spiralbindung", sub: "Plastik", minutes: 15, cutoffHours: 1, color: cyan,
          tiers: [{ max: 50, price: 3.5 }, { max: 90, price: 4.5 }, { max: 150, price: 5.5 }, { max: 210, price: 6.5 }, { max: 350, price: 7.5 }, { max: 500, price: 10.5 }] },
        { id: "draht", name: "Drahtbindung", sub: "Metall", minutes: 30, cutoffHours: 1, color: magenta,
          tiers: [{ max: 40, price: 5.5 }, { max: 120, price: 6.5 }] },
        { id: "leim", name: "Leimbindung", sub: "mit Fälzelbandrücken", minutes: 60, cutoffHours: 2, color: yellow,
          tiers: [{ max: 60, price: 7.5 }, { max: 90, price: 8.5 }, { max: 120, price: 10.5 }, { max: 150, price: 11.5 }, { max: 180, price: 12.5 }, { max: 210, price: 13.5 }, { max: 300, price: 16.5 }, { max: 400, price: 17.5 }] },
        { id: "heft", name: "Feste Heftbindung", sub: "„Hardcover“", minutes: 120, cutoffHours: 2, color: ink,
          tiers: [{ max: 100, price: 7 }, { max: 150, price: 8 }, { max: 170, price: 9 }] },
    ]

    const [pages, setPages] = useState(80)
    const [colorPages, setColorPages] = useState(6)
    const [duplex, setDuplex] = useState(false)
    const [copies, setCopies] = useState(2)
    const [bindingId, setBindingId] = useState<BindingId>("leim")
    const [foil, setFoil] = useState(false)
    const [ownPrint, setOwnPrint] = useState(false)
    const [now, setNow] = useState<BerlinNow | null>(null)

    useEffect(() => {
        if (typeof window === "undefined") return
        const tick = () => startTransition(() => setNow(berlinNow()))
        tick()
        const id = window.setInterval(tick, 60000)
        return () => window.clearInterval(id)
    }, [])

    const binding = bindings.find((b) => b.id === bindingId) ?? bindings[2]
    const safeColor = Math.min(colorPages, pages)
    const sheets = duplex ? Math.ceil(pages / 2) : pages

    const result = useMemo(() => {
        const bindPrice = tierPrice(binding.tiers, sheets)
        const lines: { label: string; value: number }[] = []
        if (!ownPrint) {
            const swTotal = (pages - safeColor) * copies
            const colorTotal = safeColor * copies
            if (swTotal > 0) {
                const p = tierPrice(SW_TIERS, swTotal) ?? 0.04
                lines.push({ label: `${swTotal.toLocaleString("de-DE")} Seiten s/w à ${cent(p)}`, value: swTotal * p })
            }
            if (colorTotal > 0) {
                const p = tierPrice(COLOR_TIERS, colorTotal) ?? 0.75
                lines.push({ label: `${colorTotal.toLocaleString("de-DE")} Seiten Farbe à ${cent(p)}`, value: colorTotal * p })
            }
            if (swTotal + colorTotal > 0) lines.push({ label: "Systemgebühr Ausdruck (einmalig)", value: SYSTEM_FEE })
        }
        if (bindPrice !== null) {
            lines.push({ label: `${copies} × ${binding.name} à ${euro(bindPrice)}`, value: copies * bindPrice })
            if (foil) lines.push({ label: `${copies} × Klarsichtfolie matt`, value: copies * FOIL })
            if (ownPrint) lines.push({ label: `${copies} × Aufschlag mitgebrachtes Bindegut`, value: copies * OWN_MATERIAL })
        }
        const total = lines.reduce((s, l) => s + l.value, 0)
        return { bindPrice, lines, total }
    }, [binding, sheets, pages, safeColor, copies, foil, ownPrint])

    const maxSheets = binding.tiers[binding.tiers.length - 1].max
    const tooThick = result.bindPrice === null

    const cutoffText = cutoffMessage(binding.cutoffHours, now)
    const duration = binding.minutes < 60 ? `ab ${binding.minutes} Min.` : `ab ${binding.minutes / 60} Std.`

    const set = (fn: () => void) => startTransition(fn)

    const label: CSSProperties = { fontFamily: SANS, fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: grey, margin: 0 }
    const body: CSSProperties = { fontFamily: SANS, fontSize: 16, lineHeight: 1.5, color: ink, margin: 0 }

    function Stepper(p: { value: number; min: number; max: number; step?: number; onChange: (v: number) => void; name: string; unit: string }) {
        const step = p.step ?? 1
        const clamp = (v: number) => Math.max(p.min, Math.min(p.max, v))
        const btn: CSSProperties = { width: 44, height: 44, borderRadius: 100, border: `1px solid ${line}`, background: "#fff", color: ink, fontFamily: SANS, fontSize: 20, cursor: "pointer", flexShrink: 0 }
        return (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button type="button" aria-label={`${p.name} verringern`} style={btn} onClick={() => p.onChange(clamp(p.value - step))}>−</button>
                <label style={{ display: "flex", alignItems: "baseline", gap: 6, flex: 1, minWidth: 0, background: paper, borderRadius: 12, padding: "10px 14px" }}>
                    <input
                        type="number"
                        inputMode="numeric"
                        aria-label={p.name}
                        value={p.value}
                        min={p.min}
                        max={p.max}
                        onChange={(e) => {
                            const v = parseInt(e.target.value, 10)
                            p.onChange(Number.isNaN(v) ? p.min : clamp(v))
                        }}
                        style={{ width: "100%", minWidth: 0, border: "none", background: "transparent", outline: "none", fontFamily: SERIF, fontWeight: 600, fontSize: 26, color: ink, padding: 0 }}
                    />
                    <span style={{ ...body, color: grey, fontSize: 14 }}>{p.unit}</span>
                </label>
                <button type="button" aria-label={`${p.name} erhöhen`} style={btn} onClick={() => p.onChange(clamp(p.value + step))}>+</button>
            </div>
        )
    }

    function Toggle(p: { on: boolean; onChange: (v: boolean) => void; text: string; hint?: string }) {
        return (
            <button
                type="button"
                role="switch"
                aria-checked={p.on}
                onClick={() => p.onChange(!p.on)}
                style={{ display: "flex", alignItems: "center", gap: 12, background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
            >
                <span style={{ width: 40, height: 24, borderRadius: 100, background: p.on ? ink : line, position: "relative", flexShrink: 0, transition: "background 0.2s" }}>
                    <span style={{ position: "absolute", top: 3, left: p.on ? 19 : 3, width: 18, height: 18, borderRadius: 100, background: p.on ? yellow : "#fff", transition: "left 0.2s" }} />
                </span>
                <span style={{ ...body, fontSize: 15 }}>
                    {p.text}
                    {p.hint && <span style={{ color: grey }}> {p.hint}</span>}
                </span>
            </button>
        )
    }

    return (
        <div
            style={{
                ...props.style,
                position: "relative",
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                background: "#fff",
                border: `1px solid ${line}`,
                borderRadius: 24,
                overflow: "hidden",
            }}
        >
            {/* Eingaben */}
            <div style={{ flex: "1 1 420px", minWidth: 0, padding: "clamp(22px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: 32 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <p style={label}>1 · Bindung wählen</p>
                    <div role="radiogroup" aria-label="Bindung" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(128px, 1fr))", gap: 10 }}>
                        {bindings.map((b) => {
                            const active = b.id === bindingId
                            return (
                                <button
                                    key={b.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => set(() => setBindingId(b.id))}
                                    style={{
                                        textAlign: "left",
                                        cursor: "pointer",
                                        padding: "16px 16px 14px",
                                        borderRadius: 14,
                                        border: `1.5px solid ${active ? ink : line}`,
                                        background: active ? paper : "#fff",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 4,
                                        position: "relative",
                                        overflow: "hidden",
                                        transition: "border-color 0.2s, background 0.2s",
                                    }}
                                >
                                    <span style={{ position: "absolute", left: 0, right: 0, top: 0, height: 4, background: b.color }} />
                                    <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 18, color: ink, lineHeight: 1.2 }}>{b.name}</span>
                                    <span style={{ ...body, fontSize: 13, color: grey }}>{b.sub}</span>
                                    <span style={{ ...body, fontSize: 13, fontWeight: 600, marginTop: 6 }}>
                                        ab {euro(b.tiers[0].price)} · {b.minutes < 60 ? `${b.minutes} Min.` : `${b.minutes / 60} Std.`}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <p style={label}>2 · Seiten der Arbeit</p>
                        {Stepper({name: "Seiten", unit: "Seiten", value: pages, min: 1, max: 2000, step: 10, onChange: (v) => set(() => setPages(v)),})}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <p style={label}>davon farbig</p>
                        {Stepper({name: "Farbseiten", unit: "Seiten", value: safeColor, min: 0, max: pages, onChange: (v) => set(() => setColorPages(v)),})}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <p style={label}>3 · Exemplare</p>
                        {Stepper({name: "Exemplare", unit: "Stück", value: copies, min: 1, max: 30, onChange: (v) => set(() => setCopies(v)),})}
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <p style={label}>4 · Extras</p>
                    {Toggle({ on: duplex, onChange: (v) => set(() => setDuplex(v)), text: "Doppelseitig drucken", hint: `(${sheets} Blatt)` })}
                    {Toggle({ on: foil, onChange: (v) => set(() => setFoil(v)), text: "Klarsichtfolie, matt", hint: "(+0,50 € je Exemplar)" })}
                    {Toggle({ on: ownPrint, onChange: (v) => set(() => setOwnPrint(v)), text: "Schon gedruckt – nur binden", hint: "(+1,00 € je Exemplar)" })}
                </div>
            </div>

            {/* Ergebnis */}
            <div
                aria-live="polite"
                style={{ flex: "1 1 340px", minWidth: 0, background: ink, color: "#fff", padding: "clamp(22px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: 24 }}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <p style={{ ...label, color: yellow }}>Richtpreis gesamt</p>
                    <p style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(48px, 6vw, 72px)", lineHeight: 1, letterSpacing: "-0.03em", margin: 0, color: "#fff" }}>
                        {tooThick ? "Auf Anfrage" : euro(result.total)}
                    </p>
                    {!tooThick && copies > 1 && (
                        <p style={{ ...body, color: "rgba(255,255,255,0.6)", fontSize: 14 }}>≈ {euro(result.total / copies)} je Exemplar</p>
                    )}
                </div>

                {tooThick ? (
                    <p style={{ ...body, color: "rgba(255,255,255,0.8)" }}>
                        {binding.name} geht bis {maxSheets} Blatt. Ihre Arbeit hat {sheets} Blatt – rufen Sie uns kurz an, wir finden die passende Lösung.
                    </p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {result.lines.map((l) => (
                            <div key={l.label} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.14)" }}>
                                <span style={{ ...body, fontSize: 14, color: "rgba(255,255,255,0.72)" }}>{l.label}</span>
                                <span style={{ ...body, fontSize: 14, color: "#fff", fontWeight: 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{euro(l.value)}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 18, borderRadius: 14, background: "rgba(255,255,255,0.07)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <span style={{ ...body, fontSize: 14, color: "rgba(255,255,255,0.72)" }}>Bearbeitungszeit</span>
                        <span style={{ ...body, fontSize: 14, color: "#fff", fontWeight: 600 }}>{duration}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 100, background: yellow, flexShrink: 0 }} />
                        <span style={{ ...body, fontSize: 15, color: yellow, fontWeight: 600 }}>{cutoffText}</span>
                    </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: "auto" }}>
                    <a href={orderLink} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 15, color: ink, background: yellow, borderRadius: 100, padding: "15px 24px", textDecoration: "none" }}>
                        Auftrag vorab senden
                    </a>
                    <a href={pricesLink} style={{ fontFamily: SANS, fontWeight: 600, fontSize: 15, color: "#fff", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 100, padding: "14px 22px", textDecoration: "none" }}>
                        Alle Preislisten
                    </a>
                </div>
                <p style={{ ...body, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                    Richtwert auf Basis unserer Preisliste (DIN A4, 80 g). Den genauen Preis nennen wir Ihnen im Laden.
                </p>
            </div>
        </div>
    )
}

addPropertyControls(Bindungsrechner, {
    ink: { type: ControlType.Color, title: "Toner", defaultValue: "#111111" },
    paper: { type: ControlType.Color, title: "Papier", defaultValue: "#EFEBE4" },
    line: { type: ControlType.Color, title: "Linie", defaultValue: "#D8D2C7" },
    grey: { type: ControlType.Color, title: "Grau", defaultValue: "#6B675F" },
    yellow: { type: ControlType.Color, title: "Gelb", defaultValue: "#FFE500" },
    cyan: { type: ControlType.Color, title: "Cyan", defaultValue: "#00A3E0" },
    magenta: { type: ControlType.Color, title: "Magenta", defaultValue: "#E6007E" },
    orderLink: { type: ControlType.Link, title: "Auftrag-Link", defaultValue: "/kontakt" },
    pricesLink: { type: ControlType.Link, title: "Preise-Link", defaultValue: "/preise" },
})
