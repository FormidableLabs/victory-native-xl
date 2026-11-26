---
"victory-native": patch
---

Build line and area paths directly in a Skia `PathBuilder` instead of printing an SVG path string and parsing it back. `Line`, `Area`, `AreaRange`, `StackedArea` and their hooks build their paths several times faster and render exactly the same pixels, for every curve type. Linear lines use a single `addPoly` call on native. `Pie.SliceAngularInset` no longer serializes its path on every render or allocates a paint it does not use.
