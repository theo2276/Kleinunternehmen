---
name: reference-obsidian-memory-vault
description: Technik hinter dem Gedächtnis-Vault „Claude Memory“ in iCloud: Symlinks, SessionStart-Hook, Backups
metadata:
  type: reference
---

Der Vault liegt unter `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Claude Memory`. Aufbau und Regeln stehen in [[Grundregeln für alle Projekte]].

**Verknüpfungen (Symlinks)**
- `~/.claude/CLAUDE.md` → `Allgemein/Grundregeln für alle Projekte.md`, wird in jeder Session geladen
- `~/.claude/projects/-Users-hannes/memory` → Hauptordner des Vaults
- `~/.claude/projects/<projekt>/memory` → `Projekte/<Name>/`

**Hook:** `~/bin/claude-obsidian-memory.sh` läuft als SessionStart-Hook (`~/.claude/settings.json`). Beim ersten Start eines neuen Projekts kopiert er dessen Gedächtnis nach `Projekte/<Ordnername>/`, legt den Symlink an und lässt den alten Ordner als `memory.backup-<Zeit>` liegen. Gibt es den Namen schon für ein anderes Projekt, hängt er ein Kürzel an. Scratch-Workspaces bekommen keinen eigenen Projektordner. Ihr Gedächtnis spiegelt der Hook aber bei jedem Start nach `Eingang/scratch-<datum>-<id>/`, sobald es nicht leer ist. Einsortieren heißt: Notizen in den passenden Ordner verschieben und das Scratch-`memory` durch einen Symlink dorthin ersetzen (alter Ordner → `memory.backup-<datum>`). Danach sammelt der Hook diesen Ordner nicht mehr ein. So wurde am 11.10.2026 „Framer Templates (Kernel)“ aus `scratch-2026-09-18-526393` geholt.

**Backups**
- Ursprünglicher Stand: `~/.claude/projects/-Users-hannes/memory.backup-2026-10-09` und `memory.backup-*` in den Projektordnern
- Vor dem Umbau am 11.10.2026: `~/.claude/claude-memory-vault-backup-2026-10-11.tgz`

**iCloud:** Der Ordner muss im Finder auf „Immer behalten“ stehen. Sonst lagert macOS Dateien aus, und Claude findet nur `.icloud`-Platzhalter.
