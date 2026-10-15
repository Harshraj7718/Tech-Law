import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IND } from '../data/brand';
import type { Assessment } from '../data/types';
import { analyse } from '../lib/analyse';
import { downloadReport } from '../lib/report';
import { gsap, goTo, refreshSoon, reduceMotion } from '../lib/motion';
import { useSectionMotion } from '../hooks/useSectionMotion';
import { useBooking } from '../hooks/useBooking';
import { Arrow, Download, Words } from '../lib/ui';

type Status = 'idle' | 'running' | 'done';

export default function Evaluator() {
  const root = useRef<HTMLElement>(null);
  const res = useRef<HTMLDivElement>(null);
  const timer = useRef<number>();
  const [name, setName] = useState('');
  const [ind, setInd] = useState(Object.keys(IND)[0]);
  const [status, setStatus] = useState<Status>('idle');
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<Assessment | null>(null);
  const { setFormat, setMatter } = useBooking();
  useSectionMotion(root);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const evaluate = () => {
    const n = name.trim();
    if (!n || status === 'running') return;
    setStatus('running'); setStep(0); setResult(null);
    const run = (i: number) => {
      timer.current = window.setTimeout(() => {
        if (i < 4) { setStep(i); run(i + 1); }
        else { setResult(analyse(n, ind)); setStatus('done'); setStep(4); }
      }, 650);
    };
    run(1);
  };

  useLayoutEffect(() => {
    if (!result) return;
    refreshSoon();
    if (reduceMotion() || !res.current) return;
    const tween = gsap.fromTo(res.current.children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', clearProps: 'transform,opacity' });
    return () => { tween.kill(); };
  }, [result]);

  const labels = ['Parsing mark, phonetics & meaning', 'Rating on the distinctiveness spectrum', 'Mapping Nice classes for ' + ind, 'Scoring phonetic & conceptual overlap'];
  const spectrum = ['Generic', 'Descriptive', 'Suggestive', 'Arbitrary', 'Fanciful'];

  return (
    <section className="sec light" id="evaluator" ref={root}>
      <div className="tool-head">
        <div data-rv>
          <div className="eyebrow"><span>Tool 01 · Brand &amp; trademark risk evaluator</span></div>
          <h2 className="display h2"><Words text="Is your brand name" /> <Words text="registrable?" em /></h2>
        </div>
        <div className="live"><i />Instant analysis</div>
      </div>

      <div className="ev-grid" data-rv>
        <div className="ev-form">
          <div className="field">
            <label htmlFor="evName">Brand name</label>
            <input id="evName" className="input big" placeholder="e.g. NeuralPay" autoComplete="off" value={name}
              onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && evaluate()} />
          </div>
          <div className="field">
            <label htmlFor="evInd">Industry / sector</label>
            <select id="evInd" className="input" value={ind} onChange={e => setInd(e.target.value)}>
              {Object.keys(IND).map(k => <option key={k}>{k}</option>)}
            </select>
          </div>
          <button className="btn solid" disabled={!name.trim() || status === 'running'} onClick={evaluate} style={{ justifyContent: 'space-between' }}>
            <span>{status === 'running' ? 'Analysing…' : status === 'done' ? 'Evaluate again' : 'Evaluate distinctiveness'}</span><Arrow />
          </button>
          <p className="fine">Preliminary, automated screening. It is not a legal opinion and does not replace a full clearance search.</p>
        </div>

        <div className="ev-side">
          <div>
            {labels.map((l, i) => {
              const done = status === 'done' || (status === 'running' && i < step);
              const act = status === 'running' && i === step;
              return (
                <div key={l} className={'step' + (done ? ' done' : '') + (act ? ' act' : '')}>
                  <b>0{i + 1}</b><span>{l}</span><span>{done ? 'Done' : act ? 'Analysing…' : '—'}</span>
                </div>
              );
            })}
          </div>
          {result && (
            <div style={{ borderTop: '2px solid #fff', paddingTop: 16 }}>
              <div className="lbl" style={{ marginBottom: 8 }}>Results summary · {result.name}</div>
              {result.summary.map(([k, v]) => (
                <div className="sumrow" key={k}><i>■</i><span><strong>{k}:</strong> {v}</span></div>
              ))}
            </div>
          )}
          {status === 'idle' && <p className="idle-note">Rates distinctiveness on the legal spectrum, maps the Nice classes your business is likely to need, and flags phonetic and conceptual overlap.</p>}
        </div>
      </div>

      {result && (
        <div ref={res}>
          <div className="ev-res">
            <div>
              <h5>Distinctiveness rating</h5>
              <div className="big-word">{result.level}</div>
              <div style={{ fontWeight: 600, margin: '6px 0 0' }}>{result.pot}</div>
              <div className="spec">{spectrum.map((l, i) => <div key={l} className={i === result.lv ? 'on' : i < result.lv ? 'pass' : ''}>{l}</div>)}</div>
              <div className="spec-lbl"><span>Weaker</span><span>Stronger</span></div>
              <p style={{ fontSize: 14, marginTop: 16 }}>{result.note}</p>
            </div>
            <div>
              <h5>Nice classification mapping</h5>
              {result.classes.map(c => (
                <div className="cls" key={c.n}><b>{c.n}</b><span><strong>{c.label}</strong><small>{c.why}</small></span></div>
              ))}
            </div>
            <div>
              <h5>Phonetic &amp; conceptual risk</h5>
              <div className="big-word" style={result.risk === 'Low' ? undefined : { color: 'var(--b)' }}>{result.risk}</div>
              <div style={{ marginTop: 14 }}>
                {result.flags.map(f => <div className="flag" key={f.term}><b>{f.term}</b><small>{f.note}</small></div>)}
              </div>
            </div>
          </div>
          <div className="ev-actions">
            <button className="btn ghost" onClick={() => downloadReport(result)}>Download assessment (PDF) <Download /></button>
            <button className="btn solid" onClick={() => { setFormat('full'); setMatter('Trademark clearance & filing'); goTo('#consult'); }}>Book a clearance call with Bipasha <Arrow /></button>
          </div>
        </div>
      )}
    </section>
  );
}
