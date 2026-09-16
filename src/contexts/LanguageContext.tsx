import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('agriseva_language');
      if (saved === 'hi' || saved === 'en' || saved === 'mr' || saved === 'pa') {
        return saved as LanguageCode;
      }
    } catch {
      // restricted environments
    }
    return 'hi';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('agriseva_language', lang);
    } catch {
      // restricted environments
    }
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'agriseva_language' && e.newValue) {
        if (['hi', 'en', 'mr', 'pa'].includes(e.newValue)) {
          setLanguageState(e.newValue as LanguageCode);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
