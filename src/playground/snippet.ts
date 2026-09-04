import type { PixelOrder } from '../pixels';
import type { PixelStatus } from '../pixel-status';
import { creditMarkup } from '../credits';

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
  gap: number;
};

function attr(name: string, value: string | number | boolean): string {
  if (value === false) return '';
  if (value === true) return `\n  ${name}`;
  return `\n  ${name}="${value}"`;
}

export function buildSnippet(p: SnippetOpts): string {
  const lines = [
    attr('text', p.text),
    attr('color', p.color),
    attr('appear-color', p.appearColor),
    attr('hover-color', p.hoverColor),
    attr('size', p.size),
    attr('speed', p.speed),
    attr('fade', p.fade),
    attr('easing', p.easing),
    attr('trail', p.trail),
    attr('order', p.order),
    attr('hover-stagger', p.hoverStagger),
    attr('gap', p.gap),
  ].join('');

  return `${creditMarkup()}\n<pixel-status${lines}\n></pixel-status>`;
}

export function applySnippet(el: PixelStatus, p: SnippetOpts): void {
  el.text = p.text;
  el.color = p.color;
  el.appearColor = p.appearColor;
  el.hoverColor = p.hoverColor;
  el.size = p.size;
  el.speed = p.speed;
  el.fade = p.fade;
  el.easing = p.easing;
  el.trail = p.trail;
  el.order = p.order;
  el.hoverStagger = p.hoverStagger;
  el.gap = p.gap;
}

export function highlightSnippet(code: string): string {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="c">$1</span>')
    .replace(/('[^']*'|"[^"]*")/g, '<span class="s">$1</span>')
    .replace(/\b(const|new|import|from)\b/g, '<span class="k">$1</span>');
}
