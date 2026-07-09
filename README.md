# Marketplace — CometChat integration (`feature/cometchat-integration`)

A buy/sell marketplace across **web + Android + iOS + backend**, with **CometChat** wired in for
real-time chat and voice/video calling. This branch is the baseline app (see `main`) **plus** the
full CometChat integration.

> Generated + hardened by the [STEP4 Skills Reviewer pipeline](https://github.com/ananyadhiman-cometchat/step4-skills-pipeline).
> Compare against baseline: [`main…feature/cometchat-integration`](https://github.com/ananyadhiman-cometchat/step4-marketplace/compare/main...feature/cometchat-integration).

## Stack
| Component | Tech |
|---|---|
| `web/` | Next.js (App Router) + CometChat React UI Kit v6 |
| `mobile/` | Expo / React Native + CometChat RN UI Kit v5 (chat + calls SDK) |
| `backend/` | FastAPI + Postgres, mints CometChat auth tokens on login |

## What CometChat adds on top of `main`
- **Chat** — conversation list + message thread on all three clients (`CometChatProvider` at root).
- **Calling** — voice + video, cross-platform: web↔web, android↔web, ios↔web all connect.
  Incoming calls ring with an Accept/Decline widget; the ongoing call renders full-screen.
- **Auth bridge** — backend `POST /api/auth/login` returns a `cometchat_auth_token`; clients log
  into CometChat with it (no auth key on the client).

## Run
```bash
# backend + web + postgres
docker compose up --build          # web :3000, backend :8080

# mobile (standalone release builds — CometChat creds injected at build time)
#   Android emulator reaches the host at 10.0.2.2:8080/api; iOS sim at localhost:8080/api
```
CometChat creds are read from env (`NEXT_PUBLIC_COMETCHAT_*` on web, `EXPO_PUBLIC_COMETCHAT_*` on
mobile). Real `.env` files are git-ignored; see `*.env.example`.

## Notable integration fixes (baked into this branch)
- Web message-list scroll (bounded-height container).
- Incoming/ongoing call surfaces mounted at app root, rendered as full-viewport overlays.
- Mobile call settings passed as a builder **instance**, not the class.
- Mobile build injects the real CometChat App ID (placeholder silently breaks the real-time socket).

Findings from building this (skills/SDK gaps + fixes) live in the pipeline repo under
`pipeline-state/gaps/mkt.md`.
