---
name: project-goefoto-website
description: "Übungsprojekt Neubau goefoto.de (Fotoatelier Wolfgang Koch, Göttingen) in Framer – Stand, Designrichtung, IDs, offene Punkte"
metadata:
  node_type: memory
  type: project
  originSessionId: 0a2270e6-0379-4203-a307-cb3a67410789
  modified: 2026-10-12T05:59:40.070Z
---

Übungsprojekt (kein Auftrag), am 12.10.2026 gebaut: Neubau von goefoto.de in Framer. Gleicher Ablauf wie bei [[project-tischlerei-witthuhn-website]]: Inhalte nur von der alten Seite, neues Framer-Projekt, noindex wegen echtem Firmennamen, nicht veröffentlicht.

**Framer-Projekt:** ID `QBmgwhOn69rX2eGQwCha`, https://framer.com/projects/QBmgwhOn69rX2eGQwCha. Die Vorschau zeigte keine Fehler, veröffentlicht ist noch nichts.

**Hannes' Vorgaben (12.10.):** Die Originalfotos von goefoto.de dürfen benutzt werden. Die Designrichtung soll sich bewusst von den bisherigen Projekten unterscheiden, die meist Papierton + Rot-Akzent oder dunkel + Cyan waren.

**Design freigegeben (12.10.2026):** Hannes: „goefoto ist das, behält das Design“. Der Stil „Kontaktbogen“ bleibt bestehen und wird nicht umgebaut, obwohl [[feedback-eigene-designrichtung]] diese Grammatik für **neue** Projekte als verbraucht einstuft.

**Design „Kontaktbogen“:** reines Weiß #FFFFFF, Schwarz #0A0A0A, Nebel #F0F0EE, Grau #6B6B67, Linie #D9D9D5. Einziger Akzent ist Ultramarin #2B2BF2 als „Auswahl-Markierung“. Schriften: Bricolage Grotesque (800, wdth 75, Versalien) für Überschriften, Geist für Text, Geist Mono für Etiketten. Keine Serife, eckige Kanten, Swiss-Raster mit nummerierten Abschnitten „(01)…(09)“.

**Gebaut:** Startseite mit Titel + laufendem Filmstreifen, Atelier-Zahlen, Leistungs-Index aus dem CMS, Iris-Block (dunkel), Passbild/Bewerbung-Karten, Studio mieten, Über uns mit Zeitleiste, Referenzen-Laufband und Kontakt. Dazu die Detailseite `/leistungen/:Leistungen` (CMS „Leistungen“ mit 14 Einträgen samt Paketen, Preisen und Galerie), /impressum und /datenschutz, die Vorlage „Main“ (klebende Navigation mit Handy-Menü, schwarzer Footer), Komponenten „Button“ (Ink/Outline/Inverse mit Hover) und „Navigation“. Breakpoints Desktop/Tablet/Phone sind auf allen Seiten angelegt, außerdem Metadaten und ein Seitenübergang.

**Offen / zu klären:**
- ~~Freitag-Öffnungszeit~~ geklärt am 12.10.2026: Hannes sagt Freitag 10–18 Uhr. Auf der Seite steht das überall so (Footer und Kontakt, alle Breakpoints).
- Das Impressum der alten Seite nennt noch das TMG. Im Neubau steht „§ 5 DDG“. Rechtlich prüfen lassen.
- Der Datenschutztext ist eine gekürzte Übernahme von der alten Seite und noch nicht auf Framer-Hosting angepasst.
- Viele Originalfotos sind älter, klein und haben Wasserzeichen (z. B. Studio-Bild, Iris). Für eine echte Umsetzung braucht es neue hochauflösende Dateien.
- Favicon steht seit 12.10.2026: weißes „K“ auf Schwarz mit blauem Punkt, auch als Apple-Touch-Icon. Fotobox-Detailbilder sind noch nicht geprüft.

**Fallstricke dieser Session:** Siehe [[framer-native-over-code]]. Neu dazugekommen: Das Framer-KI-Guthaben war wieder leer, die Schriftsuche ging also nicht, direkt gesetzte `fontName` funktionieren aber. Ein `+IconVariable` wird abgelehnt, solange das Icon-Set noch nirgends im Projekt benutzt wird, deshalb erst ein IconNode setzen. Der Bild-CDN der alten Seite (website-editor.net) liefert mit `/s/` im Pfad 403, ohne `/s/` geht es. `getRect` liefert Platzhalter (200×200), die Screenshots stimmen aber. Text mit Preset und `textWrap: balance` überlappt im Ticker, deshalb das Preset dort lösen. Eine Galerie aus dem CMS bindet man mit `repeat.variable` auf das Array-Feld und `fill="var(--variable-<Item-Feld-ID>)"`. „Nächste Leistung“ läuft über `var(--variable-nextItemId.<Feld-ID>)`.

**Domain:** Hannes will mit fotoatelier-koch.de arbeiten. Laut DENIC war sie am 12.10.2026 frei. Empfehlung: erst nach Zusage registrieren, und zwar auf den Inhaber Wolfgang Koch, nicht auf Hannes. Fremder Firmenname = Risiko nach Namens- und Kennzeichenrecht. Für die Vorschau eine framer.website-Adresse nehmen.

**Fix 12.10.2026:** Der Parallax-Effekt am Über-uns-Foto ist entfernt. Auf dem Handy schob sich das Bild über Überschrift und Text, weil Bild und Text dort untereinander stehen. Parallax nur einsetzen, wenn das Element auf allen Breakpoints freien Raum hat.

**Stand 13.10.2026 (zweite Session, nachgetragen):** Eine parallele Session hat die Unterseiten /ueber-uns, /kontakt, /referenzen (alle 77 Partner) und /tipps angelegt. Die Navigation hat jetzt sechs Punkte: Leistungen, Studio mieten, Über uns, Referenzen, Tipps, Kontakt. Die Startseiten-Abschnitte Studio, Über uns und Referenzen wurden neu aufgebaut und haben neue IDs, dazu kommen „Mehr …“-Links. Die Tipps stammen von der alten Seite: Deren Menüpunkt „TIPPS“ zeigt auf `/Impressium`, das ist eine Tipps-Seite und kein Impressum. Geprüft: Die Angaben (28.–31. SSW, 5–10 Lebenstage) sind dort belegt. Ab 13.10. wird nur noch in der Session `0a2270e6…` weitergearbeitet.

**13.10.2026:** Ein ultramarinblauer Entwurf-Balken steht oben in der Vorlage „Main“ (Knoten `Nf609HQk8`): „Entwurf – unverbindlicher Vorschlag … keine offizielle Website des Fotoatelier Koch“. Er muss vor einem echten Livegang raus. Dazu gibt es eine 404-Seite `/404` („Dieses Bild fehlt.“ mit gestricheltem leerem Bildfeld) mit allen drei Breakpoints. Weiterhin nicht veröffentlicht.

**Standard hochschrauben (13.10.2026), Reihenfolge mit Hannes: Hero → Bildlinie → Galerie → Bewegung.**
- Schritt 1, Hero: erledigt. Zweispalter mit dem „ausgewählten Bild“ rechts (Iris im blauen Auswahlrahmen, Bildunterschrift „03A — Iris-Fotografie ✕ Auswahl“). Das Wasserzeichen wird weggeschnitten: Das Bild ist absolut positioniert, hat 116 % Höhe und wird oben ausgerichtet. Beim Laden „entwickelt“ es sich: Eine weiße Fläche mit Deckkraft 0 und appear von 1 blendet in 1,8 s aus, das Bild zoomt von 1,12 her ein. Der Filmstreifen ist flacher (280 px) und schneidet im ersten Bildschirm an. Im Streifen ist die Iris durch ein Portrait ersetzt, die „Auswahl“ gibt es nur noch oben. Auf Tablet und Handy steht alles untereinander.
- Die Iris-Datei hat nur 900 × 900 px und ist auf Retina leicht weich. Originaldateien beim Kunden anfragen.
- Offen: Entscheidung zur Bildlinie (Schwarz-Weiß als Grundlinie, Farbe nur bei der Auswahl?). Hannes schaut außerdem im Framer-Shop nach Bausteinen.

**Hero mit Flüssig-Slider (13.10.2026):** Vorbild war https://liquiddisplacementslider.framer.website/, auf Hannes' Wunsch selbst gebaut statt gekauft. Code-Komponente `LiquidFrame.tsx` (Framer-ID `codeFile/S1S2yQ2:default`), Sicherungskopie liegt in `~/Kleinunternehmen/goefoto/LiquidFrame.tsx`. Eigenes WebGL ohne Bibliotheken: eine fbm-Rauschwelle wischt das nächste Bild von links herein, beide Bilder werden dabei verzerrt. Dazu Autoplay mit Fortschrittslinie „01 — 06“, Pause beim Darüberfahren, eckige Pfeile, Wischen, Vorschaubilder (aktives blau), Bildunterschrift „01A — Titel ✕ Auswahl“. Fallback ist eine einfache Überblendung, im Canvas und bei reduzierter Bewegung gibt es ein statisches Bild. Steuerelemente: Bild/Titel 1–6, Intervall, Übergang, Flüssigkeit, Zoom, Fokus Y, Akzent, Rahmen. Die DSL-Schlüssel kommen aus den deutschen Titeln (`$control__bild1`, `$control___bergang`, `$control__fl_ssigkeit`). Im Hero: Zoom 1,25 und Fokus Y 0,35, damit die Wasserzeichen verschwinden. Getestet in einer lokalen Testseite (Server per launch.json, danach wieder entfernt): Die Bilder von framerusercontent sind für WebGL freigegeben (CORS ok), Ausrichtung stimmt. Live-Test in der Framer-Vorschau durch Hannes steht noch aus.
- Slider-Bilder 4–6 am 13.10. auf Hannes' Wunsch getauscht: Hochzeitsdetail (Hut und Strauß auf roten Hockern), Welpe (Australian Shepherd) und Baby mit blauen Augen. Die Bilder kamen als Screenshots von ihm, die schwarzen Ränder sind weggeschnitten, hochgeladen per Data-URL.
- LiquidFrame kann seit 13.10. Zoom und Ausschnitt **pro Bild** (`$control__zoomN`, `$control__fokusXN`, `$control__fokusYN`; 0 bzw. -1 = allgemeiner Wert). Anlass: Das Baby (Querformat im Hochkant-Rahmen) wurde mit dem allgemeinen Zoom 1,25 oben und rechts angeschnitten. Jetzt gilt: Baby Zoom 1, Fokus X 0,7. Hochzeit Zoom 1,05. Welpe Zoom 1,05, Fokus Y 0,7. Iris, Portrait und Business behalten Zoom 1,25 gegen die Wasserzeichen.

**Referenzen-Seite mit Logo-Wand (13.10.2026, nach Plan, freigegeben):** Hannes fand die Textliste langweilig und lehnte die zwischenzeitlich gebauten 9 „Kundenarbeiten“ ab. Er will die 77 Logos. Umgesetzt:
- Logos von der alten Seite (`/Referenzen`). 11 davon gab es nur über **signierte Adressen** (`le-cdn…/s/…?Expires=…&Signature=…`, gültig etwa bis 11/2026). Alle auf 600 × 600 px weiß vereinheitlicht (Logo 440 px mittig, PNG auf Weiß gelegt).
- Website-Links stehen in der Quelle um eine Position versetzt (der Link gehört zum nächsten Eintrag), das ist korrigiert. „Leben 37 Stadtmagazin“ hat keinen Link.
- CMS **„Referenzen“** (`tXtA8LffM`): Name, Nummer, Logo, Website, 77 Einträge in Originalreihenfolge. Sicherung in `~/Kleinunternehmen/goefoto/referenzen-logos.json`.
- Komponente **„Logo-Kachel“** (`c_3dA2dTo`): Nummer, Logo und Name. Grundzustand: Graustufen 100 %, Deckkraft 0,72. Hover-Gesture-Variante: Farbe, Innenrahmen blau, Schrift blau. Link öffnet in neuem Tab. Screenshots von Gesture-Varianten verweigert Framer („must be a top-level variant“).
- Auf `/referenzen`: Kundenarbeiten, Zwischenzeile und alte Textliste (`UbH2Xs2o7`) entfernt. Neu ist die „Logo-Wand“, ein CMS-Raster mit 6/4/3 Spalten und Haarlinien in einer Farbe (Framer erlaubt nur eine borderColor pro Rahmen). Die Kacheln blenden gestaffelt ein.
- Melden: Nr. 39 (Marcia Barrett/Boney M.) und Nr. 50 (Sabrina Terence) sind Porträtfotos, Nr. 54 („Aseef & Bestie“) ist ein Album-Cover, alle drei keine Logos. Noch drin, Hannes entscheidet.
- Rechtlich: Das ist Kochs eigene Referenzliste von der alten Seite. Für die Demo passt das, vor einem Livegang bestätigt Koch die Liste.

**Referenzen-Recherche für Claude (13.10.2026, Konzept noch nicht ausgewählt):** Hannes hat eine ausführliche Internetrecherche nach einer besonderen Darstellung und einen Umsetzungsweg für Claude angefordert. Ergebnis liegt in `/Users/hannes/Documents/ChatGPT/Kleinunternehmen/goefoto-referenzen-konzept-claude.md`.
- Empfehlung: „Interaktiver Leuchttisch“ im freigegebenen Kontaktbogen-Stil. Acht ausgewählte echte Logos als interaktiver Einstieg; gegenüberliegende Felder verbinden sich zur großen Ansicht. Darunter alle 77 Einträge als gut lesbares, nativ durchsuchbares CMS-Verzeichnis.
- Stärkster Fund: https://framer.university/resources/grid-morphs-into-preview-in-framer mit funktionierender nativer Framer-Demo https://grid-preview.learnframer.site/. Desktop-Zustandswechsel im Browser geprüft; bei 390 px schneidet das Vorbild Inhalte ab. Deshalb eigene Touch-Ansicht vorsehen.
- Weitere verglichene Prinzipien: Codrops Grid Zoom mit Miniaturübersicht, Sticky Grid Scroll, Studio-Hyte-Archiv, fotografischer Kontaktbogen, Infinite Canvas. Bewertung und Quellen stehen im Briefing.
- Noch kein Framer-Umbau erfolgt. Hannes hat diese neue Richtung und die acht Auswahlmotive noch nicht ausgewählt. Nach Beauftragung erst zwei echte Logos als nativen Prototyp bauen; CMS-Anbindung und Tastatur/Touch konkret nachweisen, dann Vorschau und Feedback. Keine unbelegten Kundenarbeiten ergänzen, alle 77 erhalten, nichts veröffentlichen.
