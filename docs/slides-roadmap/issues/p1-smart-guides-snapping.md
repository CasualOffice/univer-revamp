# [slides][p1] Canvas smart-guides + snapping during drag/resize (engine-render)

> **Labels:** area:slides, fidelity:editable, phase:1  
> **Milestone:** Phase 1 — Editing core + visual base

## Pillar
Editable + Canvas rendering (engine core). **Reframed** from the original align/distribute issue.

## Problem
There are no alignment guides or snapping while dragging/resizing elements — precise layout is guesswork. The *guides + snapping* are a canvas-rendering concern that must live in `engine-render`/`slides-ui`; the align/distribute *buttons* are product UI that just set transforms via the facade.

## Scope (engine)
- Smart guides: detect + draw alignment lines to other elements' edges/centers and to slide center/edges during drag/resize.
- Snapping: snap transform to those guides within a threshold; modifier key to bypass.
- Optional grid + snap-to-grid.

## Out of scope (product `point`)
- Align/distribute toolbar buttons (call `FElement` transforms via the facade).

## Acceptance criteria
- Dragging an element shows guides and snaps to neighbors/slide; mutation-backed final position.

## Key files
`packages/engine-render/src/scene.input-manager.ts`, slides-ui render controllers.
