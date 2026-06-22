# [slides][p1] Align, distribute, smart guides & snapping

> **Labels:** area:slides, fidelity:editable, phase:1  
> **Milestone:** Phase 1 — Editing core + visual base

## Pillar
Editable.

## Problem
No alignment tools, no distribute, no snap-to-guide. Precise layout is impossible today.

## Scope
- Align left/center/right/top/middle/bottom (to selection or to slide).
- Distribute horizontal/vertical spacing.
- Smart alignment guides + snapping during drag/resize (to other elements, slide center/edges).
- Optional grid + snap-to-grid toggle.

## Acceptance criteria
- Alignment/distribution actions are mutation-backed and undoable; guides appear during drag.

## Key files
`packages/slides-ui/src/views/panels/**`, transform controllers, `engine-render` input manager.
