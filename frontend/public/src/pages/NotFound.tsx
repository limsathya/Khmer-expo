import { useTranslation } from 'react-i18next';
export default function NotFound() {
  const { t } = useTranslation();
  return <div className="p-4 text-center text-red-600">{t('notfound')}</div>;
}
