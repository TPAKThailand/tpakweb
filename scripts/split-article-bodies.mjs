/**
 * article-bodies.json is 2.7 MB of stored HTML for 86 articles. Bundling it
 * means every reader downloads all of them to read one, so this splits it into
 * one static file per article that the article page fetches on demand.
 *
 * Build writes straight into dist/ (after Vite has emptied it); `npm run dev`
 * writes into public/ instead, where the dev server can serve it. Neither
 * output is committed.
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const target = process.argv[2] === 'dev' ? 'public' : 'dist';
const outDir = `${root}${target}/article-bodies`;

const bodies = JSON.parse(
  await readFile(root + 'app/generated/article-bodies.json', 'utf8'),
);

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

let count = 0;
for (const [id, html] of Object.entries(bodies)) {
  if (!/^[\w-]+$/.test(id)) continue;
  await writeFile(`${outDir}/${id}.json`, JSON.stringify({ html }));
  count += 1;
}

console.log(`split ${count} article bodies into ${target}/article-bodies/`);
