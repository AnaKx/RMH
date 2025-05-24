'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type WizardData = Record<string, any>;
const WizardContext = createContext<{
  data: WizardData;
  save: (step: number, values: any) => void;
}>({ data: {}, save: () => {} });

export function WizardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WizardData>({});
  const save = (step: number, values: any) =>
    setData((d) => ({ ...d, [step]: values }));
  return (
    <WizardContext.Provider value={{ data, save }}>
      {children}
    </WizardContext.Provider>
  );
}

export const useWizard = () => useContext(WizardContext);