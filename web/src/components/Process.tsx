import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, reduceMotion } from '../lib/motion';
import { useSectionMotion } from '../hooks/useSectionMotion';
import { Words } from '../lib/ui';
import Glyphs from './Glyphs';

const STEPS = [
  ['Step I', 'Discovery call', 'Thirty minutes, confidential and conflict-checked. You leave with a clear first step.'],
  ['Step II', 'Asset audit', 'We map what you own, where it is protected and where it is exposed.'],
  ['Step III', 'Protection strategy', 'Filings, contracts and priorities, sequenced against your market roadmap.'],
  ['Step IV', 'Enforcement & watch', 'Ongoing monitoring, oppositions and disputes — handled before they become costly.']
];

export default function Process() {
  const root = useRef<HTMLElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  useSectionMotion(root);

  // The rule draws down the timeline; each step wakes as the rule reaches it.
  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>('.pstep');
      ScrollTrigger.create({
        trigger: line.current, start: 'top 65%', end: 'bottom 70%', scrub: true,
        onUpdate: s => {
          gsap.set(fill.current, { scaleY: s.progress });
          steps.forEach((el, i) => { el.style.opacity = s.progress >= i / 4 - 0.02 ? '1' : '0.3'; });
        }
      });
      steps.forEach(el => { el.style.opacity = '0.3'; });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sec dark has-glyphs" id="process" ref={root}>
      <Glyphs items={[{ ch: '¶', style: { right: '-3%', top: '10%', fontSize: '30vw' }, speed: -260, spin: 20 }]} />
      <div className="proc">
        <div className="proc-sticky">
          <div className="eyebrow"><span>§ 05 &nbsp;Engagement</span></div>
          <h2 className="display h2"><Words text="From first call to" /> <Words text="enforced right." em /></h2>
        </div>
        <div className="proc-line" ref={line}>
          <div className="proc-fill" ref={fill} />
          {STEPS.map(([k, t, p]) => <div className="pstep" key={k}><b>{k}</b><h3>{t}</h3><p>{p}</p></div>)}
        </div>
      </div>
    </section>
  );
}
