// メディア全体の設定。名前・URL・LINE の差し替えはこのファイルだけで済むようにする。

export const SITE = {
  // 仮称（2026/11/03）。最終決定は約1か月後。決まったら name・tagline を書き換えるだけで全ページに反映される
  name: 'えんまーるマガジン',
  tagline: 'ブランクのある保育士さんが、もう一度保育に関わるための情報メディア',
  description:
    '短時間・単発のお仕事から保育に戻る方法、長崎の支援制度と窓口、復職の進め方を、保育士・元園長の目線で届けます。運営: 合同会社KASUMIN（えんまーる）',
  // サブドメインは確定（2026/11/03）。記事が検索に載った後は変えない
  url: 'https://media.kasumin.biz',
  // 公開前は false（全ページ noindex・robots.txt で Disallow）。初回の記事がそろったら true にする
  indexable: false,
  locale: 'ja_JP',
  ogImage: '/images/og_default.png',
} as const;

export const PUBLISHER = {
  name: '合同会社KASUMIN',
  url: 'https://kasumin.biz',
  logo: 'https://kasumin.biz/icon.png',
  sameAs: ['https://linktr.ee/kasumin1124'],
} as const;

export const LINKS = {
  hp: 'https://kasumin.biz',
  enmaru: 'https://enmaru.kasumin.biz',
  enmaruNurseries: 'https://enmaru.kasumin.biz/nurseries',
  privacy: 'https://kasumin.biz/privacy_policy',
  contact: 'https://kasumin.biz/contact',
} as const;

// GTM は HP と同じコンテナ。ホスト名で HP とメディアを分けて見る
export const GTM_ID = 'GTM-KKJ2KRB3';

// 公式LINE の友だち追加 URL。
// 流入経路分析の「記事」用 URL を LINE 公式アカウントで発行したら article を差し替える【要確認】
export const LINE = {
  default: 'https://lin.ee/j01mtTQ',
  article: 'https://lin.ee/j01mtTQ',
} as const;
