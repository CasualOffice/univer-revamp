# [slides][p2] Hyperlink rendering + element semantic fields (alt-text / description)

> **Labels:** area:slides, fidelity:tags, phase:2  
> **Milestone:** Phase 2 — Round-trip

## Pillar
Tags (engine core). **Reframed** — the product owns speaker-notes UI and presentation metadata; the engine owns the *renderable/structural* semantics.

## Problem
`ILink` exists for navigation but isn't rendered/clickable, and the per-element `description`/`title` fields (alt text) are dead metadata — never populated or surfaced. Both must round-trip and both are needed for accessibility.

## Scope (engine)
- Render `ILink` on elements + text runs as clickable (internal slide nav + external URLs).
- Treat element `description`/`title` as first-class alt-text in the model; expose via facade so the product can edit and so PPTX import/export can map them.

## Out of scope (product `point`)
- Speaker-notes editing pane (Gap 5), presentation core/app metadata (Gap 7 I/O), a11y checker UI (Gap 26-equivalent).

## Acceptance criteria
- Links are clickable in the canvas; alt-text fields are read/writable via facade and survive snapshot round-trip.

## Key files
`packages/slides/src/types/interfaces/i-slide-data.ts`, render adaptors, facade.
