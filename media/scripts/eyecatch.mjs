// 記事のアイキャッチ（1200×630 の JPG）を、記事ファイルの eyecatch の内容から作る。Canva は使わない
//   npm run eyecatch                 … 全記事を作り直す（public/images/articles/<slug>.jpg）
//   npm run eyecatch -- <slug> …     … 指定した記事だけ
//
// 記事の frontmatter に次のように書く（ラベルは柱の名前、右下はメディア名が自動で入る）:
//   eyecatch:
//     type: "A"              # A: 文字だけ（制度・お金など）／B: 左に著者の写真（経験・一人称の記事）
//     main: "扶養内"          # A: 大きな文字（数字・キーワード）
//     accent: "の計算"        # A: 大きな文字のあとに続く文字（任意。改行を入れると2行で小さく並ぶ）
//     title: "午前だけ働く\n保育士の一日"  # B: 2行の見出し（1行9字まで）
//     sub: "所得税178万円・社会保険130万円（2026年）"  # 下の補足（1行。長いと文字が小さくなる）
//
// デザインは Canva のテンプレート（型A・型B、2026/11/07）と同じ。配色はブランドガイドどおり
// （ピンク #F4A7B9 はラベルの枠と線だけ。文字には使わない）。
// 文字は Noto Sans JP（Google Fonts から読み込む）。読み込めないときは止まる（別の字体で作らないため）。
// Playwright（Chromium）を使う。依存には入れていない（入っている環境で使う。NODE_PATH も見る）
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import matter from 'gray-matter';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIR = path.join(ROOT, 'content', 'articles');
const OUT = path.join(ROOT, 'public', 'images', 'articles');
const only = process.argv.slice(2);

// 柱の名前とメディア名は、サイトの設定ファイルから読む（ここに二重に書かない）
const pillarsSrc = fs.readFileSync(path.join(ROOT, 'lib', 'pillars.ts'), 'utf-8');
const PILLAR_NAME = Object.fromEntries([...pillarsSrc.matchAll(/slug: '([^']+)',\s*name: '([^']+)'/g)].map((m) => [m[1], m[2]]));
const siteSrc = fs.readFileSync(path.join(ROOT, 'lib', 'site.ts'), 'utf-8');
const pick = (k) => (siteSrc.match(new RegExp(`${k}: '([^']*)'`)) || [])[1] ?? '';
const NAME_PREFIX = pick('namePrefix');
const SHORT_NAME = pick('shortName');

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const br = (s) => esc(s).replace(/\n/g, '<br>');

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=block');
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#fff;font-family:'Noto Sans JP',sans-serif;color:#333;position:relative;overflow:hidden}
.label{position:absolute;top:65px;left:100px;height:66px;padding:0 28px;border:2px solid #F4A7B9;border-radius:10px;display:flex;align-items:center;font-weight:700;font-size:24px;background:#fff}
.band{position:absolute;top:157px;left:0;width:1200px;height:224px;background:#F4F4F4;display:flex;align-items:center;justify-content:center}
.fit{display:flex;align-items:center;gap:18px;white-space:nowrap}
.main{font-weight:700;line-height:1}
.acc{font-weight:700;line-height:1.15}
.line{position:absolute;top:388px;left:100px;width:1000px;height:2px;background:#F4A7B9}
.sub{position:absolute;top:418px;left:100px;width:1000px;text-align:center;font-weight:700;white-space:nowrap}
.name{position:absolute;right:70px;bottom:36px;font-weight:700;font-size:22px}
.name small{font-size:16px;margin-right:6px;font-weight:400;color:#666}
.panel{position:absolute;left:0;top:0;width:460px;height:630px;background:#F9F9F9}
.photo{position:absolute;left:30px;top:115px;width:400px;height:400px;object-fit:cover}
.b .label{left:520px}
.b .title{position:absolute;left:520px;top:190px;width:640px;font-weight:700;line-height:1.3;white-space:nowrap}
.b .line{left:520px;top:405px;width:620px}
.b .sub{left:520px;top:440px;width:640px;text-align:left}
`;

function html(e, label, photo) {
  const name = `<div class="name"><small>${esc(NAME_PREFIX)}</small>${esc(SHORT_NAME)}</div>`;
  if (e.type === 'B') {
    return `<div class="b"><div class="panel"></div>${photo ? `<img class="photo" src="${photo}" alt="">` : ''}
      <div class="label">${esc(label)}</div><div class="title" data-max="64" data-w="640">${br(e.title)}</div>
      <div class="line"></div><div class="sub" data-max="34" data-w="620">${esc(e.sub)}</div></div>${name}`;
  }
  const twoLine = String(e.accent ?? '').includes('\n');
  return `<div class="label">${esc(label)}</div>
    <div class="band"><div class="fit" data-w="1000"><span class="main">${esc(e.main)}</span>${
      e.accent ? `<span class="acc" data-ratio="${twoLine ? 0.5 : 0.8}">${br(e.accent)}</span>` : ''
    }</div></div>
    <div class="line"></div><div class="sub" data-max="44" data-w="1000">${esc(e.sub)}</div>${name}`;
}

// 文字があふれないよう、枠の幅に収まるまで文字を小さくする
function fitText() {
  for (const el of document.querySelectorAll('.fit')) {
    const max = Number(el.dataset.w);
    const main = el.querySelector('.main');
    const acc = el.querySelector('.acc');
    for (let size = 110; size >= 40; size -= 2) {
      main.style.fontSize = `${size}px`;
      if (acc) acc.style.fontSize = `${Math.round(size * Number(acc.dataset.ratio))}px`;
      if (el.scrollWidth <= max) break;
    }
  }
  for (const el of document.querySelectorAll('[data-max]')) {
    const max = Number(el.dataset.w);
    for (let size = Number(el.dataset.max); size >= 24; size -= 1) {
      el.style.fontSize = `${size}px`;
      el.style.width = 'auto';
      const w = el.scrollWidth;
      el.style.width = '';
      if (w <= max) break;
    }
  }
}

let chromium;
try {
  ({ chromium } = createRequire(import.meta.url)('playwright'));
} catch {
  console.error('Playwright が見つかりません。npm i -D playwright && npx playwright install chromium を実行してください（または NODE_PATH を設定）');
  process.exit(1);
}

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_'));
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
let made = 0;
let failed = 0;
for (const f of files) {
  const { data } = matter(fs.readFileSync(path.join(DIR, f), 'utf-8'));
  if (only.length && !only.includes(data.slug)) continue;
  const e = data.eyecatch;
  if (!e) {
    console.log(`とばす: ${data.slug}（eyecatch がない）`);
    continue;
  }
  let photo = '';
  if (e.type === 'B') {
    const au = matter(fs.readFileSync(path.join(ROOT, 'content', 'authors', `${data.author}.md`), 'utf-8')).data;
    const img = au.image ? path.join(ROOT, 'public', au.image) : '';
    if (img && fs.existsSync(img)) photo = `data:image/jpeg;base64,${fs.readFileSync(img).toString('base64')}`;
  }
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${html(e, PILLAR_NAME[data.pillar] ?? '', photo)}</body></html>`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const fontOk = await page.evaluate(() => document.fonts.check("700 20px 'Noto Sans JP'"));
  if (!fontOk) {
    console.error('Noto Sans JP を読み込めませんでした（ネットワークを確認してください）。作るのをやめます');
    failed++;
    break;
  }
  await page.evaluate(fitText);
  const file = path.join(OUT, `${data.slug}.jpg`);
  await page.screenshot({ path: file, type: 'jpeg', quality: 88 });
  console.log(`作成: public/images/articles/${data.slug}.jpg`);
  made++;
}
await browser.close();
console.log(`${made} 枚を作成${failed ? '（途中で止まりました）' : ''}`);
if (failed) process.exit(1);
