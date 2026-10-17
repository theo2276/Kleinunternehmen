import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * GutscheinKauf – amount picker + buy button inside a voucher ticket.
 * Each amount has its own Stripe Payment Link. Amounts without a link fall back
 * to the "ersatzLink" (e.g. /kontakt), so the page never shows a dead button.
 *
 * @framerSupportedLayoutWidth fill
 * @framerSupportedLayoutHeight auto
 */

type Stufe = { betrag: number; link: string }

const euro = (n: number) => `${String(n).replace(".", ",")} €`

export default function GutscheinKauf(props: any) {
    const { stufen, start, ersatzLink, ersatzText, schrift, farbe, knopfFarbe, knopfText, style } = props
    const liste: Stufe[] = (Array.isArray(stufen) ? stufen : []).filter((s: any) => s && Number(s.betrag) > 0)
    const startIndex = Math.max(0, liste.findIndex((s) => Number(s.betrag) === Number(start)))
    const [wahl, setWahl] = React.useState(startIndex)
    const aktiv = liste[Math.min(wahl, liste.length - 1)]
    const link = aktiv && String(aktiv.link || "").trim()
    const kaufbar = !!link && /^https:\/\//.test(link)
    // narrow tickets (tablet) get a shorter button label
    const box = React.useRef<HTMLDivElement>(null)
    const [schmal, setSchmal] = React.useState(false)
    React.useEffect(() => {
        const el = box.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver(() => setSchmal(el.offsetWidth < 240))
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    return (
        <div ref={box} style={{ ...style, width: "100%", display: "flex", flexDirection: "column", gap: 14, fontFamily: schrift, color: farbe }}>
            <div role="radiogroup" aria-label="Betrag wählen" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {liste.map((s, i) => {
                    const an = i === wahl
                    return (
                        <button
                            key={i}
                            type="button"
                            role="radio"
                            aria-checked={an}
                            onClick={() => setWahl(i)}
                            style={{
                                fontFamily: schrift, fontSize: schmal ? 13 : 14, fontWeight: 700, lineHeight: 1,
                                padding: schmal ? "8px 10px" : "9px 12px", whiteSpace: "nowrap", borderRadius: 100, cursor: "pointer",
                                border: `1.5px solid ${an ? knopfFarbe : "rgba(14,13,12,0.28)"}`,
                                background: an ? knopfFarbe : "transparent",
                                color: an ? knopfText : farbe,
                                transition: "background .2s, color .2s, border-color .2s",
                            }}
                        >
                            {euro(Number(s.betrag))}
                        </button>
                    )
                })}
            </div>
            {aktiv && (
                <a
                    href={kaufbar ? link : ersatzLink}
                    {...(kaufbar ? { rel: "noopener" } : {})}
                    style={{
                        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                        alignSelf: "flex-start", textDecoration: "none",
                        fontFamily: schrift, fontSize: schmal ? 14 : 15, fontWeight: 700, lineHeight: 1,
                        padding: schmal ? "14px 18px" : "15px 22px", borderRadius: 100, whiteSpace: "nowrap",
                        background: knopfFarbe, color: knopfText,
                    }}
                >
                    {kaufbar ? `${schmal ? "Kaufen" : "Gutschein kaufen"} · ${euro(Number(aktiv.betrag))}` : schmal ? "Anfragen" : ersatzText} →
                </a>
            )}
        </div>
    )
}

GutscheinKauf.defaultProps = {
    stufen: [
        { betrag: 30, link: "" }, { betrag: 40, link: "" }, { betrag: 50, link: "" }, { betrag: 60, link: "" },
    ],
    start: 0,
    ersatzLink: "/kontakt",
    ersatzText: "Gutschein anfragen",
    schrift: '"Familjen Grotesk", sans-serif',
    farbe: "#0E0D0C",
    knopfFarbe: "#0E0D0C",
    knopfText: "#F6F1E9",
}

addPropertyControls(GutscheinKauf, {
    stufen: {
        type: ControlType.Array,
        title: "Beträge",
        control: {
            type: ControlType.Object,
            controls: {
                betrag: { type: ControlType.Number, title: "Betrag €", min: 1, max: 5000, step: 5, defaultValue: 50 },
                link: { type: ControlType.String, title: "Stripe-Link", defaultValue: "", placeholder: "https://buy.stripe.com/…" },
            },
        },
        defaultValue: [{ betrag: 30, link: "" }, { betrag: 40, link: "" }, { betrag: 50, link: "" }, { betrag: 60, link: "" }],
    },
    start: { type: ControlType.Number, title: "Vorausgewählt €", min: 0, max: 5000, step: 5, defaultValue: 0 },
    ersatzLink: { type: ControlType.String, title: "Ohne Stripe-Link", defaultValue: "/kontakt" },
    ersatzText: { type: ControlType.String, title: "Text ohne Link", defaultValue: "Gutschein anfragen" },
    schrift: { type: ControlType.String, title: "Schrift", defaultValue: '"Familjen Grotesk", sans-serif' },
    farbe: { type: ControlType.Color, title: "Text", defaultValue: "#0E0D0C" },
    knopfFarbe: { type: ControlType.Color, title: "Knopf", defaultValue: "#0E0D0C" },
    knopfText: { type: ControlType.Color, title: "Knopftext", defaultValue: "#F6F1E9" },
})
