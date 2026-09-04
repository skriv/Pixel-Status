/**
 * pixel-status — public entry point.
 * Auto-registers `<pixel-status>` on import.
 */
export { PixelStatus, definePixelStatus } from './pixel-status';
export {
  PIXELS,
  CELL,
  BASE_WIDTH,
  BASE_HEIGHT,
  DEFAULT_COLOR,
  orderIndices,
  isPixelOrder,
  type Pixel,
  type PixelOrder,
} from './pixels';
export { DEFAULTS, EASINGS, isEasing, type EasingName } from './styles';

import { definePixelStatus } from './pixel-status';

if (typeof customElements !== 'undefined') {
  definePixelStatus();
}
