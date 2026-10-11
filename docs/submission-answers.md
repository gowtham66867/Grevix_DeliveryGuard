# DeliveryGuard — prepared submission answers

Draft for review. This is not a confirmation of submission or event compliance.

## Project name
DeliveryGuard

## Description
A client-delivery recovery copilot for small service agencies managing fixed-fee engagements. When staffing, budgets or deadlines change, DeliveryGuard simulates the consequences of waiting, compares recovery options, protects required deliverables and margin, and requires explicit human approval before applying a local plan change.

## Problem and intended user
Delivery leads face disruptions after committing to a client fee and deadline. A task list does not show the economic consequences of waiting, the scope sacrificed by a cheap workaround, or whether a recovery survives an estimation error. DeliveryGuard makes those trade-offs visible before the lead commits to a change.

## Solution and business example
The synthetic Northstar engagement has ₹1,20,000 revenue. A frontend staffing gap makes the unchanged plan finish on day 22, exposing ₹18,000 in declared lateness costs. The balanced recovery uses a declared backup, preserves all scope, finishes on day 14 and improves modeled contribution from ₹39,000 to ₹51,000. The recommendation remains provisional until backup availability and its quote are confirmed. This is a reproducible scenario, not a measured customer saving.

## Demo
https://deliveryguard-412542191970.asia-south1.run.app/

## Public source repository
https://github.com/gowtham66867/deliveryguard-grevix

## Technology and AI tools
JavaScript ES modules, Node.js, HTML/CSS/SVG, browser local storage, Docker and Google Cloud Run. Codex assisted with implementation, documentation and verification. The deployed demo uses a transparent local-rules interpreter. An optional server-side OpenAI Responses interpreter uses strict structured output, evidence grounding and bounded calls; it is mock-tested and is not configured in the public demo.

## Agentic approach
A bounded workflow validates and versions the plan, grounds a disruption, restricts available changes, computes a counterfactual, branches over declared alternatives and optional scope, ranks feasible trade-offs, independently verifies the proposed schedule and requests human approval. Approval recomputes the selected candidate and rejects stale revisions and unconfirmed external facts. Role names describe functional stages, not seven independent language models.

## Evidence
87 passing automated tests, 27 recorded evaluation cases and 150 generated dependency graphs in the harness. A separate in-browser replay passed 12/12 live checks on the Cloud Run deployment. Stress checks apply fixed cost, duration and resource-release shocks to the selected patch. Downloadable decision packets and business briefs preserve scenario assumptions, financial comparisons and approval evidence.

## Challenge Card 1 — accurate status
The organizer's assigned card specifically names PulseGuard Edge and requires handling missed patient-baseline updates and recalculating risk while preserving existing quality and persistence checks. DeliveryGuard is a separate planning prototype and does not implement that assigned clinical-monitoring requirement. Acceptance of this project change has not been confirmed. Do not describe DeliveryGuard's recovery workflow as satisfying that card.

## Challenge Card 2 — accurate status
Genuine human feedback and a corresponding implemented improvement are not yet documented. Agent-driven tests and the owner's general quality request are not represented as the required public human-feedback evidence. The feedback directory records this gap. Do not claim the card is complete.

## Limitations
Synthetic fixtures; deterministic scheduling heuristic rather than a global optimum; fixed stress scenarios rather than probabilities; INR and working-day offsets only; one disruption per run; browser-local plans rather than team collaboration; declared external quotes and capacity; no booking or client communication. Live-model accuracy and real customer impact have not been evaluated.
