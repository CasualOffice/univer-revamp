# [slides][p2] PPTX export (ISlideData → OOXML)

> **Labels:** area:slides, fidelity:roundtrip, phase:2  
> **Milestone:** Phase 2 — Round-trip

## Pillar
Round-trip.

## Problem
No export path. Users must be able to hand a valid `.pptx` to PowerPoint/Google Slides.

## Scope
- OOXML writer producing a valid OPC package (presentation, slides, layouts, masters, theme, media, rels, content types).
- Serialize every modeled element type back to `prstGeom`/`p:sp`/`p:pic`/`a:tbl`/`p:grpSp` with text runs and styling.
- Re-emit preserved opaque parts from import to maximize losslessness.
- Validate output opens cleanly in PowerPoint and LibreOffice Impress.

## Acceptance criteria
- Exported files open without repair in PowerPoint + Impress; modeled content matches.

## Dependencies
#p2-pptx-import (shared OOXML mapping), #p2-roundtrip-harness.

## Key files
new `packages/slides-exchange/**`.
