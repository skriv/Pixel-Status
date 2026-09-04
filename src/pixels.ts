export type Pixel = { x: number; y: number; char: number };

export type PixelOrder = 'design' | 'ltr' | 'random' | 'chars';

const ORDERS = new Set<PixelOrder>(['design', 'ltr', 'random', 'chars']);

export function isPixelOrder(value: string): value is PixelOrder {
  return ORDERS.has(value as PixelOrder);
}

export function orderIndices(
  order: PixelOrder,
  pixels: readonly Pixel[],
): number[] {
  const n = pixels.length;
  const idx = Array.from({ length: n }, (_, i) => i);

  if (order === 'design') return idx;

  if (order === 'ltr') {
    return idx.sort((a, b) => pixels[a].y - pixels[b].y || pixels[a].x - pixels[b].x);
  }

  if (order === 'chars') {
    return idx.sort(
      (a, b) =>
        pixels[a].char - pixels[b].char ||
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
