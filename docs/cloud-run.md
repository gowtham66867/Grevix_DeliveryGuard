# Cloud Run deployment record

Deployed on 11 October 2026.

- Public URL: https://deliveryguard-412542191970.asia-south1.run.app/
- Project: `billing-dashboard-505116`
- Region: `asia-south1`
- Service: `deliveryguard`
- Revision: `deliveryguard-00001-lxw`
- Runtime: Node 24 Alpine, unprivileged Node user.
- 256 MiB memory, 1 vCPU, concurrency 40, 30-second request timeout.
- Minimum instances 0, maximum instances 1. Cloud Build, storage and runtime usage can incur charges.
- Public invocation uses `--no-invoker-iam-check`, Google's supported public-service setting. Initial `allUsers` IAM assignment failed; the supported service-level configuration succeeded.
- No OpenAI key configured. API status verified `local-rules`.

## Actual verification

Unauthenticated HTTPS returned HTTP 200 and the updated live-proof UI. The status endpoint reports local rules. Same-origin HTTPS interpretation succeeded with the expected ₹58,000 budget. A foreign origin was rejected with HTTP 403. The deployed report contains 27 passing recorded cases. The deployed browser ran 12/12 live checks successfully, with no captured browser errors. `cloud-run-proof.png` records the public UI.

The local suite passed 87 tests, 27 evaluation cases, and 150 generated graphs; build validation passed.

## Redeploy

```sh
npm run check
npm run build
gcloud run deploy deliveryguard --source=. --project=billing-dashboard-505116 --region=asia-south1 --no-invoker-iam-check --min-instances=0 --max=1 --max-instances=1 --memory=256Mi --cpu=1 --concurrency=40 --timeout=30 --port=8080 --quiet
```

`.gcloudignore` excludes environment files and local evidence from upload. `.dockerignore` restricts the image to runtime assets. The server binds to all interfaces under Cloud Run's `K_SERVICE` and uses its injected `PORT`; local runs bind to loopback.

## Public demo limits

Synthetic fixtures, browser-local edits and receipts, no shared customer backend or vendor actions. The in-memory API throttle is shared within an instance and uses the proxy peer address; it is not a production per-user quota. Do not enable paid anonymous live interpretation without authenticated users, distributed quotas and spending controls. Setting an API key alone is not sufficient for production exposure.

Deployment does not resolve the event's PulseGuard-specific assigned challenge, genuine-human-feedback requirement, or mandatory submission forms.

Sources: [Cloud Run source deployment](https://docs.cloud.google.com/run/docs/deploying-source-code), [Public service configuration](https://docs.cloud.google.com/run/docs/authenticating/public).
