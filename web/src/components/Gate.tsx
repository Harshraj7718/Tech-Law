import { useRef } from 'react';
import { gsap, reduceMotion } from '../lib/motion';
import { Arrow } from '../lib/ui';

export default function Gate({ onEnter }: { onEnter: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const enter = () => {
    if (reduceMotion() || !ref.current) { onEnter(); return; }
    let done = false;
    const finish = () => { if (!done) { done = true; onEnter(); } };
    gsap.to(ref.current, { opacity: 0, duration: 0.6, onComplete: finish });
    window.setTimeout(finish, 1200); // fallback if the tab is throttled
  };
  return (
    <div id="gate" ref={ref} role="dialog" aria-modal="true" aria-labelledby="gateTitle">
      <div className="gate-card">
        <div className="gate-top"><span>Legal Access Portal</span><span>India · UK</span></div>
        <div className="gate-body">
          <h2 id="gateTitle">Welcome.</h2>
          <p>In keeping with legal ethics standards across jurisdictions, this site is provided for information and education only. Entering it does not create a lawyer–client relationship, and nothing here is a solicitation of legal services.</p>
          <button className="btn solid" onClick={enter}><span>Acknowledge &amp; enter</span><Arrow /></button>
        </div>
      </div>
    </div>
  );
}
