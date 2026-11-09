'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { ArrowDown, Radar } from 'lucide-react';
import { SignalField } from './SignalField';

// The center of the blue lights, sampled in the film's normalized coordinates.
const signalPath = [
  { time: 3.5, x: 0.151, y: 0.463 },
  { time: 4, x: 0.184, y: 0.469 },
  { time: 4.5, x: 0.213, y: 0.480 },
  { time: 5, x: 0.243, y: 0.479 },
  { time: 5.5, x: 0.283, y: 0.464 },
  { time: 6, x: 0.311, y: 0.453 },
  { time: 6.5, x: 0.363, y: 0.422 },
  { time: 6.85, x: 0.404, y: 0.385 },
];

export function HeroFilm({ children }: { children: ReactNode }) {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = track.current;
    const frame = stage.current;
    const film = video.current;
    const landing = section?.closest<HTMLElement>('.landing');
    if (!section || !frame || !film || !landing) return;

    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrame = 0;
    let requested = false;
    let objectPosition = [0.5, 0.5];

    const paintSignalCaption = (width: number, height: number) => {
      const time = film.currentTime;
      const opacity = Math.max(0, Math.min(1, (time - 3.5) / 0.55, (6.85 - time) / 0.65));
      section.toggleAttribute('data-signal-caption', opacity > 0);
      if (!opacity) return;

      const nextIndex = signalPath.findIndex((point) => time <= point.time);
      const next = signalPath[nextIndex];
      const previous = signalPath[nextIndex - 1];
      const fraction = (time - previous.time) / (next.time - previous.time);
      const x = previous.x + (next.x - previous.x) * fraction;
      const y = previous.y + (next.y - previous.y) * fraction;

      // Match object-fit: cover, then keep the text inside the cropped mobile view.
      const scale = Math.max(width / film.videoWidth, height / film.videoHeight);
      const videoWidth = film.videoWidth * scale;
      const videoHeight = film.videoHeight * scale;
      const projectedX = x * videoWidth + (width - videoWidth) * objectPosition[0];
      const projectedY = y * videoHeight + (height - videoHeight) * objectPosition[1];
      const inset = Math.min(52, Math.max(18, width * 0.04));
      const captionWidth = Math.min(350, width * 0.68);
      const captionX = Math.min(width - captionWidth - inset, Math.max(inset, projectedX, x * width * 0.65));

      section.style.setProperty('--signal-x', `${captionX}px`);
      section.style.setProperty('--signal-y', `${projectedY}px`);
      section.style.setProperty('--signal-opacity', String(opacity));
    };

    const paint = () => {
      animationFrame = 0;
      const { top, bottom, height, width } = section.getBoundingClientRect();
      const viewport = frame.clientHeight;
      const progress = motion.matches ? 0 : Math.max(0, Math.min(1, -top / Math.max(height - viewport, 1)));
      const copyOpacity = 1 - Math.max(0, Math.min(1, (progress - 0.3) / 0.17));

      landing.toggleAttribute('data-hero-active', bottom > 80);
      section.style.setProperty('--hero-progress', String(progress));
      section.style.setProperty('--hero-copy', String(copyOpacity));
      section.dataset.phase = progress < 0.34 ? 'start' : progress < 0.74 ? 'signal' : 'review';
      section.toggleAttribute('data-copy-faded', copyOpacity === 0);

      if (motion.matches || bottom <= 0 || top > viewport) return;
      if (progress > 0.006 && !requested) {
        requested = true;
        film.preload = 'auto';
        film.load();
      }
      if (!requested || !Number.isFinite(film.duration) || film.seeking) return;

      if (film.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        paintSignalCaption(width, viewport);
      }

      const nextTime = progress * Math.max(0, film.duration - 0.05);
      if (Math.abs(film.currentTime - nextTime) > 0.034) {
        film.currentTime = nextTime;
      } else if (film.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        section.toggleAttribute('data-video-ready', progress > 0.006);
      }
    };

    const schedule = () => {
      if (!animationFrame) animationFrame = requestAnimationFrame(paint);
    };
    const resize = () => {
      objectPosition = getComputedStyle(film).objectPosition.split(' ').map((value) => parseFloat(value) / 100);
      schedule();
    };
    const preferenceChanged = () => {
      section.removeAttribute('data-video-ready');
      section.removeAttribute('data-signal-caption');
      schedule();
    };
    const onError = () => section.removeAttribute('data-video-ready');
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resize);
    motion.addEventListener('change', preferenceChanged);
    film.addEventListener('loadedmetadata', schedule);
    film.addEventListener('loadeddata', schedule);
    film.addEventListener('seeked', schedule);
    film.addEventListener('error', onError);
    resize();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resize);
      motion.removeEventListener('change', preferenceChanged);
      film.removeEventListener('loadedmetadata', schedule);
      film.removeEventListener('loadeddata', schedule);
      film.removeEventListener('seeked', schedule);
      film.removeEventListener('error', onError);
    };
  }, []);

  return (
    <section ref={track} className="hero-track" aria-labelledby="hero-title" data-phase="start">
      <div ref={stage} className="hero-stage">
        <div className="hero-film">
          <img className="hero-poster" src="/images/canary-signal.webp" alt="Golden canary perched on a branch against a slate-blue background" fetchPriority="high" />
          <video ref={video} src="/videos/canary-early-signal.mp4" preload="none" muted playsInline aria-hidden="true" />
          <SignalField />
        </div>
        <div className="landing-wrap hero-copy">
          {children}
        </div>
        <div className="hero-signal-caption">
          <p>Small signals.<br /><em>A clearer picture.</em></p>
        </div>
        <div className="landing-wrap hero-film-caption">
          <div className="hero-film-index" aria-hidden="true">
            <Radar size={17} />
            <span data-chapter="start">01 / The early signal</span>
            <span data-chapter="signal">02 / Signals converge</span>
            <span data-chapter="review">03 / Investigate earlier</span>
          </div>
          <div className="hero-progress" aria-hidden="true"><b>Scroll to reveal</b><span /></div>
          <a href="#platform" className="hero-scroll-link">
            <span className="hero-motion-label">Skip film</span>
            <span className="hero-static-label">Explore the platform</span>
            <ArrowDown size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
