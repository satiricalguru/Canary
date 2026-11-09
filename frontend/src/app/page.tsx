import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpRight, Activity, ChartNoAxesCombined, ChevronDown, Crosshair, ShieldCheck } from 'lucide-react';
import { CanaryWordmark } from '@/components/shared/CanaryWordmark';
import { HeroFilm } from '@/components/landing/HeroFilm';
import { LandingMotion } from '@/components/landing/LandingMotion';
import './landing.css';

const capabilities = [
  { number: '01', title: 'See exposure build', icon: Crosshair, text: 'Track heat, air quality and other environmental signals by area before changes show up in aggregated outcomes.', href: '/map', link: 'Explore the map' },
  { number: '02', title: 'Understand the alert', icon: Activity, text: 'Compare observed signals with expected baselines and see which evidence contributed to an alert.', href: '/alerts', link: 'Review alerts' },
  { number: '03', title: 'Plan the response', icon: ShieldCheck, text: 'Use role-scoped evidence and response playbooks to decide what needs a closer look and who should review it.', href: '/replay', link: 'Replay a scenario' },
];

const questions = [
  ['What does Canary monitor?', 'The prototype explores respiratory effects from dust and poor air quality, heat stress, and gastrointestinal clusters. It brings together environmental indicators and aggregated clinic or workplace signals.'],
  ['Which data can I explore in the demo?', 'The demo combines environmental data with simulated clinic and absence outcomes. Provenance labels identify the source and distinguish measured, derived and simulated values.'],
  ['How is privacy handled?', 'Canary works with aggregated reporting. Role-scoped views restrict access, and small counts are suppressed to reduce the risk of identifying individuals.'],
  ['How should teams use an alert?', 'An alert gives a reviewer the evidence, uncertainty and context behind a change. A qualified person reviews those signals and decides what to investigate next.'],
];

export default function LandingPage() {
  return (
    <div className="landing" id="top" data-hero-active>
      <LandingMotion />
      <a className="canary-skip" href="#main-content">Skip to content</a>
      <header className="landing-nav">
        <div className="landing-wrap landing-nav-inner">
          <Link href="/" aria-label="Canary home"><CanaryWordmark /></Link>
          <nav aria-label="Main navigation" className="landing-nav-links">
            <a href="#platform">Platform</a>
            <a href="#workflow">How it works</a>
            <Link href="/validation">Validation</Link>
          </nav>
          <Link href="/dashboard" className="landing-button landing-nav-action">Open workspace <ArrowUpRight size={16} /></Link>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <HeroFilm>
          <p className="landing-kicker"><span /> Population &amp; workforce health intelligence</p>
          <h1 id="hero-title">See the signal.<br /> <em>Act sooner.</em></h1>
          <p className="hero-summary">Canary connects environmental exposure with aggregated health and workplace signals so teams can spot emerging risks and investigate earlier.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/dashboard" className="landing-button hero-action">Explore surveillance <ArrowUpRight size={17} /></Link>
            <a href="#workflow" className="landing-link">How it works <ArrowDown size={15} /></a>
          </div>
        </HeroFilm>

        <div className="landing-wrap hero-index">
          <span><i /> Dubai, United Arab Emirates</span>
          <span>Heat stress <b>·</b> Respiratory <b>·</b> Gastrointestinal</span>
          <span>Demonstration platform</span>
        </div>

        <section className="landing-wrap landing-platform" id="platform" aria-labelledby="platform-title">
          <div className="landing-section-heading" data-reveal>
            <div>
              <p className="landing-kicker"><span /> 01 / The platform</p>
              <h2 id="platform-title">From early signs <em>to informed action.</em></h2>
            </div>
            <p>See how exposure, changes in health outcomes and the response fit together in a single workspace.</p>
          </div>
          <div className="capability-grid">
            {capabilities.map(({ number, title, icon: Icon, text, href, link }) => (
              <article className="capability-card" key={number} data-reveal>
                <div><span className="capability-icon"><Icon size={22} strokeWidth={1.5} /></span><span className="chapter-index">/{number}</span></div>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link href={href} className="landing-link">{link} <ArrowUpRight size={16} /></Link>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="landing-workflow" aria-labelledby="workflow-title">
          <div className="workflow-art">
            <img src="/images/dubai-observatory.webp" alt="Illustrative aerial view of the Dubai waterfront at blue hour" loading="lazy" />
            <span className="workflow-coordinate"><Crosshair size={16} /> 25.20° N &nbsp; 55.27° E</span>
          </div>
          <div className="landing-wrap workflow-inner">
            <div className="workflow-content" data-reveal>
              <p className="landing-kicker"><span /> 02 / The workflow</p>
              <h2 id="workflow-title">Follow the evidence.</h2>
              <ol className="workflow-steps">
                <li data-reveal><b>01</b><div><strong>Monitor</strong><p>Watch exposure and aggregated outcomes across sites and districts.</p></div></li>
                <li data-reveal><b>02</b><div><strong>Investigate</strong><p>Review what changed, why Canary flagged it and how complete the data is.</p></div></li>
                <li data-reveal><b>03</b><div><strong>Respond</strong><p>Use the playbook to choose a next step and assign it for human review.</p></div></li>
              </ol>
              <Link className="landing-link" href="/replay">Walk through a scenario <ArrowUpRight size={17} /></Link>
            </div>
          </div>
        </section>

        <section className="landing-wrap landing-evidence" data-reveal aria-labelledby="evidence-title">
          <div>
            <p className="landing-kicker"><span /> 03 / Methods &amp; safeguards</p>
            <h2 id="evidence-title">How Canary <em>earns trust.</em></h2>
            <Link className="landing-link" href="/validation"><ChartNoAxesCombined size={17} /> View validation <ArrowUpRight size={16} /></Link>
          </div>
          <div className="landing-faq">
            {questions.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}<ChevronDown size={18} /></summary>
                <p>{answer}</p>
              </details>
            ))}
            <Link className="landing-link" href="/privacy">Explore privacy &amp; governance <ArrowUpRight size={16} /></Link>
          </div>
        </section>

        <section className="landing-close" aria-labelledby="workspace-title">
          <div className="landing-wrap" data-reveal>
            <p className="landing-kicker"><span /> The Canary workspace</p>
            <h2 id="workspace-title">See what your team <em>would see.</em></h2>
            <p>Explore the demo map, investigate an alert or replay an emerging health event.</p>
            <Link className="landing-button" href="/dashboard">Open the workspace <ArrowRight size={17} /></Link>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-wrap footer-inner">
          <div className="footer-brand">
            <Link href="/" aria-label="Canary home"><CanaryWordmark /></Link>
            <p>Early warning for population and workforce health.</p>
          </div>
          <nav aria-label="Footer navigation" className="footer-nav">
            <div>
              <h2>Explore Canary</h2>
              <a href="#platform">Platform</a>
              <a href="#workflow">How it works</a>
              <Link href="/dashboard">Workspace</Link>
            </div>
            <div>
              <h2>Evidence &amp; safeguards</h2>
              <Link href="/validation">Validation</Link>
              <Link href="/privacy">Privacy &amp; governance</Link>
            </div>
          </nav>
        </div>
        <div className="landing-wrap footer-base">
          <p>Demonstration data for decision support.</p>
          <a href="#top">Back to top <ArrowUp size={16} /></a>
        </div>
      </footer>
    </div>
  );
}
