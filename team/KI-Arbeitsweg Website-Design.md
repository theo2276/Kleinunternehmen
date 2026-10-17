# KI-Arbeitsweg für Website-Design

Für Leander, von Hannes. Stand: 17.10.2026.

So bauen wir Websites für kleine Betriebe: mit Claude als ausführender Kraft, Framer als Baukasten und einem gemeinsamen Gedächtnis in Obsidian. Wir entscheiden, prüfen und reden mit den Kunden. Die KI recherchiert, baut, prüft und dokumentiert.

---

## 1. Die Werkzeuge

| Werkzeug | Wofür | Kosten |
| --- | --- | --- |
| **Claude Code** (Desktop-App, Reiter „Code“) | Die Hauptarbeit: Inhalte auslesen, Briefing, Bauen in Framer, Code-Bauteile, Prüfen | Claude-Abo |
| **Framer** | Website-Baukasten und Hosting. Claude steuert ihn über den Framer-Agenten (`npx @framer/agent`) | **immer Basic-Tarif** (ca. 10 $/Monat pro Website) |
| **Obsidian** mit dem Vault „Claude Memory“ | Das Gedächtnis: Regeln, Arbeitsweg, Stand jedes Projekts | kostenlos |
| **Codex** (ChatGPT) | Zweite KI, parallel nutzbar, z. B. für Bildbearbeitung oder Recherche | ChatGPT-Abo |
| **GitHub** (privates Repo `Kleinunternehmen`) | Sicherung aller Projektordner, Bilder und Code-Bauteile | kostenlos |
| **Figma** (optional) | Wenn wir einen Entwurf erst zeichnen wollen | kostenlos |

Nur kostenlose oder kommerziell freie Assets: Fotos am liebsten echt vom Kunden, sonst Unsplash. Schriften von Google Fonts oder Fontshare. Lizenzfragen immer offen ansprechen.

---

## 2. Das Gedächtnis (der Vault in diesem Paket)

Claude vergisst zwischen zwei Chats alles. Deshalb schreibt es alles Wichtige in Notizen, die beim nächsten Chat automatisch geladen werden.

```
Claude Memory/
├── Allgemein/          Regeln für ALLE Projekte (immer geladen)
│   ├── Grundregeln für alle Projekte.md   ← die zentrale Notiz (= ~/.claude/CLAUDE.md)
│   ├── workflow-website-bau.md            ← der Arbeitsweg Schritt für Schritt
│   ├── feedback-website-standard.md       ← Qualitätsmaßstab (Awwwards)
│   ├── checkliste-website-grundlagen.md   ← Abnahme vor dem Livegang
│   ├── feedback-eigene-designrichtung.md  ← jede Seite bekommt ihr eigenes Design
│   ├── feedback-framer-basic-tarif.md     ← alles muss in Framer Basic passen
│   └── framer-native-over-code.md         ← Framer-Wissen und Fallstricke
├── Projekte/<Name>/    Gedächtnis je Projekt (nur in dessen Chats geladen)
└── Zeiterfassung/      automatisch erfasste Stunden pro Website
```

**Notizen-Arten:** `feedback-…` = wie wir arbeiten wollen (mit Begründung). `project-…` = Stand eines Projekts (IDs, Entscheidungen, offene Punkte). `reference-…` = wo etwas liegt.

**Einrichten auf deinem Mac:**
1. Den Ordner `Claude Memory` in Obsidian als Vault öffnen (am besten in iCloud ablegen, „Immer behalten“ einstellen).
2. Die Grundregeln für jeden Claude-Chat laden:
   `ln -s "<Pfad>/Claude Memory/Allgemein/Grundregeln für alle Projekte.md" ~/.claude/CLAUDE.md`
3. Für ein Projekt das Gedächtnis verknüpfen: `~/.claude/projects/<projekt>/memory` → `Claude Memory/Projekte/<Name>/`. Bei Hannes macht das ein kleines Skript beim Start automatisch (siehe `reference-obsidian-memory-vault.md`). Am einfachsten richten wir das einmal zusammen ein.
4. In den Grundregeln steht „Wer Hannes ist“. Den Abschnitt kannst du für dich anpassen.

Wichtig: Was ein Mensch in Obsidian ändert, gilt. Claude überschreibt das nicht.

---

## 3. Der Arbeitsweg in 11 Schritten

Kurzfassung. Die ausführliche Fassung steht in `workflow-website-bau.md`.

1. **Vorbereiten:** Neuer Ordner im Repo `Kleinunternehmen/<kunde>/`, neuer Claude-Chat darin. Claude liest zuerst das Gedächtnis.
2. **Alte Seite auslesen und Briefing schreiben:** alle Texte, Preise, Bilder, Impressum, Kontakt. Nichts wird erfunden – keine Bewertungen, Zahlen oder Preise. Lücken kommen auf eine Liste offener Fragen an den Kunden.
3. **Online recherchieren:** Was steht über den Betrieb in Verzeichnissen, Bewertungen, Webarchiv? (Bei copyteam fanden wir so die Lage „gegenüber der Bushaltestelle“ und 4,1 Sterne bei golocal.)
4. **Designreferenzen:** 3–4 starke Seiten aus der Branche (gern von Awwwards). Wichtig: **nicht nachbauen**, sondern eine eigene Idee daraus entwickeln. Keine Muster aus früheren Projekten wiederverwenden.
5. **Richtung festlegen:** 2–3 klar verschiedene Richtungen, wir wählen. Jede Seite bekommt ein eigenes Konzept mit Namen (copyteam: „Passer“ – die vier Druckfarben laufen zusammen).
6. **Fundament in Framer:** Farben, Textstile, Button, Navigation mit Handy-Menü, Layout-Vorlage mit Navigation und Footer.
7. **Seiten bauen:** Startseite zuerst, dann Unterseiten. Immer Desktop → Tablet → Handy. Nach jedem Abschnitt Screenshot prüfen.
8. **Leben hineinbringen:** Animationen, Hover, ein Wow-Moment, der zum Betrieb passt. Kein KI-Einheitslook, echtes Material zuerst.
9. **Funktionen mit echtem Nutzen:** Was spart dem Kunden Zeit oder bringt ihm Kunden? (copyteam: Preisrechner, Live-Öffnungsstatus, Abgabefahrplan.)
10. **Rechtliches und SEO:** Impressum und Datenschutz als Entwurf markieren und prüfen lassen, Titel, Beschreibung, Favicon, Vorschaubild, noindex bis zur Freigabe.
11. **Abnahme und Livegang:** Checkliste durchgehen. Veröffentlicht wird nur mit ausdrücklichem Okay.

---

## 4. Regeln, die sich bewährt haben

- **Klein arbeiten:** einen Bereich bauen, Screenshot, kurz berichten, Feedback abwarten.
- **Knappes Feedback reicht.** „Langweilig“, „unruhig“, „besser machen“ – Claude nennt dann selbst Gründe und setzt eine Lösung um.
- **Bewegung live prüfen.** Animationen, Hover und Formulare sieht man nur in der Framer-Vorschau, nicht auf Screenshots.
- **Framer Basic:** 30 Seiten, **2 CMS-Sammlungen**, 1.000 Einträge, keine Weiterleitungen, kein Passwortschutz. Vor dem Bauen festlegen, was ins CMS kommt.
- **Parallel arbeiten geht** (zwei Claude-Chats oder Claude + Codex). Vor jeder Änderung den aktuellen Stand neu auslesen, damit niemand die Arbeit des anderen überschreibt.
- **Alles sichern:** Code-Bauteile liegen als Kopie im Projektordner, das Repo regelmäßig auf GitHub hochladen.
- **Kundendaten bleiben privat.** Repo und Vault nie öffentlich machen.

---

## 5. Unser Baukasten (wiederverwendbar)

Code-Bauteile aus bisherigen Projekten, im Repo `Kleinunternehmen` gesichert:

| Bauteil | Was es kann | Ordner |
| --- | --- | --- |
| Öffnungsstatus | „Jetzt geöffnet · bis 18 Uhr“ live, Berliner Zeit, Feiertage Niedersachsen, Betriebsferien | `fotostube-hornig/`, `copyteam/` |
| Preisfinder | Preislisten interaktiv: Reiter, Menge, Staffelpreis, Gesamtpreis | `copyteam/` |
| Bindungsrechner | Kostenrechner mit Abgabeschluss je Wochentag | `copyteam/` |
| Formatskala | DIN-A-Formate maßstabsgetreu, interaktiv mit Preisen | `copyteam/` |
| Lade-Intro | Kurze Einstiegsanimation, einmal pro Besuch, abbrechbar | `copyteam/` |
| Endlospapier, Filmrolle | Dezente Hintergrundbewegung beim Scrollen | `copyteam/`, `fotostube-hornig/` |
| Bilduniversum, Leuchttisch, Zeitstrahl, Kundengalerie, Gutscheine | Galerie- und Erlebnis-Bauteile | `fotostube-hornig/` |

Nicht 1:1 übernehmen – jede Seite braucht ihr eigenes Design. Die Technik dahinter lässt sich aber anpassen (so kam der Öffnungsstatus von der FotoStube zu copyteam).

---

## 6. So startest du ein neues Projekt (Beispiel-Nachricht an Claude)

> Neues Projekt: Website-Neubau für [Betrieb], alte Seite [Link]. Lies zuerst das Gedächtnis und den Arbeitsweg. Lies die alte Seite komplett aus und schreib ein Briefing mit offenen Fragen in den Projektordner. Noch nichts in Framer bauen. Danach brauchen wir 3–4 Designreferenzen.

Danach Schritt für Schritt weiter, wie oben beschrieben.

---

## 7. Aktueller Stand (Oktober 2026)

- **copyteam** (Copyshop Göttingen): weit fortgeschritten, Inhaber will mit uns zusammenarbeiten.
- **Folgeaufträge aus copyteam:** Kreuzberg on KulTour (läuft), Musiker für Musiker, Café Kreuzberg, Kulturmarkt Südniedersachsen.
- **FotoStube Hornig:** dem Inhaber gezeigt, kam sehr gut an.
- Weitere Übungs- und Kundenprojekte: goefoto, Elektro Zühlke, Tischlerei Witthuhn, Delay Sports, Wochenmärkte.

Details zu jedem Projekt stehen in `Claude Memory/Projekte/`.
