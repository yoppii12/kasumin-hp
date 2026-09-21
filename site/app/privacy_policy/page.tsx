import type { Metadata } from 'next';
import PolicyPage from '@/components/PolicyPage';

export const metadata: Metadata = {
  title: { absolute: '保育士・保護者・地域の笑顔をつなぐKASUMIN' },
  description:
    '合同会社KASUMIN（カスミン）のプライバシーポリシー。個人情報の取り扱い方針について定めています。',
};

export default function PrivacyPolicyPage() {
  return <PolicyPage title="Privacy Policy" file="privacy_policy" />;
}
