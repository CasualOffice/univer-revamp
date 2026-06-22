# [slides][p1] Rich-text formatting toolbar for text frames

> **Labels:** area:slides, fidelity:editable, phase:1  
> **Milestone:** Phase 1 — Editing core + visual base

## Pillar
Editable.

## Problem
Text formatting is hard-coded at insert time (`fs`, `cl`, `bl`). No UI for font family, size, B/I/U/strike, color/highlight, bullets/numbering, alignment, line/character spacing, sub/superscript.

## Scope
- Reuse the docs engine that already backs in-place text editing (`slide-editing.render-controller.ts`) and expose a formatting toolbar/sidebar bound to the text selection.
- Wire each control to docs text mutations so formatting is undoable and (later) collab-safe.
- Bullets/numbering + paragraph alignment + spacing.

## Acceptance criteria
- Selecting text in a frame and applying any of the above formats updates the render and is undoable.

## Key files
`packages/slides-ui/src/controllers/slide-editing.render-controller.ts`, `packages/slides-ui/src/views/**`, `packages/docs*`.
