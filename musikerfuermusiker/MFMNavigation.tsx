import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import type { CSSProperties } from "react"

interface Props {
    brand: string
    homeLink: string
    areasLabel: string
    areasLink: string
    boardLabel: string
    boardLink: string
    aboutLabel: string
    aboutLink: string
    contactLabel: string
    contactLink: string
    ctaLabel: string
    ctaLink: string
    background: string
    foreground: string
    accent: string
    border: string
    style?: CSSProperties
}

/**
 * Responsive Hauptnavigation für MusikerFürMusiker.
 * Bewusst neutral gehalten: Claude kann die visuelle Sprache später vollständig ersetzen.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight fixed
 */
export default function MFMNavigation(props: Props) {
    const {
        brand,
        homeLink,
        areasLabel,
        areasLink,
        boardLabel,
        boardLink,
        aboutLabel,
        aboutLink,
        contactLabel,
        contactLink,
        ctaLabel,
        ctaLink,
        background,
        foreground,
        accent,
        border,
        style,
    } = props

    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        setOpen(false)
    }, [homeLink, areasLink, boardLink, aboutLink, contactLink, ctaLink])

    const navItems = [
        [areasLabel, areasLink],
        [boardLabel, boardLink],
        [aboutLabel, aboutLink],
        [contactLabel, contactLink],
    ]

    const linkStyle: CSSProperties = {
        color: foreground,
        textDecoration: "none",
        font: "inherit",
        lineHeight: 1.2,
    }

    return (
        <nav
            aria-label="Hauptnavigation"
            style={{
                ...style,
                width: "100%",
                minHeight: 72,
                boxSizing: "border-box",
                background,
                color: foreground,
                borderBottom: `1px solid ${border}`,
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            }}
        >
            <style>{`
                .mfm-nav-inner {
                    width: 100%;
                    min-height: 72px;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    padding: 14px clamp(18px, 4vw, 48px);
                }
                .mfm-nav-links {
                    margin-left: auto;
                    display: flex;
                    align-items: center;
                    gap: clamp(16px, 2.2vw, 30px);
                }
                .mfm-nav-menu-button { display: none; }
                .mfm-nav-mobile { display: none; }
                @media (max-width: 760px) {
                    .mfm-nav-links { display: none; }
                    .mfm-nav-menu-button {
                        display: inline-flex;
                        margin-left: auto;
                        align-items: center;
                        justify-content: center;
                    }
                    .mfm-nav-mobile {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;
                        padding: 0 18px 18px;
                    }
                    .mfm-nav-mobile[hidden] { display: none; }
                }
            `}</style>

            <div className="mfm-nav-inner">
                <a href={homeLink} style={{ ...linkStyle, fontWeight: 700 }}>
                    {brand}
                </a>

                <div className="mfm-nav-links">
                    {navItems.map(([label, href]) => (
                        <a key={label} href={href} style={linkStyle}>
                            {label}
                        </a>
                    ))}
                    <a
                        href={ctaLink}
                        style={{
                            ...linkStyle,
                            padding: "10px 14px",
                            border: `1px solid ${accent}`,
                            borderRadius: 8,
                        }}
                    >
                        {ctaLabel}
                    </a>
                </div>

                <button
                    className="mfm-nav-menu-button"
                    type="button"
                    aria-expanded={open}
                    aria-controls="mfm-mobile-menu"
                    aria-label={open ? "Menü schließen" : "Menü öffnen"}
                    onClick={() => setOpen((value) => !value)}
                    style={{
                        width: 44,
                        height: 44,
                        padding: 0,
                        borderRadius: 8,
                        border: `1px solid ${border}`,
                        background: "transparent",
                        color: foreground,
                        cursor: "pointer",
                        font: "inherit",
                    }}
                >
                    {open ? "×" : "☰"}
                </button>
            </div>

            <div id="mfm-mobile-menu" className="mfm-nav-mobile" hidden={!open}>
                {navItems.map(([label, href]) => (
                    <a
                        key={label}
                        href={href}
                        style={{
                            ...linkStyle,
                            padding: "12px 0",
                            borderBottom: `1px solid ${border}`,
                        }}
                    >
                        {label}
                    </a>
                ))}
                <a
                    href={ctaLink}
                    style={{
                        ...linkStyle,
                        marginTop: 8,
                        padding: "12px 14px",
                        border: `1px solid ${accent}`,
                        borderRadius: 8,
                    }}
                >
                    {ctaLabel}
                </a>
            </div>
        </nav>
    )
}

MFMNavigation.defaultProps = {
    brand: "MusikerFürMusiker",
    homeLink: "/",
    areasLabel: "Vermittlung",
    areasLink: "/vermittlung",
    boardLabel: "Schwarzes Brett",
    boardLink: "/schwarzes-brett",
    aboutLabel: "Über uns",
    aboutLink: "/ueber-uns",
    contactLabel: "Kontakt",
    contactLink: "/kontakt",
    ctaLabel: "Anfrage stellen",
    ctaLink: "/anfrage",
    background: "#FFFFFF",
    foreground: "#111111",
    accent: "#111111",
    border: "#E5E5E5",
}

addPropertyControls(MFMNavigation, {
    brand: { type: ControlType.String, title: "Name" },
    homeLink: { type: ControlType.Link, title: "Start" },
    areasLabel: { type: ControlType.String, title: "Nav 1" },
    areasLink: { type: ControlType.Link, title: "Link 1" },
    boardLabel: { type: ControlType.String, title: "Nav 2" },
    boardLink: { type: ControlType.Link, title: "Link 2" },
    aboutLabel: { type: ControlType.String, title: "Nav 3" },
    aboutLink: { type: ControlType.Link, title: "Link 3" },
    contactLabel: { type: ControlType.String, title: "Nav 4" },
    contactLink: { type: ControlType.Link, title: "Link 4" },
    ctaLabel: { type: ControlType.String, title: "CTA" },
    ctaLink: { type: ControlType.Link, title: "CTA Link" },
    background: { type: ControlType.Color, title: "Hintergrund" },
    foreground: { type: ControlType.Color, title: "Text" },
    accent: { type: ControlType.Color, title: "Akzent" },
    border: { type: ControlType.Color, title: "Linie" },
})
