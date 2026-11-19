// 構造化データ（JSON-LD）の生成。表示している内容と同じデータから作る
import { SITE, PUBLISHER } from './site';
import type { Article } from './articles';
import type { Author } from './authors';

export const abs = (p: string) => (p.startsWith('http') ? p : `${SITE.url}${p}`);

export const ORG_ID = `${PUBLISHER.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;
export const personId = (slug: string) => abs(`/authors/${slug}#person`);

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: PUBLISHER.name,
    url: PUBLISHER.url,
    logo: PUBLISHER.logo,
    sameAs: PUBLISHER.sameAs,
  };
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: 'ja',
    publisher: { '@id': ORG_ID },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function personLd(a: Author) {
  return {
    '@type': 'Person',
    '@id': personId(a.slug),
    name: a.name,
    jobTitle: a.role,
    description: a.shortBio,
    url: abs(`/authors/${a.slug}`),
    ...(a.image ? { image: abs(a.image) } : {}),
    ...(a.sameAs.length ? { sameAs: a.sameAs } : {}),
    worksFor: { '@id': ORG_ID },
  };
}

export function profilePageLd(a: Author) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: abs(`/authors/${a.slug}`),
    mainEntity: personLd(a),
  };
}

export function articleLd(a: Article, author?: Author, reviewer?: Author) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.description,
    image: [abs(a.image ?? SITE.ogImage)],
    datePublished: a.publishedAt,
    dateModified: a.updatedAt,
    mainEntityOfPage: abs(`/articles/${a.slug}`),
    inLanguage: 'ja',
    ...(author ? { author: personLd(author) } : { author: { '@id': ORG_ID } }),
    // 確認者（社労士・税理士など）は reviewedBy ではなく contributor として表す
    ...(reviewer ? { contributor: personLd(reviewer) } : {}),
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
  };
}

export function faqLd(faq: Article['faq']) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function collectionLd(name: string, path: string, articles: Article[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: abs(path),
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: abs(`/articles/${a.slug}`),
        name: a.title,
      })),
    },
  };
}
