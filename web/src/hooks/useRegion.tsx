import { createContext, useContext, useState, type ReactNode } from 'react';
import type { RegionCode, RegionInfo } from '../data/types';
import { REGION } from '../data/region';

interface Ctx { code: RegionCode; info: RegionInfo; setCode: (c: RegionCode) => void }
const RegionCtx = createContext<Ctx | null>(null);

export function RegionProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<RegionCode>('IN');
  return <RegionCtx.Provider value={{ code, info: REGION[code], setCode }}>{children}</RegionCtx.Provider>;
}

export function useRegion() {
  const c = useContext(RegionCtx);
  if (!c) throw new Error('useRegion must be used inside RegionProvider');
  return c;
}
