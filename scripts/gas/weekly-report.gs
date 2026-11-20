/**
 * GA4週次レポート自動通知（Google Apps Script / KASUMIN版）
 *
 * 毎週月曜朝に、GA4（KASUMIN HP）の直近7日間の計測結果を前週と比較して
 * メールで通知する。Looker Studioダッシュボードの補助として、
 * 「見に行かなくても数字が届く」状態を作るのが目的。
 *
 * 導入手順は docs/260921_LookerStudio構築手順.md を参照。
 * 前提:
 * - GA4プロパティ「KASUMIN HP」への閲覧権限がある Google アカウント
 *   （y.harasaki@laplust.com）で standalone の Apps Script を作成する
 * - エディタ左メニュー「サービス」→「Google Analytics Data API」を追加する
 *   （識別子は AnalyticsData のまま）
 * - PROPERTY_ID を設定 → setupWeeklyTrigger を1回実行（承認あり）
 */

// ====== 設定 ======
// GA4のプロパティID（数字のみ。GA4 管理 → プロパティ設定 → プロパティID）
const PROPERTY_ID = 'ここにプロパティIDを入力';
const NOTIFY_EMAIL = 'info@laplust.com'; // 通知先（カンマ区切りで複数可）
const SITE_NAME = 'KASUMIN HP・オウンドメディア';
// Looker StudioのURL（作成後に貼るとメール末尾にリンクが付く。空なら省略）
const DASHBOARD_URL = '';

// 週次実行のトリガーを作成する（エディタでこの関数を選んで1回だけ実行）
function setupWeeklyTrigger() {
  // 二重登録を防ぐため既存の同名トリガーを削除
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'sendWeeklyReport')
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('sendWeeklyReport')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(8) // 月曜 8時台（JST。プロジェクトのタイムゾーンに依存）
    .create();
  Logger.log('週次トリガーを作成しました（毎週月曜 8時台に sendWeeklyReport を実行）');
}

// 本体: 直近7日 vs その前の7日 を集計してメール送信
// 同じ GA4 プロパティに HP とオウンドメディア（media.kasumin.biz）の両方が入るため、
// ホスト名でサイトを分けて集計する（2026/11/20〜。分けないと両サイトの数字が混ざる）
const SECTIONS = [
  { label: 'HP（kasumin.biz）', hosts: ['kasumin.biz', 'www.kasumin.biz'] },
  { label: 'オウンドメディア（media.kasumin.biz）', hosts: ['media.kasumin.biz'] },
];

function sendWeeklyReport() {
  const property = 'properties/' + PROPERTY_ID;
  const fmt = (d) => Utilities.formatDate(d, 'Asia/Tokyo', 'yyyy-MM-dd');
  const today = new Date();
  const end = new Date(today.getTime() - 1 * 86400000); // 昨日まで
  const start = new Date(end.getTime() - 6 * 86400000); // 直近7日
  const prevEnd = new Date(start.getTime() - 1 * 86400000);
  const prevStart = new Date(prevEnd.getTime() - 6 * 86400000);
  const range = { start: fmt(start), end: fmt(end), prevStart: fmt(prevStart), prevEnd: fmt(prevEnd) };

  const lines = [
    `${SITE_NAME} の週次アクセスレポートです。`,
    `対象期間: ${range.start} 〜 ${range.end}（比較: ${range.prevStart} 〜 ${range.prevEnd}）`,
  ];
  SECTIONS.forEach((sec) => {
    lines.push('', `━━ ${sec.label} ━━`, ...sectionLines(property, range, sec.hosts));
  });
  if (DASHBOARD_URL) {
    lines.push('', `ダッシュボード: ${DASHBOARD_URL}`);
  }
  lines.push('', '※このメールはGASによる自動送信です（毎週月曜朝）。');

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: `【HP週次レポート】${SITE_NAME} ${range.start}〜${range.end}`,
    body: lines.join('\n'),
  });
}

// 1つのサイト（ホスト名）分のレポート本文を作る
function sectionLines(property, range, hosts) {
  const dimensionFilter = {
    filter: { fieldName: 'hostName', inListFilter: { values: hosts } },
  };

  // 1) 全体サマリー（2期間比較）
  const summary = AnalyticsData.Properties.runReport(
    {
      dateRanges: [
        { startDate: range.start, endDate: range.end },
        { startDate: range.prevStart, endDate: range.prevEnd },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
      ],
      dimensionFilter,
    },
    property,
  );
  // dateRangeが2つある場合、rowsは期間ごとに1行ずつ返る
  const cur = metricValues(summary, 0);
  const prev = metricValues(summary, 1);

  // 2) ページ別ランキング（直近7日・上位10）
  const pages = AnalyticsData.Properties.runReport(
    {
      dateRanges: [{ startDate: range.start, endDate: range.end }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      limit: 10,
      dimensionFilter,
    },
    property,
  );

  // 3) 流入元（直近7日・上位5）
  const sources = AnalyticsData.Properties.runReport(
    {
      dateRanges: [{ startDate: range.start, endDate: range.end }],
      dimensions: [{ name: 'sessionSourceMedium' }],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
      limit: 5,
      dimensionFilter,
    },
    property,
  );

  // 4) LINE ボタンのクリック（GTM のカスタムイベント line_click。GTM・GA4 の設定後に数字が入る）
  const lineClicks = AnalyticsData.Properties.runReport(
    {
      dateRanges: [
        { startDate: range.start, endDate: range.end },
        { startDate: range.prevStart, endDate: range.prevEnd },
      ],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        andGroup: {
          expressions: [
            dimensionFilter,
            { filter: { fieldName: 'eventName', stringFilter: { value: 'line_click' } } },
          ],
        },
      },
    },
    property,
  );
  const lineCur = metricValues(lineClicks, 0);
  const linePrev = metricValues(lineClicks, 1);

  return [
    '■ 全体サマリー（前週比）',
    row('アクティブユーザー', cur[0], prev[0]),
    row('新規ユーザー', cur[1], prev[1]),
    row('表示回数', cur[2], prev[2]),
    row('平均セッション時間(秒)', Math.round(cur[3]), Math.round(prev[3])),
    row('LINEボタンのクリック', lineCur[0] || 0, linePrev[0] || 0),
    '',
    '■ ページ別（直近7日・アクティブユーザー上位10）',
    ...(pages.rows || []).map(
      (r) =>
        `  ${r.dimensionValues[0].value}  … ${r.metricValues[0].value}人 / ${r.metricValues[1].value}PV`,
    ),
    '',
    '■ 流入元（直近7日・上位5）',
    ...(sources.rows || []).map(
      (r) => `  ${r.dimensionValues[0].value}  … ${r.metricValues[0].value}人`,
    ),
  ];
}

function metricValues(report, rangeIndex) {
  const rows = report.rows || [];
  // dateRange複数指定時は dimensionValues に date_range_0 / date_range_1 が入る
  const row =
    rows.find(
      (r) =>
        r.dimensionValues &&
        r.dimensionValues.some((d) => d.value === 'date_range_' + rangeIndex),
    ) || rows[rangeIndex];
  if (!row) return [0, 0, 0, 0];
  return row.metricValues.map((m) => Number(m.value) || 0);
}

// 「値（前週値 / 前週比+N%）」の行を作る
function row(label, current, previous) {
  let diff = '-';
  if (previous > 0) {
    const pct = ((current - previous) / previous) * 100;
    diff = (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%';
  } else if (current > 0) {
    diff = 'new';
  }
  return `  ${label}: ${current}（前週 ${previous} / ${diff}）`;
}

// 動作確認用: エディタでこの関数を実行すると即時にレポートメールが送られる
function testWeeklyReport() {
  sendWeeklyReport();
}
