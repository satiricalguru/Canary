# RULES.md — Canary Engineering Rules

**Project:** Canary — Population and Workforce Health Early-Warning Platform  
**Applies to:** Every contributor, frontend and backend implementation, data pipeline, test, demo and deployment  
**Version:** 1.0  
**Purpose:** Establish one consistent way to build Canary, handle failures, protect data and keep the prototype within its intended boundaries.

> Read `PRD.md` for product requirements and `ARCHITECTURE.md` for system design. This file defines the engineering rules that implementations must follow. If documents conflict, do not silently choose: raise the conflict, record the decision in `MODEL_CARD.md`, and keep the privacy and safety boundaries in this file.

---

## 1. Non-negotiable principles

1. **Exposure leads; outcomes confirm.** Environmental hazard signals may provide an early warning; service and workplace outcomes add supporting evidence.
2. **Aggregate-only.** Canary does not ingest, store, infer or display person-level health or employment records.
3. **Explain every alert.** An alert must show the contributing evidence, observed-versus-expected values where permitted, time window, data quality, missing feeds and assumptions.
4. **Decision support only.** Canary does not diagnose, predict an individual's health, prescribe treatment, dispatch responders or automatically enforce workplace actions.
5. **Human review is required.** Every recommendation has an owner role and review/escalation information. The application must not present recommendations as commands.
6. **No silent data fabrication.** Missing, stale, simulated, estimated and suppressed values must be distinguishable.
7. **Backend enforcement.** Privacy, authorization, validation and alert logic are enforced by the API, never only by frontend controls.
8. **Reproducible results.** Synthetic data, replay and evaluation must be deterministic for a fixed configuration and seed.
9. **Prototype-sized architecture.** Use a modular monolith. Do not add infrastructure or abstractions without a clear requirement.
10. **Honest claims.** Synthetic evaluation is not clinical validation. A demo role is not production authentication. Suppression is not differential privacy.

---

## 2. Repository and collaboration rules

### 2.1 Source of truth

- `PRD.md`: product scope, behaviours and acceptance criteria.
- `ARCHITECTURE.md`: components, flows, database and deployment design.
- `RULES.md`: engineering, coding, error-handling and safety rules.
- `MODEL_CARD.md`: intended use, methods, assumptions, limitations and evaluation.
- `DATA_GOVERNANCE.md`: data categories, provenance, retention and access rules.
- `README.md`: setup, run, test and deployment instructions.

Do not duplicate long product requirements in code comments. Link to the relevant document or record a short implementation note.

### 2.2 Git rules

- Use small, focused commits with descriptive messages.
- Suggested format: `feat(alerts): add alert detail endpoint`, `fix(privacy): apply secondary suppression`, `docs: update local setup`.
- Never commit `.env`, secrets, access tokens, database dumps containing real data, private keys or raw sensitive records.
- Commit lockfiles (`package-lock.json` or chosen package-manager lockfile, and Python lockfile if used).
- Do not commit generated build folders, virtual environments, caches or local database volumes.
- Use branches for work that may affect shared files. Keep `main` deployable.
- Before merging, run the relevant lint, type-check and test commands.
- Do not overwrite another contributor's work without coordinating.

### 2.3 Code review checklist

A change is not complete until the reviewer can answer:

- Does it match the PRD and this architecture?
- Is the change in the correct layer?
- Are request and response types explicit?
- Are authorization and privacy enforced server-side?
- Are missing/stale/synthetic data states represented?
- Are errors safe and useful?
- Are tests included for important behaviour and failure cases?
- Does the UI remain accessible and understandable?
- Does the documentation need updating?

---

## 3. Approved technology and libraries

Use the following stack unless the team records a reason to change it. Prefer fewer dependencies over convenience packages.

### 3.1 Frontend

| Purpose | Library / tool | Rule |
|---|---|---|
| Web framework | Next.js App Router | Use for pages, layouts and server/client component boundaries |
| Language | TypeScript | Strict mode enabled; avoid `any` |
| UI library | React | Use functional components and hooks |
| Styling | Tailwind CSS | Use shared design tokens/utilities; avoid scattered one-off styles |
| Icons | Lucide React | Use one icon library consistently |
| Maps | Leaflet + React-Leaflet | Use for map display only, not detection calculations |
| Charts | Recharts | Use for signal trends and validation charts |
| Runtime validation | Zod | Validate external JSON at the frontend boundary where useful |
| HTTP | Native `fetch` through one API client | Do not call `fetch` ad hoc throughout components |
| Unit/component tests | Vitest + React Testing Library | Test user-visible behaviour |
| Browser tests | Playwright | Use for the critical end-to-end demo flow |
| Lint/format | ESLint + Prettier | Run consistently before merging |

**Frontend rules**

- Use `src/app/` for routes and route composition.
- Use `src/components/` for reusable UI.
- Use `src/lib/api/` for all backend calls.
- Use `src/lib/types/` for shared frontend domain and API types.
- Keep client components small. Add `"use client"` only when browser interaction/state is required.
- Do not put database logic, secrets, detection thresholds or authorization policy in the frontend.
- Do not duplicate API business rules in React.
- Avoid global state libraries for the prototype. Use URL query parameters for shareable filters, React state for local UI state and server fetching for API data.
- Do not install a component library unless the team has a concrete need. Build a small consistent component set with Tailwind.
- Use dynamic/client-only loading for Leaflet components when needed by Next.js; Leaflet requires browser APIs.
- Always provide a non-map list/table alternative for location information.
- Do not rely on colour alone for alert tiers, chart meaning or feed status.

### 3.2 Backend

| Purpose | Library / tool | Rule |
|---|---|---|
| API framework | FastAPI | Routers handle HTTP concerns; services handle workflows |
| Language | Python 3.12 | Use type hints for public functions |
| Request/response validation | Pydantic v2 | Every API boundary has explicit models |
| Database access | SQLAlchemy 2 | Use ORM/session patterns consistently |
| Migrations | Alembic | All schema changes are migrations |
| PostgreSQL driver | psycopg 3 | Use one supported driver consistently |
| Dataframes | pandas | Use for batch transformations and evaluation, not every simple operation |
| Numerical work | NumPy | Use for numerical arrays and seeded simulation |
| Statistical modelling | statsmodels | Use for negative-binomial GLM and statistical baselines |
| Scientific utilities | SciPy | Use only where a required statistical routine needs it |
| YAML parsing | PyYAML | Load playbooks/configuration; validate their structure |
| HTTP client | httpx | Use for optional external data-source adapters |
| Retry policy | tenacity, only if needed | Retry transient external failures with bounded attempts |
| Backend tests | pytest | Unit and integration tests |
| API tests | FastAPI TestClient / HTTPX | Test status codes, schemas and access policy |
| Lint/format | Ruff | Use for linting and formatting |
| Type checking | mypy or Pyright | Choose one and configure it; do not run both without a reason |

**Backend rules**

- Keep `api/routers/` thin. A route validates input, resolves dependencies, calls a service and returns a response model.
- Put business workflows in `services/`.
- Put deterministic statistical functions in `engine/`.
- Put authorization in `auth/`.
- Put aggregate-only validation and suppression in `privacy/`.
- Put database models and session setup in `db/`.
- Do not import FastAPI, SQLAlchemy or frontend concepts into pure `engine/` functions.
- Do not make HTTP requests from statistical engine functions.
- Do not put alert thresholds in UI components.
- Do not put recommendations or action text inside detection algorithms.
- Avoid circular imports. Use small domain types/schemas to define boundaries.

### 3.3 Infrastructure and development tools

| Purpose | Tool | Rule |
|---|---|---|
| Database | PostgreSQL | Single operational source of truth |
| Local services | Docker Compose | Local setup must be reproducible |
| Frontend hosting | Vercel | Deploy the `frontend/` app |
| Backend hosting | Render | Deploy FastAPI from `backend/` |
| Database hosting | Managed PostgreSQL | Use environment-specific credentials |
| API contract | FastAPI OpenAPI | Keep generated API docs consistent with schemas |
| Version control | Git + GitHub | Protect `main`; use pull requests |
| Environment variables | `.env` locally; host environment settings in cloud | Never commit secrets |

Do not add Redis, Kafka, Celery, Kubernetes, microservices, a vector database, an LLM framework or a second operational database for this prototype.

### 3.4 Dependency version policy

- Use currently supported stable releases that are compatible with the selected framework versions.
- Pin dependencies through lockfiles so every team member and deployment uses the same resolved versions.
- Do not use floating wildcard versions.
- Do not upgrade major framework versions during feature work without testing the whole application.
- Before adding a package, check whether the language/framework standard library or an existing dependency already solves the problem.
- Remove unused dependencies.

---

## 4. Architecture boundaries

The following boundaries are mandatory.

### 4.1 Frontend boundary

Frontend may:
- Display data returned by the API.
- Manage visual state, filters, chart ranges and replay controls.
- Submit valid user actions to API endpoints.
- Display errors, loading states, missing feeds and provenance labels.

Frontend may not:
- Calculate authoritative alert tiers or risk scores.
- Apply the only copy of suppression logic.
- Decide whether a role is authorized.
- store secrets or database credentials.
- infer missing values and present them as observed data.
- send person-level data to the API.

### 4.2 API boundary

The API must:
- Validate every request.
- Resolve the current session/role server-side.
- Enforce authorization on every protected endpoint.
- Call domain services instead of embedding business logic in route handlers.
- Filter and suppress data before serialization.
- Return stable, documented error responses.
- avoid returning raw database models or internal exception details.

The API must not:
- trust a role, unit scope or permission sent by the browser.
- accept arbitrary extra fields in aggregate ingestion.
- expose suppressed raw counts in hidden JSON fields.
- allow the public demo to run destructive seed or ingestion operations.

### 4.3 Detection-engine boundary

The engine:
- Receives normalized, approved aggregate observations and unit metadata.
- Produces structured evidence, completeness information and candidate alert state.
- Must be deterministic for the same inputs/configuration.
- Must expose intermediate contributions for explanation.
- Must identify missing streams and uncertainty.

The engine must not:
- read HTTP requests or cookies.
- query the database directly.
- call external APIs.
- render text or UI.
- access individual records.
- diagnose people or calculate individual risk.
- automatically execute a recommendation.

### 4.4 Privacy boundary

- Validate aggregate-only payloads before database persistence.
- Reject unknown fields rather than silently stripping them.
- Never store person-level health or employment data.
- Apply small-cell and secondary suppression server-side.
- Apply role filtering before response serialization.
- Do not log raw request bodies for ingestion failures.
- Use synthetic fixtures for any demonstration of person-like records; do not create realistic identifiable personal profiles.

### 4.5 Playbook boundary

- Playbooks are structured YAML content.
- Playbook selection depends on hazard/syndrome and tier.
- Playbooks do not calculate alert scores or change tiers.
- Each recommendation must include an owner role, evidence, assumptions, escalation path, review-by date/interval and guidance reference.
- Recommendations are suggestions for human review, not automated instructions.

---

## 5. Code style and naming conventions

### 5.1 General

- Prefer clear names over clever abbreviations.
- Keep functions small and single-purpose.
- Avoid hidden side effects.
- Use constants/configuration for thresholds and limits.
- Add comments to explain *why*, not to restate what the code already says.
- Do not leave debug prints, temporary bypasses or commented-out blocks in merged code.
- Do not suppress type or lint errors without a specific explanation.
- Avoid premature generic frameworks and abstractions.

### 5.2 TypeScript / React

- Components: `PascalCase.tsx`, e.g. `AlertCard.tsx`.
- Hooks: `useCamelCase.ts`, e.g. `useReplayState.ts`.
- Utilities: `camelCase.ts`.
- Types/interfaces: `PascalCase`.
- Constants: `UPPER_SNAKE_CASE` for true constants.
- Use explicit prop interfaces for reusable components.
- Prefer `unknown` over `any` when a value is not yet validated.
- Narrow API response unions before rendering.
- Keep formatting and date conversion in shared formatter functions.
- Avoid non-null assertions (`!`) unless the invariant is proven and documented.

### 5.3 Python

- Modules/functions/variables: `snake_case`.
- Classes: `PascalCase`.
- Constants: `UPPER_SNAKE_CASE`.
- Add type hints to service and engine function inputs/outputs.
- Use Pydantic models at external boundaries and dataclasses or typed structures for internal immutable results where appropriate.
- Use `Decimal` for exact financial/currency arithmetic if introduced; do not use binary float for money.
- Use timezone-aware datetimes for timestamps.
- Use `date` for observation-day fields.
- Avoid broad `except Exception` except at a top-level boundary where it is logged safely and converted to a generic response.

### 5.4 Database

- Table and column names: `snake_case`.
- Primary keys: stable UUID or consistent string IDs; choose one convention before migrations and use it throughout.
- Foreign keys end in `_id`.
- Store dates as `DATE` and timestamps as timezone-aware `TIMESTAMPTZ`.
- Store counts as non-negative integers.
- Store derived metrics with a suitable numeric type and documented unit.
- Use migrations for all schema changes. Never rely on `create_all()` in production.

---

## 6. Error handling rules

Errors must be predictable, safe, actionable and visible. Do not hide failures by returning empty arrays, zero values or fake successful responses.

### 6.1 Error categories

| Category | Example | Expected handling |
|---|---|---|
| Validation | Invalid date, negative count, unknown payload field | `400` or `422`; identify the invalid field without echoing sensitive data |
| Authentication/session | Missing or invalid demo session | `401`; prompt the user to select a demo role |
| Authorization | Role cannot access a unit or detail | `403`, or `404` where resource-existence disclosure should be avoided |
| Not found | Alert/unit/scenario does not exist | `404` |
| Conflict | Duplicate ingestion key or invalid lifecycle transition | `409` |
| Rate limit | Too many requests, if rate limiting is enabled | `429` |
| External provider | Open-Meteo timeout or unavailable response | Mark feed stale/unavailable; preserve last valid data with its timestamp |
| Database | Connection lost or transaction failure | Roll back; return generic `503` where appropriate |
| Detection | Baseline cannot be fitted or inputs are insufficient | Return a controlled processing status; do not invent an alert |
| Unexpected internal | Unhandled bug | Log request ID and stack trace privately; return generic `500` |

Use the appropriate status code consistently. Do not return `200 OK` for a failed operation.

### 6.2 API error format

Use one standard response shape:

```json
{
  "error": {
    "code": "INVALID_AGGREGATE_RECORD",
    "message": "The submitted aggregate record is invalid.",
    "request_id": "req-example",
    "details": [
      {
        "field": "count",
        "reason": "must_be_non_negative"
      }
    ]
  }
}
```

Rules:
- `code` is stable and machine-readable.
- `message` is safe for the user.
- `request_id` helps support/debugging.
- `details` may identify safe field names and validation reasons.
- Never include stack traces, SQL, secrets, raw payloads, internal file paths or personal data in API errors.
- Do not reveal whether a protected resource exists if that would leak information.

### 6.3 Frontend error behaviour

Every API-backed page must handle:

- **Loading:** show skeleton or progress indicator.
- **Empty:** explain that no records match or data is not available.
- **Error:** show a concise message and retry action when retry is safe.
- **Partial data:** show available streams and identify missing ones.
- **Stale data:** show the last successful update time and stale label.
- **Suppressed data:** show “Suppressed” or “Below reporting threshold”, never zero.
- **Unavailable external source:** explain that the source is unavailable and show the last valid timestamp if available.

Never:
- replace a failed API call with hardcoded “success” data without a visible demo/fixture label.
- show `0` when the value is missing, suppressed or unavailable.
- show an empty chart without explaining whether there were no observations or a load failure.
- retry a non-idempotent ingestion request automatically unless an idempotency mechanism exists.

### 6.4 Backend exception handling

- Validate at the request boundary.
- Catch known domain exceptions and map them to stable API errors.
- Roll back database transactions after failed writes.
- Log unexpected errors once at the application boundary with request ID and stack trace.
- Do not log secrets, raw ingestion payloads or sensitive details.
- Use timeouts for external HTTP calls.
- Retry only transient network/5xx failures, with a small bounded retry count and backoff.
- Do not retry validation errors, authorization failures or deterministic modelling errors.
- If a detection run fails, preserve the previous successful alert state and mark the latest run as failed; do not overwrite valid results with empty results.

### 6.5 External data-source failures

Open-Meteo is optional. If it fails:
1. Do not fail the whole website.
2. Mark the affected feed as `stale`, `unavailable` or `failed`.
3. Retain last successful observation with its original timestamp, if policy permits.
4. Exclude missing/stale values from fusion according to configured freshness rules.
5. Widen uncertainty or reduce completeness as appropriate.
6. Never silently substitute a synthetic value for a real source value.
7. If a fixture is used for the demo, label it as synthetic/fixture in the API and UI.

---

## 7. API and data-contract rules

- Prefix endpoints with `/api/v1`.
- Use Pydantic request and response schemas for every endpoint.
- Do not expose SQLAlchemy models directly.
- Use ISO date strings (`YYYY-MM-DD`) for observation dates.
- Use ISO 8601 timezone-aware timestamps for event times.
- Use explicit enums for roles, tiers, statuses and stream names.
- Validate query parameters, pagination and filter values.
- Keep response fields stable; document breaking changes.
- Use `404` for unknown IDs and consistent error codes.
- Add pagination before returning unbounded history.
- Include provenance and completeness in responses that represent signals or alerts.
- Include a request ID in logs and error responses.
- Do not allow frontend-supplied role values to determine authorization.
- Keep the OpenAPI spec in sync with implementation.

### 7.1 Aggregate ingestion rules

Allowed conceptual fields:
- `unit_id`
- `date`
- `category`
- `count`
- `stream`
- `source`
- `is_synthetic`
- approved non-identifying quality/provenance metadata

Rules:
- `count` must be a non-negative integer.
- `unit_id` must refer to a known permitted unit.
- `date` must be valid and within the allowed ingestion window.
- `category` and `stream` must be allow-listed.
- Reject additional fields.
- Reject nested records, free text and person identifiers.
- Validate the entire batch before writing, or clearly report per-record outcomes without partial ambiguity.
- Use a transaction for persistence.
- Prevent duplicate ingestion with a documented unique key or idempotency key.
- Keep raw rejected payloads out of logs.

Do not expand the schema to include employee names, patient IDs, dates of birth, phone numbers, addresses, case notes, exact individual event times or individual-level symptoms.

---

## 8. Privacy, roles and security rules

### 8.1 Demo role policy

The prototype roles are:
- Site HSE officer.
- Occupational-health lead.
- District public-health officer.
- Regulator.

The backend must define each role's permitted unit scope and fields. Role permissions must be checked on every endpoint, not only when loading a page.

### 8.2 Demo session

- The role switcher is a demo convenience, not proof of identity.
- Use a signed, HTTP-only, Secure-in-production, SameSite cookie or equivalent server-validated session.
- Keep the session secret in an environment variable.
- Do not accept arbitrary roles from query parameters or JSON bodies as authorization.
- Public hosted demo is read-only.
- Disable ingestion, reseed and administrative endpoints in production demo mode.
- Clearly label the application as a prototype/demo.

### 8.3 Suppression

- Default threshold: `k = 5`.
- Suppress counts smaller than k.
- Apply secondary suppression to prevent totals from revealing a suppressed cell by subtraction.
- Apply suppression before response serialization.
- Apply it consistently to maps, charts, tables, exports, filters and summaries.
- Never send the suppressed raw value to the browser.
- Regulator views do not return health-count detail.
- A suppressed value is not zero and must not be used as zero in downstream calculations.
- Suppression is not differential privacy. Do not describe it as such.

### 8.4 Security basics

- Enforce HTTPS in cloud deployments.
- Use least-privilege database credentials.
- Keep CORS restricted to the actual frontend origin.
- Keep secrets out of source control and frontend bundles.
- Validate and constrain all user input.
- Avoid SQL string concatenation; use SQLAlchemy parameterized operations.
- Do not render untrusted content as raw HTML.
- Keep dependencies updated and remove unused packages.
- Do not expose database ports publicly in production.
- Do not place private health-related data in analytics, error trackers or client logs.
- Use generic public error messages and private structured logs.
- Apply rate limiting to public write endpoints if any are enabled.

---

## 9. Detection and statistical rules

### 9.1 Baselines

- Use the planned negative-binomial GLM baseline with a rolling 12-month fitting window.
- Include day-of-week and relevant seasonal/calendar effects where supported by the generated data.
- Use an appropriate aggregate exposure/headcount offset where the data supports it.
- Document minimum data requirements for fitting.
- If a baseline cannot be fitted, return an explicit insufficient-data state; do not substitute an arbitrary expected value.
- Mark borrowed/pooled baselines for sparse units as such.
- Keep calibration and test scenarios/seeds separate.

### 9.2 Evidence fusion

- Exposure evidence leads; outcome streams confirm.
- Keep contributions interpretable and inspectable.
- Cap individual evidence contributions.
- Discount correlated streams to avoid double counting.
- Missing feeds are excluded, not imputed silently.
- Include data completeness, freshness and uncertainty with every candidate alert.
- Do not convert a fused score into an individual probability or diagnosis.
- Do not use an opaque model trained on the synthetic event labels as the primary detector.

### 9.3 Alert lifecycle

- Tiers: `WATCH`, `ALERT`, `ACTION`.
- Alert persistence: initial rule is at least 2 of the last 3 days, as specified in the architecture/PRD.
- Cooldown: three days, unless a documented product decision changes it.
- Deduplicate by unit/hazard/time window using a documented rule.
- Preserve prior alert history; do not erase an alert merely because a feed goes missing.
- A change in tier or status must have a timestamp and reason.
- Thresholds belong in one backend configuration location, not duplicated across modules.

### 9.4 Comparators and evaluation

- Keep EARS C2, CUSUM and fixed heat/PM threshold comparators.
- Use separate calibration and test seeds/configurations.
- Report sensitivity, lead time, PPV, false alerts per site-month and latency.
- Report missing-feed ablations and robustness checks.
- Label all generated-data metrics as simulated.
- Never call synthetic back-test performance clinical validation or proof of real-world effectiveness.

---

## 10. Synthetic data and reproducibility rules

- Use a fixed seed for every named scenario and evaluation run.
- Store seed, generator version and configuration with results.
- Use separate calibration and test seeds.
- Test parameters must differ from calibration parameters where the evaluation design requires generalisation.
- Generate the intended 12–15 sites across four districts and 24 months of daily aggregate observations.
- Inject 40–60 events across the scenarios, with known ground-truth start/end, hazard and affected units.
- Include seasonality, weekday patterns, holidays, Ramadan/Eid effects, reporting delays, feed outages and noisy sites where planned.
- Do not tune thresholds against the held-out test labels.
- Do not make the synthetic data look like a real named employer's or person's records.
- Keep ground-truth event labels in the evaluation/replay domain; do not leak them into the detector input.
- Replay for a fixed scenario/day/seed must return the same result.

---

## 11. Playbook and content rules

- Store playbooks in YAML under `backend/app/playbooks/rules/`.
- Validate required keys on load; fail fast during startup/tests if a playbook is malformed.
- Do not embed unverified clinical claims.
- Keep guidance references and review dates with each recommendation.
- Recommendations must include: action, owner role, evidence, assumptions, escalation path and review-by.
- Use neutral, non-alarmist language.
- Avoid language that implies diagnosis, certainty or blame.
- Do not recommend disciplinary action, employment screening or individual monitoring.
- Human review must be explicit in the UI and API response.

---

## 12. Frontend UX and accessibility rules

- Use clear, plain language; define technical terms in context.
- Every alert tier must have a text label, not colour alone.
- Every chart must have a title, units, legend and a short interpretation.
- Show date range and time context.
- Distinguish observed, expected, estimated, missing, stale and suppressed values.
- Show provenance close to the relevant chart/card.
- Avoid misleading precision; round values sensibly and disclose assumptions.
- Maps must have a list/table alternative.
- Interactive elements must be keyboard accessible and have visible focus.
- Inputs must have labels and validation messages.
- Buttons must describe the action they perform.
- Do not use animation as the only way to communicate a change.
- Use responsive layouts for laptop and tablet widths.
- Do not use red/green alone to convey status.
- Empty state, loading state and error state are required for each data-driven page.

---

## 13. Logging, monitoring and audit rules

### 13.1 Application logs

- Use structured logs.
- Include timestamp, severity, service, request ID and event name.
- Log processing duration and source status where useful.
- Do not log raw request bodies, names, identifiers, health details or secrets.
- Do not log authentication/session cookies or authorization headers.
- Keep development debug logging separate from production logging.

### 13.2 Audit events

Record relevant events such as:
- Access to protected views.
- Demo role changes.
- Ingestion attempts and safe outcomes.
- Alert status changes, if supported.
- Administrative reseed or configuration changes in development.

Audit events should contain the actor role, event type, resource reference, timestamp and request ID. Do not store sensitive payloads in audit metadata.

### 13.3 Health endpoints

- Provide `/health` for process health.
- If adding a readiness endpoint, check database connectivity separately.
- Do not expose secrets, connection strings or internal diagnostics in health responses.

---

## 14. Testing rules

### 14.1 Required backend tests

- Aggregate ingestion rejects unknown/person-level fields.
- Negative counts and invalid dates are rejected.
- Duplicate ingestion behaves deterministically.
- Suppression masks values below k.
- Secondary suppression prevents reconstruction from totals.
- Site role cannot retrieve another site's restricted data.
- District and regulator roles receive only permitted fields.
- Missing feeds are excluded from fusion.
- Alert persistence, cooldown and deduplication work.
- Fixed seed produces deterministic synthetic data.
- Fixed replay input produces deterministic output.
- Malformed playbook YAML fails validation.
- Database transaction rolls back after failed persistence.

### 14.2 Required frontend tests

- API client handles non-2xx responses.
- Loading, empty, stale, missing and error states render correctly.
- Suppressed values display as suppressed, not zero.
- Provenance labels are visible.
- Risk tiers are understandable without colour.
- Role switcher updates the API-backed view.
- Map alternative list is available.

### 14.3 Required end-to-end path

1. Open the overview.
2. Select the occupational-health demo role.
3. Open a respiratory alert.
4. Inspect observed-versus-expected evidence and contribution explanation.
5. Read the recommended action, owner, assumptions and review date.
6. Switch to regulator role and verify health-count details are unavailable.
7. Open a scenario replay and move to a known day.
8. Open validation and confirm the simulated-data label is visible.

Do not merge a change that breaks this core path without an explicit, agreed reason.

---

## 15. Performance and reliability rules

For the prototype:
- Keep the seeded dataset small enough for straightforward PostgreSQL queries.
- Add indexes for unit/date/stream and alert tier/status/time filters.
- Avoid N+1 database queries in alert and overview endpoints.
- Paginate unbounded alert history.
- Set explicit timeouts on external HTTP requests.
- Avoid loading all 24 months of all streams into the browser at once.
- Fetch only the selected date range, unit or scenario needed by the page.
- Cache only where the invalidation behaviour is understood.
- Do not introduce a queue or distributed cache just to optimise an unmeasured bottleneck.
- Keep the overview functional if an optional external source is unavailable.

---

## 16. Environment and deployment rules

### 16.1 Environment separation

- `development`: local developer setup, test fixtures and debug logging.
- `test`: isolated database and deterministic test data.
- `production/demo`: hosted, read-only demonstration with demo role switcher.

Never point tests at the production database. Never run a destructive reseed against production.

### 16.2 Configuration

- Use `.env.example` to document required variables.
- Validate required environment variables at startup.
- Keep secrets in local `.env` or hosting-provider secret settings.
- Prefix only browser-safe frontend variables with `NEXT_PUBLIC_`.
- Do not expose `DATABASE_URL`, session secrets or provider credentials to the browser.

### 16.3 Deployment

- Run migrations as a controlled release/deploy step.
- Verify health endpoint after deployment.
- Restrict CORS to the actual frontend domain.
- Disable public write endpoints in the hosted demo.
- Seed demo data through a controlled one-time script or private admin process.
- Verify the complete demo path after every production deployment.
- Keep a known-good deploy and recovery procedure.

---

## 17. What contributors must not build

Unless the PRD and team explicitly change scope, do not build:

- Individual-level prediction, diagnosis or risk scoring.
- Patient/employee record ingestion or real EHR integration.
- Personal profiles, names, employee IDs, patient IDs or case notes.
- Automated intervention dispatch or workplace enforcement.
- Disciplinary, productivity or employee-performance monitoring.
- An LLM-generated risk score or unverified medical recommendation.
- Differential privacy claims without an implemented, documented mechanism and epsilon.
- A full production identity platform during the prototype.
- Microservices, Kubernetes, message brokers or a second database.
- A mobile application.
- A real-time streaming platform if scheduled/batch updates meet the prototype need.

If a new feature appears to require one of these, stop and discuss the scope change before implementing it.

---

## 18. Definition of done

A feature is complete only when:

- [ ] It satisfies the relevant PRD acceptance criteria.
- [ ] It follows the architecture and layer boundaries.
- [ ] Types and schemas are explicit.
- [ ] Authorization is enforced server-side where relevant.
- [ ] Privacy and suppression are applied where relevant.
- [ ] Loading, empty, partial, stale and error states are handled.
- [ ] Tests cover the main path and important failure cases.
- [ ] No secrets or sensitive data are committed or logged.
- [ ] Synthetic/real/fixture provenance is visible where relevant.
- [ ] Documentation and assumptions are updated.
- [ ] The relevant lint, type-check and test commands pass.
- [ ] The core hosted demo flow still works.

---

## 19. Quick decision rule

When unsure how to implement something, use this order:

1. Does the PRD require it? If not, do not add it during the prototype unless it removes a concrete risk.
2. Which architecture layer owns it? Put it there; do not duplicate it.
3. Can it expose person-level or suppressed information? If yes, reject or redesign it.
4. Can the user understand why the system produced the result? If not, improve explainability before adding complexity.
5. What happens when the input, feed, database or service fails? Define the failure state before shipping.
6. Can the same input reproduce the same output? If not, make randomness/configuration explicit.
7. Is a new library or service necessary? Prefer the existing stack unless a measurable requirement justifies the addition.

**Canary's engineering standard:** build the smallest system that is explainable, reproducible, privacy-protective and useful to a human reviewer. A feature that looks impressive but violates those properties does not belong in the prototype.
