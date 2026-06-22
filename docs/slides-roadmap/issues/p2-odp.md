# [slides][p2] ODP (OpenDocument Presentation) import/export

> **Labels:** area:slides, fidelity:roundtrip, phase:2  
> **Milestone:** Phase 2 — Round-trip

## Pillar
Round-trip — the open-format pillar (parity with OnlyOffice/Collabora's native ODF support).

## Problem
No OpenDocument support. ODP is the open, ISO-standard presentation format and the natural 'open-source extension' alongside PPTX.

## Scope
- ODF package reader/writer (zip + `content.xml`, `styles.xml`, `meta.xml`, manifest).
- Map `draw:page`/`draw:frame`/`draw:custom-shape`/text/tables/images to `ISlideData` and back.
- Reuse the import/export abstractions from the PPTX work so both formats share the model mapping.

## Acceptance criteria
- `.odp` import/export works for the supported element set; files open in LibreOffice Impress; included in the round-trip harness.

## Dependencies
#p2-pptx-import / #p2-pptx-export (shared mapping layer), #p2-roundtrip-harness.

## Key files
`packages/slides-exchange/**`.
