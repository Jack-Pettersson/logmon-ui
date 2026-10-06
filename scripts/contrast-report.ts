import { themes } from '../src/theme/registry.ts';
import { contrastFailures } from '../src/theme/contrast.ts';
let n = 0;
for (const t of themes)
  for (const s of ['light', 'dark'] as const) {
    const v = t[s];
    if (!v) continue;
    for (const f of contrastFailures(v)) {
      n++;
      console.log(`${t.id}/${s}: ${f.label} = ${f.ratio.toFixed(2)} (< ${f.min})`);
    }
  }
console.log(`${n} failures`);
