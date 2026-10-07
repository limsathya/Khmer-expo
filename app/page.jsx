'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  PlusCircle, 
  Cpu, 
  Flag, 
  Compass,
  Users
} from 'lucide-react';

import { useLanguage } from '@/components/LanguageProvider';
import { useSettings } from '@/components/SettingsProvider';

export default function HomePage() {
  const { t, language } = useLanguage();
  const { expoConfig, getCategoryMeta, categories } = useSettings();
  const [stats, setStats] = useState(null);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, eventsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/events?status=approved')
        ]);
        if (statsRes.ok) {
          const sData = await statsRes.json();
          setStats(sData);
        }
        if (eventsRes.ok) {
          const eData = await eventsRes.json();
          setFeaturedEvents(eData.filter(e => e.featured).slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getCategoryBadge = (category) => {
    const meta = getCategoryMeta(category, language);
    return (
      <span 
        className="badge-category"
        style={{
          background: meta.bg,
          color: meta.color,
          border: `1px solid ${meta.border}`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        <span>{meta.emoji || '📌'}</span>
        <span>{meta.label}</span>
      </span>
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(24px, 4vw, 40px) clamp(12px, 3vw, 24px)' }}>
      {/* Hero Section */}
      <section className="motion-fade-up" style={{ textAlign: 'center', padding: '60px 0 40px', position: 'relative' }}>
        <div className="motion-pulse-glow" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 18px',
          borderRadius: '9999px',
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          color: 'var(--primary)',
          fontSize: '0.85rem',
          fontWeight: '700',
          marginBottom: '24px',
          backdropFilter: 'blur(12px)'
        }}>
          <Sparkles size={16} />
          <span>{expoConfig.datesBadge?.[language] || t('home.datesBadge')}</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 4rem)',
          fontWeight: '800',
          lineHeight: 'var(--line-height-heading)',
          letterSpacing: 'var(--letter-spacing-heading)',
          marginBottom: '20px',
          color: 'var(--text-main)',
          wordBreak: 'break-word',
        }}>
          {expoConfig.heroTitle1?.[language] || t('home.heroTitle1')} <br />
          <span className="gradient-text">{expoConfig.heroTitle2?.[language] || t('home.heroTitle2')}</span>
        </h1>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '1.15rem',
          maxWidth: '680px',
          margin: '0 auto 36px',
          lineHeight: '1.6'
        }}>
          {expoConfig.heroSubtitle?.[language] || t('home.heroSubtitle')}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link href="/timeline" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1rem' }}>
            <Calendar size={18} />
            <span>{t('home.viewTimelineBtn')}</span>
            <ArrowRight size={16} />
          </Link>
          <Link href="/admin" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '1rem' }}>
            <ShieldCheck size={18} color="var(--primary)" />
            <span>{t('nav.admin')}</span>
          </Link>
          <Link href="/submit" className="btn btn-outline" style={{ padding: '12px 20px', fontSize: '1rem' }}>
            <PlusCircle size={18} />
            <span>{t('home.submitProposalBtn')}</span>
          </Link>
        </div>
      </section>

      {/* KPI Stats Bar */}
      <section style={{ margin: '40px 0 60px' }}>
        <div className="glass-panel" style={{
          padding: 'clamp(16px, 3vw, 28px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Layers size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>
                {stats ? stats.approved : '...'}
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t('home.stats.totalEvents')}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--status-pending-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-pending)' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--status-pending)' }}>
                {stats ? stats.pending : '...'}
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t('admin.tabs.pending')}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
              <Cpu size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>
                {stats ? stats.booths : '...'}
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t('home.stats.techBooths')}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9333ea' }}>
              <Compass size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>
                {stats ? stats.activities : '...'}
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: '600' }}>{t('home.stats.activities')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Highlights */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
              {t('home.featuredTitle')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {t('home.featuredSubtitle')}
            </p>
          </div>
          <Link href="/timeline" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <span>{t('home.exploreAll')}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {featuredEvents.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
            {featuredEvents.map(event => (
              <div key={event.id} className="glass-card" style={{ padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    {getCategoryBadge(event.category)}
                    <span style={{ fontSize: '0.75rem', color: 'var(--status-approved)', background: 'var(--status-approved-bg)', border: '1px solid var(--status-approved-border)', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
                      {t('timeline.boothCode')} {event.boothNumber}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '10px', lineHeight: 'var(--line-height-heading)' }}>
                    {event.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 'var(--line-height-base)', marginBottom: '18px' }}>
                    {event.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '0.8rem', fontWeight: '600' }}>
                    <Calendar size={14} color="var(--primary)" />
                    <span>{new Date(event.date + 'T00:00:00').toLocaleDateString(language === 'km' ? 'km-KH' : language === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric', weekday: 'short' })}</span>
                    <span style={{ color: 'var(--text-dim)' }}>•</span>
                    <Clock size={14} color="var(--primary)" />
                    <span>{event.time} – {event.endTime}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <MapPin size={14} color="#06b6d4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '40px 24px', textAlign: 'center', borderRadius: '18px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📅</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
              {language === 'km' ? 'មិនទាន់មានព្រឹត្តិការណ៍លេចធ្លោនៅឡើយទេ' : language === 'zh' ? '暂无精选活动' : 'No Featured Events Yet'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 20px', lineHeight: '1.6' }}>
              {language === 'km' 
                ? 'ព្រឹត្តិការណ៍នឹងបង្ហាញនៅទីនេះ នៅពេលគណៈកម្មការអនុម័តសំណើ ឬអ្នកគ្រប់គ្រងបង្កើតព្រឹត្តិការណ៍ថ្មី។'
                : language === 'zh'
                ? '当委员会审核通过提案或管理员发布新活动后，精选活动将在此处展示。'
                : 'Approved proposals and featured milestones will appear here as soon as they are published by committees.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/timeline" className="btn btn-secondary btn-sm">
                <Calendar size={14} />
                <span>{language === 'km' ? 'មើលកាលវិភាគ Timeline' : language === 'zh' ? '查看时间线' : 'View Timeline'}</span>
              </Link>
              <Link href="/login" className="btn btn-primary btn-sm">
                <span>{language === 'km' ? 'ចូលប្រព័ន្ធគ្រប់គ្រង' : language === 'zh' ? '登录管理系统' : 'Sign In to Dashboard'}</span>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Expo Workflow Banner */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.10) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        padding: 'clamp(20px, 4vw, 36px) clamp(16px, 3vw, 32px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        gap: '30px',
        alignItems: 'center'
      }}>
        <div>
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '6px',
            background: 'rgba(99, 102, 241, 0.18)',
            color: 'var(--primary)',
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            Expo Administration
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px' }}>
            {t('home.ctaTitle')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
            {t('home.ctaSubtitle')}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/admin" className="btn btn-primary btn-sm">
              <ShieldCheck size={16} />
              <span>{t('nav.admin')}</span>
            </Link>
            <Link href="/submit" className="btn btn-secondary btn-sm">
              <PlusCircle size={16} />
              <span>{t('home.ctaButton')}</span>
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: '800' }}>1</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>{t('committee.step1Title')}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('committee.step1Desc')}</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--status-pending-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-pending)', fontWeight: '800' }}>2</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>{t('committee.step2Title')}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('committee.step2Desc')}</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--status-approved-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-approved)', fontWeight: '800' }}>3</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>{t('committee.step3Title')}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('committee.step3Desc')}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
