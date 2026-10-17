---
name: project-copyteam-website
description: "Übungsprojekt Neubau copyteam.jimdofree.com (Copyshop Göttingen, Inh. Klaus Wißmann) in Framer – Design „Passer“, IDs, offene Punkte"
metadata:
  node_type: memory
  type: project
  originSessionId: 9a2ddd4c-ecb6-474e-81f6-f45eda58b016
  modified: 2026-10-12T10:55:39.652Z
---

Am 12.10.2026 als Übungsprojekt gebaut. Seit 16.10. ein möglicher Kunde, siehe „Parallelarbeit mit Codex“. Hannes schickte nur „https://copyteam.jimdofree.com/ dafür auch komplett neues layout“, also derselbe Ablauf wie bei [[project-goefoto-website]] und [[project-zuehlke-website]]: Inhalte von der alten Jimdo-Seite, neues Framer-Projekt, noindex, nicht veröffentlicht.

**Framer-Projekt:** ID `GajF1unoFRskd4hCKfQp`, https://framer.com/projects/GajF1unoFRskd4hCKfQp. Die Veröffentlichungs-Prüfung lief ohne Fehler und Warnungen.

**Verlauf:** Die erste Fassung übernahm goefoto-Bausteine. Hannes lehnte das ab (siehe [[feedback-design-referenzen-pro-projekt]]) und schickte die Referenzen vantageprinters.com, rizzo.studio, druckzuck.de und zimmermann-medien.de. Danach: „erfinde etwas Neues daraus, es soll clean sein, wir wollen das Beste vom Besten verkaufen“. Also nicht die Referenzen nachbauen, sondern eine eigene Idee entwickeln.

**Design „Passer“:** Die Startseiten-Überschrift erscheint in Cyan, Magenta und Gelb versetzt und läuft dann „in Passer“ zu Schwarz zusammen. Die Sortiments-Karten haben das DIN-A-Verhältnis 1 : √2. Eine Formatskala zeigt A4 bis A0 als geschachtelte Flächen mit echten Preisen. Der Abgabe-Fahrplan stellt den Ladentag von 10 bis 18 Uhr dar, Abgabeschluss für Heft- und Leimbindung ist 16 Uhr. Um Fotos sitzen Schneidmarken. Farben: Weiß, Recyclingpapier #EFEBE4, Toner #111111, Prozessgelb #FFE500 (wie das Ladenschild), Cyan #00A3E0 und Magenta #E6007E als Akzente. Schriften: Fraunces 600 für Überschriften, Instrument Sans für Text, Unbounded 800 nur für das Logo „copyteam“, weil es dem echten Ladenschild ähnelt. Buttons sind Pills, Icons kommen aus Lucide.

**Gebaut:** Startseite (Einstieg, Sortiment, Fahrplan, Formatskala, Datenwege, Hausgeschichte 1985 mit Grafikschmiede, gelber Besuchsblock). /preise mit 13 CMS-Preislisten, gefiltert in drei Bereiche. /sortiment/:Sortiment als Detailseite für 8 CMS-Einträge, mit Details-Liste und „Nächster Bereich“. Dazu /grafikschmiede, /kontakt mit Formular, /impressum und /datenschutz. Die Vorlage „Main“ hat eine schwarze Navigation mit Handy-Menü und einen schwarzen Footer mit großem gelbem Schriftzug. Alle Seiten haben Desktop, Tablet und Phone. Außerdem gesetzt: Metadaten, Favicon (SVG), noindex und ein Seitenübergang.

**Landingpage (14.10.2026):** /abschlussarbeit-binden für die Suche „Abschlussarbeit binden Göttingen“. Inhalt: Einstieg mit Kennzahlen, Preisrechner, vier Schritte, „Hardcover“ erklärt, Checkliste, FAQ (Komponente „FAQ Frage“, die geschlossene Variante heißt intern „Variant 2“, beim Einfügen die Varianten-ID `oIuMP7iyd` nutzen) und Besuchsblock mit golocal-Zitat. Die Navigation „Abschlussarbeiten“ und die Buttons auf der Startseite zeigen dorthin. Der Preisrechner ist die Code-Komponente `Bindungsrechner.tsx` (Kopie `~/Kleinunternehmen/copyteam/`). Seit 16.10. rechnet sein Abgabeschluss in Berliner Zeit mit den Feiertagen in Niedersachsen und der Uhrzeit. Ihre Preise sind **fest im Code** hinterlegt. Ändert sich die Preisliste im CMS, muss der Code mitgeändert werden.

**Ergänzt am 16.10.2026 (Abgleich mit der alten Seite):** Aktuelles-Bereich auf der Startseite direkt unter dem Einstieg (CMS „Aktuelles“, 5 Meldungen, Felder Label, Farbe, Link, Linktext). Neue Seite /ausbildung (IHK-Ausbildungsbetrieb, Berufe, 4 Plätze für Jahrespraktika, Hinweis „Aktuell · 8/25“). Neue Seite /vorverkauf (CMS „Veranstaltungen“ mit Feld Archiv: aktuelle Termine mit Leerzustand, Plakat-Archiv mit 10 Plakaten von Kreuzberg on KulTour e. V. als Masonry mit Lightbox). Neue Footer-Links: Abschlussarbeit, Ausbildung, Vorverkauf. Die Fotoliste für den Termin im Laden liegt in `~/Kleinunternehmen/copyteam-fotoliste.md`. Framer-Sitzungen laufen nach etwa zwei Tagen ab, dann `session new` (state ist danach leer).

**Öffnungsstatus und Navigation (16.10.2026):** Das Bauteil „Oeffnungsstatus“ ist aus dem FotoStube-Projekt übernommen (`codeFile/sHCVy3W:default`, Sicherungskopie `~/Kleinunternehmen/copyteam/Oeffnungsstatus.tsx`). Es hat jetzt Sa 10–15, Instrument Sans und eine neue Variante „hell“ mit grünem Punkt. Eingesetzt ist es in der Navigation (Desktop, Gruppe „Rechts“ mit Telefon-Button), im Handy-Menü, im Einstieg der Startseite (nur Tablet und Phone, weil die Desktop-Navigation es schon zeigt), im Besuchsblock, in der Footer-Spalte Öffnungszeiten, auf der Landingpage und auf /kontakt. Hannes hat selbst ein echtes Ladenfoto in den Einstieg gesetzt. Die Navigationsleiste ist auf 1280 px begrenzt. Das Handy-Menü nutzt Fraunces und hat einen Anruf-Button.

**Grafikschmiede (16.10.2026):** Die Texte wurden gegen die alte Seite geprüft. Erfundenes ist korrigiert: Titel „Gestaltet im Haus. Gedruckt im eigenen Laden.“, Visitenkarten „Einzeln oder als Teil eines kompletten Projekts.“, „Einladungen & Grußkarten … in Ihrem Wunschformat“, keine erfundenen Anlässe mehr wie „Trauerfall“. Das Stockfoto bleibt auf Hannes' Wunsch vorerst. Der Abschlussblock ist jetzt ein Projektanfrage-Formular (`Y640g_uSV`, Tracking-ID „grafikschmiede-anfrage“, Felder Name, E-Mail, Telefon, Projektart, Auflage, Wunschtermin, Idee, Datenschutz) mit dem Bauteil „Submit Button“. Wohin die Formulare in Framer zugestellt werden, muss Hannes selbst einstellen.

**Basic-Plan-Umbau (16.10.2026):** Framer Basic erlaubt nur 2 CMS-Sammlungen (dazu 30 Seiten, 1.000 Einträge, 50 GB). Deshalb sind „Veranstaltungen“ in „Aktuelles“ aufgegangen (neues Feld „Art“ mit Meldung/Vorverkauf/Archiv, dazu Termin, Ort, Preise, Veranstalter, Plakat). Die Startseite filtert auf Meldung, /vorverkauf auf Vorverkauf bzw. Archiv. Die „Preislisten“ sind jetzt feste Karten auf /preise, Preise ändert man dort direkt im Editor. Die Sammlungen Preislisten und Veranstaltungen sind gelöscht. Sicherungen liegen in `~/Kleinunternehmen/copyteam/preislisten-backup.json` und `veranstaltungen-backup.json`. Es bleiben die Sammlungen Sortiment und Aktuelles.

**Hintergrund belebt (16.10.2026):** Hannes fand ihn „langweilig“ wie bei der FotoStube, also in die Copyshop-Welt übersetzt:
- Papierkorn: feste Ebene `DRadydYtD` in der Vorlage, Deckkraft 0,04, Multiply. Die Datei liegt in `copyteam/marke/papierkorn.jpg`.
- Druckraster: Offset-Rasterpunkte (`marke/raster-band.png`), oben rechts in den Einstiegen und unten rechts auf den gelben Flächen, mit Maske ausgeblendet.
- Kopierer-Scanlicht: Lichtbalken mit gelber Linie, loopEffect y, wandert über die dunklen Flächen.
- Endlospapier: Code-Bauteil `codeFile/xyJxm4i:default` (`copyteam/Endlospapier.tsx`), 34 px am rechten Rand, Lochrand und grüne Streifen, läuft beim Scrollen mit, nur Desktop.
**Lade-Intro (16.10.2026):** Code-Bauteil „LadeIntro“ (`codeFile/jgYPnDx:default`, Kopie `copyteam/LadeIntro.tsx`), Instanz `iT5rWjKCG` fest in der Vorlage, zIndex 10, pointerEvents none. Die CMYK-Punkte fliegen herein, rutschen in Passer, werden ein schwarzer Punkt, der zur Fläche mit dem gelben Schriftzug wächst. Nach 1,75 s zieht die Fläche nach oben weg, insgesamt etwa 2,4 s. Es läuft nur einmal pro Besuch (sessionStorage), ein Klick überspringt es, bei reduzierter Bewegung entfällt es. Die Abfolge ist reines CSS und endet auch ohne JavaScript. Im Canvas ist es ausgeblendet. Lokal getestet mit esbuild und Framer-Stub (Testseite im Scratchpad). Lehre daraus: `scale(var(--x))` in Keyframes springt, statt zu interpolieren, deshalb feste Werte nehmen.
**Passer-Hover (16.10.2026):** Bauteil „Sortimentkarte“ (`hldQ8gd18`, Primärvariante `I60UXFCzg`, Hover-Geste `WjzHRuDfL`). Hinter dem Bogen liegen drei Platten in Cyan, Magenta und Gelb (Multiply, im Normalzustand unsichtbar). Beim Hover schieben sie sich versetzt hervor (C −11/−8, M +11/+5, Y −5/+12, Deckkraft 0,92), der Bogen hebt sich um 6 px. Variablen: Bild, Titel, Kurztext, Nummer, Farbe. Die Instanz `xYS9uFXdu` in der CMS-Karte `Pz6l_9lJR` ist an das Sortiment gebunden. Gesture-Varianten lassen sich nicht per Screenshot ausgeben („must be a top-level variant“).
**Interaktive Formatskala (16.10.2026):** Code-Bauteil „Formatskala“ (`codeFile/beqQK0p:default`, Kopie `copyteam/Formatskala.tsx`, Instanz `qQMSbCw8P` im Abschnitt `vJdC9WZJs`). Es ersetzt die alte native Skala und die Preiszeilen daneben. A4 bis A0 sind maßstabsgetreu als SVG gezeichnet. Hover, Klick, Tastatur oder Reiter wählen ein Format, rechts erscheinen die mm-Maße, „so groß wie n A4-Blätter“, „Passt für“-Chips, Preise und der Link zum Preisfinder. Beim ersten Sichtbarwerden wachsen die Bögen nacheinander. Im Browser-Pane frieren CSS-Übergänge in Screenshots ein, deshalb den Zustand über DOM-Attribute prüfen.
Noch offen: CMYK-Lesefortschritt.

**Preisfinder (16.10.2026):** Auf /preise ersetzt das Code-Bauteil „Preisfinder“ (`codeFile/hTC9L7R:default`, Kopie `~/Kleinunternehmen/copyteam/Preisfinder.tsx`, Abschnitt `DwmMTbfY0`) die 13 festen Preiskarten. Es hat 4 Reiter (Kopien & Drucke, Großformat, Bindungen, Laminate), Produkt-Chips, Menge per Regler (logarithmisch) oder Plus/Minus, Preis je Stück und gesamt (mit Systemgebühr) und die ganze Staffel mit hervorgehobener Zeile, die man anklicken kann. Die Preise stehen **fest im Code** von Preisfinder.tsx und Bindungsrechner.tsx. Ändern sich Preise, müssen beide angepasst werden (Quelle: `preislisten-backup.json`). Das Druckraster ist auf Phone (0,06) und Tablet (0,1) abgeschwächt.

**Parallelarbeit mit Codex (16.10.2026):** Hannes arbeitet am selben Framer-Projekt auch mit Codex (Arbeitsordner `~/Documents/ChatGPT/Kleinunternehmen`, Sitzungen in `~/.codex/sessions/`). Codex hat
- das Ladenfoto für den Einstieg aufbereitet (`assets/copyteam-storefront-hero.webp`),
- die Formatskala gegen Höhensprünge beim Formatwechsel korrigiert (Raster mit reservierten Zeilen, übernommen nach `copyteam/Formatskala.tsx`),
- die Seite /geschichte gebaut (`uRDAjpF6o`, Bauteil `CopyteamGeschichte` `codeFile/bIbclLt`, Kopie `copyteam/CopyteamGeschichte.tsx`) mit Platzhaltern („Jahr ergänzen“) und Stockfotos, verlinkt über den Button „Unsere Geschichte“ (`SzerV45j6`) auf der Startseite.
Laut Codex-Chat will der copyteam-Kunde mit Hannes zusammenarbeiten und hat vier weitere Websites für ein Redesign genannt: Café Kreuzberg, Kreuzberg on KulTour, Musiker für Musiker, Kulturmarkt Südniedersachsen. **Vor jeder Arbeit Framer-Code mit den lokalen Kopien vergleichen**, damit Änderungen von Codex nicht überschrieben werden.

**Online-Recherche (14.10.):** golocal: Copy Team GmbH, Platz 1 der Copyshops in Göttingen, 4,1 Sterne bei 13 Bewertungen. Gelbe Seiten: liegt gegenüber der Bushaltestelle Jüdenstraße, zwischen Barfüßer- und Roter Straße. Die Verzeichnisse nennen „Copy Team GmbH“, das Impressum „Inh. Klaus Wißmann“ – das muss geklärt werden. Bridebook verlinkt noch copyteam.jimdo.com. Mitbewerber „Digitales Druckzentrum“ (Platz der Göttinger Sieben) hat 2,6 Sterne. Google Maps ist nicht geprüft.

**Offen / zu klären:**
- Die Fotos sind Unsplash-Stock (kommerziell frei, nicht CC0). Für eine echte Umsetzung braucht es eigene Ladenfotos. Das einzige Originalfoto der alten Seite ist klein und stark gefiltert.
- Die alte Preisliste Plot A1 ist unlogisch (6–10 Stück 21 €, 11–20 Stück 23 €). Sie wurde unverändert übernommen.
- Impressum: Die alte Seite nennt das TMG, im Neubau steht „§ 5 DDG“. Der Datenschutztext ist ein Entwurf für Framer-Hosting. Beides rechtlich prüfen lassen.
- ~~Mailadresse~~ am 16.10. geklärt: Hannes sagt info@copyteam-goettingen.de. Sie steht überall so (geprüft auf Startseite, Vorlage, Kontakt, Landingpage und in den Rechtstexten).
- Die Grafikschmiede-Website ct-grafikschmiede.jimdo.com ist tot und wird deshalb nicht verlinkt.
- Die alten Seiten „Vorverkauf“ (Kreuzberg on KulTour) und „Links“ wurden nicht übernommen. Der Praktikumshinweis von 8/25 ist als allgemeiner Text eingebaut.
- Die Animationen (Passer-Effekt, Laufbewegungen) sind nur in der Live-Vorschau prüfbar.

**Fallstricke:** Siehe [[framer-native-over-code]]. Neu in dieser Session:
- Temporäre DSL-IDs bleiben die ganze Session belegt. Ein wiederverwendetes `fc1` hängte Texte in den Footer.
- Archivo ist bei Framer die Fontshare-Fassung ohne wdth-Achse.
- `stylePresetHeading*` geht nur bei Richtext-Variablen. Bei statischem Richtext Tag und Schrift direkt am TextBlock und an den TextRuns setzen.
- `metadata.noIndexSite` gehört auf die Startseite (WebPageNode), nicht auf den RootNode.
- Screenshots von Page-Replikas zeigen die Vorlage manchmal mit dem falschen Breakpoint.
