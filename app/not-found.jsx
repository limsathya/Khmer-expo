'use client';

import Link from 'next/link';
import { Home, Calendar, ArrowLeft, Compass } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

export default function NotFound() {
  const { language } = useLanguage();

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
        maxWidth: '560px',
        width: '100%',
        padding: 'clamp(28px, 5vw, 48px)',
        borderRadius: '24px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card-hover)'
      }}>
        <div style={{
          fontSize: '4.5rem',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: '1',
          marginBottom: '16px'
        }}>
          404
        </div>

        <h1 style={{
          fontSize: 'clamp(1.4rem, 3vw, 1.85rem)',
          fontWeight: '800',
          color: 'var(--text-main)',
          marginBottom: '12px',
          lineHeight: '1.3'
        }}>
          {language === 'km' 
            ? 'រកមិនឃើញទំព័រដែលអ្នកស្នើសុំឡើយ' 
            : language === 'zh' 
            ? '未找到所请求的页面' 
            : 'Page Not Found'}
        </h1>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          marginBottom: '32px'
        }}>
          {language === 'km'
            ? 'ទំព័រដែលអ្នកកំពុងព្យាយាមស្វែងរកប្រហែលជាត្រូវបានផ្លាស់ប្តូរ ឬមិនមាននៅក្នុងប្រព័ន្ធពិព័រណ៍ឡើយ។'
            : language === 'zh'
            ? '您尝试访问的页面可能已被移动或不存在。请返回首页或查看展会时间线。'
            : 'The page you are looking for might have been moved or does not exist. Please return home or browse the event timeline.'}
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <Link href="/" className="btn btn-primary">
            <Home size={16} />
            <span>{language === 'km' ? 'ត្រឡប់ទៅទំព័រដើម' : language === 'zh' ? '返回首页' : 'Return Home'}</span>
          </Link>
          <Link href="/timeline" className="btn btn-secondary">
            <Calendar size={16} />
            <span>{language === 'km' ? 'កាលវិភាគ Timeline' : language === 'zh' ? '展会时间线' : 'View Timeline'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
