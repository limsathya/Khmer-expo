'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function Error({ error, reset }) {
  const { language } = useLanguage();

  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '540px',
        width: '100%',
        padding: 'clamp(28px, 5vw, 44px)',
        borderRadius: '24px',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        boxShadow: '0 12px 36px rgba(239, 68, 68, 0.15)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '2px solid rgba(239, 68, 68, 0.35)',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <AlertCircle size={32} />
        </div>

        <h1 style={{
          fontSize: 'clamp(1.35rem, 3vw, 1.75rem)',
          fontWeight: '800',
          color: 'var(--text-main)',
          marginBottom: '10px'
        }}>
          {language === 'km' 
            ? 'មានបញ្ហាមិនប្រក្រតីបានកើតឡើង' 
            : language === 'zh' 
            ? '发生系统错误' 
            : 'Something Went Wrong'}
        </h1>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          lineHeight: '1.6',
          marginBottom: '28px'
        }}>
          {language === 'km'
            ? 'ប្រព័ន្ធបានជួបប្រទះបញ្ហាបច្ចេកទេសបណ្តោះអាសន្ន។ សូមព្យាយាមម្តងទៀត ឬត្រឡប់ទៅទំព័រដើម។'
            : language === 'zh'
            ? '系统遇到了临时错误。请尝试刷新重试或返回首页。'
            : 'The application encountered an unexpected error. Please try again or return to the home page.'}
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => reset()}
            className="btn btn-primary"
          >
            <RotateCcw size={16} />
            <span>{language === 'km' ? 'ព្យាយាមម្តងទៀត' : language === 'zh' ? '重试' : 'Try Again'}</span>
          </button>
          <Link href="/" className="btn btn-secondary">
            <Home size={16} />
            <span>{language === 'km' ? 'ត្រឡប់ទៅទំព័រដើម' : language === 'zh' ? '返回首页' : 'Return Home'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
