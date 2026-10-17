import * as React from "react"
// @ts-ignore react-dom is provided by Framer at runtime
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

/**
 * Portfolio – one large photo on a coloured "backdrop" (the service colour),
 * thumbnails to jump, arrows / keyboard / swipe to browse, counter "03 / 09"
 * and a fullscreen view. Each change pulls the new photo into focus.
 * Photos come from the CMS gallery field (array of images).
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */

const DEMO = [
    "https://framerusercontent.com/images/flO7T4M4sMQgJZ0O3gzccOMI7y4.jpg",
    "https://framerusercontent.com/images/AnSA78w7ZTMnxLzYhzwLkPMGKA.jpg",
    "https://framerusercontent.com/images/jMPRZcFggMwPDSc0axVLTmGxWk.jpg",
]

// CMS array items can arrive as strings, {src}, or {fieldId: {src}} – find the url
function urlOf(item: any): string | null {
    if (!item) return null
    if (typeof item === "string") return item
    if (typeof item.src === "string") return item.src
    for (const k of Object.keys(item)) {
        const v = item[k]
        if (typeof v === "string" && /^https?:|^data:/.test(v)) return v
        if (v && typeof v === "object" && typeof v.src === "string") return v.src
    }
    return null
}

const EASE = "cubic-bezier(.2,.8,.2,1)"
const pad2 = (n: number) => String(n).padStart(2, "0")

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

export default function Portfolio(props: any) {
    const { bilder, farbe, titel, schrift, style } = props
    const urls = React.useMemo(() => {
        const list = (Array.isArray(bilder) ? bilder : []).map(urlOf).filter(Boolean) as string[]
        return list.length ? list : DEMO
    }, [bilder])
    const n = urls.length
    const wrap = React.useRef<HTMLDivElement>(null)
    const width = useWidth(wrap)
    const schmal = width < 760
    const [i, setI] = React.useState(0)
    const [voll, setVoll] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)
    const [vh, setVh] = React.useState(900)
    const [reduce, setReduce] = React.useState(false)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas
    React.useEffect(() => {
        setMounted(true)
        setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        const on = () => setVh(window.innerHeight)
        on()
        window.addEventListener("resize", on)
        return () => window.removeEventListener("resize", on)
    }, [])
    const t = (s: number) => (reduce || isCanvas ? "0s" : `${s}s`)

    const go = React.useCallback((d: number) => setI((x) => (x + d + n) % n), [n])

    // keyboard: arrows when the viewer has focus or fullscreen is open
    React.useEffect(() => {
        if (!voll) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") go(1)
            if (e.key === "ArrowLeft") go(-1)
            if (e.key === "Escape") setVoll(false)
        }
        window.addEventListener("keydown", onKey)
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            window.removeEventListener("keydown", onKey)
            document.body.style.overflow = prev
        }
    }, [voll, go])

    // preload neighbours
    React.useEffect(() => {
        if (isCanvas) return
        ;[1, -1].forEach((d) => {
            const img = new Image()
            img.src = urls[(i + d + n) % n]
        })
    }, [i, urls, n, isCanvas])

    // swipe
    const touch = React.useRef<number | null>(null)
    const swipe = {
        onTouchStart: (e: React.TouchEvent) => (touch.current = e.touches[0].clientX),
        onTouchEnd: (e: React.TouchEvent) => {
            if (touch.current == null) return
            const dx = e.changedTouches[0].clientX - touch.current
            if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
            touch.current = null
        },
    }

    const pfeil = (d: number, dunkel: boolean, gross = false) => (
        <button
            aria-label={d < 0 ? "Vorheriges Foto" : "Nächstes Foto"}
            onClick={(e) => {
                e.stopPropagation()
                go(d)
            }}
            style={{
                all: "unset",
                cursor: "pointer",
                width: gross ? 56 : 48,
                height: gross ? 56 : 48,
                borderRadius: 100,
                display: "grid",
                placeItems: "center",
                background: dunkel ? "#0E0D0C" : "#F6F1E9",
                color: dunkel ? "#F6F1E9" : "#0E0D0C",
                font: `700 20px/1 ${schrift}`,
                transition: `transform ${t(0.25)} ease`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            {d < 0 ? "←" : "→"}
        </button>
    )

    // the photo stack: all photos layered, the active one in focus
    const fotos = (fit: "contain" | "cover", rahmen: boolean) =>
        urls.map((u, k) => {
            const on = k === i
            return (
                <img
                    key={k}
                    src={u}
                    alt={on ? `${titel} – Foto ${k + 1} von ${n}` : ""}
                    aria-hidden={!on}
                    draggable={false}
                    loading={k < 2 ? "eager" : "lazy"}
                    style={{
                        position: "absolute",
                        inset: 0,
                        margin: "auto",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        width: fit === "cover" ? "100%" : "auto",
                        height: fit === "cover" ? "100%" : "auto",
                        objectFit: fit,
                        border: rahmen ? "10px solid #F6F1E9" : "none",
                        boxSizing: "border-box",
                        borderRadius: 3,
                        boxShadow: rahmen ? "0 30px 70px rgba(0,0,0,0.35)" : "none",
                        opacity: on ? 1 : 0,
                        filter: on ? "blur(0px)" : "blur(10px)",
                        transform: on ? "scale(1)" : "scale(1.04)",
                        transition: `opacity ${t(0.45)} ease, filter ${t(0.6)} ease ${on ? t(0.12) : "0s"}, transform ${t(0.7)} ${EASE}`,
                        pointerEvents: "none",
                    }}
                />
            )
        })

    const stageH = schmal ? Math.round(Math.min(width * 1.2, vh * 0.62)) : Math.round(Math.min(Math.max(vh * 0.78, 520), 780))
    const thumbW = schmal ? 58 : 78

    const stage = (
        <div
            {...swipe}
            onClick={() => !isCanvas && setVoll(true)}
            role="group"
            aria-roledescription="Bildergalerie"
            aria-label={`${titel}: Foto ${i + 1} von ${n}`}
            style={{
                position: "relative",
                flex: schmal ? "none" : 1,
                width: schmal ? "100%" : undefined,
                height: stageH,
                borderRadius: 8,
                overflow: "hidden",
                background: farbe,
                cursor: "zoom-in",
                transition: `background ${t(0.6)} ease`,
            }}
        >
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(110% 90% at 50% -10%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 45%, rgba(0,0,0,0.26) 100%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: schmal ? "22px 22px 84px" : "40px 40px 96px" }}>{fotos("contain", true)}</div>
            <div style={{ position: "absolute", left: schmal ? 18 : 28, right: schmal ? 18 : 28, bottom: schmal ? 16 : 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, color: "#0E0D0C" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                    <span style={{ font: `700 ${schmal ? 22 : 28}px/1 ${schrift}`, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
                        {pad2(i + 1)} <span style={{ opacity: 0.45 }}>/ {pad2(n)}</span>
                    </span>
                    {!schmal && <span style={{ font: `600 14px/1.2 ${schrift}` }}>{titel}</span>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    {pfeil(-1, true)}
                    {pfeil(1, true)}
                </div>
            </div>
            {!schmal && (
                <span style={{ position: "absolute", top: 18, right: 18, font: `700 13px/1 ${schrift}`, color: "#0E0D0C", background: "rgba(246,241,233,0.85)", padding: "9px 13px", borderRadius: 100 }}>Vollbild ⤢</span>
            )}
        </div>
    )

    const thumbs = (
        <div
            role="tablist"
            aria-label="Fotos auswählen"
            style={
                schmal
                    ? { display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" as any }
                    : { display: "grid", gridTemplateColumns: `repeat(3, ${thumbW}px)`, gap: 8, alignContent: "start" }
            }
        >
            {urls.map((u, k) => (
                <button
                    key={k}
                    role="tab"
                    aria-selected={k === i}
                    aria-label={`Foto ${k + 1}`}
                    onClick={() => setI(k)}
                    style={{ all: "unset", cursor: "pointer", flex: "0 0 auto", width: thumbW, height: thumbW * 1.25, borderRadius: 4, overflow: "hidden", outline: k === i ? "2px solid #EBA800" : "none", outlineOffset: 2, opacity: k === i ? 1 : 0.55, transition: `opacity ${t(0.25)} ease` }}
                >
                    <img src={u} alt="" draggable={false} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </button>
            ))}
        </div>
    )

    const vollbild =
        voll && mounted
            ? createPortal(
                  <div role="dialog" aria-modal="true" aria-label={`${titel} im Vollbild`} onClick={() => setVoll(false)} {...swipe} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(14,13,12,0.94)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", animation: reduce ? undefined : `pf-in 0.35s ease` }}>
                      <style>{`@keyframes pf-in{from{opacity:0}to{opacity:1}}`}</style>
                      <div style={{ position: "absolute", inset: schmal ? "70px 12px 110px" : "60px 120px 100px" }}>{fotos("contain", false)}</div>
                      <div style={{ position: "absolute", top: 18, left: 20, right: 20, display: "flex", justifyContent: "space-between", alignItems: "center", color: "#F6F1E9", font: `700 16px/1 ${schrift}` }}>
                          <span style={{ fontVariantNumeric: "tabular-nums" }}>
                              {pad2(i + 1)} <span style={{ opacity: 0.5 }}>/ {pad2(n)}</span> · {titel}
                          </span>
                          <button aria-label="Vollbild schließen" onClick={() => setVoll(false)} style={{ all: "unset", cursor: "pointer", width: 44, height: 44, borderRadius: 100, display: "grid", placeItems: "center", background: "rgba(246,241,233,0.12)", color: "#F6F1E9", font: `400 24px/1 ${schrift}` }}>
                              ×
                          </button>
                      </div>
                      <div style={{ position: "absolute", bottom: schmal ? 36 : 28, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 12 }}>
                          {pfeil(-1, false, true)}
                          {pfeil(1, false, true)}
                      </div>
                  </div>,
                  document.body
              )
            : null

    return (
        <div
            ref={wrap}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "ArrowRight") go(1)
                if (e.key === "ArrowLeft") go(-1)
            }}
            style={{ ...style, width: "100%", outline: "none", display: "flex", flexDirection: schmal ? "column" : "row", gap: schmal ? 12 : 16 }}
        >
            {stage}
            {thumbs}
            {vollbild}
        </div>
    )
}

Portfolio.defaultProps = {
    bilder: [],
    farbe: "#C41E42",
    titel: "Portfolio",
    schrift: '"Familjen Grotesk", sans-serif',
}

addPropertyControls(Portfolio, {
    bilder: { type: ControlType.Array, title: "Bilder", control: { type: ControlType.Object, controls: { bild: { type: ControlType.ResponsiveImage, title: "Bild" } } } },
    farbe: { type: ControlType.Color, title: "Farbe", defaultValue: "#C41E42" },
    titel: { type: ControlType.String, title: "Titel", defaultValue: "Portfolio" },
    schrift: { type: ControlType.String, title: "Schrift", defaultValue: '"Familjen Grotesk", sans-serif' },
})
