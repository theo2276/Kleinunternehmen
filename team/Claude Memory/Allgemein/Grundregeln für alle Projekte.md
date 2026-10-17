# Grundregeln für alle Projekte

Diese Notiz wird in **jeder** Claude-Session geladen, egal in welchem Ordner (`~/.claude/CLAUDE.md` ist ein Symlink hierher). Hannes kann sie direkt in Obsidian bearbeiten. Seine Fassung gilt.

## Sprache

- Mit Hannes immer **Deutsch**: Zwischenmeldungen, Rückfragen, Schlusszusammenfassungen und auch das Denken.
- Am gefährlichsten sind Schlussantworten nach langen Strecken mit englischen Werkzeug-Ausgaben. Dort ist Claude mehrfach ins Englische gerutscht (24.09. und 09.10.2026: „rede deutsch bro“, „warum denkst du immer noch in Englisch“).
- Notizen für Hannes (Gedächtnis, CLAUDE.md, Doku) **auf Deutsch** schreiben. Englische Notizen ziehen die Antworten ins Englische.
- Code, Code-Kommentare und Commit-Nachrichten dürfen Englisch bleiben.

## Wer Hannes ist

- Weitere belegte persönliche Angaben, Projekte und Präferenzen: [[chatgpt-kontext-export-2026-10-11]]. Der Export ist wegen eines ChatGPT-Ladefehlers als unvollständig markiert.
- Baut seine Projekte allein mit Claude. Ist kein Programmierer, entscheidet aber und prüft die Ergebnisse.
- Kein Budget: nur kostenlose, kommerziell nutzbare Werkzeuge und Assets (CC0 zuerst), Lizenzprobleme ansprechen.
- Fachbegriffe kurz und einfach erklären. Er schreibt oft locker und per Spracheingabe.
- Ab WiSe 2026/27 studiert er Sozialwissenschaften in Göttingen.

## Website-Standard

Für alle Websites gilt: top-notch, „Next Level“, nie Durchschnitt. Maßstab ist die Awwwards-Galerie (https://www.awwwards.com/websites/). Zum Vergleich zählen nur ausgezeichnete Seiten (Site of the Day/Month/Year, Honorable Mention, Developer Award). Bei Website-Arbeit zuerst [[feedback-website-standard]] lesen, sie liegt unter `~/.claude/projects/-Users-hannes/memory/Allgemein/feedback-website-standard.md`.

Jede neue Website folgt dem festen Arbeitsweg [[workflow-website-bau]] (`~/.claude/projects/-Users-hannes/memory/Allgemein/workflow-website-bau.md`): von Briefing bis Livegang, ohne feste Designrichtung. Vor dem Livegang wird mit [[checkliste-website-grundlagen]] abgehakt.

**Framer-Tarif: immer Basic**, außer Hannes schreibt ausdrücklich etwas anderes. Jede Seite muss in Basic passen (30 Seiten, 2 CMS-Sammlungen, keine Weiterleitungen, kein Passwortschutz). Details: [[feedback-framer-basic-tarif]] (`~/.claude/projects/-Users-hannes/memory/Allgemein/feedback-framer-basic-tarif.md`).

Die Zeit für Websites wird automatisch erfasst ([[reference-website-zeiterfassung]]). Bei einem neuen Website-Projekt mit eigenem Ordner eine Zuordnungsregel in `~/bin/website-zeit.py` ergänzen.

Bei jeder Arbeit in Framer zuerst [[framer-native-over-code]] lesen (`~/.claude/projects/-Users-hannes/memory/Allgemein/framer-native-over-code.md`). Dort stehen native Effekte statt Code und viele Fallstricke der Canvas-DSL, die schon einmal Zeit gekostet haben.

## Projekte ohne eigenen Ordner

Manche Projekte laufen in wechselnden Scratch-Sessions und haben deshalb kein automatisch geladenes Gedächtnis. Wenn es um so ein Projekt geht, zuerst das Gedächtnis lesen:
- **Framer-Templates („Kernel“, Studio „Bevel“):** `~/.claude/projects/-Users-hannes/memory/Projekte/Framer Templates (Kernel)/`

Alles Neue zu diesen Projekten dort speichern, nicht im Scratch-Ordner.

Liegt etwas im Vault-Ordner `Eingang/`, hat eine Scratch-Session etwas gelernt, das noch nicht einsortiert ist. Dann Hannes anbieten, es einzusortieren. Wie das geht, steht in [[reference-obsidian-memory-vault]].

## Gedächtnis in Obsidian

Das Gedächtnis liegt im iCloud-Obsidian-Vault `Claude Memory`:

| Ordner | Inhalt | wird geladen |
| --- | --- | --- |
| `Allgemein/` | Regeln und Infos für alle Projekte (diese Notiz) | immer |
| `Projekte/<Name>/` | Gedächtnis eines Projekts, mit eigenem `MEMORY.md` | in Sessions dieses Projekts |
| Hauptordner | Gedächtnis für Sessions im Home-Ordner | in Sessions im Home-Ordner |

Regeln:
- Etwas, das für alle Projekte gilt, steht **nur** hier oder in `Allgemein/` und nicht noch einmal in den Projekten.
- Dateiname = `name:`-Slug, und zwar **eindeutig im ganzen Vault**. Sonst zeigen `[[Links]]` in Obsidian auf die falsche Notiz.
- Notizen untereinander mit `[[slug]]` verlinken.
- Was Hannes in Obsidian geändert hat, gilt und wird nicht überschrieben.
- `.obsidian/` nicht anfassen. Die Symlinks `~/.claude/projects/*/memory` nicht ersetzen.
- Neue Projekte verknüpft der SessionStart-Hook `~/bin/claude-obsidian-memory.sh` automatisch.

## Zweites Gehirn: Vault „SoWi Studium“

Bei Fragen zum Studium und zu Wissensthemen zuerst im Vault `iCloud~md~obsidian/Documents/SoWi Studium` nachschauen. Erarbeitete Ergebnisse dort als Notiz ablegen, nach `SoWi Studium/Claude Anleitung.md`. Projekte mit eigenem Ordner (Spiel, Websites) speichern ihre Ergebnisse in ihrem eigenen Repo.

## Werkzeuge

- Alte Codex-Chats weiterführen: siehe [[codex-session-import]].
