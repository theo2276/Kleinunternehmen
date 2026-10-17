---
name: project-tischlerei-witthuhn-website
description: Übungsprojekt Neubau der Website tischlerei-witthuhn.de in Framer (Stand, IDs, offene Punkte)
metadata:
  type: project
---

Übungsprojekt (kein Auftrag), am 12.10.2026 begonnen: Neubau von tischlerei-witthuhn.de in Framer. Die alte Seite ist eine einzelne One.com-Baukastenseite ohne Leistungsbeschreibung.

**Framer-Projekt:** ID `kb2NMbytdS7wbjZcRIYb`, https://framer.com/projects/kb2NMbytdS7wbjZcRIYb. Noch nicht veröffentlicht. Die Startseite ist auf noindex gesetzt, weil der Name einer echten Firma verwendet wird.

**Gebaut:** Startseite mit Eröffnungsbild, Laufband, Einleitung, 4 Leistungen, Sicherheitsblock (LKA-Errichternachweis), Referenzen aus der CMS-Sammlung „Projekte“, Ablauf, Kontakt. Dazu Vorlage „Main“ mit Navigation (Handy-Menü zum Aufklappen) und Footer, die Seiten /impressum und /datenschutz, Breakpoints Desktop/Tablet/Phone, Seitenübergang, Metadaten und Favicon.

**Design:** Fraunces (Überschriften, mit Achsen opsz/SOFT) und Inter. Farben Papier #F2EDE4, Ink #171512, Zinnober #D4471E. Komponente „Button“ mit den Varianten Accent, Ink, Paper und Outline, jeweils mit Hover.

**Fakten nur von der alten Seite:** Ludwig Witthuhn GmbH & Co KG, GF Dipl.-Ing. Jürgen Witthuhn, Benzstraße 2a, 37083 Göttingen, Tel. 0551 71797, Fax 0551 72797, info@tischlerei-witthuhn.de, HRA 2387, HRB 699, USt-IdNr. DE 115310194, aufgenommen im Errichternachweis „Mechanische Sicherungseinrichtungen“ des LKA Niedersachsen. Projektnamen stammen aus den Bilddateinamen der alten Seite. Kein Gründungsjahr erfinden.

**Offen:** Die Bilder sind Unsplash-Platzhalter, keine echten Projektfotos. Die Datenschutzerklärung ist eine vorläufige Übernahme von der alten Seite. Unterseiten pro Leistung fehlen noch. Das Framer-KI-Guthaben war am 12.10. aufgebraucht, deshalb ging die Schriftsuche nicht; ein direkt gesetztes `fontName` funktioniert trotzdem.

**Fallstricke dieser Session:** Bei Textstil-Breakpoints heißt der größte Slot `default` (minWidth 1200), danach kommen `medium` und `small`. Ein `minWidth` auf dem jeweils kleinsten Slot wird abgelehnt. Screenshots und Messwerte gingen erst, nachdem das Projekt im Browser geöffnet war. Siehe [[framer-native-over-code]] und [[feedback-website-standard]].
