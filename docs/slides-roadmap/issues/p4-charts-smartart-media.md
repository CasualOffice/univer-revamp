# [slides][p4] Charts, SmartArt & embedded media

> **Labels:** area:slides, fidelity:visual, phase:4  
> **Milestone:** Phase 4 — Advanced fidelity

## Pillar
Visual.

## Problem
Charts and video are commented-out future types; SmartArt is unsupported. These are common in real decks and currently lost on import.

## Scope
- Charts: at minimum preserve the chart part on round-trip; ideally render natively (could leverage Univer sheets/chart infra) and allow data edit.
- SmartArt (`dgm:` diagrams): preserve on round-trip; render the cached drawing.
- Embedded media (video/audio): model + render placeholder + playback in slideshow.

## Acceptance criteria
- Charts/SmartArt/media survive round-trip; charts render; media plays in slideshow.

## Key files
`packages/slides/src/types/interfaces/i-slide-data.ts`, exchange package, render adaptors.
