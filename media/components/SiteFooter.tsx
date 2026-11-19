import Link from 'next/link';
import { SITE, LINKS, PUBLISHER } from '@/lib/site';

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer__name">{SITE.name}</p>
        <ul className="footer__links">
          <li><Link href="/about">このメディアについて</Link></li>
          <li><Link href="/service">えんまーるとは</Link></li>
          <li><Link href="/articles">記事一覧</Link></li>
          <li><a href={LINKS.privacy}>プライバシーポリシー</a></li>
          <li><a href={LINKS.contact}>お問い合わせ</a></li>
        </ul>
        <p className="footer__note">
          えんまーるは、職業安定法に基づく特定募集情報等提供事業として運営しています（届出受理番号
          51-募-001733）。職業紹介は行っていません。
        </p>
        <p className="footer__copy">
          運営: <a href={PUBLISHER.url}>{PUBLISHER.name}</a>
        </p>
      </div>
    </footer>
  );
}
