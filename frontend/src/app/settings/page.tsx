'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Panel } from '@/components/shared/Panel';
import { useDemoRole } from '@/context/RoleContext';
import { DEMO_ROLES } from '@/lib/data/seededData';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Server,
  Sliders,
  FileCheck,
  History,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  const { activeRole, setRole, roleInfo } = useDemoRole();
  const [kThreshold, setKThreshold] = useState<number>(5);
  const [feedStatus, setFeedStatus] = useState({
    cams: true,
    openMeteo: true,
    clinicEmr: true,
    telehealth: true,
    absence: true,
  });

  const toggleFeed = (key: keyof typeof feedStatus) => {
    setFeedStatus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AppShell
      title="Settings & telemetry"
      description="Switch demo roles and preview privacy and telemetry settings."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Role & Privacy Configuration (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Demo Profile Scoping */}
          <Panel
            title="ROLE-BASED SURVEILLANCE BOUNDARIES"
            trailingAction={<span className="text-xs font-mono text-canary-amber">{roleInfo.title}</span>}
          >
            <p className="text-xs text-canary-text-2 mb-4 leading-relaxed">
              Switch the demo role to explore different views. The dashboard and replay include shared illustrative scenarios.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {DEMO_ROLES.map((r) => {
                const isSelected = activeRole === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`p-3 rounded-panel border text-left transition-all ${
                      isSelected
                        ? 'bg-panel-raised border-canary-amber shadow-amber-glow'
                        : 'bg-panel-inset border-border hover:border-canary-amber/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-canary-text">{r.title}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-canary-amber" />}
                    </div>
                    <span className="text-[11px] text-canary-text-3 block">{r.scope}</span>
                  </button>
                );
              })}
            </div>

            {/* Current Role Access Rights */}
            <div className="p-3.5 rounded-panel bg-panel-inset border border-border space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-canary-text-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-status-ok" />
                <span>Authorized Capabilities &amp; Disallowed Boundaries</span>
              </h4>
              <p className="text-xs text-canary-text-2">{roleInfo.description}</p>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-canary-text-3">Clinical Syndromic Detail:</span>
                <span className={`font-semibold ${roleInfo.hasHealthDetail ? 'text-status-ok' : 'text-canary-text-3'}`}>
                  {roleInfo.hasHealthDetail ? 'Authorized (Full Access)' : 'Restricted (High-Level Only)'}
                </span>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="text-canary-text-3">Action Sign-Off Authority:</span>
                <span className={`font-semibold ${activeRole === 'oh_lead' || activeRole === 'hse_officer' ? 'text-status-ok' : 'text-canary-text-3'}`}>
                  {activeRole === 'oh_lead' || activeRole === 'hse_officer' ? 'Authorized Signatory' : 'Review Only (No Sign-Off)'}
                </span>
              </div>
            </div>
          </Panel>

          {/* Aggregate Privacy & Small-Cell Suppression */}
          <Panel title="AGGREGATE PRIVACY CONTRACT &amp; SMALL-CELL SUPPRESSION">
            <p className="text-xs text-canary-text-2 mb-4 leading-relaxed">
              Canary enforces strict small-cell suppression. Any aggregate group count falling below the threshold <code className="text-canary-amber font-mono font-bold">k</code> is replaced with <code className="text-canary-amber font-mono font-bold">&lt;{kThreshold}</code> to prevent re-identification.
            </p>

            <div className="p-4 rounded-panel bg-panel-inset border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-canary-text">Small-Cell Threshold (k):</span>
                <span className="text-base font-bold text-canary-amber font-mono tabular-nums">
                  k = {kThreshold}
                </span>
              </div>

              <input
                type="range"
                aria-label="Preview privacy threshold"
                min="3"
                max="10"
                value={kThreshold}
                onChange={(e) => setKThreshold(parseInt(e.target.value))}
                className="w-full accent-[#F2A33A] h-2 bg-canvas-deep rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[10px] text-canary-text-3 font-mono">
                <span>k = 3 (Minimum)</span>
                <span className="text-canary-amber font-semibold">k = 5 (demo default)</span>
                <span>k = 10 (Strict)</span>
              </div>
            </div>

            {/* Ingestion Rules Check */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-panel-inset border border-border flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-ok flex-shrink-0" />
                <span className="text-canary-text-2">Zero Personal Identifiers Stored</span>
              </div>
              <div className="p-3 rounded bg-panel-inset border border-border flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-ok flex-shrink-0" />
                <span className="text-canary-text-2">Audit events recorded in the demo</span>
              </div>
            </div>
          </Panel>
        </div>

        {/* Right Column: Telemetry Feeds & System Health (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Feed Telemetry Toggles */}
          <Panel title="ENVIRONMENTAL &amp; SYNDROMIC INGESTION PIPELINES">
            <p className="text-xs text-canary-text-2 mb-4">
              Toggle the example feed states. These controls affect this preview only.
            </p>

            <div className="space-y-3 text-xs">
              {/* Feed 1 */}
              <div className="p-3 rounded-panel bg-panel-inset border border-border flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-canary-text">Copernicus CAMS PM2.5 Ensemble</span>
                  <span className="text-[10px] text-canary-text-3">European Atmospheric Reanalysis · 3h cadence</span>
                </div>
                <button
                  onClick={() => toggleFeed('cams')}
                  aria-label={`CAMS air quality feed preview: ${feedStatus.cams ? 'Active' : 'Disabled'}`}
                  aria-pressed={feedStatus.cams}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    feedStatus.cams ? 'bg-emerald-500/20 text-status-ok border border-emerald-500/40' : 'bg-canvas-deep text-canary-text-3'
                  }`}
                >
                  {feedStatus.cams ? 'Active' : 'Disabled'}
                </button>
              </div>

              {/* Feed 2 */}
              <div className="p-3 rounded-panel bg-panel-inset border border-border flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-canary-text">Open-Meteo Thermal WBGT Grid</span>
                  <span className="text-[10px] text-canary-text-3">Global Numerical Weather Prediction · Hourly</span>
                </div>
                <button
                  onClick={() => toggleFeed('openMeteo')}
                  aria-label={`Open-Meteo heat feed preview: ${feedStatus.openMeteo ? 'Active' : 'Disabled'}`}
                  aria-pressed={feedStatus.openMeteo}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    feedStatus.openMeteo ? 'bg-emerald-500/20 text-status-ok border border-emerald-500/40' : 'bg-canvas-deep text-canary-text-3'
                  }`}
                >
                  {feedStatus.openMeteo ? 'Active' : 'Disabled'}
                </button>
              </div>

              {/* Feed 3 */}
              <div className="p-3 rounded-panel bg-panel-inset border border-border flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-canary-text">Primary Clinic EMR Aggregates</span>
                  <span className="text-[10px] text-canary-text-3">Syndromic Chief Complaint Codes · Daily</span>
                </div>
                <button
                  onClick={() => toggleFeed('clinicEmr')}
                  aria-label={`Clinic aggregates feed preview: ${feedStatus.clinicEmr ? 'Active' : 'Disabled'}`}
                  aria-pressed={feedStatus.clinicEmr}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    feedStatus.clinicEmr ? 'bg-emerald-500/20 text-status-ok border border-emerald-500/40' : 'bg-canvas-deep text-canary-text-3'
                  }`}
                >
                  {feedStatus.clinicEmr ? 'Active' : 'Disabled'}
                </button>
              </div>

              {/* Feed 4 */}
              <div className="p-3 rounded-panel bg-panel-inset border border-border flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-canary-text">Workforce Absence Registry</span>
                  <span className="text-[10px] text-canary-text-3">Aggregate Sickness Absences · Shift daily</span>
                </div>
                <button
                  onClick={() => toggleFeed('absence')}
                  aria-label={`Workforce absence feed preview: ${feedStatus.absence ? 'Active' : 'Disabled'}`}
                  aria-pressed={feedStatus.absence}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    feedStatus.absence ? 'bg-emerald-500/20 text-status-ok border border-emerald-500/40' : 'bg-canvas-deep text-canary-text-3'
                  }`}
                >
                  {feedStatus.absence ? 'Active' : 'Disabled'}
                </button>
              </div>
            </div>
          </Panel>

          {/* System Provenance & Safety Notice */}
          <Panel title="GOVERNANCE &amp; CLINICAL SAFETY NOTICES">
            <div className="p-4 rounded-panel bg-[#F2A33A]/10 border border-[#F2A33A]/30 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-canary-amber font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Decision Support Boundary</span>
              </div>
              <p className="text-canary-text-2 leading-relaxed">
                Canary is an epidemiological and occupational health early-warning tool. Output constitutes automated statistical decision support only and requires review and confirmation by an authorized Occupational Health Lead or Public Health Epidemiologist before public action.
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
