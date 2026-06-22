# Univer Slides → Open-Source PowerPoint Alternative — Fidelity Roadmap

**Goal:** Build a free, **Apache-2.0**, self-hosted presentation editor competitive with
**OnlyOffice** and **Collabora Online**, on top of the Univer slides engine. No license
fees, no SaaS lock-in, full document fidelity with Microsoft PowerPoint (`.pptx`) and the
open ODF format (`.odp`), plus PDF export.

> Working branch: `slides/fidelity-roadmap` (forked from `slide/element-mutations`, which
> introduces the mutation/undo-redo/rev-tracking foundation we build on).

> **Scope of THIS repo — the core engine.** This repository ships the engine packages
> (`@univerjs/slides`, `@univerjs/slides-ui`, `@univerjs/engine-render`, …). The product and
> the collab server already exist as separate repos — see the topology below.

## System topology (who owns what)

Three repos under `services/`:

| Repo | What it is | Consumes |
|------|------------|----------|
| **`univer-revamp`** (this) | The **engine fork**. Ships `@univerjs/*` v0.24.0; product pulls it via **pnpm patches** authored here. | — |
| **`point`** (`casual-slides`) | The **product app**: React+Vite Office-style editor. Owns the UI shell, **PPTX import/export** (JSZip+fast-xml-parser / PptxGenJS), **PDF export** (jsPDF), and the Yjs bridge. | `@univerjs/*` (patched) |
| **`collab`** (`@casualoffice/collab`) | The **real collab server**: **Hocuspocus + Yjs**, JWT auth, Redis/S3/Postgres persistence, WOPI. Format-agnostic. Connect at `ws://<host>:3000/yjs?room=<id>`. | (product-agnostic) |

**Fork→product flow:** engine fixes are authored on a branch here, then `pnpm patch`'d into
`point/patches/` so production ships without waiting for upstream Univer. Patches already in
prod: `@univerjs__slides`, `@univerjs__slides-ui`, `@univerjs__engine-render`, `@univerjs__core`.

**This roadmap therefore splits each gap into `[engine]` (work lands here) vs `[product]`
(work lands in `point`/`collab`).** The product has its own phase plan (`point/PLAN.md`,
`point/docs/UNIVER_SLIDES_GAPS.md`) — this roadmap reconciles with it (Gap mapping below) and
does **not** duplicate product-owned work.

---

## Why this matters — the competitive landscape

| Product            | License            | Self-host | PPTX round-trip | ODP | Our gap to close |
|--------------------|--------------------|-----------|-----------------|-----|------------------|
| MS PowerPoint      | Proprietary        | No        | Native          | —   | reference target |
| Google Slides      | Proprietary / SaaS | No        | Lossy           | Lossy | reference target |
| OnlyOffice         | AGPL / commercial  | Yes       | High            | Yes | **AGPL** — not permissive |
| Collabora Online   | MPL / commercial   | Yes       | High            | Yes | heavy LibreOffice core |
| **Univer Slides**  | **Apache-2.0**     | Yes       | **none yet**    | none | this roadmap |

Our differentiator: a **permissive (Apache-2.0)** license + a lightweight, embeddable,
TypeScript/canvas engine — but today the slides module is an MVP. This roadmap closes the
fidelity gap.

---

## The five fidelity pillars

We track every gap under one of five pillars (these are the GitHub labels too):

1. **`fidelity:visual`** — what the user *sees*. Shape geometry, gradients, shadows, theme
   colors, masters/layouts, text frames, tables, charts, media.
2. **`fidelity:editable`** — what the user can *change*. Rich text, shape styling UI,
   align/distribute, group, multi-select, copy/paste, undo/redo, slide management, notes,
   animation authoring.
3. **`fidelity:tags`** — the *semantic structure* that must survive: placeholders, alt
   text/accessibility, hyperlinks, comments, document metadata, speaker notes anchoring.
4. **`fidelity:roundtrip`** — **import/export without loss**: `.pptx` (OOXML), `.odp`
   (OpenDocument), and **PDF export**. This is the headline feature vs. OnlyOffice/Collabora.
5. **`fidelity:collab`** — real-time multi-user: mutation-based architecture, **Yjs CRDT
   synced through a self-hosted [Hocuspocus](https://tiptap.dev/docs/hocuspocus) server**,
   presence, comments. (Decision: CRDT/Yjs + Hocuspocus, **not** OT.)

---

## Current state (audit summary)

Audited on the `slide/element-mutations` branch.

### Visual (`fidelity:visual`)
- **Shapes:** only `Rect`, `RoundRect`, `Ellipse` render (~6% of the 50+ preset geometries
  already enumerated in `prst-geom-type.ts`). No line/connector/arrow/star/callout shapes.
- **Fills:** solid color only. **No gradients, pattern, or picture fills.**
- **Effects:** **no shadows, no 3D, no reflections** (engine-render *supports* shadow props;
  the slide adaptor never passes them).
- **Images:** brightness/contrast/transparency/crop are **modeled but not rendered**.
- **Masters/layouts:** data structures (`master`, `layouts`, `notesMaster`) exist but are
  **never rendered**; no placeholder inheritance. Theme colors not resolved.
- **Tables / charts / video:** commented-out as future work in `i-slide-data.ts`.

### Editable (`fidelity:editable`)
- Insert text/shape/image, move/resize/rotate, z-order, add slide — exist.
- Branch adds: **mutation layer**, **undo/redo**, duplicate/delete slide, rev tracking.
- Missing: rich-text formatting UI, shape styling beyond fill, **align/distribute**,
  **grouping**, **multi-select**, **copy/paste**, slide reorder, layout/master editing,
  speaker-notes UI, animation authoring.

### Tags / semantic (`fidelity:tags`)
- Placeholder field exists but is ignored. No alt-text UI, no accessibility tags, no
  hyperlink rendering, no comment anchoring, no metadata model. All of these are required
  for a lossless `.pptx`/`.odp` round trip.

### Round-trip (`fidelity:roundtrip`)
- **Not greenfield — lives in the product.** `point` already ships **PPTX import** (a ~232 KB
  OOXML parser, JSZip + fast-xml-parser), **PPTX export** (PptxGenJS), and **PDF export**
  (jsPDF), all in a web worker, at **"T1/core" fidelity** (text frames, basic shapes, images,
  transforms, order, page size, theme colors; ≥95% T1 round-trip target).
- **Deferred (T2–T5):** masters/layouts/placeholders, then tables/charts/lines/hyperlinks,
  then animations/transitions, then raw-OOXML passthrough. The T3+ tiers are **blocked on
  engine data-model work** (Gap 3 element types) — that's where this repo contributes.
- **ODP: still greenfield** everywhere — not started in any repo.

### Collaboration (`fidelity:collab`)
- `getRev()` was a stub returning `0`; the branch now increments rev on mutations — the
  *precondition* for collab. **`[engine]`**
- The **`collab` repo already provides a production Hocuspocus + Yjs server** (auth,
  persistence, WOPI). The product `point` currently has only a *stopgap* JSON
  last-writer-wins relay (`apps/server`, gated by `VITE_COLLAB_ENABLED`) — **not** Yjs yet.
- The migration to real CRDT = a **Yjs bridge in the product** that mirrors `ISlideData` into
  a `Y.Doc` and connects to the existing collab server. **`[product]`** The engine's only job
  is to make every edit a `MUTATION` (Gap 2) so `onMutationExecutedForCollab` fires. **`[engine]`**

## Reconciliation with the product plan (`point/docs/UNIVER_SLIDES_GAPS.md`)

| Product Gap | Owner | This roadmap | Status |
|-------------|-------|--------------|--------|
| Gap 1 — rev tracking | `[engine]` | Phase 0 | ✅ done (`slide/rev-tracking`) |
| Gap 1.5 — render-context unit fix | `[engine]` | — | ✅ done |
| Gap 1.6 — stale doc-renderer cleanup | `[engine]` | Phase 0 (added) | ⏳ pending |
| Gap 2 — element ops as MUTATION | `[engine]` | Phase 0 (#p0-mutation-coverage-audit) | 🔄 on this branch; text-edit envelope open |
| Gap 3 — element types (table/chart/line/video) | `[engine]` | Phase 1 group + Phase 2 tables + Phase 4 charts/media | ⏳ pending |
| Gap 4 — animations/transitions | `[product]` (resources slot) | Phase 4 (reframe to product) | ⏳ pending |
| Gap 5 — speaker-notes UI | `[product]` | Phase 2 tags (reframe) | ⏳ pending |
| Gap 6 — master/layout editor UI | `[product]`; engine render = #p2-masters-layouts-theme | Phase 2 | ⏳ pending |
| Gap 7 — PPTX I/O | `[product]` | Phase 2 (mark DONE@T1; deepen) | ✅ T1 done |
| Gap 8 — slides facade API (FSlide/FPage/FElement) | `[engine]` | Phase 1 (**added**) | ⏳ pending |
| Gap 9 — slide-editing controller coupling | `[engine]` | deferred | ⏳ defer |
| Gap 10 — theme picker UI | `[product]` | Phase 2 | ⏳ pending |

**Net:** the genuinely **engine-owned** pillars are *visual rendering* (shape geometry, fills,
effects, image adjust, master/theme resolution), *editable-as-MUTATION* plumbing, the
*facade API*, and the *element-type data model* (groups, tables, charts, lines, video). Most
*editing UI*, all *round-trip I/O*, *animation modeling*, *presence*, and the *server* are
**product-owned** and tracked in `point`.

---

## Phase plan (engine-only)

This repo's core is **fidelity, editability, round-trip, and canvas rendering**. Each phase
is a GitHub milestone; only **engine-owned** work is tracked as issues here (15 open).
Product-owned items are listed as `→ point` for context but live in the product's `PLAN.md`.

### Phase 0 — Foundation
Make every edit a real, collab-ready, undoable mutation; stabilize the render context.
- ✅ Mutation refactor for element/page edits — *done on this branch*.
- ✅ Real `getRev`/`incrementRev` on `SlideDataModel` — *done* (Gap 1).
- **#1** Close edit paths still bypassing the mutation layer (text-edit envelope, thumb) — Gap 2.
- **#2** Canonical `ISlideData` snapshot contract + schema version (round-trip foundation).
- **#28** Fix stale doc-renderer activation after `disposeUnit` — Gap 1.6.

### Phase 1 — Editing core + canvas rendering
- **#3** Multi-select + marquee (engine selection model + transform handles).
- **#4** Element clipboard: copy/cut/paste/duplicate as MUTATION commands.
- **#5** Group / ungroup (group element type + nested-transform render) — Gap 3.
- **#6** Canvas smart-guides + snapping during drag/resize (engine-render).
- **#9** Full preset-shape geometry render (the 50+ enumerated shapes).
- **#10** Gradient / pattern / picture fills + shadow & effect rendering.
- **#11** Wire image brightness/contrast/transparency/crop to the renderer.
- **#27** Slides facade API (`FSlide`/`FPage`/`FElement`) — Gap 8; the surface the product UI calls.
- `→ point`: rich-text toolbar, shape-styling panel, align/distribute buttons, slide-rail reorder.

### Phase 2 — Round-trip enablers (data-model fidelity)
Round-trip *I/O* lives in `point` (PPTX/PDF done @T1). The engine raises the fidelity ceiling:
- **#16** Slide masters, layouts, placeholders & theme-color resolution (unblocks PPTX T2).
- **#17** Table element: model, render & edit (unblocks PPTX T3) — Gap 3.
- **#18** Hyperlink rendering + element semantic fields (alt-text/description).
- `→ point`: PPTX import/export (done), PDF export (done), ODP I/O, round-trip harness,
  speaker-notes UI, master/layout editor UI, theme picker UI, presentation metadata.

### Phase 3 — Collaboration *(no engine issues)*
The `collab` server (Hocuspocus + Yjs) and the Yjs bridge both already exist / are product-owned.
The engine's only contribution is "every edit is a MUTATION" (**#1**), so nothing is tracked here.
- `→ point`: Yjs `Y.Doc` mirror of `ISlideData`, `@hocuspocus/provider` wiring to
  `ws://<host>:3000/yjs?room=<id>`, presence (awareness), comments.

### Phase 4 — Advanced fidelity (engine slice)
- **#25** Element-type data model + render: chart, line/connector, video — Gap 3 remainder.
- `→ point`: animation/transition modeling (`resources` slot, Gap 4), SmartArt + chart-data
  editing, presenter/slideshow mode, accessibility checker + tagged-PDF export.

---

## How to use this folder

- `issues/` contains one Markdown spec per tracked issue, named
  `<pillar>-<slug>.md`. Each maps to a GitHub issue (file via `scripts/file-issues.sh`).
- Labels: `area:slides`, the five `fidelity:*` labels, and `phase:0..4`.
- Milestones: `Phase 0` … `Phase 4`.

See `issues/INDEX.md` for the full list.
