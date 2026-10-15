/* Bipasha — Global IP & Tech Law · site behaviour (GSAP + vanilla JS) */
(() => {
'use strict';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = !!window.gsap && !!window.ScrollTrigger;
let refreshT;
const refresh = () => { if (!hasGsap) return; clearTimeout(refreshT); refreshT = setTimeout(() => ScrollTrigger.refresh(), 120); };

/* ============================== DATA ============================== */
const REGION = {
  IN: { city: 'Bengaluru → World', tm: 'Prosecution before the Trade Marks Registry, India', ai: 'Aligned to the IT Act, 2000 and the DPDP Act, 2023', cr: 'Under the Copyright Act, 1957', en: 'Indian Patent Office as PCT receiving office; High Court enforcement', tz: 'IST, with UK hours on request', tzShort: 'IST', slots: ['10:00', '11:30', '14:00', '16:30'] },
  UK: { city: 'London → World', tm: 'Prosecution before the UK Intellectual Property Office', ai: 'Aligned to UK GDPR and s.9(3) CDPA 1988', cr: 'Under the Copyright, Designs and Patents Act 1988', en: 'UKIPO as PCT receiving office; IPEC and High Court', tz: 'GMT, with IST hours on request', tzShort: 'GMT', slots: ['09:30', '11:00', '13:30', '15:00'] }
};

const IND = {
  'Fintech & SaaS': { desc: ['pay','fin','bank','cash','money','coin','ledger','wallet','credit','loan','fund','invest','saas','cloud','soft','app','finance','payments'], classes: [[9,'Software','Downloadable apps, platforms and APIs'],[36,'Financial','Payments, banking and investment services'],[42,'SaaS','Hosted software and platform services']] },
  'Software / AI': { desc: ['ai','neural','soft','code','data','byte','bot','cloud','logic','smart','tech','app','labs','compute','net','software'], classes: [[9,'Software','Downloadable software and AI models'],[42,'SaaS & R&D','Hosted AI, software development and IT services'],[35,'Business','Data analytics and business information services']] },
  'Consumer goods & retail': { desc: ['shop','mart','store','home','buy','deal','cart','goods','basket','retail'], classes: [[35,'Retail','Online and retail store services'],[3,'Cosmetics','Cleaning, cosmetic and personal care products'],[21,'Housewares','Household and kitchen utensils']] },
  'Media & entertainment': { desc: ['media','film','studio','play','stream','tv','music','beat','story','pix','reel'], classes: [[41,'Entertainment','Production, publishing and entertainment services'],[9,'Recorded media','Downloadable music, video and games'],[38,'Telecoms','Streaming and broadcasting services']] },
  'Health & life sciences': { desc: ['health','care','med','cure','vita','life','bio','pharma','clinic','well','derm'], classes: [[5,'Pharmaceuticals','Medicines, supplements and medical preparations'],[10,'Medical devices','Medical and diagnostic apparatus'],[44,'Medical services','Healthcare and clinical services']] },
  'Fashion & apparel': { desc: ['wear','style','thread','closet','mode','vogue','fashion','luxe','couture','apparel'], classes: [[25,'Clothing','Clothing, footwear and headwear'],[18,'Leather goods','Bags, wallets and accessories'],[35,'Retail','Online retail of fashion goods']] },
  'Food & beverage': { desc: ['food','eat','taste','fresh','brew','bake','kitchen','chef','cafe','organic','juice'], classes: [[30,'Staple foods','Coffee, tea, bakery and confectionery'],[32,'Beverages','Non-alcoholic drinks and juices'],[43,'Hospitality','Restaurant and café services']] },
  'Education & edtech': { desc: ['learn','edu','study','school','academy','tutor','class','skill','genius','education'], classes: [[41,'Education','Teaching, training and online courses'],[9,'Software','Downloadable learning apps and e-books'],[16,'Printed matter','Books and instructional material']] }
};
const CROWD = ['neural','pay','nova','apex','prime','smart','cloud','tech','pure','true','next','bright','ai','digital','alpha','sky','fit','labs','byte','data','mind','hub','zen','flow','spark','swift','link','core','meta','quantum','vita','luxe','fresh'];
const DICT = ['apple','amazon','river','orange','falcon','monkey','lotus','tiger','ocean','stone','maple','zebra','comet','arrow','anchor','pebble','mango','cobalt','harbor','raven','summit','atlas','oak','lantern','compass','velvet','saffron','indigo','banyan','monsoon','granite','kite'];

const QUIZ = [
  { q: 'Do you have written IP assignment agreements with all developers and contractors?', area: 'Ownership of code & designs', o: [['Yes, with everyone', 20], ['Some, not all', 8], ['No / not sure', 0]], v: 'Work created by contractors can legally belong to them, not your company — a common due-diligence failure.' },
  { q: 'Have you registered your core brand marks in every country you operate or sell in?', area: 'Brand protection', o: [['Yes, all target markets', 20], ['Home market only', 10], ['Not yet filed', 0]], v: 'Unregistered markets leave your brand open to squatters and first-to-file claims.' },
  { q: 'Does your product incorporate open-source code or third-party AI APIs?', area: 'Software & AI licensing', o: [['Yes — licences reviewed', 20], ['Yes — not reviewed', 4], ['No', 20]], v: 'Unreviewed copyleft licences or AI API terms can restrict commercial use or ownership of output.' },
  { q: 'Do you sign NDAs before sharing product, code or roadmap with partners or investors?', area: 'Confidentiality', o: [['Always', 20], ['Sometimes', 10], ['Rarely', 0]], v: 'Disclosure without confidentiality terms weakens trade-secret protection.' },
  { q: 'Have you secured matching domain names and social handles for your brand?', area: 'Digital presence', o: [['Yes, all key ones', 20], ['Main domain only', 12], ['No', 0]], v: 'Missing domains and handles invite cybersquatting and impersonation.' }
];

const TRI = [
  { q: 'Are you looking to register a new brand, protect software or AI, resolve an infringement notice, or draft a commercial IP agreement?', key: 'need', o: ['Register a new brand', 'Protect software / AI', 'Resolve an infringement notice', 'Draft a commercial IP agreement'] },
  { q: 'Which best describes your stage of business?', key: 'stage', o: ['Idea stage', 'Early-stage startup', 'Enterprise', 'Creator'] },
  { q: 'Which jurisdictions are involved? Select all that apply.', key: 'juris', o: ['India', 'UK', 'EU', 'US'], multi: true },
  { q: 'Is there a critical deadline we should know about?', key: 'deadline', o: ['Product launch within 30 days', 'Active opposition or notice received', 'Funding round or deal closing', 'No hard deadline'] },
  { q: 'Last step — where should Bipasha reply?', key: 'email' }
];
const PREP = {
  'Register a new brand': ['Proposed name(s) and logo drafts', 'Goods or services and launch markets', 'Any existing use, domains or handles'],
  'Protect software / AI': ['Contractor and employee agreements', 'List of open-source components and AI APIs', 'Non-confidential product architecture summary'],
  'Resolve an infringement notice': ['The notice or letter received, with its date', 'Evidence of your first use', 'Any prior correspondence'],
  'Draft a commercial IP agreement': ['Counterparty details and deal summary', 'Existing term sheet or draft', 'IP being licensed in or out']
};
const MATTER = { 'Register a new brand': 'Trademark clearance & filing', 'Protect software / AI': 'Software & AI rights', 'Resolve an infringement notice': 'Infringement / cease-and-desist', 'Draft a commercial IP agreement': 'Commercial IP agreement' };
const FORMATS = [
  { id: 'screen', title: '15-Minute Preliminary IP Screening', dur: '15 min · Video', desc: 'A quick read on one question — registrability, a notice received, or where to start.' },
  { id: 'full', title: 'Full Strategy Consultation', dur: '60 min · Video', desc: 'A full review of your IP position across markets, with a written action plan.' }
];
const ARTS = [
  { id: 1, tag: 'UK · IN', date: 'Aug 2026', title: 'Who owns AI-generated output? The UK and Indian positions compared', kw: ['ai','output','copyright','generated','owns','ownership','authorship','author'], summary: 'In the UK, s.9(3) CDPA 1988 treats the author of a computer-generated work as the person who made the arrangements necessary for its creation, with 50 years of protection — though how it applies to modern generative AI is contested. Indian law has no equivalent provision: the Copyright Act, 1957 assumes a human author, so purely AI-generated output is unlikely to be protected without meaningful human creative input.' },
  { id: 2, tag: 'Global', date: 'Jul 2026', title: 'The Madrid System: when a startup should file internationally', kw: ['madrid','international','trademark','file','filing','startup','wipo','when','abroad'], summary: 'File internationally once you hold a home application or registration and have a concrete plan to trade in other markets. The Madrid Protocol lets you designate India, the UK, the EU and the US through one application, but the international registration depends on the home mark for five years — so secure a clean home filing first.' },
  { id: 3, tag: 'Global', date: 'Jun 2026', title: 'Open-source and AI APIs: a licensing checklist for founders', kw: ['open','source','api','apis','licence','license','gpl','copyleft','third'], summary: 'Audit every open-source component and AI API before launch. Copyleft licences such as the GPL can require you to release your own source code, and many AI API terms limit how outputs and data may be used commercially. Keep a component register and review it before each funding round.' },
  { id: 4, tag: 'IN', date: 'May 2026', title: 'Contractor IP assignments in India: what every startup needs', kw: ['contractor','contractors','assignment','assignments','developer','developers','freelance','india','agreement'], summary: 'Under the Indian Copyright Act, work created by an independent contractor belongs to the contractor unless assigned in writing. The assignment should identify the work, the rights, the territory and the duration — if territory or duration is left out, Section 19 presumes India and five years.' },
  { id: 5, tag: 'UK', date: 'Apr 2026', title: 'UK trade mark oppositions: deadlines and strategy', kw: ['opposition','oppose','uk','deadline','ukipo','notice','objection'], summary: 'Once a UK trade mark application is published, third parties have two months to oppose, extendable to three by filing a notice of threatened opposition. A good response starts with assessing the opponent’s earlier rights, and whether a coexistence agreement is commercially better than a contested hearing.' },
  { id: 6, tag: 'UK · IN', date: 'Mar 2026', title: 'Training data and copyright: the UK TDM exception versus India', kw: ['training','data','tdm','mining','model','models','dataset','scraping'], summary: 'The UK text and data mining exception (s.29A CDPA) covers only non-commercial research, so commercial model training on protected works generally needs a licence. India has no specific TDM exception, and fair dealing under Section 52 is narrow — leaving commercial training on copyrighted data legally uncertain.' }
];

/* ============================== STATE ============================== */
const S = {
  region: 'IN',
  ev: { status: 'idle', step: -1, result: null },
  qa: [],
  tri: { a: {}, step: 0, juris: [], email: '', ref: '', sent: false },
  bk: { format: 'full', day: null, time: null, files: [], done: false, ref: '' }
};
let evTimer;

/* ============================== REGION ============================== */
function setRegion(r) {
  S.region = r;
  const R = REGION[r];
  $$('[data-r]').forEach(el => { el.textContent = R[el.dataset.r]; });
  $$('.seg button').forEach(b => { const on = b.dataset.region === r; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  renderBkSlots(); renderBkLabel();
}
$$('.seg button').forEach(b => b.addEventListener('click', () => setRegion(b.dataset.region)));

/* ============================== EVALUATOR ============================== */
const evInd = $('#evInd');
evInd.innerHTML = Object.keys(IND).map(k => `<option>${esc(k)}</option>`).join('');
const evName = $('#evName'), evGo = $('#evGo');
evName.addEventListener('input', () => { evGo.disabled = !evName.value.trim() || S.ev.status === 'running'; });
evName.addEventListener('keydown', e => { if (e.key === 'Enter') evaluate(); });
evGo.addEventListener('click', evaluate);

function analyse(name, ind) {
  const I = IND[ind], s = name.toLowerCase().replace(/[^a-z]/g, '');
  const has = w => w.length <= 2 ? (s.startsWith(w) || s.endsWith(w)) : s.includes(w);
  const dh = I.desc.filter(has), ah = DICT.filter(w => s.includes(w)), cr = CROWD.filter(has);
  const rest = dh.reduce((a, w) => a.replace(w, ''), s).length;
  const lv = (I.desc.includes(s) || I.desc.includes(s.replace(/s$/, ''))) ? 0 : (dh.length && rest <= 2) ? 1 : dh.length ? 2 : ah.length ? 3 : 4;
  const LV = ['Generic', 'Descriptive', 'Suggestive', 'Arbitrary', 'Fanciful'];
  const POT = ['Not registrable', 'Low registrability potential', 'High registrability potential', 'Very high registrability potential', 'Strongest registrability potential'];
  const NOTE = [
    'The name is the common term for the goods or services themselves. It cannot function as a trade mark in any market.',
    'The name directly describes what you offer. Expect examiner objections in India and the UK unless acquired distinctiveness can be shown.',
    'The name hints at the offering without describing it — registrable, and a strong commercial balance.',
    'A real word used out of context. Highly distinctive and registrable.',
    'An invented word with no prior meaning — the strongest category of mark.'];
  const pts = cr.length * 2 + (s.length <= 5 ? 1 : 0) + (lv <= 1 ? 2 : 0);
  const risk = pts <= 1 ? 'Low' : pts <= 3 ? 'Medium' : 'High';
  const cap = w => w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1);
  const flags = cr.map(w => ({ term: '“' + cap(w) + '”', note: 'Crowded element in Class ' + I.classes[0][0] + ' registers — sound-alike and meaning-alike marks are likely.' }));
  if (s.length <= 5) flags.push({ term: 'Short mark', note: 'Short names attract phonetic conflicts with similar-sounding marks.' });
  if (lv <= 1) flags.push({ term: 'Descriptive content', note: 'Raises the chance of an examiner objection on absolute grounds.' });
  if (!flags.length) flags.push({ term: 'None flagged', note: 'No crowded elements in the preliminary screen. A full search is still advised before launch.' });
  const classes = I.classes.map(c => ({ n: 'Class ' + c[0], label: c[1], why: c[2] }));
  const clsText = I.classes.slice(0, 2).map(c => 'Class ' + c[0] + ' (' + c[1] + ')').join(' & ');
  const riskText = risk + (cr.length ? " (full clearance search needed for '" + cap(cr[0]) + "')" : risk === 'Low' ? ' (standard clearance search recommended)' : ' (full clearance search recommended)');
  return { name, ind, lv, level: LV[lv], pot: POT[lv], note: NOTE[lv], risk, flags, classes,
    summary: [['Distinctiveness', LV[lv] + ' — ' + POT[lv]], ['Recommended classes', clsText], ['Strategic risk', riskText]] };
}

function evaluate() {
  const name = evName.value.trim();
  if (!name || S.ev.status === 'running') return;
  S.ev = { status: 'running', step: 0, result: null };
  renderEv();
  const run = i => { evTimer = setTimeout(() => {
    if (i < 4) { S.ev.step = i; renderEv(); run(i + 1); }
    else { S.ev = { status: 'done', step: 4, result: analyse(name, evInd.value) }; renderEv(); }
  }, 650); };
  run(1);
}

function renderEv() {
  const ev = S.ev;
  const labels = ['Parsing mark, phonetics & meaning', 'Rating on the distinctiveness spectrum', 'Mapping Nice classes for ' + evInd.value, 'Scoring phonetic & conceptual overlap'];
  $('#evSteps').innerHTML = labels.map((l, i) => {
    const done = ev.status === 'done' || (ev.status === 'running' && i < ev.step), act = ev.status === 'running' && i === ev.step;
    return `<div class="step ${done ? 'done' : ''} ${act ? 'act' : ''}"><b>0${i + 1}</b><span>${esc(l)}</span><span>${done ? 'Done' : act ? 'Analysing…' : '—'}</span></div>`;
  }).join('');
  $('#evIdle').hidden = ev.status !== 'idle';
  evGo.disabled = !evName.value.trim() || ev.status === 'running';
  $('#evGoLbl').textContent = ev.status === 'running' ? 'Analysing…' : ev.status === 'done' ? 'Evaluate again' : 'Evaluate distinctiveness';
  const r = ev.result, res = $('#evRes');
  $('#evSum').innerHTML = r ? `<div style="border-top:2px solid #fff;padding-top:16px"><div class="lbl" style="margin-bottom:8px">Results summary · ${esc(r.name)}</div>${r.summary.map(s => `<div class="sumrow"><i>■</i><span><strong>${esc(s[0])}:</strong> ${esc(s[1])}</span></div>`).join('')}</div>` : '';
  if (!r) { res.hidden = true; res.innerHTML = ''; return; }
  const spec = ['Generic', 'Descriptive', 'Suggestive', 'Arbitrary', 'Fanciful'].map((l, i) => `<div class="${i === r.lv ? 'on' : i < r.lv ? 'pass' : ''}">${l}</div>`).join('');
  res.innerHTML = `
    <div class="ev-res">
      <div><h5>Distinctiveness rating</h5><div class="big-word">${esc(r.level)}</div><div style="font-weight:600;margin:6px 0 0">${esc(r.pot)}</div>
        <div class="spec">${spec}</div><div class="spec-lbl"><span>Weaker</span><span>Stronger</span></div><p style="font-size:14px;margin-top:16px">${esc(r.note)}</p></div>
      <div><h5>Nice classification mapping</h5>${r.classes.map(c => `<div class="cls"><b>${esc(c.n)}</b><span><strong>${esc(c.label)}</strong><small>${esc(c.why)}</small></span></div>`).join('')}</div>
      <div><h5>Phonetic &amp; conceptual risk</h5><div class="big-word" style="${r.risk === 'Low' ? '' : 'color:var(--b)'}">${r.risk}</div><div style="margin-top:14px">${r.flags.map(f => `<div class="flag"><b>${esc(f.term)}</b><small>${esc(f.note)}</small></div>`).join('')}</div></div>
    </div>
    <div class="ev-actions"><button class="btn ghost" id="evPdf">Download assessment (PDF) <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 4v12M6 11l6 6 6-6M4 20h16"/></svg></button><button class="btn solid" id="evBook">Book a clearance call with Bipasha ${ARROW}</button></div>`;
  const first = res.hidden; res.hidden = false;
  $('#evPdf').onclick = evDownload;
  $('#evBook').onclick = () => { S.bk.format = 'full'; $('#bkMatter').value = 'Trademark clearance & filing'; renderBk(); goTo('#consult'); };
  if (first && hasGsap && !reduce) gsap.from(res.children, { y: 40, opacity: 0, duration: .7, stagger: .12, ease: 'power3.out' });
  refresh();
}

function evDownload() {
  const r = S.ev.result; if (!r) return;
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const rows = a => a.map(x => '<tr><td>' + esc(x[0]) + '</td><td>' + esc(x[1]) + '</td></tr>').join('');
  const html = '<!doctype html><html><head><meta charset="utf-8"><title>Preliminary Assessment - ' + esc(r.name) + '</title>' +
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;700&family=Playfair+Display:wght@700&display=swap">' +
    '<style>@page{size:A4;margin:16mm}body{font-family:Archivo,sans-serif;color:#000;margin:0;font-size:11pt;line-height:1.5}h1{font-family:"Playfair Display",serif;font-size:32pt;margin:4pt 0 2pt}.k{font-size:8pt;letter-spacing:.14em;text-transform:uppercase;font-weight:700}.bar{height:8pt;background:#6D001A;margin:0 0 14pt}table{width:100%;border-collapse:collapse;margin:6pt 0 12pt}td{border-top:1.5pt solid #000;padding:6pt 0;vertical-align:top}td:first-child{width:32%;font-weight:700}h2{font-size:12pt;margin:12pt 0 2pt;color:#6D001A}.f{font-size:8pt;color:#444;border-top:1.5pt solid #000;padding-top:6pt;margin-top:16pt}</style></head><body>' +
    '<div class="bar"></div><div class="k">Bipasha · Global IP &amp; Tech Law — Preliminary assessment</div><h1>' + esc(r.name) + '</h1><div>' + esc(r.ind) + ' · ' + esc(date) + '</div>' +
    '<h2>Results summary</h2><table>' + rows(r.summary) + '</table><h2>Distinctiveness</h2><p>' + esc(r.note) + '</p>' +
    '<h2>Nice classification mapping</h2><table>' + rows(r.classes.map(c => [c.n + ' — ' + c.label, c.why])) + '</table>' +
    '<h2>Phonetic &amp; conceptual risk: ' + esc(r.risk) + '</h2><table>' + rows(r.flags.map(f => [f.term, f.note])) + '</table>' +
    '<h2>Recommended next step</h2><p>Book a formal clearance search call with Bipasha before filing or public launch.</p>' +
    '<div class="f">Automated preliminary screening for information only. It is not legal advice, does not create a lawyer–client relationship, and is not a substitute for a full clearance search.</div></body></html>';
  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); setTimeout(() => { try { w.focus(); w.print(); } catch (x) {} }, 800); }
  else { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' })); a.download = 'Preliminary-Assessment-' + r.name.replace(/\W+/g, '-') + '.html'; a.click(); }
}

/* ============================== QUIZ ============================== */
function renderQuiz() {
  const el = $('#quiz'), qa = S.qa, n = qa.length;
  if (n < 5) {
    const q = QUIZ[n];
    el.innerHTML = `<div class="q-meta"><span>Question 0${n + 1} / 05</span><span>${esc(q.area)}</span></div>
      <div class="q-bar"><i style="width:${n / 5 * 100}%"></i></div>
      <h3 class="q-text">${esc(q.q)}</h3>
      ${q.o.map((o, k) => `<button class="opt" data-pts="${o[1]}"><b>${'ABC'[k]}</b><span>${esc(o[0])}</span><span>→</span></button>`).join('')}
      ${n ? '<button class="q-back" id="qBack">← Previous question</button>' : ''}`;
    $$('.opt', el).forEach(b => b.onclick = () => { S.qa.push(+b.dataset.pts); renderQuiz(); });
    const bk = $('#qBack'); if (bk) bk.onclick = () => { S.qa.pop(); renderQuiz(); };
    if (hasGsap && !reduce) gsap.from(el.children, { y: 24, opacity: 0, duration: .45, stagger: .06, ease: 'power2.out' });
  } else {
    const score = qa.reduce((a, b) => a + b, 0);
    const vul = QUIZ.map((q, k) => ({ q, p: qa[k] })).filter(x => x.p < 20).map(x => ({ area: x.q.area, text: x.q.v, u: x.p <= 4 }));
    if (!vul.length) vul.push({ area: 'No gaps flagged', text: 'Keep it that way with an annual IP review.', u: false, clear: true });
    el.innerHTML = `<div class="q-meta"><span>Your IP health score</span></div>
      <div class="score"><span id="scoreN">0</span>%</div><div class="s-bar"><i id="scoreBar"></i></div>
      <p style="font-size:18px;font-weight:600;margin-bottom:22px">${score >= 80 ? 'Strong — maintain it with an annual IP review.' : score >= 50 ? 'Exposed — several gaps need attention before your next raise or launch.' : 'At risk — speak to an IP lawyer before your next milestone.'}</p>
      ${vul.map(v => `<div class="vuln"><em class="${v.u ? 'u' : ''}">${v.clear ? 'Clear' : v.u ? 'Urgent' : 'Review'}</em><span><strong>${esc(v.area)}</strong><small>${esc(v.text)}</small></span></div>`).join('')}
      <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:26px"><a class="btn solid" href="#consult" data-go>Review with Bipasha ${ARROW}</a><button class="btn ghost" id="qReset">Retake</button></div>`;
    $('#qReset').onclick = () => { S.qa = []; renderQuiz(); };
    const num = { v: 0 };
    const upd = () => { $('#scoreN').textContent = Math.round(num.v); $('#scoreBar').style.width = num.v + '%'; };
    if (hasGsap && !reduce) gsap.to(num, { v: score, duration: 1.6, ease: 'power3.out', onUpdate: upd }); else { num.v = score; upd(); }
  }
  refresh();
}

/* ============================== KNOWLEDGE BASE ============================== */
const kbQ = $('#kbQ'), kbGo = $('#kbGo'), kbOut = $('#kbOut');
$('#kbChips').innerHTML = ['Who owns the copyright to output generated by AI under UK vs. Indian law?', 'When should a startup file an international trademark under the Madrid System?', 'Do I need IP assignments from freelance developers in India?'].map(c => `<button class="chip">${esc(c)}</button>`).join('');
$$('#kbChips .chip').forEach(b => b.onclick = () => { kbQ.value = b.textContent; kbGo.disabled = false; kbAsk(b.textContent); });
kbQ.addEventListener('input', () => { kbGo.disabled = !kbQ.value.trim(); });
kbQ.addEventListener('keydown', e => { if (e.key === 'Enter') kbAsk(kbQ.value); });
kbGo.addEventListener('click', () => kbAsk(kbQ.value));

function showAnswer(answer, sources) {
  kbOut.innerHTML = `<div class="kb-ans"><div><h5>Executive answer</h5><p class="a">${esc(answer)}</p><p style="font-size:12px;opacity:.7">Drawn only from Bipasha’s published writing. For information only — not legal advice.</p></div>
    <div><h5>Sources</h5>${sources.map(a => `<a class="src" href="#articles"><b>0${a.id}</b><span>${esc(a.title)}</span><span>→</span></a>`).join('')}
    ${sources.length ? '' : `<a class="btn solid" href="#consult" data-go>Ask Bipasha directly ${ARROW}</a>`}</div></div>`;
  if (hasGsap && !reduce) gsap.from(kbOut.firstElementChild, { y: 30, opacity: 0, duration: .6, ease: 'power3.out' });
  refresh();
}
function kbAsk(raw) {
  const q = String(raw || '').trim(); if (!q) return;
  kbOut.innerHTML = '<div style="padding:28px 0;display:flex;gap:12px;align-items:center;font-weight:600"><span class="live" style="display:inline-flex"><i></i></span>Searching published writing…</div>';
  setTimeout(() => {
    const t = q.toLowerCase().split(/\W+/).filter(w => w.length > 2);
    const sc = ARTS.map(a => ({ a, s: t.filter(w => a.kw.includes(w)).length * 2 + t.filter(w => a.title.toLowerCase().includes(w)).length })).sort((x, y) => y.s - x.s);
    const top = sc.filter(x => x.s > 1).slice(0, 2).map(x => x.a);
    top.length ? showAnswer(top.map(a => a.summary).join(' '), top) : showAnswer('Bipasha has not yet published on this question. Book a consultation for a direct answer.', []);
  }, 600);
}
$('#articles').innerHTML = ARTS.map(a => `<button class="art" data-id="${a.id}"><div class="m"><span>${esc(a.tag)}</span><span>${esc(a.date)}</span></div><h3>${esc(a.title)}</h3><span class="go">Summarise →</span></button>`).join('');
$$('#articles .art').forEach(b => b.onclick = () => { const a = ARTS.find(x => x.id === +b.dataset.id); kbQ.value = a.title; kbGo.disabled = false; showAnswer(a.summary, [a]); goTo('#kbQ'); });

/* ============================== TRIAGE ============================== */
function triDossier() {
  const a = S.tri.a;
  const pr = a.deadline === 'Active opposition or notice received' ? 'Urgent — response within 48 hours' : a.deadline === 'No hard deadline' ? 'Standard' : 'High — time-sensitive';
  const fmt = (a.stage === 'Idea stage' || a.stage === 'Creator') && a.deadline === 'No hard deadline' ? FORMATS[0] : FORMATS[1];
  return { fmt, rows: [['Matter', a.need], ['Stage', a.stage], ['Jurisdictions', a.juris], ['Deadline', a.deadline], ['Priority', pr], ['Recommended', fmt.title], ['Contact', a.email]], prep: PREP[a.need] || [] };
}
function renderTri() {
  const t = S.tri, step = TRI[t.step], msgs = [['Concierge', 'Hello — I’m Bipasha’s intake concierge. A few quick questions so your first meeting starts with strategy, not paperwork.', 0]];
  for (let k = 0; k < Math.min(t.step, TRI.length); k++) { msgs.push(['Concierge', TRI[k].q, 0]); msgs.push(['You', t.a[TRI[k].key], 1]); }
  msgs.push(['Concierge', step ? step.q : 'Thank you. Your pre-meeting strategy dossier is ready.', 0]);
  const box = $('#triMsgs');
  box.innerHTML = msgs.map(m => `<div class="msg ${m[2] ? 'me' : ''}"><small>${m[0]}</small><div>${esc(m[1])}</div></div>`).join('');
  box.scrollTop = box.scrollHeight;
  const ctl = $('#triCtl'); ctl.innerHTML = '';
  if (step && step.o) {
    ctl.innerHTML = `<div class="chat-opts">${step.o.map(o => `<button class="o ${step.multi && t.juris.includes(o) ? 'sel' : ''}" data-v="${esc(o)}">${step.multi ? (t.juris.includes(o) ? '■ ' : '□ ') : ''}${esc(o)}</button>`).join('')}${step.multi ? `<button class="btn solid" id="triCont" ${t.juris.length ? '' : 'disabled'} style="justify-content:space-between">Continue ${ARROW}</button>` : ''}</div>`;
    $$('button.o', ctl).forEach(b => b.onclick = () => {
      const v = b.dataset.v;
      if (step.multi) { t.juris = t.juris.includes(v) ? t.juris.filter(x => x !== v) : t.juris.concat(v); renderTri(); }
      else { t.a[step.key] = v; t.step++; renderTri(); }
    });
    const c = $('#triCont'); if (c) c.onclick = () => { t.a.juris = t.juris.join(', '); t.step++; renderTri(); };
  } else if (step && step.key === 'email') {
    ctl.innerHTML = `<div class="chat-email"><input class="input" id="triEmail" type="email" placeholder="you@company.com" value="${esc(t.email)}" aria-label="Your email"><button class="btn solid" id="triGo" ${/\S+@\S+\.\S+/.test(t.email) ? '' : 'disabled'}>Compile</button></div>`;
    const inp = $('#triEmail'), go = $('#triGo');
    inp.oninput = () => { t.email = inp.value; go.disabled = !/\S+@\S+\.\S+/.test(t.email); };
    go.onclick = () => { t.a.email = t.email; t.ref = 'BPS-' + (1000 + Math.floor(Math.random() * 9000)); t.step = TRI.length; renderTri(); };
  }
  const dEl = $('#triDoss');
  if (t.step >= TRI.length) {
    const d = triDossier();
    dEl.innerHTML = `<div class="dossier"><div class="t"><span>Pre-meeting strategy dossier</span><span>${esc(t.ref)}</span></div>
      ${d.rows.map(r => `<div class="drow"><b>${r[0]}</b><span>${esc(r[1])}</span></div>`).join('')}
      <h6>Prepare before the call</h6>${d.prep.map(p => `<div class="dprep"><i>■</i><span>${esc(p)}</span></div>`).join('')}
      ${t.sent ? `<div class="sentbox"><strong>Dossier delivered. Bipasha will review it before you meet.</strong><button class="btn solid" id="triBook" style="justify-content:space-between">Book the recommended session ${ARROW}</button></div>`
               : `<button class="btn solid" id="triSend" style="width:100%;justify-content:space-between;margin-top:16px">Send dossier to Bipasha ${ARROW}</button>`}</div>`;
    const s = $('#triSend'); if (s) s.onclick = () => { t.sent = true; renderTri(); };
    const b = $('#triBook'); if (b) b.onclick = () => { S.bk.format = d.fmt.id; $('#bkMatter').value = MATTER[t.a.need] || $('#bkMatter').value; if (!$('#bkEmail').value) $('#bkEmail').value = t.a.email; renderBk(); goTo('#consult'); };
  } else dEl.innerHTML = '';
  refresh();
}

/* ============================== BOOKING ============================== */
const days = []; { const d = new Date(); d.setHours(0, 0, 0, 0); while (days.length < 10) { d.setDate(d.getDate() + 1); if (d.getDay() && d.getDay() !== 6) days.push(new Date(d)); } }
const okEmail = /\S+@\S+\.\S+/;
const fileCat = n => { const s = n.toLowerCase(); return /logo|\.(png|jpe?g|svg|ai|eps|gif|webp)$/.test(s) ? 'Brand assets' : /cease|desist|notice|opposition|infring/.test(s) ? 'Disputes & notices' : /nda|agreement|contract|licen|term/.test(s) ? 'Agreements' : 'General'; };

function renderBkFormats() {
  $('#bkFmts').innerHTML = FORMATS.map(f => `<button class="fmt ${f.id === S.bk.format ? 'on' : ''}" data-id="${f.id}"><small>${f.dur}</small><b>${f.title}</b><span>${f.desc}</span></button>`).join('');
  $$('#bkFmts .fmt').forEach(b => b.onclick = () => { S.bk.format = b.dataset.id; renderBk(); });
}
function renderBkDays() {
  $('#bkDays').innerHTML = days.map(d => `<button class="day ${d.toDateString() === S.bk.day ? 'on' : ''}" data-d="${d.toDateString()}"><small>${d.toLocaleDateString('en-GB', { weekday: 'short' })}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString('en-GB', { month: 'short' })}</small></button>`).join('');
  $$('#bkDays .day').forEach(b => b.onclick = () => { S.bk.day = b.dataset.d; S.bk.time = null; renderBkDays(); renderBkSlots(); renderBkLabel(); });
}
function renderBkSlots() {
  const R = REGION[S.region], dayObj = days.find(d => d.toDateString() === S.bk.day);
  if (S.bk.time && !R.slots.includes(S.bk.time)) S.bk.time = null;
  $('#bkSlots').innerHTML = R.slots.map((t, i) => { const off = !S.bk.day || (dayObj && (dayObj.getDate() + i) % 5 === 0); return `<button class="slot ${t === S.bk.time ? 'on' : ''}" data-t="${t}" ${off ? 'disabled' : ''}>${t}</button>`; }).join('');
  $$('#bkSlots .slot').forEach(b => b.onclick = () => { S.bk.time = b.dataset.t; renderBkSlots(); renderBkLabel(); });
}
function renderBkFiles() {
  $('#bkFiles').innerHTML = S.bk.files.map((f, i) => `<div class="frow"><span>${esc(f.name)}</span><em>${f.folder}</em><button data-i="${i}" aria-label="Remove ${esc(f.name)}">×</button></div>`).join('');
  $$('#bkFiles button').forEach(b => b.onclick = () => { S.bk.files.splice(+b.dataset.i, 1); renderBkFiles(); });
}
function renderBkLabel() {
  const b = S.bk, ok = okEmail.test($('#bkEmail').value);
  $('#bkGoLbl').textContent = !b.day ? 'Choose a date' : !b.time ? 'Choose a time' : !ok ? 'Add your email' : 'Confirm ' + (b.format === 'screen' ? '15-minute screening' : 'strategy consultation');
  $('#bkGo').disabled = !b.day || !b.time || !ok;
}
function renderBk() { renderBkFormats(); renderBkDays(); renderBkSlots(); renderBkFiles(); renderBkLabel(); }
function addFiles(list) { S.bk.files.push(...[...list].map(f => ({ name: f.name, folder: fileCat(f.name) }))); renderBkFiles(); }
$('#bkEmail').addEventListener('input', renderBkLabel);
$('#bkFile').addEventListener('change', e => { addFiles(e.target.files); e.target.value = ''; });
const drop = $('#bkDrop');
drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('over'); });
drop.addEventListener('dragleave', () => drop.classList.remove('over'));
drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('over'); addFiles(e.dataTransfer.files); });
$('#bkGo').addEventListener('click', () => {
  const b = S.bk, fmt = FORMATS.find(f => f.id === b.format), dayObj = days.find(d => d.toDateString() === b.day), R = REGION[S.region];
  b.ref = 'CF-' + (1000 + Math.floor(Math.random() * 9000));
  const folders = {}; b.files.forEach(f => (folders[f.folder] = folders[f.folder] || []).push(f.name));
  const fl = Object.keys(folders).map(k => ({ name: k, files: folders[k].join(', '), count: folders[k].length }));
  if (!fl.length) fl.push({ name: 'No documents yet', files: 'You can add them from the confirmation email.', count: 0 });
  $('#bkDone').innerHTML = `<div class="k">Confirmed</div><h3>${esc(fmt.title)}</h3><div class="when">${dayObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} · ${b.time} ${R.tzShort}</div>
    <div class="k">Client file · ${b.ref} · ${esc($('#bkMatter').value)}</div>${fl.map(f => `<div class="fold"><span><strong>${esc(f.name)}</strong><small>${esc(f.files)}</small></span><b>${f.count}</b></div>`).join('')}
    <p style="font-size:14px;color:var(--w70);margin-top:18px">A calendar invitation will be sent to ${esc($('#bkEmail').value)}.</p>`;
  $('#bkForm').hidden = true; $('#bkDone').hidden = false;
  if (hasGsap && !reduce) gsap.from('#bkDone', { y: 30, opacity: 0, duration: .7, ease: 'power3.out' });
  refresh();
});

/* ============================== NAV / HELPERS ============================== */
function goTo(sel) {
  const el = $(sel); if (!el) return;
  if (hasGsap && window.ScrollToPlugin && !reduce) gsap.to(window, { scrollTo: { y: el, offsetY: 72 }, duration: 1.1, ease: 'power3.inOut' });
  else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const h = a.getAttribute('href'); if (h.length < 2) return;
  e.preventDefault(); goTo(h);
});

/* ============================== GSAP ============================== */
function splitWords(el) {
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'wm'; const i = document.createElement('span'); i.textContent = p; w.appendChild(i); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
  };
  walk(el);
  return $$('.wm > span', el);
}

function initMotion() {
  gsap.registerPlugin(ScrollTrigger, window.ScrollToPlugin);

  /* page progress rule */
  gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .2 } });

  /* hero: oversized section sign drifts and fades */
  gsap.set('#heroSect', { yPercent: -52 });
  gsap.to('#heroSect', { yPercent: -32, rotate: 6, scale: 1.12, opacity: .25, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-grid div', { scaleY: 0, transformOrigin: 'top', stagger: .08, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* word-by-word masked reveals for section titles */
  $$('.display.h2, .consult h2').forEach(h => {
    const words = splitWords(h);
    gsap.from(words, { yPercent: 115, duration: 1, ease: 'power4.out', stagger: .06, scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
  });

  /* fade-up reveals */
  ScrollTrigger.batch('[data-rv]', { start: 'top 90%', once: true, onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: .9, stagger: .12, ease: 'power3.out' }) });
  gsap.set('[data-rv]', { opacity: 0, y: 44 });

  /* marquee, speeds up with scroll velocity */
  const mq = gsap.to('#mq', { xPercent: -50, ease: 'none', duration: 28, repeat: -1 });
  ScrollTrigger.create({ onUpdate: s => { const v = Math.min(Math.abs(s.getVelocity()) / 250, 6); gsap.to(mq, { timeScale: 1 + v, duration: .2, overwrite: true }); gsap.to(mq, { timeScale: 1, duration: 1, delay: .2 }); } });

  /* statement: words light up as you read */
  const st = $('#stmt');
  const sw = splitWords(st);
  sw.forEach(s => { s.parentNode.classList.remove('wm'); s.parentNode.style.display = 'inline-block'; s.parentNode.classList.add('w'); });
  gsap.fromTo('#stmt .w', { opacity: .14 }, { opacity: 1, ease: 'none', stagger: .1, scrollTrigger: { trigger: st, start: 'top 80%', end: 'bottom 45%', scrub: .5 } });

  /* practice: pinned horizontal scroll */
  const track = $('#prTrack'), view = track.parentElement;
  const dist = () => Math.max(0, track.scrollWidth - view.clientWidth);
  gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: {
    trigger: '#practice', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .6, invalidateOnRefresh: true, anticipatePin: 1,
    onUpdate: s => { gsap.set('#prBar', { scaleX: s.progress }); $('#prNo').textContent = '0' + Math.min(4, Math.floor(s.progress * 3.999) + 1); }
  } });

  /* scales of justice: strokes draw, beam levels as you arrive */
  $$('#scalesSvg .dr').forEach(p => { p.style.strokeDasharray = 1; p.style.strokeDashoffset = 1; });
  gsap.to('#scalesSvg .dr', { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: .2, scrollTrigger: { trigger: '#scalesSvg', start: 'top 80%', once: true } });
  const tilt = { deg: 13 };
  const setTilt = () => {
    const r = tilt.deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r), L = 220;
    $('#beamG').setAttribute('transform', `rotate(${tilt.deg} 300 70)`);
    $('#panL').setAttribute('transform', `translate(${(300 - L * c) - 80} ${(70 - L * s) - 70})`);
    $('#panR').setAttribute('transform', `translate(${(300 + L * c) - 520} ${(70 + L * s) - 70})`);
  };
  setTilt();
  gsap.to(tilt, { deg: 0, ease: 'none', onUpdate: setTilt, scrollTrigger: { trigger: '#scalesSvg', start: 'top 75%', end: 'center 40%', scrub: 1 } });
  gsap.to({}, { duration: 1e9, repeat: -1, onUpdate() { if (tilt.deg === 0 && ScrollTrigger.isInViewport('#scalesSvg')) { tilt.deg = Math.sin(performance.now() / 900) * .8; setTilt(); tilt.deg = 0; } } });

  /* cases: earlier cards recede as the next slides over */
  const cs = $$('.case');
  cs.forEach((c, i) => { if (cs[i + 1]) gsap.to(c, { scale: .94, opacity: .55, ease: 'none', scrollTrigger: { trigger: cs[i + 1], start: 'top 85%', end: 'top 25%', scrub: true } }); });

  /* process: line draws, steps wake up */
  const steps = $$('.pstep');
  ScrollTrigger.create({ trigger: '#procLine', start: 'top 65%', end: 'bottom 70%', scrub: true,
    onUpdate: s => { gsap.set('#procFill', { scaleY: s.progress }); steps.forEach((el, i) => { el.style.opacity = s.progress >= i / 4 - 0.02 ? 1 : .3; }); } });

  /* tool cards entrance */
  gsap.from('.ev-grid, .chat, .form', { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'power3.inOut', scrollTrigger: { trigger: '.ev-grid', start: 'top 85%', once: true } });
}

function heroIntro() {
  if (!hasGsap || reduce) return;
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from('#heroTitle .mask > span', { yPercent: 115, duration: 1.3, stagger: .14 }, .1)
    .from('#heroSect', { scale: .8, opacity: 0, duration: 1.8 }, 0)
    .from('.hero-grid div', { scaleY: 0, transformOrigin: 'top', duration: 1.2, stagger: .08 }, 0)
    .from('[data-hero]', { y: 30, opacity: 0, duration: .9, stagger: .1 }, .5);
}

/* ============================== BOOT ============================== */
function unlock() {
  document.body.classList.remove('locked');
  const g = $('#gate'); g.remove();
  heroIntro();
  if (hasGsap) ScrollTrigger.refresh();
}
function enter() {
  try { sessionStorage.setItem('gateOk', '1'); } catch (e) {}
  const g = $('#gate');
  if (hasGsap && !reduce) { gsap.to(g, { opacity: 0, duration: .6, onComplete: unlock }); setTimeout(() => { if (document.getElementById('gate')) unlock(); }, 1200); } else unlock();
}
$('#enter').addEventListener('click', enter);

setRegion('IN'); renderEv(); renderQuiz(); renderTri(); renderBk();
if (hasGsap && !reduce) {
  const css = document.createElement('style');
  css.textContent = '.wm{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.14em;margin-bottom:-.14em}.wm>span{display:inline-block}.pstep{transition:opacity .4s}';
  document.head.appendChild(css);
  initMotion();
}
let passed = false; try { passed = sessionStorage.getItem('gateOk') === '1'; } catch (e) {}
if (passed) unlock();
window.addEventListener('load', () => hasGsap && ScrollTrigger.refresh());
})();
