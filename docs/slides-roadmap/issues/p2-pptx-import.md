# [slides][p2] PPTX import (OOXML → ISlideData)

> **Labels:** area:slides, fidelity:roundtrip, phase:2  
> **Milestone:** Phase 2 — Round-trip

## Pillar
Round-trip — the headline feature vs OnlyOffice/Collabora.

## Problem
No PPTX import exists anywhere in the repo. This is the single most important capability for a PowerPoint alternative.

## Scope
- New package (e.g. `@univerjs/slides-exchange`) with a zip reader (JSZip/fflate) for the OPC/OOXML container.
- Parse `ppt/presentation.xml`, slides, slide layouts & masters, theme (`theme1.xml`), and relationships.
- Map to `ISlideData`: shapes (`p:sp` + `prstGeom`), text bodies/runs/paragraph props, pictures + media, group shapes, tables (`a:tbl`), connectors, placeholders, hyperlinks.
- Preserve unknown/unsupported parts as opaque blobs for lossless export.

## Acceptance criteria
- A corpus of real `.pptx` files imports without throwing; supported elements render; unsupported parts preserved.

## Dependencies
Needs: masters/layouts/theme (#p2-masters-layouts-theme), tables (#p2-tables), group (#p1-group-ungroup), shape geometry (#p1-shape-geometry), hyperlinks/metadata (#p2-tags-hyperlinks-metadata-notes).

## Key files
new `packages/slides-exchange/**`, `packages/slides/src/types/interfaces/i-slide-data.ts`.
