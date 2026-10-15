import { useEffect, useRef, useState } from 'react';
import { FORMATS, MATTER, PREP, TRI } from '../data/triage';
import type { TriAnswers } from '../data/types';
import { goTo, refreshSoon } from '../lib/motion';
import { useSectionMotion } from '../hooks/useSectionMotion';
import { useBooking } from '../hooks/useBooking';
import { Arrow, Words } from '../lib/ui';

const EMAIL = /\S+@\S+\.\S+/;

export default function Intake() {
  const root = useRef<HTMLElement>(null);
  const msgs = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [a, setA] = useState<TriAnswers>({});
  const [juris, setJuris] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [ref, setRef] = useState('');
  const [sent, setSent] = useState(false);
  const { setFormat, setMatter, email: bkEmail, setEmail: setBkEmail } = useBooking();
  useSectionMotion(root);

  const cur = TRI[step];
  const finished = step >= TRI.length;

  useEffect(() => {
    msgs.current?.scrollTo({ top: msgs.current.scrollHeight });
    refreshSoon();
  }, [step, sent]);

  const thread: { who: string; text: string; me: boolean }[] = [{ who: 'Concierge', text: 'Hello — I’m Bipasha’s intake concierge. A few quick questions so your first meeting starts with strategy, not paperwork.', me: false }];
  for (let k = 0; k < Math.min(step, TRI.length); k++) {
    thread.push({ who: 'Concierge', text: TRI[k].q, me: false }, { who: 'You', text: a[TRI[k].key] ?? '', me: true });
  }
  thread.push({ who: 'Concierge', text: cur ? cur.q : 'Thank you. Your pre-meeting strategy dossier is ready.', me: false });

  const pick = (v: string) => { if (cur) { setA({ ...a, [cur.key]: v }); setStep(step + 1); } };
  const toggle = (v: string) => setJuris(juris.includes(v) ? juris.filter(x => x !== v) : [...juris, v]);

  const dossier = () => {
    const pr = a.deadline === 'Active opposition or notice received' ? 'Urgent — response within 48 hours' : a.deadline === 'No hard deadline' ? 'Standard' : 'High — time-sensitive';
    const fmt = (a.stage === 'Idea stage' || a.stage === 'Creator') && a.deadline === 'No hard deadline' ? FORMATS[0] : FORMATS[1];
    const rows: [string, string][] = [['Matter', a.need ?? ''], ['Stage', a.stage ?? ''], ['Jurisdictions', a.juris ?? ''], ['Deadline', a.deadline ?? ''], ['Priority', pr], ['Recommended', fmt.title], ['Contact', a.email ?? '']];
    return { fmt, rows, prep: PREP[a.need ?? ''] ?? [] };
  };
  const d = finished ? dossier() : null;

  return (
    <section className="sec intake" id="intake" ref={root}>
      <div>
        <div className="eyebrow" style={{ color: 'var(--b)' }}><span>Tool 04 · Smart intake &amp; IP triage</span></div>
        <h2 className="display h2"><Words text="Brief the concierge." /> <Words text="Bipasha receives the dossier." em /></h2>
        <p className="lead" style={{ marginTop: 24 }} data-rv>Available day and night. A few quick questions pre-qualify your matter and compile a pre-meeting strategy dossier, sent to Bipasha before your consultation.</p>
        <div className="in-list" data-rv>
          <div><b>I</b><span>Stage of your business</span></div>
          <div><b>II</b><span>Jurisdictions involved — India, UK, EU, US</span></div>
          <div><b>III</b><span>Critical deadlines and notices</span></div>
        </div>
      </div>

      <div className="chat" data-rv>
        <div className="chat-top"><span>IP triage assistant</span><span><i />Online</span></div>
        <div className="chat-msgs" ref={msgs}>
          {thread.map((m, i) => <div key={i} className={'msg' + (m.me ? ' me' : '')}><small>{m.who}</small><div>{m.text}</div></div>)}
        </div>

        {cur?.o && (
          <div className="chat-opts">
            {cur.o.map(o => cur.multi
              ? <button key={o} className={'o' + (juris.includes(o) ? ' sel' : '')} onClick={() => toggle(o)}>{juris.includes(o) ? '■ ' : '□ '}{o}</button>
              : <button key={o} className="o" onClick={() => pick(o)}>{o}</button>)}
            {cur.multi && (
              <button className="btn solid" disabled={!juris.length} style={{ justifyContent: 'space-between' }}
                onClick={() => { setA({ ...a, juris: juris.join(', ') }); setStep(step + 1); }}>Continue <Arrow /></button>
            )}
          </div>
        )}

        {cur && cur.key === 'email' && (
          <div className="chat-email">
            <input className="input" type="email" placeholder="you@company.com" aria-label="Your email" value={email} onChange={e => setEmail(e.target.value)} />
            <button className="btn solid" disabled={!EMAIL.test(email)}
              onClick={() => { setA({ ...a, email }); setRef('BPS-' + (1000 + Math.floor(Math.random() * 9000))); setStep(TRI.length); }}>Compile</button>
          </div>
        )}

        {d && (
          <div className="dossier">
            <div className="t"><span>Pre-meeting strategy dossier</span><span>{ref}</span></div>
            {d.rows.map(([k, v]) => <div className="drow" key={k}><b>{k}</b><span>{v}</span></div>)}
            <h6>Prepare before the call</h6>
            {d.prep.map(p => <div className="dprep" key={p}><i>■</i><span>{p}</span></div>)}
            {sent ? (
              <div className="sentbox">
                <strong>Dossier delivered. Bipasha will review it before you meet.</strong>
                <button className="btn solid" style={{ justifyContent: 'space-between' }}
                  onClick={() => { setFormat(d.fmt.id); setMatter(MATTER[a.need ?? ''] ?? 'Trademark clearance & filing'); if (!bkEmail && a.email) setBkEmail(a.email); goTo('#consult'); }}>
                  Book the recommended session <Arrow />
                </button>
              </div>
            ) : (
              <button className="btn solid" style={{ width: '100%', justifyContent: 'space-between', marginTop: 16 }} onClick={() => setSent(true)}>Send dossier to Bipasha <Arrow /></button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
