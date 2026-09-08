import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {initialState,getWorkout,daysFor,isPR,toKg,fromKg,validSet,validateBackup,previousSets,suggestedWorkout} from '../src/model.js';
const program=JSON.parse(fs.readFileSync(new URL('../src/program.json',import.meta.url)));
test('Every source week has four complete sheets with valid RIR and alternatives',()=>{
 assert.equal(program.length,48);
 assert.equal(program.flatMap(w=>w.exercises).length,396);
 for(let w=1;w<=12;w++)for(const day of daysFor(4))for(const e of getWorkout(program,w,day,4).exercises){assert.equal(e.rir.length,e.sets);assert(e.rir.every(n=>Number.isInteger(n)&&n>=0&&n<=3));assert.equal(e.substitutions.length,2);assert(e.substitutions.every(Boolean));assert(e.reps&&e.warmup&&e.notes);}
});
test('Intro and deload targets differ from regular work and intensity starts in week eight',()=>{
 assert.deepEqual(getWorkout(program,1,'Upper',4).exercises[0].rir,[1,2]);
 assert.deepEqual(getWorkout(program,2,'Upper',4).exercises[0].rir,[0,0]);
 assert.deepEqual(getWorkout(program,7,'Lower',4).exercises[1].rir,[2,3]);
 assert.equal(getWorkout(program,7,'Upper',4).exercises[4].technique,'-');
 assert.equal(getWorkout(program,8,'Upper',4).exercises[4].technique,'Myo-reps');
});
test('Custom five-day redistribution preserves every exercise and working set, all twelve weeks',()=>{
 for(let w=1;w<=12;w++){
  const flatten=split=>daysFor(split).flatMap(day=>getWorkout(program,w,day,split).exercises);
  const a=flatten(4),b=flatten(5);assert.equal(a.reduce((s,e)=>s+e.sets,0),b.reduce((s,e)=>s+e.sets,0));
  const normalize=es=>es.map(({id,...e})=>JSON.stringify(e)).sort();assert.deepEqual(normalize(a),normalize(b));assert.equal(getWorkout(program,w,'Arms',5).exercises.length,3);
 }
});
test('Performance best rejects first entry, ties, and load increases with fewer reps',()=>{
 assert.equal(isPR([],80,6),false);const h=[{weightKg:80,reps:6}];assert.equal(isPR(h,80,6),false);assert.equal(isPR(h,82.5,5),false);assert.equal(isPR(h,82.5,6),true);assert.equal(isPR(h,80,7),true);assert.equal(isPR([...h,{weightKg:85,reps:8}],82.5,7),false);
});
test('Unit conversion preserves canonical loads and validates meaningful inputs',()=>{
 assert.equal(fromKg(toKg(100,'lb'),'lb'),100);assert.equal(fromKg(50,'kg'),50);assert(validSet('0','6',1));assert(validSet('-20','6',1));assert(!validSet('','6',1));assert(!validSet('60','',1));assert(!validSet('60','6.5',1));assert(!validSet('Infinity','6',1));
});
test('Backup validation accepts a journal and rejects malformed or dangerous shapes',()=>{
 const s=initialState();assert(validateBackup(s));assert(!validateBackup({...s,version:2}));assert(!validateBackup({...s,sessions:[]}));assert(!validateBackup({...s,timer:{end:'tomorrow'}}));assert(!validateBackup({...s,settings:{...s.settings,rest:-1}}));assert(!validateBackup({...s,sessions:{oops:{}}}));
});
test('Previous recall separates rep prescriptions and excludes the current session',()=>{
 const s=initialState();s.sessions['4-1-Upper']={week:1,day:'Upper',date:'2026-09-08',exercises:{a:{name:'Press',prescription:'4-6',sets:{0:{weightKg:80,reps:6,done:true,completedAt:1}}},b:{name:'Press',prescription:'20',sets:{0:{weightKg:40,reps:20,done:true,completedAt:2}}}}};
 assert.equal(previousSets(s,'Press','4-2-Upper','4-6')[0].weightKg,80);assert.equal(previousSets(s,'Press','4-2-Upper','20')[0].weightKg,40);assert.equal(previousSets(s,'Press','4-1-Upper').length,0);assert.deepEqual(suggestedWorkout(s),{week:1,day:'Upper'});s.sessions['4-1-Upper'].finished=true;assert.deepEqual(suggestedWorkout(s),{week:1,day:'Lower'});
});
