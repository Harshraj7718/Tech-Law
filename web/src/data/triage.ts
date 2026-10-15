import type { Format, TriStep } from './types';

export const TRI: TriStep[] = [
  { q: 'Are you looking to register a new brand, protect software or AI, resolve an infringement notice, or draft a commercial IP agreement?', key: 'need', o: ['Register a new brand', 'Protect software / AI', 'Resolve an infringement notice', 'Draft a commercial IP agreement'] },
  { q: 'Which best describes your stage of business?', key: 'stage', o: ['Idea stage', 'Early-stage startup', 'Enterprise', 'Creator'] },
  { q: 'Which jurisdictions are involved? Select all that apply.', key: 'juris', o: ['India', 'UK', 'EU', 'US'], multi: true },
  { q: 'Is there a critical deadline we should know about?', key: 'deadline', o: ['Product launch within 30 days', 'Active opposition or notice received', 'Funding round or deal closing', 'No hard deadline'] },
  { q: 'Last step — where should Bipasha reply?', key: 'email' }
];
export const PREP: Record<string, string[]> = {
  'Register a new brand': ['Proposed name(s) and logo drafts', 'Goods or services and launch markets', 'Any existing use, domains or handles'],
  'Protect software / AI': ['Contractor and employee agreements', 'List of open-source components and AI APIs', 'Non-confidential product architecture summary'],
  'Resolve an infringement notice': ['The notice or letter received, with its date', 'Evidence of your first use', 'Any prior correspondence'],
  'Draft a commercial IP agreement': ['Counterparty details and deal summary', 'Existing term sheet or draft', 'IP being licensed in or out']
};
export const MATTER: Record<string, string> = { 'Register a new brand': 'Trademark clearance & filing', 'Protect software / AI': 'Software & AI rights', 'Resolve an infringement notice': 'Infringement / cease-and-desist', 'Draft a commercial IP agreement': 'Commercial IP agreement' };
export const MATTERS = ['Trademark clearance & filing', 'Software & AI rights', 'Copyright & licensing', 'Infringement / cease-and-desist', 'Commercial IP agreement', 'Cross-border enforcement'];
export const FORMATS: Format[] = [
  { id: 'screen', title: '15-Minute Preliminary IP Screening', dur: '15 min · Video', desc: 'A quick read on one question — registrability, a notice received, or where to start.' },
  { id: 'full', title: 'Full Strategy Consultation', dur: '60 min · Video', desc: 'A full review of your IP position across markets, with a written action plan.' }
];
