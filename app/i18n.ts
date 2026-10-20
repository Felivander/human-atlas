import type {SystemId,View} from './anatomy';
export type Lang='es'|'en';
export const LANGS:Lang[]=['en','es'];
const STORAGE_KEY='human-atlas-lang';
export function initialLang():Lang{try{const saved=localStorage.getItem(STORAGE_KEY);if(saved==='es'||saved==='en')return saved;}catch{/* Storage can be unavailable; fall back to Spanish. */}return 'es';}
export function saveLang(lang:Lang){try{localStorage.setItem(STORAGE_KEY,lang);}catch{/* Preference is a convenience only. */}}

const en={
 languageName:'English',switchTo:'Switch to English',languageGroup:'Language',
 eyebrow:'INTERACTIVE ANATOMY',modeledPieces:'modeled pieces',
 explorerPanels:'Explorer panels',searchAnatomy:'Search anatomy',findStructure:'Find a structure',aboutAtlas:'About this atlas',
 layersLabel:'Anatomical layers',systems:'Systems',closeSystems:'Close systems',all:'All',skeleton:'Skeleton',organs:'Organs',
 showOnly:(s:string)=>`Show only ${s}`,show:(s:string)=>`Show ${s}`,piecesVisible:'pieces visible',hideAll:'Hide all',
 findAnatomy:'Find anatomy',closeSearch:'Close search',searchPlaceholder:'Heart, femur, cranial nerve…',searchLabel:'Search named anatomical structures',
 noMatches:'No structures match your search.',piece:'piece',pieces:'pieces',
 searchNoteQuery:'Showing up to 80 matches. Refine your search to find smaller structures.',searchNoteEmpty:'Start with a major organ, or search every named structure.',
 cameraControls:'Camera controls',views:{'three-quarter':'Three-quarter view',front:'Front view',side:'Side view',back:'Back view'} as Record<View,string>,viewKeys:['¾','F','S','B'],
 pauseRotation:'Pause rotation',rotateBody:'Rotate body',autoRotate:'Auto rotate',resetAll:'Reset view and layers',reset:'Reset',
 selectedStructure:'SELECTED STRUCTURE',inventory:'ANATOMICAL INVENTORY',separated:'SEPARATED STRUCTURES',adultMale:'ADULT HUMAN · MALE',
 openLayers:'Open system layers',explode:'Explode anatomy',assembled:'Assembled',everyPiece:'Every piece',assembleReset:'Assemble and reset',
 dragPan:'Drag to pan',dragOrbit:'Drag to orbit',pinch:'Pinch to zoom',tap:'Tap to inspect',credits:'Source & credits',
 preparing:'Preparing the anatomy',loading:'Loading',reload:'Reload viewer',
 anatomy:'ANATOMY',contextNote:'System overview · structure identified from source anatomy',atlasRef:'Atlas reference',selectedPieces:'Selected pieces',
 included:'Included structures',andMore:(n:number)=>`And ${n} more modeled pieces.`,viewSource:'View anatomical source',
 showSurrounding:'Show surrounding anatomy',isolate:'Isolate structure',clearSelection:'Clear selection',
 aboutEyebrow:'SOURCE & SCOPE',aboutTitle:'A body, revealed.',aboutDescription:'Explore the adult male reference anatomy from BodyParts3D.',
 aboutScopeTitle:'Male · BodyParts3D',aboutScope:'2,234 individual meshes and 3,432 named concepts from an adult male reference anatomy.',
 aboutLimits:'This reference does not contain every human structure or variation. Named concepts can contain multiple pieces; each source mesh is rendered once.',
 aboutUse:'Colors and system groupings are designed for exploration. The geometry is simplified for the web, and short explanations provide general educational context. This is an anatomical reference, not a diagnostic or surgical tool.',
 sourceHeading:'Source',sourceText:'BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.',
 datasetLicense:'Dataset license',originalGeometry:'Original geometry & metadata',publication:'Read the source publication',
};
export type Strings=typeof en;
const es:Strings={
 languageName:'Español',switchTo:'Cambiar a español',languageGroup:'Idioma',
 eyebrow:'ANATOMÍA INTERACTIVA',modeledPieces:'piezas modeladas',
 explorerPanels:'Paneles del explorador',searchAnatomy:'Buscar anatomía',findStructure:'Buscar una estructura',aboutAtlas:'Acerca de este atlas',
 layersLabel:'Capas anatómicas',systems:'Sistemas',closeSystems:'Cerrar sistemas',all:'Todo',skeleton:'Esqueleto',organs:'Órganos',
 showOnly:s=>`Mostrar solo ${s}`,show:s=>`Mostrar ${s}`,piecesVisible:'piezas visibles',hideAll:'Ocultar todo',
 findAnatomy:'Buscar anatomía',closeSearch:'Cerrar búsqueda',searchPlaceholder:'Corazón, fémur, nervio craneal…',searchLabel:'Buscar estructuras anatómicas por nombre',
 noMatches:'Ninguna estructura coincide con la búsqueda.',piece:'pieza',pieces:'piezas',
 searchNoteQuery:'Se muestran hasta 80 resultados. Afiná la búsqueda para encontrar estructuras más pequeñas.',searchNoteEmpty:'Empezá por un órgano principal o buscá cualquier estructura con nombre.',
 cameraControls:'Controles de cámara',views:{'three-quarter':'Vista de tres cuartos',front:'Vista frontal',side:'Vista lateral',back:'Vista posterior'},viewKeys:['¾','F','L','P'],
 pauseRotation:'Pausar rotación',rotateBody:'Rotar el cuerpo',autoRotate:'Rotación automática',resetAll:'Restablecer vista y capas',reset:'Restablecer',
 selectedStructure:'ESTRUCTURA SELECCIONADA',inventory:'INVENTARIO ANATÓMICO',separated:'ESTRUCTURAS SEPARADAS',adultMale:'HUMANO ADULTO · MASCULINO',
 openLayers:'Abrir capas de sistemas',explode:'Separar anatomía',assembled:'Ensamblado',everyPiece:'Cada pieza',assembleReset:'Ensamblar y restablecer',
 dragPan:'Arrastrar para desplazar',dragOrbit:'Arrastrar para orbitar',pinch:'Pellizcar para hacer zoom',tap:'Tocar para inspeccionar',credits:'Fuente y créditos',
 preparing:'Preparando la anatomía',loading:'Cargando',reload:'Recargar visor',
 anatomy:'ANATOMÍA',contextNote:'Resumen del sistema · estructura identificada en la anatomía de origen',atlasRef:'Referencia del atlas',selectedPieces:'Piezas seleccionadas',
 included:'Estructuras incluidas',andMore:n=>`Y ${n} piezas modeladas más.`,viewSource:'Ver fuente anatómica',
 showSurrounding:'Mostrar anatomía circundante',isolate:'Aislar estructura',clearSelection:'Quitar selección',
 aboutEyebrow:'FUENTE Y ALCANCE',aboutTitle:'Un cuerpo, revelado.',aboutDescription:'Explorá la anatomía de referencia de un hombre adulto de BodyParts3D.',
 aboutScopeTitle:'Masculino · BodyParts3D',aboutScope:'2.234 mallas individuales y 3.432 conceptos con nombre de una anatomía de referencia de un hombre adulto.',
 aboutLimits:'Esta referencia no contiene todas las estructuras ni variaciones humanas. Un concepto con nombre puede abarcar varias piezas; cada malla de origen se dibuja una sola vez.',
 aboutUse:'Los colores y la agrupación por sistemas están pensados para explorar. La geometría está simplificada para la web y las explicaciones breves ofrecen un contexto educativo general. Es una referencia anatómica, no una herramienta de diagnóstico ni quirúrgica.',
 sourceHeading:'Fuente',sourceText:'BodyParts3D, © The Database Center for Life Science, con licencia CC Attribution 4.0 International.',
 datasetLicense:'Licencia del conjunto de datos',originalGeometry:'Geometría y metadatos originales',publication:'Leer la publicación de origen',
};
export const STRINGS:Record<Lang,Strings>={en,es};

const ERRORS_ES:Record<string,string>={
 'The anatomy catalogue could not be loaded.':'No se pudo cargar el catálogo anatómico.',
 'This browser could not start the 3D viewer. Please try a browser with WebGL enabled.':'Este navegador no pudo iniciar el visor 3D. Probá con un navegador que tenga WebGL activado.',
 'Could not load the anatomy.':'No se pudo cargar la anatomía.',
 'Could not assemble anatomy geometry.':'No se pudo armar la geometría anatómica.',
 'An anatomy file could not be loaded.':'No se pudo cargar un archivo anatómico.',
 'An anatomy file was incomplete. Please reload the viewer.':'Un archivo anatómico llegó incompleto. Recargá el visor.',
 'The 3D session was paused by your device. Reload to continue.':'Tu dispositivo pausó la sesión 3D. Recargá para continuar.',
};
export function translateError(message:string,lang:Lang){return lang==='es'?ERRORS_ES[message]??message:message;}

export const SYSTEMS_ES:Record<SystemId,{name:string;description:string}>={
 skeletal:{name:'Esqueleto',description:'Los huesos forman el armazón que sostiene el cuerpo, protegen los órganos y ofrecen puntos de inserción a los músculos. Su tejido interno también almacena minerales y produce células sanguíneas.'},
 muscular:{name:'Músculos',description:'Los músculos esqueléticos generan movimiento al traccionar de sus inserciones. Junto con los tendones mueven las articulaciones, estabilizan la postura y producen calor.'},
 cardiac:{name:'Corazón',description:'El corazón es una bomba muscular de cuatro cavidades. Sus válvulas dirigen la sangre hacia adelante por los circuitos pulmonar y sistémico.'},
 sensory:{name:'Órganos sensoriales',description:'Estas estructuras participan en los sentidos especiales, como la vista, la audición y el equilibrio. Sus tejidos especializados detectan estímulos y trabajan con el sistema nervioso para transmitir información.'},
 arterial:{name:'Arterias',description:'El corazón impulsa la sangre por la circulación. Las arterias llevan la sangre desde el corazón para irrigar los tejidos o, en el circuito pulmonar, hacia los pulmones.'},
 venous:{name:'Venas',description:'Las venas devuelven la sangre al corazón. Redes superficiales y profundas recogen la sangre de los tejidos; las venas pulmonares traen sangre oxigenada desde los pulmones.'},
 nervous:{name:'Sistema nervioso',description:'El encéfalo, la médula espinal y los nervios periféricos transmiten y procesan señales. Sostienen la sensibilidad, el movimiento, la coordinación y la regulación automática de las funciones del cuerpo.'},
 respiratory:{name:'Respiratorio',description:'Las vías aéreas conducen el aire hasta los pulmones, donde el oxígeno y el dióxido de carbono pasan entre el aire y la sangre. La respiración depende de cambios de presión que producen los músculos respiratorios.'},
 digestive:{name:'Digestivo',description:'El tubo digestivo descompone los alimentos, absorbe nutrientes y agua, y hace avanzar los desechos. Los órganos anexos aportan bilis y enzimas digestivas.'},
 urinary:{name:'Urinario',description:'Los riñones filtran la sangre y regulan el equilibrio de líquidos, electrolitos y ácido–base. La orina viaja por los uréteres hasta la vejiga y sale por la uretra.'},
 lymphatic:{name:'Linfático',description:'Los vasos linfáticos devuelven a la circulación el exceso de líquido de los tejidos. Los ganglios y otros órganos linfoides sostienen la vigilancia y la respuesta inmunitaria.'},
 endocrine:{name:'Endocrino',description:'Los órganos endocrinos liberan hormonas a la sangre para coordinar procesos como el metabolismo, el crecimiento, la respuesta al estrés y la reproducción.'},
 reproductive:{name:'Reproductor',description:'Las estructuras reproductoras masculinas representadas aquí participan en la producción, maduración y transporte de espermatozoides, y en la producción de hormonas sexuales.'},
 integumentary:{name:'Superficie corporal',description:'La superficie corporal ofrece una referencia anatómica exterior. El sistema tegumentario forma una barrera protectora y participa en la sensibilidad y la regulación de la temperatura.'},
 connective:{name:'Tejido conectivo',description:'El cartílago, los ligamentos y otros tejidos conectivos sostienen, unen y separan estructuras. Entre sus funciones están estabilizar las articulaciones y repartir las cargas mecánicas.'},
};
export const EXPLANATIONS_ES:Record<string,string>={
 'heart':'Una bomba muscular en el tórax. Su lado derecho envía sangre a los pulmones; su lado izquierdo la envía por la circulación sistémica.',
 'liver':'Un órgano grande debajo del lado derecho del diafragma. Procesa los nutrientes absorbidos, produce bilis y sintetiza muchas de las proteínas que circulan en la sangre.',
 'brain':'El órgano central del sistema nervioso. Sus regiones interconectadas sostienen la percepción, el movimiento, la memoria, el lenguaje y la regulación de las funciones corporales.',
 'stomach':'Una cavidad muscular entre el esófago y el intestino delgado. Almacena y mezcla el alimento con ácido y enzimas antes de liberarlo al duodeno.',
 'spleen':'Un órgano linfoide en la parte superior izquierda del abdomen. Filtra la sangre, elimina glóbulos envejecidos y participa en la respuesta inmunitaria.',
 'pancreas':'Un órgano abdominal con funciones digestivas y endocrinas. Aporta enzimas al intestino delgado y libera hormonas como la insulina y el glucagón.',
 'urinary bladder':'Un reservorio muscular en la pelvis que almacena la orina que llega desde los riñones por los uréteres.',
 'trachea':'La vía aérea principal que une la laringe con los bronquios. Sus anillos de cartílago mantienen la vía abierta durante la respiración.',
 'diaphragm':'Un músculo amplio que separa el tórax del abdomen. Al contraerse aumenta el volumen del tórax y ayuda a que el aire entre en los pulmones.',
};
/** Spanish names for common structures; the rest of the catalogue keeps its source (English) name. */
export const NAMES_ES:Record<string,string>={
 'heart':'corazón','brain':'encéfalo','liver':'hígado','stomach':'estómago','spleen':'bazo','pancreas':'páncreas','urinary bladder':'vejiga urinaria','trachea':'tráquea','diaphragm':'diafragma','esophagus':'esófago',
 'kidney':'riñón','right kidney':'riñón derecho','left kidney':'riñón izquierdo','right lung':'pulmón derecho','left lung':'pulmón izquierdo',
 'femur':'fémur','right femur':'fémur derecho','left femur':'fémur izquierdo','tibia':'tibia','fibula':'peroné','humerus':'húmero','radius':'radio','ulna':'cúbito','skull':'cráneo','mandible':'mandíbula','sternum':'esternón','sacrum':'sacro',
 'hip bone':'hueso coxal','right hip bone':'hueso coxal derecho','scapula':'escápula','clavicle':'clavícula','patella':'rótula','vertebral column':'columna vertebral','spinal cord':'médula espinal','cerebellum':'cerebelo','brainstem':'tronco encefálico',
 'small intestine':'intestino delgado','large intestine':'intestino grueso','duodenum':'duodeno','jejunum':'yeyuno','ileum':'íleon','rectum':'recto','cecum':'ciego','gallbladder':'vesícula biliar','aorta':'aorta',
 'prostate':'próstata','testis':'testículo','right eyeball':'globo ocular derecho','tongue':'lengua','ureter':'uréter','urethra':'uretra','skin':'piel','thymus':'timo','rib':'costilla',
 'skeletal system':'sistema esquelético','gastrointestinal tract':'tubo digestivo',
};
export function structureName(name:string,lang:Lang){return lang==='es'?NAMES_ES[name.toLowerCase()]??name:name;}

export interface TutorialStep {title:string;body:string;touch?:string}
export const TUTORIAL:Record<Lang,{open:string;label:string;skip:string;back:string;next:string;done:string;step:(i:number,n:number)=>string;steps:TutorialStep[]}>={
 en:{open:'How to use',label:'Quick tutorial',skip:'Skip',back:'Back',next:'Next',done:'Start exploring',step:(i,n)=>`Step ${i} of ${n}`,steps:[
  {title:'Welcome to Human Atlas',body:'Explore more than 2,000 pieces of an adult male body in 3D. This quick tour shows the basics; you can reopen it any time from “How to use”.'},
  {title:'Move around the body',body:'Drag to rotate, use the scroll wheel to zoom, and right-click and drag to pan.',touch:'Drag with one finger to rotate, pinch to zoom, and drag with two fingers to pan.'},
  {title:'Inspect any structure',body:'Click a bone, muscle or organ to see its name and a short explanation. From that card you can isolate it to see it on its own.',touch:'Tap a bone, muscle or organ to see its name and a short explanation. From that card you can isolate it to see it on its own.'},
  {title:'Turn systems on and off',body:'Use the Systems panel on the left to show or hide layers like the skeleton, muscles, arteries or organs. Click a system’s name to show only that one.',touch:'Tap Systems in the bottom bar to show or hide layers like the skeleton, muscles, arteries or organs.'},
  {title:'Search by name',body:'Use “Find a structure” (or press /) to jump straight to the heart, the femur, or any of the 3,432 named structures.',touch:'Tap the magnifier at the top right to jump straight to the heart, the femur, or any of the 3,432 named structures.'},
  {title:'Take the body apart',body:'Move the “Explode anatomy” slider to separate every piece. The ¾, F, S and B buttons change the camera angle, and Reset puts everything back.'},
 ]},
 es:{open:'Cómo usar',label:'Tutorial rápido',skip:'Saltar',back:'Atrás',next:'Siguiente',done:'Empezar a explorar',step:(i,n)=>`Paso ${i} de ${n}`,steps:[
  {title:'Bienvenido a Human Atlas',body:'Explorá más de 2.000 piezas del cuerpo de un hombre adulto en 3D. Este recorrido rápido muestra lo básico; podés volver a abrirlo cuando quieras desde “Cómo usar”.'},
  {title:'Mové el cuerpo',body:'Arrastrá para girarlo, usá la rueda del mouse para hacer zoom y arrastrá con clic derecho para desplazarlo.',touch:'Arrastrá con un dedo para girarlo, pellizcá para hacer zoom y arrastrá con dos dedos para desplazarlo.'},
  {title:'Inspeccioná cualquier estructura',body:'Hacé clic en un hueso, músculo u órgano para ver su nombre y una explicación breve. Desde esa ficha podés aislarlo para verlo solo.',touch:'Tocá un hueso, músculo u órgano para ver su nombre y una explicación breve. Desde esa ficha podés aislarlo para verlo solo.'},
  {title:'Prendé y apagá sistemas',body:'En el panel Sistemas, a la izquierda, mostrá u ocultá capas como el esqueleto, los músculos, las arterias o los órganos. Hacé clic en el nombre de un sistema para ver solo ese.',touch:'Tocá Sistemas en la barra inferior para mostrar u ocultar capas como el esqueleto, los músculos, las arterias o los órganos.'},
  {title:'Buscá por nombre',body:'Usá “Buscar una estructura” (o la tecla /) para ir directo al corazón, al fémur o a cualquiera de las 3.432 estructuras con nombre.',touch:'Tocá la lupa arriba a la derecha para ir directo al corazón, al fémur o a cualquiera de las 3.432 estructuras con nombre.'},
  {title:'Desarmá el cuerpo',body:'Mové el control “Separar anatomía” para separar cada pieza. Los botones ¾, F, L y P cambian el ángulo de la cámara, y Restablecer vuelve todo a su lugar.'},
 ]},
};
