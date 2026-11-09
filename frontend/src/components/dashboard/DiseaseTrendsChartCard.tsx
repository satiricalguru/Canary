'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const samples = [
  { period: '1', cases: 18200, baseline: 14100 },
  { period: '2', cases: 32400, baseline: 28200 },
  { period: '3', cases: 24800, baseline: 22900 },
  { period: '4', cases: 46100, baseline: 38400 },
  { period: '5', cases: 54300, baseline: 45000 },
  { period: '6', cases: 61200, baseline: 51800 },
  { period: '7', cases: 68500, baseline: 57300 },
];

export function DiseaseTrendsChartCard() {
  return (
    <section className="canary-panel h-full p-5 sm:p-6" aria-labelledby="sample-trends">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 id="sample-trends" className="text-lg font-extrabold">Observed cases and baseline</h3>
          <p className="mt-1 text-xs text-canary-text-2">Illustrative sample across seven reporting periods</p>
        </div>
        <Link href="/validation" className="flex min-h-10 items-center gap-2 text-xs font-extrabold text-canary-amber hover:underline">
          View validation <ArrowUpRight size={15} />
        </Link>
      </div>
      <div className="h-56 min-w-0 rounded-xl border border-border bg-panel-inset px-1 pt-3">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={samples} margin={{ top: 8, right: 15, bottom: 5, left: 0 }} accessibilityLayer>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="period" tick={{ fill: 'var(--text-2)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis width={39} tick={{ fill: 'var(--text-2)', fontSize: 11 }} tickFormatter={(value: number) => value === 0 ? '0' : `${value / 1000}k`} axisLine={false} tickLine={false} />
            <Tooltip labelFormatter={(value) => `Reporting period ${value}`}
              formatter={(value: number) => value.toLocaleString('en-US')}
              contentStyle={{ background: 'var(--panel)', borderColor: 'var(--border-strong)', borderRadius: 12, fontSize: 12 }} />
            <Line type="monotone" name="Cases" dataKey="cases" stroke="var(--amber)" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            <Line type="monotone" name="Baseline" dataKey="baseline" stroke="var(--ok)" strokeWidth={2} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-canary-text-2">
        <span className="flex items-center gap-2"><span className="w-5 border-t-2 border-canary-amber" /> Observed</span>
        <span className="flex items-center gap-2"><span className="w-5 border-t-2 border-dashed border-status-ok" /> Baseline</span>
      </div>
      <details className="mt-3 text-xs text-canary-text-2">
        <summary className="w-fit cursor-pointer py-1.5 font-bold">View values as a table</summary>
        <table className="mt-2 w-full text-left tabular-nums">
          <thead><tr><th scope="col">Period</th><th scope="col">Observed</th><th scope="col">Baseline</th></tr></thead>
          <tbody>{samples.map(({ period, cases, baseline }) => (
            <tr key={period} className="border-t border-border">
              <th className="py-1 font-medium" scope="row">{period}</th><td>{cases.toLocaleString('en-US')}</td><td>{baseline.toLocaleString('en-US')}</td>
            </tr>
          ))}</tbody>
        </table>
      </details>
    </section>
  );
}
