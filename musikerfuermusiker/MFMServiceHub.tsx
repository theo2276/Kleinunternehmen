import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import type { CSSProperties } from "react"

interface Props {
    eyebrow: string
    title: string
    intro: string

    roomTitle: string
    roomText: string
    roomLink: string

    musicianTitle: string
    musicianText: string
    musicianLink: string

    gigTitle: string
    gigText: string
    gigLink: string

    boardTitle: string
    boardText: string
    boardLink: string

    background: string
    cardBackground: string
    text: string
    muted: string
    line: string
    style?: CSSProperties
}

/**
 * Projektbezogene Einstiege in die Kernfunktionen von MusikerFürMusiker.
 * Kein universelles Card-Template: Inhalte und Defaults sind auf dieses Projekt zugeschnitten.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function MFMServiceHub(props: Props) {
    const {
        eyebrow,
        title,
        intro,
        roomTitle,
        roomText,
        roomLink,
        musicianTitle,
        musicianText,
        musicianLink,
        gigTitle,
        gigText,
        gigLink,
        boardTitle,
        boardText,
        boardLink,
        background,
        cardBackground,
        text,
        muted,
        line,
        style,
    } = props

    const services = [
        { title: roomTitle, text: roomText, link: roomLink },
        { title: musicianTitle, text: musicianText, link: musicianLink },
        { title: gigTitle, text: gigText, link: gigLink },
        { title: boardTitle, text: boardText, link: boardLink },
    ]

    return (
        <section
            aria-labelledby="mfm-service-title"
            style={{
                ...style,
                width: "100%",
                boxSizing: "border-box",
                background,
                color: text,
                padding: "clamp(40px, 7vw, 96px) clamp(18px, 4vw, 48px)",
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            }}
        >
            <div style={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
                <header style={{ maxWidth: 760, marginBottom: "clamp(28px, 5vw, 56px)" }}>
                    {eyebrow && (
                        <p
                            style={{
                                margin: "0 0 10px",
                                color: muted,
                                fontSize: 13,
                                lineHeight: 1.4,
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                            }}
                        >
                            {eyebrow}
                        </p>
                    )}
                    <h2
                        id="mfm-service-title"
                        style={{
                            margin: 0,
                            fontSize: "clamp(32px, 5vw, 64px)",
                            lineHeight: 1,
                            letterSpacing: "-0.035em",
                            fontWeight: 700,
                        }}
                    >
                        {title}
                    </h2>
                    {intro && (
                        <p
                            style={{
                                margin: "18px 0 0",
                                color: muted,
                                fontSize: "clamp(16px, 2vw, 20px)",
                                lineHeight: 1.55,
                            }}
                        >
                            {intro}
                        </p>
                    )}
                </header>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
                        gap: 14,
                    }}
                >
                    {services.map((service, index) => (
                        <a
                            key={service.title}
                            href={service.link}
                            style={{
                                minHeight: 220,
                                boxSizing: "border-box",
                                padding: "clamp(22px, 3vw, 32px)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                gap: 28,
                                background: cardBackground,
                                color: text,
                                border: `1px solid ${line}`,
                                borderRadius: 12,
                                textDecoration: "none",
                            }}
                        >
                            <span
                                aria-hidden="true"
                                style={{
                                    color: muted,
                                    fontSize: 13,
                                    lineHeight: 1,
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <div>
                                <h3
                                    style={{
                                        margin: 0,
                                        fontSize: "clamp(22px, 2.5vw, 30px)",
                                        lineHeight: 1.08,
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    {service.title}
                                </h3>
                                <p
                                    style={{
                                        margin: "12px 0 0",
                                        color: muted,
                                        fontSize: 16,
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {service.text}
                                </p>
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 700 }}>Öffnen →</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}

MFMServiceHub.defaultProps = {
    eyebrow: "Vermittlung & Austausch",
    title: "Was suchst du?",
    intro: "Die technische Basis führt direkt zu den Kernbereichen. Darstellung, Tonalität und visuelle Hierarchie können später frei verändert werden.",

    roomTitle: "Proberäume & Unterrichtsräume",
    roomText: "Räume suchen, freie Kapazitäten anbieten oder passende Kontakte herstellen.",
    roomLink: "/vermittlung/raeume",

    musicianTitle: "Musiker vernetzen",
    musicianText: "Musiker, Bands und Projekte in der Region zusammenbringen.",
    musicianLink: "/vermittlung/musiker",

    gigTitle: "Auftritte",
    gigText: "Auftrittsmöglichkeiten finden oder eine passende Anfrage stellen.",
    gigLink: "/vermittlung/auftritte",

    boardTitle: "Schwarzes Brett",
    boardText: "Weitere Gesuche, Angebote und Austausch aus der Musikszene.",
    boardLink: "/schwarzes-brett",

    background: "#FFFFFF",
    cardBackground: "#FAFAFA",
    text: "#111111",
    muted: "#666666",
    line: "#E4E4E4",
}

addPropertyControls(MFMServiceHub, {
    eyebrow: { type: ControlType.String, title: "Kicker" },
    title: { type: ControlType.String, title: "Titel" },
    intro: { type: ControlType.String, title: "Einleitung", displayTextArea: true },

    roomTitle: { type: ControlType.String, title: "Räume" },
    roomText: { type: ControlType.String, title: "Räume Text", displayTextArea: true },
    roomLink: { type: ControlType.Link, title: "Räume Link" },

    musicianTitle: { type: ControlType.String, title: "Musiker" },
    musicianText: { type: ControlType.String, title: "Musiker Text", displayTextArea: true },
    musicianLink: { type: ControlType.Link, title: "Musiker Link" },

    gigTitle: { type: ControlType.String, title: "Auftritte" },
    gigText: { type: ControlType.String, title: "Auftritte Text", displayTextArea: true },
    gigLink: { type: ControlType.Link, title: "Auftritte Link" },

    boardTitle: { type: ControlType.String, title: "Brett" },
    boardText: { type: ControlType.String, title: "Brett Text", displayTextArea: true },
    boardLink: { type: ControlType.Link, title: "Brett Link" },

    background: { type: ControlType.Color, title: "Hintergrund" },
    cardBackground: { type: ControlType.Color, title: "Karten" },
    text: { type: ControlType.Color, title: "Text" },
    muted: { type: ControlType.Color, title: "Sekundär" },
    line: { type: ControlType.Color, title: "Linie" },
})
