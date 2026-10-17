---
name: project-layout-workflow
description: "Verbindliche Reihenfolge für die Marktstand-Layoutvorlagen — 21st.dev zuerst, dann Figma, dann fertige Framer-Bausteine statt Eigenbau"
metadata: 
  node_type: memory
  type: project
  originSessionId: 2e5f0a84-fc9d-4c3a-8337-4ee3575cf7df
  modified: 2026-09-04T13:44:31.803Z
---

Ab 04.09.2026 gilt für alle Kundenvorlagen (Layout 2 und folgende) diese Reihenfolge,
festgehalten in `docs/workflow-layouts.md` im Wochenmärkte-Repo:

1. **Farbwelt zuerst auf 21st.dev aussuchen** — vor jedem Entwurf.
2. Design damit in Figma bauen, orientiert an vorher recherchierten Referenzwebsites.
3. **Fertige Bausteine suchen statt selbst bauen**: Framer Marketplace und
   framer.university, nur kostenlos. Referenzwebsites daraufhin ansehen, welche
   Buttons/Navigationen/Effekte sie nutzen, und genau so etwas dort suchen.
4. In Framer nativ nachbauen.
5. Auf allen Breakpoints testen.

**Why:** Bei Layout 1 lief es andersherum — erst Figma, Farben nachgezogen, Button und
Navigation von Hand gebaut. Der Nutzer will ausdrücklich fertige Komponenten nutzen
(Beispiel: ein Glass-Button aus Framer University), nicht Eigenbau.

**How to apply:** Nicht gegen einen gefundenen Baustein argumentieren, weil er
stilistisch abweicht — stattdessen lokal ins Projekt holen und anpassen. Siehe
[[project-layout-1-marktplane]] für den Stand von Layout 1.
