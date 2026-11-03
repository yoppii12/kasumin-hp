import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container section">
      <h1 className="page-title">ページが見つかりません</h1>
      <p>お探しのページは移動または削除された可能性があります。</p>
      <p className="more"><Link href="/">トップへ戻る</Link></p>
    </div>
  );
}
