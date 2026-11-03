import Link from 'next/link';
import type { Article } from '@/lib/articles';
import type { Author } from '@/lib/authors';

const fmt = (d: string) => d.replace(/-/g, '/');

// 記事冒頭: 著者・確認者・公開日・最終更新日
export function ArticleByline({ a, author, reviewer }: { a: Article; author?: Author; reviewer?: Author }) {
  return (
    <div className="byline">
      {author && (
        <span>
          執筆 <Link href={`/authors/${author.slug}`}>{author.name}</Link>
        </span>
      )}
      {reviewer && (
        <span>
          確認 <Link href={`/authors/${reviewer.slug}`}>{reviewer.name}</Link>
        </span>
      )}
      <span>公開日 <time dateTime={a.publishedAt}>{fmt(a.publishedAt)}</time></span>
      <span>最終更新日 <time dateTime={a.updatedAt}>{fmt(a.updatedAt)}</time></span>
    </div>
  );
}

export function Summary({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <section className="summary" aria-label="この記事の要点">
      <p className="summary__title">この記事の要点</p>
      <ul>
        {items.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </section>
  );
}

export function FaqSection({ faq }: { faq: Article['faq'] }) {
  if (!faq.length) return null;
  return (
    <section className="faq">
      <h2>よくある質問</h2>
      <dl>
        {faq.map((f, i) => (
          <div key={i} className="faq__item">
            <dt>Q. {f.q}</dt>
            <dd>A. {f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Sources({ sources }: { sources: Article['sources'] }) {
  if (!sources.length) return null;
  return (
    <section className="sources">
      <h2>出典・参考</h2>
      <ul>
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener">
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AuthorBox({ author }: { author?: Author }) {
  if (!author) return null;
  return (
    <section className="author-box" aria-label="この記事を書いた人">
      <p className="author-box__label">この記事を書いた人</p>
      <p className="author-box__name">
        <Link href={`/authors/${author.slug}`}>{author.name}</Link>
        <span>{author.role}</span>
      </p>
      <p>{author.shortBio}</p>
    </section>
  );
}
