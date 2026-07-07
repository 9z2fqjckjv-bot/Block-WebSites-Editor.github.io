/**
 * Custom Blockly block type definitions for Block Website Editor.
 * Each block represents an HTML element or component.
 */

Blockly.defineBlocksWithJsonArray([

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  PAGE STRUCTURE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Root HTML Document  (standalone – no prev/next connections)
  {
    'type': 'page_root',
    'message0': '🌐 Webページ\nタイトル: %1\nフォントサイズ: %2 px\n背景色: %3  文字色: %4\n%5',
    'args0': [
      { 'type': 'field_input',  'name': 'TITLE',      'text': 'マイWebサイト' },
      { 'type': 'field_number', 'name': 'FONT_SIZE',   'value': 16, 'min': 8, 'max': 72 },
      { 'type': 'field_colour', 'name': 'BG_COLOR',    'colour': '#f8f9fa' },
      { 'type': 'field_colour', 'name': 'TEXT_COLOR',  'colour': '#333333' },
      { 'type': 'input_statement', 'name': 'CONTENT' }
    ],
    'colour': 230,
    'tooltip': 'HTMLページ全体を作ります（ここがスタート地点）',
    'helpUrl': ''
  },

  // <header>
  {
    'type': 'page_header',
    'message0': '📌 ヘッダー  背景色: %1\n%2',
    'args0': [
      { 'type': 'field_colour', 'name': 'BG_COLOR', 'colour': '#2c3e50' },
      { 'type': 'input_statement', 'name': 'CONTENT' }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 210,
    'tooltip': '<header> サイトのヘッダー部分',
    'helpUrl': ''
  },

  // <nav>
  {
    'type': 'page_nav',
    'message0': '🧭 ナビゲーション\n%1',
    'args0': [
      { 'type': 'input_statement', 'name': 'CONTENT' }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 210,
    'tooltip': '<nav> ナビゲーションメニュー',
    'helpUrl': ''
  },

  // <main>
  {
    'type': 'page_main',
    'message0': '📄 メインコンテンツ\n%1',
    'args0': [
      { 'type': 'input_statement', 'name': 'CONTENT' }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 210,
    'tooltip': '<main> ページのメイン領域（最大幅1200px・中央寄せ）',
    'helpUrl': ''
  },

  // <footer>
  {
    'type': 'page_footer',
    'message0': '📎 フッター  背景色: %1\n%2',
    'args0': [
      { 'type': 'field_colour', 'name': 'BG_COLOR', 'colour': '#2c3e50' },
      { 'type': 'input_statement', 'name': 'CONTENT' }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 210,
    'tooltip': '<footer> フッターセクション',
    'helpUrl': ''
  },

  // <section>
  {
    'type': 'page_section',
    'message0': '📂 セクション  クラス: %1\n背景色: %2  パディング: %3 px\n%4',
    'args0': [
      { 'type': 'field_input',  'name': 'CLASS',   'text': '' },
      { 'type': 'field_colour', 'name': 'BG_COLOR', 'colour': '#ffffff' },
      { 'type': 'field_number', 'name': 'PADDING',  'value': 24, 'min': 0, 'max': 300 },
      { 'type': 'input_statement', 'name': 'CONTENT' }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 210,
    'tooltip': '<section> 汎用セクション',
    'helpUrl': ''
  },

  // <div>
  {
    'type': 'page_div',
    'message0': '📦 ブロック(div)  クラス: %1\n%2',
    'args0': [
      { 'type': 'field_input', 'name': 'CLASS', 'text': '' },
      { 'type': 'input_statement', 'name': 'CONTENT' }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 210,
    'tooltip': '<div> 汎用コンテナ。CSSクラスを指定できます',
    'helpUrl': ''
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  TEXT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // <h1>–<h6>
  {
    'type': 'text_heading',
    'message0': '🔤 見出し %1  テキスト: %2\n色: %3  揃え: %4',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'LEVEL',
        'options': [
          ['H1（最大）', '1'],
          ['H2（大）',   '2'],
          ['H3（中）',   '3'],
          ['H4（小）',   '4'],
          ['H5',          '5'],
          ['H6（最小）', '6']
        ]
      },
      { 'type': 'field_input',  'name': 'TEXT',  'text': '見出しテキスト' },
      { 'type': 'field_colour', 'name': 'COLOR', 'colour': '#2c3e50' },
      {
        'type': 'field_dropdown',
        'name': 'ALIGN',
        'options': [
          ['左',   'left'],
          ['中央', 'center'],
          ['右',   'right']
        ]
      }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 120,
    'tooltip': '見出しタグ h1〜h6',
    'helpUrl': ''
  },

  // <p>
  {
    'type': 'text_paragraph',
    'message0': '📝 段落\nテキスト: %1\nサイズ: %2 px  色: %3  揃え: %4',
    'args0': [
      { 'type': 'field_input',  'name': 'TEXT',      'text': 'テキストを入力してください' },
      { 'type': 'field_number', 'name': 'FONT_SIZE', 'value': 16, 'min': 8, 'max': 72 },
      { 'type': 'field_colour', 'name': 'COLOR',     'colour': '#333333' },
      {
        'type': 'field_dropdown',
        'name': 'ALIGN',
        'options': [
          ['左',   'left'],
          ['中央', 'center'],
          ['右',   'right'],
          ['両端', 'justify']
        ]
      }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 120,
    'tooltip': '段落テキスト <p>',
    'helpUrl': ''
  },

  // Raw text / inline HTML
  {
    'type': 'text_raw',
    'message0': '✏️ テキスト(生): %1',
    'args0': [
      { 'type': 'field_input', 'name': 'TEXT', 'text': 'テキスト' }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 120,
    'tooltip': '装飾なしのテキスト',
    'helpUrl': ''
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  MEDIA
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // <img>
  {
    'type': 'media_image',
    'message0': '🖼 画像\nURL: %1\n説明(alt): %2\n幅: %3  高さ: %4',
    'args0': [
      { 'type': 'field_input', 'name': 'SRC',    'text': 'https://placehold.co/600x300' },
      { 'type': 'field_input', 'name': 'ALT',    'text': '画像の説明' },
      { 'type': 'field_input', 'name': 'WIDTH',  'text': '100%' },
      { 'type': 'field_input', 'name': 'HEIGHT', 'text': 'auto' }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 270,
    'tooltip': '<img> 画像を表示',
    'helpUrl': ''
  },

  // <hr>
  {
    'type': 'media_separator',
    'message0': '➖ 区切り線',
    'args0': [],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 270,
    'tooltip': '<hr> 水平線',
    'helpUrl': ''
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  LINKS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // <a>
  {
    'type': 'link_anchor',
    'message0': '🔗 リンク\nテキスト: %1\nURL: %2\n新しいタブ: %3',
    'args0': [
      { 'type': 'field_input',    'name': 'TEXT',    'text': 'リンクテキスト' },
      { 'type': 'field_input',    'name': 'HREF',    'text': 'https://example.com' },
      { 'type': 'field_checkbox', 'name': 'NEW_TAB', 'checked': false }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 45,
    'tooltip': '<a> ハイパーリンク',
    'helpUrl': ''
  },

  // Button-styled link
  {
    'type': 'link_button',
    'message0': '🔘 ボタン\nテキスト: %1\nURL: %2\n背景色: %3  テキスト色: %4',
    'args0': [
      { 'type': 'field_input',  'name': 'TEXT',       'text': 'クリック！' },
      { 'type': 'field_input',  'name': 'HREF',       'text': '#' },
      { 'type': 'field_colour', 'name': 'BG_COLOR',   'colour': '#3498db' },
      { 'type': 'field_colour', 'name': 'TEXT_COLOR', 'colour': '#ffffff' }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 45,
    'tooltip': 'ボタン風リンク',
    'helpUrl': ''
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  LISTS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // <ul>
  {
    'type': 'list_ul',
    'message0': '• 箇条書きリスト\n%1',
    'args0': [
      { 'type': 'input_statement', 'name': 'ITEMS' }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 160,
    'tooltip': '<ul> 箇条書き（黒丸）',
    'helpUrl': ''
  },

  // <ol>
  {
    'type': 'list_ol',
    'message0': '1. 番号付きリスト\n%1',
    'args0': [
      { 'type': 'input_statement', 'name': 'ITEMS' }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 160,
    'tooltip': '<ol> 番号付きリスト',
    'helpUrl': ''
  },

  // <li>
  {
    'type': 'list_item',
    'message0': '• 項目: %1',
    'args0': [
      { 'type': 'field_input', 'name': 'TEXT', 'text': '項目テキスト' }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 160,
    'tooltip': '<li> リスト項目',
    'helpUrl': ''
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  //  COMPONENTS (pre-built templates)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Hero section
  {
    'type': 'comp_hero',
    'message0': '🦸 ヒーローセクション\nタイトル: %1\n説明文: %2\nボタンテキスト: %3\nボタンURL: %4\n背景色: %5',
    'args0': [
      { 'type': 'field_input',  'name': 'TITLE',    'text': 'ようこそ！' },
      { 'type': 'field_input',  'name': 'SUBTITLE', 'text': 'キャッチコピーをここに入力' },
      { 'type': 'field_input',  'name': 'BTN_TEXT', 'text': '詳しく見る' },
      { 'type': 'field_input',  'name': 'BTN_URL',  'text': '#' },
      { 'type': 'field_colour', 'name': 'BG_COLOR', 'colour': '#3498db' }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 55,
    'tooltip': 'トップビジュアル（ヒーロー）セクション',
    'helpUrl': ''
  },

  // Card
  {
    'type': 'comp_card',
    'message0': '🃏 カード\nタイトル: %1\n%2',
    'args0': [
      { 'type': 'field_input', 'name': 'TITLE', 'text': 'カードタイトル' },
      { 'type': 'input_statement', 'name': 'CONTENT' }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 55,
    'tooltip': 'シャドウ付きカードコンポーネント',
    'helpUrl': ''
  },

  // Grid layout
  {
    'type': 'comp_grid',
    'message0': '⊞ グリッドレイアウト  列数: %1\n%2',
    'args0': [
      {
        'type': 'field_dropdown',
        'name': 'COLS',
        'options': [
          ['2列', '2'],
          ['3列', '3'],
          ['4列', '4']
        ]
      },
      { 'type': 'input_statement', 'name': 'CONTENT' }
    ],
    'previousStatement': null,
    'nextStatement': null,
    'colour': 55,
    'tooltip': 'レスポンシブグリッドコンテナ',
    'helpUrl': ''
  }

]);
