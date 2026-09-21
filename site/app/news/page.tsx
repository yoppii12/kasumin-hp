import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import NewsList from '@/components/NewsList';
import HomeLink from '@/components/HomeLink';
import { getAllNews } from '@/lib/news';

export const metadata: Metadata = {
  title: { absolute: '保育士・保護者・地域の笑顔をつなぐKASUMIN' },
  description:
    '合同会社KASUMIN（カスミン）のニュース一覧。お知らせ・活動報告などの最新情報をお届けします。',
};

export default function NewsIndex() {
  const news = getAllNews();
  return (
    <>
      <SiteHeader />
      <main style={{ paddingTop: 'calc(var(--header-height) + 22px)' }}>
        <div className="container">
          <h1 className="page-title page-title--ja">ニュース</h1>
          <NewsList items={news} activeCategory="all" />
          <HomeLink />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
