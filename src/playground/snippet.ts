import type { PixelOrder } from '../pixels';

export type SnippetOpts = {
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
    attr('color', p.color, '#99a1af'),
    attr('appear-color', p.appearColor, '#ffffff'),
    attr('hover-color', p.hoverColor, '#111827'),
    attr('size', p.size, 4),
    attr('speed', p.speed, 120),
    attr('fade', p.fade, 280),
    attr('easing', p.easing, 'ease-in-out'),
    attr('trail', p.trail, 1),
    attr('order', p.order, 'design'),
    attr('hover-stagger', p.hoverStagger, 0),
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
