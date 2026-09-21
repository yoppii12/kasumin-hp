import type { Metadata } from 'next';
import PolicyPage from '@/components/PolicyPage';

export const metadata: Metadata = {
  title: { absolute: '保育士・保護者・地域の笑顔をつなぐKASUMIN' },
  description:
    '合同会社KASUMIN（カスミン）のサイトポリシー。当ウェブサイトのご利用条件について定めています。',
};

export default function SitePolicyPage() {
  return <PolicyPage title="Site Policy" file="site_policy" />;
}
