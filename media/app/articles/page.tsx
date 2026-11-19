import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/articles';
import { ArticleList } from '@/components/ArticleCard';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import { breadcrumbLd, collectionLd } from '@/lib/seo';

export const metadata: Metadata = { title: '記事一覧' };

// 記事が50本を超えたらページ送り（/articles/page/[n]）を追加する
export default function ArticlesPage() {
  const articles = getAllArticles();
  const crumbs = [
    { name: 'トップ', path: '/' },
    { name: '記事一覧', path: '/articles' },
  ];
  return (
    <div className="container section">
      <JsonLd data={[breadcrumbLd(crumbs), collectionLd('記事一覧', '/articles', articles)]} />
      <Breadcrumb items={crumbs} />
      <h1 className="page-title">記事一覧</h1>
      <ArticleList articles={articles} />
    </div>
  );
}
