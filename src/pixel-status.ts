import { isPixelOrder, orderIndices, type Pixel, type PixelOrder } from './pixels';
import {
  CELL,
  clipText,
  EMPTY_GLYPH,
  fontFaceCss,
  loadDepartureMono,
  rasterize,
  type Glyph,
} from './rasterize';
import { DEFAULTS, STYLES, isEasing } from './styles';

const TAG = 'pixel-status';

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function num(raw: string | null, fallback: number): number {
  if (raw == null || raw === '') return fallback;
  const v = Number(raw);
  return Number.isFinite(v) ? v : fallback;
}

/**
 * `<pixel-status>` — rasterizes `text` with Departure Mono into cubes,
 * then overlays appear-color on the active cubes. Hover tints the whole glyph.
 */
export class PixelStatus extends HTMLElement {
  static readonly observedAttributes = [
    'text',
    'color',
    'appear-color',
    'hover-color',
    'size',
    'speed',
    'fade',
    'easing',
    'trail',
    'order',
    'hover-stagger',
    'glow',
    'gap',
    'paused',
  ];

  #root: ShadowRoot;
  #stage: HTMLElement;
  #pixels: HTMLElement[] = [];
  #glyph: Glyph = EMPTY_GLYPH;
  #sequence: number[] = [];
  #index = 0;
  #timer: number | null = null;
  #hovering = false;
  #fontReady = false;
  #boundEnter = () => this.#onHover(true);
  #boundLeave = () => this.#onHover(false);
  #tick = () => {
    if (this.paused || this.#hovering) return;
    const n = this.#sequence.length;
    if (!n) return;
    this.#index = (this.#index + 1) % n;
    this.#applyTrail();
    this.#arm();
  };

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `${fontFaceCss()}\n${STYLES}`;
    this.#stage = document.createElement('div');
    this.#stage.className = 'stage';
    this.#stage.part = 'stage';
    this.#root.append(style, this.#stage);
  }

  connectedCallback() {
    this.#syncVars();
    this.addEventListener('pointerenter', this.#boundEnter);
    this.addEventListener('pointerleave', this.#boundLeave);
    void this.#boot();
  }

  disconnectedCallback() {
    this.#clear();
    this.removeEventListener('pointerenter', this.#boundEnter);
    this.removeEventListener('pointerleave', this.#boundLeave);
  }

  attributeChangedCallback(name: string) {
    if (!this.isConnected) return;
    if (name === 'text') {
      if (this.#fontReady) this.#rebuildGlyph();
      return;
    }
    if (name === 'order') this.#rebuildSequence(true);
    this.#syncVars();
    this.#syncLayout();
    if (name === 'paused') {
      if (this.paused) this.#clear();
      else if (!this.#hovering) this.#arm();
    }
    if (name === 'speed' && !this.paused && !this.#hovering) {
      this.#clear();
      this.#arm();
    }
    if (!this.#hovering) this.#applyTrail();
    else this.#showAll();
  }

  /* ----------------------------- typed props ----------------------------- */

  get text(): string {
    return clipText(this.getAttribute('text') ?? DEFAULTS.text);
  }
  set text(v: string) {
    this.setAttribute('text', v);
  }

  get color(): string {
    return this.getAttribute('color') || DEFAULTS.color;
  }
  set color(v: string) {
    this.setAttribute('color', v);
  }

  get appearColor(): string {
    return this.getAttribute('appear-color') || DEFAULTS.appearColor;
  }
  set appearColor(v: string) {
    this.setAttribute('appear-color', v);
  }

  get hoverColor(): string {
    return this.getAttribute('hover-color') || DEFAULTS.hoverColor;
  }
  set hoverColor(v: string) {
    this.setAttribute('hover-color', v);
  }

  get size(): number {
    return clamp(num(this.getAttribute('size'), DEFAULTS.size), 1, 32);
  }
  set size(v: number) {
    this.setAttribute('size', String(v));
  }

  get speed(): number {
    return clamp(num(this.getAttribute('speed'), DEFAULTS.speed), 16, 4000);
  }
  set speed(v: number) {
    this.setAttribute('speed', String(v));
  }

  get fade(): number {
    return clamp(num(this.getAttribute('fade'), DEFAULTS.fade), 0, 4000);
  }
  set fade(v: number) {
    this.setAttribute('fade', String(v));
  }

  get easing(): string {
    const v = this.getAttribute('easing') || DEFAULTS.easing;
    return isEasing(v) ? v : DEFAULTS.easing;
  }
  set easing(v: string) {
    this.setAttribute('easing', v);
  }

  get trail(): number {
    const max = Math.max(1, this.#pixels.length);
    return clamp(Math.round(num(this.getAttribute('trail'), DEFAULTS.trail)), 1, max);
  }
  set trail(v: number) {
    this.setAttribute('trail', String(v));
  }

  get order(): PixelOrder {
    const v = this.getAttribute('order') || DEFAULTS.order;
    return isPixelOrder(v) ? v : DEFAULTS.order;
  }
  set order(v: PixelOrder) {
    this.setAttribute('order', v);
  }

  get hoverStagger(): number {
    return clamp(num(this.getAttribute('hover-stagger'), DEFAULTS.hoverStagger), 0, 200);
  }
  set hoverStagger(v: number) {
    this.setAttribute('hover-stagger', String(v));
  }

  get glow(): boolean {
    return this.hasAttribute('glow');
  }
  set glow(v: boolean) {
    this.toggleAttribute('glow', v);
  }

  get gap(): number {
    return clamp(num(this.getAttribute('gap'), DEFAULTS.gap), 0, 24);
  }
  set gap(v: number) {
    this.setAttribute('gap', String(v));
  }

  get paused(): boolean {
    return this.hasAttribute('paused');
  }
  set paused(v: boolean) {
    this.toggleAttribute('paused', v);
  }

  /* ------------------------------ playback ------------------------------- */

  play(): void {
    this.paused = false;
  }

  pause(): void {
    this.paused = true;
  }

  restart(): void {
    this.#index = 0;
    this.#rebuildSequence(this.order === 'random');
    this.paused = false;
    if (this.#hovering) this.#showAll();
    else this.#applyTrail();
    this.#clear();
    this.#arm();
  }

  /* ------------------------------ internals ------------------------------ */

  async #boot() {
    try {
      await loadDepartureMono();
    } catch {
      return;
    }
    if (!this.isConnected) return;
    this.#fontReady = true;
    this.#rebuildGlyph();
    this.#arm();
  }

  #rebuildGlyph() {
    this.#glyph = rasterize(this.text);
    this.#stage.replaceChildren();
    this.#pixels = [];
    for (const [i, p] of this.#glyph.pixels.entries()) {
      const el = document.createElement('span');
      el.className = 'pixel';
      el.part = 'pixel';
      el.style.setProperty('--i', String(i));
      el.dataset.x = String(p.x);
      el.dataset.y = String(p.y);
      const flash = document.createElement('span');
      flash.className = 'flash';
      flash.part = 'flash';
      el.appendChild(flash);
      this.#pixels.push(el);
      this.#stage.appendChild(el);
    }
    this.#index = 0;
    this.#rebuildSequence(true);
    this.#syncVars();
    this.#syncLayout();
    if (this.#hovering) this.#showAll();
    else this.#applyTrail();
  }

  #syncVars() {
    this.style.setProperty('--ps-color', this.color);
    this.style.setProperty('--ps-appear-color', this.appearColor);
    this.style.setProperty('--ps-hover-color', this.hoverColor);
    this.style.setProperty('--ps-fade', `${this.fade}ms`);
    this.style.setProperty('--ps-easing', this.easing);
    this.style.setProperty('--ps-hover-stagger', `${this.hoverStagger}ms`);
    const scale = this.size;
    this.style.setProperty('--ps-w', String(this.#glyph.width * scale));
    this.style.setProperty('--ps-h', String(this.#glyph.height * scale));
    const cell = Math.max(1, CELL * scale - this.gap);
    this.style.setProperty('--ps-cell', `${cell}px`);
  }

  #syncLayout() {
    const scale = this.size;
    const pts: readonly Pixel[] = this.#glyph.pixels;
    for (let i = 0; i < this.#pixels.length; i++) {
      const p = pts[i];
      const el = this.#pixels[i];
      el.style.left = `${p.x * scale}px`;
      el.style.top = `${p.y * scale}px`;
    }
  }

  #rebuildSequence(reshuffle: boolean) {
    const pts = this.#glyph.pixels;
    if (this.order === 'random' && !reshuffle && this.#sequence.length === pts.length) return;
    this.#sequence = orderIndices(this.order, pts);
    for (let i = 0; i < this.#sequence.length; i++) {
      const pixelIndex = this.#sequence[i];
      this.#pixels[pixelIndex]?.style.setProperty('--i', String(i));
    }
  }

  #applyTrail() {
    const n = this.#sequence.length;
    if (!n) return;
    const trail = Math.min(this.trail, n);
    const on = new Set<number>();
    for (let t = 0; t < trail; t++) {
      const pos = (this.#index - t + n) % n;
      on.add(this.#sequence[pos]);
    }
    for (let i = 0; i < this.#pixels.length; i++) {
      this.#pixels[i].classList.toggle('is-on', on.has(i));
    }
  }

  #showAll() {
    for (const el of this.#pixels) el.classList.add('is-on');
  }

  #onHover(on: boolean) {
    this.#hovering = on;
    this.classList.toggle('is-hover', on);
    if (on) {
      this.#clear();
      this.#showAll();
      return;
    }
    this.#applyTrail();
    if (!this.paused) this.#arm();
  }

  #arm() {
    this.#clear();
    if (this.paused || this.#hovering || !this.isConnected || !this.#sequence.length) return;
    this.#timer = window.setTimeout(this.#tick, this.speed);
  }

  #clear() {
    if (this.#timer != null) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
  }
}

export function definePixelStatus(tagName = TAG): void {
  if (typeof customElements === 'undefined') return;
  if (!customElements.get(tagName)) {
    customElements.define(tagName, PixelStatus);
  }
}
