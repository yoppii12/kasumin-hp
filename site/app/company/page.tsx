import type { Metadata } from 'next';
import CompanyContent from '@/components/CompanyContent';

export const metadata: Metadata = {
  title: { absolute: '保育士・保護者・地域の笑顔をつなぐKASUMIN' },
  description:
    '合同会社KASUMIN（カスミン）の会社方針・会社概要・メンバーをご紹介します。',
};

export default function CompanyPage() {
  return <CompanyContent />;
}
