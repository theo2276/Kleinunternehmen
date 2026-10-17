# MusikerFürMusiker – technischer Neubau

Status: technische Basis, noch kein finales Design.

## Ziel

MusikerFürMusiker wird als eigenes Framer-Projekt neu aufgebaut. Die technische Struktur soll funktionieren, responsiv sein und Claude später maximale Freiheit für Gestaltung, Typografie, Bildsprache, Motion und Seitenkomposition lassen.

## Regeln

- Kein universelles Template. Alles in diesem Ordner gehört konkret zu MusikerFürMusiker.
- Keine Änderungen an bestehenden Live-Websites ohne ausdrückliche Freigabe.
- `main` bleibt stabil; Neubau auf Feature-Branch.
- Funktionalität und Inhalt von Styling trennen.
- Texte, Links, Farben und funktionale Optionen in Framer möglichst als Properties editierbar halten.
- Keine Backend-Annahme fest verdrahten. Formulare senden erst, wenn ein Endpunkt bewusst konfiguriert wurde.

## Aktuelle Komponenten

- `MFMNavigation.tsx` – responsive Hauptnavigation mit Mobile-Menü.
- `MFMServiceHub.tsx` – projektbezogene Einstiege in die Kernbereiche der Plattform.
- `MFMInquiryForm.tsx` – zugängliches Anfrageformular mit Validierung und optionalem POST-Endpunkt.
- `briefing.md` – technische und inhaltliche Ausgangslage.
- `CLAUDE_HANDOFF.md` – Übergabe für den späteren visuellen Entwurf.

## Noch bewusst offen

- finales Seitenlayout
- Logo-/Markenaufarbeitung
- Typografie
- Farbsystem
- Bildwelt
- Animationen/Transitions
- endgültige Seitenzahl und CMS-Struktur
- Formular-Backend / Moderationsworkflow
- Umsetzung des Schwarzen Bretts bzw. Forums
