import React from 'react';
export default function About() {
  const { t } = useTranslation();
  return <div className="p-4">{t('about')}</div>;
}
