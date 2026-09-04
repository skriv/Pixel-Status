# pixel-status

Framework-agnostic `<pixel-status>` Web Component: a pixel-art **404** that scans one cube at a time, then lights the active cells. Hover tints the whole glyph.

## Quick start

```bash
git clone https://github.com/skriv/Pixel-Status.git
cd Pixel-Status
npm install
```

Import the entry (auto-registers `<pixel-status>`):

```ts
import 'pixel-status';
```

Or after `npm run build`, drop in the IIFE bundle:

```html
<script src="./dist/pixel-status.min.js"></script>
<pixel-status></pixel-status>
```

Defaults (omitted attributes use these values):

```html
<pixel-status
  color="#ffffff"
  appear-color="#99A1AF"
  hover-color="#99A1AF"
  size="3"
  speed="40"
  fade="80"
  easing="cubic-bezier(0.4, 0, 1, 1)"
  trail="3"
  order="random"
  hover-stagger="6"
></pixel-status>
```

## Playground

Interactive preview with live snippet export:

```bash
npm install
npm run dev
```

Open the local Vite URL. Adjust timing, colors, trail, scan order, glow, and copy the generated markup.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `color` | `#ffffff` | Idle cube color |
| `appear-color` | `#99A1AF` | Color of the active trail cubes |
| `hover-color` | `#99A1AF` | Color when the pointer is over the glyph |
| `size` | `3` | Scale factor (1–32) |
| `speed` | `40` | Milliseconds between trail steps |
| `fade` | `80` | Color transition duration in ms |
| `easing` | `cubic-bezier(0.4, 0, 1, 1)` | CSS easing, including `cubic-bezier(...)` |
| `trail` | `3` | How many cubes stay lit |
| `order` | `random` | Scan order: `design`, `ltr`, `random`, `chars` |
| `hover-stagger` | `6` | Hover fill delay per cube in ms |
| `glow` | off | Presence attribute; adds a soft glow |
| `gap` | `0` | Gap between cubes in px |
| `paused` | off | Presence attribute; freezes playback |

## Methods

```js
const el = document.querySelector('pixel-status');
el.play();
el.pause();
el.restart();
```

The same values are available as typed properties (`el.speed`, `el.appearColor`, …).

## Build

| Script | What it does |
| --- | --- |
| `npm run dev` | Playground |
| `npm run build` | Library (`dist/pixel-status.min.js`, `dist/pixel-status.esm.js`) + playground site |
| `npm run typecheck` | TypeScript without emit |

The IIFE bundle exposes `PixelStatus` as a global. Shadow DOM parts: `stage`, `pixel`, `flash`.

## License

MIT
