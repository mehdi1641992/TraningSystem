// Static HTML checks: balanced nesting, unique IDs, local assets and panel coverage.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const voids = new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
for (const [page, minimum] of [['admin', 22], ['participant', 7]]) {
  const file = path.join(root, 'public', 'demo', page + '.html');
  const html = fs.readFileSync(file, 'utf8');
  const stack = [], ids = new Set();
  assert(!html.includes('APPEND'), `${page}: unfinished marker`);
  for (const match of html.matchAll(/<!--[\s\S]*?-->|<![^>]*>|<\/?([a-z][\w-]*)\b[^>]*>/gi)) {
    if (!match[1]) continue;
    const tag = match[1].toLowerCase(), token = match[0];
    if (token.startsWith('</')) {
      assert.equal(stack.pop(), tag, `${page}: mismatched ${token} at ${match.index}`);
      continue;
    }
    const id = /\bid="([^"]+)"/.exec(token)?.[1];
    if (id) { assert(!ids.has(id), `${page}: duplicate ${id}`); ids.add(id); }
    const asset = /\b(?:src|href)="(\.\/[^"#]+)"/.exec(token)?.[1];
    if (asset) assert(fs.existsSync(path.resolve(path.dirname(file), asset)), `${page}: missing ${asset}`);
    if (!voids.has(tag)) stack.push(tag);
  }
  assert.equal(stack.length, 0, `${page}: unclosed ${stack}`);
  for (const id of ['nav', 'viewTitle']) assert(ids.has(id), `${page}: missing ${id}`);
  const panels = [...ids].filter(id => id.startsWith('v-'));
  assert(panels.length >= minimum, `${page}: ${panels.length} panels, expected at least ${minimum}`);
  assert(html.includes('./demo.js'), `${page}: missing navigation script`);
  console.log(`OK ${page}: ${panels.length} panels; nesting, IDs and assets verified`);
}
for (const file of ['src/App.jsx', 'src/styles.css', 'public/demo/demo.css']) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  assert(!/#(?:003223|005B3F|D65641|252625)\b/i.test(source), `${file}: old theme remains`);
}
console.log('OK monochrome theme regression check');
