export const EASINGS = [
  'linear',
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'cubic-bezier(0.22, 1, 0.36, 1)',
  'cubic-bezier(0.4, 0, 1, 1)',
] as const;

export type EasingName = (typeof EASINGS)[number];

const EASING_SET = new Set<string>(EASINGS);
const CUBIC = /^cubic-bezier\(\s*-?[\d.]+\s*,\s*-?[\d.]+\s*,\s*-?[\d.]+\s*,\s*-?[\d.]+\s*\)$/;

export function isEasing(value: string): boolean {
  return EASING_SET.has(value) || CUBIC.test(value);
}

export const DEFAULTS = {
  color: '#99a1af',
  appearColor: '#ffffff',
  hoverColor: '#111827',
  size: 4,
  speed: 120,
  fade: 280,
  easing: 'ease-in-out' as EasingName,
  trail: 1,
  order: 'design' as const,
  hoverStagger: 0,
  glow: false,
  gap: 0,
  paused: false,
  text: '404',
};

export const STYLES = /* css */ `
@property --ps-fill {
  syntax: '<color>';
  inherits: false;
  initial-value: ${DEFAULTS.color};
}
:host {
  display: inline-block;
  position: relative;
  width: calc(var(--ps-w) * 1px);
  height: calc(var(--ps-h) * 1px);
  line-height: 0;
  --ps-color: ${DEFAULTS.color};
  --ps-appear-color: ${DEFAULTS.appearColor};
  --ps-hover-color: ${DEFAULTS.hoverColor};
  --ps-fade: ${DEFAULTS.fade}ms;
  --ps-easing: ${DEFAULTS.easing};
  --ps-cell: ${DEFAULTS.size}px;
  --ps-hover-stagger: 0ms;
  --ps-w: 0;
  --ps-h: 0;
}
:host([hidden]) { display: none; }

.stage {
  position: relative;
  width: 100%;
  height: 100%;
}

.pixel {
  position: absolute;
  box-sizing: border-box;
  overflow: hidden;
  width: var(--ps-cell);
  height: var(--ps-cell);
  margin: 0;
  padding: 0;
  border: 0;
  --ps-fill: var(--ps-color);
  background-color: var(--ps-fill);
  opacity: 1;
  pointer-events: none;
  transition:
    --ps-fill var(--ps-fade) var(--ps-easing),
    background-color var(--ps-fade) var(--ps-easing),
    box-shadow var(--ps-fade) var(--ps-easing);
  transition-delay: 0ms;
}
.flash {
  position: absolute;
  inset: 0;
  background-color: var(--ps-appear-color);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--ps-fade) var(--ps-easing);
}
.pixel.is-on .flash {
  opacity: 1;
}
:host(.is-hover) .pixel {
  --ps-fill: var(--ps-hover-color);
  transition-delay: calc(var(--i, 0) * var(--ps-hover-stagger));
}
:host(.is-hover) .flash {
  opacity: 0;
  transition-delay: calc(var(--i, 0) * var(--ps-hover-stagger));
}

:host([glow]) .pixel {
  box-shadow: 0 0 calc(var(--ps-cell) * 0.75) var(--ps-fill);
}
`;
