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

const TEMPLATE_XML = {
  starter: STARTER_XML,
  portfolio: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="page_root" x="20" y="20">
    <field name="TITLE">My Portfolio</field>
    <field name="FONT_SIZE">16</field>
    <field name="BG_COLOR">#f6f7fb</field>
    <field name="TEXT_COLOR">#222222</field>
    <statement name="CONTENT">
      <block type="comp_hero">
        <field name="TITLE">山田 太郎</field>
        <field name="SUBTITLE">Web / UI Engineer</field>
        <field name="BTN_TEXT">制作実績を見る</field>
        <field name="BTN_URL">#works</field>
        <field name="BG_COLOR">#4f46e5</field>
        <next>
          <block type="page_main">
            <statement name="CONTENT">
              <block type="text_heading">
                <field name="LEVEL">2</field>
                <field name="TEXT">Works</field>
                <field name="COLOR">#1f2937</field>
                <field name="ALIGN">left</field>
                <next>
                  <block type="comp_grid">
                    <field name="COLS">3</field>
                    <statement name="CONTENT">
                      <block type="comp_card">
                        <field name="TITLE">Project A</field>
                        <statement name="CONTENT">
                          <block type="text_paragraph">
                            <field name="TEXT">ECサイトのUI設計と実装。</field>
                            <field name="FONT_SIZE">14</field>
                            <field name="COLOR">#4b5563</field>
                            <field name="ALIGN">left</field>
                          </block>
                        </statement>
                        <next>
                          <block type="comp_card">
                            <field name="TITLE">Project B</field>
                            <statement name="CONTENT">
                              <block type="text_paragraph">
                                <field name="TEXT">SaaSダッシュボードのデザイン改善。</field>
                                <field name="FONT_SIZE">14</field>
                                <field name="COLOR">#4b5563</field>
                                <field name="ALIGN">left</field>
                              </block>
                            </statement>
                          </block>
                        </next>
                      </block>
                    </statement>
                  </block>
                </next>
              </block>
            </statement>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`,
  shop: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="page_root" x="20" y="20">
    <field name="TITLE">Local Shop</field>
    <field name="FONT_SIZE">16</field>
    <field name="BG_COLOR">#fffdf7</field>
    <field name="TEXT_COLOR">#2f2f2f</field>
    <statement name="CONTENT">
      <block type="comp_hero">
        <field name="TITLE">こだわりの焼き菓子</field>
        <field name="SUBTITLE">毎日手作り、季節の素材をお届けします</field>
        <field name="BTN_TEXT">メニューを見る</field>
        <field name="BTN_URL">#menu</field>
        <field name="BG_COLOR">#f59e0b</field>
        <next>
          <block type="page_main">
            <statement name="CONTENT">
              <block type="text_heading">
                <field name="LEVEL">2</field>
                <field name="TEXT">人気メニュー</field>
                <field name="COLOR">#92400e</field>
                <field name="ALIGN">center</field>
                <next>
                  <block type="comp_grid">
                    <field name="COLS">3</field>
                    <statement name="CONTENT">
                      <block type="comp_card">
                        <field name="TITLE">フィナンシェ</field>
                        <statement name="CONTENT">
                          <block type="text_paragraph">
                            <field name="TEXT">焦がしバター香る定番人気。</field>
                            <field name="FONT_SIZE">14</field>
                            <field name="COLOR">#92400e</field>
                            <field name="ALIGN">left</field>
                          </block>
                        </statement>
                        <next>
                          <block type="comp_card">
                            <field name="TITLE">クッキー缶</field>
                            <statement name="CONTENT">
                              <block type="text_paragraph">
                                <field name="TEXT">ギフトに最適な詰め合わせ。</field>
                                <field name="FONT_SIZE">14</field>
                                <field name="COLOR">#92400e</field>
                                <field name="ALIGN">left</field>
                              </block>
                            </statement>
                          </block>
                        </next>
                      </block>
                    </statement>
                  </block>
                </next>
              </block>
            </statement>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`
};

const PROJECT_VERSION = 1;
const LOCAL_PROJECT_KEY = 'block-editor:autosave-v1';

// ──────────────────────────────────────────────────────────────
//  Helpers
// ──────────────────────────────────────────────────────────────

let workspace = null;
let statusTimer = null;

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

function showStatus(message, sticky = false) {
  const el = document.getElementById('statusMessage');
  if (!el) return;
  el.textContent = message;
  if (statusTimer) clearTimeout(statusTimer);
  if (!sticky) {
    statusTimer = setTimeout(() => {
      el.textContent = '準備完了';
    }, 2000);
  }
}

function updateStatusMeta() {
  const meta = document.getElementById('statusMeta');
  if (!meta || !workspace) return;
  const count = workspace.getAllBlocks(false).length;
  meta.textContent = `ブロック数: ${count}`;
}

function workspaceToXmlText() {
  const dom = Blockly.Xml.workspaceToDom(workspace);
  return Blockly.Xml.domToText(dom);
}

function loadXmlText(xmlText) {
  const dom = Blockly.utils.xml.textToDom(xmlText);
  workspace.clear();
  Blockly.Xml.domToWorkspace(dom, workspace);
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
  updateStatusMeta();
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
  showStatus('HTMLを書き出しました');
}

function saveProjectFile() {
  const payload = {
    app: 'Block Website Editor',
    version: PROJECT_VERSION,
    savedAt: new Date().toISOString(),
    workspaceXml: workspaceToXmlText()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'project.blocksite.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
  showStatus('プロジェクトを保存しました');
}

function saveProjectToLocal() {
  localStorage.setItem(LOCAL_PROJECT_KEY, workspaceToXmlText());
}

function restoreProjectFromLocal() {
  const savedXml = localStorage.getItem(LOCAL_PROJECT_KEY);
  if (!savedXml) {
    loadXmlText(STARTER_XML);
    return;
  }
  try {
    loadXmlText(savedXml);
    showStatus('前回の作業内容を復元しました', true);
  } catch (error) {
    console.warn('Failed to restore from local storage:', error);
    loadXmlText(STARTER_XML);
  }
}

function loadProjectObject(project) {
  if (!project || typeof project.workspaceXml !== 'string') {
    throw new Error('Invalid project file');
  }
  loadXmlText(project.workspaceXml);
  updatePreview();
  showStatus('プロジェクトを読み込みました');
}

function handleProjectFileSelect(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const text = String(reader.result || '');
      const parsed = JSON.parse(text);
      loadProjectObject(parsed);
    } catch (error) {
      console.error('Failed to load project file:', error);
      window.alert('プロジェクトの読み込みに失敗しました。JSON形式を確認してください。');
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}

function applyTemplate(templateKey) {
  const xml = TEMPLATE_XML[templateKey];
  if (!xml) return;
  if (!window.confirm('現在の内容をテンプレートに置き換えますか？')) return;
  loadXmlText(xml);
  updatePreview();
  showStatus(`テンプレート「${templateKey}」を適用しました`);
}

function setViewport(mode) {
  const frame = document.getElementById('previewFrame');
  frame.classList.remove('device-tablet', 'device-mobile');
  if (mode === 'tablet') frame.classList.add('device-tablet');
  if (mode === 'mobile') frame.classList.add('device-mobile');
}

function setupViewportButtons() {
  document.querySelectorAll('.viewport-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.viewport-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setViewport(btn.dataset.viewport);
    });
  });
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', event => {
    const mod = event.metaKey || event.ctrlKey;
    if (!mod) return;

    if (event.key.toLowerCase() === 's') {
      event.preventDefault();
      exportHTML();
      return;
    }
    if (event.key.toLowerCase() === 'e') {
      event.preventDefault();
      saveProjectFile();
      return;
    }
    if (event.key.toLowerCase() === 'o') {
      event.preventDefault();
      document.getElementById('projectFileInput').click();
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      updatePreview();
    }
  });
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
  restoreProjectFromLocal();

  // Auto-preview + auto-save on edits
  const syncWorkspace = debounce(() => {
    updatePreview();
    saveProjectToLocal();
  }, 400);
  workspace.addChangeListener(event => {
    if (event && event.type === Blockly.Events.UI) return;
    syncWorkspace();
  });

  // Initial render
  setTimeout(updatePreview, 150);
}

// ──────────────────────────────────────────────────────────────
//  Tab Switching (Visual ↔ HTML Code)
// ──────────────────────────────────────────────────────────────

function setupTabs() {
  document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn[data-tab]').forEach(b => b.classList.remove('active'));
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
  document.getElementById('btnUndo').addEventListener('click', () => workspace.undo(false));
  document.getElementById('btnRedo').addEventListener('click', () => workspace.undo(true));
  document.getElementById('btnNew').addEventListener('click', () => {
    if (!window.confirm('新規プロジェクトを作成しますか？\n現在の内容は置き換えられます。')) return;
    loadXmlText(STARTER_XML);
    updatePreview();
    saveProjectToLocal();
    showStatus('新規プロジェクトを作成しました');
  });
  document.getElementById('btnSaveProject').addEventListener('click', saveProjectFile);
  document.getElementById('btnLoadProject').addEventListener('click', () => {
    document.getElementById('projectFileInput').click();
  });
  document.getElementById('projectFileInput').addEventListener('change', handleProjectFileSelect);
  document.getElementById('templateSelect').addEventListener('change', event => {
    applyTemplate(event.target.value);
    event.target.value = '';
  });
  document.getElementById('btnPreview').addEventListener('click', updatePreview);
  document.getElementById('btnExport').addEventListener('click', exportHTML);
  document.getElementById('btnClear').addEventListener('click', () => {
    if (window.confirm('ワークスペースをクリアしますか？\nこの操作は元に戻せません。')) {
      workspace.clear();
      updatePreview();
      saveProjectToLocal();
      showStatus('ワークスペースをクリアしました');
    }
  });
}

// ──────────────────────────────────────────────────────────────
//  Bootstrap
// ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initWorkspace();
  setupTabs();
  setupViewportButtons();
  setupResizeHandle();
  setupResizeObserver();
  setupButtons();
  setupKeyboardShortcuts();
});
