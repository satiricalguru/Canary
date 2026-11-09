'use client';

import { useId, useState } from 'react';
import { Info, Shield, X } from 'lucide-react';
import { useDemoRole } from '@/context/RoleContext';
import { DEMO_ROLES } from '@/lib/data/seededData';
import type { DemoRole } from '@/lib/types/domain';
import { ProvenanceBadge } from '../shared/ProvenanceBadge';
import { ThemeToggle } from './ThemeToggle';

export function TopBar() {
  const { activeRole, setRole, roleInfo } = useDemoRole();
  const [showLegend, setShowLegend] = useState(false);
  const legendId = useId();

  return (
    <header className="workspace-top">
      <div className="workspace-top-inner">
        <div className="workspace-scope"><span /> <span>Demo mode</span><span aria-hidden="true">/</span><span>{roleInfo.scope}</span></div>
        <div className="workspace-tools">
          <button type="button" className="workspace-control" aria-label="Data legend" aria-expanded={showLegend} aria-controls={legendId} onClick={() => setShowLegend(!showLegend)}>
            <Info size={16} /> <span className="workspace-control-label">Data legend</span>
          </button>
          <label className="workspace-control workspace-role">
            <Shield size={16} />
            <span className="sr-only">Demo role</span>
            <select value={activeRole} onChange={(e) => setRole(e.target.value as DemoRole)}>
              {DEMO_ROLES.map(({ id, shortName }) => <option key={id} value={id}>{shortName}</option>)}
            </select>
          </label>
          <ThemeToggle />
        </div>
      </div>
      <div id={legendId} className="workspace-legend" hidden={!showLegend}>
        <div><ProvenanceBadge kind="real" sourceName="Open-Meteo" size="sm" /> Environmental feeds</div>
        <div><ProvenanceBadge kind="simulated" size="sm" /> Synthetic scenario outcomes</div>
        <div><ProvenanceBadge kind="approximation" size="sm" /> Derived heat stress proxy</div>
        <div><ProvenanceBadge kind="illustrative" size="sm" /> Scenario model projection</div>
        <button type="button" className="workspace-control workspace-theme" aria-label="Dismiss data legend" onClick={() => setShowLegend(false)}><X size={17} /></button>
      </div>
    </header>
  );
}
