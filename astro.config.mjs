// Deployed to Cloudflare Pages (direct upload: `npm run deploy`).
// Temporary domain until the real one is registered — swap `site` then.
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { exampleToHast, loadExample } from './src/lib/example-widget.mjs';

// Replace <div data-example="<id>"> placeholders in markdown with the
// rendered interactive-example widget (examples/<id>.json). The
// placeholder's own children (a link to the standalone page) remain the
// fallback in the raw markdown served at /guide/*.md.
function rehypeExamples() {
  return (tree) => {
    const walk = (node) => {
      // Placeholder already parsed to an element (rehype-raw ran first).
      if (node.type === 'element' && node.properties?.dataExample) {
        const ex = loadExample(node.properties.dataExample);
        node.properties.className = ['xmpl-embed'];
        node.children = [exampleToHast(ex)];
        return;
      }
      // Placeholder still a raw-HTML node (plugin ran before rehype-raw).
      const children = node.children || [];
      children.forEach((child, i) => {
        if (child.type === 'raw' && child.value?.includes('data-example=')) {
          const m = child.value.match(/data-example="([a-z0-9-]+)"/);
          if (m) {
            const ex = loadExample(m[1]);
            children[i] = {
              type: 'element',
              tagName: 'div',
              properties: { className: ['xmpl-embed'] },
              children: [exampleToHast(ex)],
            };
            return;
          }
        }
        walk(child);
      });
    };
    walk(tree);
  };
}

export default defineConfig({
  site: 'https://lemon-agent.dev',
  integrations: [sitemap()],
  redirects: {
    '/receipts': '/guides/payments/house-receipts/',
  },
  markdown: {
    rehypePlugins: [rehypeExamples],
  },
});
