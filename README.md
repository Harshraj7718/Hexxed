# HAXXED homepage

Vite + React + TypeScript build of the Claude Design prototype `project/Haxxed Home v3.dc.html`, plus the 3D jar viewer (`project/Haxxed Jar 3D.html`).

```sh
npm install
npm run dev        # http://localhost:5173 (homepage) and /jar-3d.html (viewer)
npm run build      # typecheck + production build to dist/
```

## Layout

| Path | What |
| --- | --- |
| `src/home/HomePage.tsx` | Page composition, bag + Onee wiring |
| `src/home/sections/` | Hero (scroll story), Story (marquee, born, crew, intro, standard, origin), Shop (bench, quiz, lookbook), Chrome (nav, footer, bag drawer, Onee dock, toast) |
| `src/home/effects/` | Hero dot grid, liquid-metal logo shader, footer light beam |
| `src/home/data.ts` | Products, chapters, quiz logic, copy |
| `src/three/jarModel.ts` | Jar + courier-box model shared by both pages |
| `src/three/HeroScene.ts` | Scroll-driven hero scene (jar → lid → variants → boxed and sealed) |
| `src/three/ModelStage.ts` | Orbit viewer with OBJ+MTL / GLB export |
| `src/onee/` | Onee avatar runtime (from `project/uploads/`) and the `OneeBuddy` controller |
| `src/config.ts` | Design tweaks |

## Tweaks

The prototype's Tweaks panel became props on `<HomePage tweaks={…} />`, with defaults and ranges in `src/config.ts`. Any of them can also be overridden in the URL, for example `/?marqueeSpeed=18&metalSpeed=2&gridSpacing=24&gridSpotlight=240`.

| Tweak | Default | Range |
| --- | --- | --- |
| `marqueeSpeed` | 28s | 10–60 |
| `metalSpeed` | 1 | 0–3 |
| `gridSpacing` | 30px | 16–60 |
| `gridSpotlight` | 170px | 80–360 |

## Open items carried over from the design chat

- Checkout is a stub (it shows a toast). Social links and Shipping/FAQ/Contact point at `#footer`.
- Matte Paste has no product photo, so it shows a striped placeholder in the bag and the quiz result.
- "Buy now" adds Cream Pomade, the last jar shown in the hero.
- The lookbook photos need permission before launch: one carries another account's watermark, and one shows a well-known cricketer.
- There is no dedicated phone layout, the same as the prototype.
