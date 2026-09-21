'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: '事業紹介', href: '/#business' },
  { label: '会社情報', href: '/company' },
  { label: 'ニュース', href: '/news' },
  { label: 'イベント運営', href: '/event' },
  { label: 'KASUMINブログ', href: 'https://note.com/kasumin977', external: true },
  { label: 'お問い合わせ', href: '/contact' },
];

function Nav() {
  return (
    <nav className="site-header__nav">
      {NAV_ITEMS.map((item) =>
        item.external ? (
          <a key={item.label} href={item.href} target="_blank" rel="noopener">
            {item.label}
          </a>
        ) : (
          <Link key={item.label} href={item.href}>
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
}

// モバイル用の全画面メニュー
function MobileMenu({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    // 表示中は背景のスクロールをロック
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="mobile-menu" role="dialog" aria-modal="true">
      <div className="mobile-menu__head">
        <Link href="/" className="site-header__logo" aria-label="KASUMIN" onClick={onClose} />
        <button
          type="button"
          className="mobile-menu__close"
          aria-label="メニューを閉じる"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
      </div>
      <nav className="mobile-menu__nav">
        {NAV_ITEMS.map((item) =>
          item.external ? (
            <a key={item.label} href={item.href} target="_blank" rel="noopener">
              {item.label}
              <svg viewBox="0 0 8 12" aria-hidden="true">
                <path d="M1 1l5 5-5 5" />
              </svg>
            </a>
          ) : (
            <Link key={item.label} href={item.href} onClick={onClose}>
              {item.label}
              <svg viewBox="0 0 8 12" aria-hidden="true">
                <path d="M1 1l5 5-5 5" />
              </svg>
            </Link>
          ),
        )}
        <div className="mobile-menu__sns">
          <a
            href="https://www.instagram.com/kasumin.jasmine/"
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 448 512" aria-hidden="true">
              <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
            </svg>
          </a>
        </div>
        <div className="mobile-menu__logo" aria-hidden="true" />
      </nav>
    </div>
  );
}

// transparent: トップページ用（ヒーロー写真に重ねる白抜きヘッダー）
export default function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [stickyVisible, setStickyVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const burger = (
    <button
      type="button"
      className="site-header__burger"
      aria-label="メニューを開く"
      onClick={() => setOpen(true)}
    >
      <span />
      <span />
      <span />
    </button>
  );

  return (
    <>
      <header className={`site-header${transparent ? ' site-header--transparent' : ''}`}>
        <Link href="/" className="site-header__logo" aria-label="KASUMIN" />
        <Nav />
        {burger}
      </header>
      <header className={`site-header site-header--sticky${stickyVisible ? ' is-visible' : ''}`}>
        <Link href="/" className="site-header__logo" aria-label="KASUMIN" />
        <Nav />
        {burger}
      </header>
      {open && <MobileMenu onClose={() => setOpen(false)} />}
    </>
  );
}
