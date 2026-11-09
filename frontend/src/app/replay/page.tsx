'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Panel } from '@/components/shared/Panel';
import { RiskTierBadge } from '@/components/shared/RiskTierBadge';
import { ProvenanceBadge } from '@/components/shared/ProvenanceBadge';
import { SCENARIOS } from '@/lib/data/seededData';
import { fetchReplayDays } from '@/lib/api/client';
import { useDemoRole } from '@/context/RoleContext';
import { ReplayDayState, ScenarioDefinition } from '@/lib/types/api';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Calendar,
  AlertTriangle,
  Activity,
  Layers,
  Info,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea
} from 'recharts';

export default function ScenarioReplayPage() {
  const { activeRole } = useDemoRole();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scen-respiratory');
  const [currentDay, setCurrentDay] = useState<number>(4);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1200); // ms per step

  const [allDays, setAllDays] = useState<ReplayDayState[]>([]);
  const [loadError, setLoadError] = useState(false);

  const activeScenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  const visibleDays = allDays[0]?.scenarioId === selectedScenarioId ? allDays : [];
  const dayState = visibleDays.find((day) => day.dayNumber === currentDay);

  useEffect(() => {
    const request = new AbortController();
    setLoadError(false);
    fetchReplayDays(selectedScenarioId, request.signal)
      .then(({ days }) => setAllDays(days))
      .catch(() => { if (!request.signal.aborted) setLoadError(true); });
    return () => request.abort();
  }, [selectedScenarioId]);

  // Playback timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentDay((prev) => {
          if (prev >= 14) {
            setIsPlaying(false);
            return 14;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || (e.target instanceof Element && e.target.closest('input, select, textarea, button, a, summary, [contenteditable]'))) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentDay((d) => Math.min(14, e.shiftKey ? d + 7 : d + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentDay((d) => Math.max(1, e.shiftKey ? d - 7 : d - 1));
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const groundTruth = activeScenario.groundTruthWindow;

  return (
    <AppShell
      title="Scenario replay"
      description="Inspect how multi-signal risk patterns develop day-by-day and compare Canary early warning lead time against single-stream methods."
    >
      <div className="flex flex-col gap-6">
        {/* Scenario Selection Tabs */}
        <div className="canary-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 bg-panel-inset p-1 rounded-control border border-border flex-wrap">
            {SCENARIOS.map((scen) => (
              <button
                key={scen.id}
                onClick={() => {
                  setSelectedScenarioId(scen.id);
                  setCurrentDay(4);
                  setIsPlaying(false);
                }}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  selectedScenarioId === scen.id
                    ? 'bg-panel-raised text-canary-amber shadow-sm'
                    : 'text-canary-text-3 hover:text-canary-text'
                }`}
              >
                {scen.title.split(':')[1] || scen.title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-canary-text-3">
            <span>Deterministic Seed: <strong className="text-canary-text font-mono">108</strong></span>
            <span>•</span>
            <ProvenanceBadge kind="simulated" size="sm" />
          </div>
        </div>

        {/* Hero Scenario Narrative Card */}
        <div className="canary-panel p-5 bg-panel-raised flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#F2A33A]/20">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-canary-text tracking-tight">
              {activeScenario.title}
            </h2>
            <p className="text-xs text-canary-text-2 max-w-3xl leading-relaxed">
              {activeScenario.description}
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto flex-shrink-0">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-panel-inset text-canary-text-2 border border-border">
              {activeScenario.siteName}
            </span>
          </div>
        </div>

        {/* Interactive Timeline & Scrubber Panel */}
        <Panel
          title={`Evolving Trajectory — Day ${currentDay} of ${activeScenario.totalDays}`}
          subtitle="Use keyboard [← / →] to step days, [Space] to play/pause. Shaded region indicates synthetic ground-truth outbreak window."
          trailingAction={
            <div className="flex items-center gap-2 text-xs">
              <span className="text-canary-text-3">Speed:</span>
              <select
                aria-label="Playback speed"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-panel-inset text-canary-text border border-border rounded px-2 py-0.5 text-xs"
              >
                <option value={2400}>0.5x</option>
                <option value={1200}>1.0x</option>
                <option value={600}>2.0x</option>
              </select>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Replay Chart with Ground Truth Shading and Current Day Line */}
            <div className="w-full h-64 canary-panel-inset p-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visibleDays} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid stroke="#2C2C2E" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="dayNumber"
                    stroke="#8A857C"
                    fontSize={11}
                    tickFormatter={(v) => `Day ${v}`}
                  />
                  <YAxis stroke="#8A857C" fontSize={11} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload as ReplayDayState;
                        return (
                          <div className="bg-panel-raised border border-border p-3 rounded-control shadow-xl text-xs space-y-1">
                            <span className="font-semibold text-canary-text">Day {d.dayNumber} ({d.calendarDate})</span>
                            <div className="text-canary-text-2">Hazard: {d.observedHazardValue}</div>
                            <div className="text-canary-text-2">Clinic: {d.observedClinicCount}</div>
                            <div className="text-canary-text-2">Absence: {d.observedAbsenceCount}</div>
                            {d.canaryMarker && (
                              <div className="text-canary-amber font-semibold mt-1">
                                {d.canaryMarker.label}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {/* Ground Truth Band */}
                  <ReferenceArea
                    x1={groundTruth.startDay}
                    x2={groundTruth.endDay}
                    fill="#C58BD9"
                    fillOpacity={0.12}
                    stroke="#C58BD9"
                    strokeOpacity={0.3}
                    strokeDasharray="3 3"
                    label={{
                      value: 'Synthetic Ground Truth Window',
                      fill: '#C58BD9',
                      fontSize: 10,
                      position: 'insideTopLeft',
                    }}
                  />

                  {/* Current Day Reference Line */}
                  <ReferenceArea
                    x1={currentDay}
                    x2={currentDay}
                    stroke="#F2A33A"
                    strokeWidth={2}
                  />

                  <Line
                    type="monotone"
                    dataKey="observedHazardValue"
                    name="Hazard Prior (PM2.5 / Temp)"
                    stroke="#6FA8C7"
                    strokeWidth={2}
                    dot={{ r: 2.5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="observedClinicCount"
                    name="Clinic Consultations (Sim)"
                    stroke="#F2A33A"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="observedAbsenceCount"
                    name="Workplace Absence (Sim)"
                    stroke="#7FB45A"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Scrubber Controls */}
            <div className="flex flex-col gap-3 px-2">
              <div className="flex items-center justify-between text-xs text-canary-text-3 font-mono">
                <span>Day 1 (Start)</span>
                <span className="text-canary-amber font-bold text-sm">
                  Day {currentDay}: {dayState?.calendarDate}
                </span>
                <span>Day 14 (End)</span>
              </div>

              {/* Slider Input with Custom Amber Track */}
              <input
                type="range"
                aria-label="Replay day"
                min={1}
                max={14}
                value={currentDay}
                onChange={(e) => setCurrentDay(Number(e.target.value))}
                className="w-full h-2 bg-panel-inset rounded-lg appearance-none cursor-pointer accent-canary-amber"
              />

              {/* Playback Button Bar */}
              <div className="flex items-center justify-center gap-4 mt-2">
                <button
                  onClick={() => setCurrentDay(1)}
                  className="p-2 rounded-control bg-panel-inset hover:bg-panel border border-border text-canary-text-2 hover:text-canary-text"
                  title="Reset to Day 1"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentDay((d) => Math.max(1, d - 1))}
                  className="p-2 rounded-control bg-panel-inset hover:bg-panel border border-border text-canary-text-2 hover:text-canary-text"
                  title="Previous Day"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 rounded-full bg-canary-amber hover:bg-canary-amber/90 text-canvas-deep shadow-amber-glow font-bold transition-all"
                  title={isPlaying ? 'Pause Replay' : 'Play Scenario'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <button
                  onClick={() => setCurrentDay((d) => Math.min(14, d + 1))}
                  className="p-2 rounded-control bg-panel-inset hover:bg-panel border border-border text-canary-text-2 hover:text-canary-text"
                  title="Next Day"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Marker Rows: Canary vs Comparators vs Ground Truth */}
            <div className="canary-panel-inset p-4 space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-canary-text-3 block">
                Detection Marker Timeline Comparison (Day {currentDay}):
              </span>

              {/* Canary Tier Marker */}
              <div className="flex items-center justify-between p-2.5 rounded bg-panel border border-border text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-canary-text">Canary Multi-Signal:</span>
                  <RiskTierBadge tier={dayState?.currentTier || null} size="sm" />
                </div>
                <span className="text-canary-text-2">
                  {dayState ? (dayState.canaryMarker?.details ?? 'Monitoring within expected baseline') : loadError ? 'Replay unavailable. Reload or select another scenario.' : 'Loading scenario…'}
                </span>
              </div>

              {/* Comparator Markers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                {dayState?.comparatorMarkers.map((comp, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded border flex items-center justify-between ${
                      comp.alertRaised
                        ? 'bg-[#E5483D]/10 border-[#E5483D]/30 text-canary-text'
                        : 'bg-panel-inset border-border text-canary-text-3'
                    }`}
                  >
                    <span>{comp.methodName}</span>
                    <span className="font-semibold">
                      {comp.alertRaised ? '🚨 Alert Triggered' : '○ Silent'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        {/* Live Snapshot: What Canary Knew at Day X */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 flex flex-col">
            <Panel
              title={`Evidence Available at Day ${currentDay}`}
              subtitle="Reconstructed strictly from data available up to this point in time (Zero leakage of future days)"
            >
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-control bg-panel-inset border border-border space-y-1.5">
                  <h4 className="font-bold text-sm text-canary-text">
                    {dayState?.evidenceSnapshot.title}
                  </h4>
                  <p className="text-canary-text-2 leading-relaxed">
                    {dayState?.evidenceSnapshot.summary}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-semibold uppercase text-[10px] tracking-wider text-canary-text-3">
                    Ingested Feeds on Day {currentDay}:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {dayState?.evidenceSnapshot.contributingFeeds.map((feed, i) => (
                      <div key={i} className="p-2.5 rounded canary-panel-inset border border-border font-mono text-[11px] text-canary-text">
                        {feed}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col">
            <Panel
              title="Lead Time Advantage"
              subtitle="Comparison against traditional surveillance lag"
            >
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-control bg-[#7FB45A]/10 border border-[#7FB45A]/30 flex items-center justify-between">
                  <span className="text-status-ok font-semibold">vs Absence (EARS C2):</span>
                  <span className="text-sm font-bold text-canary-text">+3 Days Lead</span>
                </div>
                <div className="p-3 rounded-control bg-[#7FB45A]/10 border border-[#7FB45A]/30 flex items-center justify-between">
                  <span className="text-status-ok font-semibold">vs Standalone Clinic (CUSUM):</span>
                  <span className="text-sm font-bold text-canary-text">+2 Days Lead</span>
                </div>
                <p className="text-[11px] text-canary-text-3 leading-relaxed mt-2">
                  By detecting environmental hazard onset (PM2.5 lead) and coupling with early syndromic queries, Canary notifies responders 48–72 hours before employer sick-leave ledgers reflect the full outbreak.
                </p>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

