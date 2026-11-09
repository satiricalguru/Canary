'use client';

import React, { useState } from 'react';
import { MonitoringUnit, RiskTier } from '@/lib/types/domain';
import { RiskTierBadge } from '../shared/RiskTierBadge';
import { CompletenessMeter } from '../shared/CompletenessMeter';
import { Layers, MapPin, List, Eye, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface UnitMapProps {
  units: MonitoringUnit[];
  onSelectUnit?: (unit: MonitoringUnit) => void;
  selectedUnitId?: string | null;
}

export const UnitMap: React.FC<UnitMapProps> = ({
  units,
  onSelectUnit,
  selectedUnitId,
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [activeLayer, setActiveLayer] = useState<'all' | 'alert_only' | 'hazard_heat'>('all');
  const [hoveredUnit, setHoveredUnit] = useState<MonitoringUnit | null>(null);

  // UAE Map geographic boundary projections:
  // Lng bounds: 53.8 to 56.2 (width ~ 2.4 deg)
  // Lat bounds: 23.9 to 25.4 (height ~ 1.5 deg)
  const mapWidth = 800;
  const mapHeight = 500;

  const projectToSvg = (lat: number, lng: number) => {
    const minLng = 53.6;
    const maxLng = 56.4;
    const minLat = 23.8;
    const maxLat = 25.5;

    const x = ((lng - minLng) / (maxLng - minLng)) * mapWidth;
    // Invert lat for SVG y coordinate
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * mapHeight;
    return { x, y };
  };

  const filteredUnits = units.filter((unit) => {
    if (activeLayer === 'alert_only') {
      return unit.currentTier === 'ALERT' || unit.currentTier === 'ACTION';
    }
    return true;
  });

  return (
    <div className="relative w-full h-[520px] bg-canvas-deep rounded-panel border border-border overflow-hidden flex flex-col">
      {/* Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-panel/90 backdrop-blur-md px-3 py-1.5 rounded-control border border-border shadow-md">
          <span className="text-xs font-semibold uppercase tracking-wider text-canary-text-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-canary-amber" />
            Layer:
          </span>
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              activeLayer === 'all'
                ? 'bg-canary-amber text-canary-on-accent font-semibold'
                : 'text-canary-text-2 hover:text-canary-text'
            }`}
          >
            All Sites ({units.length})
          </button>
          <button
            onClick={() => setActiveLayer('alert_only')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              activeLayer === 'alert_only'
                ? 'bg-[#F08A2E] text-canvas-deep font-semibold'
                : 'text-canary-text-2 hover:text-canary-text'
            }`}
          >
            Active Alerts
          </button>
          <button
            onClick={() => setActiveLayer('hazard_heat')}
            className={`px-2 py-0.5 rounded text-xs transition-colors ${
              activeLayer === 'hazard_heat'
                ? 'bg-[#E5483D] text-canvas-deep font-semibold'
                : 'text-canary-text-2 hover:text-canary-text'
            }`}
          >
            Hazard Heatmap
          </button>
        </div>

        {/* View Toggle (Map vs Table Alternative for accessibility) */}
        <div className="pointer-events-auto flex items-center bg-panel/90 backdrop-blur-md p-1 rounded-control border border-border shadow-md">
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-panel-raised text-canary-amber'
                : 'text-canary-text-3 hover:text-canary-text'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-panel-raised text-canary-amber'
                : 'text-canary-text-3 hover:text-canary-text'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="relative flex-1 w-full h-full select-none overflow-hidden flex items-center justify-center">
          <svg
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            className="w-full h-full object-contain"
            style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}
          >
            <defs>
              {/* Hotspot Amber Glow Filter */}
              <filter id="glow-action" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="14" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-alert" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Radial gradient for coastal water depth */}
              <radialGradient id="water-depth" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#14181C" />
                <stop offset="100%" stopColor="#0B0D0F" />
              </radialGradient>
            </defs>

            {/* Gulf Water Background */}
            <rect width={mapWidth} height={mapHeight} fill="url(#water-depth)" />

            {/* Stylized UAE Landmass Contour */}
            {/* Abu Dhabi, Dubai Coastline, Al Ain Inland */}
            <path
              d="M 50,480 
                 L 120,440 
                 Q 180,380 230,340 
                 L 270,300 
                 Q 320,240 370,190 
                 Q 420,150 490,120 
                 L 570,90 
                 Q 630,70 690,60 
                 L 740,70 
                 L 750,150 
                 Q 730,220 700,290 
                 L 660,370 
                 L 580,440 
                 L 460,480 
                 Z"
              fill="#241E15"
              stroke="#3A3324"
              strokeWidth="1.5"
            />

            {/* District Regions Overlay */}
            {/* Abu Dhabi Island & Coastal */}
            <path
              d="M 230,340 Q 280,290 340,240 L 320,270 L 260,360 Z"
              fill="#2E281D"
              stroke="#4A4130"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            {/* Musaffah Industrial Zone */}
            <path
              d="M 260,360 L 320,270 L 370,310 L 310,400 Z"
              fill="#332B1C"
              stroke="#54472F"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            {/* Dubai South & JAFZA */}
            <path
              d="M 490,120 L 570,90 L 590,160 L 510,190 Z"
              fill="#2A241A"
              stroke="#443B2A"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            {/* Al Ain Oasis Region */}
            <path
              d="M 640,320 L 720,270 L 710,380 L 630,410 Z"
              fill="#2D2619"
              stroke="#473C27"
              strokeWidth="1"
              strokeDasharray="4 2"
            />

            {/* District Labels */}
            <text x="210" y="270" fill="#8A857C" fontSize="12" fontWeight="600" letterSpacing="0.05em">
              ABU DHABI CENTRAL
            </text>
            <text x="240" y="420" fill="#8A857C" fontSize="11" fontWeight="600" letterSpacing="0.05em">
              MUSAFFAH & ICAD INDUSTRIAL
            </text>
            <text x="510" y="80" fill="#8A857C" fontSize="12" fontWeight="600" letterSpacing="0.05em">
              DUBAI SOUTH & PORT
            </text>
            <text x="650" y="340" fill="#8A857C" fontSize="12" fontWeight="600" letterSpacing="0.05em">
              AL AIN OASIS REGION
            </text>

            {/* Heat / PM2.5 Thermal Contours when Hazard Heatmap Layer is active */}
            {activeLayer === 'hazard_heat' && (
              <g opacity="0.6">
                <circle cx="280" cy="330" r="90" fill="url(#heat-grad-1)" />
                <circle cx="530" cy="140" r="80" fill="url(#heat-grad-2)" />
                <defs>
                  <radialGradient id="heat-grad-1">
                    <stop offset="0%" stopColor="#E5483D" stopOpacity="0.5" />
                    <stop offset="60%" stopColor="#F08A2E" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#E8C14A" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heat-grad-2">
                    <stop offset="0%" stopColor="#F08A2E" stopOpacity="0.5" />
                    <stop offset="70%" stopColor="#E8C14A" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#E8C14A" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </g>
            )}

            {/* Site Markers */}
            {filteredUnits.map((unit) => {
              const { x, y } = projectToSvg(unit.latitude, unit.longitude);
              const isSelected = selectedUnitId === unit.id;
              const hasAlert = unit.currentTier === 'ALERT';
              const hasAction = unit.currentTier === 'ACTION';
              const hasWatch = unit.currentTier === 'WATCH';

              // Radius based on headcount band
              let r = 12;
              if (unit.headcountBand === '1500+') r = 18;
              else if (unit.headcountBand === '500-1500') r = 15;

              let strokeColor = '#3A3A3D';
              let fillColor = '#1B1B1C';
              let glowFilter = undefined;

              if (hasAction) {
                strokeColor = '#E5483D';
                fillColor = '#2A1110';
                glowFilter = 'url(#glow-action)';
              } else if (hasAlert) {
                strokeColor = '#F08A2E';
                fillColor = '#2B1A0E';
                glowFilter = 'url(#glow-alert)';
              } else if (hasWatch) {
                strokeColor = '#E8C14A';
                fillColor = '#241F0E';
              }

              const isDashed = unit.completeness < 80;

              return (
                <g
                  key={unit.id}
                  className="cursor-pointer transition-transform duration-200 hover:scale-125"
                  onClick={() => onSelectUnit && onSelectUnit(unit)}
                  onMouseEnter={() => setHoveredUnit(unit)}
                  onMouseLeave={() => setHoveredUnit(null)}
                >
                  {/* Outer Radial Glow for Alert / Action */}
                  {(hasAction || hasAlert) && (
                    <circle
                      cx={x}
                      cy={y}
                      r={r + 14}
                      fill={hasAction ? '#E5483D' : '#F08A2E'}
                      opacity={hasAction ? 0.35 : 0.25}
                      filter={glowFilter}
                      className={hasAction ? 'animate-pulse' : ''}
                    />
                  )}

                  {/* Outer Ring */}
                  <circle
                    cx={x}
                    cy={y}
                    r={r}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? 3 : 2}
                    strokeDasharray={isDashed ? '3 3' : undefined}
                    className="shadow-md"
                  />

                  {/* Tier Shape inside Marker */}
                  {hasAction ? (
                    // Diamond ◆
                    <polygon
                      points={`${x},${y - 5} ${x + 5},${y} ${x},${y + 5} ${x - 5},${y}`}
                      fill="#E5483D"
                    />
                  ) : hasAlert ? (
                    // Triangle ▲
                    <polygon
                      points={`${x},${y - 5} ${x + 5},${y + 4} ${x - 5},${y + 4}`}
                      fill="#F08A2E"
                    />
                  ) : hasWatch ? (
                    // Circle ●
                    <circle cx={x} cy={y} r={3.5} fill="#E8C14A" />
                  ) : (
                    // Dot
                    <circle cx={x} cy={y} r={2.5} fill="#7FB45A" />
                  )}

                  {/* Stale Feed Warning Badge Corner */}
                  {unit.feedStatus === 'stale' && (
                    <text
                      x={x + r - 3}
                      y={y - r + 3}
                      fontSize="9"
                      fill="#B89A5B"
                      fontWeight="bold"
                    >
                      ⚠
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip Card */}
          {hoveredUnit && (
            <div
              className="absolute bottom-4 left-4 z-30 canary-panel p-3 min-w-[260px] max-w-[340px] shadow-2xl animate-in fade-in"
              style={{ pointerEvents: 'none' }}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-semibold text-canary-text truncate">
                  {hoveredUnit.name}
                </span>
                <RiskTierBadge tier={hoveredUnit.currentTier} size="sm" />
              </div>
              <div className="text-[11px] text-canary-text-3 flex items-center justify-between mb-2">
                <span>{hoveredUnit.districtName}</span>
                <span>Band: {hoveredUnit.headcountBand}</span>
              </div>
              <div className="text-xs text-canary-text-2 mb-2 line-clamp-2">
                {hoveredUnit.primaryRiskReason}
              </div>
              <CompletenessMeter percentage={hoveredUnit.completeness} size="sm" />
            </div>
          )}
        </div>
      ) : (
        /* Accessible Table Alternative View */
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left text-xs text-canary-text">
            <thead className="bg-panel-inset text-canary-text-3 uppercase tracking-wider text-[10px] border-b border-border">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Tier</th>
                <th className="py-2.5 px-3 font-semibold">Monitoring Unit</th>
                <th className="py-2.5 px-3 font-semibold">District</th>
                <th className="py-2.5 px-3 font-semibold">Headcount</th>
                <th className="py-2.5 px-3 font-semibold">Completeness</th>
                <th className="py-2.5 px-3 font-semibold">Status / Reason</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredUnits.map((unit) => (
                <tr
                  key={unit.id}
                  className="hover:bg-panel-raised transition-colors cursor-pointer"
                  onClick={() => onSelectUnit && onSelectUnit(unit)}
                >
                  <td className="py-2.5 px-3">
                    <RiskTierBadge tier={unit.currentTier} size="sm" />
                  </td>
                  <td className="py-2.5 px-3 font-medium text-canary-text">{unit.name}</td>
                  <td className="py-2.5 px-3 text-canary-text-2">{unit.districtName}</td>
                  <td className="py-2.5 px-3 text-canary-text-3 tabular-nums">{unit.headcountBand}</td>
                  <td className="py-2.5 px-3">
                    <CompletenessMeter percentage={unit.completeness} size="sm" />
                  </td>
                  <td className="py-2.5 px-3 text-canary-text-2 max-w-xs truncate">
                    {unit.primaryRiskReason}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onSelectUnit && onSelectUnit(unit)}
                      className="px-2 py-1 rounded bg-panel hover:bg-panel-inset border border-border text-[11px] text-canary-amber font-medium"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Map Legend Footer */}
      <div className="px-4 py-2 bg-canvas-deep border-t border-border flex items-center justify-between text-[11px] text-canary-text-3">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-canary-text uppercase text-[10px] tracking-wider">
            Risk Legend:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#E5483D] text-[12px] leading-none">◆</span>
            <span className="text-canary-text-2 font-medium">Action</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#F08A2E] text-[12px] leading-none">▲</span>
            <span className="text-canary-text-2 font-medium">Alert</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#E8C14A] text-[12px] leading-none">●</span>
            <span className="text-canary-text-2 font-medium">Watch</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#7FB45A] text-[12px] leading-none">●</span>
            <span className="text-canary-text-2 font-medium">Nominal</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span className="text-canary-text-3">Ring size = Headcount band</span>
          <span className="text-canary-text-3">Dashed ring = Completeness &lt; 80%</span>
        </div>

        <div className="text-[10px] text-canary-text-3 hidden md:inline">
          Projection: Abu Dhabi, Al Ain, Dubai
        </div>
      </div>
    </div>
  );
};

