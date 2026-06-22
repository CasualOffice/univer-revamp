# [slides][p1] Element clipboard: copy/cut/paste/duplicate as MUTATION commands

> **Labels:** area:slides, fidelity:editable, phase:1  
> **Milestone:** Phase 1 — Editing core + visual base

## Pillar
Editable (engine core). **Reframed** from the original copy/paste issue to the engine-owned part.

## Problem
There is no element-level clipboard. `duplicate-slide` already landed as a mutation on this branch, but there is no copy/cut/paste/duplicate for *elements*. The engine must provide these as proper COMMAND+MUTATION pairs so they are undoable and collab-safe; the product shell binds the shortcuts/menu.

## Scope (engine)
- `slide.command.copy/cut/paste/duplicate-element` → `SlideInsertElementMutation` / `SlideDeleteElementMutation` with fresh ids + paste offset; cross-slide aware.
- In-engine element clipboard buffer; expose via facade so the product can trigger it.
- Multi-element aware (depends on #3 multi-select).

## Out of scope (product `point`)
- OS-clipboard integration (paste image/text from the OS), keyboard-shortcut binding, and menu UI live in the product shell.

## Acceptance criteria
- Copy/cut/paste/duplicate of one or many elements works within and across slides, all undoable, all emitting mutations.

## Key files
`packages/slides-ui/src/commands/**`, `packages/slides-ui/src/commands/mutations/element.mutation.ts`.
