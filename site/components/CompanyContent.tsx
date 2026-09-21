import Link from 'next/link';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import styles from '@/app/company/company.module.css';

// 現行サイト準拠: /company・/company/our_thoughts・/company/company・/company/member は
// すべて同一内容のページで、タブは各URL＋アンカーへのリンク（実測: #management / #information / #member）
const PHOTO =
  '/assets/design/bXqzew1ZOD/s-2016x1764_v-frms_webp_224417fd-6921-4e67-a0b7-dbd4cfbd62a4_small.webp';

export default function CompanyContent() {
  return (
    <>
      <SiteHeader />
      <main style={{ paddingTop: 'calc(var(--header-height) + 22px)', paddingBottom: 96 }}>
        <div className="container">
          <h1 className={styles.pageTitle}>Company</h1>

          <nav className={styles.tabBar}>
            <Link href="/company/our_thoughts/#management">会社方針</Link>
            <Link href="/company/company/#information">会社概要</Link>
            <Link href="/company/member/#member">メンバー</Link>
          </nav>

          {/* 会社方針 */}
          <section className={styles.section} id="management">
            <h2 className={styles.sectionTitle}>会社方針</h2>

            <span className={styles.enLabel}>Our Mission</span>
            <p className={styles.mission}>
              子どもたちの笑顔のために、大人たちがつながり、安心して働き・育てられる環境をつくる。
            </p>

            <span className={styles.enLabel}>Our Vision</span>
            <div className={styles.vision}>
              <p>
                未来ある子どもたちのために、
                <br />
                笑顔あふれる世界を★
              </p>
              <p>
                合同会社KASUMINは保育士不足の解消と保育の質の向上を目指し、現場の「声」をすくい、地域で支え合う仕組みづくりに取り組んでいます。
              </p>
              <p>「保育士の笑顔＝子どもの笑顔＝保護者の笑顔」</p>
              <p>
                この循環を生み出すために、園・地域・企業・行政とともに歩みながら、
                <br />
                保育に関わる人が安心して笑顔で過ごせる社会を目指します。
              </p>
            </div>

            <div className={styles.thought}>
              <h3 className={styles.thoughtTitle}>子どもたちへの想い</h3>
              <p>
                子どもの気持ちや表情、言葉の意味を感じ取って寄り添える。
                <br />
                その子らしさをまるごと受けとめられる保育環境づくりを目指しています。
                <br />
                <br />
                子どもの「やりたい！」という気持ちを引き出し、応援すること。
                <br />
                そして、「自分は大切にされている」と感じられる園であれば、
                <br />
                その実感こそが、子どもが安心して過ごすためのいちばんの力になると考えています。
                <br />
                <br />
                日本の未来を担う子どもたちが、笑顔あふれる世界へと一歩を踏み出せるように。
                <br />
                「生まれてきてくれてありがとう」——
                <br />
                その言葉が、大人たちの口から自然にこぼれるような社会を、
                <br />
                私たちはつくっていきたいと思います。
              </p>
            </div>

            <div className={styles.thought}>
              <h3 className={styles.thoughtTitle}>保護者への想い</h3>
              <p>
                子どもが安心して育つためには、
                <br />
                そばで支える大人――保護者が笑顔でいられる環境が欠かせません。
                <br />
                <br />
                子どもの成長や変化は日々めまぐるしく、
                <br />
                ときには寄り添うことが難しいこともあります。
                <br />
                それでも一緒に喜び、時に悩み、挑戦していく。
                <br />
                <br />
                そんな保護者の気持ちに寄り添えるような支援も行っています。
                <br />
                <br />
                家庭それぞれで、子育てへの思いは違うもの。
                <br />
                その違い一つひとつを大切にしながら、
                <br />
                「自分たちらしい子育て」を見つけられるようなサポートや
                <br />
                イベント・講座などをお届けしています。
                <br />
                <br />
                そして、保護者の方が笑顔でいることは、家庭の中にあたたかな空気を広げ、「仕事も家庭も大切にしたい」という前向きな気持ちを育てます。子どもと向き合う時間がよりやさしく、より前向きになることで、家庭の中には笑顔の循環が広がっていきます。
                <br />
                私たちは、こうした笑顔の循環が続いていくように、保護者支援を通して共に歩み、共に成長していける関係をこれからも大切にしていきたいと考えています。
              </p>
            </div>

            <div className={styles.thought}>
              <h3 className={styles.thoughtTitle}>企業・行政・地域の皆様へ</h3>
              <p>
                社会全体で支える保育へ
                <br />
                <br />
                保育士・保護者・園長など多様な立場の声を聞き取り、現場課題を“可視化”し、人材定着や制度改善につなげています。
                <br />
                <br />
                保育は「教育」「福祉」「地域づくり」のすべてに関わるテーマです。行政・企業・地域が協働することで、持続可能な保育環境が生まれます。
                <br />
                <br />
                【CSR／地域連携型】
                <br />
                子どもたちの未来のために、保育士や保護者、園の先生たちの声に寄り添い、
                <br />
                保育士定着支援や保育現場のコミュニケーション改善、保護者との信頼関係づくりなど、地域ぐるみで支える仕組みを進めています。
                <br />
                <br />
                【従業員支援型】
                <br />
                子育てをしながら働く従業員が、仕事も家庭も大切にできるように。
                <br />
                企業の皆さまと連携しながら、従業員が安心して働き続けられる環境づくりを進めていきます。
                <br />
                企業内研修や福利厚生、職場環境の整備などを通して、一人ひとりが自分らしく働ける職場を目指し、また、制度やコミュニケーションの改善にも取り組み、子育て世代が安心してキャリアを描けるよう、企業の皆さまと伴走しながらサポートを続けています。
              </p>
            </div>
          </section>

          {/* 会社概要 */}
          <section className={styles.section} id="information">
            <h2 className={styles.sectionTitle}>会社概要</h2>
            <dl className={styles.overview}>
              <div className={styles.overviewRow}>
                <dt>会社名</dt>
                <dd>合同会社KASUMIN (カスミン / KASUMIN LLC.)</dd>
              </div>
              <div className={styles.overviewRow}>
                <dt>設立年月日</dt>
                <dd>2025年9月22日</dd>
              </div>
              <div className={styles.overviewRow}>
                <dt>代表者</dt>
                <dd>代表社員　平田 香澄(旧姓)</dd>
              </div>
              <div className={styles.overviewRow}>
                <dt>本社所在地</dt>
                <dd>〒850-0054 長崎県長崎市上町4-37</dd>
              </div>
              <div className={styles.overviewRow}>
                <dt>事業内容</dt>
                <dd>
                  保育士不足解消への支援
                  <br />
                  保育園の業務改善サポート
                  <br />
                  保育者・保護者の学びの場づくり
                </dd>
              </div>
            </dl>
          </section>

          {/* メンバー */}
          <section className={styles.section} id="member">
            <h2 className={styles.sectionTitle}>メンバー</h2>
            <div className={styles.member}>
              <img className={styles.memberPhoto} src={PHOTO} alt="平田 香澄" />
              <div>
                <span className={styles.memberRole}>代表社員</span>
                <h3 className={styles.memberName}>平田 香澄(旧姓)</h3>
                <p className={styles.memberProfile}>
                  【出身】：沖縄県
                  <br />
                  【学校】：専門学校沖縄中央学園 卒業
                  <br />
                  【経歴】：東京都世田谷区の保育園に10年以上勤務, 保育園長 として園運営に従事
                  <br />
                  <br />
                  現場で、保育士不足によって子どもたちの活動が制限されてしまうことや、安全を守るためには十分な人手が不可欠であることを強く実感してきた。その経験から、保育士を支える仕組みの必要性を痛感。
                  <br />
                  <br />
                  2024年に保育アドバイザーとして独立し、
                  <br />
                  2025年9月には、保育者・園・地域がつながり合う仕組みづくりを目指して合同会社KASUMINを設立。
                  <br />
                  <br />
                  子どもたちの安心と笑顔を守るため、保育士不足の解消と、保育環境をより良くする取り組みを進めている。
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
