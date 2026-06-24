# AGENTS.md

Guidelines for any AI coding agent working in this repository, particularly on the auth module described in `auth-frontend-agent-prompt.md`.

## Scope & Platform

- This app currently ships **web only** (Expo web). Do not introduce native-only APIs (e.g. `expo-secure-store`, deep-link handlers, native cookie jars) as if they're required now — they aren't.
- Native (iOS/Android) support is a *future* possibility, not a current task. Don't build it, but don't block it either: keep platform-specific concerns (HTTP client, token retrieval, navigation entry points) behind small, swappable modules rather than scattering `Platform.OS` checks or web-only globals through screens and business logic.

## State Management

- **Zustand only.** Do not introduce React Context, Redux, MobX, or any other state library for app state. If a Context is strictly required for something Zustand can't do (e.g. theming providers from a third-party UI lib), confirm with the user before adding it.

## Networking

- **Single source of truth for HTTP calls.** All API requests go through one centralized axios instance (`apiClient`). No raw `fetch` calls, no ad-hoc axios instances per file.
- **401 handling lives in one interceptor**, not duplicated per call site.
- **Cookies:** rely on `withCredentials: true` for the current web target. Do not write cookie-jar/manual cookie-header code for native — that's out of scope until native work actually starts.

## Code Quality Standards

- **No duplicated logic.** If the same validation, error-mapping, or formatting logic is needed in two places, extract it to a shared util/hook instead of copy-pasting.
- **No silent failures.** Every `catch` block must either surface the error to the UI (toast/inline message) or log it with enough context to debug — never an empty catch.
- **Type everything.** No `any` in new code unless genuinely unavoidable (e.g. parsing untyped third-party JSON), and even then, narrow it immediately with a parse/validation step rather than passing `any` downstream.
- **Match existing conventions before introducing new ones.** Check the existing codebase for naming patterns, folder structure, and component conventions before adding new files — don't introduce a second "style" of doing things alongside an existing one without flagging it.
- **Small, focused commits/diffs.** When implementing a multi-step plan (e.g. the 6-step build order in the auth prompt), prefer completing and validating one step before moving to the next, rather than producing one large undifferentiated change.
- **No dead code.** Don't leave commented-out blocks, unused imports, or placeholder TODOs without a tracked reason — if something is genuinely deferred (e.g. native cookie handling), note it explicitly in a comment referencing this file, not as a vague TODO.
- **Validate before you assume.** If a detail isn't confirmed in the spec (e.g. a URL structure, a query param name, an existing design system), ask or flag it as an open question rather than guessing silently and shipping the guess.

## Design System / UI Theme

Functional requirements: **minimalism, cleanliness, professional.** No generic/default-looking component-library UI ("trash UI") — every screen should look intentionally designed against this theme, not assembled from unstyled defaults.

### Color Palette

| Role | Color | Usage |
|---|---|---|
| Primary | Pitch Black `#000000` | Dominant elements, main typography, heavy backgrounds, bold UI components |
| Secondary | Charcoal/Dark Gray `#1A1A1A`–`#333333` | Secondary text, subtle backgrounds, borders, gradient transitions |
| Tertiary | Crimson/Bold Red `#E50914` | CTAs, alert icons, active states, eye-catching highlights only |

**70/25/5 distribution rule — enforce this in every screen, not just spot-check:**

- **70% Pitch Black:** the dominant surface. Black is visually heavy, so pair it with generous negative space/padding — screens should feel breathable and sleek, never cramped.
- **25% Charcoal shades:** used for depth — cards, sidebars, container backgrounds, inactive/secondary text. Creates structure without competing with the focal elements.
- **5% Red:** reserved exclusively for the focal point — primary CTA buttons, important notifications/alerts, active-state indicators. Never use red for large surfaces, decorative elements, or anything that isn't meant to demand immediate attention. If more than one element per screen is red, that's a signal the hierarchy is wrong.

### Typography

- Headings and primary text: white or high-contrast light gray on black backgrounds, for legibility.
- Use red accents sparingly and only on specific words, links, or inline highlights — not full paragraphs or headings.
- Use this font in global theme <style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');
</style>
- 300 (Light)font-weight: 300;$\ge$ 32pxHero headers, minimalist title landing pages400 (Regular)font-weight: 400;14px – 18pxBody copy, descriptions, main interface text700 (Bold)font-weight: 700;AnySection titles, buttons, alert text, active states
### UI States

- Use charcoal shades for interactive states on non-CTA elements (e.g. button hover/pressed → dark gray).
- For red CTA buttons specifically: hover/pressed state should shift to a deeper red or dark gray, not a lighter/brighter red — keep the transition smooth, not jarring.
- Disabled states: drop to a muted charcoal with reduced-opacity text, not a faded red.

### Component Toolkit

- Use **`@expo/ui`** for UI elements. This is the **one and only** primary UI toolkit for this project — do not mix in other component libraries (e.g. React Native Paper, NativeBase, gluestack) alongside it. If `@expo/ui` is missing a needed component, build a minimal custom component styled to match this theme rather than pulling in a second library.
- Apply the palette via a single shared theme/tokens file (colors, spacing) that `@expo/ui` components and any custom components both consume — no hardcoded hex values scattered across screens.


If a requirement is ambiguous or a tradeoff isn't covered by this file or the implementation prompt, surface the question explicitly rather than picking a default unilaterally and moving on.