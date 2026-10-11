import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
assert(html.includes('DeliveryGuard'));
for(const asset of ['app.js','style.css','mark.svg','core/engine.js','core/agent.js','core/fixtures.js','eval-results.json'])await readFile(new URL('../dist/'+asset,import.meta.url));
const report=JSON.parse(await readFile(new URL('../dist/eval-results.json',import.meta.url),'utf8'));assert.equal(report.passed,report.total);
console.log('Static artifact verified; all runtime assets and passing recorded evaluations present.');
