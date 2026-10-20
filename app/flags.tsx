import type {Lang} from './i18n';
const stripes=Array.from({length:13},(_,i)=>i);
function UnitedStates(){return <svg viewBox="0 0 19 10" aria-hidden="true">{stripes.map(i=><rect key={i} y={i*10/13} width="19" height={10/13} fill={i%2?'#fff':'#b22234'}/>)}<rect width="7.6" height={70/13} fill="#3c3b6e"/>{Array.from({length:12},(_,i)=><circle key={i} cx={.9+(i%4)*1.95} cy={.8+Math.floor(i/4)*1.85} r=".32" fill="#fff"/>)}</svg>;}
function Argentina(){return <svg viewBox="0 0 18 12" aria-hidden="true"><rect width="18" height="12" fill="#74acdf"/><rect y="4" width="18" height="4" fill="#fff"/><circle cx="9" cy="6" r="1.25" fill="#f6b40e" stroke="#85340a" strokeWidth=".15"/></svg>;}
export function Flag({lang}:{lang:Lang}){return <span className="flag">{lang==='en'?<UnitedStates/>:<Argentina/>}</span>;}
