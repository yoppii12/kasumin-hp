---
# 記事テンプレート（先頭が _ のファイルはビルドされない）。コピーして content/articles/<slug>.md を作る
slug: "example-slug"              # 英数字とハイフン。公開後は変えない
title: "記事タイトル｜補足"        # 32文字前後を目安に
description: "検索結果に出る説明文。120字前後。"
pillar: "nagasaki"                # nagasaki / spot / short-time / return / nursery
isPillar: false                   # 柱の記事なら true
targetKeyword: "長崎 保育士 ○○"
author: "hirata-kasumi"           # content/authors のファイル名
reviewer: ""                      # 税・社会保険・労働法令の記事は確認者が必須
publishedAt: 2026-12-01
updatedAt: 2026-12-01
reviewBy: 2027-04-01              # 次回点検日（制度・金額の記事は年度替わりの前）
cta: "line"                       # line / line-area（長崎県外の読者が多い記事）
summary:
  - "要点1（結論を先に）"
  - "要点2"
  - "要点3"
faq:
  - q: "よくある質問"
    a: "答え。本文と同じ内容だけを書く"
sources:
  - title: "出典のページ名（発行元）"
    url: "https://example.com/"
draft: true                       # 公開するときに false
noindex: false
---

## 見出し

本文。表を1つ以上入れる。

| 項目 | 内容 |
|---|---|
| ○○ | ○○ |
