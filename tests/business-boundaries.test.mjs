import test from 'node:test';import assert from 'node:assert/strict';
import {SAMPLE_PLAN,clone} from '../dist/core/fixtures.js';import {validatePlan} from '../dist/core/engine.js';
test('positive contract revenue required for meaningful margin calculations',()=>{const p=clone(SAMPLE_PLAN);p.revenue=0;assert.throws(()=>validatePlan(p));});
test('every engagement must retain at least one required deliverable',()=>{const p=clone(SAMPLE_PLAN);p.tasks.forEach(t=>t.required=false);assert.throws(()=>validatePlan(p));});
test('prototype-sensitive IDs cannot enter lookup maps',()=>{for(const id of ['__proto__','constructor','prototype']){const p=clone(SAMPLE_PLAN);p.resources[0].id=id;assert.throws(()=>validatePlan(p));}});
