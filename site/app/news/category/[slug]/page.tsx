import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import NewsList from '@/components/NewsList';
import HomeLink from '@/components/HomeLink';
import { getAllNews, CATEGORY_LABEL } from '@/lib/news';

// 現行サイトのカテゴリslug（URL維持のためそのまま使用）
const CATEGORIES = ['all', 'news', 'activity-report', 'other'];

export function generateStaticParams() {
  return CATEGORIES.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const label = CATEGORY_LABEL[slug] ?? slug;
  return {
    title: { absolute: '保育士・保護者・地域の笑顔をつなぐKASUMIN' },
    description:
      slug === 'all'
        ? '合同会社KASUMIN（カスミン）のすべてのニュース一覧です。'
        : `合同会社KASUMIN（カスミン）の「${label}」カテゴリのニュース一覧です。`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!CATEGORIES.includes(slug)) notFound();
  const news = getAllNews().filter((n) => slug === 'all' || n.categories.includes(slug));
  return (
    <>
      <SiteHeader />
      <main style={{ paddingTop: 'calc(var(--header-height) + 22px)' }}>
        <div className="container">
          <h1 className="page-title page-title--ja">ニュース</h1>
          <NewsList items={news} activeCategory={slug} />
          <HomeLink />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
