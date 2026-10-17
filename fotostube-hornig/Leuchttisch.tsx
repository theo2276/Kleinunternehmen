import * as React from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

/**
 * Leuchttisch – eight services on a light table (two halves, 2×2 each).
 * Selecting a service (hover, click, tap, keyboard) merges the four tiles of
 * the OPPOSITE half into one large photo of that service; the frame takes the
 * service's backdrop colour. Below: title, details, price, link.
 * Narrow widths: one large focus photo with eight thumbnails underneath.
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */

type Leistung = { titel?: string; merkmal?: string; text?: string; preis?: string; farbe?: string; bild?: { src: string; alt?: string } | string; link?: string }

const U = "https://framerusercontent.com/images/"
const DATA: { titel: string; merkmal: string; text: string; preis: string; farbe: string; bild: string; link: string }[] = [
    { titel: "Passbild & Bewerbungsfoto", merkmal: "Ohne Termin · E-Passfoto", text: "Biometrische Passbilder, auch für Kinder und Babys, und Bewerbungsfotos – einfach vorbeikommen. Das E-Passfoto übertragen wir direkt digital ans Amt.", preis: "ab 21 €", farbe: "#F6F1E9", bild: "kpJaKXoUM3pW2tbjeWQbacjrfM", link: "/leistungen/passbild-bewerbungsfoto" },
    { titel: "Familie & Kinder", merkmal: "Im Studio oder bei Ihnen zu Hause", text: "Familienfotos, Kinderbilder, Paar- und Freundschaftsbilder – lebendig und locker.", preis: "ab 62 €", farbe: "#EBA800", bild: "eDinIruoffz3dsqSlZrVCwb2zSo", link: "/leistungen/familie-kinder" },
    { titel: "Hunde & Tiere", merkmal: "Im Studio oder draußen", text: "Hunde, Katzen, Kaninchen, Pferde: im Studio ab 82 €, im Freien ab 92 €.", preis: "ab 82 €", farbe: "#C41E42", bild: "flO7T4M4sMQgJZ0O3gzccOMI7y4", link: "/leistungen/hunde-tiere" },
    { titel: "Babybauch", merkmal: "Studio, zu Hause oder draußen", text: "Schwangerschaftsbilder in ruhiger Atmosphäre, da wo Sie sich am wohlsten fühlen.", preis: "ab 115 €", farbe: "#F28A55", bild: "m09wk2oSHCMl3XhaOml8JokOQ4Q", link: "/leistungen/babybauch" },
    { titel: "Hochzeit", merkmal: "Im Studio oder vor Ort", text: "Im Studio ab 82 €, vor Ort ab 425 €. 2026: ab 2 Stunden ein Fotobuch gratis dazu.", preis: "ab 82 €", farbe: "#F6F1E9", bild: "EZ7TarLhKuDyiGB35YNUUhuwU", link: "/leistungen/hochzeit" },
    { titel: "Akt", merkmal: "Nach Vorgespräch · Studio oder zu Hause", text: "Gemeinsam finden wir die Posen, die zu Ihnen passen – mal geheimnisvoll, mal weich und sinnlich ausgeleuchtet.", preis: "ab 115 €", farbe: "#C41E42", bild: "UCUyhvS8NmobeRWhXRjMfkacT8", link: "/leistungen/akt" },
    { titel: "Gruppen", merkmal: "Ab 20 Personen Bilder in 2–3 Stunden", text: "Hochzeiten, Jubiläen, Klassentreffen – ab 20 Personen sind die Bilder im Format 15 × 24 noch am selben Tag fertig.", preis: "auf Anfrage", farbe: "#EBA800", bild: "axuddoWAOvDRHv4vpmEuUNE9M", link: "/leistungen/gruppen" },
    { titel: "Porträt mal anders", merkmal: "Im Kostüm, mit Hobby, mit Haltung", text: "Porträts im Kostüm, mit Ihrem Hobby oder Ihrer Lebenseinstellung – drinnen oder draußen.", preis: "auf Anfrage", farbe: "#F28A55", bild: "TcSwcUN4Y7McIwjxdjCKGEVL98g", link: "/leistungen/portraet-mal-anders" },
].map((d) => ({ ...d, bild: `${U}${d.bild}.jpg` }))

const EASE = "cubic-bezier(.2,.8,.2,1)"

function useWidth(ref: React.RefObject<HTMLDivElement>) {
    const [w, setW] = React.useState(1200)
    React.useLayoutEffect(() => {
        const el = ref.current
        if (!el) return
        setW(el.getBoundingClientRect().width)
        if (typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver((e) => setW(e[0].contentRect.width))
        ro.observe(el)
        return () => ro.disconnect()
    }, [])
    return w
}

export default function Leuchttisch(props: any) {
    const { leistungen, schrift, grund, textfarbe, linkText, style } = props
    const items = React.useMemo(() => {
        const src = leistungen?.length ? leistungen : DATA
        return DATA.map((fb, i) => {
            const l: Leistung = src[i] || {}
            const own = typeof l.bild === "string" ? l.bild : l.bild?.src
            return {
                titel: l.titel || fb.titel,
                merkmal: l.merkmal || fb.merkmal,
                text: l.text || fb.text,
                preis: l.preis || fb.preis,
                farbe: l.farbe || fb.farbe,
                bild: own || fb.bild,
                link: l.link || fb.link,
            }
        })
    }, [leistungen])

    const wrap = React.useRef<HTMLDivElement>(null)
    const width = useWidth(wrap)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    const [aktiv, setAktiv] = React.useState(-1)
    const [reduce, setReduce] = React.useState(false)
    const [vh, setVh] = React.useState(900)
    React.useEffect(() => {
        const on = () => setVh(window.innerHeight)
        on()
        window.addEventListener("resize", on)
        return () => window.removeEventListener("resize", on)
    }, [])
    React.useEffect(() => {
        setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    }, [])
    const t = (s: number) => (reduce || isCanvas ? "0s" : `${s}s`)

    const schmal = width < 760
    const pad = schmal ? 14 : 22
    const g = schmal ? 8 : 12

    const rahmen = aktiv >= 0 ? items[aktiv].farbe : grund
    const resetTimer = React.useRef(0)
    const zurueck = (delay: number) => {
        window.clearTimeout(resetTimer.current)
        resetTimer.current = window.setTimeout(() => setAktiv(-1), delay)
    }
    const pointerTyp = React.useRef("mouse")
    // swipe on the big photo (narrow layout)
    const touchStart = React.useRef<{ x: number; y: number } | null>(null)
    const geswiped = React.useRef(false)
    const [drag, setDrag] = React.useState(0)
    const waehle = (i: number) => {
        window.clearTimeout(resetTimer.current)
        setAktiv(i)
    }

    // ---------- caption (shared) ----------
    const makeCaption = (idx: number) => {
    const fokus = idx >= 0 ? items[idx] : null
    const aktiv = idx
    const dunkelText = fokus ? "#0E0D0C" : textfarbe
    return (
        <div style={{ display: "grid", gridTemplateColumns: schmal ? "1fr" : "1.1fr 1fr auto", gap: schmal ? 12 : 36, alignItems: "end", padding: schmal ? "20px 4px 4px" : "22px 4px 2px", color: dunkelText, transition: `color ${t(0.5)} ease` }}>
            <div key={"t" + aktiv} style={{ font: `700 ${schmal ? 36 : 44}px/0.98 ${schrift}`, letterSpacing: "-0.035em", animation: reduce ? undefined : "lt-in 0.5s " + EASE }}>
                {fokus ? fokus.titel : "Acht Arten, fotografiert zu werden."}
            </div>
            <div key={"m" + aktiv} style={{ font: `400 16px/1.5 ${schrift}`, maxWidth: 440, animation: reduce ? undefined : "lt-in 0.5s " + EASE + " 0.05s both" }}>
                {fokus && <div style={{ fontWeight: 700, marginBottom: 6 }}>{fokus.merkmal}</div>}
                <div style={{ opacity: 0.85 }}>{fokus ? fokus.text : schmal ? "Tippen Sie auf ein Foto." : "Fahren Sie über ein Foto oder wählen Sie es aus."}</div>
            </div>
            {fokus ? (
                <div key={"p" + aktiv} style={{ display: "flex", alignItems: "center", gap: 18, animation: reduce ? undefined : "lt-in 0.5s " + EASE + " 0.1s both" }}>
                    <span style={{ font: `700 ${schmal ? 28 : 34}px/1 ${schrift}`, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>{fokus.preis}</span>
                    <a href={fokus.link} style={{ font: `700 15px/1 ${schrift}`, color: "#F6F1E9", background: "#0E0D0C", padding: "14px 22px", borderRadius: 100, textDecoration: "none", whiteSpace: "nowrap" }}>{linkText}</a>
                </div>
            ) : (
                <div />
            )}
        </div>
    )
    }

    const keyframes = <style>{`@keyframes lt-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`}</style>

    // ---------- narrow layout ----------
    if (schmal) {
        const sel = aktiv >= 0 ? aktiv : 0
        const f = items[sel]
        const inner = width - pad * 2
        const thumb = (inner - g * 3) / 4
        return (
            <div ref={wrap} style={{ ...style, width: "100%", background: f.farbe, padding: pad, borderRadius: 8, boxSizing: "border-box", transition: `background ${t(0.6)} ease` }}>
                {keyframes}
                <a
                    href={f.link}
                    aria-label={`${f.titel} ansehen`}
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    onPointerDown={(e) => {
                        touchStart.current = { x: e.clientX, y: e.clientY }
                        geswiped.current = false
                        setDrag(0)
                    }}
                    onPointerMove={(e) => {
                        const st = touchStart.current
                        if (!st) return
                        const dx = e.clientX - st.x
                        const dy = e.clientY - st.y
                        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) setDrag(dx)
                    }}
                    onPointerUp={(e) => {
                        const st = touchStart.current
                        touchStart.current = null
                        setDrag(0)
                        if (!st) return
                        const dx = e.clientX - st.x
                        const dy = e.clientY - st.y
                        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
                            geswiped.current = true
                            waehle((sel + (dx < 0 ? 1 : -1) + items.length) % items.length)
                        }
                    }}
                    onPointerCancel={() => {
                        touchStart.current = null
                        setDrag(0)
                    }}
                    onClick={(e) => {
                        if (geswiped.current) {
                            e.preventDefault()
                            geswiped.current = false
                        }
                    }}
                    style={{ touchAction: "pan-y", userSelect: "none", WebkitUserSelect: "none", WebkitTouchCallout: "none", position: "relative", display: "block", width: "100%", height: Math.min((width - pad * 2) * 1.25, vh * 0.46), borderRadius: 4, overflow: "hidden", background: f.farbe, transition: `background ${t(0.6)} ease` } as any}
                >
                    <div style={{ position: "absolute", inset: 0, transform: `translateX(${drag * 0.6}px)`, transition: drag === 0 ? `transform ${t(0.35)} ${EASE}` : "none" }}>
                        {items.map((it, i) => (
                            <img key={i} src={it.bild} alt={i === sel ? it.titel : ""} aria-hidden={i !== sel} draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none", opacity: i === sel ? 1 : 0, transform: i === sel ? "scale(1)" : "scale(1.06)", filter: i === sel ? "blur(0px)" : "blur(6px)", transition: `opacity ${t(0.5)} ease, transform ${t(0.8)} ${EASE}, filter ${t(0.6)} ease` }} />
                        ))}
                    </div>
                    <span style={{ position: "absolute", left: 12, top: 12, font: `700 13px/1 ${schrift}`, color: "#F6F1E9", background: "rgba(14,13,12,0.6)", padding: "8px 12px", borderRadius: 100, fontVariantNumeric: "tabular-nums" }}>{sel + 1} / {items.length} · wischen</span>
                    <span style={{ position: "absolute", left: 12, bottom: 12, display: "flex", gap: 8 }}>
                        {[-1, 1].map((d) => (
                            <button
                                key={d}
                                aria-label={d < 0 ? "Vorherige Leistung" : "Nächste Leistung"}
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    waehle((sel + d + items.length) % items.length)
                                }}
                                style={{ all: "unset", cursor: "pointer", width: 40, height: 40, borderRadius: 100, display: "grid", placeItems: "center", background: "rgba(14,13,12,0.65)", color: "#F6F1E9", font: `700 18px/1 ${schrift}` }}
                            >
                                {d < 0 ? "←" : "→"}
                            </button>
                        ))}
                    </span>
                    <span style={{ position: "absolute", right: 12, bottom: 12, font: `700 14px/1 ${schrift}`, color: "#0E0D0C", background: "#F6F1E9", padding: "12px 14px", borderRadius: 100 }}>Ansehen →</span>
                </a>
                {makeCaption(sel)}
                <div role="tablist" aria-label="Leistungen" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: g, marginTop: 18 }}>
                    {items.map((it, i) => (
                        <button key={i} role="tab" aria-selected={i === sel} aria-label={it.titel} onClick={() => waehle(i)} style={{ all: "unset", cursor: "pointer", display: "block", width: thumb, aspectRatio: "4 / 5", borderRadius: 3, overflow: "hidden", outline: i === sel ? "3px solid #0E0D0C" : "none", outlineOffset: 2 }}>
                            <img src={it.bild} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: i === sel ? 1 : 0.75 }} />
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    // ---------- desktop light table ----------
    // fit stage + caption into one screen: shrink tiles when the window is low
    const captionH = 175
    const maxStageH = Math.max(340, vh - captionH - pad * 2 - 48)
    let tileW = ((width - pad * 2 - g) / 2 - g) / 2
    let tileH = tileW * 1.25
    if (tileH * 2 + g > maxStageH) {
        tileH = (maxStageH - g) / 2
        tileW = tileH / 1.25
    }
    const halfW = tileW * 2 + g
    const stageH = tileH * 2 + g
    const stageW = halfW * 2 + g
    const focusSide = aktiv < 0 ? -1 : aktiv < 4 ? 1 : 0 // side that shows the big photo

    const tiles = items.map((it, i) => {
        const side = i < 4 ? 0 : 1
        const j = i % 4
        const col = j % 2
        const row = Math.floor(j / 2)
        const baseX = side * (halfW + g) + col * (tileW + g)
        const baseY = row * (tileH + g)
        const merged = focusSide === side
        // when merged, the four tiles close their gaps and tile the whole half
        const qx = Math.round(halfW / 2)
        const qy = Math.round(stageH / 2)
        const x = Math.round(merged ? side * (halfW + g) + col * qx : baseX)
        const y = Math.round(merged ? row * qy : baseY)
        // 1px overlap on the inner edges hides sub-pixel seams
        const w = Math.round(merged ? qx + (col === 0 ? 1 : 0) : tileW)
        const h = Math.round(merged ? qy + (row === 0 ? 1 : 0) : tileH)
        const isAktiv = aktiv === i
        const dimmed = aktiv >= 0 && !isAktiv && !merged
        return (
            <a
                key={i}
                href={merged && aktiv >= 0 ? items[aktiv].link : it.link}
                aria-label={merged ? undefined : `${it.titel} – ${it.preis}`}
                aria-hidden={merged || undefined}
                onPointerDown={(e) => (pointerTyp.current = e.pointerType)}
                onMouseEnter={() => !isCanvas && pointerTyp.current === "mouse" && !merged && waehle(i)}
                onMouseLeave={() => window.clearTimeout(resetTimer.current)}
                onFocus={() => !merged && waehle(i)}
                onClick={(e) => {
                    if (isCanvas) return e.preventDefault()
                    // touch: first tap shows the preview, second tap opens the page
                    if (!merged && pointerTyp.current !== "mouse" && !isAktiv) {
                        e.preventDefault()
                        waehle(i)
                    }
                }}
                tabIndex={merged ? -1 : 0}
                style={{
                    display: "block",
                    textDecoration: "none",
                    position: "absolute",
                    left: x,
                    top: y,
                    width: w,
                    height: h,
                    overflow: "hidden",
                    borderRadius: merged ? 0 : 3,
                    cursor: "pointer",
                    boxShadow: isAktiv ? `0 0 0 3px #0E0D0C, 0 18px 40px rgba(0,0,0,0.35)` : "none",
                    zIndex: isAktiv ? 3 : 1,
                    transition: `left ${t(0.65)} ${EASE}, top ${t(0.65)} ${EASE}, width ${t(0.65)} ${EASE}, height ${t(0.65)} ${EASE}, border-radius ${t(0.4)} ease, box-shadow ${t(0.18)} ease`,
                }}
            >
                {/* own photo */}
                <img src={it.bild} alt="" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: dimmed ? "brightness(0.5) saturate(0.7)" : "none", transform: isAktiv ? "scale(1.04)" : "scale(1)", transition: `filter ${t(0.35)} ease, transform ${t(0.6)} ${EASE}` }} />
                {/* quadrant of the focused photo (only on the opposite half) */}
                {items.map((f, k) => {
                    const show = merged && aktiv === k
                    if ((k < 4 ? 0 : 1) === side) return null
                    return (
                        <img
                            key={k}
                            src={f.bild}
                            alt=""
                            aria-hidden
                            draggable={false}
                            style={{
                                position: "absolute",
                                left: -col * qx,
                                top: -row * qy,
                                width: Math.round(halfW),
                                height: Math.round(stageH),
                                maxWidth: "none",
                                objectFit: "cover",
                                opacity: show ? 1 : 0,
                                filter: show ? "blur(0px)" : "blur(8px)",
                                transform: show ? "scale(1)" : "scale(1.08)",
                                transformOrigin: `${(1 - col) * 100}% ${(1 - row) * 100}%`,
                                transition: `opacity ${t(0.45)} ease ${show ? t(0.05 + j * 0.04) : "0s"}, filter ${t(0.7)} ease ${show ? t(0.25) : "0s"}, transform ${t(0.8)} ${EASE}`,
                            }}
                        />
                    )
                })}
                {!merged && (
                    <span style={{ position: "absolute", left: 12, bottom: 10, right: 12, font: `700 15px/1.2 ${schrift}`, color: "#F6F1E9", textShadow: "0 1px 12px rgba(0,0,0,0.6)", opacity: isAktiv || aktiv < 0 ? 1 : 0, transform: `translateY(${isAktiv || aktiv < 0 ? 0 : 6}px)`, transition: `opacity ${t(0.25)} ease, transform ${t(0.3)} ease` }}>
                        {it.titel}
                    </span>
                )}
            </a>
        )
    })
    const mergedLeft = focusSide === 1 ? halfW + g : 0

    return (
        <div ref={wrap} style={{ ...style, width: "100%" }}>
        <div onMouseLeave={() => zurueck(250)} style={{ width: stageW + pad * 2, maxWidth: "100%", margin: "0 auto", background: rahmen, padding: pad, borderRadius: 8, boxSizing: "border-box", transition: `background ${t(0.6)} ease` }}>
            {keyframes}
            <div style={{ position: "relative", width: stageW, height: stageH }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 95% at 50% -12%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%)", pointerEvents: "none" }} />
                {tiles}
                {aktiv >= 0 && (
                    <span key={"go" + aktiv} aria-hidden style={{ position: "absolute", right: stageW - (mergedLeft + halfW) + 16, bottom: 16, zIndex: 5, pointerEvents: "none", font: `700 15px/1 ${schrift}`, color: "#0E0D0C", background: "#F6F1E9", padding: "12px 18px", borderRadius: 100, whiteSpace: "nowrap", boxShadow: "0 10px 30px rgba(0,0,0,0.3)", animation: reduce ? undefined : `lt-in 0.5s ${EASE} 0.45s both` }}>
                        Ansehen →
                    </span>
                )}
            </div>
            {makeCaption(aktiv)}
        </div>
        </div>
    )
}

Leuchttisch.defaultProps = {
    leistungen: DATA,
    schrift: '"Familjen Grotesk", sans-serif',
    grund: "#1C1A18",
    textfarbe: "#F6F1E9",
    linkText: "Mehr erfahren",
}

addPropertyControls(Leuchttisch, {
    leistungen: {
        type: ControlType.Array,
        title: "Leistungen",
        maxCount: 8,
        control: {
            type: ControlType.Object,
            controls: {
                titel: { type: ControlType.String, title: "Titel" },
                merkmal: { type: ControlType.String, title: "Merkmal" },
                text: { type: ControlType.String, title: "Text", displayTextArea: true },
                preis: { type: ControlType.String, title: "Preis" },
                farbe: { type: ControlType.Color, title: "Farbe" },
                bild: { type: ControlType.ResponsiveImage, title: "Bild" },
                link: { type: ControlType.Link, title: "Link" },
            },
        },
        defaultValue: DATA.map((d) => ({ ...d, bild: { src: d.bild, alt: d.titel } })),
    },
    linkText: { type: ControlType.String, title: "Knopftext", defaultValue: "Mehr erfahren" },
    grund: { type: ControlType.Color, title: "Grundfarbe", defaultValue: "#1C1A18" },
    textfarbe: { type: ControlType.Color, title: "Textfarbe", defaultValue: "#F6F1E9" },
    schrift: { type: ControlType.String, title: "Schrift", defaultValue: '"Familjen Grotesk", sans-serif' },
})
