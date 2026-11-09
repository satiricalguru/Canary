'use client';

import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AppShell({ title, description, children }: AppShellProps) {
  return (
    <div className="workspace-shell">
      <a className="canary-skip" href="#workspace-content">Skip to content</a>
      <Sidebar />
      <div className="workspace-main">
        <TopBar />
        <main id="workspace-content" className="workspace-content" tabIndex={-1}>
          <div className="workspace-page-heading">
            <p><span /> Canary workspace</p>
            <h1>{title}</h1>
            <div>{description}</div>
          </div>
          <p className="workspace-notice">Demo outcome data is simulated <span aria-hidden="true">·</span> Decision support only</p>
          {children}
        </main>
      </div>
    </div>
  );
}
