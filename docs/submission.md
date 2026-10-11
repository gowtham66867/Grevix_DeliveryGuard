# DeliveryGuard submission checklist

DeliveryGuard has a working app, reproducible harness, business case, architecture, demo script, and documented limits. Event compliance still requires authentic feedback evidence, the resulting improvement, and organizer acceptance of a project change. Challenge Card 1 was found and specifically names PulseGuard Edge; DeliveryGuard does not fulfill it.

## Required event work

The GREVIX Unstop WhatsApp announcements on 11 October 2026 state that Phase 3 and Phase 4 forms are mandatory. Missing Phase 1 or 2 forms is permitted. Aaryan’s 8:08 PM message gives the Phase 4 final-form window as 12 AM–2 AM on 12 October. Check the time zone and current window in Unstop before submission.

Challenge Card 2 requires sharing the project, collecting genuine human feedback, implementing at least one change from that feedback, and committing discussion and response screenshots plus a brief explanation under `/feedback` or the README.

- [x] Original working prototype focused on a business problem.
- [x] Deterministic engine, optional AI interpreter, bounded workflow, verification and approval.
- [x] Automated tests and evaluation harness with recorded outcomes.
- [x] Business case, demo script, architecture and explicit limits.
- [x] Challenge Card 1 obtained from the organizer’s email.
- [ ] Assigned PulseGuard Edge baseline-sync challenge implemented, or project change explicitly accepted by the organizer.
- [ ] App shared with actual human reviewers.
- [ ] At least one genuine feedback response captured.
- [ ] Improvement implemented from that response and verified.
- [ ] Feedback screenshots and change explanation committed.
- [ ] Phase 3 form completed.
- [ ] Phase 4 form completed in its required window.
- [ ] Judge-accessible demo and source URLs verified.
- [ ] Any required video or form-specific attachment supplied.

## Submission copy

**Name:** DeliveryGuard

**One-line pitch:** A delivery-risk copilot that helps small agencies recover client projects after staffing, budget, or deadline disruptions without silently sacrificing required scope or margin.

**Problem:** Delivery leads need to make cost-versus-timing decisions when a fixed-fee commitment becomes infeasible. Task lists alone do not show the economic consequences of waiting or the exact recovery patch.

**Solution:** Ground the disruption, simulate doing nothing, branch over declared alternatives and optional scope, verify constraints, compare recovery options, and require human approval before applying a patch.

**Technical distinction:** A bounded tool-orchestrated workflow separates optional language-model interpretation from deterministic scheduling and ranking. An independent verifier and stale-revision check protect the approval boundary.

**Evidence:** 85 automated tests, 27 recorded evaluation cases, and 150 generated DAG scenarios in the evaluation harness. Browser-tested recovery, approval, undo, and export. No live-model benchmark or fabricated customer outcome is claimed.

**Limitations:** Heuristic scheduling, synthetic demo data, declared external facts, browser-local state, and no multi-user or booking integration. Authentic human feedback remains pending. The assigned PulseGuard Edge baseline-sync challenge is not implemented in DeliveryGuard; full event compliance cannot be claimed.
