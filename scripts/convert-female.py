"""Convert the official HRA female reference GLBs into named atlas meshes.
Run: python3 scripts/convert-female.py scripts/female-parts.json UNITED.glb [EXTRA.glb ...]

UNITED.glb is united-female v1.10; each EXTRA.glb (e.g. pelvis-female v1.3) only adds meshes whose
node names are missing from the files before it, grafted into the hierarchy by matching node names.
All HRA female sets share the Visible Human Female coordinate space (Y-up, meters). Node transforms
(v1.10 rotates and scales a few nodes, such as the skin) are applied, then the body is translated
onto the stage. female-parts.json maps each mesh node name to its display name, system and ontology id.
"""
import json,sys,struct,math,re
from pathlib import Path
from array import array
parts_meta=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
out=Path(__file__).resolve().parents[1]/'public/models';chunks=[];blob=bytearray();parts=[];triangles=0
# Same stage offset as the v1.5 conversion: the HRA sets share one coordinate space, so the body keeps its place.
shift=.794760942
formats={5126:('f',4),5125:('I',4),5123:('H',2),5121:('B',1)}
widths={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}

def load(path):
 source=Path(path).read_bytes();jl=struct.unpack_from('<I',source,12)[0];doc=json.loads(source[20:20+jl]);return doc,memoryview(source)[20+jl+8:]
def read(doc,binary,index):
 a=doc['accessors'][index];view=doc['bufferViews'][a['bufferView']];fmt,sz=formats[a['componentType']];width=widths[a['type']];offset=view.get('byteOffset',0)+a.get('byteOffset',0);stride=view.get('byteStride',width*sz)
 if stride==width*sz:
  v=array(fmt);v.frombytes(binary[offset:offset+a['count']*width*sz]);return v
 values=array(fmt)
 for i in range(a['count']):values.extend(struct.unpack_from('<'+fmt*width,binary,offset+i*stride))
 return values

def mul(a,b):return [[sum(a[i][k]*b[k][j] for k in range(4)) for j in range(4)] for i in range(4)]
IDENTITY=[[1.0 if i==j else 0.0 for j in range(4)] for i in range(4)]
def local(node):
 if 'matrix' in node:m=node['matrix'];return [[m[j*4+i] for j in range(4)] for i in range(4)]
 tx,ty,tz=node.get('translation',[0,0,0]);x,y,z,w=node.get('rotation',[0,0,0,1]);sx,sy,sz=node.get('scale',[1,1,1])
 r=[[1-2*(y*y+z*z),2*(x*y-z*w),2*(x*z+y*w)],[2*(x*y+z*w),1-2*(x*x+z*z),2*(y*z-x*w)],[2*(x*z-y*w),2*(y*z+x*w),1-2*(x*x+y*y)]]
 return [[r[0][0]*sx,r[0][1]*sy,r[0][2]*sz,tx],[r[1][0]*sx,r[1][1]*sy,r[1][2]*sz,ty],[r[2][0]*sx,r[2][1]*sy,r[2][2]*sz,tz],[0,0,0,1]]
def normal_matrix(m):
 a=[row[:3] for row in m[:3]];det=(a[0][0]*(a[1][1]*a[2][2]-a[1][2]*a[2][1])-a[0][1]*(a[1][0]*a[2][2]-a[1][2]*a[2][0])+a[0][2]*(a[1][0]*a[2][1]-a[1][1]*a[2][0]))
 cof=[[(a[(i+1)%3][(j+1)%3]*a[(i+2)%3][(j+2)%3]-a[(i+1)%3][(j+2)%3]*a[(i+2)%3][(j+1)%3]) for j in range(3)] for i in range(3)]
 return [[c/det for c in row] for row in cof]  # inverse-transpose of the linear part
def is_identity(m):return all(abs(m[i][j]-IDENTITY[i][j])<1e-12 for i in range(4) for j in range(4))

def flush():
 global blob
 if not blob:return
 url=f'/models/source-female-{len(chunks)}.bin';(out/url.split('/')[-1]).write_bytes(blob);chunks.append({'url':url,'bytes':len(blob)});blob=bytearray()
def append(values):
 while len(blob)%4:blob.append(0)
 offset=len(blob);blob.extend(values.tobytes());return offset

children={};order=[];labels={};added=set();versions=[]
for path in sys.argv[2:]:
 doc,binary=load(path);versions.append(Path(path).name)
 world={}
 def walk(i,parent):
  node=doc['nodes'][i];m=mul(parent,local(node));world[i]=m;name=node.get('name',str(i))
  if name not in children:children[name]=[];order.append(name)
  if name not in labels:labels[name]=node.get('extras',{}).get('label') or name.replace('VH_F_','').replace('_',' ')
  for c in node.get('children',[]):
   child=doc['nodes'][c].get('name',str(c))
   if child not in children[name]:children[name].append(child)
   walk(c,m)
 for root in doc['scenes'][doc.get('scene',0)]['nodes']:walk(root,IDENTITY)
 for ni,node in enumerate(doc['nodes']):
  if 'mesh' not in node or node['name'] in added:continue
  name=node['name'];meta=parts_meta[name];m=world[ni];nm=None if is_identity(m) else normal_matrix(m)
  positions=array('f');normals=array('h');indices=array('I')
  for primitive in doc['meshes'][node['mesh']]['primitives']:
   assert primitive.get('mode',4)==4
   pos=read(doc,binary,primitive['attributes']['POSITION']);norm=read(doc,binary,primitive['attributes']['NORMAL']);ind=read(doc,binary,primitive['indices']);base=len(positions)//3
   for i in range(0,len(pos),3):
    x,y,z=pos[i],pos[i+1],pos[i+2]
    if nm is not None:
     x,y,z=(m[0][0]*x+m[0][1]*y+m[0][2]*z+m[0][3],m[1][0]*x+m[1][1]*y+m[1][2]*z+m[1][3],m[2][0]*x+m[2][1]*y+m[2][2]*z+m[2][3])
     a,b,c=norm[i],norm[i+1],norm[i+2];a,b,c=(nm[0][0]*a+nm[0][1]*b+nm[0][2]*c,nm[1][0]*a+nm[1][1]*b+nm[1][2]*c,nm[2][0]*a+nm[2][1]*b+nm[2][2]*c);length=math.sqrt(a*a+b*b+c*c) or 1;norm[i],norm[i+1],norm[i+2]=a/length,b/length,c/length
    pos[i],pos[i+1],pos[i+2]=x,y+shift,z
   positions.extend(pos);normals.extend(max(-32767,min(32767,round(v*32767))) for v in norm);indices.extend(i+base for i in ind)
  if len(blob)>6_000_000:flush()
  bounds=[[min(positions[i::3]) for i in range(3)],[max(positions[i::3]) for i in range(3)]]
  parts.append({'id':name,'name':meta['name'],'conceptId':meta['conceptId'],'system':meta['system'],'chunk':len(chunks),'positions':append(positions),'normals':append(normals),'indices':append(indices),'vertexCount':len(positions)//3,'indexCount':len(indices),'bounds':bounds})
  added.add(name);triangles+=len(indices)//3
flush()
missing=set(parts_meta)-added
assert not missing,f'metadata for nodes without meshes: {sorted(missing)[:10]}'

memo={}
def descendants(name):
 if name not in memo:memo[name]=([name] if name in added else [])+[p for child in children.get(name,[]) for p in descendants(child)]
 return memo[name]
concepts=[];seen=set()
for name in order:
 elements=list(dict.fromkeys(descendants(name)))
 if not elements:continue
 label=labels.get(name) or name
 if label.strip() in ['','-','None','NA']:
  # Unlabelled nodes: a single mesh keeps its display name; groups spell out the side like the Allen meshes.
  label=parts_meta[name]['name'] if name in parts_meta else re.sub(r'_([LR])$',lambda m:' (left)' if m.group(1)=='L' else ' (right)',re.sub(r'^(VH_F_|Allen_)','',name)).replace('_',' ')
 identity=(label,tuple(elements))
 if identity in seen:continue
 seen.add(identity);concepts.append({'id':'HRA:'+name,'name':label,'elements':elements})
atlas={'version':'HRA united-female v1.10 + pelvis-female v1.3','sex':'female','source':'Human Reference Atlas','scope':'Female reference assembly · partial skeleton and muscle coverage','parts':parts,'concepts':concepts,'chunks':chunks,'triangles':triangles}
(out/'atlas-female.json').write_text(json.dumps(atlas,separators=(',',':')),encoding='utf-8')
print(json.dumps({'inputs':versions,'parts':len(parts),'concepts':len(concepts),'triangles':triangles,'bytes':sum(c['bytes'] for c in chunks),'systems':sorted(set(p['system'] for p in parts))}))
