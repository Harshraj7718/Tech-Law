import { useLayoutEffect, useRef } from 'react';
import { useRegion } from '../hooks/useRegion';
import { gsap, reduceMotion } from '../lib/motion';
import { Arrow, Search } from '../lib/ui';

export default function Hero({ go }: { go: boolean }) {
  const root = useRef<HTMLElement>(null);
  const { info } = useRegion();

  // Scroll-linked drift of the oversized section sign and the column rules.
  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set('#heroSect', { yPercent: -52 });
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('#heroSect', { yPercent: -32, rotate: 6, scale: 1.12, opacity: 0.25, ease: 'none', scrollTrigger: st });
      gsap.to('.hero-grid div', { scaleY: 0, transformOrigin: 'top', stagger: 0.08, ease: 'none', scrollTrigger: st });
    }, root);
    return () => ctx.revert();
  }, []);

  // Entrance, played once the disclaimer gate is dismissed.
  useLayoutEffect(() => {
    if (!go || reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power4.out' } })
        .from('.hero h1 .mask > span', { yPercent: 115, duration: 1.3, stagger: 0.14 }, 0.1)
        .from('.hero-sect', { scale: 0.8, opacity: 0, duration: 1.8 }, 0)
        .from('.hero-grid div', { scaleY: 0, transformOrigin: 'top', duration: 1.2, stagger: 0.08 }, 0)
        .from('[data-hero]', { y: 30, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.5);
    }, root);
    return () => ctx.revert();
  }, [go]);

  return (
    <section className="hero" id="hero" ref={root}>
      <div className="hero-grid" aria-hidden="true"><div /><div /><div /><div /><div /><div /></div>
      <div className="hero-sect" id="heroSect" aria-hidden="true">§</div>
      <div className="hero-in">
        <div className="eyebrow" data-hero><span>Intellectual Property &amp; Technology Law · {info.city}</span></div>
        <h1 aria-label="Your ideas deserve a defence that crosses borders.">
          <span className="mask"><span>Your ideas deserve</span></span>
          <span className="mask"><span><em>a defence</em> that</span></span>
          <span className="mask"><span>crosses borders.</span></span>
        </h1>
        <p className="lead" data-hero>Bipasha advises founders, creators and technology companies on trademarks, software and AI rights, copyright and international enforcement — grounded in Indian law at Christ University and sharpened by IP specialisation at UCL, London.</p>
        <div className="hero-cta" data-hero>
          <a className="btn solid" href="#consult">Book a private consultation <Arrow /></a>
          <a className="btn ghost" href="#evaluator">Test your brand name <Search /></a>
        </div>
      </div>
      <div className="hero-meta" data-hero>
        <div><b>Two</b>jurisdictions</div><div><b>Four</b>practice areas</div><div><b>Four</b>online tools</div><div><b>24/7</b>matter intake</div>
      </div>
    </section>
  );
}
