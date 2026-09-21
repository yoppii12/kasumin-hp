import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import BackLink from '@/components/BackLink';
import { getAllNews, getNewsBySlug } from '@/lib/news';
import styles from './article.module.css';

function formatDate(date: string) {
  const [y, m, d] = date.split('-');
  return `${y}.${Number(m)}.${Number(d)}`;
}

export function generateStaticParams() {
  return getAllNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsBySlug(slug);
  if (!post) return {};
  return {
    // 現行サイト準拠: 下層ページは固定タイトル（記事別titleは持たない）
    title: { absolute: '保育士・保護者・地域の笑顔をつなぐKASUMIN' },
    description: post.description,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `/news/${post.slug}`,
      publishedTime: post.date,
      images: post.ogImage ? [post.ogImage] : ['/images/og_default.png'],
    },
  };
}

export default async function NewsArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getNewsBySlug(slug);
  if (!post) notFound();

  // Google検索のリッチリザルト向け構造化データ
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    datePublished: post.date,
    mainEntityOfPage: `https://kasumin.biz/news/${post.slug}`,
    ...(post.ogImage ? { image: [`https://kasumin.biz${post.ogImage}`] } : {}),
    publisher: {
      '@type': 'Organization',
      name: '合同会社KASUMIN',
      logo: { '@type': 'ImageObject', url: 'https://kasumin.biz/images/og_default.png' },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main style={{ paddingTop: 'calc(var(--header-height) + 40px)' }}>
        <div className="container">
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.meta}>
            作成更新日：
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </p>

          {post.ogImage && <img className={styles.hero} src={post.ogImage} alt="" />}

          <div className={styles.body}>
            <article className="rich-text" dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>

          <BackLink fallback="/news" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
