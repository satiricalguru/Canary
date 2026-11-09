'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { LatLng, Map as LeafletMap } from 'leaflet';
import { MonitoringUnit } from '@/lib/types/domain';
import { DubaiPlace, DUBAI_COORDINATES, DUBAI_PLACES, placeToMonitoringUnit } from './DubaiMapData';

export { DUBAI_PLACES, type DubaiPlace } from './DubaiMapData';

interface SurveillanceMapCardProps {
  units?: MonitoringUnit[];
  onSelectUnit?: (unit: MonitoringUnit) => void;
  selectedUnitId?: string | null;
  selectedPlaceId?: string | null;
  onSelectPlace?: (place: DubaiPlace) => void;
}

const colors = { ACTION: '#d43c35', ALERT: '#dd761d', WATCH: '#b78a19', NORMAL: '#328362' };

export const SurveillanceMapCard: React.FC<SurveillanceMapCardProps> = ({
  onSelectUnit, selectedUnitId, selectedPlaceId, onSelectPlace,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const previousView = useRef<{ center: LatLng; zoom: number } | null>(null);
  const [filter, setFilter] = useState('all');
  const [mapStatus, setMapStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const visible = DUBAI_PLACES.filter((place) => filter === 'all' ||
    (filter === 'critical' ? place.tier === 'ACTION' || place.tier === 'ALERT' : place.category === filter));

  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | null = null;
    setMapStatus('loading');
    import('leaflet').then((L) => {
      if (cancelled || !container.current) return;
      map = L.map(container.current, { scrollWheelZoom: false, zoomControl: true });

      const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });
      let loadedTile = false;
      tiles.on('tileload', () => { loadedTile = true; if (!cancelled) setMapStatus('ready'); });
      tiles.on('load', () => { if (!cancelled && !loadedTile) setMapStatus('unavailable'); });
      tiles.addTo(map);
      if (previousView.current) map.setView(previousView.current.center, previousView.current.zoom);
      else map.fitBounds([[24.78, 55.02], [25.31, 56.16]], { padding: [22, 22] });
      for (const place of visible) {
        const color = colors[place.tier];
        const marker = L.marker(DUBAI_COORDINATES[place.id], {
          title: `${place.name} — ${place.tier}, simulated`,
          icon: L.divIcon({ className: 'canary-map-marker', html: `<span style="--marker-color:${color}" class="${(selectedPlaceId ?? selectedUnitId) === place.id ? 'selected' : ''}"></span>`, iconSize: [24, 24], iconAnchor: [12, 12] }),
        }).addTo(map);
        marker.bindTooltip(`${place.name} · ${place.tier}`, { direction: 'top', offset: [0, -10] });
        marker.on('click', () => {
          onSelectPlace?.(place);
          onSelectUnit?.(placeToMonitoringUnit(place));
        });
      }
    }).catch(() => { if (!cancelled) setMapStatus('unavailable'); });
    return () => {
      cancelled = true;
      if (map) { previousView.current = { center: map.getCenter(), zoom: map.getZoom() }; map.remove(); }
    };
  }, [filter, selectedPlaceId, selectedUnitId, onSelectPlace, onSelectUnit]);

  return (
    <div className="canary-panel overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-canary-text">Dubai Emirate Surveillance</h2>
          <p className="text-xs text-canary-text-2 mt-1">Illustrative area locations · simulated surveillance data</p>
        </div>
        <label className="text-xs text-canary-text-2 flex items-center gap-2">
          Show
          <select value={filter} onChange={(event) => setFilter(event.target.value)} className="bg-panel-inset text-canary-text border border-border-strong rounded-lg px-2 py-2">
            <option value="all">All areas ({DUBAI_PLACES.length})</option>
            <option value="industrial">Industrial</option>
            <option value="worker_zone">Worker quarters</option>
            <option value="urban">Urban</option>
            <option value="logistics">Logistics</option>
            <option value="coastal">Coastal</option>
            <option value="critical">Alert and action</option>
          </select>
        </label>
      </div>
      <div className="relative">
        <div ref={container} className="h-[360px] sm:h-[485px] w-full bg-panel-inset z-0" aria-label="Interactive map of illustrative surveillance areas in Dubai and Hatta" />
        {mapStatus !== 'ready' && (
          <p role="status" className="pointer-events-none absolute bottom-7 left-3 z-10 rounded-lg border border-border bg-panel px-2.5 py-1.5 text-xs font-semibold text-canary-text-2">
            {mapStatus === 'loading' ? 'Loading base map…' : 'Base map unavailable. Use the area selector below.'}
          </p>
        )}
      </div>
      {onSelectPlace && (
        <label className="flex items-center gap-2 border-t border-border px-5 py-2 text-xs font-semibold text-canary-text-2">
          Inspect area
          <select
            value={visible.some(({ id }) => id === selectedPlaceId) ? selectedPlaceId ?? '' : ''}
            onChange={(event) => {
              const place = visible.find(({ id }) => id === event.target.value);
              if (place) onSelectPlace(place);
            }}
            className="min-w-0 flex-1 rounded-lg border border-border-strong bg-panel-inset px-2 py-2 text-canary-text"
          >
            <option value="" disabled>Select a monitoring area</option>
            {visible.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
          </select>
        </label>
      )}
      <div className="px-5 py-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-canary-text-2 border-t border-border">
        {Object.entries(colors).map(([tier, color]) => <span key={tier} className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />{tier.charAt(0) + tier.slice(1).toLowerCase()}</span>)}
        <span className="ml-auto">Select a marker for the area dossier</span>
      </div>
    </div>
  );
};
