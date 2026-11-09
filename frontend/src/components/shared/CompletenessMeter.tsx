import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface CompletenessMeterProps {
  percentage: number;
  showText?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const CompletenessMeter: React.FC<CompletenessMeterProps> = ({
  percentage,
  showText = true,
  size = 'md',
  className = '',
}) => {
  const isStale = percentage < 80;
  const barColor = isStale ? 'bg-status-stale' : 'bg-status-ok';
  const textColor = isStale ? 'text-status-stale' : 'text-status-ok';

  const height = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 bg-panel-inset rounded-full overflow-hidden ${height} border border-border`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
      {showText && (
        <div className={`flex items-center gap-1 text-xs font-medium tabular-nums ${textColor}`}>
          {isStale && <AlertTriangle className="w-3 h-3 text-status-stale" />}
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  );
};

