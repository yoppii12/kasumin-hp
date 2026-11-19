// 記事の要点スライドを、Instagram 用の縦長画像（1080×1350、PNG）に書き出す
//   npm run slides -- <slug>   … media/out-slides/<slug>-1.png, -2.png … を作る
// Playwright（Chromium）を使う。フォントは Google Fonts から読み込む（ネットワークが必要）
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { createRequire } from 'module';
import { parseSlide, renderSlide } from '../lib/slide.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const slug = process.argv[2];
if (!slug) {
  console.error('使い方: npm run slides -- <記事の slug>');
  process.exit(1);
}
const file = path.join(ROOT, 'content', 'articles', `${slug}.md`);
const { content } = matter(fs.readFileSync(file, 'utf-8'));
const blocks = [...content.matchAll(/```slide\n([\s\S]*?)```/g)].map((m) => parseSlide(m[1]));
if (!blocks.length) {
  console.error(`${slug} に slide ブロックがありません`);
  process.exit(1);
}

// メディア名は lib/site.ts の SITE.name（仮称）と同じものを使う
const siteTs = fs.readFileSync(path.join(ROOT, 'lib', 'site.ts'), 'utf-8');
const label = siteTs.match(/name:\s*'([^']+)'/)?.[1] ?? '';

// Playwright はこのパッケージの依存に入れていない（入っている環境で使う。NODE_PATH も見る）
let chromium;
try {
  ({ chromium } = createRequire(import.meta.url)('playwright'));
} catch {
  console.error('Playwright が見つかりません。npm i -D playwright && npx playwright install chromium を実行してください');
  process.exit(1);
}
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
const outDir = path.join(ROOT, 'out-slides');
fs.mkdirSync(outDir, { recursive: true });

for (const [i, slide] of blocks.entries()) {
  const svg = renderSlide(slide, label);
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&family=Noto+Sans+JP:wght@400;700&display=block">
<style>
  :root { --font-ja: 'Kosugi Maru', 'Noto Sans JP', sans-serif; --font-body: 'Noto Sans JP', sans-serif; }
  html, body { margin: 0; width: 1080px; height: 1350px; background: #FFFFFF; }
  body { display: flex; align-items: center; justify-content: center; }
  svg { width: 960px; height: auto; display: block; }
</style></head><body>${svg}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(outDir, `${slug}-${i + 1}.png`);
  await page.screenshot({ path: out });
  console.log(`書き出し: ${path.relative(ROOT, out)}`);
}
await browser.close();
