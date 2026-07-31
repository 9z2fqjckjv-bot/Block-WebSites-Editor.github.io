/**
 * HTML import utility for Block Website Editor.
 * Fetches a website and converts common HTML elements to Blockly XML.
 */

'use strict';

(function () {
  function xmlEsc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function normalizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function styleOf(element) {
    const style = {};
    const raw = element.getAttribute('style') || '';
    raw.split(';').forEach(part => {
      const idx = part.indexOf(':');
      if (idx <= 0) return;
      const key = part.slice(0, idx).trim().toLowerCase();
      const value = part.slice(idx + 1).trim();
      if (key) style[key] = value;
    });
    return style;
  }

  function block(type, fields = {}, statements = {}) {
    return { type, fields, statements, next: null };
  }

  function chainBlocks(blocks) {
    const filtered = blocks.filter(Boolean);
    for (let i = 0; i < filtered.length - 1; i += 1) {
      filtered[i].next = filtered[i + 1];
    }
    return filtered[0] || null;
  }

  function blockToXml(node) {
    if (!node) return '';
    let xml = `<block type="${xmlEsc(node.type)}">`;
    Object.entries(node.fields || {}).forEach(([name, value]) => {
      xml += `<field name="${xmlEsc(name)}">${xmlEsc(value)}</field>`;
    });
    Object.entries(node.statements || {}).forEach(([name, child]) => {
      if (!child) return;
      xml += `<statement name="${xmlEsc(name)}">${blockToXml(child)}</statement>`;
    });
    if (node.next) xml += `<next>${blockToXml(node.next)}</next>`;
    xml += '</block>';
    return xml;
  }

  function resolveTitle(doc, sourceUrl) {
    if (doc.title && doc.title.trim()) return doc.title.trim();
    try {
      const host = new URL(sourceUrl).hostname;
      return host || 'Imported Website';
    } catch {
      return 'Imported Website';
    }
  }

  function extractAnchorAttrs(element) {
    const parent = element.parentElement;
    if (!parent || parent.tagName.toLowerCase() !== 'a' || parent.children.length !== 1) {
      return { href: '', newTab: 'FALSE' };
    }
    return {
      href: parent.getAttribute('href') || '',
      newTab: parent.getAttribute('target') === '_blank' ? 'TRUE' : 'FALSE'
    };
  }

  function convertListItems(element) {
    const items = [];
    element.querySelectorAll(':scope > li').forEach(li => {
      const text = normalizeText(li.textContent);
      if (!text) return;
      items.push(block('list_item', { TEXT: text }));
    });
    return chainBlocks(items);
  }

  function convertChildrenToStatement(element) {
    const children = [];
    element.childNodes.forEach(node => {
      const converted = convertNode(node);
      if (converted) children.push(converted);
    });
    return chainBlocks(children);
  }

  function convertNode(node) {
    if (!node) return null;
    if (node.nodeType === Node.TEXT_NODE) {
      const text = normalizeText(node.textContent);
      if (!text) return null;
      return block('text_raw', { TEXT: text });
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const element = node;
    const tag = element.tagName.toLowerCase();
    const style = styleOf(element);

    if (tag === 'header') {
      return block(
        'page_header',
        { BG_COLOR: style['background-color'] || '#2c3e50' },
        { CONTENT: convertChildrenToStatement(element) }
      );
    }
    if (tag === 'nav') {
      return block('page_nav', {}, { CONTENT: convertChildrenToStatement(element) });
    }
    if (tag === 'main') {
      return block('page_main', {}, { CONTENT: convertChildrenToStatement(element) });
    }
    if (tag === 'footer') {
      return block(
        'page_footer',
        { BG_COLOR: style['background-color'] || '#2c3e50' },
        { CONTENT: convertChildrenToStatement(element) }
      );
    }
    if (tag === 'section') {
      return block(
        'page_section',
        {
          CLASS: element.className || '',
          BG_COLOR: style['background-color'] || '#ffffff',
          PADDING: parseInt(style.padding, 10) || 24
        },
        { CONTENT: convertChildrenToStatement(element) }
      );
    }
    if (tag === 'div') {
      return block(
        'page_div',
        { CLASS: element.className || '' },
        { CONTENT: convertChildrenToStatement(element) }
      );
    }
    if (/^h[1-6]$/.test(tag)) {
      return block('text_heading', {
        LEVEL: tag.slice(1),
        TEXT: normalizeText(element.textContent) || '見出し',
        COLOR: style.color || '#2c3e50',
        ALIGN: style['text-align'] || 'left'
      });
    }
    if (tag === 'p') {
      return block('text_paragraph', {
        TEXT: normalizeText(element.textContent) || 'テキスト',
        FONT_SIZE: parseInt(style['font-size'], 10) || 16,
        COLOR: style.color || '#333333',
        ALIGN: style['text-align'] || 'left'
      });
    }
    if (tag === 'img') {
      const anchor = extractAnchorAttrs(element);
      return block('media_image', {
        SRC: element.getAttribute('src') || '',
        ALT: element.getAttribute('alt') || '画像',
        WIDTH: element.getAttribute('width') || style.width || '100%',
        HEIGHT: element.getAttribute('height') || style.height || 'auto',
        ALIGN: 'left',
        POSITION: style.position || 'static',
        OFFSET_X: style.left || '0px',
        OFFSET_Y: style.top || '0px',
        VISIBILITY: style.display === 'none' ? 'hidden' : 'visible',
        Z_INDEX: parseInt(style['z-index'], 10) || 1,
        HREF: anchor.href,
        NEW_TAB: anchor.newTab
      });
    }
    if (tag === 'a') {
      if (element.children.length === 1 && element.firstElementChild && element.firstElementChild.tagName.toLowerCase() === 'img') {
        return null;
      }
      return block('link_anchor', {
        TEXT: normalizeText(element.textContent) || 'リンク',
        HREF: element.getAttribute('href') || '#',
        NEW_TAB: element.getAttribute('target') === '_blank' ? 'TRUE' : 'FALSE'
      });
    }
    if (tag === 'ul') {
      return block('list_ul', {}, { ITEMS: convertListItems(element) });
    }
    if (tag === 'ol') {
      return block('list_ol', {}, { ITEMS: convertListItems(element) });
    }
    if (tag === 'hr') {
      return block('media_separator');
    }
    if (tag === 'script' || tag === 'noscript') {
      return block('media_embed_html', { HTML: element.outerHTML });
    }
    if (tag === 'iframe' || tag === 'video' || tag === 'audio') {
      return block('media_embed_html', { HTML: element.outerHTML });
    }
    return block('media_embed_html', { HTML: element.outerHTML });
  }

  function collectBodyTopScripts(body) {
    const blocks = [];
    const consumed = new Set();
    for (const element of Array.from(body.children)) {
      const tag = element.tagName.toLowerCase();
      if (tag !== 'script' && tag !== 'noscript') break;
      blocks.push(block('script_body_top_code', { CODE: element.outerHTML }));
      consumed.add(element);
    }
    return { chain: chainBlocks(blocks), consumed };
  }

  function htmlToWorkspaceXml(html, sourceUrl = '') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(String(html || ''), 'text/html');
    const root = block('page_root', {
      TITLE: resolveTitle(doc, sourceUrl),
      FONT_SIZE: 16,
      BG_COLOR: '#f8f9fa',
      TEXT_COLOR: '#333333'
    });

    const headBlocks = [];
    doc.head.querySelectorAll('script, noscript').forEach(el => {
      headBlocks.push(block('script_head_code', { CODE: el.outerHTML }));
    });
    root.statements.HEAD_CONTENT = chainBlocks(headBlocks);

    const { chain: bodyTopChain, consumed } = collectBodyTopScripts(doc.body);
    root.statements.BODY_TOP_CONTENT = bodyTopChain;

    const contentBlocks = [];
    doc.body.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && consumed.has(node)) return;
      const converted = convertNode(node);
      if (converted) contentBlocks.push(converted);
    });
    root.statements.CONTENT = chainBlocks(contentBlocks);

    return `<xml xmlns="https://developers.google.com/blockly/xml">${blockToXml(root)}</xml>`;
  }

  function withTimeout(fetchPromise, timeoutMs) {
    return Promise.race([
      fetchPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('タイムアウトしました')), timeoutMs))
    ]);
  }

  async function fetchHtmlFromUrl(url) {
    const trimmed = String(url || '').trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      throw new Error('URLは http:// または https:// から始めてください。');
    }

    const noScheme = trimmed.replace(/^https?:\/\//i, '');
    const candidates = [
      trimmed,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(trimmed)}`,
      `https://r.jina.ai/http://${noScheme}`
    ];

    let lastError = new Error('読み込みに失敗しました。');
    for (const candidate of candidates) {
      try {
        const response = await withTimeout(fetch(candidate, { cache: 'no-store' }), 12000);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        if (!text || !text.trim()) throw new Error('空のレスポンスです');
        return text;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  }

  window.HtmlImporter = {
    htmlToWorkspaceXml,
    fetchHtmlFromUrl
  };
})();
