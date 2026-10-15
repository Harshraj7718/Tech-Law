import type { QuizQuestion } from './types';

export const QUIZ: QuizQuestion[] = [
  { q: 'Do you have written IP assignment agreements with all developers and contractors?', area: 'Ownership of code & designs', o: [['Yes, with everyone', 20], ['Some, not all', 8], ['No / not sure', 0]], v: 'Work created by contractors can legally belong to them, not your company — a common due-diligence failure.' },
  { q: 'Have you registered your core brand marks in every country you operate or sell in?', area: 'Brand protection', o: [['Yes, all target markets', 20], ['Home market only', 10], ['Not yet filed', 0]], v: 'Unregistered markets leave your brand open to squatters and first-to-file claims.' },
  { q: 'Does your product incorporate open-source code or third-party AI APIs?', area: 'Software & AI licensing', o: [['Yes — licences reviewed', 20], ['Yes — not reviewed', 4], ['No', 20]], v: 'Unreviewed copyleft licences or AI API terms can restrict commercial use or ownership of output.' },
  { q: 'Do you sign NDAs before sharing product, code or roadmap with partners or investors?', area: 'Confidentiality', o: [['Always', 20], ['Sometimes', 10], ['Rarely', 0]], v: 'Disclosure without confidentiality terms weakens trade-secret protection.' },
  { q: 'Have you secured matching domain names and social handles for your brand?', area: 'Digital presence', o: [['Yes, all key ones', 20], ['Main domain only', 12], ['No', 0]], v: 'Missing domains and handles invite cybersquatting and impersonation.' }
];
