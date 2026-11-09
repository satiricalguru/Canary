'use client';

import React, { useEffect, useState } from 'react';
import { SurveillanceHeader } from './SurveillanceHeader';
import { SurveillanceMapCard } from './SurveillanceMapCard';
import { DistrictTelemetryCard } from './DistrictTelemetryCard';
import { KeyMetricsCard } from './KeyMetricsCard';
import { DiseaseTrendsBreakdownCard } from './DiseaseTrendsBreakdownCard';
import { DiseaseTrendsChartCard } from './DiseaseTrendsChartCard';
import { GeographicSpreadCard } from './GeographicSpreadCard';
import { OutbreakSourcesCard } from './OutbreakSourcesCard';
import { fetchUnits } from '@/lib/api/client';
import { useDemoRole } from '@/context/RoleContext';
import { MonitoringUnit } from '@/lib/types/domain';
import { DubaiPlace, DUBAI_PLACES } from './DubaiMapData';

interface SurveillanceRoomSectionProps {
  id?: string;
  className?: string;
}

export const SurveillanceRoomSection: React.FC<SurveillanceRoomSectionProps> = ({
  id = 'surveillance-room',
  className = '',
}) => {
  const { activeRole } = useDemoRole();
  const [units, setUnits] = useState<MonitoringUnit[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<DubaiPlace | null>(DUBAI_PLACES[0]); // Default Al Quoz Industrial

  useEffect(() => {
    let isMounted = true;
    fetchUnits(activeRole)
      .then((data) => {
        if (!isMounted) return;
        setUnits(data.units);
      })
      .catch((err) => {
        console.error('Failed to load surveillance data:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [activeRole]);

  return (
    <section id={id} className={`relative mb-20 scroll-mt-20 ${className}`}>
      {/* Top Header Banner */}
      <SurveillanceHeader />

      {/* Row 1: Dubai Emirate Surveillance Map (Left) + District Telemetry Dossier Window (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6 items-stretch">
        {/* Left Column: Full Unobstructed Dubai Map (7 cols on xl, 8 cols on 2xl) */}
        <div className="xl:col-span-7 2xl:col-span-8 flex flex-col">
          <SurveillanceMapCard
            units={units}
            selectedPlaceId={selectedPlace ? selectedPlace.id : null}
            onSelectPlace={(p) => setSelectedPlace(p)}
          />
        </div>

        {/* Right Column: District Telemetry Dossier Window (Contained Strictly in Map Tab) */}
        <div className="xl:col-span-5 2xl:col-span-4 flex flex-col">
          <DistrictTelemetryCard
            place={selectedPlace}
            onSelectPlace={(p) => setSelectedPlace(p)}
            onClose={() => setSelectedPlace(null)}
          />
        </div>
      </div>

      {/* Row 2: Shifted Graphs Section: Key Metrics Gauges + Disease Trends Spline Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6 items-stretch">
        {/* Key Metrics: 3 Animated Gauges (Monitored Sites | Active Alerts | Action Required) */}
        <div className="xl:col-span-5 flex flex-col">
          <KeyMetricsCard />
        </div>

        {/* Disease Trends Spline Chart & Key Metrics */}
        <div className="xl:col-span-7 flex flex-col">
          <DiseaseTrendsChartCard />
        </div>
      </div>

      {/* Row 3: Ranked Disease Breakdown + Geographic Spread & Outbreak Sources */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6 items-stretch">
        {/* Disease Trends Ranked Breakdown Progress Bars */}
        <div className="xl:col-span-6 flex flex-col">
          <DiseaseTrendsBreakdownCard />
        </div>

        {/* Geographic Spread & Outbreak Sources Split */}
        <div className="xl:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <GeographicSpreadCard />
          <OutbreakSourcesCard />
        </div>
      </div>
    </section>
  );
};
