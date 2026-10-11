import test from 'node:test';
import assert from 'node:assert/strict';
import {SAMPLE_PLAN} from '../dist/core/fixtures.js';
import {recover,fingerprint} from '../dist/core/engine.js';
import {stressTest,decisionBrief,briefText} from '../dist/core/assurance.js';
const result=recover(SAMPLE_PLAN,{type:'resource',target:'frontend',value:12});
const candidate=result.candidates.find(c=>c.id===result.winnerId);
test('stress checks expose budget and time fragility rather than label nominal plan robust',()=>{
 const checks=stressTest(candidate);assert.equal(checks.length,4);
 assert.equal(checks[0].metrics.cost,75900);assert.equal(checks[0].passed,false);
 assert.ok(checks[0].violations.some(v=>v.code==='BUDGET'));
 assert.equal(checks[2].metrics.finish,candidate.metrics.finish+2);
 assert.equal(checks[2].passed,true);
 assert.ok(checks[1].violations.some(v=>v.code==='DEADLINE'));
 assert.equal(checks[3].passed,false);
});
test('stress checks are deterministic and never mutate candidate or baseline',()=>{
 const before=structuredClone(candidate);assert.deepEqual(stressTest(candidate),stressTest(candidate));assert.deepEqual(candidate,before);
});
test('business brief reconciles recovery and counterfactual contribution',()=>{
 const b=decisionBrief(candidate,result,SAMPLE_PLAN);assert.equal(b.economics.contributionGain,12000);assert.equal(b.scope.requiredPreserved,true);assert.equal(b.economics.budgetBuffer,1000);assert.equal(b.revision,fingerprint(SAMPLE_PLAN));assert.ok(b.confirmations.length);
});
test('scope deferral carries explicit client confirmation into brief',()=>{
 const r=recover(SAMPLE_PLAN,{type:'budget',target:'budget',value:58000});const c=r.candidates.find(c=>c.id===r.winnerId),b=decisionBrief(c,r,SAMPLE_PLAN);assert.equal(b.scope.deferred.length,2);assert.ok(b.confirmations.some(s=>s.includes('client agreement')));
});
test('brief text preserves financial evidence and honestly limits stress claims',()=>{
 const text=briefText(decisionBrief(candidate,result,SAMPLE_PLAN));assert.ok(text.includes('₹12,000'));assert.ok(text.includes('not probabilities'));assert.ok(text.includes('Confirm'));
});
