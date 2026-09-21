import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import HomeLink from '@/components/HomeLink';

export const metadata: Metadata = {
  title: { absolute: '保育士・保護者・地域の笑顔をつなぐKASUMIN' },
  description:
    '親子・保育者・地域のみなさんが出会い、つながるイベントの様子をお伝えします。',
};

// 現行サイト準拠: イベント記事は現在0件（一覧の枠だけ存在する）
export default function EventIndex() {
  return (
    <>
      <SiteHeader />
      <main style={{ paddingTop: 'calc(var(--header-height) + 22px)' }}>
        <div className="container">
          <h1 className="page-title page-title--ja">イベント運営</h1>
          <p className="page-lead">
            親子・保育者・地域のみなさんが出会い、つながるイベントの様子をお伝えします。
          </p>
          <HomeLink />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
