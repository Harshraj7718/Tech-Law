import type { Assessment } from '../data/types';

const MAP: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const esc = (t: string) => t.replace(/[&<>"]/g, c => MAP[c]);

export function downloadReport(r: Assessment) {
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const rows = (a: string[][]) => a.map(x => '<tr><td>' + esc(x[0]) + '</td><td>' + esc(x[1]) + '</td></tr>').join('');
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
  if (w) { w.document.write(html); w.document.close(); setTimeout(() => { try { w.focus(); w.print(); } catch { /* ignore */ } }, 800); }
  else { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' })); a.download = 'Preliminary-Assessment-' + r.name.replace(/\W+/g, '-') + '.html'; a.click(); }
}
