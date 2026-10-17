---
name: codex-session-import
description: Codex-Chats lassen sich mit ~/bin/codex-export.py als Markdown exportieren und hier weiterführen
metadata:
  type: reference
---

Codex speichert jeden Chat als JSONL unter `~/.codex/sessions/JAHR/MM/TT/rollout-*.jsonl`.
Das Skript `~/bin/codex-export.py` listet die Sessions (`codex-export.py`) und exportiert
eine davon als lesbares Markdown (`codex-export.py <nr|pfad>`), gefiltert auf User- und
Assistant-Nachrichten.

**How to apply:** Wenn Hannes einen in Codex begonnenen Chat hier weiterführen will,
mit diesem Skript exportieren und das Markdown einlesen.
