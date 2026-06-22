# [slides][p1] Shape styling UI: outline, opacity, radius, gradient, shadow

> **Labels:** area:slides, fidelity:editable, fidelity:visual, phase:1  
> **Milestone:** Phase 1 — Editing core + visual base

## Pillar
Editable + Visual.

## Problem
`FillPanel.tsx` exposes only solid fill for rectangles. The data model already has `outline` (weight/dash/color) but there's no UI; no opacity, corner-radius, gradient, or shadow controls.

## Scope
- Outline panel: color, weight, dash style → maps `IOutline` + `BorderStyleTypes`.
- Opacity/transparency slider.
- Corner-radius control (model already supports `radius`).
- Gradient fill editor (linear/radial) — pairs with the visual gradient render issue.
- Shadow controls (color/blur/offset/opacity) — pairs with the visual shadow render issue.

## Acceptance criteria
- All controls produce mutation-backed, undoable updates reflected in the canvas.

## Key files
`packages/slides-ui/src/views/panels/FillPanel.tsx` (+ new panels), `commands/operations/update-element.operation.ts`.
