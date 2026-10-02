import { useTranslation } from 'react-i18next';
export default function Home() {
  const { t } = useTranslation();
  return <div className="p-4">{t('welcome')}</div>;
}
