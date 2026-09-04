import fontUrl from './assets/DepartureMono-Regular.woff2?url';
import type { Pixel } from './pixels';

export const FONT_FAMILY = 'Departure Mono';
export const FONT_PX = 11;
export const CELL = 1;
export const MAX_CHARS = 24;
export const DEFAULT_TEXT = '404';

export type Glyph = {
  pixels: Pixel[];
  width: number;
  height: number;
  charWidth: number;
  text: string;
};

export const EMPTY_GLYPH: Glyph = {
  pixels: [],
  width: 0,
  height: 0,
  charWidth: 0,
  text: '',
};

let fontPromise: Promise<void> | null = null;

export function fontFaceCss(): string {
  return `@font-face{font-family:'${FONT_FAMILY}';src:url(${JSON.stringify(fontUrl)}) format('woff2');font-weight:400;font-style:normal;font-display:block;}`;
}

export function loadDepartureMono(): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  if (fontPromise) return fontPromise;
  fontPromise = (async () => {
    const face = new FontFace(FONT_FAMILY, `url(${fontUrl})`, {
      weight: '400',
      style: 'normal',
    });
    const loaded = await face.load();
    document.fonts.add(loaded);
    await document.fonts.load(`${FONT_PX}px "${FONT_FAMILY}"`);
  })().catch((err) => {
    fontPromise = null;
    throw err;
  });
  return fontPromise;
}

function makeContext(w: number, h: number): CanvasRenderingContext2D | null {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.imageSmoothingEnabled = false;
  ctx.font = `${FONT_PX}px "${FONT_FAMILY}"`;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#000';
  return ctx;
}

export function clipText(raw: string): string {
  return [...raw].slice(0, MAX_CHARS).join('');
}

export function rasterize(raw: string): Glyph {
  const text = clipText(raw);
  if (!text) return EMPTY_GLYPH;

  const probe = makeContext(1, 1);
  if (!probe) return EMPTY_GLYPH;

  const advance = Math.max(1, Math.round(probe.measureText('M').width));
  const measured = probe.measureText(text);
  const pad = 2;
  const drawW = Math.max(1, Math.ceil(measured.width) + pad * 2);
  const drawH = FONT_PX + pad * 2;

  const ctx = makeContext(drawW, drawH);
  if (!ctx) return EMPTY_GLYPH;

  ctx.clearRect(0, 0, drawW, drawH);
  ctx.fillText(text, pad, pad);
  const { data, width, height } = ctx.getImageData(0, 0, drawW, drawH);

  const pixels: Pixel[] = [];
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * 4 + 3];
      if (a <= 128) continue;
      pixels.push({
        x,
        y,
        char: Math.max(0, Math.floor((x - pad) / advance)),
      });
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (!pixels.length || maxX < 0) return { ...EMPTY_GLYPH, text };

  const originX = minX;
  const originY = minY;
  const cropped = pixels.map((p) => ({
    x: p.x - originX,
    y: p.y - originY,
    char: p.char,
  }));

  return {
    pixels: cropped,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    charWidth: advance,
    text,
  };
}
