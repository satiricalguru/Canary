import Link from 'next/link';
import { ArrowUpRight, Crosshair } from 'lucide-react';

export function SurveillanceHeader() {
  return (
    <section className="workspace-observatory" aria-label="Dubai surveillance overview">
      <div>
        <p><Crosshair size={15} /> Regional observatory / UAE</p>
        <h2>Dubai, in focus.</h2>
        <p>Inspect illustrative monitoring areas and review simulated regional trends.</p>
        <Link href="/map">Open the surveillance map <ArrowUpRight size={16} /></Link>
      </div>
    </section>
  );
}
