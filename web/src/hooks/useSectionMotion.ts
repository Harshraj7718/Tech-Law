import { useLayoutEffect, type RefObject } from 'react';
import { gsap, reduceMotion } from '../lib/motion';

/**
 * Shared scroll choreography for a section:
 *  - every `.display` title slides its masked words up
 *  - every `[data-rv]` element fades and rises in
 */
export function useSectionMotion(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || reduceMotion()) return;
    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>('.display').forEach(h => {
        const words = h.querySelectorAll('.wm > span');
        if (words.length) {
          gsap.from(words, { yPercent: 115, duration: 1, ease: 'power4.out', stagger: 0.06, scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
        }
      });
      root.querySelectorAll<HTMLElement>('[data-rv]').forEach(el => {
        gsap.from(el, { opacity: 0, y: 44, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
      });
    }, root);
    return () => ctx.revert();
  }, [ref]);
}
