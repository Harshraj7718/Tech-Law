import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let timer: number | undefined;
export const refreshSoon = () => {
  window.clearTimeout(timer);
  timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
};

export function goTo(target: string | Element) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (reduceMotion()) el.scrollIntoView();
  else gsap.to(window, { scrollTo: { y: el, offsetY: 72 }, duration: 1.1, ease: 'power3.inOut' });
}

export { gsap, ScrollTrigger };
