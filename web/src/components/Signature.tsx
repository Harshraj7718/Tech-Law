import { useLayoutEffect, useRef } from 'react';
import { gsap, reduceMotion } from '../lib/motion';

/**
 * Designed signature lockup for the hero.
 *  1. "Bipasha" writes itself: outlines are inked, then a feathered mask sweeps left → right filling the letters
 *  2. twin flourish strokes are pulled under the name, with ink drops at the end
 *  (the notary-style seal now lives in the fixed top-right corner — see FloatingSignature)
 *  A hairline "signature line" with an × mark sits underneath, like a document.
 */
const TEXT_X = 20, TEXT_W = 840;           // measured extent of the script at 330px

export default function Signature({ go }: { go: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = <T extends Element>(s: string) => el.querySelector<T>(s)!;
    const wipe = q<SVGRectElement>('#sigWipe'), outline = q<SVGTextElement>('#sigOutline');
    const swashes = el.querySelectorAll<SVGPathElement>('.sig-swash');
    const dots = el.querySelectorAll<SVGCircleElement>('.sig-dot'), rule = q<SVGGElement>('#sigRule');

    if (reduceMotion()) {
      wipe.setAttribute('width', '1400'); outline.style.opacity = '0';
      swashes.forEach(s => (s.style.strokeDashoffset = '0'));
      return;
    }

    // Initial (unwritten) state.
    gsap.set(wipe, { attr: { width: 0 } });
    gsap.set(outline, { strokeDasharray: 1800, strokeDashoffset: 1800, opacity: 1 });
    gsap.set(swashes, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(dots, { scale: 0, transformOrigin: '50% 50%' });
    gsap.set(rule, { opacity: 0, scaleX: 0, transformOrigin: '0% 50%' });
    if (!go) return;

    let ctx: gsap.Context | undefined;
    let cancelled = false;
    const ready = (document.fonts?.ready ?? Promise.resolve()).then(() => document.fonts?.load("200px 'Mrs Saint Delafield'").catch(() => undefined));
    ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const p = { v: 0 };
        // The reveal front sweeps across the name.
        const place = () => {
          const x = TEXT_X + p.v * TEXT_W;
          wipe.setAttribute('width', String(x + 40));
        };
        const tl = gsap.timeline({ delay: 0.9 });
        tl.to(rule, { opacity: 1, scaleX: 1, duration: 0.9, ease: 'power3.out' }, 0)
          .to(outline, { strokeDashoffset: 0, duration: 1.6, ease: 'power1.inOut' }, 0.3)
          .to(p, { v: 1, duration: 2.5, ease: 'power1.inOut', onUpdate: place }, 0.3)
          .set(wipe, { attr: { width: 1400 } }, 2.8)
          .to(outline, { opacity: 0, duration: 0.7, ease: 'power1.out' }, 2.4)
          .to(swashes, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.out', stagger: 0.18 }, 2.6)
          .to(dots, { scale: 1, duration: 0.45, ease: 'back.out(3)', stagger: 0.1 }, 3.5)
          ;
      }, root);
    });
    return () => { cancelled = true; ctx?.revert(); };
  }, [go]);

  return (
    <div className="hero-sig" ref={root} aria-label="Signature of Bipasha" role="img">
      <svg viewBox="0 0 1000 440" aria-hidden="true">
        <defs>
          <linearGradient id="sigFeather" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" /><stop offset="0.92" stopColor="#fff" /><stop offset="1" stopColor="#000" />
          </linearGradient>
          <mask id="sigMask" maskUnits="userSpaceOnUse" x="-20" y="-40" width="1100" height="540">
            <rect id="sigWipe" x="-20" y="-40" width="0" height="540" fill="url(#sigFeather)" />
          </mask>
        </defs>

        {/* signature line */}
        <g id="sigRule">
          <path d="M20 400H980" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.5" fill="none" />
          <path d="M14 380l14 14m0 -14l-14 14" stroke="#fff" strokeOpacity="0.6" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </g>

        {/* the name */}
        <g mask="url(#sigMask)"><text id="sigFill" x={TEXT_X} y="300" fill="#fff">Bipasha</text></g>
        <text id="sigOutline" x={TEXT_X} y="300" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">Bipasha</text>

        {/* twin flourishes + ink drops */}
        <path className="sig-swash" pathLength={1} fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round"
          d="M40 350 C 200 398, 430 322, 650 358 S 905 350, 985 306" />
        <path className="sig-swash" pathLength={1} fill="none" stroke="#fff" strokeOpacity="0.65" strokeWidth="1.6" strokeLinecap="round"
          d="M150 372 C 330 402, 520 364, 780 380" />
        <circle className="sig-dot" cx="992" cy="300" r="5.5" fill="#fff" />
        <circle className="sig-dot" cx="968" cy="276" r="3" fill="#fff" fillOpacity="0.7" />
        <circle className="sig-dot" cx="1000" cy="326" r="2.2" fill="#fff" fillOpacity="0.55" />


      </svg>
    </div>
  );
}
