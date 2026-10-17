---
name: framer-kernel-token-system
description: "Kernel-Template: dunkle Design-Tokens, Komponenten, Seiten und Audit-Stand (Notiz auf Englisch, technische Details)"
metadata:
  type: project
---

Token system for the Kernel template (see [[framer-template-business]]). Framer project id `QrBPDSeVu9HnFsRSfcJR`.

Surfaces (cool near-black, not pure black): `bg/base #08090C`, `bg/subtle #0D0F14`, `bg/raised #13161D`, `bg/overlay #191D26`, `bg/inset #050609`.
Text: `text/primary #F2F4F8`, `text/secondary #A2A9B8`, `text/muted #6B7282` (AA-borderline, labels only), `text/inverse #08090C`.
Borders as white alphas: 0.06 / 0.10 / 0.18.
Accent Signal-Cyan: `accent/base #3DD8E8`, `accent/hover #5FE3F0`, `accent/subtle rgba(61,216,232,0.12)`, `accent/border rgba(61,216,232,0.32)`, `accent/on #05161A`. Cyan is luminous enough on the dark ground to double as a text color, so no separate accent/text token.

Dark-first rules that drove the structure: box-shadows do not create depth on dark, so elevation comes from a lighter surface plus a border edge; pure white blooms, so headings use off-white at weight 500 rather than 600/700; colors read more saturated on dark.

Type pairing: Geist (display) + Inter (body) + Geist Mono (badges/stats).

Built in the project as of 2026-09-18: 17 color styles (light and dark slots both hold the dark value, so it always renders dark — adding a light theme later means editing only the `light` slot), 11 text style presets with Desktop/Tablet/Phone breakpoint slots, and the Home page set to the dark base with all three breakpoints.

Framer has no global spacing or radius token type — those scales stay conventions applied per node, and the motion tokens live as shared constants in the code components rather than as project styles.

Components built: Button (Primary/Secondary/Ghost, each with hover + pressed gesture variants, Title and Link as variables), Badge (Default/Accent), Card (Default/Highlighted + hover), Nav (Desktop/Phone/Phone Open with a clipped drawer). Pages: /, /product, /pricing, /docs, /blog, /about, /contact. Home has a sticky Nav instance and the hero section.

Home page sections, all three breakpoints: sticky Nav, Hero, Integrations logo ticker (native tickerEffect), Features (3/2/1-column grid of Card instances), Stats band, CTA, Footer. Pages also include /privacy and /terms. Scroll reveals use native appearEffect with spring-physics 180 26 1 0s and 0.06s stagger.

Demo content deliberately frames the brand logo row as integrations, not "trusted by" — presenting real company marks as customers of a fictional brand in a template sold to third parties is a trademark and review risk.

Nav and Footer live in a "Main" layout template applied to all 9 pages (not duplicated per page). A "Nav Link" LinkStylePreset gives hover and current states, so the active page highlights in cyan automatically. Pricing page is built with a "Pricing Tier" component (Default/Featured, Name/Description/Price/Period/CTA Label/Link and Feature 1-5 as controls).

Blog: "Posts" collection (Title, auto Slug, Excerpt, Cover, Date, Author, Category option, Content richtext) with 4 written posts; /blog index is a Collection List sorted by date desc (3/2/1 columns), /blog/:Posts is the detail page with per-tag rich text presets and previous/next item links. Cover imagery is deliberately teal so it sits inside the cyan palette.

All 11 pages now have content and Desktop/Tablet/Phone breakpoints: Home, Product (code panels in Geist Mono), Pricing, Docs, Blog + post detail, About (team shown as initial circles, not stock portraits — same reasoning as the logo row), Contact (working form with a dedicated Submit Button component, plus mailto: and tel: links), Privacy, Terms, 404. Components: Button, Submit Button, Badge, Card, Pricing Tier, Nav.

Audited against the Framer template requirements on 2026-09-18: every page has title + description, one H1 and an unbroken heading ladder, no hardcoded colors (glow moved to an "Accent/Glow" token), alt text on all images, named layers, no horizontal overflow, complete CMS items, and reducedMotion enabled on the site root.

Animated Counter (AnimatedCounter.tsx) is the template's only code component — everything else is native Framer. It counts up on first scroll into view, honours prefers-reduced-motion, and renders the final value on the canvas. All four stats use it; font must be passed as a complete object per breakpoint (`GF;Geist-medium`, 48/40/34px) because partial font objects are rejected.
