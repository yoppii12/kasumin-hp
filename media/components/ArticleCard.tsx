import Link from 'next/link';
import type { ArticleMeta } from '@/lib/articles';
import { getPillar } from '@/lib/pillars';

export default function ArticleCard({ a }: { a: ArticleMeta }) {
  return (
    <li className="card">
      <Link href={`/articles/${a.slug}`}>
        <span className="card__pillar">{getPillar(a.pillar)?.name}</span>
        <span className="card__title">{a.title}</span>
        <span className="card__date">更新日 {a.updatedAt.replace(/-/g, '/')}</span>
      </Link>
    </li>
  );
}

export function ArticleList({ articles }: { articles: ArticleMeta[] }) {
  if (!articles.length) return <p className="empty">記事を準備しています。</p>;
  return (
    <ul className="cards">
      {articles.map((a) => (
        <ArticleCard key={a.slug} a={a} />
      ))}
    </ul>
  );
}
