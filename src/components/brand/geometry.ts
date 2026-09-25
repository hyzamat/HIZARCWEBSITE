/**
 * HIZARC logo geometry, traced from the original artwork.
 * Plain data (no React) so scripts/generate-icons.mjs can build the favicons from the same shapes.
 */

/** The four panels of the "H". */
export const MARK_VIEWBOX = '0 0 792 870'
export const MARK_PANELS = {
  pillar: '0,4 218,137 218,413 133,457 218,506 218,858 0,717',
  bar: '257,236 578,411 578,620 257,442',
  fold: '578,411 684,469 684,803 578,739',
  right: '586,0 792,125 792,870 684,803 684,423 586,370',
} as const

/** Reversed colours for dark backgrounds; `light` is the original artwork. */
export const MARK_COLORS = {
  dark: { pillar: '#ffffff', bar: '#0077fc', fold: '#0a3e9e', right: '#0077fc' },
  light: { pillar: '#03204f', bar: '#0077fc', fold: '#03204f', right: '#0077fc' },
} as const

/** "HIZARC" lettering path lives in wordmark.txt */
export const WORDMARK_VIEWBOX = '0 0 1299 223'
