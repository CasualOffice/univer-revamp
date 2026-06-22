# [slides][p3] Self-hosted Hocuspocus sync server + persistence

> **Labels:** area:slides, fidelity:collab, phase:3  
> **Milestone:** Phase 3 — Collaboration + self-host

## Pillar
Collab — self-hosted, free, no SaaS.

## Problem
We need a transport + persistence layer for the Yjs documents that we fully control and can self-host (the whole point vs OnlyOffice/Collabora SaaS).

## Scope
- Stand up a **Hocuspocus** server (Node) as a separate deployable in the repo (e.g. `servers/collab` or `apps/collab-server`).
- `onAuthenticate` (token/permission check), `onLoadDocument` / `onStoreDocument` (persist Yjs state to DB — Postgres/SQLite/S3-blob), document GC.
- Browser provider (`@hocuspocus/provider`) wired to the Yjs binding from #p3-yjs-binding.
- Docker compose for one-command self-host; document the deployment.

## Acceptance criteria
- Two browsers connected to the self-hosted server co-edit a deck in real time; reload restores from persistence.

## Dependencies
#p3-yjs-binding.

## Key files
new server package + `@hocuspocus/provider` client wiring.
