import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { getPillar, type PillarSlug } from './pillars';

const DIR = path.join(process.cwd(), 'content', 'articles');

// 開発時（npm run dev）だけ下書きも表示する。本番ビルドには入れない
const SHOW_DRAFTS = process.env.MEDIA_SHOW_DRAFTS === '1';

export type Faq = { q: string; a: string };
export type Source = { title: string; url: string };
export type CtaType = 'line' | 'line-area';

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  pillar: PillarSlug;
  isPillar: boolean;
  targetKeyword: string;
  author: string;
  reviewer?: string;
  publishedAt: string; // YYYY-MM-DD
  updatedAt: string;
  reviewBy: string;
  cta: CtaType;
  summary: string[];
  faq: Faq[];
  sources: Source[];
  image?: string;
  // 冒頭の監修者紹介文（ある記事だけ冒頭に表示）と、著者欄の肩書き（執筆／監修）
  lead?: string;
  authorLabel: '執筆' | '監修';
  draft: boolean;
  noindex: boolean;
};

export type Article = ArticleMeta & { html: string };

// YAML の日付は Date になるため YYYY-MM-DD に揃える
function toDate(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return v ? String(v) : '';
}

export function parseArticle(file: string): Article {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf-8');
  const { data, content } = matter(raw);
  const pillar = getPillar(data.pillar) ? (data.pillar as PillarSlug) : 'return';
  return {
    slug: data.slug ?? file.replace(/\.md$/, ''),
    title: data.title ?? '',
    description: data.description ?? '',
    pillar,
    isPillar: Boolean(data.isPillar),
    targetKeyword: data.targetKeyword ?? '',
    author: data.author ?? '',
    reviewer: data.reviewer || undefined,
    publishedAt: toDate(data.publishedAt),
    updatedAt: toDate(data.updatedAt ?? data.publishedAt),
    reviewBy: toDate(data.reviewBy),
    cta: data.cta === 'line-area' ? 'line-area' : 'line',
    summary: data.summary ?? [],
    faq: data.faq ?? [],
    sources: data.sources ?? [],
    image: data.image,
    lead: data.lead || undefined,
    authorLabel: data.authorLabel === '監修' ? '監修' : '執筆',
    draft: Boolean(data.draft),
    noindex: Boolean(data.noindex),
    html: marked.parse(content) as string,
  };
}

// 先頭が _ のファイル（_template.md など）は記事として扱わない
function articleFiles(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_'));
}

export function getAllArticles(): Article[] {
  return articleFiles()
    .map(parseArticle)
    .filter((a) => SHOW_DRAFTS || !a.draft)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getArticle(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function getArticlesByPillar(pillar: string): Article[] {
  return getAllArticles().filter((a) => a.pillar === pillar);
}

export function getArticlesByAuthor(author: string): Article[] {
  return getAllArticles().filter((a) => a.author === author || a.reviewer === author);
}
