// 記事の点検: frontmatter の必須項目・禁止語・次回点検日を確かめる
//   npm run check   … エラーがあれば終了コード1（CI で実行）
//   npm run stale   … 次回点検日（reviewBy）を過ぎた記事の一覧だけを出す
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIR = path.join(ROOT, 'content', 'articles');
const AUTHORS = new Set(
  fs.readdirSync(path.join(ROOT, 'content', 'authors')).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')),
);
const PILLARS = ['nagasaki', 'spot', 'short-time', 'return', 'nursery'];
const REQUIRED = ['slug', 'title', 'description', 'pillar', 'targetKeyword', 'author', 'publishedAt', 'updatedAt', 'reviewBy', 'cta'];

// 特定募集情報等提供事業の表現ルール（docs/260922_特定募集情報等提供_文言点検一覧.md）と
// 他社名を出さない方針（docs/261103_オウンドメディア設計案.md 7章）
const NG = [
  { re: /マッチング/, why: '職業紹介と誤認される（「応募」「情報提供」に言い換える）' },
  { re: /斡旋|あっせん/, why: '職業紹介と誤認される' },
  { re: /完全無料/, why: '的確表示（「登録・利用は無料」と条件を書く）' },
  { re: /採用(を|が)?保証|必ず採用/, why: '雇用の成立は保証しない' },
  { re: /タイミー|Timee|カイテク|シェアフル|メルカリ\s*ハロ|ショットワークス/i, why: '他社名は出さない方針' },
];
const WARN = [
  { re: /紹介/, why: '「職業紹介」と誤認されない文脈か確認（「ご紹介します」程度なら可）' },
  { re: /短期バイト|バイト/, why: '「短時間・単発のお仕事」が推奨表記' },
  { re: /人材と出会/, why: 'あっせん誤認の恐れ' },
];

const toDate = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v ? String(v) : '');
const today = new Date().toISOString().slice(0, 10);
const staleOnly = process.argv.includes('--stale');

let errors = 0;
let warns = 0;
const slugs = new Map();
const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_')) : [];

// 全記事の slug・下書きかどうか・柱の記事（内部リンクの点検に使う）
const index = new Map();
for (const f of files) {
  const { data } = matter(fs.readFileSync(path.join(DIR, f), 'utf-8'));
  index.set(data.slug ?? f.replace(/\.md$/, ''), { draft: Boolean(data.draft), pillar: data.pillar, isPillar: Boolean(data.isPillar) });
}
const pillarArticle = new Map([...index].filter(([, v]) => v.isPillar).map(([k, v]) => [v.pillar, k]));

// 本文の文字数（コメント・記号・表の罫線・リンクのURLを除く）
const visible = (s) =>
  s.replace(/<!--[\s\S]*?-->/g, '').replace(/```slide[\s\S]*?```/g, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[#|*`>\-:\s]/g, '');

for (const f of files) {
  const raw = fs.readFileSync(path.join(DIR, f), 'utf-8');
  const { data, content } = matter(raw);
  const err = (m) => { errors++; console.log(`ERROR ${f}: ${m}`); };
  const warn = (m) => { warns++; console.log(`WARN  ${f}: ${m}`); };
  const reviewBy = toDate(data.reviewBy);

  if (staleOnly) {
    if (reviewBy && reviewBy < today) console.log(`${reviewBy}  ${f}  ${data.title ?? ''}`);
    continue;
  }

  for (const k of REQUIRED) if (data[k] === undefined || data[k] === '') err(`必須項目 ${k} がない`);
  if (data.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(data.slug)) err(`slug は英小文字・数字・ハイフンだけ: ${data.slug}`);
  if (data.slug && slugs.has(data.slug)) err(`slug が ${slugs.get(data.slug)} と重複`);
  slugs.set(data.slug, f);
  if (data.pillar && !PILLARS.includes(data.pillar)) err(`pillar が不正: ${data.pillar}`);
  if (data.author && !AUTHORS.has(data.author)) err(`author が content/authors にない: ${data.author}`);
  if (data.reviewer && !AUTHORS.has(data.reviewer)) err(`reviewer が content/authors にない: ${data.reviewer}`);
  if (data.cta && !['line', 'line-area'].includes(data.cta)) err(`cta が不正: ${data.cta}`);
  if (toDate(data.updatedAt) < toDate(data.publishedAt)) err('updatedAt が publishedAt より前');
  if (!data.draft) {
    if (!Array.isArray(data.sources) || !data.sources.length) err('公開する記事は sources（出典）が1件以上必要');
    if (!Array.isArray(data.summary) || !data.summary.length) warn('summary（要点）がない');
    if (reviewBy && reviewBy < today) warn(`次回点検日 ${reviewBy} を過ぎている`);
    if (!data.image) warn('image（アイキャッチ）がない（OGP は既定の画像になる）');
    if (!data.notionUrl) warn('notionUrl（Notion の記事管理ページ）がない');
  }

  // 記事のルール（2026/11/06 決定。docs/261103_オウンドメディア設計案.md 13-4）
  // 1) 内部リンク: リンク先が存在すること（エラー）、公開する記事から下書きへリンクしないこと（エラー）、
  //    3本以上・柱の記事へ1本（注意）
  const links = [...new Set([...content.matchAll(/\]\(\/articles\/([a-z0-9-]+)\)/g)].map((m) => m[1]))];
  for (const l of links) {
    if (!index.has(l)) err(`内部リンク先の記事がない: /articles/${l}`);
    else if (!data.draft && index.get(l).draft) err(`下書きの記事へのリンクがある（公開すると404）: /articles/${l}`);
  }
  if (links.length < 3) warn(`内部リンクが ${links.length} 本（目安は3本以上）`);
  const pa = pillarArticle.get(data.pillar);
  if (!data.isPillar && pa && !links.includes(pa)) warn(`柱の記事（/articles/${pa}）へのリンクがない`);
  // 2) 監修者の表示
  if (!data.lead) warn('lead（冒頭の監修者紹介）がない');
  if (!['監修', '執筆'].includes(data.authorLabel)) warn('authorLabel（監修／執筆）がない');
  // 3) 文字数: 本文2,000字以上・各h2 200字以上を目安（lengthExempt: true の記事は除く）
  if (!data.lengthExempt) {
    const n = visible(content).length;
    if (n < 2000) warn(`本文 ${n} 字（目安は2,000字以上）`);
    for (const sec of content.split(/\n## /).slice(1)) {
      const [title, ...rest] = sec.split('\n');
      if (visible(rest.join('\n')).length < 200) warn(`h2「${title}」の本文が ${visible(rest.join('\n')).length} 字（目安は200字以上）`);
    }
  }

  const text = [data.title, data.description, ...(data.summary ?? []), ...(data.faq ?? []).flatMap((x) => [x.q, x.a]), content].join('\n');
  // 確認が終わっていない記事は公開できない（Notion の記事管理で「確認済み」にしてから draft: false にする）
  if (!data.draft && /【要確認】/.test(raw)) err('【要確認】が残っている。担当者の確認が終わるまで draft: true のままにする');

  for (const n of NG) if (n.re.test(text)) err(`禁止語 ${n.re} — ${n.why}`);
  for (const w of WARN) if (w.re.test(text)) warn(`注意語 ${w.re} — ${w.why}`);
}

if (!staleOnly) {
  console.log(`\n${files.length} 本を点検: エラー ${errors} 件・注意 ${warns} 件`);
  process.exit(errors ? 1 : 0);
}
