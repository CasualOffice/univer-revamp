# [slides][p3] Bind SlideDataModel to a Yjs document (CRDT)

> **Labels:** area:slides, fidelity:collab, phase:3  
> **Milestone:** Phase 3 — Collaboration + self-host

## Pillar
Collab — transport decision: **Yjs CRDT** (synced via Hocuspocus).

## Problem
There is no shared document representation. `getRev/incrementRev` now exist (the precondition), but real-time multi-user needs a CRDT so concurrent edits merge without a central OT server.

## Scope
- Model `ISlideData` as Yjs shared types (`Y.Map`/`Y.Array`, `Y.Text` for rich text) — a `Y.Doc` binding for `SlideDataModel`.
- Apply local slide mutations to the `Y.Doc`; apply remote Yjs updates back into the model + re-render.
- Define how each mutation (insert/update/delete element & page) maps to Yjs ops so merges are intent-preserving.
- Conflict/merge tests for concurrent edits (move vs delete, two text edits, reorder vs insert).

## Acceptance criteria
- Two in-process `Y.Doc`s editing concurrently converge to the same `ISlideData`; mutations and Yjs updates are isomorphic.

## Dependencies
Depends on #p0-mutation-coverage-audit (all edits must be mutations first).

## Key files
`packages/slides/src/data-model/slide-data-model.ts`, `packages/slides-ui/src/commands/mutations/element.mutation.ts`, new collab binding module.
