import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * GutscheinErstellen – internal voucher generator (hidden page /gutschein-erstellen).
 * Generates a random voucher number, renders the A5 voucher (film strip + aperture,
 * colour by tier), prints it as PDF and copies a tab-separated row for the
 * Gutscheinbuch spreadsheet. Same tool as "Gutschein erstellen.html".
 *
 * @framerSupportedLayoutWidth fill
 * @framerSupportedLayoutHeight auto
 */

const CSS = `  .gsx {
    --rot: #C41E42; --gelb: #EBA800; --orange: #F28A55; --schwarz: #0E0D0C; --papier: #F6F1E9; --grau: #A39D94;
    --font: "Familjen Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
  .gsx * { box-sizing: border-box; }
  .gsx { margin: 0; background: var(--schwarz); color: var(--papier); font-family: var(--font); }
  .gsx .seite { max-width: 1240px; margin: 0 auto; padding: 40px 24px 60px; display: grid; grid-template-columns: 380px 1fr; gap: 48px; align-items: start; }
  .gsx h1 { font-size: 40px; line-height: 1; letter-spacing: -0.03em; margin: 0 0 8px; }
  .gsx .unter { color: var(--grau); margin: 0 0 28px; font-size: 15px; line-height: 1.5; }
  .gsx label { display: block; font-size: 13px; font-weight: 600; color: var(--grau); margin: 18px 0 8px; }
  .gsx input, .gsx select { width: 100%; font: inherit; font-size: 16px; color: var(--papier); background: rgba(246,241,233,0.06); border: 1px solid rgba(246,241,233,0.2); border-radius: 10px; padding: 12px 14px; outline: none; }
  .gsx input:focus, .gsx select:focus { border-color: var(--gelb); }
  .gsx .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .gsx .chip { font: inherit; font-size: 14px; font-weight: 700; padding: 9px 12px; border-radius: 100px; border: 1.5px solid rgba(246,241,233,0.25); background: transparent; color: var(--papier); cursor: pointer; }
  .gsx .chip.an { background: var(--gelb); border-color: var(--gelb); color: var(--schwarz); }
  .gsx .reihe { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .gsx .nummer { display: flex; gap: 8px; align-items: center; }
  .gsx .nummer code { flex: 1; font-family: var(--font); font-size: 18px; font-weight: 700; letter-spacing: 0.06em; padding: 12px 14px; border-radius: 10px; background: rgba(235,168,0,0.12); color: var(--gelb); }
  .gsx .knopf { font: inherit; font-size: 15px; font-weight: 700; border: 0; border-radius: 100px; padding: 14px 22px; cursor: pointer; background: var(--papier); color: var(--schwarz); }
  .gsx .knopf.leise { background: transparent; color: var(--papier); border: 1px solid rgba(246,241,233,0.3); padding: 12px 16px; font-size: 14px; }
  .gsx .aktionen { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
  .gsx .hinweis { margin-top: 14px; font-size: 14px; line-height: 1.5; color: var(--grau); min-height: 21px; }
  .gsx .hinweis.ok { color: var(--gelb); }
  .gsx .vorschau-titel { font-size: 13px; font-weight: 600; color: var(--grau); margin: 0 0 12px; }

  /* ---------- ticket (A5 landscape: 210 x 148 mm) ---------- */
  .gsx .ticket {
    --f: var(--gelb);
    width: 100%; aspect-ratio: 210 / 148; position: relative; overflow: hidden;
    display: grid; grid-template-columns: 34% 1fr; background: var(--f); color: var(--schwarz);
    border-radius: 18px; box-shadow: 0 30px 60px rgba(0,0,0,0.45);
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
    container-type: inline-size;
  }
  .gsx .ticket .foto { position: relative; background: var(--schwarz); overflow: hidden; }
  .gsx .ticket .foto .loecher { position: absolute; top: 0; bottom: 0; left: 1.6cqw; width: 1.9cqw;
    background: repeating-linear-gradient(to bottom, transparent 0 1.3cqw, rgba(246,241,233,0.9) 1.3cqw 3.1cqw, transparent 3.1cqw 4.4cqw);
    -webkit-mask: linear-gradient(#000, #000); border-radius: 0.3cqw; }
  .gsx .ticket .foto .rand { position: absolute; top: 0; bottom: 0; right: 1.4cqw; writing-mode: vertical-rl; transform: rotate(180deg);
    display: flex; align-items: center; justify-content: space-between; padding: 3cqw 0; font-size: 1.45cqw; font-weight: 700;
    letter-spacing: 0.22em; text-transform: uppercase; color: var(--f); opacity: 0.85; white-space: nowrap; }
  .gsx .ticket .foto .blende { position: absolute; left: 50%; top: 50%; width: 74%; aspect-ratio: 1; transform: translate(-44%, -50%); }
  .gsx .ticket .foto .blende svg { width: 100%; height: 100%; display: block; overflow: visible; }
  .gsx .ticket .foto .rahmenzahl { position: absolute; left: 50%; bottom: 3.4cqw; transform: translateX(-44%); font-size: 1.5cqw; font-weight: 700; letter-spacing: 0.2em; color: rgba(246,241,233,0.55); }
  .gsx .ticket .perf { position: absolute; top: 0; bottom: 0; left: 34%; border-left: 0.35cqw dashed rgba(14,13,12,0.35); }
  .gsx .ticket .kerbe { position: absolute; left: 34%; width: 4.4cqw; height: 4.4cqw; border-radius: 50%; background: var(--rot); transform: translate(-50%, -50%); }
  .gsx .ticket .kerbe.oben { top: 0; } .ticket .kerbe.unten { top: 100%; }
  .gsx .ticket .inhalt { padding: 5.2cqw 5.2cqw 4.4cqw 5.6cqw; display: flex; flex-direction: column; min-width: 0; }
  .gsx .ticket .marke { font-weight: 700; font-size: 3.1cqw; letter-spacing: -0.02em; line-height: 1; }
  .gsx .ticket .stufe { font-size: 2.1cqw; font-weight: 600; opacity: 0.7; margin-top: 0.8cqw; }
  .gsx .ticket .betrag { font-weight: 700; font-size: 12.5cqw; letter-spacing: -0.045em; line-height: 0.9; margin-top: auto; white-space: nowrap; }
  .gsx .ticket .wofuer { font-size: 2.2cqw; font-weight: 600; opacity: 0.75; margin-top: 1.2cqw; }
  .gsx .ticket .fuer { margin-top: 2.6cqw; font-size: 2.3cqw; line-height: 1.35; min-height: 3.1cqw; }
  .gsx .ticket .fuer b { font-weight: 700; }
  .gsx .ticket .fuss { margin-top: auto; padding-top: 2.4cqw; border-top: 0.25cqw solid rgba(14,13,12,0.18); display: flex; justify-content: space-between; gap: 2cqw; align-items: end; }
  .gsx .ticket .nr span { display: block; font-size: 1.6cqw; font-weight: 600; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.12em; }
  .gsx .ticket .nr strong { display: block; font-size: 3cqw; font-weight: 700; letter-spacing: 0.08em; color: var(--schwarz); margin-top: 0.6cqw; }
  .gsx .ticket .gueltig { text-align: right; font-size: 1.75cqw; line-height: 1.45; font-weight: 500; }
  .gsx .ticket .gueltig b { font-weight: 700; }
  .gsx .ticket .adresse { font-size: 1.55cqw; opacity: 0.65; margin-top: 1.4cqw; font-weight: 500; }


  .gsx { background: var(--schwarz); color: var(--papier); font-family: var(--font); min-height: 100vh; }
  @media (max-width: 900px) { .gsx .seite { grid-template-columns: 1fr; } }
  @page { size: A5 landscape; margin: 0; }
  @media print {
    html, body { background: #fff !important; }
    body * { visibility: hidden !important; }
    .gsx .ticket, .gsx .ticket * { visibility: visible !important; }
    .gsx .ticket { position: fixed !important; left: 0; top: 0; width: 210mm !important; height: 148mm !important; aspect-ratio: auto; border-radius: 0; box-shadow: none; }
    .gsx .ticket .kerbe { background: #fff; }
  }
`

const STUFEN = [
    { name: "Mini", farbe: "#F28A55", werte: [30, 40, 50, 60] },
    { name: "Normal", farbe: "#EBA800", werte: [70, 80, 90, 100, 125] },
    { name: "Deluxe", farbe: "#F6F1E9", werte: [150, 175, 200, 225, 250] },
]
// no look-alike characters (0/O, 1/I/L)
const ZEICHEN = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"

function neueNummer() {
    const z = new Uint32Array(8)
    crypto.getRandomValues(z)
    const s = Array.from(z, (v) => ZEICHEN[v % ZEICHEN.length]).join("")
    return `FH-${s.slice(0, 4)}-${s.slice(4)}`
}
const stufeFuer = (b: number) => (b >= 150 ? STUFEN[2] : b >= 70 ? STUFEN[1] : STUFEN[0])
const fmtDatum = (d: Date) => d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
const euro = (n: number) => `${String(n).replace(".", ",")} €`
// statutory period: 3 years, counted from the end of the year of purchase
const gueltigBis = (d: Date) => new Date(d.getFullYear() + 3, 11, 31)
const heuteIso = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

// camera aperture: blades between consecutive extended edges of a heptagon
function Blende({ farbe }: { farbe: string }) {
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
    return (
        <svg viewBox="-2 -2 104 104" aria-hidden="true">
            <circle cx="50" cy="50" r="51.5" fill="none" stroke={farbe} strokeOpacity={0.35} strokeWidth={0.8} />
            {P.map((_, i) => {
                const a = P[(i + 1) % n], q1 = Q[i], q2 = Q[(i + 1) % n], b = P[(i + 2) % n]
                return (
                    <path key={i} d={`M${f(a[0])} ${f(a[1])} L${f(q1[0])} ${f(q1[1])} A${R} ${R} 0 0 1 ${f(q2[0])} ${f(q2[1])} L${f(b[0])} ${f(b[1])} Z`}
                        fill={farbe} fillOpacity={i % 2 ? 0.8 : 1} stroke="#0E0D0C" strokeWidth={0.7} strokeLinejoin="round" />
                )
            })}
            <polygon points={P.map((p) => `${f(p[0])},${f(p[1])}`).join(" ")} fill="#0E0D0C" />
            <circle cx="46" cy="45" r="3.2" fill="#F6F1E9" fillOpacity={0.18} />
        </svg>
    )
}

export default function GutscheinErstellen(props: any) {
    const { style } = props
    const [nummer, setNummer] = React.useState("FH-XXXX-XXXX")
    const [betrag, setBetrag] = React.useState(100)
    const [eigen, setEigen] = React.useState("")
    const [fuer, setFuer] = React.useState("")
    const [von, setVon] = React.useState("")
    const [datum, setDatum] = React.useState("")
    const [weg, setWeg] = React.useState("Online")
    const [kaeufer, setKaeufer] = React.useState("")
    const [mail, setMail] = React.useState("")
    const [notiz, setNotiz] = React.useState("")
    const [hinweis, setHinweis] = React.useState<{ t: string; ok?: boolean }>({ t: "" })

    React.useEffect(() => {
        setNummer(neueNummer())
        setDatum(heuteIso())
        if (!document.getElementById("gsx-font")) {
            const l = document.createElement("link")
            l.id = "gsx-font"
            l.rel = "stylesheet"
            l.href = "https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&display=swap"
            document.head.appendChild(l)
        }
    }, [])

    const st = stufeFuer(betrag)
    const d = datum ? new Date(datum + "T12:00:00") : new Date()

    const pdf = () => {
        setHinweis({ t: "Im Druckfenster „Als PDF sichern“ wählen. Danach die Zeile ins Gutscheinbuch kopieren!", ok: true })
        const alt = document.title
        document.title = `Gutschein ${nummer} – FotoStube Hornig`
        window.print()
        window.setTimeout(() => (document.title = alt), 1000)
    }
    const kopie = async () => {
        // column order = Gutscheinbuch: Nummer | Verkauft am | Betrag | Stufe | Käufer | E-Mail | Verkauft | Notiz
        const zeile = [nummer, fmtDatum(d), betrag, st.name, kaeufer.trim(), mail.trim(), weg, notiz.trim()].join("\t")
        try {
            await navigator.clipboard.writeText(zeile)
            setHinweis({ t: "Kopiert. Im Gutscheinbuch in Spalte A der nächsten freien Zeile einfügen.", ok: true })
        } catch {
            window.prompt("Diese Zeile kopieren und ins Gutscheinbuch einfügen:", zeile)
        }
    }

    return (
        <div className="gsx" style={{ ...style, width: "100%" }}>
            <style>{CSS}</style>
            <div className="seite">
                <div className="formular">
                    <h1>Gutschein erstellen</h1>
                    <p className="unter">Betrag wählen, Daten eintragen, als PDF speichern. Danach die Zeile ins Gutscheinbuch kopieren.</p>

                    <label>Gutscheinnummer (automatisch)</label>
                    <div className="nummer">
                        <code>{nummer}</code>
                        <button className="knopf leise" type="button" onClick={() => { setNummer(neueNummer()); setHinweis({ t: "" }) }}>Neu</button>
                    </div>

                    <label>Betrag</label>
                    <div className="chips">
                        {STUFEN.flatMap((s) => s.werte).map((w) => (
                            <button key={w} type="button" className={"chip" + (w === betrag && !eigen ? " an" : "")} onClick={() => { setBetrag(w); setEigen("") }}>
                                {euro(w)}
                            </button>
                        ))}
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <input type="number" min={1} step={1} inputMode="numeric" placeholder="oder eigener Betrag in €" value={eigen}
                            onChange={(e) => { setEigen(e.target.value); const v = Number(e.target.value); if (v > 0) setBetrag(v) }} />
                    </div>

                    <div className="reihe">
                        <div><label>Für (optional)</label><input value={fuer} onChange={(e) => setFuer(e.target.value)} placeholder="z. B. Anna" /></div>
                        <div><label>Von (optional)</label><input value={von} onChange={(e) => setVon(e.target.value)} placeholder="z. B. Tom" /></div>
                    </div>
                    <div className="reihe">
                        <div><label>Verkauft am</label><input type="date" value={datum} onChange={(e) => setDatum(e.target.value)} /></div>
                        <div><label>Verkauft</label>
                            <select value={weg} onChange={(e) => setWeg(e.target.value)}><option>Online</option><option>Im Laden</option></select>
                        </div>
                    </div>
                    <label>Käufer</label><input value={kaeufer} onChange={(e) => setKaeufer(e.target.value)} placeholder="Name" />
                    <label>E-Mail des Käufers</label><input type="email" value={mail} onChange={(e) => setMail(e.target.value)} placeholder="name@beispiel.de" />
                    <label>Notiz (z. B. Stripe-Zahlung)</label><input value={notiz} onChange={(e) => setNotiz(e.target.value)} placeholder="optional" />

                    <div className="aktionen">
                        <button className="knopf" type="button" onClick={pdf}>Als PDF speichern</button>
                        <button className="knopf leise" type="button" onClick={kopie}>Zeile fürs Gutscheinbuch kopieren</button>
                    </div>
                    <div className={"hinweis" + (hinweis.ok ? " ok" : "")}>{hinweis.t}</div>
                </div>

                <div>
                    <p className="vorschau-titel">Vorschau · A5 quer</p>
                    <div className="ticket" style={{ ["--f" as any]: st.farbe }}>
                        <div className="foto">
                            <div className="loecher" />
                            <div className="blende"><Blende farbe={st.farbe} /></div>
                            <div className="rand">
                                <span>FotoStube Hornig</span>
                                <span>{`•  Gutschein ${euro(betrag)}  •  ${st.name}  •`}</span>
                                <span>Göttingen</span>
                            </div>
                            <div className="rahmenzahl">▸ {nummer.slice(3, 7)}</div>
                        </div>
                        <div className="perf" /><div className="kerbe oben" /><div className="kerbe unten" />
                        <div className="inhalt">
                            <div className="marke">FotoStube Hornig</div>
                            <div className="stufe">Gutschein · {st.name}</div>
                            <div className="betrag">{euro(betrag)}</div>
                            <div className="wofuer">einlösbar für alles im Haus</div>
                            <div className="fuer">
                                {fuer.trim() && <>für <b>{fuer.trim()}</b></>}
                                {fuer.trim() && von.trim() && <>{"  ·  "}</>}
                                {von.trim() && <>von <b>{von.trim()}</b></>}
                            </div>
                            <div className="fuss">
                                <div className="nr"><span>Gutscheinnummer</span><strong>{nummer}</strong></div>
                                <div className="gueltig">ausgestellt am <b>{fmtDatum(d)}</b><br />gültig bis <b>{fmtDatum(gueltigBis(d))}</b></div>
                            </div>
                            <div className="adresse">Bühlstraße 38 · 37073 Göttingen · 0551&nbsp;57878 · fotostube-hornig.de</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

addPropertyControls(GutscheinErstellen, {})
