// 記事の柱（カテゴリ）。URL の slug は変えない（変えると記事一覧の URL が変わる）
export const PILLARS = [
  {
    slug: 'nagasaki',
    name: '長崎の制度と窓口',
    description: '長崎県・長崎市で保育士として戻るときに使える制度、相談の窓口、イベントの日程をまとめます。',
  },
  {
    slug: 'spot',
    name: 'スポット・単発で働く',
    description: '単発・スポットで保育の現場に入るときの始め方と、確かめておきたいことをまとめます。',
  },
  {
    slug: 'short-time',
    name: '短時間で戻る',
    description: '午前だけ・週2・扶養内など、短い時間から保育士に戻る方法をまとめます。',
  },
  {
    slug: 'return',
    name: '復職の進め方',
    description: 'ブランクのある保育士が復職するまでの順番、履歴書・面接、現場で変わったことをまとめます。',
  },
  {
    slug: 'nursery',
    name: '園の方へ',
    description: '短時間・スポットの保育士を受け入れる園の準備をまとめます。',
  },
] as const;

export type PillarSlug = (typeof PILLARS)[number]['slug'];

export function getPillar(slug: string) {
  return PILLARS.find((p) => p.slug === slug);
}
