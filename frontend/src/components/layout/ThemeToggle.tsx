'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('canary-theme');
    setLight(saved ? saved === 'light' : window.matchMedia('(prefers-color-scheme: light)').matches);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('light', light);
    document.documentElement.classList.toggle('dark', !light);
  }, [light]);
  const toggle = () => {
    const next = !light;
    setLight(next);
    localStorage.setItem('canary-theme', next ? 'light' : 'dark');
  };
  return <button type="button" onClick={toggle} aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'} className="fixed bottom-5 right-5 z-[1000] flex items-center gap-2 rounded-full border border-border-strong bg-panel px-4 py-3 text-xs font-semibold text-canary-text shadow-lg hover:bg-panel-raised">{light ? <Moon size={16} /> : <Sun size={16} />}{light ? 'Dark' : 'Light'} mode</button>;
}
