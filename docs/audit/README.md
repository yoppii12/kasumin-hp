# 現行サイト棚卸し結果（2026-09-21 取得）

現行 Studio サイト（kasumin.biz）を Playwright（Chromium・JS実行後DOM）で全ページ巡回した結果。
プレイブック「2. 移行フェーズ」の **2. 現行サイトの棚卸し** の成果物（旧サイトが消える前のアセット退避を含む）。

| ファイル | 内容 |
|---|---|
| `260921_現行サイトURL一覧.md` | 全23ページのパス・title・meta description・ページ全高。301リダイレクトマップの前提資料 |
| `260921_アセット棚卸しサマリー.md` | Studioアセット（GCSバケット）の集計と移行方針 |
| `260921_アセット棚卸し.csv` | 全アセットURL・サイズ・Content-Type・使用ページの対応表 |
| `260921_問い合わせフォーム構成.md` | フォームの入力項目・必須/任意・選択肢の抽出結果 |
| `260921_pages.json` | 全ページのメタ情報（title/description/OGP/h1/リンク）の生データ |
| `260921_assets.json` / `260921_forms.json` | アセット参照・フォーム構成の生データ |
| `assets_backup/` | **退避済みアセット実体**（70ファイル・約19.7MB。images/ と fonts/、`download_log.json` にURL対応表） |
| `screenshots/` | 現行サイトのフルページスクリーンショット（`*_pc.png`=1440px / `*_sp.png`=390px。ビジュアルQAのベースライン） |
| `html/` | JS実行後のDOMスナップショット（デザイン・コンテンツ再現の参照元） |

## 取得条件

- ビューポート: PC 1440×900 / SP 390×844（iPhone UA・タッチ有効）
- 待機: load イベント後 3 秒 → 全画面オートスクロール（遅延読み込み発火）→ 先頭へ戻して撮影
- KASUMINサイトは**動画（mp4）0件**。画像は webp 中心

## 主な発見事項

1. KASUMINサイト本体のStudioプロジェクトIDは `bXqzew1ZOD`
2. 一部の共通部品（アイコン等）は **LAplustのプロジェクト `NxqgdRVEa1` のバケットから参照**されている（デザイン同一の裏付け）。再構築時は自サイト配下に取り込む
3. `/company/our_thoughts` `/company/company` `/company/member` は**同一DOM**（タブ/アンカー切替）。再構築時は3URLとも200で返しつつ同一ページを配信する構造（またはnginxで統合）を検討
4. `/event` は記事0件の一覧ページ
5. OGP画像・ファビコン・FontAwesomeフォントはSTUDIO共通の `production-os-assets` 配下にあり、これも退避済み
