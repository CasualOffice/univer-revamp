# [slides][p2] Table element: model, render & edit

> **Labels:** area:slides, fidelity:visual, fidelity:editable, phase:2  
> **Milestone:** Phase 2 — Round-trip

## Pillar
Visual + Editable (required for PPTX round-trip).

## Problem
Tables are commented out in `i-slide-data.ts`. PPTX `a:tbl` is common; without tables, import is lossy.

## Scope
- Add a `table` page-element type (rows/cols, cell spans, per-cell fill/border/text, column widths/row heights).
- Render adaptor for tables.
- Basic editing: add/remove row/col, edit cell text, cell styling.
- Map to/from OOXML `a:tbl`.

## Acceptance criteria
- Tables render, are minimally editable, and round-trip through PPTX.

## Key files
`packages/slides/src/types/interfaces/i-slide-data.ts`, `packages/slides/src/views/render/adaptors/**`.
