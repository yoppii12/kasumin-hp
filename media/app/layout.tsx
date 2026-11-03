import type { Metadata } from 'next';
import { Kosugi_Maru, Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import JsonLd from '@/components/JsonLd';
import { SITE, GTM_ID } from '@/lib/site';
import { organizationLd, websiteLd } from '@/lib/seo';

const kosugiMaru = Kosugi_Maru({ weight: '400', subsets: ['latin'], variable: '--font-kosugi', display: 'swap' });
const notoSansJp = Noto_Sans_JP({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-noto', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}｜${SITE.tagline}`, template: `%s｜${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: './' },
  // 公開前（SITE.indexable=false）は全ページ noindex
  robots: SITE.indexable ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { type: 'website', siteName: SITE.name, locale: SITE.locale, images: [SITE.ogImage] },
  twitter: { card: 'summary_large_image' },
};

// HP と同じ GTM コンテナ。本番ホスト（kasumin.biz とそのサブドメイン）でだけ読み込む
const GTM_SNIPPET = `(function(){
if(!/(^|\\.)kasumin\\.biz$/.test(location.hostname))return;
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${kosugiMaru.variable} ${notoSansJp.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: GTM_SNIPPET }} />
        <JsonLd data={[organizationLd(), websiteLd()]} />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
