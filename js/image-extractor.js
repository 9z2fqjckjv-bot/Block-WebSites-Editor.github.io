/**
 * Utility helpers to extract currently visible images from generated HTML.
 */

'use strict';

(function initImageExtractor(global) {
  function parseInlineStyle(styleText) {
    const styleMap = new Map();
    if (!styleText) return styleMap;

    styleText.split(';').forEach(part => {
      const [rawKey, rawValue] = part.split(':');
      if (!rawKey || !rawValue) return;
      const key = rawKey.trim().toLowerCase();
      const value = rawValue.trim().toLowerCase();
      if (!key) return;
      styleMap.set(key, value);
    });
    return styleMap;
  }

  function hasHiddenStyle(styleMap) {
    const display = styleMap.get('display');
    if (display === 'none') return true;

    const visibility = styleMap.get('visibility');
    return visibility === 'hidden' || visibility === 'collapse';
  }

  function isNodeVisible(node) {
    let current = node;
    while (current && current.nodeType === Node.ELEMENT_NODE) {
      if (current.hasAttribute('hidden')) return false;
      const styleMap = parseInlineStyle(current.getAttribute('style'));
      if (hasHiddenStyle(styleMap)) return false;
      current = current.parentElement;
    }
    return true;
  }

  function normalizeSrc(src, baseUrl) {
    const raw = String(src || '').trim();
    if (!raw) return '';
    try {
      return new URL(raw, baseUrl).href;
    } catch (_) {
      return raw;
    }
  }

  function extractVisibleImagesFromDocument(doc, options = {}) {
    if (!doc) return [];
    const baseUrl = options.baseUrl || doc.baseURI || 'https://example.invalid/';
    const images = Array.from(doc.querySelectorAll('img'));

    return images
      .filter(isNodeVisible)
      .map(img => ({
        src: normalizeSrc(img.getAttribute('src'), baseUrl),
        alt: String(img.getAttribute('alt') || ''),
        width: String(img.getAttribute('width') || ''),
        height: String(img.getAttribute('height') || '')
      }))
      .filter(image => image.src);
  }

  function extractVisibleImagesFromHTML(html, options = {}) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(String(html || ''), 'text/html');
    return extractVisibleImagesFromDocument(doc, options);
  }

  global.ImageExtractor = {
    extractVisibleImagesFromDocument,
    extractVisibleImagesFromHTML
  };
})(window);
