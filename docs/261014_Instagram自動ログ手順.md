# Instagram投稿の自動ログ 構築手順（案A: Graph API＋GAS）

週次アクセス分析レポートの改善提案③（SNS投稿日とGA4流入の突き合わせ）の実装。
KASUMINのInstagram投稿を毎日自動取得してスプレッドシート「SNS発信ログ」に記録し、
週次分析ルーティンがそれを参照する。

```
Instagram（プロアカウント）→ Meta Graph API → GAS（日次トリガー）
→ シート「SNS発信ログ」に追記 → 週次分析ルーティンが参照（リンク閲覧でCSV取得）
```

- スクリプト: `scripts/gas/instagram-log.gs`
- 記録内容: 投稿日時・種類（フィード/リール等）・キャプション冒頭・いいね/コメント数・URL

## 前提条件（最初に確認）

1. KASUMINのInstagramが**プロアカウント（ビジネスまたはクリエイター）**であること
   （Instagramアプリ: 設定とプライバシー → アカウントの種類とツール で確認）
2. そのInstagramが**Facebookページに連携**されていること
   （未連携なら: Instagramの 設定 → アカウントセンター → Facebookページを追加）
3. 作業者が**そのFacebookページの管理者権限**を持つFacebookアカウントでログインできること
   （平田様本人が作業するか、平田様から原崎へページ権限を付与してもらう）

## 1. アクセストークンの取得（Meta側・約20分・初回のみ）

1. [developers.facebook.com](https://developers.facebook.com) に（前提3の）Facebookアカウントでログイン →「マイアプリ」→「アプリを作成」
   - ユースケース: 「その他」→ アプリタイプ: 「ビジネス」
   - アプリ名: `KASUMIN SNS Log` 等
2. 作成したアプリのダッシュボード → 上部メニュー「ツール」→「**グラフAPIエクスプローラ**」
3. 右側の設定:
   - Metaアプリ: 作成したアプリ
   - ユーザーまたはページ: 「ユーザートークンを取得」
   - 権限（アクセス許可）に以下を追加: `pages_show_list` `instagram_basic` `pages_read_engagement` `business_management`
4. 「Generate Access Token」→ Facebookの認証ダイアログで許可（対象のFacebookページとInstagramアカウントを選択）
5. **長期トークンに交換**: エクスプローラのトークン右側の「ℹ」→「アクセストークンツールで開く」→「**アクセストークンを延長**」ボタン → 延長後のトークンをコピー
6. **無期限のページトークンを取得**: グラフAPIエクスプローラに戻り、トークン欄に手順5の長期トークンを貼る → クエリを `me/accounts` にして送信 → レスポンスの対象ページの `access_token` をコピー
   → **これが PAGE_TOKEN**（ページトークンは無期限。以後の更新作業は不要）

## 2. GASの設置（約10分）

どのGoogleアカウントでもよいが、**h.kasumi@kasumin.biz を推奨**（フォームGASと管理を揃える）。

1. [sheets.google.com](https://sheets.google.com) で新規スプレッドシート「KASUMIN SNS発信ログ」を作成
2. 拡張機能 → Apps Script → `scripts/gas/instagram-log.gs` の内容を貼り付けて保存
3. エディタ左の歯车「プロジェクトの設定」→ 下部「**スクリプト プロパティ**」→ プロパティを追加:
   - `PAGE_TOKEN`: 手順1-6のページトークン
4. 関数 `findIgUserId` を実行（初回承認あり）→ ログに出る `instagram_business_account.id` の数字をコピー
   → スクリプトプロパティに `IG_USER_ID` として追加
5. 関数 `testConnection` を実行 → ログにInstagramのusernameが出れば接続OK
6. 関数 `fetchInstagramPosts` を実行 → シート「SNS発信ログ」に直近25件が記録されることを確認
7. 関数 `setupDailyTrigger` を実行 → 毎日7時台の自動取得が始まる
8. スプレッドシートの共有を「**リンクを知っている全員が閲覧可**」に変更（ルーティンが読むため。
   投稿は公開情報なので問題ない。**トークンはスクリプトプロパティ内なので共有されない**）

## 3. 週次分析ルーティンへの組み込み（Claude側・構築完了後に依頼）

シートのURLを共有すると、ルーティンのプロンプトに「SNS発信ログを読み、GA4の日次流入の
変動と投稿日を突き合わせる」手順を追加する（CSVエクスポートURLで取得）。

## 運用メモ

- トークン類（PAGE_TOKEN）はGASのスクリプトプロパティのみに保存。Notion・GitHubに書かない
- Metaアプリは「開発モード」のままでよい（自分のページ/IGを読むだけなら審査不要）
- 取得は直近25件。日次実行なので取りこぼしは実質発生しない
- いいね・コメント数は「追記時点」の値（後から伸びても更新されない）。傾向把握用と割り切る
- エラーが続く場合は `testConnection` のログを確認（トークン失効ならページトークンを再取得）
