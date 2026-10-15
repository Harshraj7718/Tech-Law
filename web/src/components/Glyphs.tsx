import { useLayoutEffect, useRef } from 'react';
import { gsap, reduceMotion } from '../lib/motion';

export interface GlyphSpec {
  ch: string;
  style: React.CSSProperties;   // position + font-size
  speed: number;                // px of vertical parallax across the section
  spin?: number;                // degrees of rotation across the section
  fill?: boolean;
}

/**
 * Oversized legal symbols (§ ¶ © ®) that drift at different speeds as the
 * section scrolls past. `mouse` also lets them follow the pointer (hero).
 */
export default function Glyphs({ items, tone = 'dark', mouse = false }: { items: GlyphSpec[]; tone?: 'dark' | 'light'; mouse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const host = ref.current?.parentElement;
    if (!ref.current || !host || reduceMotion()) return;
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>('.glyph', ref.current);
      els.forEach((el, i) => {
        const it = items[i];
        gsap.fromTo(el, { y: -it.speed / 2, rotate: -(it.spin ?? 0) / 2 }, {
          y: it.speed / 2, rotate: (it.spin ?? 0) / 2, ease: 'none',
          scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
      if (mouse && window.matchMedia('(pointer:fine)').matches) {
        const setters = els.map((el, i) => ({ x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }), y: gsap.quickTo(el, 'yPercent', { duration: 1.2, ease: 'power3' }), k: (i % 2 ? -1 : 1) * (20 + i * 12) }));
        const move = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
          setters.forEach(s => { s.x(nx * s.k); s.y(ny * s.k * 0.4); });
        };
        host.addEventListener('mousemove', move);
        return () => host.removeEventListener('mousemove', move);
      }
    }, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map(i => i.ch + i.speed).join(), mouse]);

  return (
    <div ref={ref} className="glyphs" aria-hidden="true" style={{ ['--gc' as string]: tone === 'dark' ? '#fff' : '#6D001A' }}>
      {items.map((g, i) => <span key={i} className={'glyph' + (g.fill ? ' fill' : '')} style={g.style}>{g.ch}</span>)}
    </div>
  );
}
