import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Format } from '../data/types';

/** Shared so the evaluator, quiz and triage can pre-fill the booking form. */
interface Ctx {
  format: Format['id']; setFormat: (f: Format['id']) => void;
  matter: string; setMatter: (m: string) => void;
  email: string; setEmail: (e: string) => void;
}
const BookCtx = createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [format, setFormat] = useState<Format['id']>('full');
  const [matter, setMatter] = useState('Trademark clearance & filing');
  const [email, setEmail] = useState('');
  return <BookCtx.Provider value={{ format, setFormat, matter, setMatter, email, setEmail }}>{children}</BookCtx.Provider>;
}

export function useBooking() {
  const c = useContext(BookCtx);
  if (!c) throw new Error('useBooking must be used inside BookingProvider');
  return c;
}
