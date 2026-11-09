'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const OutbreakSourcesCard: React.FC = () => {
  const sources = [
    { label: 'Healthcare Facilities', percentage: '43%', color: 'var(--amber)' },
    { label: 'Community Settings', percentage: '31%', color: 'var(--tier-watch-text)' },
    { label: 'Food & Water Sources', percentage: '14%', color: 'var(--prov-real)' },
    { label: 'Other', percentage: '10%', color: 'var(--text-3)' },
  ];

  return (
    <div className="relative canary-panel min-w-0 p-5 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm sm:text-base font-bold text-canary-text tracking-tight">
          Outbreak Sources
        </h2>
        <ShieldCheck className="w-3.5 h-3.5 text-canary-amber" />
      </div>

      {/* Breakdown List matching reference image */}
      <div className="space-y-2.5 my-auto text-xs">
        {sources.map((s, idx) => (
          <div key={idx} className="flex items-center justify-between gap-2 group">
            <div className="flex items-center gap-1.5 text-canary-text-2 group-hover:text-canary-text transition-colors">
              <span className="text-canary-text-3 font-mono">-</span>
              <span className="font-medium">{s.label}</span>
            </div>
            <span className="font-mono font-bold text-canary-amber text-xs" style={{ color: s.color }}>
              {s.percentage}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Footer with Active Sources count */}
      <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-mono tracking-wider text-canary-text-3 font-semibold">
            Active Sources
          </span>
          <span className="text-[10px] text-canary-text-3">Illustrative</span>
        </div>
        <span className="text-base sm:text-lg font-black text-canary-text font-mono tracking-tight">
          1,836
        </span>
      </div>
    </div>
  );
};

