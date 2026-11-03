import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import { SITE, PUBLISHER } from '@/lib/site';
import { breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = { title: 'このメディアについて', description: `${SITE.name}の編集方針と運営会社` };

export default function AboutPage() {
  const crumbs = [
    { name: 'トップ', path: '/' },
    { name: 'このメディアについて', path: '/about' },
  ];
  return (
    <div className="container section">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumb items={crumbs} />
      <article className="article">
        <h1 className="article__title">このメディアについて</h1>
        <div className="article__body">
          <p>
            {SITE.name}は、保育士資格を持ちながら現場を離れている方が、もう一度保育に関わるための情報を届けるメディアです。保育士の働き方と復職支援の情報提供プラットフォーム「えんまーる」を運営する{PUBLISHER.name}が編集しています。
          </p>
          <h2>編集方針</h2>
          <ul>
            <li>制度・金額・日程は、国・県・市などの一次資料を出典として記事に載せます。</li>
            <li>記事には公開日と最終更新日を載せ、制度の変更があれば更新します。</li>
            <li>税・社会保険・労働法令に関わる記事は、専門家の確認を受けて公開し、確認者を記事に載せます。</li>
            <li>保育の現場の経験に基づく記事は、執筆者の経験として書き、執筆者のプロフィールを公開します。</li>
          </ul>
          <h2>運営会社</h2>
          <p>
            <a href={PUBLISHER.url}>{PUBLISHER.name}</a>
          </p>
          <p>
            執筆者: <Link href="/authors/hirata-kasumi">平田 香澄</Link>
          </p>
        </div>
      </article>
    </div>
  );
}
