import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import LineCta from '@/components/LineCta';
import { LINKS } from '@/lib/site';
import { breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'えんまーるとは',
  description:
    'えんまーるは、短時間・単発のお仕事から保育に戻れる、保育士と保育園のための情報提供プラットフォームです。',
};

// 文言は document-hub-kasumin の master/サービス情報.md（HP の表記・2-1 の比較表）に合わせる
const ROWS = [
  ['対象', '全業種', '保育士・保育園に特化'],
  ['働き方', '常勤・正職員が中心', '午前のみ・単発・週1など、短時間・スポットの勤務から始められる'],
  ['掲載される情報', '定型の求人票', '園の写真・特徴・受け入れ時に大切にしていることなど、園の雰囲気が伝わる情報'],
  ['応募前の判断材料', '求人票の条件', '園プロフィールを見て、自分に合いそうか確かめてから応募できる。勤務後は他の保育士による園の評価も参考にできる'],
  ['勤務後', '—', '保育士と園がお互いを評価し、次の判断材料にする（相互評価）'],
];

export default function ServicePage() {
  const crumbs = [
    { name: 'トップ', path: '/' },
    { name: 'えんまーるとは', path: '/service' },
  ];
  return (
    <div className="container section">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumb items={crumbs} />
      <article className="article">
        <h1 className="article__title">えんまーるとは</h1>
        <div className="article__body">
          <p>
            子どもたちの安全と笑顔を守るために。もう一度保育に関わりたい保育士有資格者と、人手を必要とする保育園を“想い”でつなぐ情報提供プラットフォームです。互いに支え合いながら、保育士不足の解消と笑顔あふれる保育環境づくりに貢献します。
          </p>
          <h2>一般的な求人媒体との違い</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>観点</th><th>一般的な求人媒体</th><th>えんまーる</th></tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r[0]}>{r.map((c, i) => (i === 0 ? <th key={i}>{c}</th> : <td key={i}>{c}</td>))}</tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2>掲載中の園</h2>
          <p>
            えんまーるに掲載している園は、<a href={LINKS.enmaruNurseries}>園の一覧</a>でご覧いただけます。
          </p>
        </div>
        <LineCta position="service" />
      </article>
    </div>
  );
}
