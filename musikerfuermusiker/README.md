# MusikerFürMusiker – Framer-Neubau

Stand: 17.10.2026. Die Website wird direkt im [eigenständigen Framer-Projekt](https://framer.com/projects/MusikerF-rMusiker--Oqs6vlqumpMTjpEtJI2w-9UllU) gestaltet. Das Projekt ist **nicht veröffentlicht**; keine bestehende Live-Website wurde geändert.

## Im Framer-Canvas umgesetzt

- Startseite mit orangefarbenem MFM-Plakatmotiv, Vermittlungsbereichen, Schwarzem Brett, Projektvorstellung und Anfrageformular
- 13 weitere Seiten: Vermittlung, Räume, Musiker & Unterricht, Auftritte, Schwarzes Brett, Über uns, Hintergrund, Unterstützen, Kontakt, Anfrage, Bedingungen, Impressum und Datenschutz
- Ein gemeinsamer nativer Framer-Rahmen mit Navigation und Footer
- Desktop-, Tablet- und Handy-Breakpoints für alle 14 Seiten
- Farbstyles für MFM-Orange, Tinte, Papier, Sand und Sekundärtext; Typografie mit Archivo
- Interne Links zu realen Framer-Seiten; `noIndex` für alle Seiten
- Abgleich mit der [bisherigen Website](https://musikerfuermusiker.jimdoweb.com/): Tontechnik/Studio und Plakate/PR sind im Vermittlungsüberblick ergänzt; das Schwarze Brett hat wieder fünf getrennte Rubriken; das Anfrageformular bietet die zugehörigen Auswahlmöglichkeiten

Nur das Anfrageformular ist eine Code-Komponente. Ohne konfigurierten POST-Endpunkt verschickt es keine Daten. Impressum, Datenschutz und Bedingungen sind redaktionelle Entwürfe; für das Schwarze Brett existieren noch keine öffentlichen Einträge oder ein Moderationssystem.

Die Navigation und Vermittlungswege wurden in der Framer-Vorschau bis zur Anfrage getestet, auch bei 390 px. Ein ausgefülltes Testformular zeigte korrekt: „Noch kein Formular-Endpunkt verbunden. Es wurden keine Daten übertragen.“ Die Framer-Veröffentlichungsprüfung meldete keine technischen Fehler oder Warnungen; es wurde nicht veröffentlicht.

## Dateien in diesem Ordner

- `briefing.md` – Projektziele, Inhalte und offene Entscheidungen
- `CLAUDE_HANDOFF.md` – konkreter Canvas-Stand für spätere Mitarbeit
- `MFMInquiryForm.tsx` – Quelle der im Canvas eingebundenen Formular-Komponente
- `MFMNavigation.tsx` und `MFMServiceHub.tsx` – frühe technische Referenzen; Navigation und Bereiche sind inzwischen nativ im Canvas gebaut

## Vor einem Livegang

Logo/Originaldatei und Inhalte freigeben; Verantwortliche und Rechtstexte prüfen; Formular-Empfänger, Aufbewahrung und Moderation festlegen; Schwarzes Brett technisch und redaktionell definieren. Git `main` bleibt unangetastet.
