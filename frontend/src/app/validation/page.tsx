import { AppShell } from '@/components/layout/AppShell';
import { Panel } from '@/components/shared/Panel';
import { ProvenanceBadge } from '@/components/shared/ProvenanceBadge';
import report from '@/lib/data/validation-report.json';

const names = {
  canary: 'Canary fusion',
  ears_c2: 'Absence EARS C2',
  clinic_cusum: 'Clinic CUSUM',
  fixed_hazard: 'Fixed exposure',
};
const comparatorIds = ['canary', 'ears_c2', 'clinic_cusum', 'fixed_hazard'] as const;
const leadIds = ['ears_c2', 'clinic_cusum', 'fixed_hazard'] as const;
const conditions = {
  without_environment: 'Environmental feed missing',
  without_clinic: 'Clinic feed missing',
  without_workplace: 'Workplace feed missing',
  district_only: 'District rollup only',
  reporting_delay_2d: 'Two-day reporting delay',
  extra_noise_30pct: '30% additional noise',
};
const conditionIds = Object.keys(conditions) as (keyof typeof conditions)[];
const percent = (value: number) => `${(100 * value).toFixed(1)}%`;
const canary = report.comparators.canary;

export default function ValidationPage() {
  return (
    <AppShell title="Validation & evaluation" description="Compare detectors on held-out, simulated health events.">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start gap-3 rounded-panel border border-prov-sim/25 bg-prov-sim/5 p-4">
          <ProvenanceBadge kind="simulated" />
          <p className="max-w-3xl text-sm leading-relaxed text-canary-text-2">
            {canary.events} injected events across {report.test_seeds.length} held-out test seeds. This is a simulation of operational performance. Clinical effectiveness requires real-world validation.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ['Event sensitivity', percent(canary.sensitivity), `${canary.detected_events} of ${canary.events} events detected`],
            ['Alert precision', percent(canary.ppv), 'Share of Canary alerts linked to an event'],
            ['False alerts / site-month', canary.false_alerts_per_unit_month.toFixed(3), `${canary.false_alerts} false alerts in the held-out run`],
          ].map(([label, value, detail]) => (
            <div key={label} className="canary-panel p-5">
              <p className="text-xs font-bold text-canary-text-2">{label}</p>
              <p className="font-editorial-serif mt-2 text-4xl tabular-nums">{value}</p>
              <p className="mt-2 text-xs text-canary-text-2">{detail}</p>
            </div>
          ))}
        </div>

        <Panel title="Detector comparison">
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Detector comparison table">
            <table className="w-full min-w-[520px] text-left text-sm tabular-nums">
              <thead className="bg-panel-inset text-xs text-canary-text-2">
                <tr>{['Detector', 'Events detected', 'Sensitivity', 'Precision', 'False alerts / site-month'].map((label) => <th key={label} scope="col" className="p-3">{label}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparatorIds.map((id) => {
                  const result = report.comparators[id];
                  return <tr key={id} className={id === 'canary' ? 'bg-panel-raised' : ''}>
                    <th scope="row" className="p-3 font-bold">{names[id]}</th>
                    <td className="p-3">{result.detected_events} / {result.events}</td>
                    <td className="p-3">{percent(result.sensitivity)}</td>
                    <td className="p-3">{percent(result.ppv)}</td>
                    <td className="p-3">{result.false_alerts_per_unit_month.toFixed(3)}</td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="When Canary alerts" subtitle="Median difference on events both methods detected">
            <ul className="space-y-4">
              {leadIds.map((id) => {
                const lead = report.lead_time[id];
                const direction = lead.median_days > 0 ? 'earlier' : 'later';
                const days = Math.abs(lead.median_days);
                return <li key={id} className="space-y-1.5">
                  <div className="flex flex-wrap justify-between gap-x-2 text-sm">
                    <span className="font-bold">{names[id]}</span>
                    <span className="text-canary-text-2">{days ? `${days} ${days === 1 ? 'day' : 'days'} ${direction}` : 'Same day'} · {lead.paired_events} pairs</span>
                  </div>
                  <div className="relative h-2 rounded-full bg-panel-raised" aria-hidden="true">
                    <span className="absolute inset-y-0 left-1/2 w-px bg-border-strong" />
                    <span className={`absolute inset-y-0 rounded-full ${lead.median_days > 0 ? 'left-1/2 bg-status-ok' : 'right-1/2 bg-canary-amber'}`} style={{ width: `${Math.min(days / 3, 1) * 50}%` }} />
                  </div>
                </li>;
              })}
            </ul>
          </Panel>
          <Panel title="How to interpret the tradeoff">
            <div className="space-y-3 text-sm leading-relaxed text-canary-text-2">
              <p>Clinic CUSUM detected more events, especially gastrointestinal clusters. Canary produced fewer false alerts per site-month and had higher alert precision.</p>
              <p>Fixed exposure thresholds can flag environmental conditions earlier. This comparator has no gastrointestinal rule.</p>
              <p>Calibration seeds {report.calibration_seeds.join(', ')}. Held-out seeds {report.test_seeds.join(', ')}.</p>
            </div>
          </Panel>
        </div>

        <Panel title="Robustness under missing or noisy inputs" subtitle="Sensitivity measured on the same held-out simulation">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {conditionIds.map((id) => (
              <li key={id} className="canary-panel-inset p-4">
                <p className="text-sm font-bold">{conditions[id]}</p>
                <p className="mt-2 text-sm tabular-nums text-canary-text-2">{percent(report.ablations[id].sensitivity)} sensitivity</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}
