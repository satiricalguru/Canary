'use client';

import { useEffect } from 'react';

export function LandingMotion() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('.landing [data-reveal]');
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        target.setAttribute('data-revealed', '');
        observer.unobserve(target);
      }
    }, { threshold: 0.07 });

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top >= innerHeight) section.setAttribute('data-reveal-ready', '');
      observer.observe(section);
    });
    return () => {
      observer.disconnect();
      sections.forEach((section) => section.removeAttribute('data-reveal-ready'));
    };
  }, []);

  return null;
}
