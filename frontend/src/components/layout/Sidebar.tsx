'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, AlertTriangle, ArrowUpRight, BarChart3, Compass, Menu, PlaySquare, Settings, ShieldCheck, TrendingUp } from 'lucide-react';
import { CanaryWordmark } from '@/components/shared/CanaryWordmark';

const groups = [
  {
    name: 'Operations',
    items: [
      { href: '/dashboard', label: 'Surveillance room', icon: Activity },
      { href: '/map', label: 'Surveillance map', icon: Compass },
      { href: '/alerts', label: 'Alert inbox', icon: AlertTriangle },
      { href: '/replay', label: 'Scenario replay', icon: PlaySquare },
    ],
  },
  {
    name: 'Evidence & governance',
    items: [
      { href: '/validation', label: 'Validation', icon: BarChart3 },
      { href: '/privacy', label: 'Privacy & governance', icon: ShieldCheck },
      { href: '/impact', label: 'Impact estimator', icon: TrendingUp },
      { href: '/settings', label: 'Settings & telemetry', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const disclosure = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLElement>(null);

  const navigation = (close?: () => void) => (
    <nav aria-label="Workspace navigation" className="workspace-nav">
      {groups.map(({ name, items }) => (
        <div key={name} className="workspace-nav-group">
          <p>{name}</p>
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link key={href} href={href} aria-current={active ? 'page' : undefined} onClick={close}>
                <Icon size={17} strokeWidth={1.7} />
                {label}
              </Link>
            );
          })}
        </div>
      ))}
      <Link href="/" className="workspace-home" onClick={close}>Canary home <ArrowUpRight size={15} /></Link>
    </nav>
  );

  return (
    <>
      <aside className="workspace-rail">
        <Link className="workspace-brand" href="/" aria-label="Canary home"><CanaryWordmark /></Link>
        {navigation()}
        <div className="workspace-rail-footer"><span /> Demonstration workspace</div>
      </aside>

      <div className="workspace-mobile-bar">
        <Link href="/" aria-label="Canary home"><CanaryWordmark /></Link>
        <details ref={disclosure} className="workspace-mobile-menu" onKeyDown={(event) => {
          if (event.key === 'Escape' && disclosure.current?.open) {
            disclosure.current.open = false;
            trigger.current?.focus();
          }
        }}>
          <summary ref={trigger}><Menu size={18} /> Menu</summary>
          {navigation(() => { if (disclosure.current) disclosure.current.open = false; })}
        </details>
      </div>
    </>
  );
}
