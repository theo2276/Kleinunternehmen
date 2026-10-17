import * as React from "react"
// @ts-ignore react-dom is provided by Framer at runtime
import { createPortal } from "react-dom"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

/**
 * Bilduniversum – photos float at different depths in a 3D space.
 * The whole space tilts with the mouse (near photos move more than far ones).
 * Hovering a photo pulls it forward and shows its caption.
 * Clicking a photo flies it to the centre, blurs everything behind it and
 * pulls the photo into focus. Click, Esc or scroll sends it back.
 * Touch / no mouse: slow idle drift. Reduced motion & canvas: static.
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */

type Foto = { bild?: { src: string; alt?: string } | string; titel?: string }

const U = "https://framerusercontent.com/images/"
const DEFAULT_FOTOS: Foto[] = [
    ["flO7T4M4sMQgJZ0O3gzccOMI7y4", "Hundeshooting"],
    ["rDQttS4bFbt5nY6U9NU7ouQJR0U", "Porträt"],
    ["VVqzr9DFhsFgEbMgVhv0cKOeLY", "Babyshooting"],
    ["7zcDjtIyVi8OKYX6aLesyIDZpA", "Hundeshooting"],
    ["AnSA78w7ZTMnxLzYhzwLkPMGKA", "Hundeshooting"],
    ["UOWPITZGL0zpepyTfjHYVlV4mM", "Familie mit Hund"],
    ["7OlQEMAAwppes177OAoFWrv4Bg", "Hundeshooting"],
    ["7A9pH0QMH9CAzJ6LTE16qNTAVK0", "Porträt"],
    ["NpnxMfkYa2pnDzVh7Xka7Hxufg", "Porträt mal anders"],
    ["1jbeMm9ajfztiRMKhWXEhKwKLlg", "Hundeshooting"],
    ["slFyPO8M51dui5BxkuXeqPCU24", "Babyshooting"],
    ["eDinIruoffz3dsqSlZrVCwb2zSo", "Familienshooting"],
    ["jMPRZcFggMwPDSc0axVLTmGxWk", "Hundeshooting"],
    ["EZ7TarLhKuDyiGB35YNUUhuwU", "Hochzeit"],
    ["jBkwNbDBXaEs5zmyiYLBWjN9b8", "Hundeshooting"],
    ["FgmIRK0cjM8hUU9bvkQpqB4OXvs", "Babyshooting"],
    ["WOpoOr5zjTLN9wIbO0mYaFrXw", "Porträt"],
    ["pPSe64UeOMbAOiwHcKnVU1Hczo", "Hundeshooting"],
    ["qnc3hZzmmv4z2VRFVh0NsmnU", "Kinderporträt"],
    ["6d9U2wdQCehduSjSJuP0MWrOGY", "Hundeshooting"],
    ["95E0RbjHjyFBYAF5hcFGQb7pIg8", "Hundeshooting"],
    ["xyyRaOo4DNA315EP0LVZ0CKWDs", "Kinderporträt"],
    ["aMhQVTPszmdOF725RoyT4W9Pl0A", "Hundeshooting"],
    ["Nt5o0b4owczfmaDjCz7kYXP6C4", "Hochzeit"],
].map(([id, titel]) => ({ bild: { src: `${U}${id}.jpg`, alt: titel }, titel }))

// Deterministic pseudo random so the layout is the same on every visit
function rand(seed: number) {
    const x = Math.sin(seed * 9301 + 49297) * 233280
    return x - Math.floor(x)
}

type Item = { src: string; alt: string; titel: string; x: number; y: number; z: number; w: number }

function layout(fotos: Foto[]): Item[] {
    const cols = 6
    const rows = Math.ceil(fotos.length / cols)
    return fotos.map((f, i) => {
        const c = i % cols
        const r = Math.floor(i / cols)
        // cells spread over -22%..122% so the tilted space never shows empty edges
        let x = -26 + ((c + 0.5) / cols) * 152 + (rand(i + 1) - 0.5) * 9
        let y = -22 + ((r + 0.5) / rows) * 144 + (rand(i + 101) - 0.5) * 8 + (c % 2 ? 9 : -9)
        const dx = (x - 50) / 50
        const dy = (y - 50) / 50
        const centre = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy)) // 1 = middle
        // photos near the middle sit far back so the name stays readable
        const z = Math.min(1, Math.max(0.05, rand(i + 201) * 0.9 + 0.1 - centre * 0.55))
        const fallback = DEFAULT_FOTOS[i % DEFAULT_FOTOS.length]
        const own = typeof f.bild === "string" ? f.bild : f.bild?.src
        const src = own || (fallback.bild as { src: string }).src
        const alt = (typeof f.bild === "object" && f.bild?.alt) || f.titel || fallback.titel || ""
        return { src, alt, titel: f.titel || fallback.titel || "", x, y, z, w: 0.82 + rand(i + 301) * 0.36 }
    })
}

type Fokus = { i: number; from: { left: number; top: number; width: number; height: number } }

function zielRect() {
    const iw = window.innerWidth
    const ih = window.innerHeight
    let h = Math.min(ih * 0.78, 980)
    let w = h * 0.75
    if (w > iw * 0.86) {
        w = iw * 0.86
        h = w / 0.75
    }
    return { left: (iw - w) / 2, top: (ih - h) / 2 - 18, width: w, height: h }
}

export default function Bilduniversum(props: any) {
    const { fotos, bildbreite, tiefe, neigung, drift, schrift, textfarbe, unschaerfe, style } = props
    const items = React.useMemo(() => layout(fotos?.length ? fotos : DEFAULT_FOTOS), [fotos])
    const stage = React.useRef<HTMLDivElement>(null)
    const tiles = React.useRef<(HTMLDivElement | null)[]>([])
    const [hover, setHover] = React.useState(-1)
    const [fokus, setFokus] = React.useState<Fokus | null>(null)
    const [offen, setOffen] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)
    const closing = React.useRef(0)
    const isCanvas = RenderTarget.current() === RenderTarget.canvas

    React.useEffect(() => setMounted(true), [])

    // Mouse tilt + idle drift
    React.useEffect(() => {
        if (isCanvas) return
        const el = stage.current
        if (!el) return
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (reduce) return
        const fine = window.matchMedia("(pointer: fine)").matches
        let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0
        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return
            tx = (e.clientX / window.innerWidth) * 2 - 1
            ty = (e.clientY / window.innerHeight) * 2 - 1
        }
        const t0 = performance.now()
        const tick = (now: number) => {
            const t = (now - t0) / 1000
            const amp = fine ? drift * 0.35 : drift
            const ix = Math.sin(t * 0.13) * amp
            const iy = Math.cos(t * 0.11) * amp * 0.7
            cx += (tx - cx) * 0.055
            cy += (ty - cy) * 0.055
            const ry = cx * neigung + ix
            const rx = -cy * neigung * 0.65 + iy
            el.style.transform = `translate3d(${-cx * 26}px, ${-cy * 18}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`
            raf = requestAnimationFrame(tick)
        }
        window.addEventListener("pointermove", onMove, { passive: true })
        raf = requestAnimationFrame(tick)
        return () => {
            window.removeEventListener("pointermove", onMove)
            cancelAnimationFrame(raf)
        }
    }, [isCanvas, neigung, drift])

    const rectOf = (i: number) => {
        const r = tiles.current[i]?.getBoundingClientRect()
        return r ? { left: r.left, top: r.top, width: r.width, height: r.height } : zielRect()
    }

    const oeffnen = (i: number) => {
        if (isCanvas) return
        window.clearTimeout(closing.current)
        setHover(-1)
        setFokus({ i, from: rectOf(i) })
        setOffen(false)
        requestAnimationFrame(() => requestAnimationFrame(() => setOffen(true)))
    }

    const schliessen = React.useCallback(() => {
        setFokus((f) => (f ? { ...f, from: rectOf(f.i) } : f))
        setOffen(false)
        window.clearTimeout(closing.current)
        closing.current = window.setTimeout(() => setFokus(null), 700)
    }, [])

    // Esc, scrolling and resizing close the focused photo
    React.useEffect(() => {
        if (!fokus || !offen) return
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && schliessen()
        const onScroll = () => schliessen()
        window.addEventListener("keydown", onKey)
        window.addEventListener("wheel", onScroll, { passive: true })
        window.addEventListener("touchmove", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        return () => {
            window.removeEventListener("keydown", onKey)
            window.removeEventListener("wheel", onScroll)
            window.removeEventListener("touchmove", onScroll)
            window.removeEventListener("resize", onScroll)
        }
    }, [fokus, offen, schliessen])

    const ease = "cubic-bezier(.2,.8,.2,1)"
    const fItem = fokus ? items[fokus.i] : null
    const ziel = fokus && offen ? zielRect() : fokus?.from

    const overlay =
        fokus && fItem && ziel ? (
            <div
                role="dialog"
                aria-modal="true"
                aria-label={fItem.alt}
                onClick={schliessen}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9999,
                    cursor: "zoom-out",
                    backdropFilter: `blur(${offen ? unschaerfe : 0}px)`,
                    WebkitBackdropFilter: `blur(${offen ? unschaerfe : 0}px)`,
                    background: `rgba(14,13,12,${offen ? 0.5 : 0})`,
                    transition: `backdrop-filter 0.7s ${ease}, -webkit-backdrop-filter 0.7s ${ease}, background 0.7s ${ease}`,
                }}
            >
                <img
                    src={fItem.src}
                    alt={fItem.alt}
                    draggable={false}
                    style={{
                        position: "fixed",
                        left: ziel.left,
                        top: ziel.top,
                        width: ziel.width,
                        height: ziel.height,
                        objectFit: "cover",
                        borderRadius: 4,
                        boxShadow: offen ? "0 40px 90px rgba(0,0,0,0.6)" : "0 0 0 rgba(0,0,0,0)",
                        // focus pull: arrives soft, then snaps sharp
                        filter: offen ? "blur(0px)" : "blur(5px)",
                        transition: `left 0.75s ${ease}, top 0.75s ${ease}, width 0.75s ${ease}, height 0.75s ${ease}, box-shadow 0.75s ${ease}, filter ${offen ? "0.5s ease 0.55s" : "0.3s ease"}`,
                    }}
                />
                <div
                    style={{
                        position: "fixed",
                        left: ziel.left,
                        top: ziel.top + ziel.height + 14,
                        width: ziel.width,
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 16,
                        font: `600 15px/1.3 ${schrift}`,
                        color: textfarbe,
                        opacity: offen ? 1 : 0,
                        transform: `translateY(${offen ? 0 : 8}px)`,
                        transition: `opacity 0.45s ease ${offen ? "0.6s" : "0s"}, transform 0.6s ${ease} ${offen ? "0.6s" : "0s"}`,
                    }}
                >
                    <span>{fItem.titel}</span>
                    <span style={{ fontWeight: 400, opacity: 0.6 }}>Klicken zum Schließen</span>
                </div>
            </div>
        ) : null

    return (
        <div style={{ ...style, position: "relative", width: "100%", height: "100%", overflow: "hidden", perspective: 1100, perspectiveOrigin: "50% 50%" }}>
            <div ref={stage} style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", willChange: "transform", pointerEvents: "none" }}>
                {items.map((it, i) => {
                    const active = hover === i
                    const dimmed = hover !== -1 && !active
                    const hidden = fokus?.i === i
                    const z = (it.z - 1) * tiefe // far photos sit up to `tiefe` px back
                    const bright = 0.42 + it.z * 0.5
                    const blur = (1 - it.z) * 2.2
                    return (
                        <div
                            key={i}
                            ref={(el) => { tiles.current[i] = el }}
                            role="button"
                            tabIndex={0}
                            aria-label={`${it.titel} groß ansehen`}
                            onClick={() => oeffnen(i)}
                            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), oeffnen(i))}
                            onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
                            onPointerLeave={() => setHover((h) => (h === i ? -1 : h))}
                            style={{
                                position: "absolute",
                                left: `${it.x}%`,
                                top: `${it.y}%`,
                                width: bildbreite * it.w,
                                transform: `translate(-50%, -50%) translateZ(${active ? z + 160 : z}px) scale(${active ? 1.08 : 1})`,
                                transition: "transform 0.7s cubic-bezier(.2,.8,.2,1), filter 0.5s ease",
                                filter: active ? "none" : `brightness(${dimmed ? bright * 0.7 : bright}) blur(${blur}px)`,
                                zIndex: active ? 100 : Math.round(it.z * 50),
                                opacity: hidden ? 0 : 1,
                                cursor: "zoom-in",
                                pointerEvents: "auto",
                                outline: "none",
                            }}
                        >
                            <img
                                src={it.src}
                                alt={it.alt}
                                draggable={false}
                                loading={i < 12 ? "eager" : "lazy"}
                                style={{ display: "block", width: "100%", aspectRatio: "3 / 4", objectFit: "cover", borderRadius: 4, boxShadow: active ? "0 30px 60px rgba(0,0,0,0.55)" : "none", transition: "box-shadow 0.5s ease" }}
                            />
                            <div
                                aria-hidden
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    top: "100%",
                                    paddingTop: 10,
                                    font: `600 14px/1.2 ${schrift}`,
                                    color: textfarbe,
                                    whiteSpace: "nowrap",
                                    opacity: active ? 1 : 0,
                                    transform: `translateY(${active ? 0 : -6}px)`,
                                    transition: "opacity 0.4s ease, transform 0.5s cubic-bezier(.2,.8,.2,1)",
                                }}
                            >
                                {it.titel}
                            </div>
                        </div>
                    )
                })}
            </div>
            {mounted && overlay ? createPortal(overlay, document.body) : null}
        </div>
    )
}

Bilduniversum.defaultProps = {
    fotos: DEFAULT_FOTOS,
    bildbreite: 196,
    tiefe: 900,
    neigung: 9,
    drift: 3,
    schrift: '"Familjen Grotesk", sans-serif',
    textfarbe: "#F6F1E9",
    unschaerfe: 16,
}

addPropertyControls(Bilduniversum, {
    fotos: {
        type: ControlType.Array,
        title: "Fotos",
        control: {
            type: ControlType.Object,
            controls: {
                bild: { type: ControlType.ResponsiveImage, title: "Bild" },
                titel: { type: ControlType.String, title: "Titel" },
            },
        },
        defaultValue: DEFAULT_FOTOS,
    },
    bildbreite: { type: ControlType.Number, title: "Bildbreite", min: 80, max: 500, step: 5, unit: "px", defaultValue: 196 },
    tiefe: { type: ControlType.Number, title: "Tiefe", min: 0, max: 2000, step: 50, unit: "px", defaultValue: 900 },
    neigung: { type: ControlType.Number, title: "Maus-Neigung", min: 0, max: 25, step: 0.5, unit: "°", defaultValue: 9 },
    drift: { type: ControlType.Number, title: "Schweben", min: 0, max: 10, step: 0.5, unit: "°", defaultValue: 3 },
    schrift: { type: ControlType.String, title: "Schrift", defaultValue: '"Familjen Grotesk", sans-serif' },
    textfarbe: { type: ControlType.Color, title: "Textfarbe", defaultValue: "#F6F1E9" },
    unschaerfe: { type: ControlType.Number, title: "Unschärfe", min: 0, max: 40, step: 1, unit: "px", defaultValue: 16 },
})
