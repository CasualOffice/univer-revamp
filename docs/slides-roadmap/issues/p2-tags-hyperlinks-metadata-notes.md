# [slides][p2] Semantic tags: hyperlinks, alt text, metadata & speaker notes

> **Labels:** area:slides, fidelity:tags, phase:2  
> **Milestone:** Phase 2 — Round-trip

## Pillar
Tags (semantic structure that must round-trip).

## Problem
`ILink` exists for navigation but isn't rendered/clickable; there's no alt-text, no document metadata (title/author/created), and no speaker-notes UI even though `notesMaster` exists. All are required for a faithful and accessible PPTX/ODP round-trip.

## Scope
- Hyperlinks: model on elements + text runs, render as clickable, editable in UI, round-trip.
- Alt text/description per element (the `description`/`title` fields are currently dead metadata).
- Presentation metadata (core/app properties): title, author, company, created/modified.
- Speaker notes: per-slide notes model + a notes editing pane; round-trip to PPTX notes slides.

## Acceptance criteria
- Links clickable + editable; alt text + metadata + notes editable and preserved through round-trip.

## Key files
`packages/slides/src/types/interfaces/i-slide-data.ts`, `packages/slides-ui/src/views/**`.
