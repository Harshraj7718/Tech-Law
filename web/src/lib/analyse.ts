import { CROWD, DICT, IND } from '../data/brand';
import type { Assessment } from '../data/types';

const LV = ['Generic', 'Descriptive', 'Suggestive', 'Arbitrary', 'Fanciful'];
const POT = ['Not registrable', 'Low registrability potential', 'High registrability potential', 'Very high registrability potential', 'Strongest registrability potential'];
const NOTE = [
  'The name is the common term for the goods or services themselves. It cannot function as a trade mark in any market.',
  'The name directly describes what you offer. Expect examiner objections in India and the UK unless acquired distinctiveness can be shown.',
  'The name hints at the offering without describing it — registrable, and a strong commercial balance.',
  'A real word used out of context. Highly distinctive and registrable.',
  'An invented word with no prior meaning — the strongest category of mark.'
];
const cap = (w: string) => (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1));

export function analyse(name: string, ind: string): Assessment {
  const I = IND[ind];
  const s = name.toLowerCase().replace(/[^a-z]/g, '');
  const has = (w: string) => (w.length <= 2 ? s.startsWith(w) || s.endsWith(w) : s.includes(w));
  const dh = I.desc.filter(has), ah = DICT.filter(w => s.includes(w)), cr = CROWD.filter(has);
  const rest = dh.reduce((a, w) => a.replace(w, ''), s).length;
  const lv = I.desc.includes(s) || I.desc.includes(s.replace(/s$/, '')) ? 0 : dh.length && rest <= 2 ? 1 : dh.length ? 2 : ah.length ? 3 : 4;
  const pts = cr.length * 2 + (s.length <= 5 ? 1 : 0) + (lv <= 1 ? 2 : 0);
  const risk = pts <= 1 ? 'Low' : pts <= 3 ? 'Medium' : 'High';
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
