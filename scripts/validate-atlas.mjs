import fs from 'node:fs';
import assert from 'node:assert/strict';
const filename=process.argv[2]??'atlas.json',female=filename.includes('female'),extra=filename.includes('zanatomy');
const base=new URL('../public/models/',import.meta.url),atlas=JSON.parse(fs.readFileSync(new URL(filename,base)));
const ids=new Set(atlas.parts.map(p=>p.id));
if(extra){
 // Optional CC BY-SA layer: ids must not collide with BodyParts3D and non-commercial sources stay out.
 assert.equal(atlas.license,'CC BY-SA 4.0');assert.equal(ids.size,atlas.parts.length);assert.ok(atlas.parts.length>0);
 const base=JSON.parse(fs.readFileSync(new URL('atlas.json',new URL('../public/models/',import.meta.url))));for(const p of base.parts)assert.ok(!ids.has(p.id),`id collision: ${p.id}`);
 for(const p of atlas.parts){assert.ok(p.id.startsWith('ZA:'));assert.equal(p.source,'zanatomy');assert.ok(!/cochle|labyrinth|semicircular|kidney|renal/i.test(p.name),`non-commercial source: ${p.name}`);}
}else{assert.equal(atlas.parts.length,female?964:2234);assert.equal(atlas.concepts.length,female?1174:3432);assert.equal(ids.size,female?964:2234);}
if(female){assert.equal(atlas.parts.filter(p=>p.system==='pregnancy').length,8);for(const label of ['uterus','ovary','vagina'])assert.ok(atlas.parts.some(p=>p.name.toLowerCase().includes(label)));assert.ok(!atlas.parts.some(p=>/prostate|testis|penis/i.test(p.name)));
 // pelvis-female v1.3 supplies the pubis and ischium that united-female v1.10 lacks.
 for(const bone of ['pubis','ischium'])for(const tissue of ['compact','spongy'])for(const side of ['L','R'])assert.ok(ids.has(`VH_F_${bone}_${tissue}_bone_${side}`),`missing ${bone} ${tissue} ${side}`);
 for(const id of ['VH_F_sternum','VH_F_manubrium','VH_F_set_of_upper_jaw_teeth'])assert.ok(ids.has(id),`missing ${id}`);}
const namesEs=extra?atlas.namesEs:JSON.parse(fs.readFileSync(new URL('../app/names-es.json',import.meta.url)));
for(const x of [...atlas.parts,...atlas.concepts])assert.ok(namesEs[x.name.trim().toLowerCase()],`missing Spanish name: ${x.name}`);
const files=atlas.chunks.map(c=>{const b=fs.readFileSync(new URL(c.url.split('/').pop(),base));assert.equal(b.length,c.bytes);return b;});
let tris=0;
for(const p of atlas.parts){assert.ok(p.name.trim()&&p.name!=='-'&&!p.name.includes('Bounds('));assert.ok(p.conceptId!=='-');assert.ok(p.system);const b=files[p.chunk];assert.ok(p.indices+p.indexCount*4<=b.length);const pos=new Float32Array(b.buffer,b.byteOffset+p.positions,p.vertexCount*3),indices=new Uint32Array(b.buffer,b.byteOffset+p.indices,p.indexCount);assert.ok(indices.length>=3);for(const i of indices)assert.ok(i<p.vertexCount,`${p.id}: invalid vertex`);for(const value of pos)assert.ok(Number.isFinite(value));tris+=p.indexCount/3;}
for(const c of atlas.concepts){assert.ok(c.elements.length);for(const id of c.elements)assert.ok(ids.has(id),`${c.id}: missing ${id}`);}
assert.equal(tris,atlas.triangles);
console.log(`Verified ${ids.size} individually indexed meshes, ${atlas.concepts.length} complete concept mappings, Spanish names for every structure, ${tris.toLocaleString()} triangles, and every binary buffer.`);
