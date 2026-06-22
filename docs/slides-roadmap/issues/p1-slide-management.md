# [slides][p1] Slide reorder + slide background styling

> **Labels:** area:slides, fidelity:editable, phase:1  
> **Milestone:** Phase 1 — Editing core + visual base

## Pillar
Editable.

## Problem
The branch adds add/duplicate/delete slide, but there's no reorder (drag in the slide bar) and no per-slide background styling (solid/gradient/picture).

## Scope
- Drag-to-reorder in `SlideBar.tsx`, mutation-backed.
- Slide background fill (solid/gradient/picture) using the fill model from the gradient issue.
- 'Apply to all slides' option.

## Acceptance criteria
- Reordering and background changes are undoable and reflected in thumbnails + canvas.

## Key files
`packages/slides-ui/src/views/slide-bar/SlideBar.tsx`, `commands/mutations/element.mutation.ts` (page mutations).
