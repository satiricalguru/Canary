'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Panel } from '@/components/shared/Panel';
import { RiskTierBadge } from '@/components/shared/RiskTierBadge';
import { CompletenessMeter } from '@/components/shared/CompletenessMeter';
import { ProvenanceBadge } from '@/components/shared/ProvenanceBadge';
import { fetchAlerts } from '@/lib/api/client';
import { useDemoRole } from '@/context/RoleContext';
import { AlertDetail, HazardType, RiskTier } from '@/lib/types/domain';
import {
  ShieldAlert,
  Filter,
  ArrowRight,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  Building2
} from 'lucide-react';
import Link from 'next/link';

export default function AlertsInboxPage() {
  const { activeRole } = useDemoRole();
  const [alerts, setAlerts] = useState<AlertDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedHazard, setSelectedHazard] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const request = new AbortController();
    setLoading(true);
    setError(null);
    fetchAlerts({
      role: activeRole,
      tier: selectedTier,
      hazard: selectedHazard,
      status: selectedStatus,
      signal: request.signal,
    })
      .then((data) => {
        if (request.signal.aborted) return;
        setAlerts(data.alerts);
        setLoading(false);
      })
      .catch((err) => {
        if (request.signal.aborted) return;
        console.error('Failed to load alerts:', err);
        setError('Alerts could not be loaded. Check the connection and retry.');
        setLoading(false);
      });
    return () => request.abort();
  }, [activeRole, selectedTier, selectedHazard, selectedStatus, refreshCount]);

  const filteredAlerts = alerts.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.unit.name.toLowerCase().includes(q) ||
      a.unit.district.toLowerCase().includes(q) ||
      a.hazardLabel.toLowerCase().includes(q)
    );
  });

  return (
    <AppShell
      title="Alert inbox"
      description="Manage active population and workforce health risk alerts across monitored facilities and accommodation networks."
    >
      <div className="flex flex-col gap-6">
        {/* Sticky Filter Bar */}
        <div className="canary-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center flex-wrap gap-3 flex-1">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 max-w-xs">
              <Search className="w-4 h-4 text-canary-text-3 absolute left-3 top-2.5" />
              <input
                type="text"
                aria-label="Search alerts by site or syndrome"
                placeholder="Search by site or syndrome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-panel-inset border border-border rounded-control pl-9 pr-3 py-1.5 text-xs text-canary-text placeholder:text-canary-text-3 focus:outline-none focus:border-canary-amber"
              />
            </div>

            {/* Tier Filters */}
            <div className="flex max-w-full flex-wrap items-center gap-1 bg-panel-inset p-1 rounded-control border border-border">
              <span className="text-[11px] font-semibold text-canary-text-3 px-2 uppercase">Tier:</span>
              {(['all', 'ACTION', 'ALERT', 'WATCH'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTier(t)}
                  aria-pressed={selectedTier === t}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    selectedTier === t
                      ? 'bg-panel-raised text-canary-amber shadow-sm'
                      : 'text-canary-text-3 hover:text-canary-text'
                  }`}
                >
                  {t === 'all' ? 'All Tiers' : t}
                </button>
              ))}
            </div>

            {/* Hazard Filters */}
            <div className="flex max-w-full flex-wrap items-center gap-1 bg-panel-inset p-1 rounded-control border border-border">
              <span className="text-[11px] font-semibold text-canary-text-3 px-2 uppercase">Hazard:</span>
              {[
                { id: 'all', label: 'All Hazards' },
                { id: 'gastrointestinal', label: 'GI' },
                { id: 'respiratory', label: 'Respiratory' },
                { id: 'heat_stress', label: 'Heat Stress' },
              ].map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHazard(h.id)}
                  aria-pressed={selectedHazard === h.id}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    selectedHazard === h.id
                      ? 'bg-panel-raised text-canary-amber shadow-sm'
                      : 'text-canary-text-3 hover:text-canary-text'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => {
                setSelectedTier('all');
                setSelectedHazard('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              className="text-xs text-canary-text-3 hover:text-canary-text underline px-2 py-1"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setRefreshCount((count) => count + 1)}
              className="p-1.5 rounded-control bg-panel-inset hover:bg-panel-raised border border-border text-canary-text-3 hover:text-canary-amber transition-colors"
              title="Refresh Alerts"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Alerts Table Panel */}
        <Panel
          title={`Operational Alert Queue (${filteredAlerts.length})`}
          subtitle="Persistent anomaly signals evaluated against rolling 12-month negative-binomial GLM baseline"
        >
          {loading ? (
            /* Skeleton Loading State */
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-panel-inset rounded-control animate-pulse" />
              ))}
            </div>
          ) : error ? (
            /* Error State */
            <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
              <p className="text-sm text-tier-action-text font-medium">{error}</p>
              <button
                onClick={() => setRefreshCount((count) => count + 1)}
                className="px-4 py-2 rounded-control bg-canary-amber text-canary-on-accent font-semibold text-xs shadow-amber-glow"
              >
                Retry Request
              </button>
            </div>
          ) : filteredAlerts.length === 0 ? (
            /* Empty State */
            <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-status-ok opacity-80" />
              <p className="text-sm text-canary-text font-medium">
                No alerts match these filters.
              </p>
              <p className="text-xs text-canary-text-3">
                Canary is continuously monitoring all active data feeds. Try widening the filter criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedTier('all');
                  setSelectedHazard('all');
                }}
                className="mt-2 text-xs text-canary-amber hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            /* Alerts Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-canary-text border-collapse">
                <thead className="bg-panel-inset text-canary-text-3 uppercase tracking-wider text-[10px] border-b border-border">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Tier</th>
                    <th className="py-3 px-4 font-semibold">Alert Title & Syndrome</th>
                    <th className="py-3 px-4 font-semibold">Monitoring Unit</th>
                    <th className="py-3 px-4 font-semibold">Detected</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Uncertainty</th>
                    <th className="py-3 px-4 font-semibold">Feed Completeness</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredAlerts.map((alert) => {
                    const isAction = alert.tier === 'ACTION';
                    const isAlert = alert.tier === 'ALERT';

                    let leftBarColor = 'bg-[#E8C14A]';
                    if (isAction) leftBarColor = 'bg-[#E5483D]';
                    else if (isAlert) leftBarColor = 'bg-[#F08A2E]';

                    return (
                      <tr
                        key={alert.id}
                        className="hover:bg-panel-raised transition-colors group relative"
                      >
                        {/* 3px Tier-Colored Edge Bar (DESIGN.md Section 4.2) */}
                        <td className="py-3.5 px-4 relative">
                          <span
                            className={`absolute left-0 top-1 bottom-1 w-[3px] rounded-r ${leftBarColor}`}
                          />
                          <RiskTierBadge tier={alert.tier} size="sm" />
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-canary-text group-hover:text-canary-amber transition-colors">
                              {alert.title}
                            </span>
                            <span className="text-[11px] text-canary-text-3 font-medium">
                              {alert.hazardLabel}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-canary-text-2">
                            <Building2 className="w-3.5 h-3.5 text-canary-amber/80 flex-shrink-0" />
                            <div className="flex flex-col">
                              <span className="font-medium text-canary-text truncate max-w-[170px]">
                                {alert.unit.name}
                              </span>
                              <span className="text-[10px] text-canary-text-3">
                                {alert.unit.district}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-canary-text-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-canary-text-3" />
                            <span>
                              {new Date(alert.detectedAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] uppercase font-semibold bg-panel-inset text-canary-text-2 border border-border">
                            {alert.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`text-xs capitalize font-medium ${
                              alert.uncertaintyScore === 'low'
                                ? 'text-status-ok'
                                : alert.uncertaintyScore === 'moderate'
                                ? 'text-tier-alert-text'
                                : 'text-tier-action-text'
                            }`}
                          >
                            {alert.uncertaintyScore}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="w-28">
                            <CompletenessMeter percentage={alert.overallCompleteness} size="sm" />
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/alerts/${alert.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-control bg-panel-inset hover:bg-panel border border-border hover:border-canary-amber text-xs font-semibold text-canary-amber transition-colors group-hover:border-canary-amber"
                          >
                            <span>Open Alert</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}

