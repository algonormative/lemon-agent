import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SURFACE_PATHS, contentTypeFor, createFetch } from '../worker/surfaces.js';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const DIST = join(ROOT, 'dist');
const GENERATOR = join(ROOT, 'scripts/generate-surfaces.mjs');

// What `npm run build` emits at the site root, as of this change.
const EMITTED = ['/llms.txt', '/catalog.json', '/robots.txt', '/sitemap-index.xml', '/sitemap-0.xml'];

function generate(dist) {
  const out = join(mkdtempSync(join(tmpdir(), 'surfaces-')), 'surfaces.generated.js');
  const r = spawnSync(process.execPath, [GENERATOR, dist, out], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return out;
}

async function fetcher(dist) {
  const mod = await import(pathToFileURL(generate(dist)).href);
  return createFetch(mod.default);
}

test('route list covers every emitted surface and matches wrangler.toml', () => {
  assert.deepEqual([...SURFACE_PATHS].sort(), [...EMITTED].sort());

  const toml = readFileSync(join(ROOT, 'worker/wrangler.toml'), 'utf8');
  const patterns = [...toml.matchAll(/^pattern = "(.+)"$/gm)].map((m) => m[1]);
  assert.deepEqual(patterns.sort(), SURFACE_PATHS.map((p) => `lemon-agent.dev${p}`).sort());

  if (!existsSync(DIST)) return; // no build in this checkout — skip the dist cross-check
  const rootSurfaces = readdirSync(DIST, { withFileTypes: true })
    .filter((e) => e.isFile() && /\.(txt|json|xml)$/.test(e.name))
    .map((e) => `/${e.name}`);
  for (const p of rootSurfaces) assert.ok(SURFACE_PATHS.includes(p), `uncovered surface ${p}`);
});

test('serves fixture bytes byte-identically', async () => {
  const dist = mkdtempSync(join(tmpdir(), 'dist-'));
  const fixtures = {
    '/llms.txt': '# Lemón Agent\n> café — naïve ☕\n', // non-ASCII + trailing newline
    '/catalog.json': '{"name":"Lemon Agent","note":"no trailing newline"}',
    '/robots.txt': 'User-agent: *\nAllow: /',
    '/sitemap-index.xml': '<?xml version="1.0"?><sitemapindex/>',
    '/sitemap-0.xml': '<?xml version="1.0"?><urlset><url><loc>é</loc></url></urlset>\n',
  };
  for (const [p, body] of Object.entries(fixtures)) writeFileSync(join(dist, p.slice(1)), body);

  const fetch = await fetcher(dist);
  for (const [p, body] of Object.entries(fixtures)) {
    const res = await fetch(new Request(`https://lemon-agent.dev${p}`));
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), contentTypeFor(p));
    const expected = Buffer.from(body, 'utf8');
    assert.deepEqual(Buffer.from(await res.arrayBuffer()), expected);
    assert.equal(res.headers.get('content-length'), String(expected.byteLength));
  }

  const head = await fetch(new Request('https://lemon-agent.dev/llms.txt', { method: 'HEAD' }));
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
});

test('generator fails loudly on a missing surface', () => {
  const dist = mkdtempSync(join(tmpdir(), 'dist-empty-'));
  const r = spawnSync(process.execPath, [GENERATOR, dist, join(dist, 'out.js')], { encoding: 'utf8' });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr, /missing surface \/llms\.txt/);
});

test('serves the built dist bytes byte-identically', async (t) => {
  if (!existsSync(DIST)) return t.skip('no dist/ — run `npm run build` first');
  const fetch = await fetcher(DIST);
  for (const p of SURFACE_PATHS) {
    const res = await fetch(new Request(`https://lemon-agent.dev${p}`));
    assert.equal(res.headers.get('content-type'), contentTypeFor(p));
    assert.deepEqual(Buffer.from(await res.arrayBuffer()), readFileSync(join(DIST, p.slice(1))));
  }
});
