import React, { createContext, useContext, useState } from "react";

interface DemoContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
  runDemo: () => void;
}

const DemoContext = createContext<DemoContextType>({} as DemoContextType);
export const useDemo = () => useContext(DemoContext);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const toggleDemoMode = () => setIsDemoMode(prev => !prev);

  const runDemo = () => {
    setDemoStep(1);
    setTimeout(() => setDemoStep(2), 2000);
    setTimeout(() => setDemoStep(3), 4000);
    setTimeout(() => setDemoStep(4), 6000);
    setTimeout(() => setDemoStep(0), 8000);
  };

  return (
    <DemoContext.Provider value={{ isDemoMode, toggleDemoMode, demoStep, setDemoStep, runDemo }}>
      {children}
    </DemoContext.Provider>
  );
};
