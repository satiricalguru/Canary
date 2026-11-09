import React from 'react';
import { ProvenanceKind } from '@/lib/types/domain';

interface ProvenanceBadgeProps {
  kind: ProvenanceKind;
  sourceName?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  kind,
  sourceName,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  if (kind === 'real') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded bg-prov-real/15 border border-prov-real/30 text-prov-real font-medium ${sizeClasses} ${className}`}
        title="Real environmental observation feed"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-prov-real" />
        <span>Real{sourceName ? ` · ${sourceName}` : ''}</span>
      </span>
    );
  }

  if (kind === 'simulated') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded bg-prov-sim/15 border border-prov-sim/30 text-prov-sim font-medium hatched-simulated ${sizeClasses} ${className}`}
        title="Simulated health or workplace outcome data"
      >
        <span className="w-1.5 h-1.5 rounded-sm bg-prov-sim" />
        <span>Simulated{sourceName ? ` · ${sourceName}` : ''}</span>
      </span>
    );
  }

  if (kind === 'illustrative') {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded bg-prov-illus/10 border border-dashed border-prov-illus/50 text-prov-illus font-medium ${sizeClasses} ${className}`}
        title="Illustrative scenario-based estimate"
      >
        <span className="text-[10px]">◇</span>
        <span>Illustrative</span>
      </span>
    );
  }

  // Approximation (e.g. WBGT)
  return (
    <span
      className={`inline-flex items-center gap-1 rounded bg-status-stale/15 border border-status-stale/30 text-tier-watch-text font-medium ${sizeClasses} ${className}`}
      title="Approximation derived from ambient parameters"
    >
      <span>≈ Approximation</span>
    </span>
  );
};

