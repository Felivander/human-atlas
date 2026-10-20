# Human Atlas

An interactive 3D anatomy explorer built with React, Three.js, and shadcn/ui, available in Spanish and English. Choose between two reference bodies: the BodyParts3D adult male, with **2,234 individually selectable meshes** and **3,432 named concepts**, and the Human Reference Atlas female, with **964 meshes** and **1,174 concepts**.

**[Explore the live demo](https://human-atlas-seven.vercel.app)**

## Explore

- Switch between male and female anatomy, and between Spanish and English.
- Orbit, zoom, and select structures directly on the body.
- Toggle individual systems or use skeleton and organ presets.
- Move from assembled anatomy to a spaced inventory of every visible piece.
- Search anatomical names (in either language, accents optional) and source identifiers.
- Isolate a selected structure and read its details.
- Use compact controls and detail panels on mobile.
- Follow a short first-visit tutorial, which can be reopened from the footer.

## Run locally

Requires Node.js 22.13 or newer. No API keys or accounts are needed.

```sh
npm ci
npm run dev
```

Open http://localhost:3016. To build the static site, run `npm run build`; the output is in `dist/`.

## Validate

```sh
npm run check
node scripts/validate-atlas.mjs
node scripts/validate-atlas.mjs atlas-female.json
node scripts/validate-interactions.mjs
npm run build
```

Validation covers mesh buffers, names, Spanish translations, and concept membership for both models, nonoverlapping exploded layouts at desktop and mobile aspect ratios, search and inspection contracts, and tap-versus-drag handling. Browser interaction checks have exercised selection, system controls, search, isolation, rotation, and 390×844, 320×568, and 844×390 layouts. Phone controls stay clear of the exploded inventory, and isolated structures fit the space above or beside the detail panel. Physical-device performance and real multitouch hardware have not been tested.

## Anatomy data

The male model is **BodyParts3D 4.0**, an adult male reference anatomy. The female model combines the Human Reference Atlas **united-female v1.10** and **pelvis-female v1.3** reference organs: the whole-body surface, selected organs, the mouth and teeth, the sternum and intervertebral disks, and female reproductive anatomy, with partial skeleton and muscle coverage; eight pregnancy reference pieces sit in a separate layer, hidden by default. Both are licensed **CC BY 4.0**. Neither represents every human structure or variation. Individual source meshes are distinct from named concepts, which may group multiple meshes. Descriptions distinguish general system context from individual organ explanations.

Geometry is simplified for browser performance while retaining every source mesh. The male model contains 2,288,268 triangles (about 33 MB of compressed geometry) and the female model 2,307,090 triangles (about 30 MB); only the selected model is downloaded. Full credits, source links, and adaptation details are in [ATTRIBUTION.md](public/ATTRIBUTION.md).

The male model has an optional **Extra detail** layer, off by default, adapted from [Z-Anatomy](https://github.com/Z-Anatomy/Models-of-human-anatomy): 1,025 pieces that BodyParts3D lacks (lymph nodes, ligaments and joint tissue, bursae and tendon sheaths, peripheral nerves, facial, masticatory and abdominal muscles, salivary glands), fitted to the BodyParts3D skeleton, with 423,181 triangles and about 5.5 MB compressed. Those files (`atlas-zanatomy.json`, `zanatomy-*.bin`) are licensed **CC BY-SA 4.0**, so adaptations of them must keep that license.

This is an educational explorer, not a diagnostic or surgical tool.

## How it works

Geometry is merged into batches. Per-structure GPU textures control translation, visibility, and selection, while component geometry supports accurate picking. Exploded layouts pack only the visible pieces. Rendering updates when the scene changes; orbit controls remain responsive without thousands of separate draw calls.

The optional WebMCP tools expose anatomy search and inspection in compatible browsers. The visible interface works without them.

## Rebuilding geometry

The repository includes browser-ready geometry. Rebuilding it is optional: obtain the official BodyParts3D OBJ archive and English metadata tables, prepare the joined concepts and display-system mappings, run `scripts/convert-anatomy.py`, then `node scripts/optimize-anatomy.mjs` and `node scripts/compress-models.mjs`. For the female model, download the united-female v1.10 and pelvis-female v1.3 GLBs, run `python3 scripts/convert-female.py scripts/female-parts.json UNITED.glb PELVIS.glb`, then `node scripts/optimize-anatomy.mjs atlas-female.json` and `node scripts/compress-models.mjs atlas-female.json`. `scripts/female-parts.json` holds the curated display name, system and ontology id of every female mesh. For the Z-Anatomy layer, run `scripts/convert-zanatomy.py Startup.blend TA2.csv` (both from the Z-Anatomy repository; no Blender needed), then `node scripts/optimize-anatomy.mjs atlas-zanatomy.json`, `node scripts/compress-models.mjs atlas-zanatomy.json` and `node scripts/validate-atlas.mjs atlas-zanatomy.json`. Simplification uses a 0.2% relative error limit per structure.

## Deploy

Import this repository into Vercel as a Vite project. The included `vercel.json` configures `npm ci`, `npm run build`, and the `dist` output directory. It can also be served by a static host.

## License

Original application code is released under the [MIT License](LICENSE). **The anatomy data has its own CC BY 4.0 license**; preserve the attribution when redistributing it. Third-party dependencies retain their respective licenses.

Issues and pull requests are welcome. Please include reproduction steps and browser/device details for interaction problems.
