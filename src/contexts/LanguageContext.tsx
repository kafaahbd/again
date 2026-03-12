"use client";
import { createContext, useState, useContext, type ReactNode } from 'react';
import { content } from '../data/content';

interface LanguageContextType {
  lang: 'en' | 'bn';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'bn' : 'en');
  const t = (key: string) => {
    return content[lang][key] || content.en[key] || key;
  };
  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};