# [slides][p3] Presence (cursors/selection) + comments/threads

> **Labels:** area:slides, fidelity:collab, fidelity:tags, phase:3  
> **Milestone:** Phase 3 — Collaboration + self-host

## Pillar
Collab (+ Tags: comments are anchored semantic data that must round-trip).

## Problem
No presence and no comments. Real collaboration needs to show who's editing where, and review workflows need threaded comments anchored to slides/elements.

## Scope
- Presence via **Yjs awareness**: remote selection/cursor + user badges; transported over the existing Hocuspocus server.
- Comment threads anchored to a slide or element id; reuse the existing `thread-comment` packages if possible.
- Comments persist with the document and round-trip to PPTX comments where feasible.

## Acceptance criteria
- Live cursors/selection of peers; create/reply/resolve comments anchored to elements; persisted.

## Dependencies
#p3-hocuspocus-provider-contract.

## Key files
`packages/thread-comment*`, slides-ui views, awareness wiring.
