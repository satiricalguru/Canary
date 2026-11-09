'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Panel } from '@/components/shared/Panel';
import { ProvenanceBadge } from '@/components/shared/ProvenanceBadge';
import {
  TrendingUp,
  RotateCcw,
  Sliders,
  ShieldAlert,
  Info,
  CheckCircle2,
  FileText,
  Calculator,
  UserCheck
} from 'lucide-react';

export default function ImpactEstimatorPage() {
  // Interactive assumption controls (sliders)
  const [interventionUptake, setInterventionUptake] = useState<number>(70); // 70% default
  const [preventiveEffectiveness, setPreventiveEffectiveness] = useState<number>(45); // 45% default
  const [leadTimeGainDays, setLeadTimeGainDays] = useState<number>(2.8); // 2.8 days default

  const resetDefaults = () => {
    setInterventionUptake(70);
    setPreventiveEffectiveness(45);
    setLeadTimeGainDays(2.8);
  };

  // Base synthetic incidence per day across 48 simulated events
  const dailyCasesExposed = 62;
  const severeRatio = 0.12;
  const absencePerCase = 2.4;

  const calculateEstimates = (multiplier: number) => {
    const effectiveUptake = (interventionUptake / 100) * multiplier;
    const effectivePrevent = (preventiveEffectiveness / 100) * multiplier;
    const daysGained = leadTimeGainDays * multiplier;

    const avoidedCases = Math.round(dailyCasesExposed * daysGained * effectiveUptake * effectivePrevent);
    const avoidedSevere = Math.round(avoidedCases * severeRatio);
    const avoidedAbsence = Math.round(avoidedCases * absencePerCase);

    return { avoidedCases, avoidedSevere, avoidedAbsence };
  };

  const lowEstimate = calculateEstimates(0.65);
  const baseEstimate = calculateEstimates(1.0);
  const highEstimate = calculateEstimates(1.35);

  return (
    <AppShell
      title="Impact estimator"
      description="Estimate the potential clinical and operational cases avoided through early detection and proportionate preventive action."
    >
      <div className="flex flex-col gap-6">
        {/* Top Disclaimer Banner */}
        <div className="p-4 rounded-panel bg-[#D9B26F]/10 border border-[#D9B26F]/30 flex items-start gap-3">
          <ProvenanceBadge kind="illustrative" size="md" className="mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-canary-text uppercase tracking-wider">
              Illustrative Scenario-Based Modeling Only
            </h3>
            <p className="text-xs text-canary-text-2 leading-relaxed">
              These outputs are scenario projections based on the explicit mathematical formula chain and assumptions shown below. They illustrate <strong>what earlier detection makes possible</strong> when followed by human intervention. They are <strong>not observed or clinically proven real-world outcomes</strong>.
            </p>
          </div>
        </div>

        {/* 3 Result Columns: Low, Base, High (DESIGN.md Section 4.7) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Low Scenario */}
          <div className="canary-panel p-5 border-dashed border-[#D9B26F]/40 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-canary-text-3">
                Conservative (Low)
              </span>
              <ProvenanceBadge kind="illustrative" size="sm" />
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-4xl font-light text-canary-text tabular-nums">
                  {lowEstimate.avoidedCases}
                </span>
                <span className="text-xs text-canary-text-2 block">
                  Avoided Clinical Presentations
                </span>
              </div>

              <div className="pt-3 border-t border-border grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-canary-text-3 text-[11px] block">Severe Incidents</span>
                  <span className="font-semibold text-canary-text tabular-nums">
                    {lowEstimate.avoidedSevere} avoided
                  </span>
                </div>
                <div>
                  <span className="text-canary-text-3 text-[11px] block">Absence Days</span>
                  <span className="font-semibold text-canary-text tabular-nums">
                    {lowEstimate.avoidedAbsence} days saved
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-canary-text-3">
              Assumes 45% uptake &amp; low protective compliance.
            </div>
          </div>

          {/* Base Scenario (Hero Card) */}
          <div className="canary-panel p-5 border-2 border-canary-amber bg-panel-raised flex flex-col justify-between gap-4 shadow-amber-glow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-canary-amber">
                Calibrated (Base Scenario)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-canary-amber text-canary-on-accent">
                Expected
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-5xl font-light text-canary-text tabular-nums">
                  {baseEstimate.avoidedCases}
                </span>
                <span className="text-xs text-canary-text font-medium block">
                  Avoided Clinical Presentations
                </span>
              </div>

              <div className="pt-3 border-t border-border/80 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-canary-text-3 text-[11px] block">Severe Incidents</span>
                  <span className="font-bold text-canary-amber tabular-nums text-sm">
                    {baseEstimate.avoidedSevere} avoided
                  </span>
                </div>
                <div>
                  <span className="text-canary-text-3 text-[11px] block">Absence Days</span>
                  <span className="font-bold text-canary-amber tabular-nums text-sm">
                    {baseEstimate.avoidedAbsence} days saved
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-canary-text-2">
              Based on empirical +2.8 days lead time advantage over absence tracking.
            </div>
          </div>

          {/* High Scenario */}
          <div className="canary-panel p-5 border-dashed border-[#D9B26F]/40 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-canary-text-3">
                High Compliance (Optimistic)
              </span>
              <ProvenanceBadge kind="illustrative" size="sm" />
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-4xl font-light text-canary-text tabular-nums">
                  {highEstimate.avoidedCases}
                </span>
                <span className="text-xs text-canary-text-2 block">
                  Avoided Clinical Presentations
                </span>
              </div>

              <div className="pt-3 border-t border-border grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-canary-text-3 text-[11px] block">Severe Incidents</span>
                  <span className="font-semibold text-canary-text tabular-nums">
                    {highEstimate.avoidedSevere} avoided
                  </span>
                </div>
                <div>
                  <span className="text-canary-text-3 text-[11px] block">Absence Days</span>
                  <span className="font-semibold text-canary-text tabular-nums">
                    {highEstimate.avoidedAbsence} days saved
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-canary-text-3">
              Assumes rapid supervisor adoption &amp; immediate engineering controls.
            </div>
          </div>
        </div>

        {/* Interactive Assumption Controls & Sliders */}
        <Panel
          title="Adjust Model Assumptions"
          subtitle="Tune intervention uptake and preventive efficacy parameters to evaluate sensitivity"
          trailingAction={
            <button
              onClick={resetDefaults}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-panel-inset hover:bg-panel border border-border text-xs text-canary-text-3 hover:text-canary-text"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Slider 1: Intervention Uptake */}
            <div className="canary-panel-inset p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-canary-text">Intervention Uptake</span>
                <span className="font-mono font-bold text-canary-amber">{interventionUptake}%</span>
              </div>
              <input
                type="range"
                aria-label="Intervention uptake"
                min={20}
                max={100}
                value={interventionUptake}
                onChange={(e) => setInterventionUptake(Number(e.target.value))}
                className="w-full accent-canary-amber cursor-pointer"
              />
              <p className="text-[11px] text-canary-text-3 leading-relaxed">
                Percentage of operational alerts resulting in verified site HSE action within 24 hours.
              </p>
            </div>

            {/* Slider 2: Preventive Effectiveness */}
            <div className="canary-panel-inset p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-canary-text">Preventive Efficacy</span>
                <span className="font-mono font-bold text-canary-amber">{preventiveEffectiveness}%</span>
              </div>
              <input
                type="range"
                aria-label="Preventive effectiveness"
                min={10}
                max={90}
                value={preventiveEffectiveness}
                onChange={(e) => setPreventiveEffectiveness(Number(e.target.value))}
                className="w-full accent-canary-amber cursor-pointer"
              />
              <p className="text-[11px] text-canary-text-3 leading-relaxed">
                Reduction in downstream secondary syndromic transmission achieved by playbook measures.
              </p>
            </div>

            {/* Slider 3: Lead Time Gain */}
            <div className="canary-panel-inset p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-canary-text">Detection Lead Gain</span>
                <span className="font-mono font-bold text-canary-amber">{leadTimeGainDays} days</span>
              </div>
              <input
                type="range"
                aria-label="Lead time gain in days"
                min={0.5}
                max={6}
                step={0.1}
                value={leadTimeGainDays}
                onChange={(e) => setLeadTimeGainDays(Number(e.target.value))}
                className="w-full accent-canary-amber cursor-pointer"
              />
              <p className="text-[11px] text-canary-text-3 leading-relaxed">
                Empirical days gained between Canary Alert and single-signal administrative absence lag.
              </p>
            </div>
          </div>
        </Panel>

        {/* Calculation Chain & Authoritative Caveats (PRD Feature 13) */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 flex flex-col">
            <Panel
              title="Mathematical Formula Chain"
              subtitle="Step-by-step transparent calculation logic connecting lead time to case prevention"
            >
              <div className="space-y-3 text-xs text-canary-text-2">
                <div className="canary-panel-inset p-3 font-mono text-xs text-canary-text space-y-1">
                  <div className="text-canary-amber font-semibold">// Avoided Cases Calculation Formula</div>
                  <div>AvoidedCases = DailyExposed × LeadGainDays × Uptake% × Efficacy%</div>
                </div>

                <div className="space-y-2 text-[11px] text-canary-text-3 leading-relaxed">
                  <p>
                    1. <strong>Opportunity Window:</strong> For each outbreak event, the opportunity window equals the lead time difference between Canary multi-signal fusion and single-signal absence detection (calibrated at +2.8 days on held-out seeds).
                  </p>
                  <p>
                    2. <strong>Case Attenuation:</strong> During this window, cases occurring in the absence of intervention are multiplied by the verified intervention uptake rate and the preventive effectiveness of the recommended engineering/sanitation playbooks.
                  </p>
                  <p>
                    3. <strong>Operational Savings:</strong> Severe cases and absence days are calculated using domain ratios from occupational epidemiological literature (12% severe rate; 2.4 lost workdays per case).
                  </p>
                </div>
              </div>
            </Panel>
          </div>

          <div className="col-span-12 lg:col-span-5 flex flex-col">
            <Panel
              title="Methodological References & Caveats"
              subtitle="Explicit boundary limitations and citation sources"
            >
              <div className="space-y-3 text-xs text-canary-text-3">
                <div className="p-3 rounded bg-panel-inset border border-border space-y-1">
                  <span className="font-semibold text-canary-text block">Authoritative Citations:</span>
                  <ul className="list-disc list-inside space-y-1 text-[11px]">
                    <li>ILO Health &amp; Safety in Construction Guidelines (1992)</li>
                    <li>WHO Air Quality Guidelines &amp; Health Outcomes (2021)</li>
                    <li>OSHA Technical Manual: Heat Stress Mitigation Ratios</li>
                  </ul>
                </div>

                <div className="p-3 rounded bg-panel-inset border border-border text-[11px] text-canary-text-2 leading-relaxed">
                  ⚠️ <strong>Model Limitations:</strong> Does not simulate pathogen-specific R0 viral transmission curves or complex worker network mobility. Intended for executive decision support and resource staging planning only.
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

