import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, reduceMotion } from '../lib/motion';

const SCRAMBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ§¶©';
const fine = () => window.matchMedia('(hover:hover) and (pointer:fine)').matches;

/**
 * Site-wide GSAP layer that doesn't belong to any one section:
 *  - custom cursor (dot + ring) that swells over interactive elements
 *  - magnetic buttons and 3D-tilting cards
 *  - header that slides away on scroll down and returns on scroll up
 *  - dark/burgundy sections "unfold" from an inset frame as they arrive
 *  - eyebrow labels that scramble into place
 */
export default function Effects({ active }: { active: boolean }) {
  const disc = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  /* ---------- scroll-driven pieces ---------- */
  useLayoutEffect(() => {
    if (!active || reduceMotion()) return;
    const ctx = gsap.context(() => {
      // Header hides on the way down, returns on the way up (never over the pinned practice section).
      let hidden = false;
      const show = (v: boolean) => { if (hidden === !v) return; hidden = !v; gsap.to('#nav', { yPercent: v ? 0 : -100, duration: 0.45, ease: 'power3.out', overwrite: true }); };
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: s => {
          const pin = document.querySelector('#practice')?.parentElement?.getBoundingClientRect();
          const inPractice = !!pin && pin.top < 120 && pin.bottom > 120;
          if (s.scroll() < 300 || s.direction === -1 || inPractice) show(true);
          else if (s.direction === 1) show(false);
        }
      });

      // Sections unfold from an inset frame.
      gsap.utils.toArray<HTMLElement>('.sec.dark, .sec.on-b').forEach(sec => {
        if (sec.id === 'cases') return; // sticky card stack — keep it untouched
        gsap.fromTo(sec, { clipPath: 'inset(7% 5% 0% 5%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', clearProps: 'clipPath',
          scrollTrigger: { trigger: sec, start: 'top 98%', end: 'top 30%', scrub: true }
        });
      });

      // Eyebrow labels scramble into place when they enter.
      gsap.utils.toArray<HTMLElement>('.eyebrow:not([data-hero]) > span').forEach(el => {
        const final = el.textContent ?? '';
        if (!final.trim() || el.children.length) return;
        const p = { t: 0 };
        ScrollTrigger.create({
          trigger: el, start: 'top 92%', once: true,
          onEnter: () => gsap.to(p, {
            t: 1, duration: 1.1, ease: 'none',
            onUpdate: () => {
              const n = Math.floor(p.t * final.length);
              el.textContent = final.slice(0, n) + Array.from(final.slice(n)).map(c => (c === ' ' || c === ' ' ? c : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)])).join('');
            },
            onComplete: () => { el.textContent = final; }
          })
        });
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [active]);

  /* ---------- pointer-driven pieces ---------- */
  useEffect(() => {
    if (!active || reduceMotion() || !fine()) return;
    document.body.classList.add('has-cursor');
    const d = disc.current!, r = ring.current!;
    // The seal disc is glued to the pointer; the dashed ring trails it.
    const dx = gsap.quickTo(d, 'x', { duration: 0.1, ease: 'power3' }), dy = gsap.quickTo(d, 'y', { duration: 0.1, ease: 'power3' });
    const rx = gsap.quickTo(r, 'x', { duration: 0.5, ease: 'power3' }), ry = gsap.quickTo(r, 'y', { duration: 0.5, ease: 'power3' });
    const spin = gsap.to(r.firstElementChild, { rotate: 360, duration: 14, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
    let magnet: HTMLElement | null = null, tilt: HTMLElement | null = null;
    let seen = false, mode = '';

    const release = (el: HTMLElement | null, props: gsap.TweenVars) => { if (el) gsap.to(el, { ...props, duration: 0.7, ease: 'elastic.out(1,0.45)', overwrite: 'auto' }); };
    const clickable = (t: HTMLElement) => !!t.closest('a, button, label, .art, .case');

    const move = (e: PointerEvent) => {
      if (!seen) { seen = true; gsap.to([d, r], { opacity: 1, duration: 0.3 }); }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      const t = e.target as HTMLElement;
      const field = !!t.closest('input, textarea, select');            // keep the native text cursor in form fields
      document.body.classList.toggle('over-field', field);

      // Over anything clickable the seal keeps its size but turns into a transparent outline.
      const next = field ? 'field' : clickable(t) ? 'hot' : 'idle';
      if (next !== mode) {
        mode = next;
        gsap.to(d, { opacity: next === 'field' ? 0 : 1, duration: 0.25, overwrite: 'auto' });
        gsap.to(r, { opacity: next === 'idle' ? 1 : 0, duration: 0.25, overwrite: 'auto' });
        d.classList.toggle('hot', next === 'hot');
      }

      const b = t.closest<HTMLElement>('.btn');
      if (b !== magnet) { release(magnet, { x: 0, y: 0 }); magnet = b; }
      if (b && !(b as HTMLButtonElement).disabled) {
        const bb = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - (bb.left + bb.width / 2)) * 0.22, y: (e.clientY - (bb.top + bb.height / 2)) * 0.32, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
      }

      const c = t.closest<HTMLElement>('.art, .fmt, .case');
      if (c !== tilt) { release(tilt, { rotationX: 0, rotationY: 0 }); tilt = c; }
      if (c) {
        const cb = c.getBoundingClientRect();
        const px = (e.clientX - cb.left) / cb.width - 0.5, py = (e.clientY - cb.top) / cb.height - 0.5;
        gsap.to(c, { rotationY: px * 5, rotationX: -py * 5, transformPerspective: 1000, transformOrigin: 'center', duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
      }
    };
    const leave = () => { gsap.to([d, r], { opacity: 0, duration: 0.2 }); seen = false; mode = ''; release(magnet, { x: 0, y: 0 }); release(tilt, { rotationX: 0, rotationY: 0 }); magnet = tilt = null; };
    const down = () => gsap.to(d, { scale: 0.8, duration: 0.15 });
    const up = () => gsap.to(d, { scale: 1, duration: 0.3, ease: 'back.out(2)' });

    window.addEventListener('pointermove', move);
    document.documentElement.addEventListener('mouseleave', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      spin.kill();
      document.body.classList.remove('has-cursor', 'over-field');
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('mouseleave', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [active]);

  return (
    <>
      <div className="cur-ring" ref={ring} aria-hidden="true"><i /></div>
      <div className="cur-disc" ref={disc} aria-hidden="true"><b>§</b></div>
    </>
  );
}
