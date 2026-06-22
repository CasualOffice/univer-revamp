# [slides][p1] Gradient / pattern / picture fills + shadow & effect rendering

> **Labels:** area:slides, fidelity:visual, phase:1  
> **Milestone:** Phase 1 — Editing core + visual base

## Pillar
Visual.

## Problem
`IColorStyle` is solid-RGB-or-theme only. No gradient, pattern, or picture fills. Shape shadows exist in `engine-render` but the slide adaptor never passes them. No reflection/glow/soft-edge.

## Scope
- Extend the fill model to a discriminated union: solid | gradient (linear/radial w/ stops) | pattern | picture.
- Map gradient/pattern/picture fills to `engine-render` paint.
- Pass shadow props (`shadowColor/Blur/Offset/Opacity`) from `IShapeProperties` through the adaptor.
- Convert `IOutline.dashStyle` → `strokeDashArray`.

## Acceptance criteria
- Gradient/picture fills and shadows render; dash styles render; covered by visual/snapshot tests.

## Key files
`packages/core/src/types/interfaces/i-color-style.ts`, `packages/slides/src/views/render/adaptors/shape-adaptor.ts`, `packages/engine-render/src/shape/**`.
