import React from 'react';
import { RiskTier } from '@/lib/types/domain';

interface RiskTierBadgeProps {
  tier: RiskTier | null | string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const RiskTierBadge: React.FC<RiskTierBadgeProps> = ({
  tier,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  if (!tier) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs text-canary-text-3 bg-panel-inset border border-border ${className}`}>
        <span className="w-2 h-2 rounded-full bg-border-strong inline-block" />
        {showLabel && <span>Nominal</span>}
      </span>
    );
  }

  const normalized = tier.toUpperCase();

  let shape = '●';
  let label = 'Watch';
  let badgeClasses = 'bg-tier-watch/15 border-tier-watch/30 text-tier-watch-text';
  let dotColor = 'var(--tier-watch)';

  if (normalized === 'ALERT') {
    shape = '▲';
    label = 'Alert';
    badgeClasses = 'bg-tier-alert/15 border-tier-alert/30 text-tier-alert-text';
    dotColor = 'var(--tier-alert)';
  } else if (normalized === 'ACTION') {
    shape = '◆';
    label = 'Action';
    badgeClasses = 'bg-tier-action/15 border-tier-action/40 text-tier-action-text';
    dotColor = 'var(--tier-action)';
  }

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5 font-medium',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-badge border font-medium ${badgeClasses} ${sizeClasses} ${className}`}
      title={`Risk Tier: ${label}`}
    >
      <span style={{ color: dotColor }} className="text-[10px] leading-none select-none">
        {shape}
      </span>
      {showLabel && <span className="tracking-wide uppercase font-semibold text-[11px]">{label}</span>}
    </span>
  );
};

