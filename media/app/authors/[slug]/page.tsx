import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllAuthors, getAuthor } from '@/lib/authors';
import { getArticlesByAuthor } from '@/lib/articles';
import { ArticleList } from '@/components/ArticleCard';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import { breadcrumbLd, profilePageLd } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getAuthor((await params).slug);
  return a ? { title: `${a.name}のプロフィール`, description: a.shortBio } : {};
}

export default async function AuthorPage({ params }: Props) {
  const a = getAuthor((await params).slug);
  if (!a) notFound();
  const crumbs = [
    { name: 'トップ', path: '/' },
    { name: a.name, path: `/authors/${a.slug}` },
  ];
  return (
    <div className="container section">
      <JsonLd data={[breadcrumbLd(crumbs), profilePageLd(a)]} />
      <Breadcrumb items={crumbs} />
      <h1 className="page-title">{a.name}</h1>
      <p className="page-lead">{a.role}</p>
      <div className="article__body" dangerouslySetInnerHTML={{ __html: a.html }} />
      <section className="section">
        <h2 className="section__title">この人の記事</h2>
        <ArticleList articles={getArticlesByAuthor(a.slug)} />
      </section>
    </div>
  );
}
