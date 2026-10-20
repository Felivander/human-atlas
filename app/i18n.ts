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
 chooseSex:'Choose male or female anatomy',male:'Male',female:'Female',adultFemale:'FEMALE · REFERENCE ANATOMY',partialCoverage:'Partial skeleton and muscles',selectedStructure:'SELECTED STRUCTURE',inventory:'ANATOMICAL INVENTORY',separated:'SEPARATED STRUCTURES',adultMale:'ADULT HUMAN · MALE',
 openLayers:'Open system layers',explode:'Explode anatomy',assembled:'Assembled',everyPiece:'Every piece',assembleReset:'Assemble and reset',
 dragPan:'Drag to pan',dragOrbit:'Drag to orbit',pinch:'Pinch to zoom',tap:'Tap to inspect',credits:'Source & credits',
 canvasLabel:'Interactive human anatomy. Drag to orbit, pinch or scroll to zoom, and tap a structure to inspect it.',preparing:'Preparing the anatomy',loading:'Loading',reload:'Reload viewer',
 anatomy:'ANATOMY',contextNote:'System overview · structure identified from source anatomy',atlasRef:'Atlas reference',selectedPieces:'Selected pieces',
 included:'Included structures',andMore:(n:number)=>`And ${n} more modeled pieces.`,viewSource:'View anatomical source',
 showSurrounding:'Show surrounding anatomy',isolate:'Isolate structure',clearSelection:'Clear selection',
 aboutEyebrow:'SOURCE & SCOPE',aboutTitle:'A body, revealed.',aboutDescription:'Explore anatomy from two independent, licensed reference collections.',
 aboutScopeTitle:'Male · BodyParts3D',aboutScope:'2,234 individual meshes and 3,432 named concepts from an adult male reference anatomy.',
 aboutLimits:'Neither reference contains every human structure or variation. Named concepts can contain multiple pieces; each source mesh is rendered once.',
 aboutUse:'Colors and system groupings are designed for exploration. The geometry is simplified for the web, and short explanations provide general educational context. This is an anatomical reference, not a diagnostic or surgical tool.',
 aboutFemaleTitle:'Female · Human Reference Atlas',aboutFemale:'964 source meshes, including the whole-body surface, selected organs, the mouth and teeth, the sternum and intervertebral disks, and female reproductive anatomy. Skeleton and muscle coverage is partial. Eight pregnancy reference pieces are in a separate layer, hidden by default.',aboutCollections:'The two collections come from different sources and have different coverage.',sourceHeading:'Sources',sourceText:'BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.',femaleSourceText:'Kristen Browne and Heidi Schlehlein, Human Reference Atlas / HuBMAP, united-female v1.10 (2026) and pelvis-female v1.3, licensed under CC BY 4.0.',femaleDataset:'Female reference dataset',
 datasetLicense:'Dataset license',originalGeometry:'Original geometry & metadata',publication:'Read the source publication',
 extraLayer:'Extra detail',extraLayerHint:'Lymph nodes, ligaments, nerves, facial muscles · Z-Anatomy, CC BY-SA',extraSource:'Z-Anatomy · CC BY-SA 4.0',
 extraTitle:'Optional extra detail · Z-Anatomy',extraText:'An optional layer for the male model adds about 1,000 structures missing from BodyParts3D: lymph nodes, ligaments, joint capsules and menisci, bursae and tendon sheaths, peripheral nerves, facial, masticatory and abdominal muscles, and salivary glands. It is adapted from Z-Anatomy (Gauthier Kervyn and contributors), itself derived from BodyParts3D: pieces were fitted to this skeleton, nerves were rebuilt as tubes, and Spanish names come from its TA2 terminology (Spanish translation by Carlos Torres Villar). The layer files are shared under CC BY-SA 4.0; Z-Anatomy’s non-commercial pieces are not included.',extraDataset:'Z-Anatomy repository',
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
 chooseSex:'Elegir anatomía masculina o femenina',male:'Masculino',female:'Femenino',adultFemale:'FEMENINO · ANATOMÍA DE REFERENCIA',partialCoverage:'Esqueleto y músculos parciales',selectedStructure:'ESTRUCTURA SELECCIONADA',inventory:'INVENTARIO ANATÓMICO',separated:'ESTRUCTURAS SEPARADAS',adultMale:'HUMANO ADULTO · MASCULINO',
 openLayers:'Abrir capas de sistemas',explode:'Separar anatomía',assembled:'Ensamblado',everyPiece:'Cada pieza',assembleReset:'Ensamblar y restablecer',
 dragPan:'Arrastrar para desplazar',dragOrbit:'Arrastrar para orbitar',pinch:'Pellizcar para hacer zoom',tap:'Tocar para inspeccionar',credits:'Fuente y créditos',
 canvasLabel:'Anatomía humana interactiva. Arrastrar para orbitar, pellizcar o usar la rueda para hacer zoom y tocar una estructura para inspeccionarla.',preparing:'Preparando la anatomía',loading:'Cargando',reload:'Recargar visor',
 anatomy:'ANATOMÍA',contextNote:'Resumen del sistema · estructura identificada en la anatomía de origen',atlasRef:'Referencia del atlas',selectedPieces:'Piezas seleccionadas',
 included:'Estructuras incluidas',andMore:n=>`Y ${n} piezas modeladas más.`,viewSource:'Ver fuente anatómica',
 showSurrounding:'Mostrar anatomía circundante',isolate:'Aislar estructura',clearSelection:'Quitar selección',
 aboutEyebrow:'FUENTE Y ALCANCE',aboutTitle:'Un cuerpo, revelado.',aboutDescription:'Explorá la anatomía de dos colecciones de referencia independientes y con licencia abierta.',
 aboutScopeTitle:'Masculino · BodyParts3D',aboutScope:'2.234 mallas individuales y 3.432 conceptos con nombre de una anatomía de referencia de un hombre adulto.',
 aboutLimits:'Ninguna de las dos referencias contiene todas las estructuras ni variaciones humanas. Un concepto con nombre puede abarcar varias piezas; cada malla de origen se dibuja una sola vez.',
 aboutUse:'Los colores y la agrupación por sistemas están pensados para explorar. La geometría está simplificada para la web y las explicaciones breves ofrecen un contexto educativo general. Es una referencia anatómica, no una herramienta de diagnóstico ni quirúrgica.',
 aboutFemaleTitle:'Femenino · Human Reference Atlas',aboutFemale:'964 mallas de origen, que incluyen la superficie corporal completa, órganos seleccionados, la boca y los dientes, el esternón y los discos intervertebrales, y la anatomía reproductora femenina. El esqueleto y los músculos están incompletos. Ocho piezas de referencia del embarazo están en una capa aparte, oculta por defecto.',aboutCollections:'Las dos colecciones provienen de fuentes distintas y tienen distinta cobertura.',sourceHeading:'Fuentes',sourceText:'BodyParts3D, © The Database Center for Life Science, con licencia CC Attribution 4.0 International.',femaleSourceText:'Kristen Browne y Heidi Schlehlein, Human Reference Atlas / HuBMAP, united-female v1.10 (2026) y pelvis-female v1.3, con licencia CC BY 4.0.',femaleDataset:'Conjunto de datos femenino de referencia',
 datasetLicense:'Licencia del conjunto de datos',originalGeometry:'Geometría y metadatos originales',publication:'Leer la publicación de origen',
 extraLayer:'Detalle extra',extraLayerHint:'Ganglios, ligamentos, nervios, músculos faciales · Z-Anatomy, CC BY-SA',extraSource:'Z-Anatomy · CC BY-SA 4.0',
 extraTitle:'Detalle extra opcional · Z-Anatomy',extraText:'Una capa opcional del modelo masculino suma unas 1.000 estructuras que no están en BodyParts3D: ganglios linfáticos, ligamentos, cápsulas articulares y meniscos, bolsas y vainas tendinosas, nervios periféricos, músculos faciales, masticadores y abdominales, y glándulas salivales. Está adaptada de Z-Anatomy (Gauthier Kervyn y colaboradores), que a su vez deriva de BodyParts3D: las piezas se ajustaron a este esqueleto, los nervios se reconstruyeron como tubos y los nombres en español vienen de su terminología TA2 (traducción de Carlos Torres Villar). Los archivos de esta capa se comparten con licencia CC BY-SA 4.0; no se incluyen las piezas no comerciales de Z-Anatomy.',extraDataset:'Repositorio de Z-Anatomy',
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
 pregnancy:{name:'Referencia de embarazo',description:'La placenta y el cordón umbilical permiten el intercambio entre la circulación materna y la fetal durante el embarazo. Estas estructuras de referencia se muestran aparte de la anatomía adulta por defecto.'},
 connective:{name:'Tejido conectivo',description:'El cartílago, los ligamentos y otros tejidos conectivos sostienen, unen y separan estructuras. Entre sus funciones están estabilizar las articulaciones y repartir las cargas mecánicas.'},
};
export const FEMALE_REPRODUCTIVE_ES='Las estructuras reproductoras femeninas incluyen los ovarios, las trompas uterinas, el útero, el cuello uterino y la vagina. Juntas participan en el desarrollo de los ovocitos, la fecundación, la menstruación y el embarazo.';
export const EXPLANATIONS_ES:Record<string,string>={
 'uterus':'Un órgano muscular hueco en la pelvis. Su revestimiento cambia a lo largo del ciclo menstrual y puede sostener la implantación y el desarrollo durante el embarazo.',
 'vagina':'Un conducto muscular que une el cuello del útero con el exterior del cuerpo. Es la vía del flujo menstrual y forma parte del canal de parto.',
 'ovary':'Un órgano que contiene ovocitos en desarrollo y produce hormonas como el estrógeno y la progesterona.',
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
/** Spanish names for every structure in both atlases, keyed by lowercase source name. Loaded on demand as its own chunk. */
export type NameMap=Record<string,string>;
let namesEs:Promise<NameMap>|null=null;
export function loadNamesEs(){return namesEs??=import('./names-es.json').then(m=>m.default as NameMap);}
export function structureName(name:string,lang:Lang,names:NameMap|null){return lang==='es'?names?.[name.trim().toLowerCase()]??name:name;}

export interface TutorialStep {title:string;body:string;touch?:string}
export const TUTORIAL:Record<Lang,{open:string;label:string;skip:string;back:string;next:string;done:string;step:(i:number,n:number)=>string;steps:TutorialStep[]}>={
 en:{open:'How to use',label:'Quick tutorial',skip:'Skip',back:'Back',next:'Next',done:'Start exploring',step:(i,n)=>`Step ${i} of ${n}`,steps:[
  {title:'Welcome to Human Atlas',body:'Explore the human body in 3D: a male model with more than 2,000 pieces and a female reference model. Switch between them at the top left. This quick tour shows the basics; you can reopen it any time from “How to use”.'},
  {title:'Move around the body',body:'Drag to rotate, use the scroll wheel to zoom, and right-click and drag to pan.',touch:'Drag with one finger to rotate, pinch to zoom, and drag with two fingers to pan.'},
  {title:'Inspect any structure',body:'Click a bone, muscle or organ to see its name and a short explanation. From that card you can isolate it to see it on its own.',touch:'Tap a bone, muscle or organ to see its name and a short explanation. From that card you can isolate it to see it on its own.'},
  {title:'Turn systems on and off',body:'Use the Systems panel on the left to show or hide layers like the skeleton, muscles, arteries or organs. Click a system’s name to show only that one.',touch:'Tap Systems in the bottom bar to show or hide layers like the skeleton, muscles, arteries or organs.'},
  {title:'Search by name',body:'Use “Find a structure” (or press /) to jump straight to the heart, the femur, or any of the 3,432 named structures.',touch:'Tap the magnifier at the top right to jump straight to the heart, the femur, or any of the 3,432 named structures.'},
  {title:'Take the body apart',body:'Move the “Explode anatomy” slider to separate every piece. The ¾, F, S and B buttons change the camera angle, and Reset puts everything back.'},
 ]},
 es:{open:'Cómo usar',label:'Tutorial rápido',skip:'Saltar',back:'Atrás',next:'Siguiente',done:'Empezar a explorar',step:(i,n)=>`Paso ${i} de ${n}`,steps:[
  {title:'Bienvenido a Human Atlas',body:'Explorá el cuerpo humano en 3D: un modelo masculino con más de 2.000 piezas y uno femenino de referencia. Cambiá entre ellos arriba a la izquierda. Este recorrido rápido muestra lo básico; podés volver a abrirlo cuando quieras desde “Cómo usar”.'},
  {title:'Mové el cuerpo',body:'Arrastrá para girarlo, usá la rueda del mouse para hacer zoom y arrastrá con clic derecho para desplazarlo.',touch:'Arrastrá con un dedo para girarlo, pellizcá para hacer zoom y arrastrá con dos dedos para desplazarlo.'},
  {title:'Inspeccioná cualquier estructura',body:'Hacé clic en un hueso, músculo u órgano para ver su nombre y una explicación breve. Desde esa ficha podés aislarlo para verlo solo.',touch:'Tocá un hueso, músculo u órgano para ver su nombre y una explicación breve. Desde esa ficha podés aislarlo para verlo solo.'},
  {title:'Prendé y apagá sistemas',body:'En el panel Sistemas, a la izquierda, mostrá u ocultá capas como el esqueleto, los músculos, las arterias o los órganos. Hacé clic en el nombre de un sistema para ver solo ese.',touch:'Tocá Sistemas en la barra inferior para mostrar u ocultar capas como el esqueleto, los músculos, las arterias o los órganos.'},
  {title:'Buscá por nombre',body:'Usá “Buscar una estructura” (o la tecla /) para ir directo al corazón, al fémur o a cualquiera de las 3.432 estructuras con nombre.',touch:'Tocá la lupa arriba a la derecha para ir directo al corazón, al fémur o a cualquiera de las 3.432 estructuras con nombre.'},
  {title:'Desarmá el cuerpo',body:'Mové el control “Separar anatomía” para separar cada pieza. Los botones ¾, F, L y P cambian el ángulo de la cámara, y Restablecer vuelve todo a su lugar.'},
 ]},
};
