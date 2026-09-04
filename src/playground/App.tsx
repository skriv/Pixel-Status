import React, { useEffect, useRef, useState } from 'react';
import { useDialKit, DialRoot } from 'dialkit';
import 'dialkit/styles.css';

import { PixelStatus } from '../pixel-status';
import { DEFAULTS, EASINGS } from '../styles';
import type { PixelOrder } from '../pixels';
import { applySnippet, buildSnippet, highlightSnippet } from './snippet';
import { EXAMPLES, type ExampleSpec } from './examples';

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
  content: {
    text: { type: 'text' as const, default: DEFAULTS.text, placeholder: 'Type here…' },
  },
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
    bg: '#F9FAFB',
  },
  look: {
    size: [DEFAULTS.size, 1, 12, 1] as [number, number, number, number],
    gap: [DEFAULTS.gap, 0, 8, 1] as [number, number, number, number],
  },
  motion: {
    trail: [DEFAULTS.trail, 1, 8, 1] as [number, number, number, number],
    order: {
      type: 'select' as const,
      options: [
        { value: 'design', label: 'Design' },
        { value: 'ltr', label: 'Scanline' },
        { value: 'random', label: 'Random' },
        { value: 'chars', label: 'By character' },
      ],
      default: DEFAULTS.order,
    },
    hoverStagger: [DEFAULTS.hoverStagger, 0, 40, 1] as [number, number, number, number],
  },
  playback: {
    pause: { type: 'action' as const },
    restart: { type: 'action' as const },
  },
};

function Playground() {
  const elRef = useRef<PixelStatus | null>(null);
  const [paused, setPaused] = useState(false);
  const [copied, setCopied] = useState(false);

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
      }
    },
  });

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    applySnippet(el, {
      text: params.content.text,
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
      gap: params.look.gap,
    });
    el.paused = paused;
  }, [params, paused]);

  const snippet = buildSnippet({
    text: params.content.text,
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

function ExampleCard({ spec }: { spec: ExampleSpec }) {
  const elRef = useRef<PixelStatus | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = elRef.current;
    if (el) applySnippet(el, spec);
  }, [spec]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildSnippet(spec));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className="example">
      <div className="example-stage" style={{ background: spec.bg }}>
        <pixel-status ref={elRef as React.Ref<HTMLElement>} />
      </div>
      <div className="example-meta">
        <span>{spec.label}</span>
        <button
          type="button"
          className="act"
          onClick={copy}
          aria-label={`Copy ${spec.label} specification`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </article>
  );
}

function Examples() {
  return (
    <div className="examples">
      {EXAMPLES.map((spec) => (
        <ExampleCard key={spec.id} spec={spec} />
      ))}
    </div>
  );
}

export function App() {
  return (
    <>
      <div className="wrap">
        <header>
          <h1>&lt;pixel-status&gt;</h1>
          <a
            className="repo"
            href="https://github.com/skriv/Pixel-Status"
            target="_blank"
            rel="noreferrer"
          >
            https://github.com/skriv/Pixel-Status
          </a>
        </header>
        <h2>Playground</h2>
        <Playground />
        <h2>Examples</h2>
        <Examples />
      </div>
      <DialRoot theme="light" position="top-right" defaultOpen={false} productionEnabled />
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
