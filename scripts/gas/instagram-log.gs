/**
 * Instagram投稿の自動ログ（Google Apps Script / KASUMIN版）
 *
 * Meta Graph API でKASUMINのInstagram投稿一覧を毎日取得し、このスクリプトが
 * 紐づくスプレッドシートのタブ「SNS発信ログ」へ新規投稿分だけ追記する。
 * 週次アクセス分析ルーティンがこのログを参照し、GA4の流入急増と投稿日を突き合わせる。
 *
 * 導入手順は docs/261014_Instagram自動ログ手順.md を参照。
 * 前提: スクリプトプロパティに PAGE_TOKEN（無期限のページアクセストークン）と
 *       IG_USER_ID（InstagramビジネスアカウントのID）を設定しておくこと。
 */

const SHEET_NAME = 'SNS発信ログ';
const GRAPH_VERSION = 'v21.0';

// 日次実行トリガーを作成する（エディタでこの関数を選んで1回だけ実行）
function setupDailyTrigger() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'fetchInstagramPosts')
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('fetchInstagramPosts').timeBased().everyDays(1).atHour(7).create();
  Logger.log('日次トリガーを作成しました（毎日7時台に fetchInstagramPosts を実行）');
}

// 本体: 最新投稿を取得してシートに追記（既存IDはスキップ）
function fetchInstagramPosts() {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('PAGE_TOKEN');
  const igUserId = props.getProperty('IG_USER_ID');
  if (!token || !igUserId) {
    throw new Error('スクリプトプロパティ PAGE_TOKEN / IG_USER_ID が未設定です');
  }

  const url =
    `https://graph.facebook.com/${GRAPH_VERSION}/${igUserId}/media` +
    '?fields=id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count' +
    '&limit=25&access_token=' + encodeURIComponent(token);
  const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  const json = JSON.parse(res.getContentText());
  if (json.error) {
    throw new Error('Graph APIエラー: ' + JSON.stringify(json.error));
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['投稿日時(JST)', '種類', 'キャプション（冒頭100字）', 'いいね', 'コメント', 'URL', '投稿ID']);
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  // 既存の投稿IDを取得（重複追記を防ぐ）
  const lastRow = sheet.getLastRow();
  const existingIds = new Set(
    lastRow > 1 ? sheet.getRange(2, 7, lastRow - 1, 1).getValues().flat().map(String) : [],
  );

  // 古い順に追記（timestampは例: 2026-10-07T09:00:00+0000）
  const newPosts = (json.data || [])
    .filter((m) => !existingIds.has(String(m.id)))
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  newPosts.forEach((m) => {
    const jst = Utilities.formatDate(new Date(m.timestamp), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');
    const caption = String(m.caption || '').replace(/\s+/g, ' ').slice(0, 100);
    sheet.appendRow([
      jst,
      m.media_product_type || m.media_type || '',
      caption,
      m.like_count != null ? m.like_count : '',
      m.comments_count != null ? m.comments_count : '',
      m.permalink || '',
      String(m.id),
    ]);
  });
  Logger.log(`取得 ${json.data ? json.data.length : 0}件 / 追記 ${newPosts.length}件`);
}

// 動作確認用: トークンとIG_USER_IDが正しいかを確認し、アカウント名をログに出す
function testConnection() {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('PAGE_TOKEN');
  const igUserId = props.getProperty('IG_USER_ID');
  const url =
    `https://graph.facebook.com/${GRAPH_VERSION}/${igUserId}` +
    '?fields=username,name,media_count&access_token=' + encodeURIComponent(token);
  const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  Logger.log(res.getContentText()); // username が表示されれば接続OK
}

// 補助: ページトークンから Instagram ビジネスアカウントIDを調べる
// （スクリプトプロパティに PAGE_TOKEN だけ設定した状態で実行し、ログのIDを IG_USER_ID に設定する）
function findIgUserId() {
  const token = PropertiesService.getScriptProperties().getProperty('PAGE_TOKEN');
  const url =
    `https://graph.facebook.com/${GRAPH_VERSION}/me` +
    '?fields=id,name,instagram_business_account&access_token=' + encodeURIComponent(token);
  const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  Logger.log(res.getContentText()); // instagram_business_account.id が IG_USER_ID
}
