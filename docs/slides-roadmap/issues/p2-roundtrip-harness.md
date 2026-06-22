# [slides][p2] Round-trip fidelity test harness

> **Labels:** area:slides, fidelity:roundtrip, phase:2  
> **Milestone:** Phase 2 — Round-trip

## Pillar
Round-trip.

## Problem
Fidelity claims are meaningless without measurement. We need automated regression on import→export→re-import.

## Scope
- Test corpus of representative `.pptx` (and later `.odp`) files (text-heavy, shape-heavy, image/table/master-heavy).
- Harness: import → snapshot A → export → re-import → snapshot B; assert semantic equality (normalized), report a fidelity score + diff.
- Optional pixel-diff of rendered first slide.
- Wire into CI as a gating check with a tracked fidelity metric.

## Acceptance criteria
- Harness runs in CI, produces a fidelity score, and fails on regressions.

## Key files
new `packages/slides-exchange/__tests__/**`, fixtures.
