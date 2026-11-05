import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/site';
import { getAllArticles, getArticle, getArticlesByPillar } from '@/lib/articles';
import { getAuthor } from '@/lib/authors';
import { getPillar } from '@/lib/pillars';
import { articleLd, breadcrumbLd, faqLd } from '@/lib/seo';
import Breadcrumb from '@/components/Breadcrumb';
import JsonLd from '@/components/JsonLd';
import LineCta from '@/components/LineCta';
import { ArticleList } from '@/components/ArticleCard';
import { ArticleByline, AuthorBox, AuthorLead, FaqSection, Sources, Summary } from '@/components/ArticleParts';

export const dynamicParams = false;

// 静的出力では空配列にできないため、記事が0本の間はダミーの slug を1つ返す（404 になる）
const PLACEHOLDER = '__no-article';

export function generateStaticParams() {
  const slugs = getAllArticles().map((a) => ({ slug: a.slug }));
  return slugs.length ? slugs : [{ slug: PLACEHOLDER }];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    robots: !SITE.indexable || a.noindex || a.draft ? { index: false, follow: true } : undefined,
    openGraph: {
      type: 'article',
      title: a.title,
      description: a.description,
      publishedTime: a.publishedAt,
      modifiedTime: a.updatedAt,
      images: [a.image ?? SITE.ogImage],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const author = getAuthor(a.author);
  const reviewer = getAuthor(a.reviewer);
  const pillar = getPillar(a.pillar)!;
  const crumbs = [
    { name: 'トップ', path: '/' },
    { name: pillar.name, path: `/category/${pillar.slug}` },
    { name: a.title, path: `/articles/${a.slug}` },
  ];
  const related = getArticlesByPillar(a.pillar).filter((r) => r.slug !== a.slug).slice(0, 4);
  const ld: object[] = [articleLd(a, author, reviewer), breadcrumbLd(crumbs)];
  if (a.faq.length) ld.push(faqLd(a.faq));

  return (
    <div className="container section">
      <JsonLd data={ld} />
      <Breadcrumb items={crumbs} />
      <article className="article">
        {a.draft && <p className="draft-badge">下書き（本番には出ません）</p>}
        <h1 className="article__title">{a.title}</h1>
        <ArticleByline a={a} author={author} reviewer={reviewer} />
        <AuthorLead a={a} author={author} />
        <Summary items={a.summary} />
        <div className="article__body" dangerouslySetInnerHTML={{ __html: a.html }} />
        <FaqSection faq={a.faq} />
        <Sources sources={a.sources} />
        <LineCta type={a.cta} position="bottom" articleSlug={a.slug} pillar={a.pillar} />
        <AuthorBox author={author} label={a.lead ? a.authorLabel : '執筆'} />
      </article>
      {related.length > 0 && (
        <section className="section">
          <h2 className="section__title">「{pillar.name}」の記事</h2>
          <ArticleList articles={related} />
        </section>
      )}
    </div>
  );
}
