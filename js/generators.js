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
  const src    = esc(block.getFieldValue('SRC'));
  const alt    = esc(block.getFieldValue('ALT'));
  const width  = esc(block.getFieldValue('WIDTH'));
  const height = esc(block.getFieldValue('HEIGHT'));
  const style  = getPresentationStyle(block);
  return `<img src="${src}" alt="${alt}" style="width:${width}; height:${height}; ${style}">\n`;
};

htmlGen.forBlock['media_separator'] = function () {
  return '<hr>\n';
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
