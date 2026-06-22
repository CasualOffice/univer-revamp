# [slides][p2] PDF export

> **Labels:** area:slides, fidelity:roundtrip, phase:2  
> **Milestone:** Phase 2 — Round-trip

## Pillar
Round-trip (export-only; user: 'pdf only if possible').

## Problem
No PDF export. Needed for sharing/printing read-only decks.

## Scope
- Render each slide page to PDF — prefer vector output (shapes/text/lines as PDF primitives) for crisp, small files; rasterize only what must be (filters, complex fills).
- One page per slide; embedded fonts; correct page size/orientation.
- Library options: `pdf-lib` or `jsPDF` (+ `svg2pdf`) — evaluate vector fidelity vs bundle size.
- Optionally include speaker notes / handout layouts as an export option.

## Acceptance criteria
- Export produces a valid multi-page PDF whose pages visually match the rendered slides.

## Key files
`packages/slides-exchange/**` (or a dedicated `slides-export-pdf`), `packages/engine-render`.
