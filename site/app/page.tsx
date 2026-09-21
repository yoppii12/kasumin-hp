import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import NewsCard from '@/components/NewsCard';
import ScrollReveal from '@/components/ScrollReveal';
import { getAllNews } from '@/lib/news';
import styles from './page.module.css';

const GCS = '/assets/design/bXqzew1ZOD';

const ASSETS = {
  scrollIcon: '/assets/design/NxqgdRVEa1/s-28x25_webp_baa795dc-01be-459e-92dd-b60493432a58.webp',
  diagram: `${GCS}/s-1306x1235_v-fms_webp_4bdfccf1-cff2-438d-8add-09fffcbaf215_middle.webp`,
  bandEnmaru: `${GCS}/s-4744x3164_v-frms_webp_1e5a017d-e97e-4b33-a616-1e2f76d544ff_middle.webp`,
  bandEnsapo: `${GCS}/s-1536x1024_v-fms_webp_cc929308-250f-45cf-8c1e-c8825ed83a6c_middle.webp`,
  bandEnjoy: `${GCS}/s-2391x1367_v-frms_webp_de3ebac4-304a-4fa7-9809-f87b6d9ec89d_middle.webp`,
};

// Google検索のリッチリザルト向け組織情報（構造化データ）
const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '合同会社KASUMIN',
  alternateName: 'KASUMIN LLC.',
  url: 'https://kasumin.biz',
  logo: 'https://kasumin.biz/images/og_default.png',
};

export default function Home() {
  const news = getAllNews().slice(0, 3);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
      />
      <SiteHeader transparent />
      <ScrollReveal />
      <main>
        {/* ヒーロー */}
        <section className={styles.hero} id="top">
          <div className={styles.heroBody}>
            <h1 className={styles.heroTitle}>
              未来ある子どもたちのために、
              <br />
              笑顔あふれる世界を★
            </h1>
            <p className={styles.heroSub}>
              子ども・保育士・保護者・地域社会が
              <br />
              笑顔になれる仕組みを作る。
            </p>
            <Link href="/#business" className={styles.heroBtn}>
              事業紹介
            </Link>
          </div>
          <Link href="/#news" className={styles.heroScroll} aria-label="下へスクロール">
            <img src={ASSETS.scrollIcon} alt="" />
          </Link>
        </section>

        {/* ニュース */}
        <section className={styles.section} id="news" data-reveal>
          <div className="container">
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>ニュース</h2>
              <Link href="/news" className={styles.viewMore}>
                View more
                <svg className="arrow-icon" viewBox="0 0 26 22" aria-hidden="true">
                  <path d="M0 11h23M15 3l8 8-8 8" />
                </svg>
              </Link>
            </div>
            <div className="news-grid" style={{ marginTop: 56 }}>
              {news.map((item) => (
                <NewsCard key={item.slug} item={item} />
              ))}
            </div>
          </div>
        </section>

        {/* 事業紹介 */}
        <section className={styles.section} id="business" style={{ paddingTop: 192 }}>
          <div className={`container ${styles.bandsWrap}`}>
            <h2 className={styles.sectionTitle} data-reveal>
              事業紹介
            </h2>
            <p className={styles.businessLead} data-reveal>
              KASUMINは、保育士・保育園・地域・家庭をやさしくつなぐ活動を行っています。イベント運営を通じて現場の声を集め、保育園アドバイザリーで環境改善や人材育成を支援し、復職支援プラットフォーム「えんまーる」で潜在保育士の活躍を後押しします。それぞれの事業が相互に連携し、子ども・保育者・保護者の笑顔がつながる循環を生み出しています。
            </p>

            {/* 笑顔がつながる循環（現行と同じ1枚画像） */}
            <img
              className={styles.diagram}
              src={ASSETS.diagram}
              alt="えんまーる・えんさぽ・えんじょいの3事業で笑顔がつながる循環"
              data-reveal
            />

            {/* えんまーる */}
            <div
              className={styles.band}
              style={{ backgroundImage: `url(${ASSETS.bandEnmaru})` }}
              data-reveal
            >
              <h3 className={styles.bandTitle}>えんまーる</h3>
              <p className={styles.bandSub}>短期バイトからスタートする復職支援プラットフォーム</p>
              <p className={styles.bandDesc}>
                子どもたちの安全と笑顔を守るために。もう一度保育に関わりたい保育士有資格者と、人手を必要とする保育園を“想い”でつなぐプラットフォームです。互いに支え合いながら、保育士不足の解消と笑顔あふれる保育環境づくりに貢献します。
              </p>
              <a
                href="https://enmaru.kasumin.biz/"
                target="_blank"
                rel="noopener"
                className={styles.bandBtn}
              >
                View more
              </a>
            </div>

            {/* えんさぽ */}
            <div
              className={styles.band}
              style={{ backgroundImage: `url(${ASSETS.bandEnsapo})` }}
              data-reveal
            >
              <h3 className={styles.bandTitle}>えんさぽ</h3>
              <p className={styles.bandSub}>保育園/幼稚園向け業務改善・保育環境アドバイザリー</p>
              <p className={styles.bandDesc}>
                保育園の業務負担を減らし、先生たちが“保育に集中できる環境”をつくる支援サービスです。現場の声をもとに、事務作業・連携・保護者対応などの課題を一緒に整理し、園に寄り添った改善支援を提供。
              </p>
              <a
                href="https://www.notion.so/laplust/2adc08e5f34c80d68e29fc6960c3c64a?source=copy_link"
                target="_blank"
                rel="noopener"
                className={styles.bandBtn}
              >
                View more
              </a>
            </div>

            {/* えんじょい */}
            <div
              className={styles.band}
              style={{ backgroundImage: `url(${ASSETS.bandEnjoy})` }}
              data-reveal
            >
              <h3 className={styles.bandTitle}>えんじょい</h3>
              <p className={styles.bandSub}>保育士と地域をつなぐ“笑顔の場づくり”</p>
              <p className={styles.bandDesc}>
                長崎・沖縄を中心に、地域の企業や行政と連携したイベントを実施します。保育士・保護者・地域が共に学び、つながる機会を創出します。
              </p>
              <Link href="/event" className={styles.bandBtn}>
                View more
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
