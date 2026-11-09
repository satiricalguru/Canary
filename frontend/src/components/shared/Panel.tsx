import React from 'react';
import { ProvenanceBadge } from './ProvenanceBadge';
import { ProvenanceKind } from '@/lib/types/domain';

interface PanelProps {
  title: string;
  subtitle?: string;
  provenance?: ProvenanceKind;
  sourceName?: string;
  trailingAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const Panel: React.FC<PanelProps> = ({
  title,
  subtitle,
  provenance,
  sourceName,
  trailingAction,
  children,
  className = '',
  bodyClassName = '',
}) => {
  return (
    <div className={`canary-panel flex flex-col p-5 ${className}`}>
      {/* Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2 border-b border-border/60">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-canary-text tracking-tight truncate">
              {title}
            </h3>
            {provenance && <ProvenanceBadge kind={provenance} sourceName={sourceName} size="sm" />}
          </div>
          {subtitle && (
            <p className="text-xs text-canary-text-3 mt-0.5 line-clamp-1">{subtitle}</p>
          )}
        </div>
        {trailingAction && <div className="flex-shrink-0">{trailingAction}</div>}
      </div>

      {/* Panel Body */}
      <div className={`flex-1 min-h-0 ${bodyClassName}`}>{children}</div>
    </div>
  );
};

