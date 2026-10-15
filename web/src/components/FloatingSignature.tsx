import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, reduceMotion } from '../lib/motion';

const SEAL = 'INTELLECTUAL PROPERTY · TECHNOLOGY LAW · ';

/** Parse "rgb(a)" and return perceived luminance 0..1 plus alpha. */
function lum(c: string): { l: number; a: number } {
  const m = c.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 1];
  const [r, g, b] = m; const a = m.length > 3 ? m[3] : 1;
  return { l: (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255, a };
}

/** Ink colour to use over whatever is painted behind `el` ("light" ink on dark backgrounds, "dark" on light). */
function inkFor(el: HTMLElement): { ink: 'light' | 'dark'; section: Element | null } {
  const r = el.getBoundingClientRect();
  const hit = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2).find(n => !n.closest('.float-sig, .float-seal')) ?? null;
  let node: Element | null = hit, bg = { l: 1, a: 1 };
  while (node && node !== document.documentElement) {
    const c = lum(getComputedStyle(node).backgroundColor);
    if (c.a > 0.5) { bg = c; break; }
    node = node.parentElement;
  }
  return { ink: bg.l < 0.45 ? 'light' : 'dark', section: hit?.closest('section, footer') ?? null };
}

/**
 * Two small marks that stay with the reader through every section:
 *  - the notary-style SEAL, fixed at the top-right corner: it is stamped on after the hero signature is written,
 *    its outer ring is a reading-progress meter, and its wording turns as you scroll
 *  - the NAME with its flourish, bottom-left, which appears once the hero's big signature scrolls away and
 *    redraws its flourish each time a new section arrives
 * Both flip between white and black ink to stay legible over whichever section is behind them.
 */
export default function FloatingSignature({ active }: { active: boolean }) {
  const name = useRef<HTMLAnchorElement>(null);
  const seal = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const n = name.current, s = seal.current;
    if (!n || !s || !active) return;
    const prog = s.querySelector<SVGCircleElement>('#fsProg')!;
    const ring = s.querySelector<SVGGElement>('#fsRing')!;
    const swash = n.querySelector<SVGPathElement>('#fsSwash')!;

    const paint = (progress: number) => { prog.style.strokeDashoffset = String(1 - progress); };
    if (reduceMotion()) { gsap.set([n, s], { opacity: 1 }); return; }

    gsap.set(n, { opacity: 0, y: 30 });
    gsap.set(s, { opacity: 0, scale: 2.4, rotate: -50 });
    prog.style.strokeDasharray = '1'; paint(0);

    let section: Element | null = null;
    const tick = () => {
      const a = inkFor(n), b = inkFor(s);
      if (n.dataset.ink !== a.ink) n.dataset.ink = a.ink;
      if (s.dataset.ink !== b.ink) s.dataset.ink = b.ink;
      if (a.section && a.section !== section) {
        if (section) gsap.fromTo(swash, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out', overwrite: true });
        section = a.section;
      }
    };

    const ctx = gsap.context(() => {
      // Seal: stamped on once the hero signature has finished writing.
      gsap.to(s, { opacity: 1, scale: 1, rotate: 0, duration: 0.55, ease: 'power4.in', delay: 3.9 });
      // Name: appears when the hero (and its big signature) has scrolled away.
      ScrollTrigger.create({
        trigger: '#hero', start: 'bottom 55%',
        onEnter: () => gsap.to(n, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', overwrite: true }),
        onLeaveBack: () => gsap.to(n, { opacity: 0, y: 30, duration: 0.4, ease: 'power2.in', overwrite: true })
      });
      // The footer has its own wordmark and links — step aside while it is on screen.
      ScrollTrigger.create({ trigger: 'footer', start: 'top 85%', onToggle: self => n.classList.toggle('at-foot', self.isActive) });
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: self => {
          paint(self.progress);
          gsap.set(ring, { rotate: self.scroll() * 0.18, svgOrigin: '65 65' });
          tick();
        }
      });
    });
    tick();
    const id = window.setInterval(tick, 600); // colours can change without scrolling (e.g. content reveals)
    return () => { window.clearInterval(id); ctx.revert(); };
  }, [active]);

  return (
    <>
      <a ref={seal} className="float-seal" href="#top" aria-label="Back to top" data-ink="light" tabIndex={active ? 0 : -1}>
        <svg viewBox="0 0 130 130" aria-hidden="true">
          <defs><path id="fsSealPath" d="M65 65 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" /></defs>
          <circle cx="65" cy="65" r="60" className="fs-track" fill="none" strokeWidth="3" />
          <circle id="fsProg" pathLength={1} cx="65" cy="65" r="60" className="fs-line" fill="none" strokeWidth="3.6" strokeLinecap="round" transform="rotate(-90 65 65)" />
          <circle cx="65" cy="65" r="53" className="fs-disc" />
          <circle cx="65" cy="65" r="29" fill="none" className="fs-inner" />
          <g id="fsRing">
            <text className="fs-ring" fontSize="8.6" fontWeight="700" fill="currentColor">
              <textPath href="#fsSealPath" textLength="248" lengthAdjust="spacing">{SEAL}</textPath>
            </text>
          </g>
          <text className="fs-mark" x="65" y="81" textAnchor="middle">§</text>
        </svg>
      </a>

      <a ref={name} className="float-sig" href="#top" aria-label="Bipasha — back to top" data-ink="light" tabIndex={active ? 0 : -1}>
        <svg viewBox="0 0 260 150" aria-hidden="true">
          <text className="fs-name" x="2" y="106">Bipasha</text>
          <path id="fsSwash" pathLength={1} className="fs-line" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="1" strokeDashoffset="0" d="M8 124 C 70 146, 150 112, 236 128" />
        </svg>
      </a>
    </>
  );
}
