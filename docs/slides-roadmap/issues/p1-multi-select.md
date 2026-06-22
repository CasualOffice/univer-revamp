# [slides][p1] Multi-select + marquee selection of page elements

> **Labels:** area:slides, fidelity:editable, phase:1  
> **Milestone:** Phase 1 — Editing core + visual base

## Pillar
Editable.

## Problem
Only a single element can be selected. Every higher-order editing feature (group, align, distribute, batch style, multi-delete, multi-move) depends on multi-select, which does not exist.

## Scope
- Selection model holding N elements; shift/ctrl-click additive selection.
- Marquee (drag-rectangle) selection on the page scene.
- Combined bounding box + group transform handles for the selection.
- Wire delete/move/resize to operate over the whole selection via batched mutations.

## Acceptance criteria
- Can select multiple elements, see a unified transform box, move/resize/delete them as one undoable action.

## Key files
`packages/slides-ui/src/controllers/**`, `packages/engine-render/src/scene.input-manager.ts`, selection services.
