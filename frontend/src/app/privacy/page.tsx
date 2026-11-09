'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Panel } from '@/components/shared/Panel';
import { SuppressedCell } from '@/components/shared/SuppressedCell';
import { fetchSuppressionData, fetchAuditLogs, testIngestPayload } from '@/lib/api/client';
import { useDemoRole } from '@/context/RoleContext';
import { AuditEvent, DemoRole } from '@/lib/types/domain';
import { SuppressionDemoRow } from '@/lib/types/api';
import { DEMO_ROLES } from '@/lib/data/seededData';
import {
  ShieldCheck,
  Lock,
  FileCode,
  Eye,
  Sliders,
  History,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  KeyRound,
  FileText
} from 'lucide-react';

export default function PrivacyGovernancePage() {
  const { activeRole, setRole } = useDemoRole();
  const [kThreshold, setKThreshold] = useState<number>(5);
  const [suppressionRows, setSuppressionRows] = useState<SuppressionDemoRow[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [suppressionError, setSuppressionError] = useState(false);

  // Ingestion validation sandbox state
  const [payloadType, setPayloadType] = useState<'valid' | 'forbidden_person' | 'unknown_keys'>('forbidden_person');
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const request = new AbortController();
    setLoading(true);
    setSuppressionError(false);
    fetchSuppressionData(kThreshold, request.signal)
      .then((res) => { if (!request.signal.aborted) setSuppressionRows(res.rows); })
      .catch(() => { if (!request.signal.aborted) setSuppressionError(true); })
      .finally(() => { if (!request.signal.aborted) setLoading(false); });
    return () => request.abort();
  }, [kThreshold]);

  useEffect(() => {
    fetchAuditLogs().then((res) => setAuditLogs(res.events)).catch(() => setAuditLogs([]));
  }, [activeRole]);

  const runIngestionTest = async (type: 'valid' | 'forbidden_person' | 'unknown_keys') => {
    setTesting(true);
    setPayloadType(type);

    let samplePayload: any;
    if (type === 'valid') {
      samplePayload = {
        unit_id: 'site-04',
        date: '2026-11-07',
        category: 'respiratory_clinic_visits',
        count: 14,
        stream: 'health_service',
        source: 'synthetic_demo',
        is_synthetic: true,
      };
    } else if (type === 'forbidden_person') {
      samplePayload = {
        unit_id: 'site-04',
        date: '2026-11-07',
        category: 'respiratory_clinic_visits',
        count: 1,
        patient_id: 'PT-998231', // Prohibited person identifier!
        employee_name: 'Rashid Al-Kindi', // Prohibited!
      };
    } else {
      samplePayload = {
        unit_id: 'site-04',
        date: '2026-11-07',
        category: 'respiratory_clinic_visits',
        count: 12,
        unapproved_free_text_notes: 'Patient reported cough', // Disallowed field
      };
    }

    setTestResult(null);
    try {
      setTestResult(await testIngestPayload(samplePayload));
    } catch {
      setTestResult({ status: 'unavailable', error: 'The ingest validator could not be reached. Try again.' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <AppShell
      title="Privacy & governance"
      description="Privacy by architectural design: Aggregate-only data contracts, mathematical cell suppression, and role-based access control."
    >
      <div className="flex flex-col gap-6">
        {/* Core Non-Negotiable Boundary Card */}
        <div className="p-4 rounded-panel bg-[#E5483D]/10 border border-[#E5483D]/30 flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-tier-action-text flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-canary-text uppercase tracking-wider">
              Non-Negotiable Responsible Use Boundary
            </h3>
            <p className="text-xs text-canary-text leading-relaxed">
              Canary is architected exclusively for population-level and workforce-aggregate hazard surveillance. The platform <strong>never stores, ingests, infers, or exposes person-level health records, individual identities, or worker attendance profiling</strong>. Canary is strictly prohibited from being used for individual disciplinary action or employee performance appraisal.
            </p>
          </div>
        </div>

        {/* Aggregate Data Contract & Ingestion Testing Sandbox */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-6 flex flex-col">
            <Panel
              title="Aggregate-Only Ingestion Schema"
              subtitle="The canonical four-field data boundary enforced strictly at API ingestion boundary"
            >
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-control canary-panel-inset font-mono text-xs text-canary-text-2 space-y-1">
                  <div className="text-canary-amber font-semibold">// Approved Canonical Contract</div>
                  <div>&#123;</div>
                  <div className="pl-4"><span className="text-prov-real">&quot;unit_id&quot;</span>: <span className="text-tier-watch-text">&quot;site-004&quot;</span>, <span className="text-canary-text-3">// Monitored site / district</span></div>
                  <div className="pl-4"><span className="text-prov-real">&quot;date&quot;</span>: <span className="text-tier-watch-text">&quot;2026-11-07&quot;</span>, <span className="text-canary-text-3">// Observation bucket</span></div>
                  <div className="pl-4"><span className="text-prov-real">&quot;category&quot;</span>: <span className="text-tier-watch-text">&quot;respiratory_clinic_visits&quot;</span>,</div>
                  <div className="pl-4"><span className="text-prov-real">&quot;count&quot;</span>: <span className="text-tier-alert-text">14</span> <span className="text-canary-text-3">// Approved aggregate count</span></div>
                  <div>&#125;</div>
                </div>

                <div className="text-canary-text-2 text-xs leading-relaxed space-y-1">
                  <p>
                    All API ingress payloads are validated by strict Pydantic schemas. Payloads containing row-level identifiers (such as names, national IDs, or case notes) are immediately rejected with HTTP 400 and logged without persisting sensitive text.
                  </p>
                </div>
              </div>
            </Panel>
          </div>

          <div className="col-span-12 lg:col-span-6 flex flex-col">
            <Panel
              title="Interactive Ingestion Validator"
              subtitle="Test how the ingestion API enforces the privacy boundary against malformed or person-level payloads"
            >
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => runIngestionTest('forbidden_person')}
                    className="px-3 py-1.5 rounded-control bg-panel-inset hover:bg-panel border border-border text-xs text-canary-text font-medium"
                  >
                    Test Prohibited Person Field
                  </button>
                  <button
                    onClick={() => runIngestionTest('valid')}
                    className="px-3 py-1.5 rounded-control bg-panel-inset hover:bg-panel border border-border text-xs text-canary-text font-medium"
                  >
                    Test Valid Aggregate
                  </button>
                  <button
                    onClick={() => runIngestionTest('unknown_keys')}
                    className="px-3 py-1.5 rounded-control bg-panel-inset hover:bg-panel border border-border text-xs text-canary-text font-medium"
                  >
                    Test Disallowed Keys
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`p-3.5 rounded-control border space-y-1.5 ${
                      testResult.status === 'accepted'
                        ? 'bg-[#7FB45A]/10 border-[#7FB45A]/30 text-canary-text'
                        : 'bg-[#E5483D]/10 border-[#E5483D]/30 text-canary-text'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      {testResult.status === 'accepted' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-status-ok" />
                          <span className="text-status-ok">HTTP 201: Payload Accepted</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-tier-action-text" />
                          <span className="text-tier-action-text">HTTP 400: Ingestion Gate Rejection</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-canary-text-2 leading-relaxed">
                      {testResult.message || testResult.error}
                    </p>
                  </div>
                )}
              </div>
            </Panel>
          </div>
        </div>

        {/* Live Small-Cell Suppression Demonstration (PRD Feature 9 & DESIGN.md Section 4.6) */}
        <Panel
          title="Small-cell suppression preview"
          subtitle="Interactive demonstration of primary k-suppression and secondary total-protection suppression"
          trailingAction={
            <div className="flex items-center gap-3 text-xs">
              <span className="text-canary-text-3 font-semibold">Privacy Threshold:</span>
              <div className="flex items-center gap-2 bg-panel-inset px-2.5 py-1 rounded border border-border">
                <span className="font-mono font-bold text-canary-amber">k = {kThreshold}</span>
                <input
                  type="range"
                  aria-label="Privacy threshold"
                  min={3}
                  max={10}
                  value={kThreshold}
                  onChange={(e) => setKThreshold(Number(e.target.value))}
                  className="w-24 accent-canary-amber cursor-pointer"
                />
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            {suppressionError && <p role="alert" className="mb-3 text-xs text-tier-action-text">Suppression preview could not be loaded. Adjust the threshold to retry.</p>}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-canary-text border-collapse">
                <thead className="bg-panel-inset text-canary-text-3 uppercase tracking-wider text-[10px] border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Monitoring Unit</th>
                    <th className="py-2.5 px-3 font-semibold">Syndromic Category</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Synthetic input</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Export / View Value</th>
                    <th className="py-2.5 px-3 font-semibold">Suppression Rule Applied</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {(suppressionError ? [] : suppressionRows).map((row) => (
                    <tr key={row.id} className="hover:bg-panel-raised transition-colors">
                      <td className="py-2.5 px-3 font-medium text-canary-text">{row.siteName}</td>
                      <td className="py-2.5 px-3 text-canary-text-2 font-mono text-[11px]">{row.category}</td>
                      <td className="py-2.5 px-3 text-right text-canary-text-3 tabular-nums font-mono">
                        {row.rawCount}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {row.isSuppressed || row.isSecondarySuppressed ? (
                          <SuppressedCell threshold={kThreshold} isSecondary={row.isSecondarySuppressed} />
                        ) : (
                          <span className="font-semibold text-canary-text tabular-nums">{row.maskedValue}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-canary-text-3">
                        {row.suppressionReason || 'Count ≥ k: Safe to publish without re-identification risk.'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Panel>

        {/* Role Scoping Preview & Demonstration */}
        <Panel
          title="Role-Based Data Access Boundaries"
          subtitle="Enforced strictly on the server: Switch roles to verify permitted operational scopes"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {DEMO_ROLES.map((r) => {
              const isSelected = activeRole === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`p-4 rounded-control border canary-panel-inset flex flex-col justify-between gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-canary-amber bg-panel-raised shadow-amber-glow'
                      : 'border-border hover:border-border-strong'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-canary-text">{r.shortName}</span>
                      {isSelected && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-canary-amber text-canary-on-accent">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-canary-text-3 leading-relaxed">
                      {r.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/60 text-[10px] space-y-1">
                    <div className="text-canary-text-2">
                      Scope: <strong className="text-canary-text">{r.scope}</strong>
                    </div>
                    <div className={r.hasHealthDetail ? 'text-status-ok' : 'text-tier-action-text'}>
                      {r.hasHealthDetail ? '✓ Health Count Detail Permitted' : '✗ Health Detail Masked (Compliance Only)'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Live Immutable Audit Log */}
        <Panel
          title="System Audit & Access Log"
          subtitle="Append-only record of view accesses and demonstration role switches"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-canary-text border-collapse">
              <thead className="bg-panel-inset text-canary-text-3 uppercase tracking-wider text-[10px] border-b border-border">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                  <th className="py-2.5 px-3 font-semibold">Actor Role</th>
                  <th className="py-2.5 px-3 font-semibold">Event Type</th>
                  <th className="py-2.5 px-3 font-semibold">Resource</th>
                  <th className="py-2.5 px-3 font-semibold">Details</th>
                  <th className="py-2.5 px-3 font-semibold text-right">IP (Masked)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-panel-raised transition-colors">
                    <td className="py-2.5 px-3 text-canary-text-3 tabular-nums font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString('en-GB')}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-canary-amber">{log.actorLabel}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-canary-text-2">{log.eventType}</td>
                    <td className="py-2.5 px-3 text-canary-text-3 font-mono text-[11px]">{log.resourceId}</td>
                    <td className="py-2.5 px-3 text-canary-text-2">{log.details}</td>
                    <td className="py-2.5 px-3 text-right text-canary-text-3 font-mono text-[11px]">{log.ipMasked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}

