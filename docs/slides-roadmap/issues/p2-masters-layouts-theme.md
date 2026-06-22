# [slides][p2] Slide masters, layouts, placeholders & theme color resolution

> **Labels:** area:slides, fidelity:visual, fidelity:tags, phase:2  
> **Milestone:** Phase 2 — Round-trip

## Pillar
Visual + Tags.

## Problem
`IReferenceSource` already carries `master`, `layouts`, `notesMaster`, `handoutMaster` and elements carry a `placeholder` field — but none of it is rendered or resolved. Theme colors (`IColorStyle.th`) aren't resolved either. Without this, PPTX import is hollow (most deck content lives on layouts/masters).

## Scope
- Render pipeline resolves placeholder inheritance: element → layout placeholder → master placeholder.
- Resolve theme color references to concrete RGB via the presentation theme.
- Master/layout editing surface (at least selection of a layout per slide).

## Acceptance criteria
- Slides inherit text/shape defaults from layout+master; theme colors resolve; switching layout updates the slide.

## Key files
`packages/slides/src/types/interfaces/i-slide-data.ts`, `packages/slides/src/views/render/**`.
