# [slides][p1] Render the full preset-shape geometry set (50+ shapes)

> **Labels:** area:slides, fidelity:visual, phase:1  
> **Milestone:** Phase 1 — Editing core + visual base

## Pillar
Visual.

## Problem
Only `Rect`, `RoundRect`, `Ellipse` render (~6% of the geometries already enumerated in `prst-geom-type.ts`). PowerPoint's `prstGeom` preset library (lines, triangles, arrows, stars, callouts, banners, etc.) is unrendered, so most real decks degrade to nothing.

## Scope
- Add a preset-geometry → path system in `engine-render` (SVG-path / parametric guides per OOXML preset).
- Extend `ShapeAdaptor` to dispatch all `BasicShapes`/`ArrowsAndMarkersShapes`/`OtherShapes`/`SpecialShapes` to the path renderer.
- Support adjustable handles (the OOXML `avLst` adjust values) where feasible.
- Shape-picker UI exposing the catalog.

## Acceptance criteria
- All enumerated preset shapes render with correct geometry, fill, and outline; insertable from the picker.

## Key files
`packages/slides/src/views/render/adaptors/shape-adaptor.ts`, `packages/slides/src/types/enum/prst-geom-type.ts`, `packages/engine-render/src/shape/**`.
