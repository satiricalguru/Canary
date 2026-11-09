# Canary release audit

This audit compares the Challenge 06 build plan with the running demo. The browser used the bundled Next.js fixture endpoints. The FastAPI pipeline was exercised separately with a synthetic replay and automated contract tests.

| Surface | Verified interaction | Change or boundary |
| --- | --- | --- |
| Landing | Forward and backward film scrubbing, moving captions, skip link, desktop and mobile layout | The hero workflow link now opens the workflow section. Reduced motion shows the static treatment. |
| Surveillance room | Area selection, data legend, theme switch, accessible chart table | The Dubai dossier and dashboard trends are illustrative examples. |
| Surveillance map | District selection, marker inspection, filtered empty state | Removed the date scrubber that changed its label without fetching history. The map links to Scenario Replay for temporal data. Site markers and district buttons are keyboard operable. |
| Alerts and evidence | Search, tier filters, reset, alert navigation, role changes | Stale requests are cancelled when the filter or role changes. The alert shows its reported window. Removed the slice buttons that did not change evidence. Reviews report recording failures. |
| Scenario replay | Scenario switch, day slider, keyboard step, transport controls | The timeline and evidence derive from one trajectory per scenario. Playback shortcuts leave focused controls alone. |
| Validation | Comparator table, timing comparisons, missing-feed results | Replaced the previous fixture metrics with the checked-in backtest. CI checks that the website snapshot matches the report. |
| Privacy | Threshold changes, aggregate acceptance, identifier rejection | The sandbox labels raw inputs as synthetic. Requests cancel on threshold changes, and the page reports validator or preview failures. The demo audit log records known events and discards submitted free text. |
| Impact | Slider interaction and projection update | Estimates remain illustrative and depend on user-controlled assumptions. |
| Settings | Role selector, threshold preview, feed switches | Preview switches change the demonstration UI. They do not configure a running pipeline. |

## Verification scope

- Browser walkthrough at desktop, phone, and 320-pixel widths with a reduced-motion pass.
- Axe found no violations in the selected WCAG A/AA rules across ten routes in the default theme. This automated check covers the sampled page states.
- Production Next.js build, Python tests, Ruff lint and formatting checks, fresh synthetic backtest and report gate.
- Local launcher and backend HTTP smoke checks. GitHub Actions owns the Docker Compose smoke test.
- Media review of the actual website GIF and the narrated MP4, with transcript and captions included.

## Before a pilot

- Connect authorized aggregate data in a shadow environment and set an alert budget with reviewers.
- Replace demo role selection with authenticated organization and site scope.
- Evaluate case detection, false alerts, response time, and real-world impact across an agreed pilot window.

See the [model card](../MODEL_CARD.md), [data governance](../DATA_GOVERNANCE.md), and [validation protocol](validation.md).
