# PRD: Canary

## Population and Workforce Health Early-Warning Platform

**Challenge:** Future Health Digital Innovation Challenge --- Challenge
06\
**Document type:** Product Requirements Document\
**Version:** 1.0\
**Source plan dated:** 6 November 2026\
**Prototype target:** 20 November 2026

------------------------------------------------------------------------

## 1. Product overview

Canary is an early-warning and decision-support platform that detects
emerging population and workforce health risks by combining
environmental exposure signals with aggregated health-service and
workplace outcome signals.

It is designed to identify unusual changes earlier than a system that
monitors any one signal in isolation. When a potential risk is detected,
Canary should explain what changed, where and when the change is
occurring, how complete the available data is, and what proportionate
action a responsible human should consider.

**Product promise:** Sense emerging risk, explain the evidence, and help
the right people act sooner.

### Core design principle

**Exposure leads; outcomes confirm.**

Environmental signals---such as heat, particulate matter and
dust---provide an early indication of possible risk. Changes in
aggregated outcomes---such as absence, clinic visits, first-aid visits
and incident reports---provide additional evidence. Canary combines
these signals without treating correlation as proof of causation.

### Intended prototype

The prototype will demonstrate the same detection and decision-support
workflow across three simulated scenarios:

1.  Respiratory risk associated with a dust or PM2.5 episode.
2.  A gastrointestinal illness cluster associated with shared
    accommodation and connected workplaces.
3.  An increase in heat-related illness indicators.

The prototype is a decision-support demonstration, not a clinical
product or a deployed public-health surveillance service.

------------------------------------------------------------------------

## 2. Problem and opportunity

Environmental hazards, health-service activity and workplace outcomes
are often monitored in separate systems. This can make it difficult for
occupational-health and public-health teams to notice a developing
pattern across sites, understand how different signals contribute to it,
and coordinate a timely response.

Canary addresses this gap by:

-   Combining materially different signal types in one monitoring
    workflow.
-   Comparing observed activity with an expected baseline.
-   Detecting unusual changes across sites, neighbouring locations and
    time windows.
-   Showing the evidence behind each alert rather than presenting an
    unexplained risk score.
-   Connecting alerts to proportionate response playbooks, responsible
    roles and review dates.
-   Measuring detection performance against single-signal baselines.

The prototype must make clear which data is real, which is simulated,
and which outputs are illustrative estimates.

------------------------------------------------------------------------

## 3. Goals and success criteria

### 3.1 Product goals

1.  Detect emerging risk patterns using multiple independent signal
    types.
2.  Explain each alert in a way that a non-technical operational user
    can understand.
3.  Recommend proportionate next steps with a named responsible role and
    supporting evidence.
4.  Protect privacy by design through aggregate-only data contracts and
    controlled views.
5.  Demonstrate performance through reproducible back-testing and
    transparent comparisons.
6.  Show a credible path from a simulated prototype to a shadow-mode
    pilot using real aggregate data.

### 3.2 Prototype acceptance criteria

The prototype is considered functionally complete when:

-   A user can open the overview and see site or district risk tiers and
    data-completeness status.
-   At least two materially different signal types contribute to a
    demonstrated alert.
-   A user can open an alert and see observed versus expected values,
    contributing signals, location, time window,
    uncertainty/completeness and recommended action.
-   The same detection workflow can replay the three defined scenarios,
    subject to the agreed feature cut line.
-   The validation view reports event-level sensitivity, lead time,
    alert-level positive predictive value (PPV), false alerts per
    site-month and ablation results on held-out synthetic test data.
-   The privacy demonstration masks small counts and prevents users from
    inferring masked values through totals or alternate views.
-   The ingestion contract rejects person-level or otherwise disallowed
    fields.
-   The hosted demo can be explored using seeded data and read-only demo
    roles.
-   Technical documentation states assumptions, limitations, data
    provenance and the simulated nature of outcome data.

Numerical performance targets must be calibrated and reported from test
data; the product must not claim a performance result before the
back-test has produced it.

------------------------------------------------------------------------

## 4. Users and permissions

### 4.1 Primary users

  -----------------------------------------------------------------------
  User                    Main need               Prototype access
  ----------------------- ----------------------- -----------------------
  Site HSE officer        Understand risk at      Own-site operational
                          their site and take     view
                          appropriate preventive  
                          steps                   

  Occupational physician  Review patterns across  Aggregated multi-site
  / occupational-health   multiple sites and      view
  lead                    assess health           
                          implications            

  District public-health  Identify broader        District-level
  officer                 district patterns and   aggregate view
                          coordinate a response   

  Regulator               Review relevant         Compliance-only view
                          compliance indicators   
                          without accessing       
                          health-count detail     
  -----------------------------------------------------------------------

### 4.2 Permission principles

-   A site HSE officer sees only the site-level information permitted
    for their role.
-   An occupational-health role can see permitted multi-site aggregates.
-   A district public-health role sees district-level aggregates.
-   A regulator view is limited to compliance indicators.
-   Every access to a protected view is recorded in an audit log.
-   A role switcher in the prototype is a demonstration control, not a
    substitute for production identity and access management.

------------------------------------------------------------------------

## 5. Scope

### 5.1 In scope for the prototype

-   Aggregate environmental, service and workplace signal ingestion.
-   Synthetic service and workplace outcome data.
-   Real environmental data where API coverage and reliability permit.
-   Expected-versus-observed monitoring and anomaly detection.
-   Multi-signal risk fusion and risk tiers.
-   Site, neighbour and district cluster analysis where feasible.
-   Explainable alert details.
-   Action playbooks and human review.
-   Aggregate-only privacy controls, small-cell suppression and
    role-based demo views.
-   Scenario replay.
-   Back-testing and comparison with single-signal baselines.
-   Illustrative impact estimation with visible assumptions.
-   Technical and governance documentation.
-   Hosted, seeded, read-only demonstration.

### 5.2 Explicitly out of scope

-   Individual-level risk prediction or profiling.
-   Diagnosis, treatment decisions or automated clinical
    recommendations.
-   Names, employee IDs, patient IDs, individual records or other
    person-level data.
-   Disciplinary, employment-performance or worker-monitoring use.
-   A mobile application.
-   Production integration with live EHR, HIE or employer systems.
-   Automated dispatch or execution of interventions.
-   Claims that simulated results establish real-world clinical
    effectiveness.
-   A production-grade regulatory compliance certification.

Adapters or interface contracts for future integrations may be
documented, but real integrations are not part of this prototype.

------------------------------------------------------------------------

## 6. Core features and functional requirements

### Feature 1 --- Multi-signal data ingestion

**Purpose:** Bring together different types of risk signals in a
consistent, privacy-protective format.

**Supported signal groups**

1.  **Environmental**
    -   Temperature and humidity.
    -   Derived heat-stress indicator / WBGT approximation, clearly
        labelled as an approximation.
    -   PM2.5 and PM10 / dust indicators.
    -   Forecast and historical observations where available.
2.  **Health-service**
    -   Aggregated clinic or first-aid visits by syndrome.
    -   Aggregated teleconsultation or helpline symptom-query counts,
        where represented in the scenario data.
3.  **Workplace**
    -   Aggregated sickness-absence counts.
    -   Aggregated first-aid visits.
    -   Aggregated incident and near-miss reports.

**Requirements**

-   Ingest data at an explicitly documented unit and time resolution.
-   Accept only approved aggregate fields: unit, date, category and
    count, plus approved non-identifying metadata required for the data
    contract.
-   Reject individual-level fields and unexpected payload structures.
-   Record source, observation time, ingestion time and data
    completeness.
-   Identify late, missing, stale or failed feeds.
-   Do not silently replace missing values with estimated observations.
-   Keep real environmental observations distinguishable from synthetic
    outcome signals in the UI and documentation.

**Prototype data plan**

-   Environmental data: Open-Meteo forecast, archive and air-quality
    APIs for selected Abu Dhabi, Al Ain and Dubai locations, subject to
    coverage checks.
-   Service and workplace outcomes: reproducibly generated synthetic
    data, clearly labelled as simulated.

### Feature 2 --- Synthetic scenario and data generator

**Purpose:** Create realistic, repeatable data for demonstrating
detection and evaluating performance when private operational data is
unavailable.

**Initial generator configuration**

-   12--15 sites across four districts.
-   Site types: construction site, labour accommodation, logistics hub
    and office.
-   Headcount represented as bands or approved aggregate exposure
    denominators, not individual records.
-   24 months of daily observations.
-   Day-of-week effects, annual seasonality, public holidays and
    Ramadan/Eid-related pattern changes.
-   Outcome categories: respiratory, gastrointestinal, heat-related and
    injury.
-   District-level teleconsultation query counts.
-   40--60 injected events with known synthetic ground-truth labels.
-   Variation in event size, ramp-up pattern and delay between exposure
    and outcome.
-   Confounders including reporting delays, feed outages, noisy sites
    and holiday-related absence changes.
-   Fixed seeds for reproducibility; calibration and test seeds must use
    different generator parameters.

**Requirements**

-   Clearly label generated records and scenario outputs as synthetic.
-   Keep test scenarios separate from calibration scenarios.
-   Make event start, end, affected units, event type and severity
    available to the evaluation harness.
-   Allow the demo to replay a scenario consistently.

### Feature 3 --- Expected-versus-observed monitoring

**Purpose:** Show whether a signal is behaving unusually compared with
its expected pattern.

**Requirements**

-   Maintain a baseline for each eligible signal stream and monitoring
    unit.
-   Account for day-of-week patterns, annual seasonality, holiday
    effects and an appropriate exposure/headcount offset.
-   Use a negative-binomial GLM as the planned baseline method, with a
    rolling 12-month fitting window.
-   Allow sparse units to borrow statistical strength from comparable
    unit types.
-   Display expected values, observed values and an uncertainty or
    exceedance indicator.
-   Show data completeness beside the signal so that users can interpret
    the result in context.
-   Make baseline limitations visible when data is sparse or incomplete.

### Feature 4 --- Multi-signal risk fusion

**Purpose:** Combine exposure and outcome evidence into a more useful
early-warning signal.

**Requirements**

-   Use environmental hazard signals to inform the prior risk estimate.
-   Add evidence from relevant outcome streams using a transparent,
    documented fusion method.
-   Discount correlated streams from the same underlying source to
    reduce double-counting.
-   Cap individual evidence contributions so that one extreme stream
    cannot dominate without limit.
-   Use domain-informed starting weights and calibrate alert thresholds
    on held-out scenarios.
-   Do not train an opaque machine-learning model on the same synthetic
    generator labels used to evaluate it.
-   Expose the contributing signals and their relative contribution in
    the alert detail view.
-   Treat the resulting score as a prioritisation aid, not a probability
    of an individual becoming ill.

### Feature 5 --- Alert tiers and lifecycle

**Purpose:** Convert detection results into a manageable operational
queue.

**Tiers**

-   **Watch:** A developing signal merits monitoring; no or minimal-cost
    action.
-   **Alert:** Multiple or persistent signals justify a low-cost
    preventive response.
-   **Action:** Stronger or sustained evidence warrants a higher-level
    response or escalation.

**Requirements**

-   An Alert should require persistence, initially defined as at least
    two of the last three days.
-   Apply an initial three-day cooldown and deduplicate by monitoring
    unit and hazard type.
-   Target no more than one false Alert per site-month during
    calibration; report the actual test result rather than implying the
    target has been achieved.
-   Display tier, hazard/syndrome, unit, start time,
    confidence/completeness and current status.
-   Preserve a traceable alert history for replay and evaluation.
-   Make clear that a tier is a system-generated decision-support
    classification and requires human interpretation.

### Feature 6 --- Spatial and temporal cluster detection

**Purpose:** Identify whether a developing signal is concentrated in a
site, shared network or wider district.

**Requirements**

-   Represent relationships between sites using a documented site graph,
    including relevant shared accommodation, transport or district
    links.
-   Evaluate single-site, neighbouring-site and district-level zones.
-   Evaluate 1-, 3- and 7-day time windows.
-   Use a Poisson space-time scan statistic as the planned method.
-   Report the highest-scoring zone and time window, along with the
    supporting evidence.
-   Calculate a Monte Carlo significance estimate for the selected top
    zone where feasible.
-   If geolocation is missing, roll up to the district rather than
    inventing a location.
-   If the spatial scan cannot be completed within the prototype
    schedule, fall back to transparent site-level and district-level
    aggregation and document the limitation.

### Feature 7 --- Explainable alert detail

**Purpose:** Let a user understand why an alert exists and what evidence
supports it.

Every alert detail must present:

1.  **What changed**
    -   Observed versus expected values.
    -   Signal history and expected range.
    -   Relevant hazard and outcome streams.
2.  **Why the system raised the alert**
    -   Contribution breakdown / waterfall.
    -   Persistence and tiering logic.
    -   Any relevant correlation discount or missing input.
3.  **Where and when**
    -   Affected site, neighbouring zone or district.
    -   Selected time window.
    -   Event start and recent trend.
4.  **How reliable the evidence is**
    -   Feed completeness.
    -   Missing or delayed inputs.
    -   Uncertainty and known assumptions.
    -   Data freshness / processing latency.
5.  **What to consider doing**
    -   Suggested action.
    -   Responsible role.
    -   Evidence supporting the suggestion.
    -   Assumptions and escalation path.
    -   Review-by date.

The UI must avoid presenting a single unexplained score as the reason
for an alert.

### Feature 8 --- Action playbooks and human review

**Purpose:** Translate alert evidence into practical, proportionate next
steps.

**Requirements**

-   Store playbooks in editable YAML so that content can be updated
    without changing detection code.
-   Map hazard, syndrome and tier to suggested action, responsible role,
    evidence, assumptions, escalation path and review-by date.
-   Display the source or guidance reference supporting each playbook
    entry.
-   Label all recommendations as decision support.
-   Require human review and sign-off; the system must not automatically
    execute interventions.
-   Scale action intensity with the alert tier.

**Initial playbook examples**

  -----------------------------------------------------------------------
  Scenario                Example suggested       Responsible role
                          actions                 
  ----------------------- ----------------------- -----------------------
  Respiratory risk with   Review respiratory      Occupational-health
  dust / PM2.5            protection supply,      nurse; district
                          accommodation           public-health officer
                          ventilation and         if cross-site
                          relevant health         
                          messaging               

  Gastrointestinal        Review water and food   Camp manager and
  cluster in              safety, arrange         environmental-health
  accommodation           appropriate             officer
                          environmental checks    
                          and follow local        
                          procedures for          
                          symptomatic people      

  Heat-related uptick     Review work scheduling, Site HSE officer;
                          rest-water-shade        occupational physician
                          practices and buddy     on escalation
                          checks                  
  -----------------------------------------------------------------------

These examples are prototype playbook content, not universal medical or
regulatory instructions. Final wording and references must be checked
against applicable WHO, ILO and occupational-health guidance.

### Feature 9 --- Privacy, governance and responsible use

**Purpose:** Make privacy protection and appropriate use part of the
product architecture, not merely a policy statement.

**Requirements**

-   Aggregate-only ingestion contract.
-   No person-level schema fields, identifiers or records.
-   Reject row-level payloads at the API boundary.
-   Apply small-cell suppression with a configurable default threshold
    of k=5.
-   Apply secondary suppression or parent-level roll-up where totals
    could reveal a masked value.
-   Do not allow filters, exports or alternate views to reconstruct
    suppressed cells.
-   Enforce role-based access in the backend, not only by hiding
    frontend controls.
-   Record access to protected views in an audit log.
-   Keep regulator views limited to compliance indicators.
-   State an explicit no-disciplinary-use and
    no-individual-employment-profiling boundary.
-   Document purpose limitation, retention assumptions, data contract,
    model card and limitations.
-   If differential-privacy noise is implemented, document the mechanism
    and epsilon; otherwise do not imply that suppression alone is
    differential privacy.
-   Verify applicable UAE health-data and data-protection requirements
    before making legal-compliance claims.

**Privacy acceptance tests**

-   A payload containing a name, employee ID, patient ID or individual
    record is rejected.
-   Counts below k are masked.
-   Related totals cannot be used to calculate a suppressed count.
-   A user cannot access another role's data by calling an API endpoint
    directly.
-   Protected-view access is recorded.
-   The regulator role cannot retrieve health-count detail.

### Feature 10 --- Data quality and missing-input handling

**Purpose:** Prevent incomplete or unreliable feeds from creating false
confidence.

**Requirements**

-   Calculate and display completeness per stream and unit.
-   If a stream is missing, remove its contribution rather than silently
    imputing it.
-   Widen uncertainty or lower confidence when expected inputs are
    unavailable.
-   Mark stale and delayed data.
-   Roll up records with missing geolocation to a supported parent
    geography.
-   Preserve enough metadata to distinguish no reported events from no
    available data.
-   Show feed failure or missingness in the overview and alert detail.

### Feature 11 --- Scenario replay

**Purpose:** Help users and evaluators understand how a risk pattern
develops and when Canary responds.

**Requirements**

-   Provide day-by-day replay for each supported scenario.
-   Allow the user to move through the timeline.
-   Show the evolving signals and alert tier.
-   Mark when Canary raises a Watch, Alert or Action tier.
-   Mark when comparator methods raise their alerts.
-   Display the evidence available at each point in time.
-   Keep replay output deterministic for a fixed scenario and seed.

### Feature 12 --- Back-testing and operational validation

**Purpose:** Evaluate whether multi-signal detection adds measurable
value over simpler approaches.

**Comparators**

1.  EARS C2 using absence alone.
2.  CUSUM using clinic visits alone.
3.  A fixed heat or PM2.5 threshold alone.
4.  Canary multi-signal fusion.

**Report on held-out test seeds**

-   Event-level sensitivity.
-   Lead time in days versus each comparator.
-   Lead time versus the day a defined clinical-significance threshold
    is crossed.
-   Alert-level PPV.
-   False alerts per site-month.
-   Ingest-to-alert processing latency.
-   Data refresh cadence: environmental hazard feeds targeted hourly and
    outcome feeds daily.
-   Performance when feeds are removed or degraded.

**Ablation and robustness tests**

-   Remove each feed in turn.
-   Remove geolocation.
-   Add a two-day reporting delay.
-   Add 30% noise.
-   Report the resulting performance degradation.

**Requirements**

-   Keep calibration and test seeds separate.
-   Report the test configuration and definitions used for every metric.
-   Do not present synthetic test performance as real-world clinical
    validation.
-   State clearly that the harness is intended to run unchanged on real
    aggregate data in a future shadow-mode pilot.

### Feature 13 --- Illustrative health and resilience impact estimator

**Purpose:** Show how earlier detection could create an opportunity for
preventive action without claiming proven impact.

**Requirements**

-   Estimate the number of cases, severe incidents and absence days that
    might be avoided under stated assumptions.
-   For each simulated event, estimate the cases occurring between the
    Canary alert and the comparator alert.
-   Apply explicit intervention uptake and effectiveness assumptions.
-   Show low, base and high scenarios.
-   Allow users to adjust key assumptions using visible controls.
-   Display the calculation method, source references and caveats.
-   Label every output as illustrative and scenario-based, not observed
    or proven impact.

### Feature 14 --- Optional plain-language alert summary

**Purpose:** Make technical evidence easier to understand without
allowing generated text to change system decisions.

**Requirements**

-   The preferred prototype implementation is a deterministic template.
-   An optional LLM may turn structured evidence into a plain-language
    explanation.
-   The LLM must not set alert tiers, alter numerical values, invent
    evidence or choose actions.
-   The structured alert record remains the source of truth.
-   A deterministic fallback must work if the LLM is unavailable.
-   Any generated summary must be clearly traceable to the structured
    evidence shown alongside it.

This feature is optional and should be cut before core detection,
privacy or validation work.

------------------------------------------------------------------------

## 7. Main application screens

### Screen 1 --- Overview map

-   Map of sites and districts.
-   Risk tier shown by site or district.
-   Data-completeness indicator.
-   Role switcher for demo purposes.
-   Clear indication of stale or unavailable feeds.
-   Selecting a site opens its permitted detail.

### Screen 2 --- Alert inbox

-   List of current and historical alerts.
-   Tier, hazard/syndrome, unit, start time and confidence/completeness.
-   Filters by role-permitted unit, tier and hazard.
-   Clear empty, loading and error states.

### Screen 3 --- Alert detail

-   Observed-versus-expected signal strips.
-   Contribution waterfall.
-   Affected zone and time window.
-   Data completeness, freshness and uncertainty.
-   Suggested action, responsible role, evidence, assumptions,
    escalation path and review-by date.
-   Human-review / decision-support disclaimer.

### Screen 4 --- Scenario replay

-   Scenario selector.
-   Day-by-day timeline control.
-   Evolving signal view.
-   Canary and comparator alert markers.
-   Event ground-truth marker for evaluation/demo context.

### Screen 5 --- Validation

-   Metric summary table.
-   Lead-time comparison chart.
-   False alerts and PPV.
-   Ablation / robustness results.
-   Visible label that results use simulated data.

### Screen 6 --- Privacy and governance

-   Aggregate-only data contract explanation.
-   Live small-cell suppression example.
-   Role-specific view demonstration.
-   Audit-log example.
-   No-disciplinary-use boundary.

### Screen 7 --- Impact estimator

-   Low, base and high estimates.
-   Adjustable assumptions.
-   Visible calculation and caveats.
-   Clear illustrative-only label.

------------------------------------------------------------------------

## 8. Data model and API expectations

### 8.1 Canonical aggregate record

The ingestion contract should use a small, explicit schema. The planned
core fields are:

-   `unit_id`: approved site, zone or district identifier.
-   `date`: observation date or time bucket.
-   `category`: approved signal or syndrome category.
-   `count`: aggregate count.

Additional source and quality metadata may be included only where
documented and non-identifying. Person-level identifiers and row-level
records are prohibited.

### 8.2 Initial API contract

  -----------------------------------------------------------------------------------
  Method                  Endpoint                            Purpose
  ----------------------- ----------------------------------- -----------------------
  GET                     `/units`                            Return permitted
                                                              monitoring units

  GET                     `/signals?unit_id&from&to&stream`   Return permitted
                                                              aggregate signal
                                                              history

  GET                     `/alerts?role&tier`                 Return alerts visible
                                                              to the selected role

  GET                     `/alerts/{id}`                      Return alert evidence,
                                                              zone, window,
                                                              recommendation and
                                                              completeness

  GET                     `/backtest/summary`                 Return validation
                                                              metrics

  GET                     `/replay/{scenario}?day=`           Return scenario state
                                                              for a selected day

  POST                    `/ingest`                           Accept approved
                                                              aggregate records only
  -----------------------------------------------------------------------------------

The backend must enforce role permissions and validate request
parameters. The frontend must not be treated as a security boundary.

### 8.3 Alert response should include

-   Alert ID, tier, hazard/syndrome and status.
-   Unit / zone and selected time window.
-   Start and last-updated timestamps.
-   Observed and expected values.
-   Contributing streams and contribution values.
-   Completeness, freshness and uncertainty indicators.
-   Recommendation: action, owner role, evidence, assumptions,
    escalation path and review-by date.
-   Synthetic/real provenance labels.

------------------------------------------------------------------------

## 9. Non-functional requirements

### Reliability and usability

-   The demo must start from documented instructions and seeded data.
-   Core screens must have loading, empty and error states.
-   A failed optional service must not prevent the core demo from
    running.
-   Scenario replay must be deterministic for a fixed seed.

### Performance

-   The prototype should return common dashboard and alert requests
    quickly enough for a live demonstration.
-   Record ingest-to-alert processing latency in the evaluation harness.
-   Do not claim production-scale throughput from prototype
    measurements.

### Maintainability

-   Keep ingestion, privacy validation, baseline modelling, fusion,
    cluster detection, tiering, playbooks and API layers separate.
-   Keep playbook content editable without changing detection code.
-   Use typed request/response schemas and shared API fixtures.
-   Document configuration values and model assumptions.

### Accessibility and clarity

-   Use plain language for operational summaries.
-   Do not rely on colour alone to communicate alert tiers.
-   Include labels and legends for maps and charts.
-   Make synthetic data and illustrative estimates visibly identifiable.

------------------------------------------------------------------------

## 10. Technical direction

The following is the proposed prototype stack, subject to team
confirmation.

  Layer                 Proposed technology
  --------------------- --------------------------------------------------
  Frontend              Next.js and TypeScript
  Map                   MapLibre or Leaflet
  Charts                Recharts or ECharts
  Backend API           FastAPI (Python)
  Data processing       pandas, NumPy
  Statistical methods   statsmodels, SciPy
  Local storage         DuckDB or SQLite
  Weather cache         Parquet
  Deployment            Docker Compose; hosted demo on Render or similar

### Planned processing flow

`Ingest → Validate aggregate-only contract → Privacy gate → Data-quality checks → Baselines → Fusion and cluster scan → Tiering → Playbook lookup → API and UI`

The optional LLM, if used, sits after the structured alert and
recommendation have been created. It may phrase the evidence but cannot
alter the decision.

------------------------------------------------------------------------

## 11. Assumptions, dependencies and open questions

### Current assumptions

-   The prototype will use synthetic health-service and workplace
    outcome data because suitable public operational data is not assumed
    to be available.
-   Open-Meteo coverage for selected locations will be checked before
    the team relies on historical air-quality observations.
-   A headcount band or other approved aggregate exposure denominator
    may be used for normalisation.
-   The prototype will be evaluated using synthetic ground truth and
    held-out generator seeds.
-   The demo will use seeded data and read-only roles.

### Open questions to resolve

-   Confirm official submission format, timezone and final deadline.
-   Review organiser FAQ answers on data use, intellectual property and
    submission requirements.
-   Confirm any newly published rules from the organiser's live
    sessions.
-   Verify applicable UAE health-data and data-protection requirements
    before naming them in compliance claims.
-   Confirm availability and historical coverage of environmental data
    feeds.
-   Confirm the exact definition of the clinical-significance threshold
    used in lead-time evaluation.
-   Confirm the evidence sources and wording for each playbook action.

Do not present unresolved items as verified facts.

------------------------------------------------------------------------

## 12. Risks and mitigations

  -----------------------------------------------------------------------
  Risk                                Mitigation
  ----------------------------------- -----------------------------------
  Synthetic outcomes are mistaken for Persistent synthetic-data labels in
  real surveillance data              UI, demo, metrics and documentation

  Synthetic generator makes           Separate calibration and test
  validation circular                 seeds; vary test generator
                                      parameters

  Correlated feeds inflate the risk   Discount correlated streams and
  score                               show contribution details

  Missing feeds create false          Completeness indicators,
  reassurance                         uncertainty widening and explicit
                                      missingness

  Small-cell suppression can be       Secondary suppression, roll-up and
  reversed from totals                API-level tests

  Prototype is mistaken for diagnosis Repeated decision-support language
  or automated intervention           and mandatory human review

  Scope exceeds the delivery window   Protect core end-to-end workflow;
                                      apply the cut order below

  Environmental API coverage is       Validate coverage early and use
  incomplete                          clearly labelled fallback fixtures
                                      if necessary
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 13. Priorities and delivery cut lines

### P0 --- Must work

-   End-to-end ingestion and seeded data.
-   At least two materially different signal types.
-   Baseline and multi-signal alert generation.
-   Alert explanation with observed/expected values and contributing
    signals.
-   Action recommendation with owner, evidence and assumptions.
-   Aggregate-only privacy boundary and small-cell suppression.
-   Validation table with single-signal comparators.
-   Documentation of assumptions, limitations and synthetic data.
-   Hosted demo with seeded data.

### P1 --- Important if time permits

-   Spatial scan across site relationships.
-   Three complete scenario replays.
-   Full role-specific views and audit-log demonstration.
-   Impact estimator with low/base/high assumptions.
-   Ablation and robustness charts.
-   Environmental live API integration and caching.

### P2 --- Stretch

-   Differential-privacy noise for public/regulator-facing views.
-   Optional LLM-generated plain-language summary with deterministic
    fallback.
-   Public health-series demonstration using an appropriate real
    dataset.
-   Advanced replay controls and additional visual polish.

### Cut order if delivery is at risk

1.  Public real-data stretch.
2.  Differential-privacy noise.
3.  LLM narrative; use deterministic templates.
4.  Full spatial scan; fall back to site and district aggregation.
5.  Advanced replay controls.
6.  Third scenario.

Do not cut the privacy boundary, honest data provenance, alert
explanation, action ownership or core validation.

------------------------------------------------------------------------

## 14. Definition of done

The prototype is ready for submission when:

-   A fresh clone can be set up using the documented instructions.
-   The application runs with seeded data.
-   The demo shows at least one complete multi-signal alert from input
    through explanation and recommended action.
-   The supported scenarios can be demonstrated reliably, or any
    deferred scenario is documented.
-   The privacy tests pass for rejected row-level data, suppression,
    role access and audit logging.
-   The validation report is reproducible and clearly labels simulated
    results.
-   The model card, data-governance note, assumptions and limitations
    are included.
-   The hosted demo is accessible using read-only demo roles.
-   The README, technical documentation, presentation and demo narrative
    make no unsupported claims about clinical effectiveness, legal
    compliance or production readiness.

------------------------------------------------------------------------

## 15. Suggested repository documentation

Keep this PRD in the project root as `PRD.md`. Maintain the following
documents separately so the product requirements do not become mixed
with day-to-day project management:

-   `README.md` --- setup, run instructions and project overview.
-   `ARCHITECTURE.md` --- components, data flow and technical decisions.
-   `MODEL_CARD.md` --- intended use, methods, evaluation and
    limitations.
-   `DATA_GOVERNANCE.md` --- data contract, privacy controls, purpose
    limitation and retention assumptions.
-   `ASSUMPTIONS.md` --- assumptions, unresolved questions and evidence.
-   `CHANGELOG.md` --- meaningful changes between versions.

**Source basis:** This PRD refines the team's *Canary: Challenge 06
Build Plan* dated 6 November 2026. It preserves the plan's stated
concept, scenarios, technical direction and constraints while
reorganising them into product requirements and acceptance criteria. Any
unresolved or unverified items remain explicitly marked as open
questions.
