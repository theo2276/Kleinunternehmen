import { addPropertyControls, ControlType } from "framer"
import { useMemo, useState, startTransition, type CSSProperties } from "react"

type TabId = "kopien" | "gross" | "bind" | "lami"
type Mode = "tier" | "pick"

interface Row {
    label: string
    from: number | null // null = info row, not selectable
    to: number | null // null = open end
    price: number | null // null = on request
    text?: string // overrides price text
}

interface Product {
    id: string
    tab: TabId
    name: string
    sub: string
    mode: Mode
    unit: string // unit of the quantity
    per: string // "je Seite"
    min: number
    max: number
    start: number
    rows: Row[]
    note: string
    fee?: boolean // one-off system fee for prints
    perUnitTotal: boolean // total = qty * price
    beyond?: string // message when qty exceeds last row
    ab?: boolean // prices are "from"
}

interface PreisfinderProps {
    ink: string
    paper: string
    line: string
    grey: string
    yellow: string
    cyan: string
    magenta: string
    rechnerLink: string
    kontaktLink: string
    style?: CSSProperties
}

const SANS = '"Instrument Sans", "Instrument Sans Placeholder", system-ui, sans-serif'
const SERIF = '"Fraunces", "Fraunces Placeholder", Georgia, serif'
const FEE = 0.5

// Prices 1:1 from copyteam's price lists (DIN A4, 80 g unless noted)
const PRODUCTS: Product[] = [
    { id: "sb", tab: "kopien", name: "s/w-Kopie", sub: "Selbstbedienung", mode: "tier", unit: "Kopien", per: "je Kopie", min: 1, max: 750, start: 50, perUnitTotal: true,
      rows: [{ label: "bis 250", from: 1, to: 250, price: 0.1 }, { label: "251 – 500", from: 251, to: 500, price: 0.09 }, { label: "501 – 750", from: 501, to: 750, price: 0.08 }, { label: "ab 751", from: null, to: null, price: null, text: "Laserpreis" }],
      note: "DIN A4, 80-g-Normalpapier. Ab 751 Kopien gilt der Preis für Laserkopien s/w." },
    { id: "sw", tab: "kopien", name: "Laserdruck s/w", sub: "Kopie oder Ausdruck", mode: "tier", unit: "Seiten", per: "je Seite", min: 1, max: 30000, start: 100, perUnitTotal: true, fee: true,
      rows: [
          { label: "1 – 20", from: 1, to: 20, price: 0.15 }, { label: "21 – 50", from: 21, to: 50, price: 0.13 }, { label: "51 – 100", from: 51, to: 100, price: 0.11 },
          { label: "101 – 250", from: 101, to: 250, price: 0.1 }, { label: "251 – 500", from: 251, to: 500, price: 0.09 }, { label: "501 – 750", from: 501, to: 750, price: 0.08 },
          { label: "751 – 1.000", from: 751, to: 1000, price: 0.07 }, { label: "1.001 – 2.500", from: 1001, to: 2500, price: 0.06 }, { label: "2.501 – 5.000", from: 2501, to: 5000, price: 0.055 },
          { label: "5.001 – 10.000", from: 5001, to: 10000, price: 0.05 }, { label: "10.001 – 20.000", from: 10001, to: 20000, price: 0.045 }, { label: "ab 20.000", from: 20001, to: null, price: 0.04 },
      ],
      note: "DIN A4, 80 g. Bei Ausdrucken einmalig 50 Cent Systemgebühr." },
    { id: "fe", tab: "kopien", name: "Laserdruck Farbe", sub: "einzelne Seiten", mode: "tier", unit: "Seiten", per: "je Seite", min: 1, max: 25, start: 10, perUnitTotal: true, fee: true,
      rows: [{ label: "1 – 5", from: 1, to: 5, price: 0.95 }, { label: "6 – 10", from: 6, to: 10, price: 0.9 }, { label: "11 – 15", from: 11, to: 15, price: 0.85 }, { label: "16 – 20", from: 16, to: 20, price: 0.8 }, { label: "21 – 25", from: 21, to: 25, price: 0.75 }],
      note: "DIN A4, 80 g. Ab 20 gleichen Seiten lohnt sich der Serienpreis." },
    { id: "fs", tab: "kopien", name: "Laserdruck Farbe", sub: "Serie (gleiche Vorlage)", mode: "tier", unit: "Seiten", per: "je Seite", min: 20, max: 5000, start: 50, perUnitTotal: true, fee: true,
      rows: [{ label: "20 – 30", from: 20, to: 30, price: 0.4 }, { label: "31 – 50", from: 31, to: 50, price: 0.35 }, { label: "51 – 200", from: 51, to: 200, price: 0.3 }, { label: "201 – 500", from: 201, to: 500, price: 0.25 }, { label: "ab 501", from: 501, to: null, price: 0.2 }],
      note: "Gleiche Vorlage mehrfach. DIN A4, 80 g." },
    ...([["a2", "Plot DIN A2", [15, 14, 13.5, 13, 12]], ["a1", "Plot DIN A1", [25, 21, 23, 22, 20]], ["a0", "Plot DIN A0", [40, 39, 37, 35, 30]]] as [string, string, number[]][]).map(
        ([id, name, p]): Product => ({ id, tab: "gross", name, sub: "Sofortdruck", mode: "tier", unit: "Drucke", per: "je Druck", min: 1, max: 200, start: 1, perUnitTotal: true,
          rows: [{ label: "1 – 5", from: 1, to: 5, price: p[0] }, { label: "6 – 10", from: 6, to: 10, price: p[1] }, { label: "11 – 20", from: 11, to: 20, price: p[2] }, { label: "21 – 50", from: 21, to: 50, price: p[3] }, { label: "ab 51", from: 51, to: null, price: p[4] }],
          note: "Sofortdruck auf hochweißem, beschichtetem 120-g-Papier. Größere Serien mit ein paar Tagen Vorlauf deutlich günstiger." })
    ),
    { id: "cad", tab: "gross", name: "CAD-Druck", sub: "Pläne & Zeichnungen", mode: "pick", unit: "Drucke", per: "je Druck", min: 1, max: 200, start: 1, perUnitTotal: true, ab: true,
      rows: [{ label: "DIN A2", from: 1, to: null, price: 2.5 }, { label: "DIN A1", from: 2, to: null, price: 5 }, { label: "DIN A0+", from: 3, to: null, price: 9 }],
      note: "Auf 90-g-Papier. Fotopapiere gegen 5 bis 10 € Aufpreis." },
    { id: "spi", tab: "bind", name: "Spiralbindung", sub: "Plastik", mode: "tier", unit: "Blatt", per: "je Bindung", min: 1, max: 600, start: 80, perUnitTotal: false, beyond: "Über 500 Blatt bitte anfragen.",
      rows: [{ label: "bis 50", from: 1, to: 50, price: 3.5 }, { label: "51 – 90", from: 51, to: 90, price: 4.5 }, { label: "91 – 150", from: 91, to: 150, price: 5.5 }, { label: "151 – 210", from: 151, to: 210, price: 6.5 }, { label: "211 – 350", from: 211, to: 350, price: 7.5 }, { label: "351 – 500", from: 351, to: 500, price: 10.5 }],
      note: "Blattangaben für 80-g-Papier. Mitgebrachtes Bindegut +1 €." },
    { id: "dra", tab: "bind", name: "Drahtbindung", sub: "Metall", mode: "tier", unit: "Blatt", per: "je Bindung", min: 1, max: 150, start: 40, perUnitTotal: false, beyond: "Über 120 Blatt bitte anfragen.",
      rows: [{ label: "bis 40", from: 1, to: 40, price: 5.5 }, { label: "41 – 120", from: 41, to: 120, price: 6.5 }, { label: "Kalender inkl. Aufhänger", from: null, to: null, price: 6.5 }],
      note: "Kalender inklusive Aufhänger und Bindegut-Zuschlag. Sonst mitgebrachtes Bindegut +1 €." },
    { id: "hef", tab: "bind", name: "Feste Heftbindung", sub: "extrem stabil", mode: "tier", unit: "Blatt", per: "je Bindung", min: 1, max: 200, start: 80, perUnitTotal: false, beyond: "Über 170 Blatt bitte anfragen.",
      rows: [{ label: "bis 100", from: 1, to: 100, price: 7 }, { label: "101 – 150", from: 101, to: 150, price: 8 }, { label: "151 – 170", from: 151, to: 170, price: 9 }],
      note: "Mit festem Einband. Mitgebrachtes Bindegut +1 €." },
    { id: "lei", tab: "bind", name: "Leimbindung", sub: "mit Fälzelbandrücken", mode: "tier", unit: "Blatt", per: "je Bindung", min: 1, max: 450, start: 80, perUnitTotal: false,
      rows: [
          { label: "bis 60", from: 1, to: 60, price: 7.5 }, { label: "61 – 90", from: 61, to: 90, price: 8.5 }, { label: "91 – 120", from: 91, to: 120, price: 10.5 }, { label: "121 – 150", from: 121, to: 150, price: 11.5 },
          { label: "151 – 180", from: 151, to: 180, price: 12.5 }, { label: "181 – 210", from: 181, to: 210, price: 13.5 }, { label: "211 – 300", from: 211, to: 300, price: 16.5 }, { label: "301 – 400", from: 301, to: 400, price: 17.5 },
          { label: "ab 400", from: 401, to: null, price: null, text: "auf Anfrage" },
      ],
      note: "Die klassische Bindung für Abschlussarbeiten. Mitgebrachtes Bindegut +1 €." },
    { id: "la4", tab: "lami", name: "Laminat bis A4", sub: "100 oder 125 mic", mode: "tier", unit: "Stück", per: "je Stück", min: 1, max: 200, start: 1, perUnitTotal: true,
      rows: [{ label: "einzeln (1 – 9)", from: 1, to: 9, price: 1.6 }, { label: "ab 10 Stück", from: 10, to: null, price: 1.5 }], note: "Von Visitenkartengröße bis A4, mit UV-Schutz." },
    { id: "la3", tab: "lami", name: "Laminat A3", sub: "125 mic", mode: "tier", unit: "Stück", per: "je Stück", min: 1, max: 200, start: 1, perUnitTotal: true,
      rows: [{ label: "einzeln (1 – 9)", from: 1, to: 9, price: 3 }, { label: "ab 10 Stück", from: 10, to: null, price: 2.9 }], note: "Stabil wie ein Ausweis, mit UV-Schutz." },
]

const TABS: { id: TabId; label: string }[] = [
    { id: "kopien", label: "Kopien & Drucke" },
    { id: "gross", label: "Großformat" },
    { id: "bind", label: "Bindungen" },
    { id: "lami", label: "Laminate" },
]

function euro(v: number): string {
    return v.toLocaleString("de-DE", { style: "currency", currency: "EUR" })
}
function money(v: number): string {
    return v < 1 ? `${(v * 100).toLocaleString("de-DE", { maximumFractionDigits: 1 })} ct` : euro(v)
}
function rowFor(p: Product, qty: number): Row | null {
    return p.rows.find((r) => r.from !== null && qty >= r.from && (r.to === null || qty <= r.to)) ?? null
}
// log-scaled slider so small quantities stay precise
const SLIDER = 1000
function toSlider(p: Product, q: number) {
    if (p.max / p.min <= 60) return ((q - p.min) / (p.max - p.min)) * SLIDER
    return (Math.log(q / p.min) / Math.log(p.max / p.min)) * SLIDER
}
function fromSlider(p: Product, s: number) {
    if (p.max / p.min <= 60) return Math.round(p.min + (s / SLIDER) * (p.max - p.min))
    return Math.round(p.min * Math.pow(p.max / p.min, s / SLIDER))
}

/**
 * Preisfinder – interactive price lists: pick a category and product, set the
 * quantity, see unit price and total; the matching tier row is highlighted.
 *
 * @framerIntrinsicWidth 1216
 * @framerIntrinsicHeight 640
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function Preisfinder(props: PreisfinderProps) {
    const {
        ink = "#111111", paper = "#EFEBE4", line = "#D8D2C7", grey = "#6B675F",
        yellow = "#FFE500", cyan = "#00A3E0", magenta = "#E6007E",
        rechnerLink = "/abschlussarbeit-binden#rechner", kontaktLink = "/kontakt",
    } = props
    const tabColor: Record<TabId, string> = { kopien: cyan, gross: magenta, bind: yellow, lami: ink }

    const [tab, setTab] = useState<TabId>("kopien")
    const [pid, setPid] = useState<Record<TabId, string>>({ kopien: "sw", gross: "a1", bind: "lei", lami: "la4" })
    const [qtys, setQtys] = useState<Record<string, number>>(() => Object.fromEntries(PRODUCTS.map((p) => [p.id, p.start])))
    const [picked, setPicked] = useState<Record<string, number>>({ cad: 0 })

    const product = PRODUCTS.find((p) => p.id === pid[tab]) ?? PRODUCTS[0]
    const qty = qtys[product.id]
    const set = (fn: () => void) => startTransition(fn)
    const setQty = (v: number) => set(() => setQtys((q) => ({ ...q, [product.id]: Math.max(product.min, Math.min(product.max, Math.round(v) || product.min)) })))

    const calc = useMemo(() => {
        const row = product.mode === "pick" ? product.rows[picked[product.id] ?? 0] : rowFor(product, qty)
        const unit = row?.price ?? null
        let total: number | null = null
        if (unit !== null) total = product.perUnitTotal ? unit * qty + (product.fee ? FEE : 0) : unit
        const beyond = product.mode === "tier" && !row && product.beyond ? product.beyond : null
        return { row, unit, total, beyond }
    }, [product, qty, picked])

    const label: CSSProperties = { fontFamily: SANS, fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: grey, margin: 0 }
    const body: CSSProperties = { fontFamily: SANS, fontSize: 16, lineHeight: 1.5, color: ink, margin: 0 }
    const stepBtn: CSSProperties = { width: 44, height: 44, borderRadius: 100, border: `1px solid ${line}`, background: "#fff", color: ink, fontFamily: SANS, fontSize: 20, cursor: "pointer", flexShrink: 0 }
    const products = PRODUCTS.filter((p) => p.tab === tab)
    const accent = tabColor[tab]

    return (
        <div style={{ ...props.style, position: "relative", width: "100%", background: "#fff", border: `1px solid ${line}`, borderRadius: 24, overflow: "hidden" }}>
            {/* Tabs */}
            <div role="tablist" aria-label="Preisbereiche" style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "clamp(16px, 3vw, 24px)", borderBottom: `1px solid ${line}`, background: paper }}>
                {TABS.map((t) => {
                    const active = t.id === tab
                    return (
                        <button key={t.id} type="button" role="tab" aria-selected={active} onClick={() => set(() => setTab(t.id))}
                            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", borderRadius: 100, cursor: "pointer", fontFamily: SANS, fontWeight: 600, fontSize: 15,
                                border: `1px solid ${active ? ink : line}`, background: active ? ink : "#fff", color: active ? "#fff" : ink, transition: "background .2s, color .2s" }}>
                            <span style={{ width: 9, height: 9, borderRadius: 9, background: tabColor[t.id], boxShadow: t.id === "lami" && active ? "0 0 0 1px #fff" : "none" }} />
                            {t.label}
                        </button>
                    )
                })}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {/* Auswahl + Ergebnis */}
                <div style={{ flex: "1 1 400px", minWidth: 0, padding: "clamp(20px, 4vw, 36px)", display: "flex", flexDirection: "column", gap: 28 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <p style={label}>Produkt</p>
                        <div role="radiogroup" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
                            {products.map((p) => {
                                const active = p.id === product.id
                                return (
                                    <button key={p.id} type="button" role="radio" aria-checked={active} onClick={() => set(() => setPid((x) => ({ ...x, [tab]: p.id })))}
                                        style={{ textAlign: "left", cursor: "pointer", padding: "13px 14px", borderRadius: 14, position: "relative", overflow: "hidden",
                                            border: `1.5px solid ${active ? ink : line}`, background: active ? paper : "#fff", display: "flex", flexDirection: "column", gap: 2 }}>
                                        <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: active ? accent : "transparent" }} />
                                        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 17, lineHeight: 1.2, color: ink }}>{p.name}</span>
                                        <span style={{ ...body, fontSize: 13, color: grey }}>{p.sub}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {product.mode === "tier" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <p style={label}>Menge</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <button type="button" aria-label="Menge verringern" style={stepBtn} onClick={() => setQty(qty - (qty > 100 ? 10 : 1))}>−</button>
                                <label style={{ display: "flex", alignItems: "baseline", gap: 8, flex: 1, minWidth: 0, background: paper, borderRadius: 12, padding: "10px 14px" }}>
                                    <input type="number" inputMode="numeric" aria-label={`Menge in ${product.unit}`} value={qty} min={product.min} max={product.max}
                                        onChange={(e) => setQty(parseInt(e.target.value, 10))}
                                        style={{ width: "100%", minWidth: 0, border: "none", background: "transparent", outline: "none", fontFamily: SERIF, fontWeight: 600, fontSize: 26, color: ink, padding: 0 }} />
                                    <span style={{ ...body, color: grey, fontSize: 14 }}>{product.unit}</span>
                                </label>
                                <button type="button" aria-label="Menge erhöhen" style={stepBtn} onClick={() => setQty(qty + (qty >= 100 ? 10 : 1))}>+</button>
                            </div>
                            <input type="range" aria-label="Menge per Regler" min={0} max={SLIDER} value={toSlider(product, qty)} onChange={(e) => setQty(fromSlider(product, Number(e.target.value)))}
                                style={{ width: "100%", accentColor: ink, cursor: "pointer" }} />
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <p style={label}>Format wählen – rechts in der Liste</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <button type="button" aria-label="Anzahl verringern" style={stepBtn} onClick={() => setQty(qty - 1)}>−</button>
                                <span style={{ ...body, fontFamily: SERIF, fontWeight: 600, fontSize: 26, minWidth: 60, textAlign: "center" }}>{qty}</span>
                                <button type="button" aria-label="Anzahl erhöhen" style={stepBtn} onClick={() => setQty(qty + 1)}>+</button>
                                <span style={{ ...body, color: grey, fontSize: 14 }}>{product.unit}</span>
                            </div>
                        </div>
                    )}

                    <div aria-live="polite" style={{ background: ink, color: "#fff", borderRadius: 18, padding: "22px 24px", display: "flex", flexWrap: "wrap", gap: "18px 32px", alignItems: "flex-end" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <span style={{ ...label, color: yellow }}>{product.ab ? `ab · ${product.per}` : product.per}</span>
                            <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(38px, 5vw, 52px)", lineHeight: 1, letterSpacing: "-0.03em" }}>
                                {calc.unit !== null ? money(calc.unit) : calc.row?.text ?? "auf Anfrage"}
                            </span>
                        </div>
                        {product.perUnitTotal && calc.total !== null && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <span style={{ ...label, color: "rgba(255,255,255,0.6)" }}>{qty.toLocaleString("de-DE")} {product.unit} gesamt</span>
                                <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: "clamp(28px, 3.4vw, 36px)", lineHeight: 1, letterSpacing: "-0.02em" }}>
                                    {product.ab ? "ab " : ""}{euro(calc.total)}
                                </span>
                            </div>
                        )}
                        <span style={{ ...body, fontSize: 13, color: "rgba(255,255,255,0.65)", flexBasis: "100%" }}>
                            {calc.beyond ?? (product.fee && calc.total !== null ? "inklusive einmaliger Systemgebühr von 0,50 € bei Ausdrucken. " : "")}
                            {product.tab === "bind" ? "Ganze Abschlussarbeit mit Druck berechnen? " : ""}
                            {product.tab === "bind" && <a href={rechnerLink} style={{ color: yellow, fontWeight: 600 }}>Zum Bindungsrechner</a>}
                        </span>
                    </div>
                </div>

                {/* Staffel */}
                <div style={{ flex: "1 1 340px", minWidth: 0, padding: "clamp(20px, 4vw, 36px)", borderLeft: `1px solid ${line}`, display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                        <h3 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 24, lineHeight: 1.2, margin: 0, color: ink }}>{product.name} <span style={{ color: grey }}>· {product.sub}</span></h3>
                    </div>
                    <div role="table" aria-label={`Staffelpreise ${product.name}`} style={{ display: "flex", flexDirection: "column" }}>
                        <div role="row" style={{ display: "flex", justifyContent: "space-between", padding: "0 12px 10px" }}>
                            <span role="columnheader" style={label}>{product.mode === "pick" ? "Format" : product.unit}</span>
                            <span role="columnheader" style={label}>{product.per}</span>
                        </div>
                        {product.rows.map((r, i) => {
                            const active = product.mode === "pick" ? (picked[product.id] ?? 0) === i : calc.row === r
                            const clickable = r.from !== null
                            return (
                                <button key={r.label} type="button" role="row" disabled={!clickable}
                                    onClick={() => set(() => (product.mode === "pick" ? setPicked((x) => ({ ...x, [product.id]: i })) : setQtys((q) => ({ ...q, [product.id]: r.from as number }))))}
                                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "11px 12px", border: "none", borderTop: `1px solid ${line}`,
                                        borderRadius: active ? 10 : 0, background: active ? yellow : "transparent", cursor: clickable ? "pointer" : "default", textAlign: "left", transition: "background .2s" }}>
                                    <span role="cell" style={{ ...body, fontSize: 15, color: clickable ? ink : grey }}>{r.label}</span>
                                    <span role="cell" style={{ ...body, fontSize: 15, fontWeight: 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                                        {r.price !== null ? `${product.ab ? "ab " : ""}${money(r.price)}` : r.text}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                    <p style={{ ...body, fontSize: 13, color: grey }}>{product.note}</p>
                    <p style={{ ...body, fontSize: 13, color: grey, marginTop: "auto" }}>
                        Andere Papiere, Formate oder Mengen? <a href={kontaktLink} style={{ color: ink, fontWeight: 600 }}>Kurz anfragen</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

addPropertyControls(Preisfinder, {
    ink: { type: ControlType.Color, title: "Toner", defaultValue: "#111111" },
    paper: { type: ControlType.Color, title: "Papier", defaultValue: "#EFEBE4" },
    line: { type: ControlType.Color, title: "Linie", defaultValue: "#D8D2C7" },
    grey: { type: ControlType.Color, title: "Grau", defaultValue: "#6B675F" },
    yellow: { type: ControlType.Color, title: "Gelb", defaultValue: "#FFE500" },
    cyan: { type: ControlType.Color, title: "Cyan", defaultValue: "#00A3E0" },
    magenta: { type: ControlType.Color, title: "Magenta", defaultValue: "#E6007E" },
    rechnerLink: { type: ControlType.Link, title: "Rechner-Link", defaultValue: "/abschlussarbeit-binden#rechner" },
    kontaktLink: { type: ControlType.Link, title: "Kontakt-Link", defaultValue: "/kontakt" },
})
