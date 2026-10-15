import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, reduceMotion } from '../lib/motion';
import { useSectionMotion } from '../hooks/useSectionMotion';
import Glyphs from './Glyphs';

const STATEMENT = 'Intellectual property is not paperwork. It is the quiet foundation beneath every brand, every line of code and every creative work — and it is only as strong as the care taken to protect it.';

const STMT_GLYPHS = [
  { ch: '§', style: { right: '-2%', top: '6%', fontSize: '38vw' }, speed: -220, spin: 18 },
  { ch: '¶', style: { left: '-3%', bottom: '2%', fontSize: '20vw' }, speed: -120, spin: -22, fill: true }
];

export function Credentials() {
  const ref = useRef<HTMLElement>(null);
  useSectionMotion(ref);
  return (
    <section className="cred" aria-label="Qualifications" ref={ref}>
      <div data-rv><div className="k">LLM · Intellectual Property Law</div><div className="v">University College London</div><div className="s">UCL · London, United Kingdom</div></div>
      <div data-rv><div className="k">BA LLB (Hons.)</div><div className="v">Christ University</div><div className="s">Bengaluru, India</div></div>
      <div data-rv><div className="k">Practice focus</div><div className="v" style={{ fontSize: 'clamp(20px,1.8vw,26px)', fontFamily: 'var(--sans)', fontWeight: 600 }}>Trademarks · Software &amp; AI rights · Copyright · International enforcement through WIPO, the PCT and Madrid systems</div></div>
    </section>
  );
}

export function Marquee() {
  const track = useRef<HTMLDivElement>(null);
  const track2 = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      const tween = gsap.to(track.current, { xPercent: -50, ease: 'none', duration: 28, repeat: -1 });
      const tween2 = gsap.fromTo(track2.current, { xPercent: -50 }, { xPercent: 0, ease: 'none', duration: 36, repeat: -1 });
      // Scrolling fast nudges the ticker faster, then it settles back.
      ScrollTrigger.create({
        onUpdate: s => {
          const v = Math.min(Math.abs(s.getVelocity()) / 250, 6);
          [tween, tween2].forEach(t => { gsap.to(t, { timeScale: 1 + v, duration: 0.2, overwrite: true }); gsap.to(t, { timeScale: 1, duration: 1, delay: 0.2 }); });
        }
      });
    });
    return () => ctx.revert();
  }, []);
  const row = (
    <span>Trademarks <i>■</i> <em className="o">Software &amp; AI</em> <i>■</i> Copyright <i>■</i> <em className="o">WIPO · PCT</em> <i>■</i></span>
  );
  const row2 = (
    <span>Chain of title <i>■</i> <em className="o">Oppositions</em> <i>■</i> Licensing <i>■</i> <em className="o">Enforcement</em> <i>■</i></span>
  );
  return (
    <>
      <section className="marquee" aria-hidden="true">
        <div className="mq-track" ref={track}>{row}{row}</div>
      </section>
      <section className="marquee rev" aria-hidden="true">
        <div className="mq-track" ref={track2}>{row2}{row2}</div>
      </section>
    </>
  );
}

export function Statement() {
  const ref = useRef<HTMLElement>(null);
  useSectionMotion(ref);
  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.statement .w', { opacity: 0.14 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: '#stmt', start: 'top 80%', end: 'bottom 45%', scrub: 0.5 } });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section className="sec statement has-glyphs" id="about" ref={ref}>
      <Glyphs tone="light" items={STMT_GLYPHS} />
      <div className="eyebrow"><span>§ 01 &nbsp;Philosophy</span></div>
      <p id="stmt">{STATEMENT.split(' ').map((w, i) => <span key={i}><span className="w">{w}</span>{' '}</span>)}</p>
      <div className="foot" data-rv>
        <div><b>Approach</b>Strategy first, filings second</div>
        <div><b>Perspective</b>Indian statute + English law</div>
        <div><b>Promise</b>Plain-language advice, always</div>
      </div>
    </section>
  );
}
