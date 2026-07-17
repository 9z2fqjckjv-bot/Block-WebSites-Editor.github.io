# 🧩 Block Website Editor

**ブロックを組み合わせてWebサイトを作れる、ビジュアルプログラミングエディタ**

> WordPressのようなサイト制作体験と [Google Blockly](https://developers.google.com/blockly) を組み合わせた、コードレスな静的Webサイトビルダー。GitHub Pages での公開に最適。

## ✨ 特徴

| 機能 | 説明 |
|------|------|
| 🧩 ブロックエディタ | ドラッグ&ドロップでHTMLを組み立て |
| 👁 リアルタイムプレビュー | 編集するたびに右ペインで即座に確認 |
| 💾 HTMLエクスポート | 完成品を `index.html` としてダウンロード |
| 📦 プロジェクト保存/読込 | Blockly構成をJSONで保存し、あとで再開 |
| ♻ 自動保存 | ブラウザの `localStorage` に作業内容を自動バックアップ |
| ↶ Undo / ↷ Redo | Scratchライクに試行錯誤しやすい操作性 |
| 🧭 配置カスタマイズ | 画像・ボタンの左寄せ/中央/右寄せ、相対/絶対/固定配置、重なり順(z-index)に対応 |
| 🖼 画像の表示切替・リンク化 | 画像ごとに表示/非表示を設定し、クリック時の遷移先URLを指定可能 |
| 🧾 表示中画像の抽出 | 現在表示されている画像（複数可）を抽出し、プロジェクトJSONへ保存 |
| 📱 端末プレビュー切替 | PC / タブレット / モバイル幅をワンクリック確認 |
| 📱 レスポンシブ | モバイル対応のCSSグリッドを自動生成 |
| 🌐 ゼロ依存 | CDN上のBlocklyのみ使用・インストール不要 |

## 🚀 使い方

1. [GitHub Pages で開く](https://9z2fqjckjv-bot.github.io/Block-WebSites-Editor.github.io/) か、`index.html` をブラウザで直接開く
2. 左のツールボックスからブロックをドラッグしてエディタへ
3. 右ペインでリアルタイムプレビューを確認
4. 「💾 HTMLダウンロード」で `index.html` を保存
5. 保存したファイルを GitHub リポジトリにアップロードして GitHub Pages で公開！

### 実用ワークフロー（おすすめ）

1. 「テンプレート」から下地を選ぶ（スターター / ポートフォリオ / ショップ）
2. ブロックを編集しながら Undo / Redo で調整
3. 必要に応じて「📦 保存」でプロジェクトJSONを書き出し
4. 別日に「📂 読込」で続きから再開
5. 完成後にHTMLをダウンロードして公開

### ショートカット

- `Ctrl/Cmd + S` : HTMLダウンロード
- `Ctrl/Cmd + E` : プロジェクトJSON保存
- `Ctrl/Cmd + O` : プロジェクトJSON読込
- `Ctrl/Cmd + Enter` : プレビュー更新

## 🗂 ブロック一覧

### 🏗 ページ構造
`Webページ` / `ヘッダー` / `ナビゲーション` / `メインコンテンツ` / `フッター` / `セクション` / `ブロック(div)`

### 📝 テキスト
`見出し (H1–H6)` / `段落` / `テキスト(生)`

### 🖼 メディア
`画像`（表示/非表示・クリックリンク・揃え・配置・重なり順対応） / `区切り線` / `カスタムHTML埋め込み`

### 🔗 リンク
`リンク` / `ボタン`（揃え・配置・重なり順対応）

### 📋 リスト
`箇条書きリスト` / `番号付きリスト` / `リスト項目`

### ⭐ コンポーネント
`ヒーローセクション` / `カード` / `グリッドレイアウト`

## 🛠 ファイル構成

```
index.html          # メインエントリポイント
css/
  style.css         # エディタUIのスタイル（ダークテーマ）
js/
  toolbox.js        # Blocklyツールボックス設定
  blocks.js         # カスタムブロック定義
  generators.js     # ブロック → HTML コード生成
  image-extractor.js# 表示中画像の抽出ユーティリティ
  app.js            # アプリ初期化・プレビュー・エクスポート
```

## 🖼 表示中画像抽出の呼び出しコード

### HTML（`index.html`）

`app.js` から利用するため、`image-extractor.js` を先に読み込みます。

```html
<script src="js/toolbox.js"></script>
<script src="js/blocks.js"></script>
<script src="js/generators.js"></script>
<script src="js/image-extractor.js"></script>
<script src="js/app.js"></script>
```

### JSON（プロジェクト保存データ）

保存時に `visibleImages` へ表示中画像の一覧を格納します。

```js
const payload = {
  app: 'Block Website Editor',
  version: PROJECT_VERSION,
  savedAt: new Date().toISOString(),
  workspaceXml: workspaceToXmlText(),
  visibleImages: getVisibleImagesSnapshot(html)
};
```

## 🔧 開発

追加のビルドステップは不要です。ファイルをそのまま GitHub Pages でホストできます。

```bash
# ローカルで試す（任意のHTTPサーバー）
npx serve .
# または
python3 -m http.server 8080
```
