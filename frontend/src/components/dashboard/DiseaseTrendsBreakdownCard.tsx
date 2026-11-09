const conditions = [
  { name: 'Influenza', cases: 21431, change: '+8%' },
  { name: 'Norovirus', cases: 15866, change: '+11%' },
  { name: 'COVID-19', cases: 12745, change: '+5%' },
  { name: 'Salmonella', cases: 10541, change: '−3%' },
];

export function DiseaseTrendsBreakdownCard() {
  const highestCount = Math.max(...conditions.map(({ cases }) => cases));

  return (
    <section className="canary-panel h-full p-5 sm:p-6">
      <h3 className="text-lg font-extrabold">Case breakdown</h3>
      <p className="mt-1 text-xs text-canary-text-2">Illustrative weekly sample</p>
      <ul className="mt-5 space-y-4">
        {conditions.map(({ name, cases, change }) => (
          <li key={name} className="grid grid-cols-[1fr_auto] gap-x-2 gap-y-1.5 text-xs">
            <span className="font-bold">{name}</span>
            <span className="text-right tabular-nums">
              {cases.toLocaleString('en-US')} cases
              <span className="ml-2 inline-block min-w-10 font-bold text-canary-text-2">{change}</span>
            </span>
            <div className="col-span-2 h-1.5 overflow-hidden rounded-full bg-panel-raised" aria-hidden="true">
              <div className="h-full rounded-full bg-canary-amber" style={{ width: `${100 * cases / highestCount}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
