/** Figma node 109:85 — 3px cells forming a pixel “404”. */

export const CELL = 3;
export const BASE_WIDTH = 53;
export const BASE_HEIGHT = 24;
export const DEFAULT_COLOR = '#99a1af';

export type Pixel = { x: number; y: number };

/** Design-file order (55 squares). */
export const PIXELS: readonly Pixel[] = [
  { x: 3, y: 6 },
  { x: 41, y: 6 },
  { x: 0, y: 9 },
  { x: 38, y: 9 },
  { x: 0, y: 12 },
  { x: 38, y: 12 },
  { x: 0, y: 15 },
  { x: 38, y: 15 },
  { x: 3, y: 15 },
  { x: 41, y: 15 },
  { x: 6, y: 15 },
  { x: 44, y: 15 },
  { x: 9, y: 15 },
  { x: 47, y: 15 },
  { x: 12, y: 15 },
  { x: 19, y: 15 },
  { x: 31, y: 15 },
  { x: 50, y: 15 },
  { x: 6, y: 3 },
  { x: 44, y: 3 },
  { x: 9, y: 0 },
  { x: 47, y: 0 },
  { x: 12, y: 0 },
  { x: 22, y: 0 },
  { x: 25, y: 0 },
  { x: 28, y: 0 },
  { x: 28, y: 6 },
  { x: 25, y: 9 },
  { x: 22, y: 12 },
  { x: 50, y: 0 },
  { x: 12, y: 3 },
  { x: 19, y: 3 },
  { x: 31, y: 3 },
  { x: 50, y: 3 },
  { x: 12, y: 6 },
  { x: 19, y: 6 },
  { x: 31, y: 6 },
  { x: 50, y: 6 },
  { x: 12, y: 9 },
  { x: 19, y: 9 },
  { x: 31, y: 9 },
  { x: 50, y: 9 },
  { x: 12, y: 12 },
  { x: 19, y: 12 },
  { x: 31, y: 12 },
  { x: 50, y: 12 },
  { x: 12, y: 18 },
  { x: 19, y: 18 },
  { x: 31, y: 18 },
  { x: 50, y: 18 },
  { x: 12, y: 21 },
  { x: 22, y: 21 },
  { x: 25, y: 21 },
  { x: 28, y: 21 },
  { x: 50, y: 21 },
];

export type PixelOrder = 'design' | 'ltr' | 'random' | 'digits';

const ORDERS = new Set<PixelOrder>(['design', 'ltr', 'random', 'digits']);

export function isPixelOrder(value: string): value is PixelOrder {
  return ORDERS.has(value as PixelOrder);
}

function digitOf(p: Pixel): number {
  if (p.x <= 12) return 0;
  if (p.x <= 31) return 1;
  return 2;
}

export function orderIndices(order: PixelOrder, pixels: readonly Pixel[] = PIXELS): number[] {
  const n = pixels.length;
  const idx = Array.from({ length: n }, (_, i) => i);

  if (order === 'design') return idx;

  if (order === 'ltr') {
    return idx.sort((a, b) => pixels[a].y - pixels[b].y || pixels[a].x - pixels[b].x);
  }

  if (order === 'digits') {
    return idx.sort(
      (a, b) =>
        digitOf(pixels[a]) - digitOf(pixels[b]) ||
        pixels[a].y - pixels[b].y ||
        pixels[a].x - pixels[b].x,
    );
  }

  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = idx[i];
    idx[i] = idx[j];
    idx[j] = tmp;
  }
  return idx;
}
