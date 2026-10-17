---
name: reference-website-zeiterfassung
description: "Hannes' Stunden für Websites werden automatisch aus den Claude-Verläufen erfasst; Notiz „Zeiterfassung/Website-Zeiten“ im Vault"
metadata:
  node_type: memory
  type: reference
  originSessionId: ad56b305-d432-4ba6-8f55-660557ec0d5c
  modified: 2026-10-16T09:49:07.377Z
---

Seit 16.10.2026 erfasst `~/bin/website-zeit.py` die Zeit, die Hannes in Websites steckt. Er wollte wissen, wie viele Stunden er dafür aufwendet.

- Quelle sind alle Claude-Verläufe in `~/.claude/projects/*/*.jsonl`. Gezählt wird die aktive Zeit: Ab 15 Minuten ohne Nachricht beginnt eine Pause, und parallele Sessions werden nicht doppelt gezählt.
- Das Ergebnis steht in der Vault-Notiz `Zeiterfassung/Website-Zeiten.md` (Gesamt, nach Projekt, Woche und Session). Sie wird bei jedem Start und Ende einer Session neu geschrieben (Hooks in `~/.claude/settings.json`).
- Zeit ohne Claude (direkt in Framer oder Figma) trägt Hannes in `Zeiterfassung/Manuelle Zeiten.md` ein. Format: `- 2026-10-15 | Projekt | 1,5 | Notiz`.
- Zuordnung zu Projekten: Liste `RULES` im Skript (Ordner, Arbeitsordner oder Titel → Projekt). Sessions ohne Regel zählen als „Sonstige Website-Arbeit“, wenn sie oft Framer erwähnen.

**Wie anwenden:** Kommt ein neues Website-Projekt mit eigenem Ordner dazu, eine Regel in `RULES` ergänzen. Fragt Hannes nach seinen Stunden, das Skript ausführen und die Notiz lesen. Die Zahlen messen Zeit mit Claude und nicht, ob Hannes am Rechner saß. Das bei Bedarf dazusagen.
