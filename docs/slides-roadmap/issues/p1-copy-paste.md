# [slides][p1] Copy / cut / paste / duplicate elements

> **Labels:** area:slides, fidelity:editable, phase:1  
> **Milestone:** Phase 1 — Editing core + visual base

## Pillar
Editable.

## Problem
No clipboard support at all — no copy, cut, paste, or duplicate-element (only duplicate-slide exists on the branch). This is table-stakes for an editor.

## Scope
- Intra-app clipboard (in-memory) for element(s), incl. cross-slide paste with new ids + offset.
- System clipboard integration: paste image/text from OS; copy rendered selection as image.
- `Ctrl/Cmd+C/X/V/D` shortcuts.
- All paste/duplicate flows go through insert mutations (undoable, collab-ready).

## Acceptance criteria
- Copy/cut/paste/duplicate work within and across slides; pasted elements get fresh ids; undoable.

## Key files
`packages/slides-ui/src/commands/**`, clipboard service, `controllers/shortcuts/**`.
