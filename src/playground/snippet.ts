import type { PixelOrder } from '../pixels';
import { DEFAULTS } from '../styles';

export type SnippetOpts = {
  text: string;
  color: string;
  appearColor: string;
  hoverColor: string;
  size: number;
  speed: number;
  fade: number;
  easing: string;
  trail: number;
  order: PixelOrder;
  hoverStagger: number;
  glow: boolean;
  gap: number;
};

function attr(name: string, value: string | number | boolean, fallback: string | number | boolean): string {
  if (value === fallback || value === false) return '';
  if (value === true) return `\n  ${name}`;
  return `\n  ${name}="${value}"`;
}

export function buildSnippet(p: SnippetOpts): string {
  const lines = [
    attr('text', p.text, DEFAULTS.text),
    attr('color', p.color, DEFAULTS.color),
    attr('appear-color', p.appearColor, DEFAULTS.appearColor),
    attr('hover-color', p.hoverColor, DEFAULTS.hoverColor),
    attr('size', p.size, DEFAULTS.size),
    attr('speed', p.speed, DEFAULTS.speed),
    attr('fade', p.fade, DEFAULTS.fade),
    attr('easing', p.easing, DEFAULTS.easing),
    attr('trail', p.trail, DEFAULTS.trail),
    attr('order', p.order, DEFAULTS.order),
    attr('hover-stagger', p.hoverStagger, DEFAULTS.hoverStagger),
    attr('glow', p.glow, false),
    attr('gap', p.gap, 0),
  ].join('');

  return `<pixel-status${lines || ''}${lines ? '\n' : ''}></pixel-status>`;
}

export function highlightSnippet(code: string): string {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/('[^']*'|"[^"]*")/g, '<span class="s">$1</span>')
    .replace(/\b(const|new|import|from)\b/g, '<span class="k">$1</span>');
}
