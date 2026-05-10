# EMVY Ops Hub — Kanban Board

## Project
Next.js 15 app (App Router) at `/home/dusk/emvy-ops-hub` — EMVY operations dashboard.

## Kanban Board (`/kanban`)

Build a full kanban board UI at `src/app/kanban/page.tsx` with:
- Board: `emvy`
- Lanes: `todo`, `ready`, `running`, `review`, `blocked`, `done`
- Cards show: title, assignee, stage badge, age
- "Add card" button on each lane — opens inline form
- Card detail drawer on click (edit title, assignee, status, body)
- Drag-and-drop between lanes (use @dnd-kit/core + @dnd-kit/sortable)

## Backend API

Create API routes that run Python subprocess calls to `hermes kanban` CLI to read/write the SQLite kanban DB:

**`GET /api/kanban`** — returns all tasks for board `emvy` as JSON
```bash
hermes kanban list --board emvy --format json
```

**POST /api/kanban** — create task
```bash
hermes kanban create --board emvy --title "..." --body "..."
```

**PATCH /api/kanban/[id]** — update task (title, body, status, assignee)
```bash
hermes kanban edit <id> --title "..."
hermes kanban assign <id> <assignee>
hermes kanban complete <id>
hermes kanban block <id>
hermes kanban unblock <id>
```

**DELETE /api/kanban/[id]** — archive task
```bash
hermes kanban archive <id>
```

## Design

Dark theme matching the rest of ops-hub:
- Background: `#0a0a0f` or similar dark
- Cards: `#161622` with `#1e1e2e` hover
- Borders: `#2a2a3a`
- Text: `#e2e2f0`
- Stage colors:
  - todo: gray `#52525b`
  - ready: blue `#3b82f6`
  - running: amber `#f59e0b`
  - review: purple `#a855f7`
  - blocked: red `#ef4444`
  - done: green `#22c55e`
- Lane headers with count badges
- Add card button per lane

## Key Files to Create

1. `src/app/kanban/page.tsx` — main board UI
2. `src/app/api/kanban/route.ts` — GET (list) + POST (create)
3. `src/app/api/kanban/[id]/route.ts` — PATCH (update) + DELETE (archive)
4. `src/lib/kanban-types.ts` — shared TypeScript types

## Add to Nav

Add a "Kanban" nav item in the sidebar (src/components/Sidebar.tsx) linking to `/kanban`.