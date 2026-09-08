export const KEY='minmax-journal-v1';
export function initialState(){return {version:1,settings:{split:4,unit:'kg',sound:false,vibration:true,rest:180},sessions:{},substitutions:{},timer:null};}
export function sessionKey(split,week,day){return `${split}-${week}-${day}`;}
export function getWorkout(program,week,day,split){
 const get=d=>program.find(w=>w.week===week&&w.day===d);
 if(split===4)return get(day);
 if(day==='Arms')return {week,day,custom:true,exercises:[...get('Upper').exercises.filter(e=>e.name.startsWith('S1:')),...get('Pull').exercises.filter(e=>e.name==='Preacher Hammer Curl')].map((e,i)=>({...e,id:`arms-${i}`}))};
 const w=get(day);return {...w,custom:true,exercises:w.exercises.filter(e=>day==='Upper'?!e.name.startsWith('S1:'):day==='Pull'?e.name!=='Preacher Hammer Curl':true)};
}
export const daysFor=split=>split===5?['Upper','Lower','Push','Pull','Arms']:['Upper','Lower','Push','Pull'];
export function suggestedWorkout(state){for(let week=1;week<=12;week++)for(const day of daysFor(state.settings.split))if(!state.sessions[sessionKey(state.settings.split,week,day)]?.finished)return {week,day};return {week:12,day:daysFor(state.settings.split).at(-1)};}
export const cleanName=name=>name.replace(/^S\d+:\s*/,'');
export function historyFor(state,name,exclude){
 return Object.entries(state.sessions).filter(([id])=>id!==exclude).flatMap(([id,s])=>
  Object.entries(s.exercises||{}).filter(([,e])=>e.name===name).flatMap(([exerciseId,e])=>
   Object.entries(e.sets||{}).filter(([,v])=>v.done).map(([set,v])=>({...v,sessionId:id,exerciseId,prescription:e.prescription,set:Number(set),date:s.date,week:s.week,day:s.day}))
  )
 ).sort((a,b)=>a.completedAt-b.completedAt);
}
export function previousSets(state,name,exclude,prescription){const h=historyFor(state,name,exclude).filter(s=>!prescription||!s.prescription||s.prescription===prescription);const latest=h.at(-1);return latest?h.filter(s=>s.sessionId===latest.sessionId):[];}
export function isPR(history,weightKg,reps){if(!history.length)return false;return history.some(s=>weightKg>=s.weightKg&&reps>=s.reps&&(weightKg>s.weightKg||reps>s.reps))&&!history.some(s=>s.weightKg>=weightKg&&s.reps>=reps);}
export const toKg=(value,unit)=>unit==='lb'?value/2.2046226218:value;
export const fromKg=(value,unit)=>Math.round((unit==='lb'?value*2.2046226218:value)*100)/100;
export function validSet(weight,reps,rir){return weight!==''&&Number.isFinite(Number(weight))&&Number(weight)>=-500&&Number(weight)<=2000&&Number.isInteger(Number(reps))&&Number(reps)>=1&&Number(reps)<=200&&Number.isInteger(Number(rir))&&Number(rir)>=0&&Number(rir)<=5;}
export function validateBackup(data){
 if(data?.version!==1||![4,5].includes(data.settings?.split)||!['kg','lb'].includes(data.settings?.unit)||!Number.isInteger(data.settings?.rest)||data.settings.rest<30||data.settings.rest>600||!data.sessions||typeof data.sessions!=='object'||Array.isArray(data.sessions)||!data.substitutions||typeof data.substitutions!=='object')return false;
 if(!Object.entries(data.substitutions).every(([k,v])=>typeof v==='string'&&v.length<300))return false;
 for(const [key,s]of Object.entries(data.sessions)){
  if(!/^[45]-([1-9]|1[012])-(Upper|Lower|Push|Pull|Arms)$/.test(key)||!s||!Number.isInteger(s.week)||s.week<1||s.week>12||!daysFor(5).includes(s.day)||typeof s.date!=='string'||!s.exercises||typeof s.exercises!=='object')return false;
  for(const e of Object.values(s.exercises)){
   if(!e||typeof e.name!=='string'||!e.sets||typeof e.sets!=='object'||(e.notes!==undefined&&typeof e.notes!=='string'))return false;
   for(const v of Object.values(e.sets))if(!v||!validSet(v.weightKg,v.reps,v.rir)||typeof v.done!=='boolean'||!Number.isFinite(v.completedAt))return false;
  }
 }
 if(data.timer!==null&&(!data.timer||!Number.isFinite(data.timer.end)||typeof data.timer.label!=='string'))return false;
 return true;
}
