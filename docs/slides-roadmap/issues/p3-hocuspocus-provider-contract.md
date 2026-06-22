# [slides][p3] Hocuspocus provider integration contract (engine ↔ existing collab server)

> **Labels:** area:slides, fidelity:collab, phase:3  
> **Milestone:** Phase 3 — Collaboration + self-host

## Pillar
Collab. **Note:** the Hocuspocus collab server already exists in our infra — this issue is NOT about standing one up. It defines how the *engine* (this repo) connects to it.

## Problem
The core engine must expose a clean way for the product slides repo to attach a `@hocuspocus/provider` to the Yjs binding (#p3-yjs-binding) and feed updates into `SlideDataModel` — without the engine owning the server, auth, or persistence (all handled by the existing server).

## Scope
- Define the engine-side collab provider interface: connect/disconnect, document id ↔ unitId mapping, apply remote Yjs updates → model, emit local updates.
- Reference adapter for `@hocuspocus/provider` (peer-dependency / optional) so the product repo wires the existing server URL + auth token in.
- Awareness channel passthrough for presence (consumed by #p3-presence-comments).
- Document the integration contract for the product repo; no server, persistence, or Docker here (the existing server owns those).

## Acceptance criteria
- The product repo can attach the existing Hocuspocus server with a few lines; two clients co-edit via that server; remote updates land in the model.

## Dependencies
#p3-yjs-binding.

## Key files
new engine-side collab binding module + optional `@hocuspocus/provider` adapter.
