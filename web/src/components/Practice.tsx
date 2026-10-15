import { useLayoutEffect, useRef, useState } from 'react';
import { useRegion } from '../hooks/useRegion';
import { gsap, reduceMotion } from '../lib/motion';
import type { RegionInfo } from '../data/types';

interface Area { num: string; chip: string; title: string; body: string; items: string[]; note: keyof RegionInfo; tone: '' | 'k' | 'b' }

const AREAS: Area[] = [
  { num: 'I', chip: 'Trademarks', title: 'Make your name yours, market by market.', body: 'Clearance before launch, filings that follow your expansion map, and a watch that catches copycats before they gain ground.', items: ['Clearance and availability searches', 'National and Madrid filing strategy', 'Oppositions and portfolio watch'], note: 'tm', tone: '' },
  { num: 'II', chip: 'Software & AI rights', title: 'Ship AI products without inheriting someone else’s claim.', body: 'Ownership, licensing and compliance for code, models and the data they learn from.', items: ['Model and dataset licensing review', 'Ownership of AI-assisted output', 'SaaS, EULA and open-source compliance'], note: 'ai', tone: 'k' },
  { num: 'III', chip: 'Copyright', title: 'Turn creative work into an asset you can license.', body: 'A clean chain of title, royalty structures that hold up, and fast action when work is copied.', items: ['Registration and chain of title', 'Licensing and royalty structures', 'Takedowns and platform disputes'], note: 'cr', tone: '' },
  { num: 'IV', chip: 'International enforcement', title: 'Enforce across borders, not just at home.', body: 'One coordinated strategy through the WIPO systems, so protection follows your product wherever it ships.', items: ['PCT and Madrid coordination', 'WIPO arbitration and UDRP domain disputes', 'Customs recordals and anti-counterfeiting'], note: 'en', tone: 'b' }
];

export default function Practice() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(1);
  const { info } = useRegion();

  // Pinned section; vertical scroll drives the track sideways.
  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      const view = track.current!.parentElement!;
      const dist = () => Math.max(0, track.current!.scrollWidth - view.clientWidth);
      gsap.to(track.current, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: s => {
            gsap.set(bar.current, { scaleX: s.progress });
            setIdx(Math.min(4, Math.floor(s.progress * 3.999) + 1));
          }
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="practice" id="practice" ref={root}>
      <div className="pr-head">
        <div>
          <div className="eyebrow" style={{ color: 'var(--b)' }}><span>§ 02 &nbsp;Practice areas</span></div>
          <h2>Counsel, organised by the outcome you need.</h2>
        </div>
        <div className="pr-count"><span style={{ opacity: 1 }}>0{idx}</span><span> / 04</span></div>
      </div>
      <div className="pr-bar"><i ref={bar} /></div>
      <div className="pr-view">
        <div className="pr-track" ref={track}>
          {AREAS.map(a => (
            <article key={a.num} className={'pr-card ' + a.tone}>
              <div className="pr-num"><b>{a.num}</b><span className="pr-chip">{a.chip}</span></div>
              <h3>{a.title}</h3>
              <p>{a.body}</p>
              <ul className="pr-list">{a.items.map(i => <li key={i}>{i}</li>)}</ul>
              <div className="pr-note">{info[a.note] as string}</div>
            </article>
          ))}
          <div className="pr-end" />
        </div>
      </div>
    </section>
  );
}
