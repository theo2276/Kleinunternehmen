import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { useEffect, useRef, type CSSProperties } from "react"

interface EndlospapierProps {
    breite: number
    papier: string
    streifen: string
    loch: string
    deckkraft: number
    tempo: number
    drift: number
    style?: CSSProperties
}

/**
 * Endlospapier – a narrow strip of continuous tractor-feed paper (holes on the edge,
 * pale green bars) that moves with the page scroll plus a slow drift. Purely decorative.
 * Moves via backgroundPosition only, pauses when reduced motion is requested.
 *
 * @framerIntrinsicWidth 34
 * @framerIntrinsicHeight 800
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function Endlospapier(props: EndlospapierProps) {
    const {
        breite = 34,
        papier = "#F7F5EE",
        streifen = "#DCEBD5",
        loch = "rgba(17,17,17,0.22)",
        deckkraft = 0.9,
        tempo = 0.35,
        drift = 8,
    } = props
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (typeof window === "undefined" || RenderTarget.current() === RenderTarget.canvas) return
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (reduce) return
        let raf = 0
        let start = performance.now()
        let last = -1
        const loop = (now: number) => {
            const y = window.scrollY * tempo + ((now - start) / 1000) * drift
            if (Math.abs(y - last) > 0.2 && ref.current) {
                ref.current.style.backgroundPosition = `0 ${-y}px, 0 ${-y}px, 0 0`
                last = y
            }
            raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(raf)
    }, [tempo, drift])

    const hole = Math.round(breite * 0.26)
    const holeStep = 24
    const bar = 48

    return (
        <div
            aria-hidden="true"
            style={{
                ...props.style,
                position: "relative",
                width: breite,
                height: "100%",
                opacity: deckkraft,
                pointerEvents: "none",
                overflow: "hidden",
                borderLeft: "1px dashed rgba(17,17,17,0.18)",
                boxShadow: "-6px 0 18px -10px rgba(17,17,17,0.25)",
            }}
        >
            <div
                ref={ref}
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: [
                        // tractor-feed holes in the middle of the strip
                        `radial-gradient(circle at 50% ${holeStep / 2}px, ${loch} ${hole / 2}px, transparent ${hole / 2 + 0.6}px)`,
                        // pale green bars of classic continuous paper
                        `repeating-linear-gradient(180deg, ${streifen} 0px, ${streifen} ${bar / 2}px, transparent ${bar / 2}px, transparent ${bar}px)`,
                        `linear-gradient(${papier}, ${papier})`,
                    ].join(", "),
                    backgroundSize: `100% ${holeStep}px, 100% ${bar}px, 100% 100%`,
                    backgroundRepeat: "repeat-y, repeat-y, no-repeat",
                }}
            />
        </div>
    )
}

addPropertyControls(Endlospapier, {
    breite: { type: ControlType.Number, title: "Breite", min: 16, max: 80, step: 1, defaultValue: 34, unit: "px" },
    papier: { type: ControlType.Color, title: "Papier", defaultValue: "#F7F5EE" },
    streifen: { type: ControlType.Color, title: "Streifen", defaultValue: "#DCEBD5" },
    loch: { type: ControlType.Color, title: "Löcher", defaultValue: "rgba(17,17,17,0.22)" },
    deckkraft: { type: ControlType.Number, title: "Deckkraft", min: 0, max: 1, step: 0.05, defaultValue: 0.9 },
    tempo: { type: ControlType.Number, title: "Scroll-Tempo", min: 0, max: 1.5, step: 0.05, defaultValue: 0.35 },
    drift: { type: ControlType.Number, title: "Eigendrift", min: 0, max: 40, step: 1, defaultValue: 8, unit: "px/s" },
})
