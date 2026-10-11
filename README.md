# DeliveryGuard

**Protect the client promise when the delivery plan changes.** DeliveryGuard helps small agencies recover fixed-fee client projects after staffing gaps, budget cuts, and earlier deadlines. It compares the financial and delivery impact of waiting, using a declared backup, or deferring optional scope, while preserving required client deliverables.

Built as an original prototype for consideration at GREVIX AfterCode. The initial idea was inspired by the planning problem described in Kartikey Gupta’s PlanPatch post; this implementation, business model, engine, interface, and harness are independent. The reference app was not copied.

## Live demo

[Public Cloud Run demo](https://deliveryguard-412542191970.asia-south1.run.app/) — no sign-in, synthetic data, local-rules interpretation. [Deployment record](docs/cloud-run.md).

## Try it

Requires Node.js 22 or newer. No package installation is needed.

```sh
npm start
```

Open http://127.0.0.1:4310. Choose **Engineer unavailable**, then **Analyze disruption**. The default demo uses a transparent local rules interpreter. It does not claim to call an LLM.

```sh
npm run check
npm run build
```

The recorded suite passes **87 tests**, **27 evaluation cases**, and **150 generated DAG scenarios** in the evaluation harness. Unit tests also run a separate batch of 150 generated graphs. Provider tests use mocks; no live-model benchmark or real customer savings are claimed.

## The business decision

Northstar’s fictional fixed-fee portal engagement has ₹1,20,000 revenue, ₹63,000 baseline delivery cost, a ₹70,000 cost budget, and a day-16 deadline. A frontend resource unavailable until day 12 pushes the unchanged schedule to day 22. At the scenario’s ₹3,000 daily lateness cost, that creates ₹18,000 of modeled exposure.

The balanced recovery uses a declared backup frontend engineer. It finishes on day 14 at ₹69,000 cost and preserves every deliverable. Compared with waiting, it improves modeled contribution from ₹39,000 to ₹51,000. It remains **provisional** until the operator confirms backup capacity and the quoted cost. These are synthetic scenario calculations, not measured commercial outcomes.

## How the agent works

1. **Coordinator:** validates the plan and captures its revision.
2. **Interpreter:** extracts one grounded disruption or asks for clarification.
3. **Policy guard:** limits changes to allowlisted plan parameters.
4. **Scenario planner:** simulates the cost and timing of doing nothing.
5. **Recovery planner:** branches over declared alternatives and optional scope, computes feasible schedules, identifies nondominated options, and ranks them against business priorities.
6. **Verifier:** independently checks required scope, dependency order, resource capacity, cost reconciliation, deadline, and margin.
7. **Human checkpoint:** shows the patch and unresolved assumptions. Approval re-evaluates the candidate against the current plan. A changed revision or missing external verification blocks application.

This is a bounded, tool-orchestrated agent workflow with an optional LLM interpreter. Role names describe functional stages; they are not seven independent LLM agents. The engine performs all numeric scheduling and ranking. The model cannot hire a contractor, edit repository files, or send client communications.

## Optional live AI

Set a server-side `OPENAI_API_KEY` and optionally `OPENAI_MODEL`. The default configured model is `gpt-6-astra`, following the current [official Structured Outputs documentation](https://developers.openai.com/api/docs/guides/structured-outputs).

```sh
cp .env.example .env
# Edit .env locally; never commit the key.
node --env-file=.env server.mjs
```

The UI enables live interpretation only when the local server reports it as configured. Opting in sends the brief and minimal budget/deadline/resource context to OpenAI. Costs and complete task records are not sent to the model. Requests use a strict JSON schema, `store:false`, a 15-second timeout, and a 700-output-token bound. Schema compliance alone does not prove semantic accuracy; evidence and plan parameters are validated before scheduling. The public Cloud Run demo stays in local-rules mode with no configured provider key.

## Decision assurance

Every selected recovery includes four deterministic stress cases: costs +10%, each task +1 day, every resource +2 days, and all shocks together. It shows constraint failures without treating scenarios as probabilities. Download a readable decision brief with counterfactual economics, scope changes, and confirmation requirements.

The evaluation view can also run a **12-check live proof suite** in the browser, including independent schedule verification, impossible recovery, adversarial input, external verification and stale approval. Download its generated evidence. This is separate from the recorded 27-case evaluation and does not evaluate a live model.

## Review the evidence

Start with the [judge guide](docs/judge-guide.md), then inspect the [submission verification packet](docs/submission-verification.json). Reproduce its engineering evidence with `npm run submission:verify`; the recorded browser checks retain their original timestamp.

| Artifact | Purpose |
| --- | --- |
| [Business case](docs/business-case.md) | Buyer, pain hypothesis, workflow, modeled value, and validation plan |
| [Architecture](docs/architecture.md) | Tools, state transitions, trust boundaries, and decision objectives |
| [Test cases](docs/test-cases.md) | Detailed expected outcomes and reproduction commands |
| [Recorded evaluation](evals/report.json) | Machine-readable outcomes from the actual harness |
| [Limits](docs/limits.md) | Known failure modes and production gaps |
| [Demo script](docs/demo-script.md) | A focused three-minute judge walkthrough |
| [Submission checklist](docs/submission.md) | Event compliance and remaining external requirements |
| [Feedback record](feedback/README.md) | Authentic feedback status and evidence requirements |

## Important boundaries

- A deterministic resource-aware scheduling heuristic; no global optimum guarantee.
- Maximum 24 tasks, 12 resources, three alternatives per task, and 512 candidate assignments per run. Truncation is explicit.
- Whole INR rupees, working days from project start, no holidays or partially completed tasks.
- External capacity, quotes, and client scope agreements require human confirmation.
- Browser-local storage and undo; no authentication or multi-user backend.
- Revision checks detect accidental stale edits. The checksum is not a cryptographic signature or tamper-proof audit log.
- No authentic human feedback has yet been collected for this app. AI-generated reviews cannot satisfy the challenge’s human-feedback requirement.
- Challenge Card 1 was found in the organizer’s 11 October email and is assigned specifically to PulseGuard Edge: recover missed patient-baseline updates and recalculate risk while preserving quality and persistence checks. DeliveryGuard does not implement that assignment; organizer acceptance of a new project is unverified.

MIT licensed. See [LICENSE](LICENSE).


Follow-up on 12 October: the assigned baseline recovery behavior has now been implemented in PulseGuard Edge, with 55 passing tests, type checking, lint, a production build and browser evidence. See [dated implementation evidence](https://github.com/gowtham66867/pulseguard-edge-demo/blob/2a0136b/docs/CHALLENGE_01_EVIDENCE.md). This was done after the build window and in the original project; it does not establish organizer acceptance of the DeliveryGuard switch or late work.
