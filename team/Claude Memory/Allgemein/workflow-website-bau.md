---
name: workflow-website-bau
description: "Fester Arbeitsweg für jede neue Website mit Hannes – von Briefing bis Livegang, ohne feste Designrichtung; dazu technische Framer-Fallstricke"
metadata:
  type: reference
---

Dieser Ablauf gilt für **jede** Website, egal ob Kundenseite, Übungsprojekt oder eigene Seite. Er legt **keine Designrichtung** fest, die wird pro Projekt neu gefunden (siehe [[feedback-eigene-designrichtung]]). Der Ablauf ist aus dem Bau von [[project-nearmade-website]] am 12.10.2026 entstanden. Qualitätsmaßstab ist [[feedback-website-standard]], abgehakt wird mit [[checkliste-website-grundlagen]]. Framer-Details stehen in [[framer-native-over-code]]. Jede Framer-Seite muss in den **Basic-Tarif** passen (30 Seiten, 2 CMS-Sammlungen, keine Weiterleitungen): [[feedback-framer-basic-tarif]].

## Zusammenarbeit mit Hannes

- Immer Deutsch, Fachbegriffe kurz erklären. Hannes schreibt oft per Sprache, deshalb halbe Sätze mitdenken und bei abgebrochenen Nachrichten nachfragen.
- In **kleinen Schritten** arbeiten: einen Bereich bauen, Screenshot ansehen, kurz berichten und Hannes’ Urteil abwarten. Sein Feedback ist oft knapp („lw“, „besser machen“, „unruhig“). Dann selbst konkrete Gründe nennen und eine Lösung umsetzen.
- Bewegung lässt sich auf Screenshots nicht prüfen. Hannes ausdrücklich bitten, Animationen, Hover und Formulare **in der Vorschau** zu testen.
- **Nichts veröffentlichen** ohne sein ausdrückliches Okay. Nichts erfinden: keine Kunden, Bewertungen, Zahlen, Rollen, Preise oder Antwortzeiten.
- Mögliche parallele Arbeit beachten (andere Session oder Hannes selbst): **vor jeder Änderung neu auslesen**, Fremdänderungen nicht überschreiben und Auffälliges melden.
- Nach jedem größeren Schritt die Projekt-Notiz im Vault aktualisieren.

## Ablauf

1. **Vorbereiten:** Gedächtnis lesen (diese Notiz, Website-Standard, eigene Designrichtung, Prüfliste, Framer-Notiz). Das Briefing als Datei im Projektordner sichern und eine Projekt-Notiz im Vault anlegen.
2. **Klären, was da ist und was fehlt:** Ziel, Zielgruppe, Seiten, echte Inhalte, Fotos, Logo, Kontakt, Name im Impressum, Freigaben bei Gemeinschaftsprojekten. Lücken offen auflisten und Platzhalter sichtbar markieren.
3. **Recherche:** 3–5 starke Referenzseiten zur Branche oder zum Anspruch ansehen und ihre gemeinsamen Merkmale benennen. Danach **2–3 klar verschiedene Richtungen** vorschlagen und Hannes wählen lassen. Oder er gibt die Richtung vor („professionell“, „lebendig“, nur bestimmte Farben). Dann gilt das wörtlich.
4. **Erster Entwurf:** Zuerst die Startseite, Hero zuerst. Ob in Figma oder direkt in Framer, entscheidet Hannes. Screenshot zeigen und Feedback einholen, bevor alles andere gebaut wird.
5. **Fundament in Framer**, bevor Seiten entstehen:
   - die Pflicht-Dateien aus dem generierten `index.md` des Projekts lesen
   - Farb-Token, Textstile (Desktop, Tablet und Handy), Link-Stile
   - Komponenten: Button mit Varianten und Hover-Zustand, Navigation mit aufklappbarem Handy-Menü, alles Wiederkehrende
   - ein Layout-Template mit Navigation und Footer, alle Seiten nutzen es
6. **Seiten bauen:** Startseite, dann Unterseiten. Pro Seite erst Desktop, dann Tablet, dann Handy. Nach jeder Seite ein Screenshot, Überläufe und Umbrüche prüfen.
7. **Leben hineinbringen**, mit nativen Framer-Effekten (Text-Reveals, Appear, Hover, Loop, Shader):
   - lebendiger Hintergrund, aber **ruhiger Vordergrund** (Inhalte auf ruhigen Flächen)
   - jede Kachel sollte etwas **zeigen** statt nur zu beschreiben (Mini-Szenen, Illustrationen, echte Bilder)
   - keine zusätzlichen Farben, wenn Hannes eine Palette vorgibt
   - Persönliches wirkt am stärksten: echte Fotos, eigene Stimme, Signatur
8. **Kontakt, der wirklich funktioniert:** ein Kontaktformular mit Absende-Button samt Zuständen (Lädt, Gesendet, Fehler). E-Mail-Links (mailto) nur zusätzlich, weil sie ohne Mailprogramm ins Leere gehen. Hannes muss die Formular-Benachrichtigung selbst in Framer einschalten.
9. **Rechtliches und SEO:** Impressum und Datenschutz als „Redaktioneller Entwurf“ kennzeichnen und prüfen lassen. Der Datenschutz muss die tatsächlich genutzten Dienste nennen (Hosting, Formular, Schriften, Statistik, Mail-Anbieter). Titel, Beschreibung und noindex bis zur Freigabe, Favicon, Social-Bild, 404-Seite.
10. **Abnahme:** [[checkliste-website-grundlagen]] durchgehen und Hannes die Lückenliste geben.
11. **Veröffentlichen nur mit Okay**, danach live prüfen: Werden Schriften von Google geladen (`curl … | grep fonts.gstatic`)? Stimmt die robots-Angabe? Laufen Formular und Links?

## Technische Framer-Fallstricke (aus der Praxis)

- **Varianten:** Ein Attribut an der Primär-Variante zu setzen, überschreibt die Overrides der anderen Varianten. Danach alle Varianten prüfen.
- **Temporäre IDs** bleiben pro Session belegt. Pro Seite ein Präfix verwenden, sonst landen Inhalte in fremden Knoten.
- **Schriften:** `fontName="Geist"` in der DSL ergibt immer die Google-Fassung. Eine eigene, hochgeladene Schrift gibt es nur über Textstile. Formularfelder haben keine Textstile.
- **Textstil-Stufen:** `default` ist Desktop (ab 1200), `medium` Tablet (ab 810), `small` Handy.
- **Bilder hochladen** nur per Data-URL (`data:image/...;base64`).
- **Shader als Hintergrund:** absolut, z 0, Inhalt z 1. Nach dem Einfügen die Breite der Geschwister prüfen (einmal 107 % statt 100 %). Die Grundfläche des Layout-Templates muss deckend bleiben. Ein seitenweiter Hintergrund-Shader liegt fixed z 0 im Template, alle Abschnitte z 1.
- **space-between plus gap** wird abgelehnt. Für Abstand `start` mit `gap` nehmen.
- **E-Mail-Links** öffnen in der Framer-Vorschau nur „about:blank“.
- **Scroll-gebundene Effekte** (styleTransformEffect onScroll) liefen nicht zuverlässig. Für Wow-Effekte appearEffect oder loopEffect nehmen und live testen.
- Linter-Meldungen zu Überlappungen oder Breiten sind oft veraltete Messungen. Vor einem Umbau neu messen.
