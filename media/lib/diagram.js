// 本文の図（SVG）を描く。図の中身は content/diagrams/<名前>.yml に書き、npm run diagrams で
// public/images/diagrams/<名前>.svg を作る。記事からは ![説明](/images/diagrams/<名前>.svg) で入れる
// （ビルドのときにページに直接埋め込まれる。lib/articles.ts の inlineDiagrams）。
//
// 図の形（type）:
//   flow     … 手順の流れ（上から下へ）           steps: [{title, note}]
//   branch   … 場合分け（状況ごとの答え）         question, cases: [{if, then, note}]
//   scale    … 目盛り（年収・時間などの境目）     axis, marks: [{value, label, note, strong}]
//   ratio    … 割合（保育士1人に子ども何人）      unit, rows: [{label, count, note}]
//   relation … 契約の関係（だれとだれが契約するか） panels: [{name, nodes, links: [{from, to, label}], note}]
//   cards    … 比べる（横に並べず、縦に積む）     cards: [{name, tag, items}]
//
// 決まり: 図の内容は本文にも書く（図にしか無い情報は入れない）。配色はブランドガイドどおりで、
// ピンク #F4A7B9 は線・番号の丸・強調の枠だけ（文字には使わない）。幅 640（スマホでは約0.55倍）。
import { wrap } from './slide.js';

const W = 640;
const PAD = 24;
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const STYLE =
  '<style>.h{font:700 26px var(--font-ja,sans-serif);fill:#333}.b{font:400 22px var(--font-body,sans-serif);fill:#333}' +
  '.bb{font:700 24px var(--font-body,sans-serif);fill:#333}.s{font:400 20px var(--font-body,sans-serif);fill:#666}' +
  '.n{font:700 22px var(--font-body,sans-serif);fill:#333}.t{font:700 28px var(--font-ja,sans-serif);fill:#333}</style>';

// 複数行の文字（y は1行目のベースライン）
function lines(text, cls, x, y, size, maxW, lh, anchor = 'start') {
  const ls = wrap(String(text ?? ''), size, maxW);
  return {
    svg: ls.map((l, i) => `<text class="${cls}" x="${x}" y="${y + i * lh}"${anchor !== 'start' ? ` text-anchor="${anchor}"` : ''}>${esc(l)}</text>`).join(''),
    h: ls.length * lh,
    n: ls.length,
  };
}
const arrowDown = (x, y1, y2) =>
  `<path d="M${x} ${y1} V${y2 - 8}" stroke="#AAAAAA" stroke-width="3" fill="none"/><path d="M${x - 9} ${y2 - 12} L${x} ${y2} L${x + 9} ${y2 - 12}" stroke="#AAAAAA" stroke-width="3" fill="none"/>`;
const circleNum = (cx, cy, n) =>
  `<circle cx="${cx}" cy="${cy}" r="22" fill="#FFFFFF" stroke="#F4A7B9" stroke-width="2"/><text class="n" x="${cx}" y="${cy + 8}" text-anchor="middle">${esc(n)}</text>`;

function heading(d, o, y) {
  if (!d.title) return y;
  const t = lines(d.title, 't', 0, y + 30, 28, W, 38);
  o.push(t.svg);
  return y + t.h + 14;
}

function flow(d) {
  const o = [];
  let y = heading(d, o, 0);
  d.steps.forEach((s, i) => {
    const t = lines(s.title, 'h', 96, 0, 26, W - 96 - PAD, 34);
    const nt = s.note ? lines(s.note, 's', 96, 0, 20, W - 96 - PAD, 28) : { h: 0 };
    const h = 30 + t.h + (s.note ? 6 + nt.h : 0) + 18;
    o.push(`<rect x="1" y="${y}" width="${W - 2}" height="${h}" rx="14" fill="#F9F9F9" stroke="#E5E5E5" stroke-width="1.5"/>`);
    o.push(circleNum(52, y + h / 2, i + 1));
    o.push(lines(s.title, 'h', 96, y + 30 + 14, 26, W - 96 - PAD, 34).svg);
    if (s.note) o.push(lines(s.note, 's', 96, y + 30 + t.h + 18, 20, W - 96 - PAD, 28).svg);
    y += h;
    if (i < d.steps.length - 1) {
      o.push(arrowDown(52, y + 4, y + 36));
      y += 40;
    }
  });
  return { o, h: y + 4, label: [d.title, ...d.steps.map((s, i) => `${i + 1} ${s.title}${s.note ? `（${s.note}）` : ''}`)] };
}

function branch(d) {
  const o = [];
  let y = heading(d, o, 0);
  if (d.question) {
    const q = lines(d.question, 'bb', W / 2, y + 40, 24, W - PAD * 2, 32, 'middle');
    const h = q.h + 34;
    o.push(`<rect x="1" y="${y}" width="${W - 2}" height="${h}" rx="${h / 2 > 30 ? 30 : h / 2}" fill="#F9F9F9" stroke="#E5E5E5" stroke-width="1.5"/>`);
    o.push(q.svg);
    y += h + 16;
  }
  d.cases.forEach((c, i) => {
    const x = 96;
    const tw = W - x - PAD;
    const ifl = lines(c.if, 's', x, 0, 20, tw, 28);
    const thl = lines(`→ ${c.then}`, 'bb', x, 0, 24, tw, 32);
    const nl = c.note ? lines(c.note, 's', x, 0, 20, tw, 28) : { h: 0 };
    const h = 24 + ifl.h + 8 + thl.h + (c.note ? 6 + nl.h : 0) + 18;
    o.push(`<rect x="1" y="${y}" width="${W - 2}" height="${h}" rx="14" fill="#FFFFFF" stroke="#E5E5E5" stroke-width="1.5"/>`);
    o.push(circleNum(52, y + h / 2, i + 1));
    let yy = y + 24 + 18;
    o.push(lines(c.if, 's', x, yy, 20, tw, 28).svg);
    yy += ifl.h + 8;
    o.push(lines(`→ ${c.then}`, 'bb', x, yy, 24, tw, 32).svg);
    yy += thl.h + 6;
    if (c.note) o.push(lines(c.note, 's', x, yy, 20, tw, 28).svg);
    y += h + 12;
  });
  return { o, h: y, label: [d.title, d.question, ...d.cases.map((c, i) => `${i + 1} ${c.if}→${c.then}${c.note ? `（${c.note}）` : ''}`)] };
}

function scale(d) {
  const o = [];
  let y = heading(d, o, 0);
  const ax = 172; // 目盛りの線の x
  const x = ax + 32;
  const tw = W - x - PAD;
  const top = y;
  if (d.axis) {
    o.push(`<text class="s" x="${ax}" y="${y + 20}" text-anchor="middle">${esc(d.axis)}</text>`);
    y += 40;
  }
  const rows = [];
  for (const m of d.marks) {
    const ll = lines(m.label, 'bb', x + 18, 0, 24, tw - 36, 32);
    const nl = m.note ? lines(m.note, 's', x + 18, 0, 20, tw - 36, 28) : { h: 0 };
    const h = 20 + ll.h + (m.note ? 4 + nl.h : 0) + 16;
    rows.push({ m, y, h });
    y += h + 14;
  }
  const lineTop = top + (d.axis ? 34 : 0);
  o.push(`<path d="M${ax} ${lineTop} V${y - 4}" stroke="#AAAAAA" stroke-width="3"/>`);
  o.push(`<path d="M${ax - 9} ${y - 16} L${ax} ${y - 4} L${ax + 9} ${y - 16}" stroke="#AAAAAA" stroke-width="3" fill="none"/>`);
  for (const { m, y: ry, h } of rows) {
    const cy = ry + h / 2;
    const strong = Boolean(m.strong);
    o.push(`<rect x="${x}" y="${ry}" width="${W - x - 1}" height="${h}" rx="12" fill="${strong ? '#FFFFFF' : '#F9F9F9'}" stroke="${strong ? '#F4A7B9' : '#E5E5E5'}" stroke-width="${strong ? 2.5 : 1.5}"/>`);
    o.push(`<circle cx="${ax}" cy="${cy}" r="8" fill="#FFFFFF" stroke="#F4A7B9" stroke-width="3"/>`);
    o.push(`<path d="M${ax + 8} ${cy} H${x}" stroke="#E5E5E5" stroke-width="2"/>`);
    o.push(lines(m.value, 'bb', ax - 18, cy + 8, 24, ax - 22, 30, 'end').svg);
    o.push(lines(m.label, 'bb', x + 18, ry + 20 + 18, 24, tw - 36, 32).svg);
    if (m.note) o.push(lines(m.note, 's', x + 18, ry + 20 + 24 + (wrap(m.label, 24, tw - 36).length - 1) * 32 + 30, 20, tw - 36, 28).svg);
  }
  return { o, h: y, label: [d.title, d.axis, ...d.marks.map((m) => `${m.value} ${m.label}${m.note ? `（${m.note}）` : ''}`)] };
}

function ratio(d) {
  const o = [];
  let y = heading(d, o, 0);
  const r = 10;
  const gap = 6;
  const x0 = 200;
  const perLine = Math.floor((W - x0 - PAD) / (r * 2 + gap));
  for (const row of d.rows) {
    const n = Number(row.count);
    const nLines = Math.ceil(n / perLine);
    const iconsH = nLines * (r * 2 + gap);
    const nl = row.note ? lines(row.note, 's', x0, 0, 20, W - x0 - PAD, 28) : { h: 0 };
    const h = Math.max(96, 24 + 32 + 10 + iconsH + (row.note ? 8 + nl.h : 0) + 12);
    o.push(`<rect x="1" y="${y}" width="${W - 2}" height="${h}" rx="14" fill="#F9F9F9" stroke="#E5E5E5" stroke-width="1.5"/>`);
    o.push(`<text class="h" x="${PAD}" y="${y + 46}">${esc(row.label)}</text>`);
    // 保育士（ピンクの枠の丸）
    o.push(`<circle cx="${PAD + 26}" cy="${y + 78}" r="16" fill="#FFFFFF" stroke="#F4A7B9" stroke-width="2.5"/><text class="s" x="${PAD + 52}" y="${y + 85}">保育士1人</text>`);
    o.push(`<text class="bb" x="${x0}" y="${y + 46}">子ども ${n}${esc(d.unit ?? '人')}</text>`);
    for (let i = 0; i < n; i++) {
      const cx = x0 + r + (i % perLine) * (r * 2 + gap);
      const cy = y + 66 + r + Math.floor(i / perLine) * (r * 2 + gap);
      o.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#AAAAAA"/>`);
    }
    if (row.note) o.push(lines(row.note, 's', x0, y + 66 + iconsH + 26, 20, W - x0 - PAD, 28).svg);
    y += h + 12;
  }
  return { o, h: y, label: [d.title, ...d.rows.map((r) => `${r.label}：保育士1人に子ども${r.count}人${r.note ? `（${r.note}）` : ''}`)] };
}

function relation(d) {
  const o = [];
  let y = heading(d, o, 0);
  for (const p of d.panels) {
    const top = y;
    y += 20;
    const nm = lines(p.name, 'h', PAD, y + 26, 26, W - PAD * 2, 34);
    o.push(nm.svg);
    y += nm.h + 20;
    const n = p.nodes.length;
    const bw = n === 2 ? 180 : 150;
    const bh = 64;
    const span = W - PAD * 2 - bw;
    const xs = p.nodes.map((_, i) => PAD + (n === 1 ? span / 2 : (span * i) / (n - 1)));
    const by = y + 34;
    // 隣どうしの線（上にラベル）、離れた線（下に弧とラベル）
    let below = 0;
    for (const l of p.links ?? []) {
      const [a, b] = [Math.min(l.from, l.to), Math.max(l.from, l.to)];
      if (b - a === 1) {
        const x1 = xs[a] + bw;
        const x2 = xs[b];
        o.push(`<path d="M${x1} ${by + bh / 2} H${x2}" stroke="#F4A7B9" stroke-width="3"/>`);
        o.push(lines(l.label, 's', (x1 + x2) / 2, by - 10 - (wrap(l.label, 20, x2 - x1 + 40).length - 1) * 26, 20, x2 - x1 + 40, 26, 'middle').svg);
      } else {
        const x1 = xs[a] + bw / 2;
        const x2 = xs[b] + bw / 2;
        const yy = by + bh + 44;
        o.push(`<path d="M${x1} ${by + bh} V${yy} H${x2} V${by + bh}" stroke="#AAAAAA" stroke-width="2.5" stroke-dasharray="8 6" fill="none"/>`);
        o.push(`<text class="s" x="${(x1 + x2) / 2}" y="${yy + 28}" text-anchor="middle">${esc(l.label)}</text>`);
        below = 80;
      }
    }
    p.nodes.forEach((node, i) => {
      o.push(`<rect x="${xs[i]}" y="${by}" width="${bw}" height="${bh}" rx="12" fill="#FFFFFF" stroke="#333333" stroke-width="2"/>`);
      o.push(`<text class="bb" x="${xs[i] + bw / 2}" y="${by + bh / 2 + 9}" text-anchor="middle">${esc(node)}</text>`);
    });
    y = by + bh + below + 20;
    if (p.note) {
      const nl = lines(p.note, 's', PAD, y + 20, 20, W - PAD * 2, 28);
      o.push(nl.svg);
      y += nl.h + 10;
    }
    y += 14;
    o.unshift(`<rect x="1" y="${top}" width="${W - 2}" height="${y - top}" rx="14" fill="#F9F9F9" stroke="#E5E5E5" stroke-width="1.5"/>`);
    y += 16;
  }
  return {
    o,
    h: y - 16,
    label: [d.title, ...d.panels.map((p) => `${p.name}：${(p.links ?? []).map((l) => `${p.nodes[l.from]}と${p.nodes[l.to]}（${l.label}）`).join('、')}${p.note ? `。${p.note}` : ''}`)],
  };
}

function cards(d) {
  const o = [];
  let y = heading(d, o, 0);
  for (const c of d.cards) {
    const top = y;
    const nm = lines(c.name, 'h', PAD, y + 40, 26, W - PAD * 2, 34);
    let yy = y + 40 + nm.h - 34 + 14;
    const parts = [nm.svg];
    if (c.tag) {
      const tl = lines(c.tag, 's', PAD, yy + 24, 20, W - PAD * 2, 28);
      parts.push(tl.svg);
      yy += tl.h + 6;
    }
    for (const it of c.items ?? []) {
      const il = lines(it, 'b', PAD + 22, yy + 30, 22, W - PAD * 2 - 22, 30);
      parts.push(`<circle cx="${PAD + 6}" cy="${yy + 22}" r="5" fill="#F4A7B9"/>`, il.svg);
      yy += il.h + 6;
    }
    yy += 22;
    o.push(`<rect x="1" y="${top}" width="${W - 2}" height="${yy - top}" rx="14" fill="#F9F9F9" stroke="#E5E5E5" stroke-width="1.5"/>`, ...parts);
    y = yy + 12;
  }
  return { o, h: y, label: [d.title, ...d.cards.map((c) => `${c.name}${c.tag ? `（${c.tag}）` : ''}：${(c.items ?? []).join('、')}`)] };
}

const RENDER = { flow, branch, scale, ratio, relation, cards };

export function renderDiagram(d, id = 'fig') {
  const fn = RENDER[d.type];
  if (!fn) throw new Error(`図の type が不明: ${d.type}`);
  const { o, h, label } = fn(d);
  const H = Math.ceil(h + 2);
  const aria = label.filter(Boolean).join('／');
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="${id}-t">`,
    `<title id="${id}-t">${esc(aria)}</title>`,
    STYLE,
    ...o,
    '</svg>',
  ].join('\n');
}
