# Briefing: MusikerFürMusiker – Neubau

Stand: 17.10.2026

## 1. Projektkontext

MusikerFürMusiker ist ein eigenständiges Projekt im Umfeld von Kreuzberg on KulTour e. V. Das bestehende Repo-Briefing von Kreuzberg beschreibt MusikerFürMusiker als separates Projekt zur Vermittlung von Proberäumen, Musikern und Auftrittsmöglichkeiten. Historische öffentliche Quellen beschreiben die Plattform außerdem als Hilfe bei Probe- und Unterrichtsräumen sowie als Selbsthilfe-/Vernetzungsangebot für die regionale Musikszene.

Der Neubau soll nicht die Kreuzberg-on-KulTour-Seite duplizieren. MusikerFürMusiker braucht eine eigene, deutlich auf Vermittlung und Austausch ausgerichtete Informationsarchitektur.

## 2. Ziel dieser Phase (aktualisiert nach Nutzerfeedback)

Eine vollständige, farbige Grundfassung direkt im Framer-Canvas bauen. Der Nutzer möchte ausdrücklich bereits ein Grunddesign und alle wichtigen Seiten; spätere kreative Überarbeitungen sind möglich. Die Gestaltung orientiert sich am vorhandenen orangefarbenen MFM-Zeichen und an recherchierten typografischen Musik- und Plakatbeispielen, ohne fremde Layouts zu kopieren. Technisch soll die Website zugleich:

- responsive Navigation
- klare funktionale Einstiege in die Vermittlungsbereiche
- funktionierendes Anfrageformular
- semantisch saubere HTML-Struktur
- gute Tastaturbedienung und zugängliche Labels
- alle wichtigen Texte/Links/Grundwerte später direkt in Framer editierbar
- keine unnötigen Abhängigkeiten
- kein Deployment und keine Live-Änderung

## 3. Kernbereiche für die erste Struktur

Für die technische Basis werden nur belastbare Kernfunktionen abgebildet:

1. **Proberäume & Unterrichtsräume** – suchen oder anbieten
2. **Musiker vernetzen** – Musiker, Bands und Projekte zusammenbringen
3. **Auftritte** – Auftrittsmöglichkeiten und Anfragen
4. **Schwarzes Brett** – weitere Gesuche, Angebote und Szene-Austausch

Diese vier Bereiche sind zunächst Einstiegspunkte. Die endgültige Unterteilung entscheidet der spätere Inhalts-/Designprozess.

## 4. Umgesetzte Seitenlogik

Im unveröffentlichten Framer-Projekt sind 14 Seiten angelegt: Start, Vermittlung, Räume, Musiker & Unterricht, Auftritte, Schwarzes Brett, Über uns, Hintergrund, Unterstützen, Kontakt, Anfrage, Bedingungen, Impressum und Datenschutz. Alle Seiten haben Desktop-, Tablet- und Handy-Breakpoints und einen gemeinsamen nativen Rahmen.

Falls das Schwarze Brett später echte Accounts, Moderation, Suche oder persistente Einträge benötigt, ist das kein reines Framer-CMS-Thema mehr. Dann muss vor Umsetzung bewusst entschieden werden, ob ein externer Dienst, eigenes Backend oder eine andere Datenquelle verwendet wird.

## 5. Formulare

`MFMInquiryForm.tsx` enthält bewusst keinen fest verdrahteten Empfänger.

Der Endpunkt wird als Framer-Property gesetzt. Ohne Endpunkt werden keine Daten übertragen. Das verhindert, dass der Design- oder Teststand versehentlich echte personenbezogene Daten an einen unbekannten Dienst sendet.

Vor Livegang klären:

- Empfänger / Backend
- Datenschutzerklärung
- Aufbewahrung und Löschung
- Spam-Schutz
- Moderationsprozess
- automatische Bestätigung ja/nein

## 6. Responsive Grundprinzipien

- normale Dokumentstruktur statt frei schwebender Desktop-Layer
- flexible Breiten und CSS-Grid/Flex
- mobile Navigation funktional
- Inhalte dürfen sich auf kleinen Viewports umbrechen
- keine Designwerte nur deshalb festschreiben, weil sie auf Desktop gut aussehen

## 7. Was aus anderen Projekten übernommen werden darf

Nur technische Erkenntnisse:

- Framer Code Components mit Property Controls
- saubere Trennung von funktionaler Logik und visuellen Werten
- responsive Layouts
- Accessibility-Grundlagen
- defensive Behandlung externer URLs und Formularziele

Nicht übernehmen:

- Farbwelten
- Schriften
- Hero-Kompositionen
- Animationen
- Kartenlooks
- Branding anderer Kunden
- universelle Templates

## 8. Quellen und offene Entscheidungen

Der lokale Obsidian-Vault / die Claude-Memory wurde eingelesen. Die alte MusikerFürMusiker-Seite wurde für Inhalt und Rubriken geprüft; ihre veralteten Rechtstexte und Meldungen wurden nicht übernommen. Die neue Gestaltung liegt bereits im Framer-Canvas. Offen bleiben Freigaben für Logo, Inhalte und Rechtstexte sowie Formular-Empfänger und Moderation. Das Schwarze Brett hat noch keine öffentlichen Einträge.
