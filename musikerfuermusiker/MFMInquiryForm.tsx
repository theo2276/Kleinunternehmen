import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import type { CSSProperties, FormEvent } from "react"

type SubmitState = "idle" | "sending" | "success" | "error" | "missing"

interface Props {
    title: string
    intro: string
    endpoint: string
    buttonText: string
    successText: string
    privacyLabel: string
    privacyLink: string
    background: string
    fieldBackground: string
    text: string
    muted: string
    line: string
    accent: string
    style?: CSSProperties
}

/**
 * Zentrales Anfrageformular für MusikerFürMusiker.
 *
 * Ohne konfigurierten Endpunkt werden bewusst keine Daten übertragen.
 * Ein gültiger Endpunkt muss relativ ("/...") oder HTTPS sein.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function MFMInquiryForm(props: Props) {
    const {
        title,
        intro,
        endpoint,
        buttonText,
        successText,
        privacyLabel,
        privacyLink,
        background,
        fieldBackground,
        text,
        muted,
        line,
        accent,
        style,
    } = props

    const [state, setState] = React.useState<SubmitState>("idle")
    const [message, setMessage] = React.useState("")

    const safeEndpoint = endpoint.trim()
    const endpointAllowed =
        (safeEndpoint.startsWith("/") && !safeEndpoint.startsWith("//")) ||
        /^https:\/\//i.test(safeEndpoint)

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const form = event.currentTarget
        if (!form.reportValidity()) return

        if (!safeEndpoint || !endpointAllowed) {
            setState("missing")
            setMessage(
                safeEndpoint
                    ? "Der konfigurierte Formular-Endpunkt ist nicht erlaubt."
                    : "Noch kein Formular-Endpunkt verbunden. Es wurden keine Daten übertragen."
            )
            return
        }

        const data = new FormData(form)

        // Einfaches Honeypot-Feld: Bots füllen versteckte Felder häufig aus.
        if (String(data.get("website") || "").trim()) return

        try {
            setState("sending")
            setMessage("")

            const response = await fetch(safeEndpoint, {
                method: "POST",
                body: data,
                headers: { Accept: "application/json" },
            })

            if (!response.ok) throw new Error(`HTTP ${response.status}`)

            form.reset()
            setState("success")
            setMessage(successText)
        } catch {
            setState("error")
            setMessage(
                "Die Anfrage konnte nicht gesendet werden. Bitte versuche es später erneut."
            )
        }
    }

    const fieldStyle: CSSProperties = {
        width: "100%",
        minHeight: 48,
        boxSizing: "border-box",
        padding: "12px 14px",
        border: `1px solid ${line}`,
        borderRadius: 8,
        background: fieldBackground,
        color: text,
        font: "inherit",
        outline: "none",
    }

    const labelStyle: CSSProperties = {
        display: "grid",
        gap: 8,
        color: text,
        fontSize: 14,
        fontWeight: 650,
        lineHeight: 1.35,
    }

    return (
        <section
            aria-labelledby="mfm-inquiry-title"
            style={{
                ...style,
                width: "100%",
                boxSizing: "border-box",
                padding: "clamp(36px, 6vw, 80px) clamp(18px, 4vw, 48px)",
                background,
                color: text,
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 820,
                    margin: "0 auto",
                }}
            >
                <header style={{ marginBottom: 30 }}>
                    <h2
                        id="mfm-inquiry-title"
                        style={{
                            margin: 0,
                            fontSize: "clamp(30px, 4.5vw, 56px)",
                            lineHeight: 1.05,
                            letterSpacing: "-0.035em",
                        }}
                    >
                        {title}
                    </h2>
                    {intro && (
                        <p
                            style={{
                                margin: "14px 0 0",
                                maxWidth: 680,
                                color: muted,
                                fontSize: 17,
                                lineHeight: 1.55,
                            }}
                        >
                            {intro}
                        </p>
                    )}
                </header>

                <form onSubmit={submit} style={{ display: "grid", gap: 18 }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
                            gap: 16,
                        }}
                    >
                        <label style={labelStyle}>
                            Name
                            <input
                                name="name"
                                autoComplete="name"
                                required
                                style={fieldStyle}
                            />
                        </label>

                        <label style={labelStyle}>
                            E-Mail
                            <input
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                style={fieldStyle}
                            />
                        </label>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
                            gap: 16,
                        }}
                    >
                        <label style={labelStyle}>
                            Worum geht es?
                            <select name="category" required defaultValue="" style={fieldStyle}>
                                <option value="" disabled>
                                    Bitte auswählen
                                </option>
                                <option value="proberaum-suchen">Proberaum suchen</option>
                                <option value="raum-anbieten">Proberaum / Unterrichtsraum anbieten</option>
                                <option value="musiker">Musiker / Band / Projekt</option>
                                <option value="auftritt">Auftritt</option>
                                <option value="schwarzes-brett">Schwarzes Brett / Sonstiges</option>
                            </select>
                        </label>

                        <label style={labelStyle}>
                            Ort / Region
                            <input
                                name="region"
                                autoComplete="address-level2"
                                required
                                style={fieldStyle}
                            />
                        </label>
                    </div>

                    <label style={labelStyle}>
                        Nachricht
                        <textarea
                            name="message"
                            required
                            rows={7}
                            style={{
                                ...fieldStyle,
                                minHeight: 160,
                                resize: "vertical",
                                lineHeight: 1.5,
                            }}
                        />
                    </label>

                    <div
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            width: 1,
                            height: 1,
                            overflow: "hidden",
                            clipPath: "inset(50%)",
                        }}
                    >
                        <label>
                            Website
                            <input
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
                            />
                        </label>
                    </div>

                    <label
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            color: muted,
                            fontSize: 14,
                            lineHeight: 1.45,
                        }}
                    >
                        <input
                            type="checkbox"
                            name="privacy"
                            required
                            style={{ marginTop: 3 }}
                        />
                        <span>
                            {privacyLabel}{" "}
                            {privacyLink && (
                                <a href={privacyLink} style={{ color: "inherit" }}>
                                    Datenschutzerklärung
                                </a>
                            )}
                        </span>
                    </label>

                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: 14,
                        }}
                    >
                        <button
                            type="submit"
                            disabled={state === "sending"}
                            style={{
                                minHeight: 48,
                                padding: "12px 18px",
                                borderRadius: 8,
                                border: `1px solid ${accent}`,
                                background: accent,
                                color: background,
                                font: "inherit",
                                fontWeight: 700,
                                cursor: state === "sending" ? "wait" : "pointer",
                                opacity: state === "sending" ? 0.65 : 1,
                            }}
                        >
                            {state === "sending" ? "Wird gesendet …" : buttonText}
                        </button>

                        {message && (
                            <p
                                role={state === "error" || state === "missing" ? "alert" : "status"}
                                style={{
                                    margin: 0,
                                    color: state === "error" ? "#8A1C1C" : muted,
                                    fontSize: 14,
                                    lineHeight: 1.45,
                                }}
                            >
                                {message}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </section>
    )
}

MFMInquiryForm.defaultProps = {
    title: "Anfrage stellen",
    intro: "Beschreibe kurz, was du suchst oder anbieten möchtest. Wir prüfen, an wen deine Anfrage am besten weitergeleitet werden kann.",
    endpoint: "",
    buttonText: "Anfrage senden",
    successText: "Danke. Deine Anfrage wurde übermittelt.",
    privacyLabel: "Ich stimme der Verarbeitung meiner Angaben für diese Anfrage zu.",
    privacyLink: "/datenschutz",
    background: "#FFFFFF",
    fieldBackground: "#FFFFFF",
    text: "#111111",
    muted: "#666666",
    line: "#DADADA",
    accent: "#111111",
}

addPropertyControls(MFMInquiryForm, {
    title: { type: ControlType.String, title: "Titel" },
    intro: { type: ControlType.String, title: "Einleitung", displayTextArea: true },
    endpoint: { type: ControlType.String, title: "POST Endpoint" },
    buttonText: { type: ControlType.String, title: "Button" },
    successText: { type: ControlType.String, title: "Erfolg", displayTextArea: true },
    privacyLabel: { type: ControlType.String, title: "Datenschutz", displayTextArea: true },
    privacyLink: { type: ControlType.Link, title: "DS Link" },
    background: { type: ControlType.Color, title: "Hintergrund" },
    fieldBackground: { type: ControlType.Color, title: "Felder" },
    text: { type: ControlType.Color, title: "Text" },
    muted: { type: ControlType.Color, title: "Sekundär" },
    line: { type: ControlType.Color, title: "Linie" },
    accent: { type: ControlType.Color, title: "Akzent" },
})
