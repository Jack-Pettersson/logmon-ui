# logmon-ui

The design system every logmon frontend builds on: logmon-server's dashboard, logmon-hosting's portal (`frontend/`) and admin console (`frontend-admin/`). Tokens, themes, components, app shell and charts live here; apps own their pages, routing and API clients.

- Stack: React 19, strict TypeScript, Tailwind CSS v4 over CSS custom properties, Radix (`radix-ui`), Recharts behind our own chart components, lucide icons, self-hosted Inter and JetBrains Mono.
- Ships TypeScript source (`exports` in `package.json`); the consuming Vite build compiles it.
- Entries: `logmon-ui` (`src/index.ts`: lib helpers, theme runtime, components, shell), `logmon-ui/charts` (`src/charts/index.ts`; separate so pages without charts skip Recharts), `logmon-ui/styles.css`, `logmon-ui/vite`.

## Using it in an app

- `package.json`: `"logmon-ui": "github:Jack-Pettersson/logmon-ui#vX.Y.Z"`.
- `vite.config.ts`: `import { logmonUi } from 'logmon-ui/vite'` and `plugins: [react(), tailwindcss(), logmonUi()]`. The plugin injects the blocking theme-init script (`src/theme/init.generated.js`) that sets `data-theme` and `data-scheme` on `<html>` before first paint, and sets `assetsInlineLimit: 0` so fonts are never inlined as `data:` URIs (CSP `font-src 'self'`).
- `src/app.css`: `@import 'logmon-ui/styles.css';`
- `index.html` meta tags, filled by the Go server when it serves the page:
  - `logmon:theme-override` — theme id applied to everyone on this instance
  - `logmon:cookie-domain` — parent domain the preference cookie is set on
  - `logmon:theme-session` — localStorage key of the app's session; with no value under it the default theme applies
- Provider tree:

```tsx
<ThemeProvider override={instanceTheme} applyPreference={signedIn}>
  <TooltipProvider>
    <ConfirmProvider>
      <App />
      <Toaster />
    </ConfirmProvider>
  </TooltipProvider>
</ThemeProvider>
```

- `override` `undefined` reads the `logmon:theme-override` meta tag; a live value from the server replaces it. `applyPreference={false}` ignores cookie and override: default theme, following the OS.

## Themes

- A preference is `{theme, mode}`, mode `light | dark | system`, stored as `<theme>.<mode>` in the `logmon_theme` cookie with `Domain` from `logmon:cookie-domain`, so hosting, admin and every instance read the same value. Default `logmon`/`system`.
- An override replaces the theme, never the mode.
- `resolveAppearance` in `src/theme/preference.ts` decides; the pre-paint script in `src/theme/init.ts` mirrors it and `tests/unit/init-script.test.ts` holds the two together.
- Catalogue in `src/theme/registry.ts`: `logmon`, `prod`, `staging`, `dev`, `solarized`, `dracula`, `terracotta`. A theme has a light and/or dark variant; a missing scheme falls back to the other.
- A theme is colour only: 37 roles per variant (`ThemeVariant`, `src/theme/types.ts`), emitted as `--color-*` variables per `[data-theme][data-scheme]` into the generated `src/styles/themes.css`. Geometry, type, spacing and the fallback colours are in `src/styles/index.css`.
- Tailwind's palette is off (`--color-*: initial`): components use role utilities only (`bg-raised`, `text-fg-muted`, `border-line`, `text-danger`, `bg-sev-error`, `--color-data-3`).
- `ThemePicker` (settings page) and `AppearanceButton` (shell) write the cookie through `useTheme().setPreference`.

### Adding a theme

1. Add a `Theme` under `src/theme/themes/` and list it in `src/theme/registry.ts`.
2. `npm run gen` rewrites `src/styles/themes.css` and `src/theme/init.generated.js` (CI runs `gen:check`).
3. `npm test` checks contrast (`src/theme/contrast.ts`): text, status, severity and accent 4.5:1, categorical data colours 3:1. `node scripts/contrast-report.ts` lists every failure.
4. `npm run test:visual:update` in the Playwright container adds its screenshots (`tests/visual/README.md`).

### Adding a role

- Add it to `ThemeVariant`, map it in `src/theme/css.ts`, default it in `src/styles/index.css`; `npm run typecheck` lists every theme missing a value.

## Development

- Node ≥ 26, npm ≥ 11 (`engines`).
- `npm ci`
- `npm run dev` — the gallery (`gallery/`) at http://localhost:5173, every component in the current theme
- `npm run gen:check && npm run format:check && npm run lint && npm run typecheck && npm test && npm run build` — what CI runs (`.github/workflows/ci.yml`)
- `npm run test:visual` — Playwright screenshots of the built gallery; CI runs it in `mcr.microsoft.com/playwright:v1.63.0-noble`, run it there too for matching pixels

## Releasing

- Bump `version` in `package.json`, merge, tag `vX.Y.Z` on `main` and push the tag; no workflow tags.
- Consumers change the `#vX.Y.Z` ref in their `package.json` and regenerate their lockfile under the Dockerfile's node image (root `CLAUDE.md`).
