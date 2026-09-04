# pixel-status

https://github.com/skriv/Pixel-Status

Framework-agnostic `<pixel-status>` Web Component. It rasterizes `text` with [Departure Mono](https://departuremono.com/) into cubes, then scans an appear-color across them. Hover tints the whole glyph.

Design: [Alex Krivov](https://alexkrivov.com)

Playground: [skriv.github.io/Pixel-Status](https://skriv.github.io/Pixel-Status/)

## Quick start

```bash
git clone https://github.com/skriv/Pixel-Status.git
cd Pixel-Status
npm install
npm run build
```

Import the entry (auto-registers `<pixel-status>`):

```ts
import 'pixel-status';
```

Or drop in the IIFE bundle:

```html
<script src="./dist/pixel-status.min.js"></script>
<!-- Design: Alex Krivov – alexkrivov.com -->
<pixel-status
  text="404"
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
  gap="0"
></pixel-status>
```

Omitted attributes use the same defaults. `text` is clipped to 24 characters.

## Playground

```bash
npm run dev
```

Open the local Vite URL (or the [hosted playground](https://skriv.github.io/Pixel-Status/)). Tweak timing, colors, and motion, then copy the snippet.

## Attributes

| Attribute | Default | Description |
| --- | --- | --- |
| `text` | `404` | String to rasterize (max 24 characters) |
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
| `gap` | `0` | Gap between cubes in px |
| `paused` | off | Presence attribute; freezes playback |

## Methods

```js
const el = document.querySelector('pixel-status');
el.play();
el.pause();
el.restart();
```

The same values are available as typed properties (`el.text`, `el.speed`, `el.appearColor`, …).

## Build

| Script | What it does |
| --- | --- |
| `npm run dev` | Playground |
| `npm run build` | Library (`dist/pixel-status.min.js`, `dist/pixel-status.esm.js`) + playground site |
| `npm run typecheck` | TypeScript without emit |

The IIFE bundle exposes `PixelStatus` as a global. Shadow DOM parts: `stage`, `pixel`, `flash`.

## License

MIT
