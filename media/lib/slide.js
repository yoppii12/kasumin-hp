// 要点スライド（本文に埋め込む SVG）を描く。
// 記事の Markdown に次のように書くと、この関数で SVG になる（lib/articles.ts から呼ぶ）。
//
// ```slide
// title: 見出し
// - 要点1
// - 要点2
// summary: 一行のまとめ
// ```
//
// 配色はブランドガイドどおり（ピンク #F4A7B9 は左の細い線と番号の丸だけ。文字には使わない）。
// スマホ幅（約360px）で要点の文字が約15pxになるよう、viewBox 幅 640・要点 26px で組む。

const W = 640;
const PAD = 32;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// 日本語は1文字＝フォントサイズ分の幅、半角は約0.55倍として折り返す
function wrap(text, fontSize, maxWidth) {
  const lines = [];
  let line = '';
  let w = 0;
  for (const ch of text) {
    const cw = /[\x20-\x7e]/.test(ch) ? fontSize * 0.55 : fontSize;
    if (w + cw > maxWidth && line) {
      lines.push(line);
      line = '';
      w = 0;
    }
    line += ch;
    w += cw;
  }
  if (line) lines.push(line);
  return lines;
}

export function parseSlide(src) {
  const slide = { title: '', points: [], summary: '' };
  for (const raw of src.split('\n')) {
    const l = raw.trim();
    if (l.startsWith('title:')) slide.title = l.slice(6).trim();
    else if (l.startsWith('summary:')) slide.summary = l.slice(8).trim();
    else if (l.startsWith('- ')) slide.points.push(l.slice(2).trim());
  }
  return slide;
}

export function renderSlide(slide, label) {
  const o = [];
  let y = PAD + 4;
  // メディア名（小さく）
  o.push(`<text class="sl-label" x="${PAD}" y="${y + 18}">${esc(label)}</text>`);
  y += 40;
  // 見出し
  for (const l of wrap(slide.title, 34, W - PAD * 2)) {
    y += 40;
    o.push(`<text class="sl-title" x="${PAD}" y="${y}">${esc(l)}</text>`);
  }
  y += 24;
  // 要点（番号つきのカード）
  const textX = PAD + 76;
  const textW = W - textX - PAD - 16;
  slide.points.forEach((p, i) => {
    const lines = wrap(p, 26, textW);
    const h = 30 + lines.length * 36;
    o.push(`<rect x="${PAD}" y="${y}" width="${W - PAD * 2}" height="${h}" rx="12" fill="#F9F9F9"/>`);
    o.push(`<circle cx="${PAD + 38}" cy="${y + h / 2}" r="20" fill="#FFFFFF" stroke="#F4A7B9" stroke-width="2"/>`);
    o.push(`<text class="sl-num" x="${PAD + 38}" y="${y + h / 2 + 8}" text-anchor="middle">${i + 1}</text>`);
    lines.forEach((l, j) => {
      o.push(`<text class="sl-point" x="${textX}" y="${y + 15 + 27 + j * 36}">${esc(l)}</text>`);
    });
    y += h + 12;
  });
  // 一行のまとめ
  if (slide.summary) {
    y += 14;
    for (const l of wrap(slide.summary, 26, W - PAD * 2)) {
      y += 36;
      o.push(`<text class="sl-summary" x="${PAD}" y="${y}">${esc(l)}</text>`);
    }
  }
  const H = y + PAD;
  const title = [slide.title, ...slide.points.map((p, i) => `${i + 1} ${p}`), slide.summary].filter(Boolean).join('／');
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}">`,
    '<style>.sl-label{font:400 18px var(--font-body,sans-serif);fill:#666;letter-spacing:.06em}.sl-title{font:700 34px var(--font-ja,sans-serif);fill:#333}.sl-point{font:400 26px var(--font-body,sans-serif);fill:#333}.sl-num{font:700 22px var(--font-body,sans-serif);fill:#333}.sl-summary{font:700 26px var(--font-body,sans-serif);fill:#333}</style>',
    `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="16" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="2"/>`,
    `<rect x="1" y="24" width="6" height="${H - 48}" fill="#F4A7B9"/>`,
    ...o,
    '</svg>',
  ].join('\n');
}

// 本文の ```slide ブロックを、図（<figure>）の HTML に置き換える
export function replaceSlides(markdown, label) {
  return markdown.replace(/```slide\n([\s\S]*?)```/g, (_m, src) => {
    const svg = renderSlide(parseSlide(src), label);
    return `<figure class="diagram slide">\n${svg}\n</figure>\n`;
  });
}
