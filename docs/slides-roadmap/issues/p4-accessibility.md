# [slides][p4] Accessibility: reading order, alt-text enforcement, tagged export

> **Labels:** area:slides, fidelity:tags, phase:4  
> **Milestone:** Phase 4 — Advanced fidelity

## Pillar
Tags (accessibility).

## Problem
No accessibility story: no reading order, no alt-text enforcement, no tagged/accessible export. Required for institutional/government adoption (a key self-hosted-office market).

## Scope
- Per-slide reading order editor.
- Alt-text enforcement + an accessibility checker (flag images/shapes missing alt text, low contrast).
- Accessible PDF export (tagged PDF) building on #p2-pdf-export.
- Keyboard navigation audit of the editor itself.

## Acceptance criteria
- Accessibility checker reports issues; reading order editable; tagged PDF export available.

## Key files
slides-ui views, pdf export, `i-slide-data.ts`.
