import { useLayoutEffect, useRef, useState } from 'react';
import { QUIZ } from '../data/quiz';
import { gsap, refreshSoon, reduceMotion } from '../lib/motion';
import { useSectionMotion } from '../hooks/useSectionMotion';
import { Arrow, Words } from '../lib/ui';

export default function Quiz() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const numEl = useRef<HTMLSpanElement>(null);
  const barEl = useRef<HTMLElement>(null);
  const [qa, setQa] = useState<number[]>([]);
  useSectionMotion(root);

  const n = qa.length, done = n === 5;
  const score = qa.reduce((a, b) => a + b, 0);

  // Animate each question in, and count the score up when finished.
  useLayoutEffect(() => {
    refreshSoon();
    if (!panel.current) return;
    if (!done) {
      if (reduceMotion()) return;
      const t = gsap.from(panel.current.children, { y: 24, opacity: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' });
      return () => { t.kill(); };
    }
    const v = { n: 0 };
    const paint = () => { if (numEl.current) numEl.current.textContent = String(Math.round(v.n)); if (barEl.current) barEl.current.style.width = v.n + '%'; };
    if (reduceMotion()) { v.n = score; paint(); return; }
    const t = gsap.to(v, { n: score, duration: 1.6, ease: 'power3.out', onUpdate: paint });
    return () => { t.kill(); };
  }, [n, done, score]);

  const vulns = QUIZ.map((q, k) => ({ q, p: qa[k] })).filter(x => x.p < 20).map(x => ({ area: x.q.area, text: x.q.v, urgent: x.p <= 4 }));
  const q = QUIZ[Math.min(n, 4)];

  return (
    <section className="sec on-b" id="health" ref={root}>
      <div className="quiz-grid">
        <div>
          <div className="eyebrow"><span>Tool 02 · IP rights self-assessment</span></div>
          <h2 className="display h2"><Words text="Five questions." /><br /><Words text="Two minutes." /><br /><Words text="One IP health score." em /></h2>
          <p className="lead" style={{ marginTop: 28 }} data-rv>Built for startups, scale-ups and technology companies. Answer candidly — the score shows which gaps need attention first.</p>
        </div>
        <div aria-live="polite" ref={panel}>
          {!done ? (
            <>
              <div className="q-meta"><span>Question 0{n + 1} / 05</span><span>{q.area}</span></div>
              <div className="q-bar"><i style={{ width: (n / 5) * 100 + '%' }} /></div>
              <h3 className="q-text">{q.q}</h3>
              <div>
                {q.o.map(([label, pts], k) => (
                  <button key={label} className="opt" onClick={() => setQa([...qa, pts])}><b>{'ABC'[k]}</b><span>{label}</span><span>→</span></button>
                ))}
              </div>
              {n > 0 && <button className="q-back" onClick={() => setQa(qa.slice(0, -1))}>← Previous question</button>}
            </>
          ) : (
            <>
              <div className="q-meta"><span>Your IP health score</span></div>
              <div className="score"><span ref={numEl}>0</span>%</div>
              <div className="s-bar"><i ref={barEl} /></div>
              <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 22 }}>
                {score >= 80 ? 'Strong — maintain it with an annual IP review.' : score >= 50 ? 'Exposed — several gaps need attention before your next raise or launch.' : 'At risk — speak to an IP lawyer before your next milestone.'}
              </p>
              <div>
                {vulns.length ? vulns.map(v => (
                  <div className="vuln" key={v.area}><em className={v.urgent ? 'u' : ''}>{v.urgent ? 'Urgent' : 'Review'}</em><span><strong>{v.area}</strong><small>{v.text}</small></span></div>
                )) : <div className="vuln"><em>Clear</em><span><strong>No gaps flagged</strong><small>Keep it that way with an annual IP review.</small></span></div>}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 26 }}>
                <a className="btn solid" href="#consult">Review with Bipasha <Arrow /></a>
                <button className="btn ghost" onClick={() => setQa([])}>Retake</button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
