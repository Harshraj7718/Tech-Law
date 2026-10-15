import { useMemo, useRef, useState, type DragEvent } from 'react';
import { FORMATS, MATTERS } from '../data/triage';
import type { BookedFile } from '../data/types';
import { useRegion } from '../hooks/useRegion';
import { useBooking } from '../hooks/useBooking';
import { useSectionMotion } from '../hooks/useSectionMotion';
import { refreshSoon } from '../lib/motion';
import { Arrow, Words } from '../lib/ui';

const EMAIL = /\S+@\S+\.\S+/;
const folderFor = (n: string) => {
  const s = n.toLowerCase();
  return /logo|\.(png|jpe?g|svg|ai|eps|gif|webp)$/.test(s) ? 'Brand assets'
    : /cease|desist|notice|opposition|infring/.test(s) ? 'Disputes & notices'
    : /nda|agreement|contract|licen|term/.test(s) ? 'Agreements' : 'General';
};

export default function Consult() {
  const root = useRef<HTMLElement>(null);
  const { info } = useRegion();
  const { format, setFormat, matter, setMatter, email, setEmail } = useBooking();
  const [day, setDay] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [files, setFiles] = useState<BookedFile[]>([]);
  const [over, setOver] = useState(false);
  const [done, setDone] = useState<{ ref: string } | null>(null);
  useSectionMotion(root);

  const days = useMemo(() => {
    const out: Date[] = [];
    const d = new Date(); d.setHours(0, 0, 0, 0);
    while (out.length < 10) { d.setDate(d.getDate() + 1); if (d.getDay() && d.getDay() !== 6) out.push(new Date(d)); }
    return out;
  }, []);
  const dayObj = days.find(d => d.toDateString() === day);
  const slotTime = time && info.slots.includes(time) ? time : null;
  const fmt = FORMATS.find(f => f.id === format)!;
  const ok = EMAIL.test(email);

  const add = (list: FileList | null) => {
    if (!list) return;
    setFiles(f => [...f, ...Array.from(list).map(x => ({ name: x.name, folder: folderFor(x.name) }))]);
  };
  const onDrop = (e: DragEvent) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); };

  const label = !day ? 'Choose a date' : !slotTime ? 'Choose a time' : !ok ? 'Add your email' : 'Confirm ' + (format === 'screen' ? '15-minute screening' : 'strategy consultation');

  const folders: Record<string, string[]> = {};
  files.forEach(f => (folders[f.folder] = folders[f.folder] || []).push(f.name));
  const folderList = Object.entries(folders);

  return (
    <section className="sec on-b consult" id="consult" ref={root} style={{ padding: 0 }}>
      <div className="l">
        <div className="stick">
          <div className="eyebrow"><span>§ 06 &nbsp;Book a consultation</span></div>
          <h2 className="display"><Words text="Protect what you’re" /> <Words text="building." em /></h2>
          <p className="lead">Choose a 15-minute screening or a full strategy session. Sessions are held in {info.tz}. Documents you upload are filed into your client folder before the call.</p>
        </div>
      </div>

      <div className="r">
        {!done ? (
          <div className="form">
            <div className="fb">
              <div className="lbl"><span>i.</span> Session</div>
              <div className="fmts">
                {FORMATS.map(f => (
                  <button key={f.id} className={'fmt' + (f.id === format ? ' on' : '')} onClick={() => setFormat(f.id)}><small>{f.dur}</small><b>{f.title}</b><span>{f.desc}</span></button>
                ))}
              </div>
            </div>

            <div className="fb">
              <div className="lbl"><span>ii.</span> Date &amp; time ({info.tzShort})</div>
              <div className="days">
                {days.map(d => (
                  <button key={d.toDateString()} className={'day' + (d.toDateString() === day ? ' on' : '')} onClick={() => { setDay(d.toDateString()); setTime(null); }}>
                    <small>{d.toLocaleDateString('en-GB', { weekday: 'short' })}</small><b>{d.getDate()}</b><small>{d.toLocaleDateString('en-GB', { month: 'short' })}</small>
                  </button>
                ))}
              </div>
              <div className="slots">
                {info.slots.map((t, i) => {
                  const off = !day || (!!dayObj && (dayObj.getDate() + i) % 5 === 0);
                  return <button key={t} className={'slot' + (t === slotTime ? ' on' : '')} disabled={off} onClick={() => setTime(t)}>{t}</button>;
                })}
              </div>
            </div>

            <div className="fb details">
              <div className="lbl full" style={{ gridColumn: '1/-1' }}><span style={{ color: 'var(--b)', fontFamily: 'var(--serif)', fontStyle: 'italic', marginRight: 6 }}>iii.</span> Your details</div>
              <div className="field"><label htmlFor="bkName">Full name</label><input id="bkName" className="input" placeholder="Your name" autoComplete="name" value={name} onChange={e => setName(e.target.value)} /></div>
              <div className="field"><label htmlFor="bkEmail">Work email</label><input id="bkEmail" className="input" type="email" placeholder="you@company.com" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="field full">
                <label htmlFor="bkMatter">Matter</label>
                <select id="bkMatter" className="input" value={matter} onChange={e => setMatter(e.target.value)}>{MATTERS.map(m => <option key={m}>{m}</option>)}</select>
              </div>
            </div>

            <div className="fb">
              <div className="lbl"><span>iv.</span> Consultation brief — documents</div>
              <label className={'drop' + (over ? ' over' : '')} onDragOver={e => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={onDrop}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 16V4M6 9l6-6 6 6M4 20h16" /></svg>
                <span><b>Drop files or browse</b><small>Logo drafts, cease-and-desist letters, draft NDAs</small></span>
                <input type="file" multiple hidden onChange={e => { add(e.target.files); e.target.value = ''; }} />
              </label>
              {files.map((f, i) => (
                <div className="frow" key={f.name + i}><span>{f.name}</span><em>{f.folder}</em><button aria-label={'Remove ' + f.name} onClick={() => { setFiles(files.filter((_, j) => j !== i)); }}>×</button></div>
              ))}
            </div>

            <div className="fb">
              <button className="btn solid" disabled={!day || !slotTime || !ok} onClick={() => { setDone({ ref: 'CF-' + (1000 + Math.floor(Math.random() * 9000)) }); refreshSoon(); }}>
                <span>{label}</span><Arrow />
              </button>
            </div>
          </div>
        ) : (
          <div className="done">
            <div className="k">Confirmed</div>
            <h3>{fmt.title}</h3>
            <div className="when">{dayObj?.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} · {slotTime} {info.tzShort}</div>
            <div className="k">Client file · {done.ref} · {matter}</div>
            {folderList.length ? folderList.map(([n, f]) => (
              <div className="fold" key={n}><span><strong>{n}</strong><small>{f.join(', ')}</small></span><b>{f.length}</b></div>
            )) : <div className="fold"><span><strong>No documents yet</strong><small>You can add them from the confirmation email.</small></span><b>0</b></div>}
            <p style={{ fontSize: 14, color: 'var(--w70)', marginTop: 18 }}>A calendar invitation will be sent to {email}.</p>
          </div>
        )}
      </div>
    </section>
  );
}
