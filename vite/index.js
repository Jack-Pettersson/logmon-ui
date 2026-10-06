import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const DEV_PATH = '/@logmon-ui/theme-init.js';

/**
 * Injects the blocking theme-init script into <head> so data-theme/data-scheme
 * are set before first paint (CSP forbids inline scripts, so it is a file).
 * @returns {import('vite').Plugin}
 */
export function logmonUi() {
  const source = readFileSync(new URL('../src/theme/init.generated.js', import.meta.url), 'utf8');
  const hash = createHash('sha256').update(source).digest('hex').slice(0, 10);
  let base = '/';
  let isBuild = false;
  const fileName = `assets/theme-init-${hash}.js`;
  return {
    name: 'logmon-ui',
    config() {
      // CSP has font-src 'self': fonts must never be inlined as data: URIs.
      return { build: { assetsInlineLimit: 0, chunkSizeWarningLimit: 1024 } };
    },
    configResolved(config) {
      base = config.base;
      isBuild = config.command === 'build';
    },
    configureServer(server) {
      server.middlewares.use(DEV_PATH, (_req, res) => {
        res.setHeader('Content-Type', 'text/javascript');
        res.end(source);
      });
    },
    buildStart() {
      if (isBuild) this.emitFile({ type: 'asset', fileName, source });
    },
    transformIndexHtml() {
      return [{ tag: 'script', attrs: { src: isBuild ? `${base}${fileName}` : DEV_PATH }, injectTo: 'head' }];
    },
  };
}
