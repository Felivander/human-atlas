import {useEffect,useState} from 'react';
import {ChevronLeft,ChevronRight,Hand,Layers3,MousePointerClick,Search,Sparkles,SlidersHorizontal} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {TUTORIAL,type Lang} from './i18n';
const ICONS=[Sparkles,Hand,MousePointerClick,Layers3,Search,SlidersHorizontal];
const SEEN_KEY='human-atlas-tutorial-seen';
export function tutorialSeen(){try{return localStorage.getItem(SEEN_KEY)==='1';}catch{return false;}}
function markSeen(){try{localStorage.setItem(SEEN_KEY,'1');}catch{/* Showing the tour again is harmless. */}}
export default function Tutorial({open,onOpenChange,lang}:{open:boolean;onOpenChange:(open:boolean)=>void;lang:Lang}){
 const copy=TUTORIAL[lang],[step,setStep]=useState(0),[touch,setTouch]=useState(false);
 useEffect(()=>{if(open){setStep(0);setTouch(window.matchMedia('(pointer: coarse)').matches);}},[open]);
 const close=()=>{markSeen();onOpenChange(false);};
 const current=copy.steps[step],Icon=ICONS[step],last=step===copy.steps.length-1;
 return <Dialog open={open} onOpenChange={next=>{if(!next)close();}}><DialogContent className="tutorial glass" showCloseButton={false}>
  <div className="tutorial-top"><span className="eyebrow">{copy.label}</span><Button variant="ghost" className="tutorial-skip" onClick={close}>{copy.skip}</Button></div>
  <div className="tutorial-icon"><Icon size={22}/></div>
  <DialogTitle className="tutorial-title">{current.title}</DialogTitle>
  <DialogDescription className="tutorial-body">{touch&&current.touch?current.touch:current.body}</DialogDescription>
  <div className="tutorial-dots" aria-label={copy.step(step+1,copy.steps.length)}>{copy.steps.map((s,i)=><button key={s.title} className={i===step?'active':''} aria-label={copy.step(i+1,copy.steps.length)} aria-current={i===step?'step':undefined} onClick={()=>setStep(i)}/>)}</div>
  <div className="tutorial-actions"><Button variant="ghost" className="tutorial-back" disabled={step===0} onClick={()=>setStep(s=>s-1)}><ChevronLeft size={16}/>{copy.back}</Button><Button className="primary-action tutorial-next" onClick={()=>last?close():setStep(s=>s+1)}>{last?copy.done:copy.next}{!last&&<ChevronRight size={16}/>}</Button></div>
 </DialogContent></Dialog>;
}
