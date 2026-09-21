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

// TODO: GA4プロパティ作成後（LAplust管理のGoogleアカウント配下に新規作成予定）、
// laplust-hp と同様のGTMスニペットをここに追加する（本番ドメイン限定ガード付き）

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // フォント変数は:rootで参照するため<html>側に付与する
    <html
      lang="ja"
      className={`${montserrat.variable} ${kosugiMaru.variable} ${notoSansJp.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
