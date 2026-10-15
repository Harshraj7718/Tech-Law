import { useLayoutEffect, useRef } from 'react';
import { gsap, reduceMotion } from '../lib/motion';
import { useSectionMotion } from '../hooks/useSectionMotion';
import { Words } from '../lib/ui';

/**
 * Scales of justice. The beam rotates about its pivot at (300,70); each pan
 * is translated to follow its beam end so it always hangs plumb.
 */
export default function Scales() {
  const root = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const beam = useRef<SVGGElement>(null);
  const panL = useRef<SVGGElement>(null);
  const panR = useRef<SVGGElement>(null);
  useSectionMotion(root);

  useLayoutEffect(() => {
    const L = 220;
    const tilt = { deg: reduceMotion() ? 0 : 13 };
    const apply = (deg: number) => {
      const r = (deg * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
      beam.current?.setAttribute('transform', `rotate(${deg} 300 70)`);
      panL.current?.setAttribute('transform', `translate(${300 - L * c - 80} ${70 - L * s - 70})`);
      panR.current?.setAttribute('transform', `translate(${300 + L * c - 520} ${70 + L * s - 70})`);
    };
    apply(tilt.deg);
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      const draws = svg.current!.querySelectorAll<SVGPathElement>('.dr');
      draws.forEach(p => { p.style.strokeDasharray = '1'; p.style.strokeDashoffset = '1'; });
      gsap.to(draws, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.2, scrollTrigger: { trigger: svg.current, start: 'top 80%', once: true } });
      gsap.to(tilt, { deg: 0, ease: 'none', onUpdate: () => apply(tilt.deg), scrollTrigger: { trigger: svg.current, start: 'top 75%', end: 'center 40%', scrub: 1 } });
      // Once balanced, the beam keeps a barely perceptible sway.
      gsap.to({}, { duration: 1e9, repeat: -1, onUpdate() {
        if (tilt.deg === 0 && svg.current) {
          const r = svg.current.getBoundingClientRect();
          if (r.bottom > 0 && r.top < window.innerHeight) apply(Math.sin(performance.now() / 900) * 0.8);
        }
      } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="sec scales-sec" id="jurisdictions" ref={root}>
      <div className="eyebrow"><span>§ 03 &nbsp;Dual-jurisdictional</span></div>
      <h2 className="display h2" style={{ maxWidth: 1100 }}>
        <Words text="Two legal systems." /><br /><Words text="One standard of counsel." em />
      </h2>
      <div className="scales-wrap">
        <svg id="scalesSvg" ref={svg} viewBox="0 0 600 460" role="img" aria-label="Scales of justice balancing India and the United Kingdom">
          <path className="st dr" pathLength={1} d="M300 70V400" />
          <path className="st dr" pathLength={1} d="M210 400H390M190 428H410" />
          <path className="st dr acc" pathLength={1} d="M300 400V70" />
          <circle className="fl" cx="300" cy="62" r="14" />
          <g ref={beam}>
            <path className="st" d="M80 70H520" strokeWidth="5" />
            <circle className="fl" cx="300" cy="70" r="9" />
          </g>
          <g ref={panL}>
            <path className="st" d="M80 70L20 230M80 70L140 230" />
            <path className="st" d="M10 230H150C150 262 120 280 80 280S10 262 10 230Z" fill="#6D001A" />
            <text x="80" y="266" style={{ fontSize: 30 }}>IN</text>
          </g>
          <g ref={panR}>
            <path className="st" d="M520 70L460 230M520 70L580 230" />
            <path className="st" d="M450 230H590C590 262 560 280 520 280S450 262 450 230Z" fill="#6D001A" />
            <text x="520" y="266" style={{ fontSize: 30 }}>UK</text>
          </g>
        </svg>
        <div className="jur">
          <div data-rv><b>IN</b><h4>BA LLB (Hons.) · Christ University</h4><p>A rigorous grounding in Indian statute, commercial and constitutional law — for founders and brands building from India.</p></div>
          <div data-rv><b>UK</b><h4>LLM, Intellectual Property Law · UCL London</h4><p>Specialist training in comparative and international IP — for companies taking their assets into the UK, Europe and beyond.</p></div>
        </div>
      </div>
    </section>
  );
}
