import Link from 'next/link';
import { SITE } from '@/lib/site';
import { PILLARS } from '@/lib/pillars';

export default function SiteHeader() {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link href="/" className="header__logo">
          <span className="header__name">{SITE.name}</span>
          <span className="header__by">by えんまーる</span>
        </Link>
        <nav aria-label="カテゴリ" className="header__nav">
          {PILLARS.map((p) => (
            <Link key={p.slug} href={`/category/${p.slug}`}>
              {p.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
