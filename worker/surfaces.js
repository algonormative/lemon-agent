// Machine-readable surfaces served from code, not the Pages static layer:
// Pages applies its Browser Integrity Check to every request that reaches the
// Pages project (static assets AND Functions), 403ing `error code: 1010` for
// Python-stdlib User-Agents. A Worker attached to the zone via `routes` is not
// subject to it. See worker/wrangler.toml.

export const SURFACE_PATHS = [
  '/llms.txt',
  '/catalog.json',
  '/robots.txt',
  '/sitemap-index.xml',
  '/sitemap-0.xml',
];

const TYPES = {
  txt: 'text/plain; charset=utf-8',
  json: 'application/json',
  xml: 'application/xml',
};

export function contentTypeFor(path) {
  const ext = path.slice(path.lastIndexOf('.') + 1);
  const type = TYPES[ext];
  if (!type) throw new Error(`no content-type mapping for ${path}`);
  return type;
}

const decode = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

export function createFetch(surfaces) {
  const table = new Map(
    Object.entries(surfaces).map(([path, s]) => [path, { type: s.type, bytes: decode(s.b64) }]),
  );
  return (request) => {
    const hit = table.get(new URL(request.url).pathname);
    if (!hit || (request.method !== 'GET' && request.method !== 'HEAD')) {
      // Never dead-end: anything this route pattern over-matches goes to Pages.
      return fetch(request);
    }
    return new Response(request.method === 'HEAD' ? null : hit.bytes, {
      headers: {
        'content-type': hit.type,
        'content-length': String(hit.bytes.byteLength),
        'cache-control': 'public, max-age=0, must-revalidate',
        'x-content-type-options': 'nosniff',
      },
    });
  };
}
