import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PILLARS, getPillar } from '@/lib/pillars';
import { getArticlesByPillar } from '@/lib/articles';
import { ArticleList } from '@/components/ArticleCard';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import LineCta from '@/components/LineCta';
import { breadcrumbLd, collectionLd } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return PILLARS.map((p) => ({ pillar: p.slug }));
}

type Props = { params: Promise<{ pillar: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPillar((await params).pillar);
  return p ? { title: p.name, description: p.description } : {};
}

export default async function CategoryPage({ params }: Props) {
  const p = getPillar((await params).pillar);
  if (!p) notFound();
  // 柱の記事（isPillar）を先頭に置く
  const articles = getArticlesByPillar(p.slug).sort((a, b) => Number(b.isPillar) - Number(a.isPillar));
  const crumbs = [
    { name: 'トップ', path: '/' },
    { name: p.name, path: `/category/${p.slug}` },
  ];
  return (
    <div className="container section">
      <JsonLd data={[breadcrumbLd(crumbs), collectionLd(p.name, `/category/${p.slug}`, articles)]} />
      <Breadcrumb items={crumbs} />
      <h1 className="page-title">{p.name}</h1>
      <p className="page-lead">{p.description}</p>
      <ArticleList articles={articles} />
      <LineCta position="bottom" pillar={p.slug} />
    </div>
  );
}
