'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DubaiPlace, DUBAI_PLACES } from './DubaiMapData';
import { useDemoRole } from '@/context/RoleContext';
import {
  Flame,
  ShieldCheck,
  MapPin,
  Users,
  Activity,
  Layers,
  Sparkles,
  ShieldAlert,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Globe,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Wind,
  Building2,
  ArrowRight
} from 'lucide-react';

interface DistrictTelemetryCardProps {
  place: DubaiPlace | null;
  onSelectPlace?: (place: DubaiPlace) => void;
  onClose?: () => void;
}

export const DistrictTelemetryCard: React.FC<DistrictTelemetryCardProps> = ({
  place,
  onSelectPlace,
  onClose,
}) => {
  const { roleInfo, isRegulator } = useDemoRole();
  const [showDetailedTelemetry, setShowDetailedTelemetry] = useState(false);

  // If no place is selected (closed state), render the Dubai Emirate Overview
  if (!place) {
    return (
      <div className="relative rounded-3xl p-6 overflow-hidden bg-gradient-to-br from-[#1A1A1C] via-[#141416] to-[#0D0D0E] border border-white/10 shadow-2xl flex flex-col justify-between h-full min-h-[500px]">
        <div className="space-y-4">
          {/* Overview Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-canary-amber/15 border border-canary-amber/30 flex items-center justify-center text-canary-amber">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-canary-text tracking-tight flex items-center gap-2">
                  <span>Dubai Emirate Overview</span>
                  <span className="text-xs font-normal text-canary-amber opacity-75 hidden sm:inline">
                    (إمارة دبي)
                  </span>
                </h3>
                <p className="text-xs text-canary-text-3 font-medium">
                  Aggregated Population &amp; Workforce Surveillance
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
              19 HUBS ACTIVE
            </span>
          </div>

          {/* 3 Overview Metric Cards */}
          <div className="grid grid-cols-3 gap-2 py-2 bg-black/40 rounded-2xl p-2.5 border border-white/5">
            <div className="text-center">
              <div className="text-[10px] uppercase font-mono text-canary-text-3 font-semibold tracking-wider">
                Total Monitored
              </div>
              <div className="text-base sm:text-lg font-black text-canary-text font-mono mt-0.5">
                87,462
              </div>
              <div className="text-[10px] font-mono font-bold text-canary-amber mt-0.5">
                Workers
              </div>
            </div>

            <div className="text-center border-x border-white/5 px-1">
              <div className="text-[10px] uppercase font-mono text-canary-text-3 font-semibold tracking-wider">
                Active Alerts
              </div>
              <div className="text-base sm:text-lg font-black text-[#E5483D] font-mono mt-0.5">
                26
              </div>
              <div className="text-[10px] text-canary-text-3 font-medium mt-0.5">
                3 Critical
              </div>
            </div>

            <div className="text-center">
              <div className="text-[10px] uppercase font-mono text-canary-text-3 font-semibold tracking-wider">
                Average Lead
              </div>
              <div className="text-base sm:text-lg font-black text-canary-amber font-mono mt-0.5">
                +2.5d
              </div>
              <div className="text-[10px] text-emerald-400 font-mono font-medium mt-0.5">
                Ahead of Risk
              </div>
            </div>
          </div>

          {/* District Status Distribution */}
          <div className="space-y-2 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-[10px] uppercase font-mono text-canary-text-3 font-semibold tracking-wider flex items-center justify-between">
              <span>Risk Tier Distribution</span>
              <span className="text-canary-amber font-mono">19 Monitored Hubs</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-[#E5483D]/10 border border-[#E5483D]/20 text-center">
                <span className="text-[10px] uppercase font-mono text-[#FF9085] block font-bold">Action Tier</span>
                <span className="font-mono text-sm font-black text-canary-text">2 Districts</span>
              </div>
              <div className="p-2 rounded-xl bg-[#F2A33A]/10 border border-[#F2A33A]/20 text-center">
                <span className="text-[10px] uppercase font-mono text-canary-amber block font-bold">Alert Tier</span>
                <span className="font-mono text-sm font-black text-canary-text">1 District</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <span className="text-[10px] uppercase font-mono text-emerald-400 block font-bold">Nominal</span>
                <span className="font-mono text-sm font-black text-canary-text">16 Districts</span>
              </div>
            </div>
          </div>

          {/* Feed Readiness Status */}
          <div className="space-y-2 p-3 rounded-2xl bg-black/30 border border-white/5 text-xs text-canary-text-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[10px] uppercase tracking-wider text-canary-text-3 font-mono flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>Aggregated Feed Completeness</span>
              </span>
              <span className="text-emerald-400 font-bold font-mono text-xs">94%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] w-[94%]" />
            </div>
            <p className="text-[11px] leading-relaxed pt-1">
              86 environmental sensors &amp; 42 healthcare surveillance feeds synchronized under role <strong className="text-canary-text">{roleInfo.title}</strong>.
            </p>
          </div>

          {/* Quick Select District Pills */}
          <div>
            <div className="text-[10px] uppercase font-mono text-canary-text-3 font-semibold tracking-wider mb-2">
              Select a District to Inspect Telemetry:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DUBAI_PLACES.slice(0, 8).map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPlace && onSelectPlace(p)}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-medium bg-white/5 hover:bg-canary-amber hover:text-canvas-deep text-canary-text-2 border border-white/5 transition-all"
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="pt-4 border-t border-white/5">
          <button
            onClick={() => onSelectPlace && onSelectPlace(DUBAI_PLACES[0])}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#F2A33A] via-[#F5A623] to-[#EDCB63] text-canvas-deep font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-xl tracking-tight"
          >
            <span>Inspect Priority District: Al Quoz Industrial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Active District View
  const isAction = place.tier === 'ACTION';
  const isAlert = place.tier === 'ALERT';
  const isWatch = place.tier === 'WATCH';
  const alertCount = isAction ? 2 : isAlert ? 1 : 0;
  const completeness = 94;

  return (
    <div className="relative rounded-3xl p-6 overflow-hidden bg-gradient-to-br from-[#1A1A1C] via-[#141416] to-[#0D0D0E] border border-white/10 shadow-2xl flex flex-col justify-between h-full min-h-[500px]">
      <div className="space-y-4">
        {/* Top Header with Close Button */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  isAction
                    ? 'bg-[#E5483D] animate-ping'
                    : isAlert
                    ? 'bg-[#F2A33A] animate-pulse'
                    : isWatch
                    ? 'bg-[#EDCB63]'
                    : 'bg-emerald-400'
                }`}
              />
              <h3 className="text-base sm:text-lg font-black text-canary-text tracking-tight flex items-center gap-2 truncate">
                <span className="truncate">{place.name}</span>
                {place.arabicName && (
                  <span className="text-xs font-normal text-canary-amber opacity-75 shrink-0">
                    ({place.arabicName})
                  </span>
                )}
              </h3>
            </div>
            <p className="text-xs text-canary-text-3 font-medium mt-0.5 truncate">
              {place.categoryLabel}
            </p>
          </div>

          {/* Right Header Actions: Risk Tier Badge & Close Button */}
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                isAction
                  ? 'bg-[#E5483D]/20 text-[#FF9085] border border-[#E5483D]/40 shadow-[0_0_12px_rgba(229,72,61,0.3)]'
                  : isAlert
                  ? 'bg-[#F2A33A]/20 text-canary-amber border border-canary-amber/40 shadow-[0_0_12px_rgba(242,163,58,0.25)]'
                  : isWatch
                  ? 'bg-[#EDCB63]/20 text-[#EDCB63] border border-[#EDCB63]/30'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {place.tier} TIER
            </span>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-canary-text-3 hover:text-canary-text hover:bg-white/10 transition-colors"
                title="Close District Window (Return to Overview)"
                aria-label="Close District Dossier"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 3 Metric Cards (Active Cases, Workforce, Early Lead) */}
        <div className="grid grid-cols-3 gap-2 py-2 bg-black/40 rounded-2xl p-2.5 border border-white/5">
          <div className="text-center">
            <div className="text-[10px] uppercase font-mono text-canary-text-3 font-semibold tracking-wider">
              Active Cases
            </div>
            <div className="text-base sm:text-lg font-black text-canary-text font-mono mt-0.5">
              {place.cases.toLocaleString()}
            </div>
            <div
              className={`text-[10px] font-mono font-bold mt-0.5 ${
                place.caseTrend.startsWith('+') ? 'text-[#E5483D]' : 'text-emerald-400'
              }`}
            >
              {place.caseTrend}
            </div>
          </div>

          <div className="text-center border-x border-white/5 px-1">
            <div className="text-[10px] uppercase font-mono text-canary-text-3 font-semibold tracking-wider">
              Workforce
            </div>
            <div className="text-base sm:text-lg font-bold text-canary-text-2 mt-0.5">
              {place.workforceCount.replace(' workers', '')}
            </div>
            <div className="text-[10px] text-canary-text-3 font-medium mt-0.5">
              Protected
            </div>
          </div>

          <div className="text-center">
            <div className="text-[10px] uppercase font-mono text-canary-text-3 font-semibold tracking-wider">
              Early Lead
            </div>
            <div className="text-base sm:text-lg font-black text-canary-amber font-mono mt-0.5">
              {place.leadTimeGain.replace(' Early Warning', '')}
            </div>
            <div className="text-[10px] text-canary-amber/80 font-mono font-medium mt-0.5">
              Ahead of Risk
            </div>
          </div>
        </div>

        {/* Primary Anomaly Signal & Automated Prevention Playbook */}
        <div className="space-y-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex items-start gap-2 text-xs text-canary-text-2">
            <Flame className="w-3.5 h-3.5 text-[#F2A33A] shrink-0 mt-0.5" />
            <div className="leading-snug">
              <strong className="text-canary-text font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
                Primary Anomaly Signal:
              </strong>
              <span className="text-[11px]">{place.primaryRisk}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-canary-text-3 pt-2 border-t border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <strong className="text-canary-text-2 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
                Automated Prevention Playbook:
              </strong>
              <span className="text-[11px]">{place.playbook}</span>
            </div>
          </div>
        </div>

        {/* Unit Metadata Grid */}
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-canary-text-3 font-mono">
            Unit Metadata
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-mono text-canary-text-3 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-canary-amber" /> District
              </span>
              <span className="font-semibold text-canary-text truncate">Dubai Emirate</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex flex-col gap-0.5">
              <span className="text-[10px] uppercase font-mono text-canary-text-3 flex items-center gap-1">
                <Users className="w-3 h-3 text-canary-amber" /> Headcount Band
              </span>
              <span className="font-semibold text-canary-text truncate">{place.workforceCount}</span>
            </div>
          </div>
        </div>

        {/* Data Completeness Progress Bar */}
        <div className="space-y-1.5 p-3 rounded-2xl bg-black/30 border border-white/5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[10px] uppercase tracking-wider text-canary-text-3 font-mono">
              Data Completeness
            </span>
            <span className="text-emerald-400 font-bold font-mono text-xs">{completeness}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)] transition-all duration-700"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>

        {/* Role Scoping Note */}
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-canary-text-3">
          <div className="flex items-center gap-1.5 text-canary-text font-semibold mb-1">
            <Activity className="w-3.5 h-3.5 text-canary-amber" />
            <span>Role Scope Context:</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            Viewing as <strong className="text-canary-text font-medium">{roleInfo.title}</strong>.
            {isRegulator
              ? ' Granular syndromic clinical counts are masked under compliance view.'
              : ' Full multi-signal anomaly evidence is accessible.'}
          </p>
        </div>

        {/* Collapsible In-Card Detailed Telemetry (Remains strictly inside this card) */}
        {showDetailedTelemetry && (
          <div className="space-y-2 p-3 rounded-2xl bg-black/50 border border-canary-amber/20 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-canary-amber">
              <span>Granular Sensor &amp; Clinical Telemetry</span>
              <span className="text-emerald-400">Simulated</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-canary-text-2">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-canary-text-3">Ambient Sensor Node:</span>
                <span className="font-mono text-canary-text">42.1°C · PM2.5 14µg/m³</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-canary-text-3">Water Quality Index:</span>
                <span className="font-mono text-emerald-400">Nominal (Spore &lt; 0.02)</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-canary-text-3">Privacy Suppression:</span>
                <span className="font-mono text-canary-amber">k ≥ 5 Enforced (DP-compliant)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-canary-text-3">Synthetic Anomaly Seed:</span>
                <span className="font-mono text-canary-text-3">Seed #06-DUBAI-EXP</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick District Selector List */}
        <div>
          <div className="text-[10px] uppercase font-mono text-canary-text-3 font-semibold tracking-wider mb-1.5 flex items-center justify-between">
            <span>Inspect Other Dubai Districts:</span>
            <span className="text-canary-amber font-mono">{DUBAI_PLACES.length} Active Hubs</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {DUBAI_PLACES.slice(0, 6).map((p) => {
              const isCurrent = p.id === place.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPlace && onSelectPlace(p)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap transition-all ${
                    isCurrent
                      ? 'bg-canary-amber text-canvas-deep font-bold shadow-md'
                      : 'bg-white/5 text-canary-text-3 hover:text-canary-text hover:bg-white/10'
                  }`}
                >
                  {p.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons at Bottom (Never leaves or escapes the card) */}
      <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center gap-2">
        {/* Open Alerts Button */}
        <Link
          href="/alerts"
          className="w-full sm:flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#F2A33A] via-[#F5A623] to-[#EDCB63] text-canvas-deep font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-xl tracking-tight"
        >
          <ShieldAlert className="w-4 h-4 text-canvas-deep" />
          <span>Open Alerts for Site ({alertCount})</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Toggle Detailed Telemetry In-Place */}
        <button
          onClick={() => setShowDetailedTelemetry(!showDetailedTelemetry)}
          className="w-full sm:w-auto py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-canary-text font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
          title="Toggle inline detailed telemetry"
        >
          <span>{showDetailedTelemetry ? 'Hide Feeds' : 'Telemetry Feeds'}</span>
          {showDetailedTelemetry ? (
            <ChevronUp className="w-3.5 h-3.5 text-canary-amber" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-canary-amber" />
          )}
        </button>
      </div>
    </div>
  );
};
