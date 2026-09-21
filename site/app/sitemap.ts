import type { MetadataRoute } from 'next';
import { getAllNews } from '@/lib/news';

// 本番ドメイン基準（DNS切替後にそのまま使える）
const BASE = 'https://kasumin.biz';

// 静的ページ一覧（現行サイトのURL構成を踏襲）
const STATIC_PATHS: { path: string; priority: number }[] = [
  { path: '/', priority: 1.0 },
  { path: '/news', priority: 0.8 },
  { path: '/event', priority: 0.8 },
  { path: '/company', priority: 0.8 },
  { path: '/company/our_thoughts', priority: 0.6 },
  { path: '/company/company', priority: 0.6 },
  { path: '/company/member', priority: 0.6 },
  { path: '/contact', priority: 0.7 },
  { path: '/privacy_policy', priority: 0.3 },
  { path: '/site_policy', priority: 0.3 },
];

const CATEGORY_SLUGS = ['all', 'news', 'activity-report', 'other'];

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const news = getAllNews();
  const latest = news.length ? new Date(news[0].date) : new Date();

  return [
    ...STATIC_PATHS.map(({ path, priority }) => ({
      url: `${BASE}${path}`,
      lastModified: path === '/' || path === '/news' ? latest : undefined,
      priority,
    })),
    ...CATEGORY_SLUGS.map((slug) => ({
      url: `${BASE}/news/category/${slug}`,
      lastModified: latest,
      priority: 0.5,
    })),
    ...news.map((n) => ({
      url: `${BASE}/news/${n.slug}`,
      lastModified: new Date(n.date),
      priority: 0.6,
    })),
  ];
}
