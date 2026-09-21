import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CompanyContent from '@/components/CompanyContent';

// 現行サイト準拠: 3つのタブURLはいずれも会社情報ページ全体を表示する
// （タブのリンク先アンカー #management / #information / #member で該当セクションへ移動）
const SLUGS = ['our_thoughts', 'company', 'member'];

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export const metadata: Metadata = {
  title: { absolute: '保育士・保護者・地域の笑顔をつなぐKASUMIN' },
  description:
    '合同会社KASUMIN（カスミン）の会社方針・会社概要・メンバーをご紹介します。',
};

export default async function CompanyTabPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!SLUGS.includes(slug)) notFound();
  return <CompanyContent />;
}
