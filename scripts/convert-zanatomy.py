"""Convert selected Z-Anatomy structures into an optional CC BY-SA 4.0 layer for the male atlas.
Run: python3 scripts/convert-zanatomy.py Startup.blend TA2.csv
Startup.blend is inside Z-Anatomy.zip and TA2.csv is beside it in
https://github.com/Z-Anatomy/Models-of-human-anatomy. No Blender install is needed: the
uncompressed .blend is read through its own SDNA. Only families missing from BodyParts3D are
kept (lymph nodes, ligaments and joint tissue, bursae and sheaths, muscles, peripheral nerves,
salivary glands). Non-commercial pieces (inner ear, kidney) and Wikipedia definitions are excluded.
"""
import sys,struct,json,re,math,mmap
from pathlib import Path
from array import array

# ---------- .blend reader ----------
blend=open(sys.argv[1],'rb');buf=mmap.mmap(blend.fileno(),0,access=mmap.ACCESS_READ)
assert buf[:12]==b'BLENDER-v305',buf[:12]
blocks=[];pos=12
while True:
 code,size,old,sdna,nr=struct.unpack_from('<4sIQII',buf,pos);pos+=24;code=code.rstrip(b'\0').decode()
 blocks.append((code,pos,size,old,sdna,nr));pos+=size
 if code=='ENDB':break
dna=next(b for b in blocks if b[0]=='DNA1');p=dna[1]
def align(x):return dna[1]+((x-dna[1]+3)&~3)
def strings(p):
 n=struct.unpack_from('<I',buf,p)[0];p+=4;out=[]
 for _ in range(n):e=buf.find(b'\0',p);out.append(buf[p:e].decode('latin1'));p=e+1
 return out,p
assert buf[p:p+8]==b'SDNANAME';names,p=strings(p+8)
p=align(p);assert buf[p:p+4]==b'TYPE';types,p=strings(p+4)
p=align(p);assert buf[p:p+4]==b'TLEN';tlen=struct.unpack_from(f'<{len(types)}H',buf,p+4);p=align(p+4+2*len(types))
assert buf[p:p+4]==b'STRC';count=struct.unpack_from('<I',buf,p+4)[0];p+=8;structs={};order=[]
for _ in range(count):
 t,nf=struct.unpack_from('<HH',buf,p);p+=4;fields={};off=0
 for _ in range(nf):
  ft,fn=struct.unpack_from('<HH',buf,p);p+=4;name=names[fn];dims=[int(x) for x in re.findall(r'\[(\d+)\]',name)];n=math.prod(dims) if dims else 1
  ptr=name.startswith('*') or name.startswith('(*');fields[re.sub(r'\[.*','',name).strip('*()')]=(off,types[ft],ptr,dims);off+=(8 if ptr else tlen[ft])*n
 structs[types[t]]=fields;order.append(types[t])
# Old pointers are not unique in this file, so resolve them inside the owning ID's data run first.
owner=[];last=0
for i,b in enumerate(blocks):
 if b[0]!='DATA':last=i
 owner.append(last)
runs={};glob={}
for i,b in enumerate(blocks):
 if b[3]:runs.setdefault(owner[i],{})[b[3]]=b;glob.setdefault(b[3],b)
def deref(ptr,home):return None if not ptr else runs.get(home,{}).get(ptr) or glob.get(ptr)
FMT={'int':'i','short':'h','char':'b','uchar':'B','float':'f','ushort':'H','uint':'I'}
def rd(base,st,path):
 off=0
 for i,part in enumerate(path.split('.')):
  o,t,ptr,dims=structs[st][part];off+=o
  if i<len(path.split('.'))-1:st=t
 if ptr:return struct.unpack_from('<Q',buf,base+off)[0]
 if t=='char' and dims:return buf[base+off:base+off+dims[0]].split(b'\0')[0].decode('utf-8','replace')
 n=math.prod(dims) if dims else 1;v=struct.unpack_from(f'<{n}{FMT[t]}',buf,base+off);return v[0] if n==1 else list(v)
def idname(ptr,home):b=deref(ptr,home);return rd(b[1],'ID','name')[2:] if b else None

ids={};objects=[];collections={}
for i,b in enumerate(blocks):
 if b[0] in('ME','CU','OB','GR'):ids[(b[0],rd(b[1],'ID','name')[2:])]=i
for i,b in enumerate(blocks):
 if b[0]=='OB':
  objects.append({'name':rd(b[1],'Object','id.name')[2:],'type':rd(b[1],'Object','type'),'data':idname(rd(b[1],'Object','data'),i),'matrix':rd(b[1],'Object','obmat')})
 elif b[0]=='GR':
  members=[];item=rd(b[1],'Collection','gobject.first');seen=set()
  while item and item not in seen:
   seen.add(item);d=deref(item,i)
   if not d:break
   members.append(idname(rd(d[1],'CollectionObject','ob'),i));item=rd(d[1],'CollectionObject','next')
  collections[rd(b[1],'Collection','id.name')[2:]]=members

def mesh_geometry(name):
 i=ids[('ME',name)];b=blocks[i];me=b[1]
 layers={}
 for cd in('vdata','pdata','ldata'):
  lb=deref(rd(me,'Mesh',cd+'.layers'),i)
  for k in range(rd(me,'Mesh',cd+'.totlayer')):
   base=lb[1]+k*tlen[types.index('CustomDataLayer')];layers[(cd,rd(base,'CustomDataLayer','type'))]=deref(rd(base,'CustomDataLayer','data'),i)
 nv,npoly=rd(me,'Mesh','totvert'),rd(me,'Mesh','totpoly')
 vb,pb,lb=layers.get(('vdata',0)),layers.get(('pdata',25)),layers.get(('ldata',26))
 if not(vb and pb and lb and nv and npoly):return [],[]
 vs=tlen[types.index('MVert')];verts=[struct.unpack_from('<3f',buf,vb[1]+k*vs) for k in range(nv)]
 loops=array('i');loops.frombytes(buf[lb[1]:lb[1]+lb[2]]);loops=loops[0::2]
 tris=[]
 for k in range(npoly):
  start,total=struct.unpack_from('<ii',buf,pb[1]+k*12)
  for j in range(1,total-1):tris.append((loops[start],loops[start+j],loops[start+j+1]))
 return verts,tris

def bezier(a,h1,h2,c,steps):
 out=[]
 for s in range(steps):
  t=s/steps;u=1-t;out.append(tuple(u*u*u*a[k]+3*u*u*t*h1[k]+3*u*t*t*h2[k]+t*t*t*c[k] for k in range(3)))
 return out
def curve_geometry(name):
 """Sweep each spline into a closed-ended tube, matching Blender's bevel depth and point radius."""
 i=ids[('CU',name)];cu=blocks[i][1];depth=rd(cu,'Curve','ext2') or .0008;res=max(2,min(rd(cu,'Curve','resolu'),6))
 verts=[];tris=[];item=rd(cu,'Curve','nurb.first');seen=set()
 while item and item not in seen:
  seen.add(item);nb=deref(item,i)
  if not nb:break
  nu=nb[1];kind,n,cyclic=rd(nu,'Nurb','type'),rd(nu,'Nurb','pntsu'),rd(nu,'Nurb','flagu')&1;points=[]
  if kind==1:
   bz=deref(rd(nu,'Nurb','bezt'),i);size=tlen[types.index('BezTriple')]
   cp=[(struct.unpack_from('<9f',buf,bz[1]+k*size),rd(bz[1]+k*size,'BezTriple','radius')) for k in range(n)]
   segs=n if cyclic else n-1
   for k in range(segs):
    (a,ra),(c,rc)=cp[k],cp[(k+1)%n]
    for q,pt in enumerate(bezier(a[3:6],a[6:9],c[0:3],c[3:6],res)):points.append((pt,ra+(rc-ra)*q/res))
   if not cyclic:points.append((cp[-1][0][3:6],cp[-1][1]))
  else:
   bp=deref(rd(nu,'Nurb','bp'),i);size=tlen[types.index('BPoint')]
   points=[(struct.unpack_from('<3f',buf,bp[1]+k*size),rd(bp[1]+k*size,'BPoint','radius')) for k in range(n)]
  item=rd(nu,'Nurb','next')
  points=[q for k,q in enumerate(points) if k==0 or math.dist(q[0],points[k-1][0])>1e-6]
  if len(points)<2:continue
  sides=8;base=len(verts);normal=None
  for k,(pt,r) in enumerate(points):
   a,b2=points[max(0,k-1)][0],points[min(len(points)-1,k+1)][0];t=[b2[x]-a[x] for x in range(3)];tl=math.hypot(*t) or 1;t=[x/tl for x in t]
   if normal is None:normal=[0,0,1] if abs(t[2])<.9 else [1,0,0]
   d=sum(normal[x]*t[x] for x in range(3));normal=[normal[x]-d*t[x] for x in range(3)];nl=math.hypot(*normal) or 1;normal=[x/nl for x in normal]
   bino=[t[1]*normal[2]-t[2]*normal[1],t[2]*normal[0]-t[0]*normal[2],t[0]*normal[1]-t[1]*normal[0]];radius=depth*(r if r>0 else 1)
   for s in range(sides):
    ang=2*math.pi*s/sides;verts.append(tuple(pt[x]+radius*(math.cos(ang)*normal[x]+math.sin(ang)*bino[x]) for x in range(3)))
  for k in range(len(points)-1):
   for s in range(sides):
    a,b2,c,d=base+k*sides+s,base+k*sides+(s+1)%sides,base+(k+1)*sides+s,base+(k+1)*sides+(s+1)%sides;tris+=[(a,c,b2),(b2,c,d)]
  for end,flip in((0,True),(len(points)-1,False)):
   centre=len(verts);verts.append(points[end][0])
   for s in range(sides):
    a,b2=base+end*sides+s,base+end*sides+(s+1)%sides;tris.append((centre,b2,a) if flip else (centre,a,b2))
 return verts,tris

# ---------- selection ----------
def members(collection):return {o for o in collections.get(collection,[]) if o}
def side(name):return {'l':'Left','r':'Right'}.get(name.rsplit('.',1)[1]) if re.search(r'\.[lr]$',name) else None
def base(name):
 b=re.sub(r'\.[lr]$','',name).strip()
 return b[1:-1].strip() if b.startswith('(') and b.endswith(')') else b
NONCOMMERCIAL=re.compile(r'cochle|labyrinth|semicircular|vestibul|utricle|saccule|endolymph|perilymph|spiral|kidney|renal|nephron',re.I)
FAMILIES=[
 ('lymphatic','6: Lymphoid organs',re.compile(r'\bnodes?\b',re.I)),
 ('connective','3: Joints',re.compile(r'ligament|capsule|menisc|disc\b|nucleus pulposus|labrum|membrane|syndesmosis|symphysis|plate|cartilage',re.I)),
 ('connective','4: Muscular system',re.compile(r'bursa|sheath|fascia|retinacul|aponeurosis|ligament|arch|tract|septum',re.I)),
 ('muscular','4: Muscular system',re.compile(r'muscle|muscles|\b(masseter|platysma|buccinator|procerus|risorius|nasalis|diaphragm|levator|depressor|orbicularis|corrugator|zygomaticus|mentalis|occipitalis|frontalis|auricularis|temporoparietalis|interspinales|intertransversarii|rotatores|multifidus|semispinalis|spinalis|longissimus|iliocostalis|splenius|scalenus|longus|rectus|obliquus|levatores)\b',re.I)),
 ('nervous','7: Nervous system & Sense organs',re.compile(r'nerve|nerves|plexus|ganglion|ganglia|trunk|branch|branches|root|ramus|rami|cord of|division|chorda|ansa',re.I)),
 ('digestive','8: Visceral systems',re.compile(r'parotid|submandibular|sublingual',re.I)),
]
EXCLUDE=re.compile(r'intervertebral disc|anulus fibrosus|gyrus|sulcus|lobe|cortex|tract$|nucleus of|fasciculus|lemniscus|commissure|choroid plexus|pyramid|pyramis',re.I)
# BodyParts3D already models these muscles under other names (cervicis/colli, parts/heads, sets).
OURMUSCLES=re.compile(r'external abdominal oblique|pectoralis major|deltoid|digastric|interossei|lumbrical|interspinales|intertransversarii|levatores .*costarum|longus colli|longissimus colli|iliocostalis colli|semispinalis colli|splenius colli|spinalis colli|rotatores|arytenoid|pubo-analis|tendon of',re.I)
ours=json.loads((Path(__file__).resolve().parents[1]/'public/models/atlas.json').read_text())
def norm(s):
 s=re.sub(r'\s*\([IVX]+\)','',s.lower(),flags=re.I);s=re.sub(r'\b(left|right|of|the|muscle|muscles|proper|bone|human|nerve)\b',' ',s);return ' '.join(sorted(re.sub(r'[^a-z0-9 ]',' ',s).split()))
known={norm(x['name']) for x in ours['parts']}|{norm(x['name']) for x in ours['concepts']}
byname={o['name']:o for o in objects};chosen={}
for system,collection,pattern in FAMILIES:
 for name in members(collection):
  o=byname.get(name)
  if not o or o['type'] not in(1,2) or not o['data'] or not re.search(r'\.[lr]$|^[^.]+$',name):continue
  b=base(name)
  if not pattern.search(b) or EXCLUDE.search(b) or NONCOMMERCIAL.search(b) or norm(b) in known or name in chosen:continue
  if system=='muscular' and OURMUSCLES.search(b):continue
  chosen[name]=system

# ---------- names (TA2 Spanish, CC BY-SA 4.0 via Z-Anatomy) ----------
ta2={}
for line in Path(sys.argv[2]).read_text(encoding='utf-8-sig').splitlines():
 cells=line.strip().strip('"').split(';')
 if len(cells)>=5 and cells[0].isdigit():ta2.setdefault(cells[1].strip().lower(),(cells[0],cells[4].strip()))
# Terms TA2.csv lacks; translated for this viewer.
MANUAL_ES={'articular capsule of elbow joint':'cápsula articular de la articulación del codo','articular capsule of knee joint':'cápsula articular de la rodilla',
 'articular capsule of radiocarpal joint':'cápsula articular de la articulación radiocarpiana','articular capsules of metacarpophalangeal joints':'cápsulas articulares de las articulaciones metacarpofalángicas',
 'cruciform part of fibrous sheath of digit of hand':'porción cruciforme de la vaina fibrosa de los dedos de la mano','subfacial prepatellar bursa':'bolsa prerrotuliana subfascial',
 'tendon sheath of extensors carpi radialis':'vaina tendinosa de los extensores radiales del carpo','tendon sheath of tibialis anterior':'vaina tendinosa del tibial anterior',
 'trochanteric bursa of gluteus medius muscle':'bolsa trocantérea del glúteo medio'}
def spanish(term):
 if term.lower() in MANUAL_ES:return MANUAL_ES[term.lower()]
 hit=ta2.get(term.lower()) or ta2.get(f'({term})'.lower())
 if not hit or not hit[1]:return None
 es=hit[1].strip();es=es[1:-1] if es.startswith('(') and es.endswith(')') else es
 # TA2 says "nodo"; Rioplatense and clinical Spanish say "ganglio" for a lymph node.
 es=re.sub(r'^(N|n)odo(s?)\b',lambda m:'ganglio'+m[2],es)
 return es[:1].lower()+es[1:]
def sided_es(es,s):
 if not s:return es
 head=es.split(' ')[0].lower();plural=head.endswith('s')
 fem=head.rstrip('s').endswith(('a','ión','ione','dad','sis','iz')) and head not in('sistema','sistemas')
 word=('izquierda' if s=='Left' else 'derecha') if fem else ('izquierdo' if s=='Left' else 'derecho')
 return f'{es} {word}{"s" if plural else ""}'

# ---------- stage transform ----------
# Z-Anatomy keeps BodyParts3D's frame in meters with Z up, but its bones were remodeled (femur
# 1.2 cm shorter, humerus 1 cm longer, ...). A single translation leaves pieces up to 2.4 cm off,
# so every vertex is moved with a smooth bone-anchored warp: each bone present in both datasets
# maps its Z-Anatomy box onto our BodyParts3D box (per-axis scale and offset), and a vertex blends
# the nearby bone maps by inverse distance to their boxes.
def apply(m,q):return tuple(m[k]*q[0]+m[4+k]*q[1]+m[8+k]*q[2]+m[12+k] for k in range(3))
def stage0(q):return (q[0],q[2],-q[1])
ORD=['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth','eleventh','twelfth']
TOES=['big toe','second toe','third toe','fourth toe','little toe'];FINGERS=['thumb','index finger','middle finger','ring finger','little finger']
def our_bone_name(zname):
 s=side(zname);b=base(zname);word=(s or '').lower()
 m=re.match(r'Vertebra ([CTL])(\d+)$',b)
 if m:return f"{ORD[int(m[2])-1]} {dict(C='cervical',T='thoracic',L='lumbar')[m[1]]} vertebra"
 m=re.match(r'(Distal|Middle|Proximal) phalanx of (\w+) finger of (foot|hand)$',b)
 if m and s:return f"{m[1]} phalanx of {word} {(TOES if m[3]=='foot' else FINGERS)[ORD.index(m[2])]}"
 if b=='Navicular bone' and s:return f'navicular bone of {word} foot'
 b={'Triquetrum bone':'triquetral','Inferior nasal concha bone':'inferior nasal concha'}.get(b,b)
 return f'{word} {b[:1].lower()+b[1:]}'.strip()
def box(points):return [min(q[k] for q in points) for k in range(3)],[max(q[k] for q in points) for k in range(3)]
ourbones={x['name'].lower():x['bounds'] for x in ours['parts'] if x['system']=='skeletal'}
anchors=[]
for name in members('1: Skeletal system'):
 o=byname.get(name)
 if not o or o['type']!=1 or not o['data'] or not re.search(r'\.[lr]$|^[^.()]+$',name):continue
 target=ourbones.get(our_bone_name(name).lower())
 if not target:continue
 v,_=mesh_geometry(o['data'])
 if not v:continue
 lo,hi=box([stage0(apply(o['matrix'],q)) for q in v]);scale=[];offset=[]
 for k in range(3):
  zs,os_=hi[k]-lo[k],target[1][k]-target[0][k];s=min(1.25,max(.8,os_/zs)) if zs>.01 and os_>.01 else 1
  scale.append(s);offset.append((target[0][k]+target[1][k])/2-s*(lo[k]+hi[k])/2)
 anchors.append((lo,hi,scale,offset,name))
def gap(p,lo,hi):return math.sqrt(sum(max(lo[k]-p[k],0,p[k]-hi[k])**2 for k in range(3)))
def warp(points):
 plo,phi=box(points);near=sorted(anchors,key=lambda a:gap([(plo[k]+phi[k])/2 for k in range(3)],a[0],a[1]))
 reach=max(.03,max(phi[k]-plo[k] for k in range(3))/2);local=[a for a in near if gap([(plo[k]+phi[k])/2 for k in range(3)],a[0],a[1])<=reach+.03] or near[:6]
 local=local if len(local)>=6 else near[:6];out=[]
 for p in points:
  tw=0;acc=[0.,0.,0.]
  for lo,hi,s,o,_ in local:
   w=1/(gap(p,lo,hi)+.004)**3;tw+=w
   for k in range(3):acc[k]+=w*(s[k]*p[k]+o[k])
  out.append(tuple(a/tw for a in acc))
 return out
residual=[]
for lo,hi,s,o,name in anchors:
 c=[(lo[k]+hi[k])/2 for k in range(3)];t=ourbones[our_bone_name(name).lower()]
 residual.append(math.dist(warp([c])[0],[(t[0][k]+t[1][k])/2 for k in range(3)]))
fit_pairs,fit_error=len(anchors),max(residual)

# ---------- write ----------
out=Path(__file__).resolve().parents[1]/'public/models';chunks=[];blob=bytearray();parts=[];concepts={};namesEs={};triangles=0
for stale in out.glob('source-zanatomy-*.bin'):stale.unlink()
def flush():
 global blob
 if not blob:return
 url=f'/models/source-zanatomy-{len(chunks)}.bin';(out/url.split('/')[-1]).write_bytes(blob);chunks.append({'url':url,'bytes':len(blob)});blob=bytearray()
def append(values):
 while len(blob)%4:blob.append(0)
 offset=len(blob);blob.extend(values.tobytes());return offset
def slug(s):return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
for name in sorted(chosen):
 o=byname[name];verts,tris=(mesh_geometry if o['type']==1 else curve_geometry)(o['data'])
 if not tris:continue
 m=o['matrix'];det=m[0]*(m[5]*m[10]-m[6]*m[9])-m[4]*(m[1]*m[10]-m[2]*m[9])+m[8]*(m[1]*m[6]-m[2]*m[5])
 w=warp([stage0(apply(m,q)) for q in verts])
 if det<0:tris=[(a,c,b) for a,b,c in tris]
 # Area-weighted smooth normals; the stage map is a proper rotation, so winding is preserved.
 acc=[[0.,0.,0.] for _ in w]
 for a,b,c in tris:
  u=[w[b][k]-w[a][k] for k in range(3)];v=[w[c][k]-w[a][k] for k in range(3)];n=(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])
  for i in(a,b,c):
   for k in range(3):acc[i][k]+=n[k]
 normals=array('h')
 for n in acc:
  l=math.hypot(*n) or 1;normals.extend(max(-32767,min(32767,round(x/l*32767))) for x in n)
 positions=array('f',[x for q in w for x in q]);indices=array('I',[i for t in tris for i in t])
 s,b=side(name),base(name);label=f'{s} {b[:1].lower()+b[1:]}' if s else b;ta=ta2.get(b.lower()) or ta2.get(f'({b})'.lower())
 es=spanish(b)
 if es:namesEs[label.lower()]=sided_es(es,s);namesEs[b.lower()]=es
 if len(blob)>6_000_000:flush()
 pid='ZA:'+slug(name);conceptId=f'TA2:{ta[0]}' if ta else pid
 parts.append({'id':pid,'name':label,'conceptId':conceptId,'system':chosen[name],'source':'zanatomy','chunk':len(chunks),'positions':append(positions),'normals':append(normals),'indices':append(indices),'vertexCount':len(w),'indexCount':len(indices),'bounds':[[min(positions[k::3]) for k in range(3)],[max(positions[k::3]) for k in range(3)]]})
 triangles+=len(tris)
 concepts.setdefault(b,{'id':conceptId,'name':b,'elements':[]})['elements'].append(pid)
 if s:concepts[label]={'id':pid,'name':label,'elements':[pid]}
flush()
atlas={'version':'Z-Anatomy (Startup.blend, Blender 3.5 template)','sex':'male','source':'Z-Anatomy','license':'CC BY-SA 4.0','scope':'Optional supplement: structures missing from BodyParts3D','parts':parts,'concepts':list(concepts.values()),'chunks':chunks,'triangles':triangles,'namesEs':namesEs}
(out/'atlas-zanatomy.json').write_text(json.dumps(atlas,separators=(',',':'),ensure_ascii=False),encoding='utf-8')
from collections import Counter
print(json.dumps({'parts':len(parts),'concepts':len(concepts),'triangles':triangles,'bytes':sum(c['bytes'] for c in chunks),'systems':Counter(p['system'] for p in parts),'spanish':sum(1 for p in parts if p['name'].lower() in namesEs),'anchorBones':fit_pairs,'anchorCentreError':round(fit_error,4)}))
