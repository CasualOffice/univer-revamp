# [slides][p1] Slides facade API: FSlide / FPage / FElement (Gap 8)

> **Labels:** area:slides, fidelity:editable, phase:1  
> **Milestone:** Phase 1 — Editing core + visual base

## Pillar
Editable (engine core). Product Gap 8.

## Problem
The slides facade is partial compared to sheets' `FWorkbook`/`FWorksheet`. The product shell (`point`) needs a stable public API to drive edits instead of reaching into internal commands/mutations — otherwise every UI feature couples to engine internals and every fork bump risks breakage.

## Scope (engine)
- Mirror the sheet facade pattern: `FSlide` (presentation), `FPage` (slide/layout/master page), `FElement` (shape/text/image/group/table/...).
- Cover: create/read/update/delete elements + pages, transforms, z-order, styling props, text content, element clipboard (#4), alt-text/links (#18), selection.
- Incremental, upstream-eligible PRs (per product Gap 8, ~1–2 weeks).

## Acceptance criteria
- The product can perform all P1 editing operations through the facade with no direct command-id usage.

## Key files
new `packages/slides/src/facade/**` (mirror `packages/sheets/src/facade/**`).
