import Link from 'next/link';
import { ArrowUpRight, Crosshair } from 'lucide-react';
import { DUBAI_PLACES } from './DubaiMapData';

export function KeyMetricsCard() {
  const counts = [
    { label: 'Monitoring areas', value: DUBAI_PLACES.length },
    { label: 'Alert tier', value: DUBAI_PLACES.filter(({ tier }) => tier === 'ALERT').length, color: 'text-tier-alert-text' },
    { label: 'Action tier', value: DUBAI_PLACES.filter(({ tier }) => tier === 'ACTION').length, color: 'text-tier-action-text' },
  ];

  return (
    <section className="canary-panel flex h-full flex-col p-5 sm:p-6" aria-labelledby="monitoring-metrics">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 id="monitoring-metrics" className="text-lg font-extrabold">Monitoring snapshot</h3>
          <p className="mt-1 text-xs text-canary-text-2">Illustrative areas in the Dubai map</p>
        </div>
        <span className="rounded-xl bg-panel-raised p-2.5 text-canary-amber"><Crosshair size={19} /></span>
      </div>
      <dl className="my-6 grid grid-cols-3 gap-2">
        {counts.map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-border bg-panel-inset px-2.5 py-3">
            <dt className="text-xs font-bold text-canary-text-2">{label}</dt>
            <dd className={`font-editorial-serif mt-1 text-4xl tabular-nums ${color ?? ''}`}>{value}</dd>
          </div>
        ))}
      </dl>
      <Link href="/alerts" className="mt-auto flex min-h-10 items-center gap-2 text-xs font-extrabold text-canary-amber hover:underline">
        Open the alert inbox <ArrowUpRight size={15} />
      </Link>
    </section>
  );
}
