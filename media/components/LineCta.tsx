'use client';

import { LINE } from '@/lib/site';
import type { CtaType } from '@/lib/articles';

// 文言は特定募集情報等提供事業の範囲で書く（「マッチング」「紹介」「斡旋」は使わない）
const COPY: Record<CtaType, { lead: string; button: string }> = {
  line: {
    lead: '保育に戻るか、まだ決めていなくても大丈夫です。えんまーるの公式LINEで、短時間・単発のお仕事のお知らせや、復帰の準備に役立つ情報をお届けしています。',
    button: 'LINEで友だち追加する',
  },
  'line-area': {
    lead: 'えんまーるは長崎を中心に運営しています。公式LINEでお住まいの地域を教えていただくと、対応エリアのお知らせをお届けします。',
    button: 'LINEで友だち追加する',
  },
};

type Props = {
  type?: CtaType;
  position: 'top' | 'bottom' | 'home' | 'service';
  articleSlug?: string;
  pillar?: string;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export default function LineCta({ type = 'line', position, articleSlug, pillar }: Props) {
  const copy = COPY[type];
  const href = articleSlug ? LINE.article : LINE.default;

  // GTM 側で line_click をトリガーにして GA4 のイベントへ送る
  const onClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'line_click',
      article_slug: articleSlug ?? '',
      pillar: pillar ?? '',
      cta_type: type,
      cta_position: position,
    });
  };

  return (
    <aside className="line-cta" aria-label="公式LINEのご案内">
      <p className="line-cta__lead">{copy.lead}</p>
      <a className="line-cta__button" href={href} target="_blank" rel="noopener" onClick={onClick}>
        {copy.button}
      </a>
    </aside>
  );
}
