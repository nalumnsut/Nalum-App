# Project Instructions — AI Agent Context

## What this app is

A professional networking app, LinkedIn-style: users create profiles, post updates/articles, follow/connect with others, and chat 1:1 (and eventually in groups). Feed is the core surface. Chat is real-time.

**Rollout strategy (important — affects every decision below):**
1. **Phase 1:** Ship as a PWA (installable web app). No native builds yet.
2. **Phase 2:** Once budget allows, ship the *same* codebase as Android + iOS apps via EAS Build. No rewrite, no separate native codebase.

This means: never use a library or pattern that only works on native and breaks on web, and never use a raw web API (`window`, `document`, `localStorage`) without a `Platform.OS` guard or a `.web.tsx` split file. Every screen must work in a browser first.

---

## Stack

| Layer | Choice | Do NOT use |
|---|---|---|
| Framework | Expo (SDK 57), Expo Router (file-based routing) | React Navigation directly, bare RN |
| Styling | NativeWind v4 (Tailwind syntax) | StyleSheet.create as primary method, styled-components |
| Server state / caching | TanStack Query (`useInfiniteQuery` for feed/chat lists) | Redux, manual fetch+useEffect+useState for server data |
| Client/UI state | Zustand | Redux, Context for anything that updates frequently |
| Lists | `@shopify/flash-list` for ANY scrolling list (feed, chat, notifications) | `FlatList`, `ScrollView.map()` |
| Images | `expo-image` | RN `Image` |
| Animation | `react-native-reanimated` (UI thread) | `Animated` API from core RN for anything perf-sensitive |
| Backend | Fastify + TypeScript + Prisma + PostgreSQL (same conventions as NALUM) | — |
| Realtime chat | WebSocket (dedicated service, separate from HTTP API) + Kafka for message durability | Polling for chat |
| Push notifications | Firebase FCM | — |
| Secrets/tokens on device | `expo-secure-store` | AsyncStorage for tokens |
| Web PWA shell | `app/+html.tsx` + hand-rolled `public/manifest.json` + thin service worker | Heavy caching frameworks that cache API/feed responses |

---

## Project structure

```
app/
  (tabs)/
    feed.tsx
    profile.tsx
    notifications.tsx
    chat/
      index.tsx              # conversation list
      [conversationId].tsx   # single thread
  post/[id].tsx
  profile/[userId].tsx
  _layout.tsx                 # root layout, wraps providers
  +html.tsx                   # WEB ONLY — manifest link, meta tags, viewport
components/
  ui/                         # generic buttons, inputs, cards
  feed/
  chat/
lib/
  api.ts                      # fetch wrapper -> Fastify backend
  ws.ts                       # WebSocket client, singleton, lives above screen lifecycle
  queryClient.ts
stores/
  authStore.ts
  chatStore.ts                # holds live WS connection state
public/
  manifest.json
  icons/
```

---

## Non-negotiable rules for the agent

1. **Every list is FlashList.** If you're about to render a feed, chat thread, or notification list with `.map()` or `FlatList`, stop — use FlashList with `estimatedItemSize` set.
2. **Chat WebSocket connection lives in a top-level store/provider, not inside a screen component.** It must not disconnect/reconnect when the user navigates from chat to feed and back. Screens subscribe to the store; they don't own the socket.
3. **Feed and chat pagination is cursor-based** (using UUIDv7 or created_at+id cursor), never offset-based. Matches the Postgres schema conventions already in use.
4. **No platform-specific API without a guard.** Anything touching `window`, `document`, `navigator`, or browser storage must check `Platform.OS === 'web'` or live in a `.web.tsx` / `.native.tsx` split file.
5. **Service worker caches shell assets only** (JS bundles, icons, fonts) — never cache feed data, chat messages, or any API response. This is a social app; stale data is worse than a loading spinner.
6. **Auth tokens go in `expo-secure-store`**, never in AsyncStorage or localStorage directly. On web, fall back to an httpOnly cookie pattern if secure-store isn't available — flag this to the human rather than silently using localStorage.
7. **Styling is NativeWind classNames.** Don't introduce inline `StyleSheet.create` unless NativeWind genuinely can't express something (rare — flag it if it comes up).
8. **Images always go through `expo-image`** with proper `contentFit` and a `placeholder` (blurhash if available) — no bare `<Image>`.
9. **Don't add native-only dependencies during Phase 1** (PWA) unless they have a documented web fallback. Check `npx expo install <pkg>` output / Expo docs before adding anything new.

---

## Design system

**Theme name: Kinship Protocol**

A minimalist / engineering-focused aesthetic. Utility, precision, and enduring professional connection. The UI recedes to let alumni content and achievements be the focal point. "Technical Premium" — feels built, not decorated.

### Colors

95/5 monochrome-to-accent ratio. High legibility in light and dark modes.

| Token | Light | Dark | Notes |
|---|---|---|---|
| `surface` | `#fbf9f9` | `#0f0f0f` | Primary canvas |
| `surface-lowest` | `#ffffff` | `#0a0a0a` | Cards sit "above" canvas |
| `surface-container` | `#efeded` | `#1e1e1e` | Containers |
| `on-surface` | `#1b1c1c` | `#f0f0f0` | Primary text |
| `on-surface-variant` | `#4c4546` | `#a0a0a0` | Secondary text |
| `outline` | `#7e7576` | `#4a4a4a` | Borders |
| `outline-variant` | `#cfc4c5` | `#2a2a2a` | Subtle dividers |
| `primary` | `#000000` | `#ffffff` | Primary actions |
| `on-primary` | `#ffffff` | `#000000` | On primary |
| `accent` | `#ef4544` | `#e53e3e` | **Engineering Red — ≤5% of UI only** |
| `error` | `#ba1a1a` | `#ffb4ab` | Errors |
| `background` | `#fbf9f9` | `#0a0a0a` | Page background |

**Accent usage rule:** Engineering Red (`#ef4544`) is reserved for: active tab indicators, primary CTAs, focus states on inputs, notification badges. Never use for large surfaces or decorative elements.

### Typography

Two fonts only:

| Font | Use case | Max % of UI |
|---|---|---|
| **Google Sans Flex** | All body, headings, UI labels, buttons, inputs | 95%+ |
| **JetBrains Mono** | Graduation year, alumni ID, profile stats, timestamps, verification IDs, event codes | ≤5% |

**JetBrains Mono pattern — the metadata row:**
```
John Doe
Software Engineer @ Goldman Sachs
2024 • IT • NSUT        ← this line only, in JetBrains Mono
```

**Type scale (Google Sans Flex):**
- `display` — 32px / 40px / SemiBold / −0.02em tracking
- `headline-lg` — 24px / 32px / SemiBold / −0.01em tracking
- `headline-lg-mobile` — 22px / 28px / SemiBold
- `headline-md` — 20px / 28px / Medium
- `body-lg` — 16px / 24px / Regular
- `body-md` — 14px / 20px / Regular
- `label-md` — 12px / 16px / Medium (Google Sans Flex)
- `label-caps` — 12px / 16px / Medium / +0.05em tracking (JetBrains Mono, uppercase)

### Spacing (8pt grid)

| Token | Value | Use |
|---|---|---|
| `xs` | 4px | Icon gaps, tight stacks |
| `sm` | 8px | Related items (heading → body) |
| `md` | 16px | Standard padding |
| `lg` | 24px | Section gaps, canvas margin |
| `xl` | 32px | Unrelated section separation |

### Elevation

No shadows. Depth via:
1. **Borders:** 1px `outline-variant` separates elements
2. **Tonal layers:** canvas (`#fbf9f9`) → cards (`#ffffff`)
3. **Whitespace:** more margin = more elevation

### Shapes (Soft-Square)

| Radius | Value | Use |
|---|---|---|
| `sm` | 4px | Chips, checkboxes |
| `lg` | 8px | Buttons, inputs, cards |
| `xl` | 12px | Modals, sheets |

### Components

**Buttons:**
- Primary: black bg / white text / 8px radius / no shadow
- Secondary: 1px `outline-variant` border / black text
- Ghost: no border / Engineering Red text (destructive CTAs only)

**Inputs:** 1px `outline-variant` border → 1px Engineering Red on focus. No glow.

**Cards:** white (`surface-lowest`) / 1px `outline-variant` border / 24px internal padding.

**Bottom Nav:** 1px top border only / thin (1.5px) stroke icons / Engineering Red active state / `#737373` inactive.

---

## Backend contract expectations

The agent should assume:
- REST endpoints for feed, profile, posts, connections (Fastify + Zod validation + Prisma)
- Separate WS endpoint for chat, with Kafka backing message durability so no message is lost on disconnect
- Auth via JWT (access + refresh), refresh handled transparently by `lib/api.ts`, never left to individual screens to manage

If the agent is asked to build a feature that implies a new backend endpoint, it should propose the endpoint shape (route, request/response schema) before or alongside the frontend work — don't assume an endpoint exists silently.

---

## When in doubt

Default to whatever keeps the PWA path clean. If a proposed solution only makes sense once native builds exist, flag it and offer the web-safe alternative instead of silently implementing the native-only version.