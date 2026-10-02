import React from 'react';
export default function Program() {
  const { t } = useTranslation();
  return <div className="p-4">{t('program')}</div>;
}
