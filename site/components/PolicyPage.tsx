import fs from 'fs';
import path from 'path';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

// ポリシーページ（Privacy Policy / Site Policy 共通）
// 本文は現行サイトから抽出したリッチテキスト（content/pages/*.html）
// 現行サイト準拠: ページ下部の住所ブロック・HOMEリンクはなし
export default function PolicyPage({ title, file }: { title: string; file: string }) {
  const html = fs.readFileSync(
    path.join(process.cwd(), 'content', 'pages', `${file}.html`),
    'utf-8',
  );
  return (
    <>
      <SiteHeader />
      <main style={{ paddingTop: 'calc(var(--header-height) + 22px)', paddingBottom: 96 }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <h1 className="page-title">{title}</h1>
          <article
            className="rich-text"
            style={{ marginTop: 48 }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
