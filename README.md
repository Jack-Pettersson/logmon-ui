# logmon-ui

The design system shared by every logmon frontend: logmon-server's dashboard, logmon-hosting's customer portal and its admin console. It holds the design tokens, the theme catalogue and runtime, the React components, the app shell and the chart components. Apps own their pages, routing and API clients; everything visual comes from here.

Stack: React 19, TypeScript (strict), Tailwind CSS v4 over CSS custom properties, Radix primitives, Recharts behind our own chart components, lucide icons, Inter and JetBrains Mono (self-hosted).

## Using it in an app

The package ships TypeScript source; the consuming Vite build compiles it.

```jsonc
// package.json
"dependencies": { "logmon-ui": "github:Jack-Pettersson/logmon-ui#v0.1.0" }
```

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { logmonUi } from 'logmon-ui/vite';
export default defineConfig({ plugins: [react(), tailwindcss(), logmonUi()] });
```

```css
/* src/styles.css */
@import 'logmon-ui/styles.css';
```

```html
<!-- index.html: the Go server replaces the tokens when it serves the page -->
<meta name="logmon:theme-override" content="__LOGMON_THEME_OVERRIDE__" />
<meta name="logmon:cookie-domain" content="__LOGMON_COOKIE_DOMAIN__" />
```

```tsx
<ThemeProvider override={clusterTheme /* optional, live value from the server */}>
  <TooltipProvider>
    <ConfirmProvider>
      <App />
      <Toaster />
    </ConfirmProvider>
  </TooltipProvider>
</ThemeProvider>
```

Charts live in a separate entry so pages without charts don't pull Recharts: `import { TimeSeriesChart } from 'logmon-ui/charts'`.

## Themes

A user's choice is `{theme, mode}` with mode `light | dark | system`, stored in the `logmon_theme` cookie on the shared parent domain, so hosting, admin and every cluster read the same value. A cluster override (`logmon:theme-override`) replaces the theme for everyone on that cluster but never the user's mode. The `logmonUi()` Vite plugin injects a blocking script that applies `data-theme` and `data-scheme` on `<html>` before first paint; `ThemeProvider` keeps them in sync afterwards.

A theme is colour only: about 35 roles per variant (`src/theme/types.ts`). Geometry, type and spacing belong to the base design in `src/styles/index.css` and are the same for every theme. Components only ever use role utilities (`bg-raised`, `text-fg-muted`, `border-line`, `text-danger`, `bg-sev-error`, `--color-data-3` …); Tailwind's default palette is switched off so nothing else exists.

### Adding a theme

1. Add a `Theme` object under `src/theme/themes/` and list it in `src/theme/registry.ts`.
2. `npm run gen` regenerates `src/styles/themes.css` and the pre-paint script.
3. `npm test` checks every text, status, severity and data role against WCAG contrast minimums; adjust colours until it passes.
4. `npm run test:visual:update` (inside the Playwright container, see `tests/visual/README.md`) adds its screenshots.

### Adding a role

Add it to `ThemeVariant`, map it in `src/theme/css.ts`, give it a default in `src/styles/index.css`. `tsc` then lists every theme that needs a value.

## Development

```sh
npm install
npm run dev          # gallery at http://localhost:5173 — every component in the current theme
npm run lint && npm run typecheck && npm test
npm run test:visual  # screenshot regression (run in the Playwright container for stable pixels)
```

## Releasing

Bump `version` in `package.json`, merge, then tag `vX.Y.Z` on main and push the tag. Apps pick it up by changing the `#vX.Y.Z` ref in their `package.json` and regenerating their lockfile.
