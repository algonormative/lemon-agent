import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

// The five paid 402 properties the hub must link, on every surface.
const PROPERTIES = [
  { id: 'toolshed', url: 'https://toolshed.lemon-agent.dev' },
  { id: '10x402', url: 'https://10x402.com' },
  { id: 'kino402', url: 'https://kino402.com' },
  { id: 'penny402', url: 'https://penny402.fun' },
  { id: 'parallax', url: 'https://parallax402.com' },
];

const catalog = JSON.parse(read('public/catalog.json'));
const llms = read('public/llms.txt');
const index = read('src/pages/index.astro');

test('catalog.json lists all five properties with url, description and price', () => {
  for (const { id, url } of PROPERTIES) {
    const member = catalog.members.find((m) => m.id === id);
    assert.ok(member, `catalog.json has no member with id ${id}`);
    assert.equal(member.url, url);
    assert.ok(member.kind, `${id} has no kind`);
    assert.ok(member.status, `${id} has no status`);
    assert.ok(member.how_to_use?.length > 0, `${id} has no how_to_use`);
    assert.ok(member.price_range?.length > 0, `${id} has no price_range`);
  }
});

test('every property appears verbatim in llms.txt and index.astro (no drift)', () => {
  for (const { id, url } of PROPERTIES) {
    const { how_to_use, price_range } = catalog.members.find((m) => m.id === id);
    for (const [name, text] of [['public/llms.txt', llms], ['src/pages/index.astro', index]]) {
      assert.ok(text.includes(url), `${name} is missing ${id} url ${url}`);
      assert.ok(text.includes(how_to_use), `${name} is missing ${id} description "${how_to_use}"`);
      assert.ok(text.includes(price_range), `${name} is missing ${id} price "${price_range}"`);
    }
  }
});
