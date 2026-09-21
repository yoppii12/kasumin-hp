// フォーム送信の共通処理: GAS Webアプリへ送信し、Googleスプレッドシートに記録する。
// 方式はホスティング環境（Netlify/VPS）に依存しない（要件定義書8-3節のSheets連携）。
// GAS側の実装: scripts/gas/form-receiver.gs / 手順: docs/260903_フォームSheets連携手順.md
// GAS側の実装: scripts/gas/form-receiver.gs / 手順: docs/260921_フォームSheets連携手順.md
// （通知先: info@kasumin.biz / 実行アカウント: h.kasumi@kasumin.biz）
const GAS_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbwZD9wp41enWg_WdjHIA6s2utdZVfS39a6R4C_S-Jvn2TmOoU5j-iOcwN4NjCWVurmX/exec';

export async function submitForm(
  formName: string,
  data: Record<string, FormDataEntryValue>,
): Promise<void> {
  // URLSearchParams（フォームエンコード）はCORSのプリフライトが発生しない
  if (!GAS_ENDPOINT) throw new Error('form endpoint not configured');
  const body = new URLSearchParams();
  body.set('form_name', formName);
  body.set('page', window.location.pathname);
  for (const [key, value] of Object.entries(data)) {
    body.set(key, String(value));
  }
  const res = await fetch(GAS_ENDPOINT, { method: 'POST', body });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json().catch(() => null)) as { ok?: boolean } | null;
  if (!json?.ok) throw new Error('submit failed');
}
