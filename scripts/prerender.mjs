/**
 * GitHub Pages has no rewrite rules: a request for /knowledge only works if a
 * file lives at /knowledge/index.html. After the Vite build this script copies
 * the built shell to every route the app serves, injecting that page's title
 * and description so links shared on social and search engines read correctly.
 * dist/404.html covers anything unlisted.
 */
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = root + 'dist/';

const SITE = 'TPAK';
const DEFAULT_DESCRIPTION =
  'สำรวจข้อมูลกิจกรรมทางกายของคนไทย ค้นหางานวิจัย บทความ และเครื่องมือจากศูนย์พัฒนาองค์ความรู้ด้านกิจกรรมทางกายประเทศไทย';

const articles = JSON.parse(
  await readFile(root + 'app/generated/articles.json', 'utf8'),
);

const routes = [
  { path: 'th', title: `TPAK | ค้นพบความรู้ ขยับสู่สุขภาวะที่ดี` },
  { path: 'knowledge', title: `คลังองค์ความรู้ | ${SITE}` },
  { path: 'data', title: `ข้อมูลและสถิติ | สำรวจกิจกรรมทางกายคนไทย | ${SITE}` },
  { path: 'about', title: `เกี่ยวกับ TPAK | วิสัยทัศน์ พันธกิจ และบุคลากร | ${SITE}` },
  { path: 'people', title: `บุคลากร | ${SITE}` },
  ...articles.map((a) => ({
    path: `article/${a.id}`,
    title: `${a.title} | ${SITE}`,
    description: a.summary,
  })),
];

const escape = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const shell = await readFile(dist + 'index.html', 'utf8');

for (const route of routes) {
  const html = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(route.title)}</title>`)
    .replace(
      /(<meta\s+name="description"\s+content=")[\s\S]*?(")/,
      (_m, open, close) =>
        open + escape(route.description ?? DEFAULT_DESCRIPTION) + close,
    );
  const dir = dist + route.path;
  await mkdir(dir, { recursive: true });
  await writeFile(dir + '/index.html', html);
}

// Fallback for unknown paths, and a marker so Pages skips Jekyll processing.
await copyFile(dist + 'index.html', dist + '404.html');
await writeFile(dist + '.nojekyll', '');

console.log(`prerendered ${routes.length} routes + 404.html`);
