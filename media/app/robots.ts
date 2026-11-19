import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

// 公開前（SITE.indexable=false）はクロールさせない
export default function robots(): MetadataRoute.Robots {
  if (!SITE.indexable) return { rules: { userAgent: '*', disallow: '/' } };
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${SITE.url}/sitemap.xml` };
}
