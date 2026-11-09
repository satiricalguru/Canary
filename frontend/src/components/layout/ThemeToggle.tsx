'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const selected = localStorage.getItem('canary-theme') === 'dark';
    setDark(selected);
    document.documentElement.classList.toggle('dark', selected);
    document.documentElement.classList.toggle('light', !selected);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem('canary-theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.classList.toggle('light', !next);
  }

  return (
    <button type="button" onClick={toggle} aria-label={dark ? 'Use light theme' : 'Use dark theme'} className="workspace-control workspace-theme">
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
