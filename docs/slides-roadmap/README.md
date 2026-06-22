# Univer Slides → Open-Source PowerPoint Alternative — Fidelity Roadmap

**Goal:** Build a free, **Apache-2.0**, self-hosted presentation editor competitive with
**OnlyOffice** and **Collabora Online**, on top of the Univer slides engine. No license
fees, no SaaS lock-in, full document fidelity with Microsoft PowerPoint (`.pptx`) and the
open ODF format (`.odp`), plus PDF export.

> Working branch: `slides/fidelity-roadmap` (forked from `slide/element-mutations`, which
> introduces the mutation/undo-redo/rev-tracking foundation we build on).

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
5. **`fidelity:collab`** — real-time multi-user: mutation-based architecture, OT/CRDT sync,
   presence, comments, a self-hostable sync server.

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
- **Nothing exists.** No OOXML, no ODF, no PDF, no zip tooling anywhere in the repo.
  Greenfield — the highest-value and highest-effort pillar.

### Collaboration (`fidelity:collab`)
- `getRev()` was a stub returning `0`; the branch now increments rev on mutations — the
  *precondition* for collab. No OT/CRDT, no sync server, no presence, no comments yet.

---

## Phase plan

Each phase is a milestone. Phases are ordered by dependency: editing & data-model
completeness gate round-trip; round-trip and the mutation layer gate collaboration.

### Phase 0 — Foundation (in progress on the branch)
Make every edit a real, collab-ready, undoable mutation.
- [#] Land the mutation refactor for all element/page edits (branch work) — *done on branch*.
- [#] Real `getRev`/`incrementRev` on `SlideDataModel` — *done on branch*.
- [#] Audit + close gaps where operations still bypass the mutation layer (text edit, thumb).
- [#] Snapshot (de)serialization contract for `ISlideData` (the in-memory canonical model).

### Phase 1 — Editing core + visual base
The "feels like a real editor" phase.
- Multi-select + marquee select.
- Copy / cut / paste / duplicate element (intra- and inter-slide, and from clipboard).
- Group / ungroup.
- Align + distribute + smart guides + snap.
- Rich-text formatting toolbar (font, size, color, B/I/U, bullets, alignment, spacing).
- Shape styling UI: outline (weight/dash/color), opacity, corner radius, **gradient fill**,
  **shadow**.
- Full preset-shape geometry engine (render the 50+ enumerated shapes via SVG-path geometry).
- Slide reorder; slide background styling.

### Phase 2 — Round-trip (the headline)
- **PPTX import** (OOXML `p:presentation` → `ISlideData`): slides, shapes, text runs,
  images, theme, masters/layouts, tables.
- **PPTX export** (`ISlideData` → OOXML): lossless of everything we model.
- Round-trip fidelity test harness (import → export → re-import → diff).
- **Data-model extensions** required by round-trip: tables, charts (at least preserve),
  media, masters/layouts/theme resolution, placeholders, hyperlinks, metadata, notes.
- **ODP import/export** (OpenDocument Presentation) — the open-format pillar.
- **PDF export** (render pages → PDF; vector where possible).

### Phase 3 — Collaboration + self-host
- OT or CRDT transform layer over slide mutations.
- Self-hostable sync server (WebSocket) + document persistence.
- Presence (cursors/selection), comments/threads, basic permissions.
- Conflict resolution + offline reconcile.

### Phase 4 — Advanced fidelity
- Animations + slide transitions (model, author UI, playback, round-trip).
- Charts (native render + edit), SmartArt, embedded media playback.
- Accessibility tags + export, reading order, alt-text enforcement.
- Presenter view, slideshow mode, export to images.

---

## How to use this folder

- `issues/` contains one Markdown spec per tracked issue, named
  `<pillar>-<slug>.md`. Each maps to a GitHub issue (file via `scripts/file-issues.sh`).
- Labels: `area:slides`, the five `fidelity:*` labels, and `phase:0..4`.
- Milestones: `Phase 0` … `Phase 4`.

See `issues/INDEX.md` for the full list.
