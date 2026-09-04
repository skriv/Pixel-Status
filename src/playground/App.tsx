import React, { useEffect, useRef, useState } from 'react';
import { useDialKit, useDialKitController, DialRoot } from 'dialkit';
import 'dialkit/styles.css';

import { PixelStatus } from '../pixel-status';
import { DEFAULTS, EASINGS } from '../styles';
import type { PixelOrder } from '../pixels';
import { buildSnippet, highlightSnippet } from './snippet';

const EASING_OPTIONS = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease in' },
  { value: 'ease-out', label: 'Ease out' },
  { value: 'ease-in-out', label: 'Ease in-out' },
  { value: EASINGS[5], label: 'Smooth' },
  { value: EASINGS[6], label: 'Snap' },
];

const CONFIG = {
  timing: {
    speed: [DEFAULTS.speed, 40, 800] as [number, number, number],
    fade: [DEFAULTS.fade, 50, 1200] as [number, number, number],
    easing: {
      type: 'select' as const,
      options: EASING_OPTIONS,
      default: DEFAULTS.easing,
    },
  },
  colors: {
    cubeColor: DEFAULTS.color,
    appearColor: DEFAULTS.appearColor,
    hoverColor: DEFAULTS.hoverColor,
    bg: '#ffffff',
  },
  look: {
    size: [DEFAULTS.size, 1, 12, 1] as [number, number, number, number],
    gap: [DEFAULTS.gap, 0, 8, 1] as [number, number, number, number],
    glow: DEFAULTS.glow,
  },
  motion: {
    trail: [DEFAULTS.trail, 1, 8, 1] as [number, number, number, number],
    order: {
      type: 'select' as const,
      options: [
        { value: 'design', label: 'Design' },
        { value: 'ltr', label: 'Scanline' },
        { value: 'random', label: 'Random' },
        { value: 'digits', label: 'By digit' },
      ],
      default: DEFAULTS.order,
    },
    hoverStagger: [DEFAULTS.hoverStagger, 0, 40, 1] as [number, number, number, number],
  },
  playback: {
    pause: { type: 'action' as const },
    restart: { type: 'action' as const },
  },
  presets: {
    idleScan: { type: 'action' as const, label: 'Idle scan' },
    fastGlitch: { type: 'action' as const, label: 'Fast glitch' },
    softHover: { type: 'action' as const, label: 'Soft hover' },
  },
};

const PRESETS = {
  idleScan: {
    timing: { speed: 120, fade: 280, easing: 'ease-in-out' },
    look: { glow: false, gap: 0 },
    motion: { trail: 1, order: 'design', hoverStagger: 0 },
  },
  fastGlitch: {
    timing: { speed: 40, fade: 80, easing: 'linear' },
    look: { glow: true, gap: 1 },
    motion: { trail: 3, order: 'random', hoverStagger: 4 },
  },
  softHover: {
    timing: { speed: 180, fade: 600, easing: EASINGS[5] },
    look: { glow: false, gap: 0 },
    motion: { trail: 1, order: 'ltr', hoverStagger: 18 },
  },
} as const;

function Playground() {
  const elRef = useRef<PixelStatus | null>(null);
  const [paused, setPaused] = useState(false);
  const [copied, setCopied] = useState(false);

  const dial = useDialKitController('Pixel Status', CONFIG, { id: 'pixel-status' });

  const params = useDialKit('Pixel Status', CONFIG, {
    id: 'pixel-status',
    onAction: (action) => {
      const el = elRef.current;
      if (action === 'playback.pause' || action === 'pause') {
        if (paused) {
          el?.play();
          setPaused(false);
        } else {
          el?.pause();
          setPaused(true);
        }
        return;
      }
      if (action === 'playback.restart' || action === 'restart') {
        setPaused(false);
        el?.restart();
        return;
      }
      const presetKey =
        action.endsWith('idleScan') ? 'idleScan' :
        action.endsWith('fastGlitch') ? 'fastGlitch' :
        action.endsWith('softHover') ? 'softHover' :
        null;
      if (presetKey) dial.setValues(PRESETS[presetKey]);
    },
  });

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    el.color = params.colors.cubeColor;
    el.appearColor = params.colors.appearColor;
    el.hoverColor = params.colors.hoverColor;
    el.size = params.look.size;
    el.speed = params.timing.speed;
    el.fade = params.timing.fade;
    el.easing = params.timing.easing;
    el.trail = params.motion.trail;
    el.order = params.motion.order as PixelOrder;
    el.hoverStagger = params.motion.hoverStagger;
    el.glow = params.look.glow;
    el.gap = params.look.gap;
    el.paused = paused;
  }, [params, paused]);

  const snippet = buildSnippet({
    color: params.colors.cubeColor,
    appearColor: params.colors.appearColor,
    hoverColor: params.colors.hoverColor,
    size: params.look.size,
    speed: params.timing.speed,
    fade: params.timing.fade,
    easing: params.timing.easing,
    trail: params.motion.trail,
    order: params.motion.order as PixelOrder,
    hoverStagger: params.motion.hoverStagger,
    glow: params.look.glow,
    gap: params.look.gap,
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="panel play">
      <div className="stage" style={{ background: params.colors.bg }}>
        <pixel-status ref={elRef as React.Ref<HTMLElement>} />
        <span className="hint">{paused ? 'paused' : 'hover to tint'}</span>
      </div>
      <div className="code-block">
        <div className="code-header">
          <span>Code</span>
          <button type="button" className="act" onClick={copy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre
          className="code"
          dangerouslySetInnerHTML={{ __html: highlightSnippet(snippet) }}
        />
      </div>
    </div>
  );
}

export function App() {
  return (
    <>
      <div className="wrap">
        <header>
          <h1>&lt;pixel-status&gt;</h1>
          <p>
            Pixel-art 404. Cubes stay visible in their color; appear color
            overlays them one by one. Hover tints the whole glyph.
          </p>
        </header>
        <h2>Playground</h2>
        <Playground />
      </div>
      <DialRoot theme="light" position="top-right" defaultOpen productionEnabled />
    </>
  );
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'pixel-status': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
