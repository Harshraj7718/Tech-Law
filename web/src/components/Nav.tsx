import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRegion } from '../hooks/useRegion';
import { gsap, reduceMotion } from '../lib/motion';
import type { RegionCode } from '../data/types';

const LINKS: [string, string][] = [['#practice', 'Practice'], ['#evaluator', 'Toolkit'], ['#cases', 'Matters'], ['#insights', 'Insights'], ['#consult', 'Consult']];

export default function Nav() {
  const { code, setCode } = useRegion();
  const bar = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  // Mobile menu: lock scrolling and stagger the links in.
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (!open || reduceMotion() || !menu.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(menu.current, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power4.out' });
      gsap.fromTo('.menu a', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, delay: 0.15, ease: 'power3.out' });
    }, menu);
    return () => ctx.revert();
  }, [open]);
  useEffect(() => { if (!open) return; const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [open]);

  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to(bar.current, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
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
      <button className={'burger' + (open ? ' on' : '')} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(o => !o)}><i /><i /></button>
      <div id="progress" ref={bar} />
    </header>
    {open && (
      <div className="menu" ref={menu}>
        {LINKS.map(([h, t], i) => <a key={h} href={h} onClick={() => setOpen(false)}><small>0{i + 1}</small>{t}</a>)}
        <p>Global IP &amp; Technology Law<br />India · United Kingdom</p>
      </div>
    )}
    </>
  );
}
