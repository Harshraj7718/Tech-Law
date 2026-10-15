import type { RegionCode, RegionInfo } from './types';

export const REGION: Record<RegionCode, RegionInfo> = {
  IN: { city: 'Bengaluru → World', tm: 'Prosecution before the Trade Marks Registry, India', ai: 'Aligned to the IT Act, 2000 and the DPDP Act, 2023', cr: 'Under the Copyright Act, 1957', en: 'Indian Patent Office as PCT receiving office; High Court enforcement', tz: 'IST, with UK hours on request', tzShort: 'IST', slots: ['10:00', '11:30', '14:00', '16:30'] },
  UK: { city: 'London → World', tm: 'Prosecution before the UK Intellectual Property Office', ai: 'Aligned to UK GDPR and s.9(3) CDPA 1988', cr: 'Under the Copyright, Designs and Patents Act 1988', en: 'UKIPO as PCT receiving office; IPEC and High Court', tz: 'GMT, with IST hours on request', tzShort: 'GMT', slots: ['09:30', '11:00', '13:30', '15:00'] }
};
