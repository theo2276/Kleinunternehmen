# Briefing: MusikerFürMusiker – Neubau

Stand: 17.10.2026

## 1. Projektkontext

MusikerFürMusiker ist ein eigenständiges Projekt im Umfeld von Kreuzberg on KulTour e. V. Das bestehende Repo-Briefing von Kreuzberg beschreibt MusikerFürMusiker als separates Projekt zur Vermittlung von Proberäumen, Musikern und Auftrittsmöglichkeiten. Historische öffentliche Quellen beschreiben die Plattform außerdem als Hilfe bei Probe- und Unterrichtsräumen sowie als Selbsthilfe-/Vernetzungsangebot für die regionale Musikszene.

Der Neubau soll nicht die Kreuzberg-on-KulTour-Seite duplizieren. MusikerFürMusiker braucht eine eigene, deutlich auf Vermittlung und Austausch ausgerichtete Informationsarchitektur.

## 2. Technisches Ziel dieser Phase

Noch kein fertiges Design bauen. Zuerst eine belastbare Framer-Basis schaffen:

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

## 4. Vorläufige Seitenlogik

Noch keine starre Seitenzahl. Technisch sollte der Framer-Neubau mindestens folgende Ziele unterstützen:

- Start
- Vermittlung / Bereiche
- Anfrage
- Schwarzes Brett bzw. Austausch
- Über MusikerFürMusiker
- Kontakt
- Impressum / Datenschutz

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

## 8. Offene Recherche

Der lokale Obsidian-Vault / die Claude-Memory ist über den GitHub-Zugriff nicht enthalten. Bevor das finale Design oder detaillierte Inhalte entstehen, sollte diese projektspezifische Memory zusätzlich eingelesen werden, sobald sie in der Arbeitsumgebung verfügbar ist.
