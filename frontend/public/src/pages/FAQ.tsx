import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const { t } = useTranslation();
  return <div className="p-4">{t('faq')}</div>;
}
