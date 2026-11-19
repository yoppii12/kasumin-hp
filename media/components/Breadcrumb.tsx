import Link from 'next/link';

export default function Breadcrumb({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="パンくずリスト" className="breadcrumb">
      <ol>
        {items.map((it, i) => (
          <li key={it.path}>
            {i < items.length - 1 ? <Link href={it.path}>{it.name}</Link> : <span>{it.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
