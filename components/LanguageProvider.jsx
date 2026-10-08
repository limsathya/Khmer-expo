'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, AVAILABLE_LANGUAGES, getNestedTranslation, normalizeLanguageCode } from '@/lib/translations';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
  languages: AVAILABLE_LANGUAGES,
  currentLanguage: AVAILABLE_LANGUAGES[0],
  customTranslations: { en: {}, km: {}, zh: {} },
  updateTranslation: async () => {},
  refreshTranslations: async () => {},
  mounted: false,
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');
  const [mounted, setMounted] = useState(false);
  const [customTranslations, setCustomTranslations] = useState({ en: {}, km: {}, zh: {} });

  const getLocaleAttr = (lang) => {
    if (lang === 'km') return 'km-KH';
    if (lang === 'zh') return 'zh-CN';
    return 'en-US';
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('expo_lang');
      const normalized = normalizeLanguageCode(saved);
      setLanguageState(normalized);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = getLocaleAttr(normalized);
        document.documentElement.setAttribute('data-lang', normalized);
        document.cookie = `expo_lang=${normalized}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch (e) {
      // ignore
    }
    setMounted(true);
    fetchCustomTranslations();
  }, []);

  async function fetchCustomTranslations() {
    try {
      const res = await fetch('/api/translations');
      if (res.ok) {
        const data = await res.json();
        if (data.custom) {
          setCustomTranslations(data.custom);
        }
      }
    } catch (err) {
      console.warn('Could not fetch custom translations from DB:', err);
    }
  }

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = getLocaleAttr(language);
      document.documentElement.setAttribute('data-lang', language);
      document.cookie = `expo_lang=${language}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [language]);

  const setLanguage = (newLang) => {
    const normalized = normalizeLanguageCode(newLang);
    setLanguageState(normalized);
    try {
      localStorage.setItem('expo_lang', normalized);
      if (typeof document !== 'undefined') {
        document.cookie = `expo_lang=${normalized}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch (e) {
      // ignore
    }
  };

  const t = (path, fallback = '') => {
    // 1. Check custom DB overrides for current language (flat key)
    if (customTranslations[language] && customTranslations[language][path] !== undefined) {
      return customTranslations[language][path];
    }
    // 1b. Check nested custom DB overrides
    const customNested = getNestedTranslation(customTranslations[language] || {}, path);
    if (customNested !== null && customNested !== undefined) {
      return customNested;
    }

    // 2. Check base translations for current language
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let val = getNestedTranslation(langDict, path);
    if (val !== null && val !== undefined) {
      return val;
    }

    // 3. Fallback to custom DB overrides for English
    if (customTranslations.en && customTranslations.en[path] !== undefined) {
      return customTranslations.en[path];
    }
    const customEnNested = getNestedTranslation(customTranslations.en || {}, path);
    if (customEnNested !== null && customEnNested !== undefined) {
      return customEnNested;
    }

    // 4. Fallback to base English
    val = getNestedTranslation(TRANSLATIONS.en, path);
    if (val !== null && val !== undefined) {
      return val;
    }

    return fallback || path;
  };

  const updateTranslation = async (lang, key, value) => {
    setCustomTranslations(prev => ({
      ...prev,
      [lang]: {
        ...(prev[lang] || {}),
        [key]: value
      }
    }));

    try {
      const res = await fetch('/api/translations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang, key, value })
      });
      if (res.ok) {
        return true;
      }
    } catch (err) {
      console.error('Failed to save translation to DB:', err);
    }
    return false;
  };

  const currentLanguage = AVAILABLE_LANGUAGES.find(l => l.code === language) || AVAILABLE_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      languages: AVAILABLE_LANGUAGES,
      currentLanguage,
      customTranslations,
      updateTranslation,
      refreshTranslations: fetchCustomTranslations,
      mounted,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
