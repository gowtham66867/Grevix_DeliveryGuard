import assert from 'node:assert/strict';
import {readFile, writeFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {SAMPLE_PLAN, SCENARIOS} from '../dist/core/fixtures.js';
import {recover} from '../dist/core/engine.js';
import {critique} from '../dist/core/agent.js';
import {decisionBrief} from '../dist/core/assurance.js';

const root = fileURLToPath(new URL('../', import.meta.url));
function run(command, args) {
  const result = spawnSync(command, args, {cwd:root, encoding:'utf8'});
  assert.equal(result.status, 0, `${command} failed:\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
// Derive the test count from a fresh run rather than copying a documentation claim.
const testFiles = (await readdir(new URL('../tests/', import.meta.url))).filter(name => name.endsWith('.test.mjs')).sort().map(name => 'tests/'+name);
const tests = run(process.execPath, ['--test', '--test-reporter=tap', ...testFiles]);
const count = name => Number(tests.match(new RegExp(`^# ${name} (\\d+)$`, 'm'))?.[1]);
assert(Number.isInteger(count('tests')) && count('tests') > 0);
assert.equal(count('fail'), 0);
assert.equal(count('pass'), count('tests'));
run(process.execPath, ['evals/run.mjs']);
run(process.execPath, ['scripts/build.mjs']);
const readJson = async path => JSON.parse(await readFile(new URL('../'+path, import.meta.url), 'utf8'));
const evaluations = await readJson('evals/report.json');
const browser = await readJson('docs/live-browser-proof.json');
for (const report of [evaluations, browser]) {
  assert.equal(report.passed, report.total);
  assert(report.results.every(r => r.passed));
}
assert.equal(evaluations.liveModelEvaluated, false);
const recovery = recover(SAMPLE_PLAN, SCENARIOS[0].disruption);
const winner = recovery.candidates.find(c => c.id === recovery.winnerId);
assert(winner && critique(winner, SAMPLE_PLAN).passed);
const brief = decisionBrief(winner, recovery, SAMPLE_PLAN);
assert.equal(brief.economics.contributionGain, 12000);
assert.equal(brief.scope.requiredPreserved, true);
assert.equal(winner.status, 'provisional');
assert(brief.confirmations.length > 0);
const files = ['docs/submission-answers.md','docs/business-case.md','docs/architecture.md','docs/test-cases.md','docs/limits.md','docs/demo-script.md','docs/decision-log.md','docs/judge-guide.md','docs/live-browser-proof.json','evals/report.json','feedback/README.md'];
const artifacts = [];
for (const path of files) {
  const bytes = await readFile(new URL('../'+path, import.meta.url));
  artifacts.push({path, bytes:bytes.length, sha256:createHash('sha256').update(bytes).digest('hex')});
}
const report = {
  schemaVersion:1, generatedAt:new Date().toISOString(),
  scope:'Fresh local engineering verification plus previously recorded Cloud Run browser evidence. No live-model benchmark or customer validation.',
  unitTests:{passed:count('pass'),total:count('tests')},
  evaluations:{passed:evaluations.passed,total:evaluations.total,generatedGraphs:evaluations.generatedCases},
  browserEvidence:{passed:browser.passed,total:browser.total,recordedAt:browser.generatedAt,freshRun:false},
  staffingDecision:{...brief.economics,requiredScopePreserved:brief.scope.requiredPreserved,status:winner.status,confirmations:brief.confirmations,stress:brief.stress.map(s=>({id:s.id,passed:s.passed,cost:s.metrics.cost,finish:s.metrics.finish,violations:s.violations.map(v=>v.code)}))},
  releaseVerdict:'Engineering checks pass. Event compliance remains incomplete.',
  unresolved:['Assigned PulseGuard Edge Card 1 not implemented in DeliveryGuard; organizer acceptance of the project switch is unverified.','Genuine human feedback and corresponding Card 2 improvement evidence pending.','Final Forge receipt pending.'],
  artifacts,
  integrityNote:'SHA-256 values let reviewers compare these exact files. This is not a signed attestation or an immutable audit log.'
};
await writeFile(new URL('../docs/submission-verification.json', import.meta.url), JSON.stringify(report,null,2)+'\n');
console.log(`Submission evidence verified: ${count('pass')} tests, ${evaluations.passed} evaluations, ${evaluations.generatedCases} generated graphs. Recorded browser: ${browser.passed}/${browser.total}. Event compliance still incomplete.`);
