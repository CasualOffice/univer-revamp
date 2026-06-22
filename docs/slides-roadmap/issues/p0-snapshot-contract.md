# [slides][p0] Canonical ISlideData (de)serialization contract + schema version

> **Labels:** area:slides, fidelity:roundtrip, phase:0  
> **Milestone:** Phase 0 — Foundation

## Pillar
Round-trip foundation.

## Problem
Round-trip (PPTX/ODP) and collab both need one canonical, versioned in-memory model. Today `ISlideData` has `@deprecated` fields (`spreadsheet`, `document`, `slide`) and commented-out future types (`video`, `line`, `table`, `chart`). There's no schema version and no documented (de)serialization invariant.

## Scope
- Add a `schemaVersion` to `ISlideData` and a migration shim.
- Define and document the canonical JSON snapshot: round-tripping `toSnapshot()` → `fromSnapshot()` must be lossless and stable (key order, ids).
- Remove/relocate deprecated element shapes; reserve namespaces for `table`/`chart`/`media`/`line` so later phases extend without breaking.
- Property-based test: random valid `ISlideData` survives snapshot round-trip byte-stable.

## Acceptance criteria
- `schemaVersion` present; migration covered by tests.
- Documented invariant + passing round-trip test.

## Key files
`packages/slides/src/types/interfaces/i-slide-data.ts`, `packages/slides/src/data-model/slide-data-model.ts`
