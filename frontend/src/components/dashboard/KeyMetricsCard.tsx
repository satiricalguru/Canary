'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FileText, ExternalLink } from 'lucide-react';

interface KeyMetricsCardProps {
  monitoredSites?: number;
  activeAlerts?: number;
  actionRequired?: number;
  // Legacy prop compatibility
  totalCases?: number;
  outbreaks?: number;
  criticalAlerts?: number;
}

// Smooth count-up animation hook on page load
function useCounter(target: number, duration: number = 1800, delay: number = 150, enabled: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      return;
    }

    let start: number | null = null;
    let animId: number;

    const timeout = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        // Exponential ease out for natural telemetry tick
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setCount(Math.round(ease * target));
        if (progress < 1) {
          animId = requestAnimationFrame(step);
        }
      };
      animId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animId);
    };
  }, [target, duration, delay, enabled]);

  return count;
}

export const KeyMetricsCard: React.FC<KeyMetricsCardProps> = ({
  monitoredSites,
  activeAlerts,
  actionRequired,
  totalCases,
  outbreaks,
  criticalAlerts,
}) => {
  // Support renamed metric values with robust fallbacks
  const targetSites = monitoredSites ?? totalCases ?? 87462;
  const targetAlerts = activeAlerts ?? outbreaks ?? 26;
  const targetAction = actionRequired ?? criticalAlerts ?? 419;

  const cardRef = useRef<HTMLDivElement>(null);

  // Animation trigger: starts ONLY when scrolled into view (starts from no color at all)
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsLoaded(true);
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      // Fallback
      const timer = setTimeout(() => setIsLoaded(true), 150);
      return () => clearTimeout(timer);
    }
  }, []);

  // Animate counters when card comes into view
  const sitesCount = useCounter(targetSites, 1600, 100, isLoaded);
  const alertsCount = useCounter(targetAlerts, 1700, 250, isLoaded);
  const actionCount = useCounter(targetAction, 1800, 400, isLoaded);

  // Symmetrical arch geometry:
  // Starts at 220° (bottom-left) and sweeps 220° clockwise through top (0°) to 140° (bottom-right)
  const cx = 85;
  const cy = 76;
  const radius = 58;
  const strokeWidth = 9;
  const sweepAngle = 220; // degrees
  const circumference = 2 * Math.PI * radius;
  const arcLength = (sweepAngle / 360) * circumference; // ~222.7px

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(rad),
      y: centerY + r * Math.sin(rad),
    };
  };

  // Base background track (full 220° horseshoe arch in dark graphite)
  const startPt = polarToCartesian(cx, cy, radius, 220);
  const endPt = polarToCartesian(cx, cy, radius, 140);
  const bgTrack = `M ${startPt.x} ${startPt.y} A ${radius} ${radius} 0 1 1 ${endPt.x} ${endPt.y}`;

  // Target progress fills
  const fillSites = 0.76;
  const fillAlerts = 0.58;
  const fillAction = 0.86;

  return (
    <div
      ref={cardRef}
      className="relative rounded-3xl p-6 sm:p-7 overflow-hidden bg-gradient-to-br from-[#1A1A1C] via-[#141416] to-[#0D0D0E] border border-white/10 shadow-2xl flex flex-col justify-between"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-bold text-canary-text tracking-tight">
            Key Metrics
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-canary-amber/10 border border-canary-amber/30 text-[10px] font-mono font-bold text-canary-amber">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2A33A] animate-pulse" />
            SIMULATED TELEMETRY
          </span>
        </div>

        <Link
          href="/alerts"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-canvas-deep/80 border border-white/10 text-xs font-semibold text-canary-text-2 hover:text-canary-text hover:border-canary-amber transition-colors shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-canary-amber" />
          <span>Full Report</span>
        </Link>
      </div>

      {/* 3 Gauges Grid: Numbers only inside, labels & deltas below */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 my-auto items-start justify-items-center">
        {/* ================= GAUGE 1: MONITORED SITES (STARTS FROM NO COLOR -> YELLOW) ================= */}
        <div className="flex flex-col items-center text-center w-full max-w-[190px]">
          {/* Gauge Graphic */}
          <div className="relative w-36 h-32 sm:w-40 sm:h-36 flex items-center justify-center">
            <svg viewBox="0 0 170 148" className="w-full h-full overflow-visible select-none">
              <defs>
                {/* Gauge 1 Gradient: Pure Yellow / Canary Gold */}
                <linearGradient id="gradMonitoredSites" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFF2A3" />
                  <stop offset="45%" stopColor="#FCD34D" />
                  <stop offset="100%" stopColor="#F2A33A" />
                </linearGradient>

                {/* Drop shadow filter for yellow glow */}
                <filter id="yellowGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#F2A33A" floodOpacity="0.55" />
                </filter>
              </defs>

              {/* Background Inactive Arc Track (always visible in dark neutral) */}
              <path
                d={bgTrack}
                fill="none"
                stroke="#22242B"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />

              {/* Animated Value Arc: Starts from NO COLOR (opacity 0, offset 100%), sweeps in on load */}
              <path
                d={bgTrack}
                fill="none"
                stroke="url(#gradMonitoredSites)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={arcLength}
                strokeDashoffset={isLoaded ? arcLength * (1 - fillSites) : arcLength}
                filter={isLoaded ? 'url(#yellowGlow)' : 'none'}
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1) 100ms, opacity 0.35s ease-out 100ms',
                }}
              />
            </svg>

            {/* Inner Content: JUST THE NUMBER */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-2">
              <span className="text-xl sm:text-2xl font-black text-canary-text tracking-tight font-mono">
                {sitesCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Text SHIFTED BELOW the graph */}
          <div className="mt-2.5 flex flex-col items-center">
            <span className="text-xs sm:text-sm font-bold text-canary-text-2 uppercase tracking-wider">
              Monitored Sites
            </span>
            <span
              className="mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F2A33A]/15 text-[#F2A33A] border border-[#F2A33A]/30 inline-flex items-center gap-0.5 transition-opacity duration-700"
              style={{ opacity: isLoaded ? 1 : 0.4 }}
            >
              ▲ 11%
            </span>
          </div>
        </div>

        {/* ================= GAUGE 2: ACTIVE ALERTS (STARTS FROM NO COLOR -> YELLOW TO ORANGE) ================= */}
        <div className="flex flex-col items-center text-center w-full max-w-[190px]">
          {/* Gauge Graphic */}
          <div className="relative w-36 h-32 sm:w-40 sm:h-36 flex items-center justify-center">
            <svg viewBox="0 0 170 148" className="w-full h-full overflow-visible select-none">
              <defs>
                {/* Gauge 2 Gradient: Starts Yellow, sweeps to Vibrant Orange */}
                <linearGradient id="gradActiveAlerts" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFF2A3" />
                  <stop offset="35%" stopColor="#F2A33A" />
                  <stop offset="70%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>

                {/* Drop shadow filter for orange glow */}
                <filter id="orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor="#F97316" floodOpacity="0.55" />
                </filter>
              </defs>

              {/* Background Inactive Arc Track */}
              <path
                d={bgTrack}
                fill="none"
                stroke="#22242B"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />

              {/* Animated Value Arc: Starts from NO COLOR (opacity 0, offset 100%), sweeps in on load */}
              <path
                d={bgTrack}
                fill="none"
                stroke="url(#gradActiveAlerts)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={arcLength}
                strokeDashoffset={isLoaded ? arcLength * (1 - fillAlerts) : arcLength}
                filter={isLoaded ? 'url(#orangeGlow)' : 'none'}
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1) 250ms, opacity 0.35s ease-out 250ms',
                }}
              />
            </svg>

            {/* Inner Content: JUST THE NUMBER */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-2">
              <span className="text-xl sm:text-2xl font-black text-canary-text tracking-tight font-mono">
                {alertsCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Text SHIFTED BELOW the graph */}
          <div className="mt-2.5 flex flex-col items-center">
            <span className="text-xs sm:text-sm font-bold text-canary-text-2 uppercase tracking-wider">
              Active Alerts
            </span>
            <span
              className="mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30 inline-flex items-center gap-0.5 transition-opacity duration-700"
              style={{ opacity: isLoaded ? 1 : 0.4 }}
            >
              ▲ 17%
            </span>
          </div>
        </div>

        {/* ================= GAUGE 3: ACTION REQUIRED (STARTS FROM NO COLOR -> YELLOW TO RED) ================= */}
        <div className="flex flex-col items-center text-center w-full max-w-[190px]">
          {/* Gauge Graphic */}
          <div className="relative w-36 h-32 sm:w-40 sm:h-36 flex items-center justify-center">
            <svg viewBox="0 0 170 148" className="w-full h-full overflow-visible select-none">
              <defs>
                {/* Gauge 3 Gradient: Starts Yellow, sweeps through Orange to Crimson Red */}
                <linearGradient id="gradActionRequired" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFF2A3" />
                  <stop offset="25%" stopColor="#F2A33A" />
                  <stop offset="60%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#E5483D" />
                </linearGradient>

                {/* Drop shadow filter for red glow */}
                <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#E5483D" floodOpacity="0.65" />
                </filter>
              </defs>

              {/* Background Inactive Arc Track */}
              <path
                d={bgTrack}
                fill="none"
                stroke="#22242B"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />

              {/* Animated Value Arc: Starts from NO COLOR (opacity 0, offset 100%), sweeps in on load */}
              <path
                d={bgTrack}
                fill="none"
                stroke="url(#gradActionRequired)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={arcLength}
                strokeDashoffset={isLoaded ? arcLength * (1 - fillAction) : arcLength}
                filter={isLoaded ? 'url(#redGlow)' : 'none'}
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1) 400ms, opacity 0.35s ease-out 400ms',
                }}
              />
            </svg>

            {/* Inner Content: JUST THE NUMBER */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-2">
              <span className="text-xl sm:text-2xl font-black text-canary-text tracking-tight font-mono">
                {actionCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Text SHIFTED BELOW the graph */}
          <div className="mt-2.5 flex flex-col items-center">
            <span className="text-xs sm:text-sm font-bold text-canary-text-2 uppercase tracking-wider">
              Action Required
            </span>
            <span
              className="mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E5483D]/15 text-[#FF9085] border border-[#E5483D]/30 inline-flex items-center gap-0.5 transition-opacity duration-700"
              style={{ opacity: isLoaded ? 1 : 0.4 }}
            >
              ▲ 23%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Full Report Action Pill */}
      <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-center">
        <Link
          href="/validation"
          className="w-full py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-canary-amber/40 text-xs font-semibold text-canary-text text-center flex items-center justify-center gap-1.5 transition-all shadow-sm group"
        >
          <span>Full Report</span>
          <ExternalLink className="w-3 h-3 text-canary-amber group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
