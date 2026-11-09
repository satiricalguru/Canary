# Canary design

Canary helps occupational health and public-health teams see emerging risks,
understand the evidence and decide what to investigate. The public landing
page introduces that workflow. The workspace supports operational review.

## 1. Visual direction

The golden canary is the visual metaphor for an early signal. Its blue-hour
portrait anchors the landing page. The Dubai waterfront image places the
surveillance workflow in its demonstration setting. Both images are generated
illustrations.

Function informed the editorial serif and quiet health-tech surfaces. Mercury
informed the blue-hour treatment. Apple informed the large media frame and
short navigation. Bevel and Superhuman informed the treatment of data and
photography. The broader reference pass included Freshman, ElevenLabs,
OpenAI and Vercel for hierarchy, restrained borders and label density.

- [Function](https://styles.refero.design/style/21b71be3-78a0-4681-a5b9-64cc4b40eb67)
- [Mercury](https://styles.refero.design/style/3172cd4d-118a-4a16-a259-6b634d32322e)
- [Apple iPhone Duo](https://styles.refero.design/style/a73148b9-449b-42cd-9f38-86ef694f500e)
- [Bevel](https://styles.refero.design/style/c0717d1a-b446-4166-a445-6497fe287fea)
- [Superhuman](https://styles.refero.design/style/418b374a-be64-44f0-b17e-1d45308c7e62)
- [Freshman](https://styles.refero.design/style/a6284fcd-fa69-4469-ac40-4239e5b84a39)
- [ElevenLabs](https://styles.refero.design/style/031056ff-7af1-46db-8daa-115f731c5d26)
- [OpenAI](https://styles.refero.design/style/dc541737-8bf2-4b31-b729-0352f696e82f)
- [Vercel](https://styles.refero.design/style/f24daf3a-d43f-4dec-85a9-8ac1d5148a03)

## 2. Palette and typography

| Role | Value |
|---|---|
| Primary brand and headline | `#2F3A55` |
| Secondary and body text | `#5C6B8A` |
| Main background | `#F5F6F3` |
| Workspace surfaces | Subtle neutral layers with hairline slate borders |
| Severity | Gold watch circle, orange alert triangle, red action diamond |

Newsreader Variable supplies the editorial display voice. Manrope Variable
supplies the body, navigation and controls. Both are self-hosted under OFL 1.1.
Use tabular numerals for aligned metric values and keep risk tiers paired with
their shape and text label. The CSS custom properties in
[globals.css](frontend/src/app/globals.css) are the source of truth for both
workspace themes.

## 3. Layout

The landing page moves from the full-screen, scroll-driven canary film to platform
capabilities, a Dubai workflow, validation and safeguards, and a workspace
entry point. Copy and actions are regular HTML. The Three.js signal graphic is
decorative and independent of the film. The portrait is immediately usable
with reduced motion or without WebGL.

The workspace uses a labeled navigation rail on desktop and a disclosure menu
on mobile. The top bar provides the demo role, provenance legend and theme.
Each page shows a title, a short description and the persistent demo-data notice.
The dashboard groups the Dubai map and area dossier before illustrative trends
and metrics. Secondary views retain the screen requirements below.

---

## 4. Screen specifications

Wireframes are layout intent, not pixel specs.

### 4.1 Overview map (PRD Screen 1)

```
┌──────────────────────────────────────────────────────────────────────┐
│ OVERVIEW        one-sentence description        [Role ▾] [Legend] ⟳  │
├───────────────────────────────────────┬──────────────────────────────┤
│ Site and district map                 │ Key metrics                  │
│  (UAE, glow markers, tier shapes)     │  ◜gauge◝  ◜gauge◝  ◜gauge◝   │
│                                       │  Data     Sites at  Open     │
│  [3 open alerts ▾]                    │  complete Alert+    Actions  │
│                                       ├──────────────────────────────┤
│                                       │ Sites by tier  (ranked bars) │
│  Layers: Sites | Districts | Hazard   │  ◆ Action  ▲ Alert  ● Watch  │
├───────────────────────────────────────┼──────────────────┬───────────┤
│ Hazard trend (heat, PM2.5), real data │ Feed health      │ Data      │
│ with observed outcomes (sim) overlay  │ (stale/failed)   │ sources   │
└───────────────────────────────────────┴──────────────────┴───────────┘
```

- **Map:** MapLibre with a custom dark style. Land `#2A2418`, water `#0D0D0E`, borders `#3A3A3D`, labels `--text-3`. Four districts shown as choropleth in tier-tinted browns/golds (the reference's US choropleth treatment).
- **Site markers:** a tier shape inside a ring. Ring size encodes headcount band. Ring is dashed when completeness is below 80%. A radial glow in the tier colour sits behind Alert and Action markers only.
- **Pill control** (reference "142 active"): `[▲ 3 open alerts ▾]` opens a filter by tier.
- **Key metric gauges** (reference "Key metrics"): Data completeness (%), Sites at Alert or above (share of sites), Open Action alerts (share of open alerts). Each shows a ▲▼ delta with an explicit period.
- **Data sources strip** (reference footer): chips for each feed with a provenance badge and last-updated time.
- **Stale or unavailable feeds:** a feed-health panel lists each failed or late stream. Affected markers show a ⚠ corner mark. The overview never hides a failing feed.
- **Selecting a site:** opens a right-side drawer with permitted detail and an "Open alerts for this site" button.

### 4.2 Alert inbox (PRD Screen 2)

- Table with row height 56. Columns: Tier (shape + word), Hazard or syndrome, Unit, Started, Status, Confidence, Completeness (mini meter).
- Left edge of the row carries a 3px tier-coloured bar; the tier shape and word remain in the cell.
- Filters: tier, hazard, unit (limited to role-permitted units), status. Filters are sticky chips above the table.
- Default sort: tier descending, then start time descending.
- States: loading uses skeleton rows; empty reads "No alerts match these filters. Clear filters or widen the date range."; error reads "Alerts could not be loaded. Check the connection and retry." with a Retry button.

### 4.3 Alert detail (PRD Screen 3)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ▲ Alert · Respiratory · Site 04 (labour accommodation)  started 3 Nov│
│ Plain-language summary (deterministic template)        [Review ▸]    │
├──────────────────────────────────┬───────────────────────────────────┤
│ What changed                     │ Why Canary raised this            │
│  Signal strips: observed (line)  │  Contribution waterfall           │
│  vs expected (dashed) + band     │  PM2.5 ████  Clinic ███  Absence ▌│
│  PM2.5 (real) | Clinic (sim)     │  Persistence 2 of last 3 days ✓   │
│  Absence (sim)                   │  Correlation discount applied     │
├──────────────────────────────────┼───────────────────────────────────┤
│ Where and when                   │ How reliable is this              │
│  Zone map + 1/3/7-day window     │  Completeness per stream          │
│  selector, scan significance     │  Freshness, delays, uncertainty   │
├──────────────────────────────────┴───────────────────────────────────┤
│ What to consider doing                                               │
│  Action · Owner role · Evidence · Assumptions · Escalation · Review  │
│  by date        [Review and sign off]   Decision support only        │
└──────────────────────────────────────────────────────────────────────┘
```

- The page is organised under the five questions from PRD Feature 7: what changed, why, where and when, how reliable, what to consider doing. Panel titles use those plain words.
- **Signal strip:** observed as a solid amber line with point markers (the reference's line-chart style), expected as a dashed `--text-2` line, expected range as a translucent band. Exceedance points are drawn as filled tier shapes. Missing days are a hatched gap with the label "No data", not a zero.
- **Waterfall:** horizontal bars from a baseline prior to the final score. Bars show each stream's capped contribution. A stream removed for missing data appears as a hatched empty row labelled "Not available, contribution removed". A correlation-discount step is its own labelled row.
- **No headline score.** The tier is the headline; the waterfall is the explanation.
- **Action panel:** each field has its own labelled row. The primary button reads "Review and sign off" and is disabled with a tooltip in the read-only demo ("Demo roles are read-only"). The text "Decision support. Requires human review. Nothing is executed automatically." is always shown.
- **Reference line:** each playbook entry shows its guidance source (WHO, ILO or other) as a link-styled caption.

### 4.4 Scenario replay (PRD Screen 4)

- Scenario selector as three tabs: Respiratory (dust / PM2.5), Gastrointestinal cluster, Heat-related illness.
- A large scrubber under the signal view with day ticks. Keyboard: ← → step one day, Shift+← → step seven days, Space plays or pauses.
- Marker rows on the timeline, each with its own shape and label:
  - Canary Watch ●, Alert ▲, Action ◆ (tier colours)
  - Comparator alerts as hollow shapes in `--text-2` with the method name (EARS C2, CUSUM, fixed threshold)
  - Ground-truth event window as a hatched `--prov-sim` band labelled "Simulated event (evaluation context)"
- The panel to the right shows the evidence available at the selected day, so users see what Canary knew at that moment and nothing later.
- Replay is deterministic. The seed and scenario ID appear in the caption.

### 4.5 Validation (PRD Screen 5)

- Top: a banner "Results use simulated data and held-out test seeds. They are not clinical validation."
- Metric summary table: rows are the four methods (EARS C2 on absence, CUSUM on clinic visits, fixed hazard threshold, Canary fusion); columns are event-level sensitivity, lead time, alert-level PPV, false alerts per site-month, ingest-to-alert latency. Canary's row is highlighted with an amber left edge. Values come from the back-test endpoint only. No number is hard-coded in the UI.
- Lead-time comparison: horizontal bars per method relative to the clinical-significance threshold day, with a labelled zero line.
- Ablation and robustness: a small-multiples grid (one panel per condition: feed removed, no geolocation, 2-day delay, 30% noise). Each shows degradation against the full model.
- Each metric has an info popover with its definition and test configuration.
- Placeholders until the back-test runs read "Not yet computed", never an expected or target value.

### 4.6 Privacy and governance (PRD Screen 6)

- **Data contract panel:** the four approved fields (`unit_id`, `date`, `category`, `count`) shown as a schema card, and a rejected example payload with the reason ("Rejected: contains a person-level field").
- **Live suppression demo:** a small table where counts below k are replaced by a suppression cell showing "< 5". A slider for k (default 5). Secondary suppression is shown with a link icon and the tooltip "Also hidden so this value cannot be calculated from totals".
- **Role view demo:** side-by-side previews of what each of the four roles sees. The regulator preview shows compliance indicators only.
- **Audit log:** a table of access events (time, role, view, outcome). New rows appear when the user opens a protected view.
- **Boundary statement:** a fixed card, "Not for disciplinary use or individual employment profiling."
- **Suppressed cell style:** `--panel-inset` background, diagonal hatch, centered "< 5". Never blank and never "0".

### 4.7 Impact estimator (PRD Screen 7)

- Three result columns: Low, Base, High, each with avoided cases, severe incidents and absence days. Each column is labelled "Illustrative" and uses the `--prov-illus` dotted outline.
- Assumption controls: intervention uptake, effectiveness, detection lead gain. Sliders with numeric inputs and a reset control.
- A "How this is calculated" panel shows the formula chain and source references. Caveats are always visible, not in a collapsed accordion.
- Result numerals use `display` weight, but always carry the "Illustrative, scenario-based" tag beside them.

---

## 5. Provenance language (honest data)

This is a core design requirement, not decoration.

| Kind | Badge | Chart treatment | Where it appears |
|---|---|---|---|
| Real | Solid chip, `--prov-real`, label "Real" + source name | Solid line | Environmental feeds (heat, PM2.5, PM10) |
| Simulated | Chip with diagonal hatch, `--prov-sim`, label "Simulated" | Dashed-dot line or hatched fill | Clinic, absence, first-aid, incident, teleconsultation data |
| Illustrative | Dotted outline chip, `--prov-illus`, label "Illustrative" | Dotted outline on cards | Impact estimates |
| Approximation | Small "≈" prefix and "approximation" label | n/a | WBGT-derived heat stress |

Rules

- Every panel that contains simulated outcome data shows a "Simulated" chip in its header.
- Exports and screenshots keep the chip in the image.
- The same symbols are used in the legend of every chart.

---

## 6. Component library

| Component | Spec |
|---|---|
| **Panel** | Section 2.4 elevation. Title row (`title-panel`), optional trailing action, optional provenance chip. |
| **Ghost button** | 1px `--border-strong`, `--panel-raised` on hover, text `--text`. Used for secondary actions. |
| **Primary button** | `--amber` fill, `#1B1203` text, 8px radius. One per view. |
| **Tier badge** | Shape + word, tier colour at 16% fill, 1px tier-colour border, `-text` colour. |
| **Gauge** | 240° arc, 10px stroke, round caps, gradient from 2.2. Centre: `display` numeral, `caption` label, delta row beneath. Track is `--panel-inset`. Has a text alternative: "Data completeness 94%, up 2 points vs previous 7 days". |
| **Delta** | ▲ or ▼ + percentage + comparison period. Colour follows meaning (rising risk is amber/red, improving is `--ok`), and the arrow carries direction. |
| **Ranked bar row** | Tier shape, name, bar (4px, round), delta, count. Used for sites by tier and hazard lists. |
| **Completeness meter** | Segmented bar with percentage. Under 80% it turns `--stale` and gets a ⚠ icon. |
| **Signal strip** | Section 4.3. Height 120 in lists, 220 in detail. |
| **Waterfall** | Section 4.3. Horizontal, labelled, value at the bar end. |
| **Suppressed cell** | Section 4.6. |
| **Scrubber** | 8px track, 20px amber thumb with glow, day ticks, marker rows beneath. |
| **Role switcher** | Select in the header. Label "Demo role". Tooltip: "Demonstration control only. Production uses real identity and access management." |
| **Disclaimer bar** | Used on alert detail and playbooks: "Decision support. Requires human review." |
| **Toast** | Bottom-left, auto-dismiss after 5s, uses the same verb as the action ("Filters cleared"). |

---

## 7. State design

| State | Treatment |
|---|---|
| Loading | Skeleton blocks matching final layout; map shows grey markers. No spinners over charts. |
| Empty | One plain sentence plus the action that fixes it. Example: "No open alerts for this site. Canary is still monitoring 4 streams." |
| Error | What failed and what to do. Example: "Signals for Site 04 did not load. Retry, or check the feed health panel." No apologies. |
| Stale feed | ⚠ + "Last updated 2 days ago" in `--stale`. Contribution is dimmed and labelled. |
| Missing feed | Hatched `--missing` fill, "No data". Distinguish from "No events reported" (a true zero, shown as 0). |
| Suppressed | Section 4.6. |
| Read-only | Actions that would change data are disabled with a tooltip explaining why. |

---

## 8. Motion

Native scrolling advances the full-screen canary film through its timeline.
The film uses a four-viewport desktop track and a shorter mobile track. The
opening frame doubles as a poster for reduced motion and delayed video.
The film was generated with Veo 3.1 Quality in Google Flow, upscaled to
1080p in Flow and encoded as a silent H.264 MP4 for the website.
The decorative Three.js renderer renders a short reveal only while in view and pauses while the
tab is hidden. Reduced motion keeps the static portrait and skips WebGL.
The [Google Flow prompt](docs/canary-flow-prompt.txt) records the film direction.

---

## 9. Accessibility

- Text contrast of at least 4.5:1 against its surface (use `-text` tier colours and `--text-3` only for non-essential captions). Chart marks and UI boundaries at least 3:1.
- Tiers always use shape + word + colour. The colour-blind check must show Watch, Alert and Action distinguishable in greyscale.
- All maps and charts have titles, legends and a text or table alternative ("View as table").
- Visible keyboard focus: 2px `--amber` outline with 2px offset on every interactive element. Logical tab order. Map markers are reachable by keyboard and also listed in the inbox.
- Targets at least 40px (44px on touch).
- Screen-reader announcements for live updates ("Site 04 moved to Alert") use polite live regions.
- Plain language: no unexplained acronyms. First use of WBGT, PM2.5, PPV and EARS C2 gets an inline explanation or popover.

---

## 10. Voice and copy

- Plain verbs, sentence case, active voice. Name things by what users do ("Review and sign off"), not how the system works.
- The same action keeps the same name everywhere ("Open alert" never becomes "View details").
- Always say "decision support", "may indicate", "suggested". Never "diagnosis", "outbreak confirmed" or "will become ill".
- Evidence is never causal: "Heat and clinic visits rose together" rather than "Heat caused the increase".
- Numbers are given with units, period and provenance.

Examples

| Situation | Copy |
|---|---|
| Alert summary | "Respiratory clinic visits at Site 04 are 2.3 times the expected level for the third day, after two days of high PM2.5. Review the evidence and suggested actions." |
| Missing feed | "Absence data for Site 07 is missing since 4 Nov. Its contribution has been removed and confidence is lower." |
| Suppression tooltip | "Counts under 5 are hidden to protect privacy." |
| Impact label | "Illustrative estimate based on the assumptions shown. Not observed impact." |

---

## 11. Implementation notes

The frontend uses Next.js, TypeScript and Tailwind CSS. The landing page uses
Three.js for its decorative signal field. The Dubai map uses Leaflet and the
workspace includes SVG and Recharts data views.

Shared panel, tier, provenance and status components read the theme tokens.
The backend continues to enforce role restrictions on scoped data. The
frontend uses those roles to present the appropriate workspace controls.

---

## 12. Design acceptance checklist

- [ ] Overview shows tiers, completeness and failing feeds without opening any other view.
- [ ] No screen shows an unexplained score.
- [ ] Real, simulated and illustrative data are visually distinct on every panel and chart.
- [ ] Missing data is never drawn as zero.
- [ ] Tiers are distinguishable in greyscale and by shape.
- [ ] Suppressed cells never reveal a value; hover, filters and exports do not either.
- [ ] Every recommendation shows owner, evidence, assumptions, escalation path, review-by date and the human-review statement.
- [ ] Validation values come from the back-test only; unreached values read "Not yet computed".
- [ ] Keyboard-only use works end to end, including the replay scrubber.
- [ ] Layout holds at 1440, 1024 and 390 widths.
