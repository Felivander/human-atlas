# Anatomy data attribution

BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.

- License: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html (updated 2025-02-27)
- Dataset: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
- License terms: https://creativecommons.org/licenses/by/4.0/
- Source geometry: `isa_BP3D_4.0_obj_99.zip`, BodyParts3D 4.0.
- English names and relationships: IS-A and PART-OF concept, element, and inclusion tables from the same archive. Spanish display names (`app/names-es.json`) are translations made for this viewer.
- Publication: Mitsuhashi et al. (2009), BodyParts3D: 3D structure database for anatomical concepts. https://doi.org/10.1093/nar/gkn613

Adaptations: axes and units converted from millimeters/Z-up to meters/Y-up; translated to rest at the stage; geometry simplified using meshoptimizer with 0.2% relative error limit per structure; normals quantized to signed 16-bit; packed into binary chunks; curated display system groupings and colors. The source contains 2,234 individual OBJ meshes; all remain represented. The combined hierarchy contains 3,432 named FMA concepts, which may reference multiple meshes. Original source identity is preserved in the manifest.

Source OBJ comments mention an older CC BY-SA 2.1 Japan license. The official current database license linked above supersedes that legacy text and explicitly permits redistribution and adaptation under CC BY 4.0.

BodyParts3D represents an adult male reference anatomy based on TARO MRI and anatomical illustration refinements. It is not a complete model of every possible human anatomical structure or variation. This interface is educational and is not a clinical tool.

## Female reference anatomy

Kristen Browne and Heidi Schlehlein, Human Reference Atlas / HuBMAP, *3D Reference Organ Set for Female v1.5* (2023). CC BY 4.0. Geometry adapted for this viewer.

- Source DOI: https://doi.org/10.48539/HBM352.BTSQ.586
- Dataset: https://lod.humanatlas.io/ref-organ/united-female/v1.5
- Original GLB: https://cdn.humanatlas.io/digital-objects/ref-organ/united-female/v1.5/assets/3d-vh-f-united.glb
- License: https://creativecommons.org/licenses/by/4.0/

Adaptations: translated native meter/Y-up coordinates onto the stage, coincident vertices welded and source normals averaged, geometry simplified with a 0.2% per-structure relative error bound, and normals quantized. Colors and display systems are curated for this interface. All 888 source meshes are represented, with 1,073 source nodes available as selectable individual or compound concepts.

This is a reference assembly with whole-body surface and selected organs, including female reproductive anatomy. Its skeleton and muscle coverage is partial. It is not a complete model of every human structure or a single-person scan. Eight placenta/umbilical structures are classified under Pregnancy reference and hidden by default.

## Optional extra-detail layer (male model) · CC BY-SA 4.0

Adapted from **Z-Anatomy – The libre 3D atlas of anatomy** (Gauthier Kervyn, Marcin Zielinski and contributors), CC BY-SA 4.0, itself derived from **BodyParts3D – The Database Center for Life Science**. Spanish structure names come from Z-Anatomy's TA2 terminology table (Spanish translation by Carlos Torres Villar).

- Source: https://github.com/Z-Anatomy/Models-of-human-anatomy (`Z-Anatomy.zip` → `Startup.blend`, `TA2.csv`)
- License: https://creativecommons.org/licenses/by-sa/4.0/

**Files under CC BY-SA 4.0:** `models/atlas-zanatomy.json` and `models/zanatomy-*.bin` (and their `.gz` copies). These files, and any adaptation of them, must be shared under the same license. The rest of this project's anatomy data stays under CC BY 4.0 and its code under MIT.

Adaptations: only structure families missing from BodyParts3D were kept (lymph nodes; ligaments, joint capsules, menisci, nuclei pulposi; bursae, tendon sheaths, fasciae and retinacula; peripheral and cranial nerves; facial, masticatory, abdominal-wall and some deep back muscles; parotid gland and salivary ducts). Each piece was moved onto the BodyParts3D skeleton with a smooth bone-anchored warp (187 matching bones), curve-based nerves were rebuilt as tubes, normals were recomputed, geometry was simplified with a 0.2% per-structure relative error bound, and a few missing Spanish names were translated for this viewer. Z-Anatomy's non-commercial pieces (inner ear, CC BY-NC-SA; kidney, CC BY-NC) and its Wikipedia definitions are not included. Most left/right pairs in Z-Anatomy are mirror copies of one side.
