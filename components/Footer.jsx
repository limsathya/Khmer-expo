'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useSettings } from '@/components/SettingsProvider';

export default function Footer() {
  const { t, language } = useLanguage();
  const { expoConfig, getExpoName } = useSettings();

  return (
    <footer className="glass-header" style={{
      borderTop: '1px solid var(--border-subtle)',
      marginTop: '80px',
      padding: '40px 24px',
      background: 'var(--header-bg)',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '30px', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={18} color="#818cf8" />
            <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#fff' }}>
              {getExpoName(language)}
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: '420px', lineHeight: 'var(--line-height-base)' }}>
            {t('footer.desc')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '20px', fontSize: '0.875rem', flexWrap: 'wrap', lineHeight: 'var(--line-height-base)' }}>
          <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>{t('nav.overview')}</Link>
          <Link href="/timeline" style={{ color: '#94a3b8', textDecoration: 'none' }}>{t('nav.timeline')}</Link>
          <Link href="/committee" style={{ color: '#94a3b8', textDecoration: 'none' }}>{t('nav.committees')}</Link>
          <Link href="/submit" style={{ color: '#94a3b8', textDecoration: 'none' }}>{t('nav.submitEvent')}</Link>
          <Link href="/admin" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: '600' }}>{t('nav.admin')}</Link>
        </div>

        <div style={{ color: '#64748b', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>{t('footer.copyright')}</span>
        </div>
      </div>
    </footer>
  );
}
