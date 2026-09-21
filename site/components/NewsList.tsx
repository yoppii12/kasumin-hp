'use client';

import { useState } from 'react';
import Link from 'next/link';
import NewsCard from './NewsCard';
import type { NewsMeta } from '@/lib/news';

// 現行サイトのカテゴリタブ（URL: /news/category/{slug}）
const TABS = [
  { label: 'All', slug: 'all' },
  { label: 'お知らせ', slug: 'news' },
  { label: '活動報告', slug: 'activity-report' },
  { label: 'その他', slug: 'other' },
];

const PER_PAGE = 6;

export default function NewsList({
  items,
  activeCategory,
}: {
  items: NewsMeta[];
  activeCategory: string;
}) {
  const [count, setCount] = useState(PER_PAGE);
  const visible = items.slice(0, count);

  return (
    <>
      <nav className="tab-bar">
        {TABS.map((t) => (
          <Link
            key={t.slug}
            href={`/news/category/${t.slug}`}
            className={t.slug === activeCategory ? 'is-active' : ''}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <div className="news-grid" style={{ marginTop: 73 }}>
        {visible.map((item) => (
          <NewsCard key={item.slug} item={item} />
        ))}
      </div>
      {count < items.length && (
        <div style={{ textAlign: 'center', marginTop: 26 }}>
          <button type="button" className="btn-pill" onClick={() => setCount(count + PER_PAGE)}>
            View more
          </button>
        </div>
      )}
    </>
  );
}
