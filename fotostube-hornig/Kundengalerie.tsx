import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

/**
 * Kundengalerie – client login page body. The client enters the gallery code
 * they received (or opens a link like /kunden-login?galerie=gal_xxx) and the
 * Picflow gallery is rendered right here via Picflow's <picflow-gallery> web component.
 * Access control (password) is handled by Picflow, so no Framer password pages are needed.
 *
 * @framerSupportedLayoutWidth fill
 * @framerSupportedLayoutHeight auto
 */

const SCRIPT = "https://picflow.com/embed/main.js"
const FEHLER = /wrong or not public/i

function ladeSkript() {
    if (typeof document === "undefined") return
    if (document.querySelector(`script[src="${SCRIPT}"]`)) return
    const s = document.createElement("script")
    s.src = SCRIPT
    s.type = "module"
    s.defer = true
    document.head.appendChild(s)
}

// accepts "gal_xxx", the bare id, or a full Picflow link/embed code and returns "gal_xxx"
function normCode(roh: string): string {
    const t = (roh || "").trim()
    if (!t) return ""
    const m = t.match(/gal_[A-Za-z0-9]+/)
    if (m) return m[0]
    // Picflow share links end with the gallery path (= id without "gal_")
    const teile = t.split(/[\/?#&=\s]+/).filter((x) => /^[A-Za-z0-9]{12,}$/.test(x))
    if (teile.length) return "gal_" + teile[teile.length - 1]
    return t.replace(/\s+/g, "")
}

function ausUrl(): string {
    if (typeof window === "undefined") return ""
    const p = new URLSearchParams(window.location.search)
    return normCode(p.get("galerie") || p.get("g") || "")
}


// ---------- "download all" ----------
// Uses the same public Picflow endpoints the embed itself calls. Respects the gallery's
// own settings (full-gallery download allowed, watermark, approved-only, media size).

const API = "https://picflow.com/api/v1"
const CDN = "https://cdn.picflow.com/assets/images/"
const TEIL_MAX = 450 * 1024 * 1024 // split very large galleries into several ZIPs

type Datei = { name: string; url: string }

// password a client entered in the Picflow embed (Picflow keeps it in localStorage)
function gespeichertesPasswort(id: string): string {
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i) || ""
            if (!k.includes("galleryPasswords")) continue
            let v: any = JSON.parse(localStorage.getItem(k) || "null")
            if (v && typeof v === "object" && v.value && typeof v.value === "object") v = v.value
            if (v && typeof v[id] === "string") return v[id]
        }
    } catch {}
    return ""
}

async function holeDateien(id: string, tenant: string): Promise<{ titel: string; dateien: Datei[] } | null> {
    const pw = gespeichertesPasswort(id)
    const q = (tenant ? `&picflow-tenant=${encodeURIComponent(tenant)}` : "") + (pw ? `&password=${encodeURIComponent(pw)}` : "")
    const gr = await fetch(`${API}/galleries/${encodeURIComponent(id)}?x=1${q}`)
    if (!gr.ok) return null
    const g = await gr.json()
    if (!g || g.download_full_gallery === false) return null
    const groesse = Number(g.download_media_size) || 999999
    const dateien: Datei[] = []
    const namen = new Set<string>()
    let cursor = ""
    for (let runde = 0; runde < 50; runde++) {
        const r = await fetch(`${API}/assets?gallery=${encodeURIComponent(id)}${q}&limit=100${cursor ? `&page_after=${encodeURIComponent(cursor)}` : ""}`)
        if (!r.ok) return null
        const j = await r.json()
        for (const a of j.data || []) {
            if (a.type !== "image" || a.deleted_at) continue
            if (g.approved_downloads_only && a.status !== "approved") continue
            const v = a.version_data || {}
            const wm = g.watermark_enabled && a.watermark_enabled !== false && v.watermark_original_key
            let url = ""
            if (wm) url = CDN + v.watermark_original_key
            else if (groesse >= 999999 && v.original_key) url = CDN + v.original_key
            else if (v.uuid) url = `${CDN}resized/l${groesse}/${v.uuid}.${v.ext || "jpg"}`
            if (!url) continue
            let name = String(v.asset_name || `${a.name || a.id}.${v.ext || "jpg"}`).replace(/[\\/:*?"<>|]/g, "_")
            if (namen.has(name)) name = name.replace(/(\.[^.]*)?$/, `-${a.id.slice(-4)}$1`)
            namen.add(name)
            dateien.push({ name, url })
        }
        if (!j.has_more_next || !j.next_cursor) break
        cursor = j.next_cursor
    }
    return { titel: String(g.title || g.name || "Galerie"), dateien }
}

// minimal ZIP writer (store, no compression - JPEGs don't shrink anyway)
const CRC = (() => {
    const t = new Uint32Array(256)
    for (let n = 0; n < 256; n++) {
        let c = n
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
        t[n] = c >>> 0
    }
    return t
})()
function crc32(b: Uint8Array) {
    let c = 0xffffffff
    for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8)
    return (c ^ 0xffffffff) >>> 0
}
function baueZip(eintraege: { name: string; daten: Uint8Array }[]): Blob {
    const enc = new TextEncoder()
    const jetzt = new Date()
    const dosZeit = (jetzt.getHours() << 11) | (jetzt.getMinutes() << 5) | Math.floor(jetzt.getSeconds() / 2)
    const dosDatum = ((jetzt.getFullYear() - 1980) << 9) | ((jetzt.getMonth() + 1) << 5) | jetzt.getDate()
    const teile: BlobPart[] = []
    const zentral: Uint8Array[] = []
    let off = 0
    for (const e of eintraege) {
        const n = enc.encode(e.name)
        const crc = crc32(e.daten)
        const lh = new DataView(new ArrayBuffer(30))
        lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true)
        lh.setUint16(8, 0, true); lh.setUint16(10, dosZeit, true); lh.setUint16(12, dosDatum, true); lh.setUint32(14, crc, true)
        lh.setUint32(18, e.daten.length, true); lh.setUint32(22, e.daten.length, true); lh.setUint16(26, n.length, true)
        teile.push(lh.buffer, n as unknown as BlobPart, e.daten as unknown as BlobPart)
        const ch = new DataView(new ArrayBuffer(46))
        ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true)
        ch.setUint16(12, dosZeit, true); ch.setUint16(14, dosDatum, true)
        ch.setUint32(16, crc, true); ch.setUint32(20, e.daten.length, true); ch.setUint32(24, e.daten.length, true)
        ch.setUint16(28, n.length, true); ch.setUint32(42, off, true)
        const z = new Uint8Array(46 + n.length)
        z.set(new Uint8Array(ch.buffer), 0); z.set(n, 46)
        zentral.push(z)
        off += 30 + n.length + e.daten.length
    }
    const groesse = zentral.reduce((s, z) => s + z.length, 0)
    const ende = new DataView(new ArrayBuffer(22))
    ende.setUint32(0, 0x06054b50, true); ende.setUint16(8, eintraege.length, true); ende.setUint16(10, eintraege.length, true)
    ende.setUint32(12, groesse, true); ende.setUint32(16, off, true)
    return new Blob([...teile, ...(zentral as unknown as BlobPart[]), ende.buffer], { type: "application/zip" })
}
function speichere(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 60000)
}

function AlleLaden({ id, tenant, schrift, knopf, geladen }: any) {
    const [info, setInfo] = React.useState<{ titel: string; dateien: Datei[] } | null>(null)
    const [stand, setStand] = React.useState<{ fertig: number; gesamt: number } | null>(null)
    const [fehler, setFehler] = React.useState("")

    React.useEffect(() => {
        let aus = false
        setInfo(null)
        holeDateien(id, tenant).then((r) => !aus && setInfo(r && r.dateien.length ? r : null)).catch(() => {})
        return () => { aus = true }
    }, [id, tenant, geladen])

    if (!info) return null

    const los = async () => {
        if (stand) return
        setFehler("")
        const liste = info.dateien
        setStand({ fertig: 0, gesamt: liste.length })
        try {
            const basis = `FotoStube-Hornig-${info.titel}`.replace(/[^\wäöüÄÖÜß-]+/g, "-").replace(/-+/g, "-")
            let teil: { name: string; daten: Uint8Array }[] = []
            let teilGroesse = 0
            let teilNr = 1
            let fertig = 0
            const daten: (Uint8Array | null)[] = new Array(liste.length).fill(null)
            // fetch in parallel (4 at a time), write parts in order
            let naechster = 0
            const arbeiter = async () => {
                while (naechster < liste.length) {
                    const i = naechster++
                    const r = await fetch(liste[i].url)
                    if (!r.ok) throw new Error("http " + r.status)
                    daten[i] = new Uint8Array(await r.arrayBuffer())
                    fertig++
                    setStand({ fertig, gesamt: liste.length })
                }
            }
            await Promise.all([arbeiter(), arbeiter(), arbeiter(), arbeiter()])
            const gesamtGroesse = daten.reduce((s, d) => s + (d ? d.length : 0), 0)
            const mehrteilig = gesamtGroesse > TEIL_MAX
            for (let i = 0; i < liste.length; i++) {
                const d = daten[i]!
                if (teil.length && teilGroesse + d.length > TEIL_MAX) {
                    speichere(baueZip(teil), `${basis}-Teil-${teilNr++}.zip`)
                    teil = []
                    teilGroesse = 0
                }
                teil.push({ name: liste[i].name, daten: d })
                teilGroesse += d.length
                daten[i] = null
            }
            if (teil.length) speichere(baueZip(teil), mehrteilig ? `${basis}-Teil-${teilNr}.zip` : `${basis}.zip`)
        } catch (e) {
            setFehler("Der Download hat nicht geklappt. Bitte versuchen Sie es noch einmal.")
        }
        setStand(null)
    }

    return (
        <span style={{ display: "inline-flex", flexDirection: "column", gap: 6 }}>
            <button type="button" onClick={los} disabled={!!stand} style={{ ...knopf, opacity: stand ? 0.85 : 1, cursor: stand ? "progress" : "pointer" }}>
                {stand ? `Bilder werden geladen … ${stand.fertig} / ${stand.gesamt}` : `Alle ${info.dateien.length} Bilder herunterladen ↓`}
            </button>
            {fehler && <span style={{ fontFamily: schrift, fontSize: 13, color: "#F28A55" }}>{fehler}</span>}
        </span>
    )
}

export default function Kundengalerie(props: any) {
    const { beispielId, tenant, telefon, schrift, akzent, style } = props
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const [id, setId] = React.useState("")
    const [eingabe, setEingabe] = React.useState("")
    const [fehler, setFehler] = React.useState(false)
    const [geladen, setGeladen] = React.useState(false)
    const box = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (isCanvas) return
        const u = ausUrl() || (beispielId || "").trim()
        if (u) setId(u)
    }, [isCanvas, beispielId])

    // load script once a gallery is requested, then watch for Picflow's error text
    React.useEffect(() => {
        if (isCanvas || !id) return
        ladeSkript()
        setFehler(false)
        setGeladen(false)
        const t = window.setInterval(() => {
            const el = box.current
            if (!el) return
            const txt = el.innerText || ""
            if (FEHLER.test(txt)) {
                setFehler(true)
                window.clearInterval(t)
            } else if (el.querySelector("img")) {
                setGeladen(true)
                window.clearInterval(t)
            }
        }, 300)
        const stop = window.setTimeout(() => window.clearInterval(t), 20000)
        return () => {
            window.clearInterval(t)
            window.clearTimeout(stop)
        }
    }, [isCanvas, id])

    const oeffnen = (e: React.FormEvent) => {
        e.preventDefault()
        const v = normCode(eingabe)
        if (!v) return
        setId(v)
        try {
            const url = new URL(window.location.href)
            url.searchParams.set("galerie", v)
            window.history.replaceState(null, "", url.toString())
        } catch {}
    }

    const zurueck = () => {
        setId("")
        setEingabe("")
        setFehler(false)
        try {
            const url = new URL(window.location.href)
            url.searchParams.delete("galerie")
            url.searchParams.delete("g")
            window.history.replaceState(null, "", url.toString())
        } catch {}
    }

    const papier = "#F6F1E9"
    const knopf: React.CSSProperties = {
        fontFamily: schrift, fontSize: 15, fontWeight: 700, color: "#0E0D0C", background: papier,
        border: 0, borderRadius: 100, padding: "15px 24px", cursor: "pointer", whiteSpace: "nowrap",
    }

    const formular = (
        <form onSubmit={oeffnen} style={{ display: "flex", flexWrap: "wrap", gap: 10, width: "100%", maxWidth: 560 }}>
            <label htmlFor="galerie-code" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                Galerie-Code
            </label>
            <input
                id="galerie-code"
                value={eingabe}
                onChange={(e) => setEingabe(e.target.value)}
                placeholder="Galerie-Code oder Link"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                style={{
                    flex: "1 1 240px", minWidth: 0, fontFamily: schrift, fontSize: 16, color: papier,
                    background: "rgba(246,241,233,0.06)", border: "1px solid rgba(246,241,233,0.22)",
                    borderRadius: 100, padding: "14px 20px", outline: "none",
                }}
            />
            <button type="submit" style={knopf}>Galerie öffnen →</button>
        </form>
    )

    // canvas preview: form + placeholder tiles
    if (isCanvas || !id) {
        return (
            <div style={{ ...style, width: "100%", display: "flex", flexDirection: "column", gap: 28, fontFamily: schrift, color: papier }}>
                {formular}
                {isCanvas && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, opacity: 0.5 }}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} style={{ aspectRatio: i % 3 === 0 ? "3 / 4" : "4 / 3", background: "rgba(246,241,233,0.08)", borderRadius: 4 }} />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div style={{ ...style, width: "100%", display: "flex", flexDirection: "column", gap: 24, fontFamily: schrift, color: papier }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, paddingBottom: 16, borderBottom: "1px solid rgba(246,241,233,0.14)" }}>
                <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.75 }}>
                    {fehler ? "Galerie nicht gefunden" : geladen ? "Ihre Galerie" : "Galerie wird geladen …"}
                </span>
                <span style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "flex-start", gap: 10 }}>
                    {!fehler && <AlleLaden id={id} tenant={tenant} geladen={geladen} schrift={schrift} knopf={{ ...knopf, padding: "10px 18px", fontSize: 14 }} />}
                    <button type="button" onClick={zurueck} style={{ ...knopf, background: "transparent", color: papier, border: "1px solid rgba(246,241,233,0.3)", padding: "10px 18px", fontSize: 14 }}>
                        Anderen Code eingeben
                    </button>
                </span>
            </div>

            {fehler && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, maxWidth: 560 }}>
                        Zu diesem Code finden wir keine Galerie. Bitte prüfen Sie die Schreibweise oder rufen Sie uns an:{" "}
                        <a href={`tel:${String(telefon).replace(/\s/g, "")}`} style={{ color: akzent }}>{telefon}</a>.
                    </p>
                    {formular}
                </div>
            )}

            <div ref={box} style={{ display: fehler ? "none" : "block", minHeight: geladen ? 0 : 320 }}>
                {React.createElement("picflow-gallery", {
                    key: id,
                    id,
                    ...(tenant ? { tenant } : {}),
                    lightbox: "#0E0D0C",
                    downloads: "true",
                    protection: "false",
                    "no-padding": "true",
                    "no-background": "true",
                    "show-cover": "false",
                    mode: "framer",
                })}
            </div>
        </div>
    )
}

Kundengalerie.defaultProps = {
    beispielId: "",
    tenant: "",
    telefon: "0551 57878",
    schrift: '"Familjen Grotesk", sans-serif',
    akzent: "#EBA800",
}

addPropertyControls(Kundengalerie, {
    beispielId: { type: ControlType.String, title: "Beispiel-Galerie", defaultValue: "", description: "Nur zum Testen: diese Galerie wird ohne Code gezeigt. Für den Livegang leer lassen." },
    tenant: { type: ControlType.String, title: "Picflow-Konto", defaultValue: "", description: "Die tnt_…-Kennung aus Picflows Einbettungscode." },
    telefon: { type: ControlType.String, title: "Telefon", defaultValue: "0551 57878" },
    schrift: { type: ControlType.String, title: "Schrift", defaultValue: '"Familjen Grotesk", sans-serif' },
    akzent: { type: ControlType.Color, title: "Akzent", defaultValue: "#EBA800" },
})
