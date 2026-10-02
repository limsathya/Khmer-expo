// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import km from './locales/km/translation.json';
import zh from './locales/zh/translation.json';

const SUPPORTED = ['en', 'km', 'zh'] as const;

function syncHtmlLang(lng: string) {
  const safe = (SUPPORTED as readonly string[]).includes(lng) ? lng : 'en';
  document.documentElement.lang = safe;
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    km: { translation: km },
    zh: { translation: zh },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

syncHtmlLang(i18n.language);
i18n.on('languageChanged', syncHtmlLang);

export default i18n;
