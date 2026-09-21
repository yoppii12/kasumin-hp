import Link from 'next/link';
import type { NewsMeta } from '@/lib/news';
import { CATEGORY_LABEL } from '@/lib/categories';

function formatDate(date: string) {
  // 2026-08-01 -> 2026.8.1（現行サイト表記に合わせる）
  const [y, m, d] = date.split('-');
  return `${y}.${Number(m)}.${Number(d)}`;
}

export default function NewsCard({ item }: { item: NewsMeta }) {
  return (
    <Link href={`/news/${item.slug}`} className="news-card">
      <div className="news-card__thumb">
        {(item.cover || item.ogImage) && (
          <img src={item.cover || item.ogImage} alt="" loading="lazy" />
        )}
      </div>
      <div className="news-card__body">
        <p className="news-card__category">{CATEGORY_LABEL[item.category] ?? item.category}</p>
        <p className="news-card__title">{item.title}</p>
        <div className="news-card__foot">
          <time className="news-card__date" dateTime={item.date}>
            {formatDate(item.date)}
          </time>
          <svg className="arrow-icon" viewBox="0 0 26 22" aria-hidden="true">
            <path d="M0 11h23M15 3l8 8-8 8" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
