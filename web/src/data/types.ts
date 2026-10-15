export type RegionCode = 'IN' | 'UK';

export interface RegionInfo {
  city: string; tm: string; ai: string; cr: string; en: string;
  tz: string; tzShort: string; slots: string[];
}

export interface NiceClass { n: string; label: string; why: string }
export interface Flag { term: string; note: string }
export interface Assessment {
  name: string; ind: string; lv: number; level: string; pot: string; note: string;
  risk: 'Low' | 'Medium' | 'High'; flags: Flag[]; classes: NiceClass[]; summary: [string, string][];
}

export interface QuizQuestion { q: string; area: string; o: [string, number][]; v: string }

export type TriKey = 'need' | 'stage' | 'juris' | 'deadline' | 'email';
export interface TriStep { q: string; key: TriKey; o?: string[]; multi?: boolean }
export type TriAnswers = Partial<Record<TriKey, string>>;

export interface Format { id: 'screen' | 'full'; title: string; dur: string; desc: string }
export interface Article { id: number; tag: string; date: string; title: string; kw: string[]; summary: string }
export interface BookedFile { name: string; folder: string }
