# [slides][p1] Group / ungroup elements

> **Labels:** area:slides, fidelity:visual, fidelity:editable, phase:1  
> **Milestone:** Phase 1 — Editing core + visual base

## Pillar
Editable + Visual (groups are a real PPTX element type, `p:grpSp`).

## Problem
No grouping. PPTX uses group shapes extensively; without a group element type, import/export will be lossy and editing nested structures is impossible.

## Scope
- Add a `group` page-element type to `ISlideData` with child elements + group transform.
- Group/ungroup commands (mutation-backed).
- Render adaptor for groups (nested transform composition) in `views/render/adaptors`.
- Selecting a group selects/moves children together; double-click to enter group.

## Acceptance criteria
- Group/ungroup works, renders with correct nested transforms, and round-trips through the snapshot.

## Key files
`packages/slides/src/types/interfaces/i-slide-data.ts`, `packages/slides/src/views/render/adaptors/**`, `packages/slides-ui/src/commands/**`.
