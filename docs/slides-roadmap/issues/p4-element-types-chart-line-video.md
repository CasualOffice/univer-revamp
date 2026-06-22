# [slides][p4] Element-type data model + render: chart, line/connector, video (Gap 3)

> **Labels:** area:slides, fidelity:visual, phase:4  
> **Milestone:** Phase 4 — Advanced fidelity

## Pillar
Visual (engine core). **Reframed** to the engine data-model + render part of product Gap 3. (Group = #5, table = #17 cover the rest of Gap 3.)

## Problem
`PageElementType` is missing `LINE`, `CHART`, `VIDEO` — they're commented out in `i-slide-data.ts`. Without these element types in the engine, PPTX round-trip drops connectors/charts/media (blocks T3 fidelity), and the product can't render or preserve them.

## Scope (engine)
- Add `LINE` (connector endpoints + routing), `CHART` (at minimum a preserve-and-render element backed by a cached drawing; ideally leverage Univer sheets/chart infra), and `VIDEO` (poster + media ref) to `PageElementType`.
- Render adaptors for each in `views/render/adaptors`.
- Suggested order from product plan: lines (~1wk) → charts (~2wk) → video (~1wk).

## Out of scope (product `point`)
- SmartArt / chart-data editing UX and raw-OOXML passthrough live in the product I/O layer.

## Acceptance criteria
- The three element types are modeled, render on canvas, and survive snapshot round-trip.

## Key files
`packages/slides/src/types/interfaces/i-slide-data.ts`, `packages/slides/src/types/enum/**`, `packages/slides/src/views/render/adaptors/**`.
