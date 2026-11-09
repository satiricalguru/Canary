'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Panel } from '@/components/shared/Panel';
import { RiskTierBadge } from '@/components/shared/RiskTierBadge';
import { ProvenanceBadge } from '@/components/shared/ProvenanceBadge';
import { CompletenessMeter } from '@/components/shared/CompletenessMeter';
import { fetchAlertById, recordAuditEvent } from '@/lib/api/client';
import { useDemoRole } from '@/context/RoleContext';
import { AlertDetail } from '@/lib/types/domain';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  ComposedChart
} from 'recharts';
import {
  ArrowLeft,
  ShieldAlert,
  Clock,
  Calendar,
  Building2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  ExternalLink,
  Layers,
  Lock,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function AlertDetailPage() {
  const params = useParams();
  const alertId = params?.alertId as string;
  const router = useRouter();
  const { activeRole, isRegulator } = useDemoRole();

  const [alert, setAlert] = useState<AlertDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStreamIndex, setActiveStreamIndex] = useState(0);
  const [signOffModalOpen, setSignOffModalOpen] = useState(false);
  const [reviewPending, setReviewPending] = useState(false);
  const [reviewFailed, setReviewFailed] = useState(false);

  useEffect(() => {
    if (!alertId) return;
    const request = new AbortController();
    setActiveStreamIndex(0);
    setSignOffModalOpen(false);
    setLoading(true);
    setError(null);

    fetchAlertById(alertId, activeRole, request.signal)
      .then((data) => {
        if (request.signal.aborted) return;
        setAlert(data);
        setLoading(false);

        // Record audit view
        recordAuditEvent({
          actorRole: activeRole,
          eventType: 'VIEW_ALERT',
          resourceId: alertId,
        });
      })
      .catch((err) => {
        if (request.signal.aborted) return;
        console.error('Failed to load alert detail:', err);
        setError(err.message || 'Could not load alert');
        setLoading(false);
      });
    return () => request.abort();
  }, [alertId, activeRole]);

  if (loading) {
    return (
      <AppShell
        title="Alert detail"
        description="Multi-signal explainability breakdown and proportionate response playbooks."
      >
        <div className="py-16 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-2 border-canary-amber border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-canary-text-2">Loading alert evidence and signal contributions...</p>
        </div>
      </AppShell>
    );
  }

  if (error || !alert) {
    return (
      <AppShell
        title="Alert detail"
        description="Multi-signal explainability breakdown and proportionate response playbooks."
      >
        <div className="canary-panel p-8 text-center max-w-lg mx-auto flex flex-col items-center gap-4">
          <AlertTriangle className="w-10 h-10 text-tier-action-text" />
          <h2 className="text-base font-semibold text-canary-text">Unable to View Alert</h2>
          <p className="text-xs text-canary-text-2">{error || 'Alert not found.'}</p>
          <Link
            href="/alerts"
            className="px-4 py-2 rounded-control bg-panel-raised hover:bg-panel border border-border text-xs font-semibold text-canary-amber"
          >
            ← Return to Alert Inbox
          </Link>
        </div>
      </AppShell>
    );
  }

  const activeStream = alert.observedVsExpected[activeStreamIndex] || alert.observedVsExpected[0];

  return (
    <AppShell
      title={`Alert ${alert.id}`}
      description="Sense emerging population and workforce health risk through transparent multi-signal evidence."
    >
      <div className="flex flex-col gap-6">
        {/* Navigation Breadcrumb & Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/alerts"
            className="inline-flex items-center gap-2 text-xs font-medium text-canary-text-3 hover:text-canary-amber transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Alert Inbox</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs text-canary-text-3">Alert Status:</span>
            <span className="px-2.5 py-0.5 rounded text-xs font-semibold uppercase bg-panel-inset text-canary-amber border border-border">
              {alert.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Hero Alert Header Card with Plain-Language Summary */}
        <div className="canary-panel p-6 border-l-4 border-l-[#F08A2E] bg-panel-raised flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 flex-1">
            <div className="flex items-center flex-wrap gap-2.5">
              <RiskTierBadge tier={alert.tier} size="lg" />
              <span className="text-xs text-canary-text-3 font-semibold uppercase tracking-wider">
                {alert.hazardLabel}
              </span>
              <span className="text-canary-text-3">•</span>
              <span className="text-xs text-canary-text-2 font-medium flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-canary-amber" />
                {alert.unit.name} ({alert.unit.district})
              </span>
            </div>

            <h2 className="text-lg md:text-xl font-bold text-canary-text tracking-tight">
              {alert.title}
            </h2>

            {/* Plain-language summary (deterministic template as per PRD Feature 7 & 14) */}
            <p className="text-xs md:text-sm text-canary-text-2 leading-relaxed bg-panel-inset p-3.5 rounded-control border border-border">
              {alert.summary}
            </p>
          </div>

          {/* Top-Right Review Action Button */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0 self-start md:self-center">
            {isRegulator ? (
              <span className="rounded-control border border-border px-3 py-2 text-xs font-semibold text-canary-text-2">Compliance view</span>
            ) : (
              <button
                onClick={() => { setReviewFailed(false); setSignOffModalOpen(true); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-control bg-canary-amber hover:bg-canary-amber/90 text-canvas-deep font-bold text-xs shadow-amber-glow transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>Review and Sign Off</span>
              </button>
            )}
            <span className="text-[10px] text-canary-text-3 italic">
              Decision support · Requires human review
            </span>
          </div>
        </div>

        {/* 5-Question Bento Layout (PRD Feature 7) */}
        <div className="grid grid-cols-12 gap-6">
          {/* Question 1: What Changed (Observed vs Expected Signal Strips) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col">
            <Panel
              title="1. What Changed"
              subtitle="Observed values vs expected baseline with 95% forecast credibility interval"
              provenance={activeStream?.provenance}
              sourceName={activeStream?.sourceName}
              trailingAction={
                <div className="flex items-center gap-1 bg-panel-inset p-1 rounded-control border border-border">
                  {alert.observedVsExpected.map((stream, idx) => (
                    <button
                      key={stream.streamId}
                      onClick={() => setActiveStreamIndex(idx)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        activeStreamIndex === idx
                          ? 'bg-panel-raised text-canary-amber font-semibold shadow-sm'
                          : 'text-canary-text-3 hover:text-canary-text'
                      }`}
                    >
                      {stream.streamName.split(' ')[0]}
                    </button>
                  ))}
                </div>
              }
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-canary-text-3">
                  <span className="font-semibold text-canary-text">
                    {activeStream?.streamName} ({activeStream?.unit})
                  </span>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-0.5 bg-[#F2A33A]" /> Observed
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-0.5 border-b border-dashed border-[#8A857C]" /> Expected GLM
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2 bg-[#F2A33A]/10 border border-[#F2A33A]/20" /> 95% Bound
                    </span>
                  </div>
                </div>

                {/* Signal Chart */}
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={activeStream?.history || []}
                      margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                      <CartesianGrid stroke="#2C2C2E" strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#8A857C"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#2C2C2E' }}
                      />
                      <YAxis
                        stroke="#8A857C"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: '#2C2C2E' }}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-panel-raised border border-border p-3 rounded-control shadow-xl text-xs space-y-1">
                                <span className="font-semibold text-canary-text">{label}</span>
                                {payload.map((p: any, i: number) => (
                                  <div key={i} className="flex justify-between gap-4 text-canary-text-2">
                                    <span>{p.name}:</span>
                                    <span className="font-medium text-canary-text tabular-nums">
                                      {p.value === null ? 'No data (Missing)' : p.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      {/* Expected Range Band */}
                      <Area
                        type="monotone"
                        dataKey="expectedMax"
                        name="Upper Limit"
                        stroke="none"
                        fill="#F2A33A"
                        fillOpacity={0.08}
                      />
                      <Area
                        type="monotone"
                        dataKey="expectedMin"
                        name="Lower Limit"
                        stroke="none"
                        fill="#1B1B1C"
                        fillOpacity={1}
                      />

                      {/* Expected Baseline Line (Dashed) */}
                      <Line
                        type="monotone"
                        dataKey="expected"
                        name="Expected Normal"
                        stroke="#8A857C"
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        dot={false}
                      />

                      {/* Observed Signal Line (Solid Amber with Point Markers) */}
                      <Line
                        type="monotone"
                        dataKey="observed"
                        name="Observed Count"
                        stroke="#F2A33A"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#F2A33A' }}
                        activeDot={{ r: 6 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Panel>
          </div>

          {/* Question 2: Why Canary Raised This (Contribution Waterfall) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col">
            <Panel
              title="2. Why Canary Raised This"
              subtitle="Evidence fusion waterfall: Exposure prior leads; outcomes confirm"
            >
              <div className="space-y-4">
                {/* Persistence Rule Status Banner */}
                <div className="p-3 rounded-control bg-panel-inset border border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-status-ok" />
                    <span className="font-medium text-canary-text">
                      Persistence Requirement Met
                    </span>
                  </div>
                  <span className="text-[11px] text-canary-text-3">
                    Exceeded 2 of last 3 days ✓
                  </span>
                </div>

                {/* Horizontal Waterfall Breakdown */}
                <div className="space-y-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-canary-text-3 block">
                    Relative Evidence Contributions:
                  </span>

                  {alert.contributions.map((c, i) => (
                    <div key={i} className="p-3 rounded-control canary-panel-inset space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-canary-text">{c.label}</span>
                          <ProvenanceBadge kind={c.provenance} size="sm" />
                        </div>
                        <span className="font-semibold text-canary-amber tabular-nums">
                          {Math.round(c.contribution * 100)}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-canary-text-3">
                        <span>Obs: {c.observed}</span>
                        <span>Exp: {c.expected}</span>
                      </div>

                      {/* Contribution Bar */}
                      <div className="w-full bg-panel rounded-full h-2 overflow-hidden border border-border/50">
                        <div
                          className="h-full bg-gradient-to-r from-[#E8C14A] to-[#F08A2E] rounded-full transition-all duration-500"
                          style={{ width: `${Math.round(c.contribution * 100)}%` }}
                        />
                      </div>

                      {/* Correlation discount or cap notes */}
                      <div className="flex items-center gap-2 text-[10px] text-canary-text-3">
                        {c.capped && (
                          <span className="text-tier-watch-text">• Evidence contribution capped at safety limit</span>
                        )}
                        {c.correlationDiscountApplied && (
                          <span className="text-prov-real">• Correlation discount applied (avoids double-counting)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </div>

          {/* Question 3: Where and When */}
          <div className="col-span-12 lg:col-span-6 flex flex-col">
            <Panel
              title="3. Where and When"
              subtitle="Geographic cluster zone, time window, and temporal onset"
            >
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="canary-panel-inset p-3 space-y-1">
                    <span className="text-canary-text-3 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-canary-amber" /> Monitored Facility
                    </span>
                    <span className="font-semibold text-canary-text block">{alert.unit.name}</span>
                    <span className="text-canary-text-3 text-[11px]">{alert.unit.district}</span>
                  </div>

                  <div className="canary-panel-inset p-3 space-y-1">
                    <span className="text-canary-text-3 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-canary-amber" /> Evaluation Window
                    </span>
                    <span className="font-semibold text-canary-text block">
                      {alert.window.start} → {alert.window.end}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-control bg-panel-inset border border-border space-y-1.5">
                  <span className="font-semibold text-canary-text block">
                    Spatial Zone Analysis:
                  </span>
                  <p className="text-canary-text-2 text-xs leading-relaxed">
                    This example covers the monitoring unit and date range shown above. Open the surveillance map to see the wider monitoring area.
                  </p>
                </div>
              </div>
            </Panel>
          </div>

          {/* Question 4: How Reliable Is This */}
          <div className="col-span-12 lg:col-span-6 flex flex-col">
            <Panel
              title="4. How Reliable is the Evidence"
              subtitle="Data completeness, stream freshness, delays, and known assumptions"
            >
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="canary-panel-inset p-3 space-y-1">
                    <span className="text-canary-text-3 font-medium">Overall Stream Completeness</span>
                    <div className="flex items-center gap-2 mt-1">
                      <CompletenessMeter percentage={alert.overallCompleteness} />
                    </div>
                  </div>

                  <div className="canary-panel-inset p-3 space-y-1">
                    <span className="text-canary-text-3 font-medium">Model Uncertainty</span>
                    <div className="flex items-center gap-1.5 mt-1 font-semibold capitalize text-status-ok">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{alert.uncertaintyScore} Uncertainty</span>
                    </div>
                  </div>
                </div>

                <div className="canary-panel-inset p-3 space-y-2">
                  <span className="font-semibold text-canary-text block">Feed Ingestion Auditing:</span>
                  <div className="flex items-center justify-between text-canary-text-2">
                    <span>Environmental Observations:</span>
                    <span className="text-status-ok font-medium">Hourly CAMS sync (Fresh)</span>
                  </div>
                  <div className="flex items-center justify-between text-canary-text-2">
                    <span>Clinical Outcomes:</span>
                    <span className="text-canary-text font-medium">Daily batch aggregate (Normal)</span>
                  </div>
                  {alert.missingStreams.length > 0 ? (
                    <div className="text-status-stale bg-[#B89A5B]/10 p-2 rounded border border-[#B89A5B]/20">
                      ⚠ Note: {alert.missingStreams.join(', ')} omitted from score to prevent false confidence.
                    </div>
                  ) : (
                    <div className="text-canary-text-3 text-[11px]">
                      All required input streams verified against strict aggregate contract.
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </div>

          {/* Question 5: What to Consider Doing (Action Playbook & Governance) */}
          <div className="col-span-12 flex flex-col">
            <Panel
              title="5. What to Consider Doing (Decision Support Playbook)"
              subtitle="Actionable, proportionate recommendations mapped to designated operational owners"
              className="border border-[#F2A33A]/30 bg-panel-raised"
            >
              <div className="space-y-5 text-xs">
                {/* Suggested Action Box */}
                <div className="p-4 rounded-control bg-panel-inset border border-border space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-canary-amber">
                    Recommended Operational Response:
                  </span>
                  <p className="text-sm font-semibold text-canary-text leading-relaxed">
                    {alert.recommendation.action}
                  </p>
                </div>

                {/* Role, Escalation, Review-By Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="canary-panel-inset p-3.5 space-y-1">
                    <span className="text-canary-text-3 uppercase text-[10px] tracking-wider font-semibold">
                      Responsible Action Role
                    </span>
                    <p className="text-xs font-bold text-canary-text">
                      {alert.recommendation.ownerRoleLabel}
                    </p>
                  </div>

                  <div className="canary-panel-inset p-3.5 space-y-1">
                    <span className="text-canary-text-3 uppercase text-[10px] tracking-wider font-semibold">
                      Review-By Milestone
                    </span>
                    <p className="text-xs font-bold text-canary-text tabular-nums">
                      {alert.recommendation.reviewBy}
                    </p>
                  </div>

                  <div className="canary-panel-inset p-3.5 space-y-1">
                    <span className="text-canary-text-3 uppercase text-[10px] tracking-wider font-semibold">
                      Escalation Criteria
                    </span>
                    <p className="text-xs text-canary-text-2">
                      {alert.recommendation.escalationPath}
                    </p>
                  </div>
                </div>

                {/* Evidence & Assumptions Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="canary-panel-inset p-3.5 space-y-2">
                    <span className="font-semibold text-canary-text block uppercase text-[10px] tracking-wider">
                      Supporting Evidence:
                    </span>
                    <ul className="space-y-1.5 text-canary-text-2 list-disc list-inside">
                      {alert.recommendation.evidence.map((ev, idx) => (
                        <li key={idx} className="leading-relaxed">{ev}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="canary-panel-inset p-3.5 space-y-2">
                    <span className="font-semibold text-canary-text block uppercase text-[10px] tracking-wider">
                      Stated Assumptions:
                    </span>
                    <ul className="space-y-1.5 text-canary-text-2 list-disc list-inside">
                      {alert.recommendation.assumptions.map((asmp, idx) => (
                        <li key={idx} className="leading-relaxed">{asmp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Authoritative Guidance Link & Legal Disclaimer Bar */}
                <div className="pt-3 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-canary-text-3">
                  <div className="flex items-center gap-1.5 text-canary-text-2">
                    <FileText className="w-4 h-4 text-canary-amber" />
                    <span>Guidance Reference: </span>
                    {alert.recommendation.guidanceUrl ? (
                      <a
                        href={alert.recommendation.guidanceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-canary-amber hover:underline inline-flex items-center gap-1"
                      >
                        <span>{alert.recommendation.guidanceReference}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="font-medium text-canary-text">{alert.recommendation.guidanceReference}</span>
                    )}
                  </div>

                  <div className="p-2 rounded bg-panel border border-border text-[11px] text-tier-watch-text font-medium">
                    ⚠️ Decision Support Only: Requires human physician/HSE officer sign-off.
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>

      {/* Review and Sign Off Modal */}
      {signOffModalOpen && (
        <div className="fixed inset-0 bg-canvas-deep/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="canary-panel p-6 max-w-md w-full bg-panel-raised border border-border-strong shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-canary-amber">
              <UserCheck className="w-6 h-6" />
              <h3 className="text-base font-bold text-canary-text">Review and Sign Off</h3>
            </div>

            <p className="text-xs text-canary-text-2 leading-relaxed">
              You are reviewing recommendation for <strong className="text-canary-text">{alert.title}</strong> at {alert.unit.name}.
            </p>

            <div className="p-3 bg-panel-inset rounded-control border border-border text-xs text-canary-text-3 space-y-1">
              <div>Owner Role: <strong className="text-canary-text">{alert.recommendation.ownerRoleLabel}</strong></div>
              <div>Current Demo Role: <strong className="text-canary-amber">{activeRole}</strong></div>
            </div>

            <div className="p-3 rounded bg-[#B89A5B]/15 border border-[#B89A5B]/30 text-xs text-tier-watch-text flex items-start gap-2">
              <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                Demonstration Notice: Demo roles operate in read-only audit mode. State changes are preserved in the session audit log without executing production dispatch.
              </span>
            </div>

            {reviewFailed && <p role="alert" className="text-xs text-tier-action-text">The demo review could not be recorded. Try again.</p>}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSignOffModalOpen(false)}
                className="px-4 py-2 rounded-control bg-panel border border-border text-xs text-canary-text font-medium hover:bg-panel-inset"
              >
                Cancel
              </button>
              <button
                disabled={reviewPending}
                onClick={async () => {
                  setReviewPending(true);
                  setReviewFailed(false);
                  const recorded = await recordAuditEvent({
                    actorRole: activeRole,
                    eventType: 'SIGN_OFF_ATTEMPT',
                    resourceId: alert.id,
                  });
                  setReviewPending(false);
                  if (!recorded) {
                    setReviewFailed(true);
                    return;
                  }
                  setSignOffModalOpen(false);
                  setAlert((current) => current?.id === alert.id ? { ...current, status: 'under_review' } : current);
                }}
                className="px-4 py-2 rounded-control bg-canary-amber text-canary-on-accent font-semibold text-xs shadow-amber-glow"
              >
                Confirm Review & Record Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

