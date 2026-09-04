/*! Design: Alex Krivov – alexkrivov.com */
/**
 * pixel-status — public entry point.
 * Auto-registers `<pixel-status>` on import.
 */
export { PixelStatus, definePixelStatus } from './pixel-status';
export {
  orderIndices,
  isPixelOrder,
  type Pixel,
  type PixelOrder,
} from './pixels';
export {
  CELL,
  FONT_FAMILY,
  FONT_PX,
  DEFAULT_TEXT,
  rasterize,
  loadDepartureMono,
  type Glyph,
} from './rasterize';
export { DEFAULTS, EASINGS, isEasing, type EasingName } from './styles';

import { definePixelStatus } from './pixel-status';

if (typeof customElements !== 'undefined') {
  definePixelStatus();
}
