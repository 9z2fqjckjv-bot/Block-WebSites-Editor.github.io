/**
 * HTML code generator for Block Website Editor.
 * Converts a Blockly workspace into a valid HTML document string.
 */

// ── Generator instance ────────────────────────────────────────
const htmlGen = new Blockly.Generator('HTML');
htmlGen.INDENT = '  ';

/**
 * scrub_ is called after each block's generator function.
 * Override the default no-op to chain sibling (next) blocks.
 */
htmlGen.scrub_ = function (block, code, thisOnly) {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  if (nextBlock && !thisOnly) {
    return code + this.blockToCode(nextBlock);
  }
  return code;
};

// ── Utility ───────────────────────────────────────────────────

/** Escape user-provided text so it is safe to embed in HTML. */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Given a hex colour string (#rrggbb), return whether it is
 * "dark" (true) or "light" (false) using perceived-brightness.
 */
function isDark(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function getAlignStyle(align, isButton) {
  if (isButton) {
    if (align === 'center') return 'display:block; width:fit-content; margin-left:auto; margin-right:auto;';
    if (align === 'right') return 'display:block; width:fit-content; margin-left:auto; margin-right:0;';
    return 'display:inline-block;';
  }

  if (align === 'center') return 'display:block; margin-left:auto; margin-right:auto;';
  if (align === 'right') return 'display:block; margin-left:auto; margin-right:0;';
  return 'display:block;';
}

function getPresentationStyle(block, isButton = false) {
  const align = block.getFieldValue('ALIGN') || 'left';
  const position = block.getFieldValue('POSITION') || 'static';
  const offsetX = esc(block.getFieldValue('OFFSET_X') || '0px');
  const offsetY = esc(block.getFieldValue('OFFSET_Y') || '0px');
  const zIndex = Number(block.getFieldValue('Z_INDEX') || 1);
  const offsetStyle = position === 'static' ? '' : ` left:${offsetX}; top:${offsetY};`;
  return `${getAlignStyle(align, isButton)} position:${position};${offsetStyle} z-index:${zIndex};`;
}

function isChecked(block, fieldName) {
  return block.getFieldValue(fieldName) === 'TRUE';
}

function toEmbedDimension(value, fallback) {
  const raw = String(value || '').trim();
  return esc(raw || fallback);
}

function toSafeId(value) {
  return String(value || '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 64);
}

function normalizeGoogleEmbedUrl(rawUrl, kind) {
  let parsed;
  try {
    parsed = new URL(String(rawUrl || '').trim());
  } catch {
    return String(rawUrl || '').trim();
  }

  if (parsed.hostname !== 'docs.google.com') return parsed.toString();
  const match = parsed.pathname.match(/^\/(document|spreadsheets|presentation)\/d\/([^/]+)/);
  if (!match) return parsed.toString();
  const fileId = match[2];

  if (kind === 'google-docs') return `https://docs.google.com/document/d/${fileId}/preview`;
  if (kind === 'google-sheets') return `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
  if (kind === 'google-slides') {
    return `https://docs.google.com/presentation/d/${fileId}/embed?start=false&loop=false&delayms=3000`;
  }

  return parsed.toString();
}

function resolveEmbedSrc(rawUrl, kind) {
  const url = String(rawUrl || '').trim();
  if (!url) return '';
  if (kind === 'word' || kind === 'excel' || kind === 'powerpoint') {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  }
  if (kind === 'google-docs' || kind === 'google-sheets' || kind === 'google-slides') {
    return normalizeGoogleEmbedUrl(url, kind);
  }
  return url;
}

function mediaFrame(title, sourceUrl, width, height, fallbackLinkUrl = sourceUrl) {
  const src = esc(sourceUrl);
  const fallbackUrl = esc(fallbackLinkUrl || sourceUrl);
  return `<figure style="margin:1rem 0;">
  <iframe title="${esc(title)}" src="${src}" style="width:${width}; height:${height}; border:1px solid #d1d5db; border-radius:8px; background:#fff;" loading="lazy"></iframe>
  <figcaption style="font-size:.9rem; margin-top:.4rem; color:#4b5563;">表示できない場合は <a href="${fallbackUrl}" target="_blank" rel="noopener noreferrer">${esc(title)}を開く</a></figcaption>
</figure>\n`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PAGE STRUCTURE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

htmlGen.forBlock['page_root'] = function (block, generator) {
  const title     = esc(block.getFieldValue('TITLE'));
  const fontSize  = block.getFieldValue('FONT_SIZE');
  const bgColor   = block.getFieldValue('BG_COLOR');
  const textColor = block.getFieldValue('TEXT_COLOR');
  const content   = generator.statementToCode(block, 'CONTENT');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', sans-serif;
      font-size: ${fontSize}px;
      background-color: ${bgColor};
      color: ${textColor};
      line-height: 1.6;
    }
    img { max-width: 100%; height: auto; display: block; }
    a   { color: inherit; }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
    .card {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 12px rgba(0,0,0,.10);
      padding: 1.5rem;
    }
    @media (max-width: 900px) {
      .grid-3, .grid-4 { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
${content}</body>
</html>`;
};

htmlGen.forBlock['page_header'] = function (block, generator) {
  const bg      = block.getFieldValue('BG_COLOR');
  const content = generator.statementToCode(block, 'CONTENT');
  const fg      = isDark(bg) ? '#ffffff' : '#1a1a1a';
  return `<header style="background-color:${bg}; color:${fg}; padding:1rem 2rem; display:flex; align-items:center; gap:1rem;">\n${content}</header>\n`;
};

htmlGen.forBlock['page_nav'] = function (block, generator) {
  const content = generator.statementToCode(block, 'CONTENT');
  return `<nav style="display:flex; gap:1.5rem; align-items:center; flex-wrap:wrap;">\n${content}</nav>\n`;
};

htmlGen.forBlock['page_main'] = function (block, generator) {
  const content = generator.statementToCode(block, 'CONTENT');
  return `<main style="max-width:1200px; margin:0 auto; padding:2rem;">\n${content}</main>\n`;
};

htmlGen.forBlock['page_footer'] = function (block, generator) {
  const bg      = block.getFieldValue('BG_COLOR');
  const content = generator.statementToCode(block, 'CONTENT');
  const fg      = isDark(bg) ? '#ffffff' : '#1a1a1a';
  return `<footer style="background-color:${bg}; color:${fg}; padding:1.5rem 2rem; text-align:center;">\n${content}</footer>\n`;
};

htmlGen.forBlock['page_section'] = function (block, generator) {
  const cls     = esc(block.getFieldValue('CLASS'));
  const bg      = block.getFieldValue('BG_COLOR');
  const padding = block.getFieldValue('PADDING');
  const content = generator.statementToCode(block, 'CONTENT');
  const ca      = cls ? ` class="${cls}"` : '';
  return `<section${ca} style="background-color:${bg}; padding:${padding}px;">\n${content}</section>\n`;
};

htmlGen.forBlock['page_div'] = function (block, generator) {
  const cls     = esc(block.getFieldValue('CLASS'));
  const content = generator.statementToCode(block, 'CONTENT');
  const ca      = cls ? ` class="${cls}"` : '';
  return `<div${ca}>\n${content}</div>\n`;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  TEXT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

htmlGen.forBlock['text_heading'] = function (block) {
  const level = block.getFieldValue('LEVEL');
  const text  = esc(block.getFieldValue('TEXT'));
  const color = block.getFieldValue('COLOR');
  const align = block.getFieldValue('ALIGN');
  return `<h${level} style="color:${color}; text-align:${align};">${text}</h${level}>\n`;
};

htmlGen.forBlock['text_paragraph'] = function (block) {
  const text  = esc(block.getFieldValue('TEXT'));
  const size  = block.getFieldValue('FONT_SIZE');
  const color = block.getFieldValue('COLOR');
  const align = block.getFieldValue('ALIGN');
  return `<p style="font-size:${size}px; color:${color}; text-align:${align};">${text}</p>\n`;
};

htmlGen.forBlock['text_raw'] = function (block) {
  // text_raw intentionally outputs unsanitised text so users can embed
  // arbitrary HTML or inline elements. The generated file is downloaded
  // locally and never served from this origin, so XSS risk is confined
  // to the user's own exported file.
  return block.getFieldValue('TEXT') + '\n';
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MEDIA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

htmlGen.forBlock['media_image'] = function (block) {
  const src        = esc(block.getFieldValue('SRC'));
  const alt        = esc(block.getFieldValue('ALT'));
  const width      = esc(block.getFieldValue('WIDTH'));
  const height     = esc(block.getFieldValue('HEIGHT'));
  const style      = getPresentationStyle(block);
  const visibility = block.getFieldValue('VISIBILITY') || 'visible';
  const hrefRaw    = String(block.getFieldValue('HREF') || '').trim();
  const href       = esc(hrefRaw);
  const newTab     = block.getFieldValue('NEW_TAB') === 'TRUE';
  const target     = newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
  const display    = visibility === 'hidden' ? ' display:none;' : '';
  const imageTag   = `<img src="${src}" alt="${alt}" style="width:${width}; height:${height}; ${style}${display}">`;

  if (!hrefRaw) return `${imageTag}\n`;
  return `<a href="${href}"${target}>${imageTag}</a>\n`;
};

htmlGen.forBlock['media_audio'] = function (block) {
  const src = esc(block.getFieldValue('SRC'));
  const controls = isChecked(block, 'CONTROLS');
  const autoplay = isChecked(block, 'AUTOPLAY');
  const loop = isChecked(block, 'LOOP');
  const controlsAttr = controls ? ' controls' : '';
  const autoplayAttr = autoplay ? ' autoplay' : '';
  const loopAttr = loop ? ' loop' : '';
  return `<audio src="${src}"${controlsAttr}${autoplayAttr}${loopAttr} style="width:100%; max-width:720px;">お使いのブラウザは audio 要素に対応していません。</audio>\n`;
};

htmlGen.forBlock['media_video'] = function (block) {
  const src = esc(block.getFieldValue('SRC'));
  const width = toEmbedDimension(block.getFieldValue('WIDTH'), '100%');
  const height = toEmbedDimension(block.getFieldValue('HEIGHT'), '360px');
  const controls = isChecked(block, 'CONTROLS');
  const autoplay = isChecked(block, 'AUTOPLAY');
  const loop = isChecked(block, 'LOOP');
  const controlsAttr = controls ? ' controls' : '';
  const autoplayAttr = autoplay ? ' autoplay muted playsinline' : '';
  const loopAttr = loop ? ' loop' : '';
  return `<video src="${src}" style="width:${width}; height:${height}; max-width:100%; border-radius:8px;"${controlsAttr}${autoplayAttr}${loopAttr}>お使いのブラウザは video 要素に対応していません。</video>\n`;
};

htmlGen.forBlock['media_document'] = function (block) {
  const type = block.getFieldValue('DOC_TYPE') || 'word';
  const url = String(block.getFieldValue('URL') || '').trim();
  const width = toEmbedDimension(block.getFieldValue('WIDTH'), '100%');
  const height = toEmbedDimension(block.getFieldValue('HEIGHT'), '500px');
  const src = resolveEmbedSrc(url, type);
  const title = type === 'google-docs' ? 'Googleドキュメント' : type === 'pages' ? 'Pages' : 'Word';
  if (!src) return '';
  return mediaFrame(title, src, width, height, url);
};

htmlGen.forBlock['media_spreadsheet'] = function (block) {
  const type = block.getFieldValue('SHEET_TYPE') || 'excel';
  const url = String(block.getFieldValue('URL') || '').trim();
  const width = toEmbedDimension(block.getFieldValue('WIDTH'), '100%');
  const height = toEmbedDimension(block.getFieldValue('HEIGHT'), '500px');
  const src = resolveEmbedSrc(url, type);
  const title = type === 'google-sheets' ? 'Googleスプレッドシート' : type === 'numbers' ? 'Numbers' : 'Excel';
  if (!src) return '';
  return mediaFrame(title, src, width, height, url);
};

htmlGen.forBlock['media_presentation'] = function (block) {
  const type = block.getFieldValue('PRESENTATION_TYPE') || 'powerpoint';
  const url = String(block.getFieldValue('URL') || '').trim();
  const width = toEmbedDimension(block.getFieldValue('WIDTH'), '100%');
  const height = toEmbedDimension(block.getFieldValue('HEIGHT'), '500px');
  const src = resolveEmbedSrc(url, type);
  const title = type === 'google-slides' ? 'Googleスライド' : type === 'keynote' ? 'Keynote' : 'PowerPoint';
  if (!src) return '';
  return mediaFrame(title, src, width, height, url);
};

htmlGen.forBlock['media_pdf'] = function (block) {
  const url = String(block.getFieldValue('URL') || '').trim();
  const width = toEmbedDimension(block.getFieldValue('WIDTH'), '100%');
  const height = toEmbedDimension(block.getFieldValue('HEIGHT'), '600px');
  if (!url) return '';
  return mediaFrame('PDF', url, width, height, url);
};

htmlGen.forBlock['media_text_file'] = function (block) {
  const url = String(block.getFieldValue('URL') || '').trim();
  const textType = block.getFieldValue('TEXT_TYPE') || 'txt';
  if (!url) return '';
  const viewerId = `text-media-${toSafeId(block.id)}`;
  const sourceUrl = JSON.stringify(url);
  const label = textType === 'md' ? 'Markdown (.md)' : 'Text (.txt)';
  return `<section style="margin:1rem 0;">
  <h4 style="margin:0 0 .5rem 0;">${esc(label)}</h4>
  <pre id="${viewerId}" style="white-space:pre-wrap; word-break:break-word; background:#111827; color:#f9fafb; padding:1rem; border-radius:8px; overflow:auto; max-height:420px;">読み込み中...</pre>
  <script>
    (function () {
      const target = document.getElementById('${viewerId}');
      const sourceUrl = ${sourceUrl};
      fetch(sourceUrl)
        .then(response => {
          if (!response.ok) throw new Error('Failed to load text file');
          return response.text();
        })
        .then(text => { target.textContent = text; })
        .catch(() => {
          target.textContent = '読み込みに失敗しました。';
          const link = document.createElement('a');
          link.href = sourceUrl;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = 'ファイルを別タブで開く';
          link.style.display = 'block';
          link.style.marginTop = '.5rem';
          target.insertAdjacentElement('afterend', link);
        });
    })();
  </script>
</section>\n`;
};

htmlGen.forBlock['media_google_apps_script'] = function (block) {
  const url = String(block.getFieldValue('URL') || '').trim();
  const width = toEmbedDimension(block.getFieldValue('WIDTH'), '100%');
  const height = toEmbedDimension(block.getFieldValue('HEIGHT'), '500px');
  if (!url) return '';
  return `<figure style="margin:1rem 0;">
  <iframe title="Google Apps Script" src="${esc(url)}" style="width:${width}; height:${height}; border:1px solid #d1d5db; border-radius:8px; background:#fff;" loading="lazy"></iframe>
  <figcaption style="font-size:.9rem; margin-top:.4rem; color:#4b5563;">動作しない場合はスクリプトの公開設定（ウェブアプリ）を確認してください。</figcaption>
</figure>\n`;
};

htmlGen.forBlock['media_separator'] = function () {
  return '<hr>\n';
};

htmlGen.forBlock['media_embed_html'] = function (block) {
  // Intentionally unsanitized to allow full custom embeds.
  return `${block.getFieldValue('HTML')}\n`;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LINKS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

htmlGen.forBlock['link_anchor'] = function (block) {
  const text   = esc(block.getFieldValue('TEXT'));
  const href   = esc(block.getFieldValue('HREF'));
  const newTab = block.getFieldValue('NEW_TAB') === 'TRUE';
  const target = newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a href="${href}"${target}>${text}</a>\n`;
};

htmlGen.forBlock['link_button'] = function (block) {
  const text    = esc(block.getFieldValue('TEXT'));
  const href    = esc(block.getFieldValue('HREF'));
  const bg      = block.getFieldValue('BG_COLOR');
  const fg      = block.getFieldValue('TEXT_COLOR');
  const style   = getPresentationStyle(block, true);
  return `<a href="${href}" style="${style} padding:.6em 1.4em; background-color:${bg}; color:${fg}; text-decoration:none; border-radius:6px; font-weight:700;">${text}</a>\n`;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LISTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

htmlGen.forBlock['list_ul'] = function (block, generator) {
  const items = generator.statementToCode(block, 'ITEMS');
  return `<ul>\n${items}</ul>\n`;
};

htmlGen.forBlock['list_ol'] = function (block, generator) {
  const items = generator.statementToCode(block, 'ITEMS');
  return `<ol>\n${items}</ol>\n`;
};

htmlGen.forBlock['list_item'] = function (block) {
  const text = esc(block.getFieldValue('TEXT'));
  return `<li>${text}</li>\n`;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

htmlGen.forBlock['comp_hero'] = function (block) {
  const title   = esc(block.getFieldValue('TITLE'));
  const sub     = esc(block.getFieldValue('SUBTITLE'));
  const btnText = esc(block.getFieldValue('BTN_TEXT'));
  const btnUrl  = esc(block.getFieldValue('BTN_URL'));
  const bg      = block.getFieldValue('BG_COLOR');
  const dark    = isDark(bg);
  const fg      = dark ? '#ffffff' : '#1a1a1a';
  const btnBg   = dark ? 'rgba(255,255,255,.9)' : 'rgba(0,0,0,.85)';
  const btnFg   = dark ? '#1a1a1a' : '#ffffff';

  return `<section style="background-color:${bg}; color:${fg}; padding:5rem 2rem; text-align:center;">
  <h1 style="font-size:clamp(2rem,5vw,3.5rem); margin-bottom:1rem;">${title}</h1>
  <p style="font-size:1.2rem; margin-bottom:2rem; opacity:.85;">${sub}</p>
  <a href="${btnUrl}" style="display:inline-block; padding:.8em 2.2em; background:${btnBg}; color:${btnFg}; text-decoration:none; border-radius:50px; font-weight:700; font-size:1rem;">${btnText}</a>
</section>\n`;
};

htmlGen.forBlock['comp_card'] = function (block, generator) {
  const title   = esc(block.getFieldValue('TITLE'));
  const content = generator.statementToCode(block, 'CONTENT');
  return `<div class="card">
  <h3 style="margin-top:0; margin-bottom:.75rem;">${title}</h3>
${content}</div>\n`;
};

htmlGen.forBlock['comp_grid'] = function (block, generator) {
  const cols    = block.getFieldValue('COLS');
  const content = generator.statementToCode(block, 'CONTENT');
  return `<div class="grid-${cols}">\n${content}</div>\n`;
};
