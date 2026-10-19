# Replacing imagery

All images on the site are generated procedurally by `tools/artgen` (raymarched monochrome scenes),
so the concept ships without third-party photography. To use real photographs instead:

1. Put a file named after the slot into this folder, e.g. `hero.jpg`, `monolith.webp`.
2. Run `npm run art:optimize` — it rebuilds `public/art/*` (AVIF + WebP, 800/1600/2400w) and `src/data/art-manifest.json`.

Files in this folder take precedence over the generated ones. Use only images you are licensed to use.

| Slot | Ratio | Brief |
| --- | --- | --- |
| `hero` | 12:7 | Draped / veiled sculpture, black glossy fabric, single hard key light, black background. Subject right of centre. |
| `about` | 8:5 | Shrouded figure in warm low light, subject on the right third, deep shadows on the left for text. |
| `veil-detail` | 3:4 | Close crop of wet satin folds catching light. |
| `veil-dark` | 4:5 | Full shrouded figure from behind, rim light. |
| `muse-marble` | 4:5 | Pale marble head lying on its side, raking light. |
| `muse-fracture` | 4:5 | Fractured marble / plaster surface with dark seams. |
| `monolith` | 4:5 | Black monolith or obelisk in still water, overcast, mountains in fog. |
| `monolith-wide` | 12:7 | Same landscape, wide establishing shot. |
| `chrome` | 4:5 | Liquid black-chrome sculpture, studio strip lights, black void. |
| `chrome-helmet` | 8:5 | Black chrome form, wide. |
| `chrome-close` | 4:5 | Macro of reflective chrome curves. |
| `bloom` | 4:5 | Dark metallic flower seen from above, specular petals. |
| `corridor` | 12:7 | Dark colonnade, single lit doorway, silhouette of a figure. |
| `corridor-empty` | 4:5 | Same architecture without a figure, light fog. |
