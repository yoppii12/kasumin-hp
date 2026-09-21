import type { Metadata } from 'next';
import { Montserrat, Kosugi_Maru, Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

// Kosugi Maru はウェイト400のみ提供（太字はブラウザの合成ボールドで現行同様に描画される）
const kosugiMaru = Kosugi_Maru({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-kosugi',
  display: 'swap',
});

const notoSansJp = Noto_Sans_JP({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kasumin.biz'),
  // 現行サイト準拠: トップは長いタイトル、下層は og:site_name と同じ固定タイトル
  title: {
    default: '合同会社KASUMIN(カスミン) | 未来ある子どもたちのために、笑顔あふれる世界を★',
    template: '%s',
  },
  description:
    '短期バイトからはじめる保育士向け復職支援プラットフォーム”えんまーる”で保育士・保育園・地域・家庭をつなぎ、子ども・保育者・保護者の笑顔があふれる世界を目指す。',
  alternates: { canonical: './' },
  openGraph: {
    type: 'website',
    siteName: '保育士・保護者・地域の笑顔をつなぐKASUMIN',
    locale: 'ja_JP',
    // 現行サイトと同一のOGP既定画像
    images: ['/images/og_default.png'],
  },
  twitter: { card: 'summary_large_image' },
};

// GA4はGTM経由で計測（GA4プロパティ: KASUMIN HP / G-4BYV0QM1WB。laplust-hpと同構成）
const GTM_ID = 'GTM-KKJ2KRB3';

// 本番ドメインでのみGTMを読み込む（localhost・プレビュー環境を計測から除外）
const GTM_SNIPPET = `(function(){
if(!/(^|\\.)kasumin\\.biz$/.test(location.hostname))return;
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // フォント変数は:rootで参照するため<html>側に付与する
    <html
      lang="ja"
      className={`${montserrat.variable} ${kosugiMaru.variable} ${notoSansJp.variable}`}
    >
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{ __html: GTM_SNIPPET }} />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
