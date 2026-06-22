# [slides][p4] Animations & slide transitions: model, author UI, playback, round-trip

> **Labels:** area:slides, fidelity:visual, fidelity:editable, fidelity:roundtrip, phase:4  
> **Milestone:** Phase 4 — Advanced fidelity

## Pillar
Visual + Editable + Round-trip.

## Problem
No animations or transitions are modeled. PowerPoint decks rely heavily on entrance/emphasis/exit effects and slide transitions; today they're dropped entirely.

## Scope
- Animation/transition data model (timing tree akin to OOXML `p:timing`).
- Authoring UI (animation pane: add/order/trigger/duration).
- Playback engine in slideshow mode.
- Import/export mapping to OOXML timing (and ODP equivalents) — at minimum preserve on round-trip.

## Acceptance criteria
- Can add/preview basic animations + transitions; they play in slideshow mode and survive round-trip (at least preserved).

## Key files
new animation model in `packages/slides`, slideshow controller, exchange mapping.
