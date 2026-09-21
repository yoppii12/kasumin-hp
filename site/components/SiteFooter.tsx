import Link from 'next/link';
import ScrollTopButton from './ScrollTopButton';

// 現行実測: フッターのナビは「活動紹介」表記（ヘッダーは「事業紹介」）
const NAV_ITEMS = [
  { label: '活動紹介', href: '/#business' },
  { label: '会社情報', href: '/company' },
  { label: 'ニュース', href: '/news' },
  { label: 'イベント運営', href: '/event' },
  { label: 'KASUMINブログ', href: 'https://note.com/kasumin977', external: true },
  { label: 'お問い合わせ', href: '/contact' },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__follow">
          <p>Follow us</p>
          <div className="site-footer__sns">
            <a
              href="https://www.instagram.com/kasumin.jasmine/"
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 448 512" aria-hidden="true">
                <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </svg>
            </a>
          </div>
        </div>
        <nav className="site-footer__nav">
          {NAV_ITEMS.map((item) =>
            item.external ? (
              <a key={item.label} href={item.href} target="_blank" rel="noopener">
                {item.label}
              </a>
            ) : (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ),
          )}
        </nav>
        {/* 特定募集情報等提供事業者の届出表示（職業安定法対応・Issue #1） */}
        <p className="site-footer__notice">
          合同会社KASUMINは、特定募集情報等提供事業者として厚生労働大臣に届出をしています（届出受理番号 51-募-001733）。
        </p>
        <div className="site-footer__bottom">
          <Link href="/" className="site-footer__logo" aria-label="KASUMIN" />
          {/* 現行版準拠: ポリシー2リンクは新しいタブで開く */}
          <a href="/privacy_policy" target="_blank" rel="noopener">
            プライバシーポリシー
          </a>
          <a href="/site_policy" target="_blank" rel="noopener">
            サイトポリシー
          </a>
          <p className="site-footer__copyright">
            Copyright © 2025 KASUMIN, Inc. All rights reserved.
          </p>
        </div>
      </div>
      <ScrollTopButton />
    </footer>
  );
}
