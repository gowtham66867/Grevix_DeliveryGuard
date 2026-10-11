import test from 'node:test';
import assert from 'node:assert/strict';
import {runProof} from '../dist/core/proof.js';
test('browser proof exercises scenario outcomes and approval boundaries',async()=>{const p=await runProof();assert.equal(p.total,12);assert.equal(p.passed,12);});
test('proof cannot turn a broken engine into a passing report',async()=>{const p=await runProof({agent:async()=>({status:'review',result:{candidates:[],winnerId:null}})});assert.ok(p.passed<p.total);assert.ok(p.results.some(r=>!r.passed));});
