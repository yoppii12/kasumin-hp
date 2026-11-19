// 記事の「サイトでの見え方」（スマホ幅）を1枚の縦長画像に撮る。Notion のドラフトに貼るため
//   MEDIA_SHOW_DRAFTS=1 npm run build   … 下書きも含めてビルドしてから
//   npm run preview -- <slug> [<slug> …]  … media/out-preview/<slug>-mobile.jpg を作る
// Playwright（Chromium）を使う。依存には入れていない（入っている環境で使う。NODE_PATH も見る）
import fs from 'fs';
import http from 'http';
import path from 'path';
import { createRequire } from 'module';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'out');
const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error('使い方: npm run preview -- <記事の slug> [<slug> …]');
  process.exit(1);
}
if (!fs.existsSync(OUT)) {
  console.error('out/ がありません。先に MEDIA_SHOW_DRAFTS=1 npm run build を実行してください');
  process.exit(1);
}

let chromium;
try {
  ({ chromium } = createRequire(import.meta.url)('playwright'));
} catch {
  console.error('Playwright が見つかりません。npm i -D playwright && npx playwright install chromium を実行してください');
  process.exit(1);
}

// out/ をそのまま配信する簡易サーバー（/articles/x → articles/x.html）
const server = http.createServer((req, res) => {
  const p = decodeURIComponent((req.url || '/').split('?')[0]);
  const f = path.join(OUT, p);
  for (const c of [f, `${f}.html`, path.join(f, 'index.html')]) {
    if (c.startsWith(OUT) && fs.existsSync(c) && fs.statSync(c).isFile()) {
      res.end(fs.readFileSync(c));
      return;
    }
  }
  res.statusCode = 404;
  res.end();
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const dir = path.join(ROOT, 'out-preview');
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch();
// iPhone 相当の幅（390px）・2倍密度
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
for (const slug of slugs) {
  const res = await page.goto(`http://localhost:${port}/articles/${slug}`);
  if (!res || res.status() !== 200) {
    console.error(`${slug}: ページがありません（下書きなら MEDIA_SHOW_DRAFTS=1 でビルドしたか確認）`);
    continue;
  }
  await page.evaluate(() => document.fonts.ready);
  const file = path.join(dir, `${slug}-mobile.jpg`);
  await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 80 });
  console.log(`撮影: ${path.relative(ROOT, file)}`);
}
await browser.close();
server.close();
