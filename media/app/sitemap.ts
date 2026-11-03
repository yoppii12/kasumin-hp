import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { PILLARS } from '@/lib/pillars';
import { getAllArticles } from '@/lib/articles';
import { getAllAuthors } from '@/lib/authors';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles().filter((a) => !a.draft && !a.noindex);
  const latest = articles.length ? new Date(articles[0].updatedAt) : undefined;
  const u = (p: string) => `${SITE.url}${p}`;
  return [
    { url: u('/'), lastModified: latest },
    { url: u('/articles'), lastModified: latest },
    { url: u('/about') },
    { url: u('/service') },
    ...PILLARS.map((p) => ({ url: u(`/category/${p.slug}`), lastModified: latest })),
    ...getAllAuthors().map((a) => ({ url: u(`/authors/${a.slug}`) })),
    // lastModified は本文を更新したときの updatedAt（Google はこの値を参考にする）
    ...articles.map((a) => ({ url: u(`/articles/${a.slug}`), lastModified: new Date(a.updatedAt) })),
  ];
}
