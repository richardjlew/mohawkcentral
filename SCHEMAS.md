# Mohawk Central — Data Schemas

Two core features are backed by versioned JSON in `/data`. The frontend (vanilla JS in `index.html`) fetches these at load and renders them. The schemas are intentionally **flat and typed** so they map 1:1 onto Postgres tables when we outgrow static files (see "Migration" below).

> Stack: static HTML/CSS/JS on Vercel. No framework, no build step. Update data by editing the JSON and pushing — Vercel auto-deploys.

---

## 1. Live Tonight Dashboard — `data/live-tonight.json`

Array of event objects. The dashboard shows events whose `startsAt` is **today** (viewer's local time), flags ones happening now as **Live**, and ones starting within 3 hours as **Soon** (both computed client-side from timestamps — no backend needed).

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | Stable unique id (`evt_xxxx`) |
| `title` | string | yes | Event name |
| `venue` | string | yes | Where it's held |
| `neighborhood` | string | no | Utica, Rome, Marcy, … |
| `category` | enum | yes | `music` \| `food` \| `outdoors` \| `community` \| `sports` \| `arts` |
| `startsAt` | string (ISO 8601, UTC) | yes | Start; drives Live/Soon logic |
| `endsAt` | string (ISO 8601, UTC) | no | End; used to clear "Live" |
| `price` | string | no | `Free`, `$`, `$$`, etc. |
| `url` | string | no | Link out; empty = non-clickable |
| `status` | enum | no | `scheduled` \| `cancelled` |

## 2. Field Correspondent Video Feed — `data/field-videos.json`

Array of video objects using a **discriminated union** on `type`. Common fields apply to all; type-specific fields live in a nested object named after the type.

**Common fields**

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | `vid_xxxx` |
| `type` | enum | yes | `embed` \| `upload` \| `live` |
| `title` | string | yes | |
| `correspondent` | object | yes | `{ name, location }` |
| `publishedAt` | string (ISO 8601) | yes | Sort key (newest first) |
| `thumbnail` | string (URL) | no | Poster image |
| `durationSec` | number | no | embed/upload |
| `tags` | string[] | no | |

**Type-specific blocks**

- `type: "embed"` → `embed: { provider: "youtube"|"vimeo"|…, url, embedUrl }`
- `type: "upload"` → `file: { src (mp4 URL), poster }` — needs object storage (Vercel Blob / Cloudflare R2) in production
- `type: "live"` → `live: { status: "live"|"scheduled"|"offline", streamUrl, startedAt }` — needs a stream provider (Mux, YouTube Live) in production

The renderer handles all three: embed → click-through play over thumbnail, upload → inline `<video>`, live → status badge (red "Live" when `status==="live"`) with click-through to the stream.

---

## Migration to a database (Neon) — when, not yet

Stay on static JSON until one of these is true: correspondents/users **submit** content through a form, you need **uploads or auth**, or data changes **many times a day**. Then move to **Neon** (serverless Postgres) + Vercel functions — it scales to zero and fits this stack better than an always-on host like Render.

Because the JSON is already flat and typed, migration is mechanical:

- `live-tonight.json` → table `events` (one column per field; `category`/`status` as enums or `text`).
- `field-videos.json` → table `videos` with common columns + a `type` column; put the type-specific blocks in either a `jsonb` column (`details`) or separate `video_embeds` / `video_uploads` / `video_streams` tables keyed by `video_id`.
- Frontend change is one line per feature: swap the `fetch('data/*.json')` URL for `fetch('/api/events')` / `fetch('/api/videos')`; the render code stays identical because the shape is preserved.
