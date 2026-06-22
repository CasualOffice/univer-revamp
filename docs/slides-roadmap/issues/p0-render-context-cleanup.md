# [slides][p0] Fix stale doc-renderer activation after disposeUnit (Gap 1.6)

> **Labels:** area:slides, fidelity:visual, phase:0  
> **Milestone:** Phase 0 — Foundation

## Pillar
Visual / stability (engine core). Product Gap 1.6.

## Problem
`packages/slides-ui/src/controllers/slide-editing.render-controller.ts` (~line 257) calls `.activate(...)` on a doc renderer that may already be disposed after `disposeUnit`, producing console noise and a black-screen risk on unit swap. Related to why the product had to abandon hot-swap and remount the whole component (Gap 1.8).

## Scope (engine)
- Guard activation against a disposed/invalid render context; use `renderContext.unit` rather than stale lookups.
- Verify clean teardown on `disposeUnit` so the product can hot-swap snapshots without a full remount.

## Acceptance criteria
- Swapping the slide unit produces no stale-renderer errors; no black screen; hot-swap path viable.

## Key files
`packages/slides-ui/src/controllers/slide-editing.render-controller.ts`.
