# [slides][p1] Wire image brightness/contrast/transparency/crop to the renderer

> **Labels:** area:slides, fidelity:visual, phase:1  
> **Milestone:** Phase 1 — Editing core + visual base

## Pillar
Visual.

## Problem
`IImageProperties` models `brightness`, `contrast`, `transparency`, and `cropProperties`, but `ImageAdaptor` never passes them to the `Image` engine object — they're silently dropped, so imported images lose adjustments/crop.

## Scope
- Apply brightness/contrast/transparency as canvas filters in the image render path.
- Implement crop (offsetLeft/Right/Top/Bottom + angle) in the adaptor.
- Add minimal crop UI in the image popup menu.

## Acceptance criteria
- Adjustments and crop render correctly and survive snapshot round-trip.

## Key files
`packages/slides/src/views/render/adaptors/image-adaptor.ts`, `packages/core/src/types/interfaces/i-image-properties.ts`, `packages/slides-ui/src/views/image-popup-menu/**`.
