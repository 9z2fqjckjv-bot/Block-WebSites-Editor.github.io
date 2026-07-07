/**
 * Main application for Block Website Editor.
 * Handles: Blockly workspace init, live preview, HTML export,
 * tab switching, and the drag-to-resize panel divider.
 */

'use strict';

// ──────────────────────────────────────────────────────────────
//  Starter template loaded into the workspace on first launch
// ──────────────────────────────────────────────────────────────
const STARTER_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="page_root" x="20" y="20">
    <field name="TITLE">マイWebサイト</field>
    <field name="FONT_SIZE">16</field>
    <field name="BG_COLOR">#f8f9fa</field>
    <field name="TEXT_COLOR">#333333</field>
    <statement name="CONTENT">
      <block type="comp_hero">
        <field name="TITLE">ようこそ！</field>
        <field name="SUBTITLE">このページは Block Website Editor で作られました</field>
        <field name="BTN_TEXT">詳しく見る</field>
        <field name="BTN_URL">#about</field>
        <field name="BG_COLOR">#3498db</field>
        <next>
          <block type="page_main">
            <statement name="CONTENT">
              <block type="text_heading">
                <field name="LEVEL">2</field>
                <field name="TEXT">ブロックでWebサイトを作ろう！</field>
                <field name="COLOR">#2c3e50</field>
                <field name="ALIGN">center</field>
                <next>
                  <block type="text_paragraph">
                    <field name="TEXT">左のエディタからブロックをドラッグして、自分だけのWebサイトを作ってください。完成したら「HTMLダウンロード」ボタンを押して保存しましょう。</field>
                    <field name="FONT_SIZE">16</field>
                    <field name="COLOR">#555555</field>
                    <field name="ALIGN">center</field>
                    <next>
                      <block type="comp_grid">
                        <field name="COLS">3</field>
                        <statement name="CONTENT">
                          <block type="comp_card">
                            <field name="TITLE">🏗 ページ構造</field>
                            <statement name="CONTENT">
                              <block type="text_paragraph">
                                <field name="TEXT">header / nav / main / footer などのセマンティックなブロックが揃っています。</field>
                                <field name="FONT_SIZE">14</field>
                                <field name="COLOR">#555555</field>
                                <field name="ALIGN">left</field>
                              </block>
                            </statement>
                            <next>
                              <block type="comp_card">
                                <field name="TITLE">📝 テキスト</field>
                                <statement name="CONTENT">
                                  <block type="text_paragraph">
                                    <field name="TEXT">見出し・段落などのテキスト要素を色・サイズ・揃えつきで追加できます。</field>
                                    <field name="FONT_SIZE">14</field>
                                    <field name="COLOR">#555555</field>
                                    <field name="ALIGN">left</field>
                                  </block>
                                </statement>
                                <next>
                                  <block type="comp_card">
                                    <field name="TITLE">💾 エクスポート</field>
                                    <statement name="CONTENT">
                                      <block type="text_paragraph">
                                        <field name="TEXT">「HTMLダウンロード」ボタンで完成したHTMLをindex.htmlとして保存し、GitHub Pagesで公開できます。</field>
                                        <field name="FONT_SIZE">14</field>
                                        <field name="COLOR">#555555</field>
                                        <field name="ALIGN">left</field>
                                      </block>
                                    </statement>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </statement>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </statement>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`;

// ──────────────────────────────────────────────────────────────
//  Helpers
// ──────────────────────────────────────────────────────────────

let workspace = null;

/** Simple debounce to avoid flooding the preview on rapid edits. */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/** Return the fallback HTML displayed when the workspace is empty. */
function emptyPageHTML() {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>空のページ</title>
  <style>
    body {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      font-family: sans-serif;
      color: #888;
      background: #f9f9f9;
    }
    p { font-size: 1.2rem; }
  </style>
</head>
<body>
  <p>🧩 ブロックを追加してWebサイトを作りましょう！</p>
</body>
</html>`;
}

// ──────────────────────────────────────────────────────────────
//  HTML Generation
// ──────────────────────────────────────────────────────────────

/**
 * Walk top-level blocks and generate HTML.
 * Prefers a page_root block; otherwise wraps fragments in a template.
 */
function generateHTML() {
  const topBlocks = workspace.getTopBlocks(true);
  if (topBlocks.length === 0) return emptyPageHTML();

  // Prefer the dedicated page_root block
  const root = topBlocks.find(b => b.type === 'page_root');
  if (root) {
    try { return htmlGen.blockToCode(root); } catch (e) { console.error('Failed to generate HTML from page_root block:', e); }
  }

  // Fallback: wrap any top-level fragments in a bare HTML template
  let fragments = '';
  for (const block of topBlocks) {
    try { fragments += htmlGen.blockToCode(block); } catch (e) { console.warn('Failed to generate code for block:', block.type, e); }
  }
  if (!fragments.trim()) return emptyPageHTML();

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>プレビュー</title>
  <style>
    body { font-family: sans-serif; padding: 1rem; }
    img  { max-width: 100%; }
  </style>
</head>
<body>
${fragments}</body>
</html>`;
}

// ──────────────────────────────────────────────────────────────
//  Preview
// ──────────────────────────────────────────────────────────────

let previewBlobUrl = null;

function updatePreview() {
  const html = generateHTML();

  // Sync code view
  document.getElementById('codeContent').textContent = html;

  // Update iframe via Blob URL to allow relative resource loading
  const blob = new Blob([html], { type: 'text/html' });
  const newUrl = URL.createObjectURL(blob);
  document.getElementById('previewFrame').src = newUrl;

  if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
  previewBlobUrl = newUrl;
}

// ──────────────────────────────────────────────────────────────
//  Export
// ──────────────────────────────────────────────────────────────

function exportHTML() {
  const html = generateHTML();
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'index.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

// ──────────────────────────────────────────────────────────────
//  Blockly Workspace Init
// ──────────────────────────────────────────────────────────────

function initWorkspace() {
  // Build a dark theme when the Blockly API supports it
  let theme;
  try {
    theme = Blockly.Theme.defineTheme('blockEditorDark', {
      base: Blockly.Themes.Classic,
      componentStyles: {
        workspaceBackgroundColour: '#1e1e2e',
        toolboxBackgroundColour:   '#181825',
        toolboxForegroundColour:   '#cdd6f4',
        flyoutBackgroundColour:    '#24273a',
        flyoutForegroundColour:    '#cdd6f4',
        flyoutOpacity:             1,
        scrollbarColour:           '#45475a',
        scrollbarOpacity:          0.5,
      }
    });
  } catch (_) {
    theme = undefined;
  }

  const config = {
    toolbox: TOOLBOX,
    grid: { spacing: 20, length: 3, colour: '#2a2a3e', snap: true },
    zoom: {
      controls:   true,
      wheel:      true,
      startScale: 0.9,
      maxScale:   2.5,
      minScale:   0.3,
      scaleSpeed: 1.2
    },
    trashcan: true,
    move: { scrollbars: true, drag: true, wheel: true },
  };
  if (theme) config.theme = theme;

  workspace = Blockly.inject('blocklyDiv', config);

  // Load starter template
  try {
    const dom = Blockly.utils.xml.textToDom(STARTER_XML);
    Blockly.Xml.domToWorkspace(dom, workspace);
  } catch (e) {
    console.warn('Failed to load starter template:', e);
  }

  // Auto-preview on edits (debounced — 400ms balances responsiveness with performance)
  workspace.addChangeListener(debounce(updatePreview, 400));

  // Initial render
  setTimeout(updatePreview, 150);
}

// ──────────────────────────────────────────────────────────────
//  Tab Switching (Visual ↔ HTML Code)
// ──────────────────────────────────────────────────────────────

function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const isPreview = btn.dataset.tab === 'preview';
      document.getElementById('previewFrame').hidden = !isPreview;
      document.getElementById('codeView').hidden     =  isPreview;

      if (!isPreview) {
        // Refresh code text whenever the code tab is revealed
        document.getElementById('codeContent').textContent = generateHTML();
      }
    });
  });
}

// ──────────────────────────────────────────────────────────────
//  Drag-to-resize divider
// ──────────────────────────────────────────────────────────────

function setupResizeHandle() {
  const handle      = document.getElementById('resizeHandle');
  const editorPanel = document.getElementById('editorPanel');
  const layout      = document.getElementById('editorLayout');

  let dragging   = false;
  let startX     = 0;
  let startWidth = 0;

  handle.addEventListener('mousedown', e => {
    dragging   = true;
    startX     = e.clientX;
    startWidth = editorPanel.offsetWidth;
    handle.classList.add('dragging');
    document.body.style.cursor     = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const min      = 280;
    const max      = layout.offsetWidth - 280;
    const newWidth = Math.max(min, Math.min(startWidth + (e.clientX - startX), max));
    editorPanel.style.width = newWidth + 'px';
    Blockly.svgResize(workspace);
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('dragging');
    document.body.style.cursor     = '';
    document.body.style.userSelect = '';
    Blockly.svgResize(workspace);
  });
}

// ──────────────────────────────────────────────────────────────
//  Window resize → keep Blockly SVG in sync
// ──────────────────────────────────────────────────────────────

function setupResizeObserver() {
  const target = document.getElementById('blocklyDiv');
  if (window.ResizeObserver) {
    new ResizeObserver(() => workspace && Blockly.svgResize(workspace)).observe(target);
  } else {
    window.addEventListener('resize', () => workspace && Blockly.svgResize(workspace));
  }
}

// ──────────────────────────────────────────────────────────────
//  Button wiring
// ──────────────────────────────────────────────────────────────

function setupButtons() {
  document.getElementById('btnPreview').addEventListener('click', updatePreview);
  document.getElementById('btnExport').addEventListener('click', exportHTML);
  document.getElementById('btnClear').addEventListener('click', () => {
    if (window.confirm('ワークスペースをクリアしますか？\nこの操作は元に戻せません。')) {
      workspace.clear();
      updatePreview();
    }
  });
}

// ──────────────────────────────────────────────────────────────
//  Bootstrap
// ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initWorkspace();
  setupTabs();
  setupResizeHandle();
  setupResizeObserver();
  setupButtons();
});
