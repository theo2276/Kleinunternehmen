# MusikerFürMusiker – Übergabe für spätere Mitarbeit

Stand: 17.10.2026. Die Gestaltung ist jetzt bereits direkt im [unveröffentlichten Framer-Projekt](https://framer.com/projects/MusikerF-rMusiker--Oqs6vlqumpMTjpEtJI2w-9UllU) umgesetzt. Der Nutzer wollte ausdrücklich eine farbige Grundgestaltung und alle wichtigen Seiten, nicht nur technische TSX-Dateien.

## Canvas-Stand

14 Seiten: `/`, `/vermittlung`, `/raeume`, `/menschen`, `/auftritte`, `/schwarzes-brett`, `/ueber-uns`, `/hintergrund`, `/unterstuetzen`, `/kontakt`, `/anfrage`, `/bedingungen`, `/impressum`, `/datenschutz`.

Alle Seiten haben Desktop (1200 px), Tablet (810 px) und Phone (390 px), eine gemeinsame native Navigation und einen gemeinsamen Footer. Die Inhalte bestehen aus Framer-Frames, Stacks und editierbaren Texten. Die Hauptwege sind in der Vorschau getestet: Start → Vermittlung → Räume → Anfrage. Der Formulartest mit ausgefüllten Feldern endet ohne Endpunkt bewusst ohne Datenübertragung. Framer meldete bei der Veröffentlichungsprüfung keine Fehler oder Warnungen; **kein Publish** wurde ausgeführt.

## Aktuelle gestalterische Richtung

Eine plakative, typografische MFM-Sprache: orange Fläche, dunkle Tinte, heller Papiergrund, nummerierte Vermittlungswege und ein natives MFM-Plakatmotiv im Hero. Das Orange ist am alten MFM-Zeichen in `kreuzberg-on-kultour/bilder-alt/über-uns__musiker-für-musiker/` orientiert. Farbstyles: Orange `#E98A00`, Tinte `#211B19`, Papier `#FFF8ED`, Sand `#F3E6D2`, Sekundärtext `#5E5148`. Schrift: Archivo. Awwwards wurde als Inspiration für kräftige Musik-Typografie und Plakatlogik recherchiert; es wurden keine fremden Assets oder Layouts übernommen.

Die Richtung kann weiterentwickelt werden. Der Nutzer hat die aktuelle Fassung noch nicht abgenommen. Änderungen bitte direkt im bestehenden Framer-Projekt vornehmen und vor allem Startseite, Navigation und Breakpoints zusammen prüfen.

## Archivbilder im Canvas

Mit ausdrücklicher Freigabe des Nutzers wurden Bilder aus dem archivierten Kreuzberg-on-KulTour-Bestand direkt nach Framer hochgeladen und auf fünf Seiten eingebaut: ein Live-Duo auf der Startseite, eine Folksession auf `/menschen`, ein Veranstaltungsort mit Publikum auf `/auftritte`, eine Aufnahme zur Vereinsauszeichnung 2020 auf `/ueber-uns` sowie ein MFM-Motiv aus Südniedersachsen auf `/hintergrund`. Die Bildunterschriften kennzeichnen die Aufnahmen als Archivmaterial. Auf der Hintergrundseite erzählt ein neuer nativer Bild-Text-Abschnitt die belegte Projektgeschichte seit 2014; Quelle: [bisherige MFM-Startseite](https://musikerfuermusiker.jimdoweb.com/). Desktop- und Handy-Ansichten wurden nach dem Einbau geprüft. Die Framer-Veröffentlichungsprüfung meldet weiterhin `ready` ohne Fehler oder Warnungen; es wurde nicht veröffentlicht.

Bildquellen im Repo unter `kreuzberg-on-kultour/bilder-alt/`: `festivals__rosdorfer-musikfestival__1-rosdorder-musikfestival/ie8f506a3fceb6a37.jpg`, `veranstaltungen__folksessions/i98cdf633c295fc3f.jpg`, `veranstaltungen__offene-bühne/i4317ae84cf3c3e6d.jpg`, `startseite/i03311a8977067722.jpg`, `veranstaltungen__südniedersachsen-touren/ia224a94d923865c7.jpg`.

## Abgleich mit der bisherigen Website

Die [bisherige MFM-Startseite](https://musikerfuermusiker.jimdoweb.com/) und das [Schwarze Brett](https://musikerfuermusiker.jimdoweb.com/startseite/schwarzes-brett/) wurden am 17.10.2026 inhaltlich abgeglichen. Im Canvas sind jetzt auch Tontechnik/Studio sowie Plakate, Werbemittel und PR im Vermittlungsüberblick sichtbar. Das Anfrageformular unterscheidet zusätzlich Musiklehrer, Bühnen-Suche und Bühnen-Angebot, Technik und PR. Das Schwarze Brett führt wieder fünf getrennte Rubriken: Instrumente, Equipment, Elektronik, Kontaktbörse und Bandvorstellung. Göttingen und Südniedersachsen sind in der Positionierung genannt.

Die bisherige Seite bezeichnet die Hilfe als ehrenamtlich und kostenlos. Ob dies für den Neustart weiterhin zugesagt werden kann, muss vor einer öffentlichen Aussage bestätigt werden. Historische Termine, alte Vorstands-/Kontaktdaten, Spenden- und Steuerangaben sowie alte Rechtstexte wurden nicht als aktuelle Fakten übernommen.

## Funktion und Grenzen

- `MFMInquiryForm.tsx` ist die einzige Code-Komponente im Canvas. Ihr POST-Endpunkt ist leer; kein Versand ohne bewusst gesetzten Empfänger.
- `MFMNavigation.tsx` und `MFMServiceHub.tsx` sind frühe Referenzen. Die sichtbare Navigation und Vermittlungsbereiche sind native Framer-Elemente.
- Das Schwarze Brett zeigt derzeit Rubriken, aber keine öffentlichen Einträge. Einreichung, Speicherung und Moderation fehlen.
- Impressum, Datenschutz und Bedingungen sind als redaktionelle Entwürfe gekennzeichnet. Keine veralteten Rechtstexte der alten Jimdo-Seite übernehmen.
- Alle Seiten sind `noIndex` und unveröffentlicht. Keine bestehende Live-Seite ändern.

## Vor dem Livegang klären

Finale Logo-Datei, Freigabe der Inhalte und Bildrechte; verantwortliche Person/Organisation und Rechtstexte; Formular-Empfänger, Spam-Schutz, Aufbewahrung und Löschung; Moderationsprozess und technische Datenquelle für das Schwarze Brett. Erst danach veröffentlichen.
