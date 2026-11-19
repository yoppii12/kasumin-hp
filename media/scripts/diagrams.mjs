// 本文の図（SVG）を content/diagrams/<名前>.yml から作る（public/images/diagrams/<名前>.svg）
//   npm run diagrams              … 全部
//   npm run diagrams -- <名前> …  … 指定した図だけ
// 図の形と書き方は lib/diagram.js の先頭コメントを見る。記事からは ![説明](/images/diagrams/<名前>.svg) で入れる
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { renderDiagram } from '../lib/diagram.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'content', 'diagrams');
const OUT = path.join(ROOT, 'public', 'images', 'diagrams');
const only = process.argv.slice(2);
const load = yaml.safeLoad ?? yaml.load;

fs.mkdirSync(OUT, { recursive: true });
let n = 0;
for (const f of fs.readdirSync(SRC).filter((x) => x.endsWith('.yml'))) {
  const name = f.replace(/\.yml$/, '');
  if (only.length && !only.includes(name)) continue;
  const d = load(fs.readFileSync(path.join(SRC, f), 'utf-8'));
  fs.writeFileSync(path.join(OUT, `${name}.svg`), renderDiagram(d, name) + '\n');
  console.log(`作成: public/images/diagrams/${name}.svg`);
  n++;
}
console.log(`${n} 枚を作成`);
