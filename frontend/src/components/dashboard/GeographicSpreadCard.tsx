import Link from 'next/link';
import { ArrowUpRight, Map } from 'lucide-react';
import { DUBAI_PLACES } from './DubaiMapData';

const categories = [
  { id: 'industrial', label: 'Industrial' },
  { id: 'worker_zone', label: 'Worker quarters' },
  { id: 'urban', label: 'Urban' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'coastal', label: 'Coastal' },
];

export function GeographicSpreadCard() {
  return (
    <section className="canary-panel flex h-full flex-col p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-base font-extrabold">Area coverage</h3>
        <Map size={17} className="text-canary-amber" />
      </div>
      <dl className="mb-2 space-y-2 text-xs">
        {categories.map(({ id, label }) => (
          <div key={id} className="flex items-center justify-between gap-2">
            <dt className="text-canary-text-2">{label}</dt>
            <dd className="font-bold tabular-nums">{DUBAI_PLACES.filter(({ category }) => category === id).length}</dd>
          </div>
        ))}
      </dl>
      <Link href="/map" className="mt-auto flex min-h-10 items-center gap-1.5 text-xs font-extrabold text-canary-amber hover:underline">
        Open map <ArrowUpRight size={14} />
      </Link>
    </section>
  );
}
