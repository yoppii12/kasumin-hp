import Link from 'next/link';
import { SITE } from '@/lib/site';
import { PILLARS } from '@/lib/pillars';
import { getAllArticles } from '@/lib/articles';
import { ArticleList } from '@/components/ArticleCard';
import LineCta from '@/components/LineCta';

export default function Home() {
  const latest = getAllArticles().slice(0, 6);
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="hero__title">{SITE.name}</h1>
          <p className="hero__tagline">{SITE.tagline}</p>
        </div>
      </section>
      <div className="container">
        <section className="section">
          <h2 className="section__title">新着記事</h2>
          <ArticleList articles={latest} />
          <p className="more"><Link href="/articles">記事一覧へ</Link></p>
        </section>
        <section className="section">
          <h2 className="section__title">カテゴリ</h2>
          <ul className="pillars">
            {PILLARS.map((p) => (
              <li key={p.slug}>
                <Link href={`/category/${p.slug}`}>
                  <span className="pillars__name">{p.name}</span>
                  <span className="pillars__desc">{p.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <LineCta position="home" />
      </div>
    </>
  );
}
