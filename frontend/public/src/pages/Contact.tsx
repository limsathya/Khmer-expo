import React from 'react';
export default function Contact() {
  const { t } = useTranslation();
  return <div className="p-4">{t('contact')}</div>;
}
