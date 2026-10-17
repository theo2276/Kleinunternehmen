# MusikerFürMusiker – Übergabe für spätere Mitarbeit

Stand: 17.10.2026. Die Gestaltung ist jetzt bereits direkt im [unveröffentlichten Framer-Projekt](https://framer.com/projects/MusikerF-rMusiker--Oqs6vlqumpMTjpEtJI2w-9UllU) umgesetzt. Der Nutzer wollte ausdrücklich eine farbige Grundgestaltung und alle wichtigen Seiten, nicht nur technische TSX-Dateien.

## Canvas-Stand

14 Seiten: `/`, `/vermittlung`, `/raeume`, `/menschen`, `/auftritte`, `/schwarzes-brett`, `/ueber-uns`, `/hintergrund`, `/unterstuetzen`, `/kontakt`, `/anfrage`, `/bedingungen`, `/impressum`, `/datenschutz`.

Alle Seiten haben Desktop (1200 px), Tablet (810 px) und Phone (390 px), eine gemeinsame native Navigation und einen gemeinsamen Footer. Die Inhalte bestehen aus Framer-Frames, Stacks und editierbaren Texten. Die Hauptwege sind in der Vorschau getestet: Start → Vermittlung → Räume → Anfrage. Der Formulartest mit ausgefüllten Feldern endet ohne Endpunkt bewusst ohne Datenübertragung. Framer meldete bei der Veröffentlichungsprüfung keine Fehler oder Warnungen; **kein Publish** wurde ausgeführt.

## Aktuelle gestalterische Richtung

Eine plakative, typografische MFM-Sprache: orange Fläche, dunkle Tinte, heller Papiergrund, nummerierte Vermittlungswege und ein natives MFM-Plakatmotiv im Hero. Das Orange ist am alten MFM-Zeichen in `kreuzberg-on-kultour/bilder-alt/über-uns__musiker-für-musiker/` orientiert. Farbstyles: Orange `#E98A00`, Tinte `#211B19`, Papier `#FFF8ED`, Sand `#F3E6D2`, Sekundärtext `#5E5148`. Schrift: Archivo. Awwwards wurde als Inspiration für kräftige Musik-Typografie und Plakatlogik recherchiert; es wurden keine fremden Assets oder Layouts übernommen.

Die Richtung kann weiterentwickelt werden. Der Nutzer hat die aktuelle Fassung noch nicht abgenommen. Änderungen bitte direkt im bestehenden Framer-Projekt vornehmen und vor allem Startseite, Navigation und Breakpoints zusammen prüfen.

## Funktion und Grenzen

- `MFMInquiryForm.tsx` ist die einzige Code-Komponente im Canvas. Ihr POST-Endpunkt ist leer; kein Versand ohne bewusst gesetzten Empfänger.
- `MFMNavigation.tsx` und `MFMServiceHub.tsx` sind frühe Referenzen. Die sichtbare Navigation und Vermittlungsbereiche sind native Framer-Elemente.
- Das Schwarze Brett zeigt derzeit Rubriken, aber keine öffentlichen Einträge. Einreichung, Speicherung und Moderation fehlen.
- Impressum, Datenschutz und Bedingungen sind als redaktionelle Entwürfe gekennzeichnet. Keine veralteten Rechtstexte der alten Jimdo-Seite übernehmen.
- Alle Seiten sind `noIndex` und unveröffentlicht. Keine bestehende Live-Seite ändern.

## Vor dem Livegang klären

Finale Logo-Datei, Freigabe der Inhalte und Bildrechte; verantwortliche Person/Organisation und Rechtstexte; Formular-Empfänger, Spam-Schutz, Aufbewahrung und Löschung; Moderationsprozess und technische Datenquelle für das Schwarze Brett. Erst danach veröffentlichen.
