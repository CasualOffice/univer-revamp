# [slides][p0] Close edit paths that bypass the mutation layer

> **Labels:** area:slides, fidelity:editable, fidelity:collab, phase:0  
> **Milestone:** Phase 0 — Foundation

## Pillar
Editable / Collab foundation.

## Problem
The `slide/element-mutations` branch routed insert/update/delete element and page edits through `CommandType.MUTATION`, which is the precondition for undo/redo and (later) Yjs sync. But some edit paths still execute as plain `CommandType.OPERATION` and never touch the persisted snapshot:
- `commands/operations/text-edit.operation.ts` — `SetTextEditArrowOperation` is a no-op stub (`handler: () => true`).
- `commands/operations/set-thumb.operation.ts` — thumbnail writes.
- In-place text editing in `controllers/slide-editing.render-controller.ts` — verify the doc text changes land as slide mutations, not transient editor state.

## Scope
- Inventory every command/operation under `packages/slides-ui/src/commands` and classify: mutates persisted `ISlideData`? → must be (or be wrapped by) a `MUTATION`.
- Convert or wrap the offenders; ensure each has an inverse mutation for undo/redo.
- Add a unit test asserting that executing each user-facing edit produces a mutation observable via `ICommandService` mutation hooks.

## Acceptance criteria
- No persisted-state edit runs purely as `OPERATION`.
- Undo/redo covers text edits and thumbnail changes.
- Test proves mutations are emitted for every edit type.

## Key files
`packages/slides-ui/src/commands/**`, `packages/slides-ui/src/controllers/slide-editing.render-controller.ts`, `packages/slides/src/data-model/slide-data-model.ts`
