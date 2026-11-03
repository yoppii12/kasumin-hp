import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const DIR = path.join(process.cwd(), 'content', 'authors');

export type Author = {
  slug: string;
  name: string;
  role: string; // 肩書き（例: 合同会社KASUMIN 代表社員）
  shortBio: string; // 記事末尾の著者欄に出す1〜2文
  image?: string;
  sameAs: string[];
  html: string; // プロフィール本文
};

export function getAllAuthors(): Author[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(DIR, f), 'utf-8'));
      return {
        slug: data.slug ?? f.replace(/\.md$/, ''),
        name: data.name ?? '',
        role: data.role ?? '',
        shortBio: data.shortBio ?? '',
        image: data.image,
        sameAs: data.sameAs ?? [],
        html: marked.parse(content) as string,
      };
    });
}

export function getAuthor(slug?: string): Author | undefined {
  if (!slug) return undefined;
  return getAllAuthors().find((a) => a.slug === slug);
}
