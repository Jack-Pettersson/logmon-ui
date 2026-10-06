import { availableSchemes, DEFAULT_THEME_ID } from './registry.ts';
import { COOKIE_NAME, META_OVERRIDE } from './preference.ts';
import type { Theme } from './types.ts';

// Classic blocking <head> script: sets data-theme/data-scheme before first
// paint. Mirrors resolveAppearance; tests assert the two agree.
export function initScript(themes: readonly Theme[]): string {
  const schemes = Object.fromEntries(themes.map((t) => [t.id, availableSchemes(t)]));
  return `(function () {
  try {
    var S = ${JSON.stringify(schemes)};
    var has = function (k) { return Object.prototype.hasOwnProperty.call(S, k); };
    var d = document;
    var raw = '';
    var parts = d.cookie.split(';');
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].replace(/^\\s+/, '');
      if (p.indexOf(${JSON.stringify(COOKIE_NAME + '=')}) === 0) raw = decodeURIComponent(p.slice(${COOKIE_NAME.length + 1}));
    }
    var pref = raw.split('.');
    var t = has(pref[0]) ? pref[0] : ${JSON.stringify(DEFAULT_THEME_ID)};
    var m = pref[1] === 'light' || pref[1] === 'dark' ? pref[1] : 'system';
    var meta = d.querySelector('meta[name=${JSON.stringify(META_OVERRIDE)}]');
    var o = meta ? meta.getAttribute('content') : null;
    if (o && has(o)) t = o;
    var s = m === 'system' ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : m;
    if (S[t].indexOf(s) < 0) s = S[t][0];
    d.documentElement.setAttribute('data-theme', t);
    d.documentElement.setAttribute('data-scheme', s);
  } catch (e) {}
})();
`;
}
