import { useLayoutEffect, useRef } from 'react';
import { useRegion } from '../hooks/useRegion';
import { gsap, reduceMotion } from '../lib/motion';
import type { RegionCode } from '../data/types';

const LINKS: [string, string][] = [['#practice', 'Practice'], ['#evaluator', 'Toolkit'], ['#cases', 'Matters'], ['#insights', 'Insights'], ['#consult', 'Consult']];

export default function Nav() {
  const { code, setCode } = useRegion();
  const bar = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to(bar.current, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <header id="nav">
      <a className="logo" href="#top"><i />Bipasha</a>
      <div className="tag-line">Global IP &amp; Technology Law</div>
      <nav className="links" aria-label="Primary">
        {LINKS.map(([h, t]) => <a key={h} href={h}>{t}</a>)}
      </nav>
      <div className="region">
        <small>Region</small>
        <div className="seg" role="group" aria-label="Region">
          {(['IN', 'UK'] as RegionCode[]).map(r => (
            <button key={r} className={code === r ? 'on' : ''} aria-pressed={code === r} onClick={() => setCode(r)}>{r}</button>
          ))}
        </div>
      </div>
      <div id="progress" ref={bar} />
    </header>
  );
}
