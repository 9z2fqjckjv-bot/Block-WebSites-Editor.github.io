/**
 * Blockly toolbox configuration for Block Website Editor
 * Defines categories and available blocks shown to the user.
 */

const TOOLBOX = {
  kind: 'categoryToolbox',
  contents: [
    // ── Page Structure ──────────────────────────────────────
    {
      kind: 'category',
      name: '🏗 ページ構造',
      colour: '#4A90D9',
      contents: [
        { kind: 'block', type: 'page_root' },
        { kind: 'block', type: 'page_header' },
        { kind: 'block', type: 'page_nav' },
        { kind: 'block', type: 'page_main' },
        { kind: 'block', type: 'page_footer' },
        { kind: 'block', type: 'page_section' },
        { kind: 'block', type: 'page_div' }
      ]
    },

    // ── Text ────────────────────────────────────────────────
    {
      kind: 'category',
      name: '📝 テキスト',
      colour: '#5C9E31',
      contents: [
        { kind: 'block', type: 'text_heading' },
        { kind: 'block', type: 'text_paragraph' },
        { kind: 'block', type: 'text_raw' }
      ]
    },

    // ── Media ───────────────────────────────────────────────
    {
      kind: 'category',
      name: '🖼 メディア',
      colour: '#9B59B6',
      contents: [
        { kind: 'block', type: 'media_image' },
        { kind: 'block', type: 'media_audio' },
        { kind: 'block', type: 'media_video' },
        { kind: 'block', type: 'media_document' },
        { kind: 'block', type: 'media_spreadsheet' },
        { kind: 'block', type: 'media_presentation' },
        { kind: 'block', type: 'media_pdf' },
        { kind: 'block', type: 'media_text_file' },
        { kind: 'block', type: 'media_google_apps_script' },
        { kind: 'block', type: 'media_separator' },
        { kind: 'block', type: 'media_embed_html' }
      ]
    },

    // ── Links ───────────────────────────────────────────────
    {
      kind: 'category',
      name: '🔗 リンク',
      colour: '#E67E22',
      contents: [
        { kind: 'block', type: 'link_anchor' },
        { kind: 'block', type: 'link_button' }
      ]
    },

    // ── Lists ───────────────────────────────────────────────
    {
      kind: 'category',
      name: '📋 リスト',
      colour: '#1ABC9C',
      contents: [
        { kind: 'block', type: 'list_ul' },
        { kind: 'block', type: 'list_ol' },
        { kind: 'block', type: 'list_item' }
      ]
    },

    // ── Pre-built Components ─────────────────────────────────
    {
      kind: 'category',
      name: '⭐ コンポーネント',
      colour: '#F1C40F',
      contents: [
        { kind: 'block', type: 'comp_hero' },
        { kind: 'block', type: 'comp_card' },
        { kind: 'block', type: 'comp_grid' }
      ]
    }
  ]
};
