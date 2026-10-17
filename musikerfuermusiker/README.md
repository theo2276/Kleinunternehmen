# MusikerFürMusiker – technischer Neubau

Status: native Framer-Struktur im unveröffentlichten Projekt aufgebaut; noch kein finales Design.

Framer-Projekt: https://framer.com/projects/MusikerF-rMusiker--Oqs6vlqumpMTjpEtJI2w-9UllU

Die Startseite enthält Navigation, Einstieg, vier Vermittlungsbereiche, Schwarzes Brett, Über uns und Kontakt/Anfrage. Desktop (1200 px), Tablet (810 px) und Handy (390 px) sind im Canvas angelegt. Impressum und Datenschutz sind ausdrücklich redaktionelle Entwürfe. Das Formular ist als einzige Code-Komponente im Canvas eingebunden; ohne konfigurierten POST-Endpunkt verschickt es keine Daten.

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

- finale Seitenkomposition und visuelle Gestaltung
- Logo-/Markenaufarbeitung
- Typografie
- Farbsystem
- Bildwelt
- Animationen/Transitions
- endgültige Seitenzahl und CMS-Struktur; das Schwarze Brett hat derzeit keine öffentlichen Einträge
- Formular-Backend / Moderationsworkflow
- Umsetzung des Schwarzen Bretts bzw. Forums
