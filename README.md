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
<pixel-status
  color="#99a1af"
  appear-color="#ffffff"
  hover-color="#111827"
  size="4"
  speed="120"
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
| `color` | `#99a1af` | Idle cube color |
| `appear-color` | `#ffffff` | Color of the active trail cubes |
| `hover-color` | `#111827` | Color when the pointer is over the glyph |
| `size` | `4` | Scale factor (1–32) |
| `speed` | `120` | Milliseconds between trail steps |
| `fade` | `280` | Color transition duration in ms |
| `easing` | `ease-in-out` | CSS easing, including `cubic-bezier(...)` |
| `trail` | `1` | How many cubes stay lit |
| `order` | `design` | Scan order: `design`, `ltr`, `random`, `digits` |
| `hover-stagger` | `0` | Hover fill delay per cube in ms |
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
