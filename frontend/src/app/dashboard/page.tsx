'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SurveillanceHeader } from '@/components/dashboard/SurveillanceHeader';
import { SurveillanceMapCard } from '@/components/dashboard/SurveillanceMapCard';
import { DistrictTelemetryCard } from '@/components/dashboard/DistrictTelemetryCard';
import { KeyMetricsCard } from '@/components/dashboard/KeyMetricsCard';
import { DiseaseTrendsBreakdownCard } from '@/components/dashboard/DiseaseTrendsBreakdownCard';
import { DiseaseTrendsChartCard } from '@/components/dashboard/DiseaseTrendsChartCard';
import { GeographicSpreadCard } from '@/components/dashboard/GeographicSpreadCard';
import { OutbreakSourcesCard } from '@/components/dashboard/OutbreakSourcesCard';
import { DubaiPlace, DUBAI_PLACES } from '@/components/dashboard/DubaiMapData';

export default function DashboardPage() {
  const [selectedPlace, setSelectedPlace] = useState<DubaiPlace | null>(DUBAI_PLACES[0]);

  return (
    <AppShell
      title="Surveillance room"
      description="Monitor population and workforce health signals across Dubai."
    >
      <SurveillanceHeader />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6 items-stretch">
        <div className="xl:col-span-7 2xl:col-span-8 flex flex-col">
          <SurveillanceMapCard
            selectedPlaceId={selectedPlace ? selectedPlace.id : null}
            onSelectPlace={setSelectedPlace}
          />
        </div>

        <div className="xl:col-span-5 2xl:col-span-4 flex flex-col">
          <DistrictTelemetryCard
            place={selectedPlace}
            onSelectPlace={setSelectedPlace}
            onClose={() => setSelectedPlace(null)}
          />
        </div>
      </div>

      <h2 className="workspace-section-title mb-4">Simulated trends &amp; metrics</h2>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6 items-stretch">
        <div className="xl:col-span-5 flex flex-col">
          <KeyMetricsCard />
        </div>

        <div className="xl:col-span-7 flex flex-col">
          <DiseaseTrendsChartCard />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6 items-stretch">
        <div className="xl:col-span-6 flex flex-col">
          <DiseaseTrendsBreakdownCard />
        </div>

        <div className="xl:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <GeographicSpreadCard />
          <OutbreakSourcesCard />
        </div>
      </div>
    </AppShell>
  );
}
