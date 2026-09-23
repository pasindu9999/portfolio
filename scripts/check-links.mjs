/**
 * Walks the built site and reports internal links that resolve to nothing.
 * Run with: npm run check:links   (after npm run build)
 */
import { readFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { glob } from 'node:fs/promises';

const files = [];
for await (const f of glob('dist/**/*.html')) files.push(f);

const routes = new Set(['/']);
for (const f of files) {
  const rel = '/' + f.replace(/\\/g, '/').replace(/^dist\//, '');
  routes.add(rel);
  routes.add(rel.replace(/index\.html$/, ''));
}

const broken = new Set();
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const raw = m[1].split('#')[0].split('?')[0];
    if (!raw) continue;
    if (routes.has(raw)) continue;
    if (existsSync('dist' + raw)) continue;
    if (existsSync('dist' + raw + 'index.html')) continue;
    broken.add(`${raw}   <- ${f.replace(/\\/g, '/')}`);
  }
}

if (broken.size) {
  console.log(`${broken.size} broken internal link(s):`);
  for (const b of [...broken].sort()) console.log('  ' + b);
  process.exit(1);
}
console.log(`OK — every internal link across ${files.length} pages resolves.`);
