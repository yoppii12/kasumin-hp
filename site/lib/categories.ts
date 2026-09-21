// 現行サイトのカテゴリ表記（カードのラベルは日本語、Allのみ英語）
// クライアントコンポーネントからも参照するため lib/news.ts（fs依存）から分離
export const CATEGORY_LABEL: Record<string, string> = {
  all: 'All',
  news: 'お知らせ',
  'activity-report': '活動報告',
  other: 'その他',
};
