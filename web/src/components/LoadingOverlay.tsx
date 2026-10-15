import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap, reduceMotion } from '../lib/motion';

/**
 * Full-screen loading overlay (same three-part layout as the Framer "LoadingOverlay" component:
 * typed status lines · big percentage · welcome message), restyled for Bipasha.
 * A small signature writes itself in step with the percentage, and the overlay lifts away at 100%.
 */
interface Props {
  onDone: () => void;
  duration?: number;          // ms for 0 → 100 %
  typeSpeed?: number;         // ms per typed character
  statusLines?: string[];
  message?: string;
}

const LINES = [
  'OPENING THE CLIENT FILE...',
  'CHECKING TRADEMARK REGISTERS...',
  'REVIEWING COPYRIGHT TERMS...',
  'MAPPING INDIA · UK JURISDICTIONS...',
  'PREPARING THE DOSSIER...',
  'READY FOR CONSULTATION.'
];
const MESSAGE = 'WELCOME TO\nBIPASHA\nIP & TECHNOLOGY LAW';

const TEXT_X = 20, TEXT_W = 840;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function LoadingOverlay({ onDone, duration = 3600, typeSpeed = 17, statusLines = LINES, message = MESSAGE }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  const reduced = useMemo(() => reduceMotion(), []);
  const done = useRef(false);

  // Drive progress 0 → 100 (waits briefly for the script font so the signature is written in its real letterforms).
  useEffect(() => {
    if (reduced) { setP(100); const t = window.setTimeout(finish, 400); return () => window.clearTimeout(t); }
    let tween: gsap.core.Tween | undefined;
    let cancelled = false;
    const fontReady = Promise.race([
      (document.fonts?.load("200px 'Mrs Saint Delafield'") ?? Promise.resolve()).catch(() => undefined),
      new Promise(r => window.setTimeout(r, 1500))
    ]);
    fontReady.then(() => {
      if (cancelled) return;
      const v = { n: 0 };
      let last = -1;
      tween = gsap.to(v, {
        n: 100, duration: duration / 1000, ease: 'power1.inOut',
        onUpdate: () => { const r = Math.round(v.n); if (r !== last) { last = r; setP(r); } },
        onComplete: () => { setP(100); window.setTimeout(finish, 350); }
      });
    });
    return () => { cancelled = true; tween?.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lift the overlay away, then tell the app we're done.
  function finish() {
    if (done.current) return;
    done.current = true;
    const el = root.current;
    if (!el || reduced) { onDone(); return; }
    gsap.to(el, { yPercent: -100, duration: 0.95, ease: 'power4.inOut', onComplete: onDone });
    window.setTimeout(onDone, 2200); // safety net if animation frames are throttled
  }

  // Typewriter reveal tied to progress.
  const total = statusLines.reduce((n, l) => n + l.length, 0);
  const revealed = reduced ? total : Math.min(total, Math.floor((p / 100) * duration / typeSpeed));
  let remaining = revealed, active = statusLines.length - 1, found = false;
  const shown = statusLines.map((l, i) => {
    const n = Math.max(0, Math.min(l.length, remaining)); remaining -= n;
    if (!found && n < l.length) { active = i; found = true; }
    return l.slice(0, n);
  });
  if (revealed >= total) active = statusLines.length - 1;

  // Signature geometry, all derived from p so it is deterministic.
  const f = p / 100;
  const wipeX = TEXT_X + f * TEXT_W;
  const swash = clamp((p - 88) / 12);

  return (
    <div className="loader" ref={root} role="status" aria-live="polite" aria-label="Loading">
      <div className="loader-grid">
        <ul className="loader-lines" aria-hidden="true">
          {statusLines.map((l, i) => (
            <li key={l} className={i === active ? 'on' : ''}>{shown[i] || ' '}{i === active && p < 100 ? <b className="caret" /> : null}</li>
          ))}
        </ul>

        <div className="loader-center">
          <svg viewBox="0 0 1000 440" aria-hidden="true" className="loader-sig">
            <defs>
              <linearGradient id="ldFeather" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#fff" /><stop offset="0.92" stopColor="#fff" /><stop offset="1" stopColor="#000" />
              </linearGradient>
              <mask id="ldMask" maskUnits="userSpaceOnUse" x="-20" y="-40" width="1100" height="540">
                <rect x="-20" y="-40" height="540" width={p >= 100 ? 1400 : wipeX + 40} fill="url(#ldFeather)" />
              </mask>
            </defs>
            <path d="M20 400H980" stroke="#fff" strokeOpacity="0.28" strokeWidth="1.5" fill="none" />
            <g mask="url(#ldMask)"><text className="ld-name" x={TEXT_X} y="300" fill="#fff">Bipasha</text></g>
            <text className="ld-name" x={TEXT_X} y="300" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="1800" strokeDashoffset={1800 * (1 - clamp(p / 62))} opacity={p >= 100 ? 0 : 1} style={{ transition: 'opacity .4s' }}>Bipasha</text>
            <path pathLength={1} fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - swash} d="M40 350 C 200 398, 430 322, 650 358 S 905 350, 985 306" />
            <path pathLength={1} fill="none" stroke="#fff" strokeOpacity="0.65" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="1" strokeDashoffset={1 - swash} d="M150 372 C 330 402, 520 364, 780 380" />
          </svg>
          <div className="loader-pct" aria-hidden="true">( {String(p).padStart(2, ' ')}% )</div>
        </div>

        <div className="loader-msg" aria-hidden="true">{message}</div>
      </div>
    </div>
  );
}
