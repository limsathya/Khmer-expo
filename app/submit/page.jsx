'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  Layers, 
  Compass, 
  Flag, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Tag, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { useSettings } from '@/components/SettingsProvider';
import { SUB_COMMITTEES, getDefaultSubCommitteeForCategory, getSubCommitteeLocalizedName } from '@/lib/committees';

export default function SubmitProposalPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading, login } = useAuth();
  const { t, language } = useLanguage();
  const { getTimelineDays, categories } = useSettings();
  const timelineDays = getTimelineDays();

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [subCommittees, setSubCommittees] = useState(SUB_COMMITTEES);

  useEffect(() => {
    fetch('/api/committees')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data.subCommittees) && data.subCommittees.length > 0) {
          setSubCommittees(data.subCommittees);
        }
      })
      .catch(() => {});
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'booth',
    subCommittee: getDefaultSubCommitteeForCategory('booth'),
    date: timelineDays[0]?.date || '2026-10-12',
    time: '10:00',
    endTime: '16:00',
    location: 'Exhibition Hall B',
    boothNumber: 'B-',
    organizer: '',
    contactUsername: '',
    tags: 'Innovation, Tech'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat) {
        setFormData(prev => ({
          ...prev,
          category: cat,
          subCommittee: getDefaultSubCommitteeForCategory(cat)
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        organizer: prev.organizer || user.name || '',
        contactUsername: prev.contactUsername || user.username || ''
      }));
    }
  }, [user]);

  const [submitting, setSubmitting] = useState(false);
  const [successEvent, setSuccessEvent] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleInlineAdminLogin(e) {
    if (e) e.preventDefault();
    setAdminAuthError('');
    setAdminAuthLoading(true);
    try {
      const loggedUser = await login(adminUsername, adminPassword);
      if (loggedUser.role !== 'admin' && loggedUser.role !== 'sub_committee') {
        setAdminAuthError(language === 'km' ? 'គណនីនេះមិនមានសិទ្ធិអ្នកគ្រប់គ្រងទេ។' : language === 'zh' ? '登录的账号未具备管理员权限。' : 'Logged in account does not have administrator privileges.');
      }
    } catch (err) {
      setAdminAuthError(err.message || 'Login failed');
    } finally {
      setAdminAuthLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim()) {
      setErrorMsg(language === 'km' ? 'សូមបញ្ចូលចំណងជើងព្រឹត្តិការណ៍ ឬស្តង់។' : language === 'zh' ? '请提供活动或展位名称。' : 'Please provide a title for the event or booth.');
      return;
    }
    if (!formData.organizer.trim()) {
      setErrorMsg(language === 'km' ? 'សូមបញ្ជាក់ឈ្មោះក្រុមហ៊ុន ឬអ្នកតាំងពិព័រណ៍។' : language === 'zh' ? '请指定组织或展商名称。' : 'Please specify the organization or exhibitor name.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          contactUsername: formData.contactUsername || user?.username,
          contactEmail: formData.contactUsername || user?.username
        })
      });

      if (res.ok) {
        const created = await res.json();
        setSuccessEvent(created);
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to submit proposal.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error while submitting proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  // If checking authentication
  if (authLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>
          {language === 'km' ? 'កំពុងផ្ទៀងផ្ទាត់សិទ្ធិអ្នកគ្រប់គ្រង...' : language === 'zh' ? '正在验证管理员权限...' : 'Checking administrator credentials...'}
        </p>
      </div>
    );
  }

  // If user is not admin, show Admin Authentication Screen
  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '540px', margin: '60px auto', padding: '0 24px' }}>
        <div className="glass-panel" style={{ padding: '40px 32px', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Lock size={32} />
          </div>

          <span className="badge-status badge-rejected" style={{ marginBottom: '14px' }}>
            <ShieldCheck size={12} /> {t('submit.adminOnlyNotice', 'Admin Event Creator')}
          </span>

          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
            {t('submit.adminGateTitle', 'Administrator Access Required')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.6' }}>
            {t('submit.adminGateDesc', 'Event and booth proposal submission is restricted to event administrators and committee managers.')}
          </p>

          {/* Admin Login Form */}
          <form onSubmit={handleInlineAdminLogin} style={{ background: 'var(--btn-secondary-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <ShieldCheck size={15} color="var(--primary)" />
              <span>{language === 'km' ? 'ចូលប្រើប្រព័ន្ធគ្រប់គ្រង' : language === 'zh' ? '登录管理系统' : 'Sign In to Submit'}</span>
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '4px' }}>{t('auth.usernameLabel', 'Username')}</label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={e => setAdminUsername(e.target.value)}
                placeholder="Username"
                className="form-input"
                style={{ fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '4px' }}>{t('auth.passwordLabel', 'Password')}</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ fontSize: '0.875rem' }}
              />
            </div>
            <button
              type="submit"
              disabled={adminAuthLoading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px 14px', fontWeight: '700', marginTop: '6px' }}
            >
              <LogIn size={15} />
              <span>
                {adminAuthLoading 
                  ? t('auth.signingIn', 'Authenticating...') 
                  : (language === 'km' ? 'ចូលប្រើប្រាស់' : language === 'zh' ? '立即登录' : 'Sign In')}
              </span>
            </button>
          </form>

          {adminAuthError && (
            <div style={{ background: 'var(--status-rejected-bg)', border: '1px solid var(--status-rejected-border)', color: 'var(--status-rejected)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
              {adminAuthError}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <Link href="/" className="btn btn-secondary btn-sm">
              {language === 'km' ? 'ត្រឡប់ទៅទំព័រដើម' : language === 'zh' ? '返回首页' : 'Return to Homepage'}
            </Link>
            <Link href="/login" className="btn btn-outline btn-sm">
              <LogIn size={14} />
              <span>{t('auth.signInLink', 'Login Page')}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (successEvent) {
    return (
      <div style={{ maxWidth: '640px', margin: '60px auto', padding: '0 24px' }}>
        <div className="glass-panel" style={{ padding: '40px 32px', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--status-approved-bg)',
            border: '2px solid var(--status-approved-border)',
            color: 'var(--status-approved)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <CheckCircle2 size={32} />
          </div>

          <span className="badge-status badge-pending" style={{ marginBottom: '16px' }}>
            {t('statuses.pending')}
          </span>

          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px' }}>
            {t('submit.successTitle')}
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '28px' }}>
            <strong>"{successEvent.title}"</strong> {t('submit.successDesc')}
          </p>

          <div className="glass-panel" style={{ padding: '16px', background: 'var(--btn-secondary-bg)', textAlign: 'left', fontSize: '0.85rem', marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ color: 'var(--text-main)' }}><strong>{t('submit.fieldCategory')}:</strong> {successEvent.category.toUpperCase()}</div>
            <div style={{ color: 'var(--text-main)' }}><strong>{t('timeline.detailsModal.schedule')}:</strong> {successEvent.date} ({successEvent.time} – {successEvent.endTime})</div>
            <div style={{ color: 'var(--text-main)' }}><strong>{t('timeline.detailsModal.location')}:</strong> {successEvent.location} ({t('timeline.boothCode')}: {successEvent.boothNumber})</div>
            <div style={{ color: 'var(--text-main)' }}><strong>{t('timeline.detailsModal.organizer')}:</strong> {successEvent.organizer}</div>
            <div style={{ color: 'var(--text-main)', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', marginTop: '2px' }}>
              <strong>{t('timeline.detailsModal.managingCommittee')}:</strong> 🏛️ {successEvent.subCommittee || 'Booths & Exhibition'}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/admin" className="btn btn-primary">
              <ShieldCheck size={16} />
              <span>{t('submit.reviewInAdmin')}</span>
            </Link>
            <Link href="/timeline" className="btn btn-secondary">
              <Calendar size={16} />
              <span>{t('submit.viewTimeline')}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 clamp(12px, 3vw, 24px)' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 14px',
          borderRadius: '9999px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: 'var(--status-approved)',
          fontSize: '0.8rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          marginBottom: '14px'
        }}>
          <ShieldCheck size={14} /> {t('submit.adminOnlyNotice', 'Admin Event Creator')} • {user?.name || user?.username || 'Admin'}
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px', lineHeight: 'var(--line-height-heading)', letterSpacing: 'var(--letter-spacing-heading)', wordBreak: 'break-word' }}>
          {t('submit.title')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto', lineHeight: 'var(--line-height-base)' }}>
          {t('submit.subtitle')}
        </p>
      </div>

      <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 36px)' }}>
        {errorMsg && (
          <div style={{ background: 'var(--status-rejected-bg)', border: '1px solid var(--status-rejected-border)', borderRadius: '10px', padding: '12px 16px', color: 'var(--status-rejected)', fontSize: '0.875rem', marginBottom: '24px' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Title */}
          <div>
            <label className="form-label">{t('submit.fieldTitle')} *</label>
            <input
              type="text"
              name="title"
              required
              placeholder={t('submit.fieldTitlePlaceholder')}
              value={formData.title}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Category */}
          <div>
            <label className="form-label">{t('submit.fieldCategory')} *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '12px' }}>
              {categories.map(cat => {
                const isSelected = formData.category === cat.key;
                const localName = cat.name?.[language] || cat.name?.en || cat.key;
                const color = cat.color || '#6366f1';
                return (
                  <button
                    type="button"
                    key={cat.key}
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      category: cat.key,
                      subCommittee: cat.defaultSubCommittee || getDefaultSubCommitteeForCategory(cat.key)
                    }))}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: isSelected ? color : 'var(--border-subtle)',
                      background: isSelected ? `${color}26` : 'var(--btn-secondary-bg)',
                      color: isSelected ? color : 'var(--text-muted)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '0.9rem', color: isSelected ? color : 'var(--text-main)', marginBottom: '4px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{cat.emoji || '📌'}</span>
                      <span style={{ wordBreak: 'break-word' }}>{localName}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-Committee Routing */}
          <div>
            <label className="form-label">{t('submit.fieldSubCommittee')} *</label>
            <select
              name="subCommittee"
              value={formData.subCommittee}
              onChange={handleChange}
              className="form-select"
              style={{ width: '100%' }}
            >
              {subCommittees.map(sc => (
                <option key={sc.id || sc.key} value={sc.key}>
                  {sc.lead?.avatar || '🎪'} {getSubCommitteeLocalizedName(sc.key, language)} — ({t('committee.leadTitle')}: {sc.lead?.name || 'Lead'})
                </option>
              ))}
            </select>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '6px' }}>
              {t('submit.subCommitteeHelp')}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="form-label">{t('submit.fieldDescription')} *</label>
            <textarea
              name="description"
              rows={4}
              required
              placeholder={t('submit.fieldDescriptionPlaceholder')}
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          {/* Date & Time Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '16px' }}>
            <div>
              <label className="form-label">{t('submit.fieldDate')}</label>
              <select name="date" value={formData.date} onChange={handleChange} className="form-select">
                {timelineDays && timelineDays.length > 0 ? (
                  timelineDays.map((td, idx) => (
                    <option key={td.dayNumber || idx} value={td.date}>
                      {td.label?.[language] || `Day ${td.dayNumber || idx + 1}`}: {td.date}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="2026-10-12">{language === 'km' ? 'ថ្ងៃទី ១: តុលា ១២, ២០២៦' : language === 'zh' ? '第1天: 2026年10月12日' : 'Day 1: Oct 12, 2026'}</option>
                    <option value="2026-10-13">{language === 'km' ? 'ថ្ងៃទី ២: តុលា ១៣, ២០២៦' : language === 'zh' ? '第2天: 2026年10月13日' : 'Day 2: Oct 13, 2026'}</option>
                    <option value="2026-10-14">{language === 'km' ? 'ថ្ងៃទី ៣: តុលា ១៤, ២០២៦' : language === 'zh' ? '第3天: 2026年10月14日' : 'Day 3: Oct 14, 2026'}</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="form-label">{t('submit.fieldStartTime')}</label>
              <input
                type="text"
                name="time"
                placeholder="10:00"
                value={formData.time}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">{t('submit.fieldEndTime')}</label>
              <input
                type="text"
                name="endTime"
                placeholder="16:00"
                value={formData.endTime}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Location & Booth Number Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px' }}>
            <div>
              <label className="form-label">{t('submit.fieldLocation')}</label>
              <input
                type="text"
                name="location"
                placeholder={t('submit.fieldLocationPlaceholder')}
                value={formData.location}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">{t('submit.fieldBooth')}</label>
              <input
                type="text"
                name="boothNumber"
                placeholder={t('submit.fieldBoothPlaceholder')}
                value={formData.boothNumber}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Organizer & Submitter Username Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px' }}>
            <div>
              <label className="form-label">{t('submit.fieldOrganizer')} *</label>
              <input
                type="text"
                name="organizer"
                required
                placeholder={t('submit.fieldOrganizerPlaceholder')}
                value={formData.organizer}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">{t('submit.fieldUsername', 'Submitter Username')}</label>
              <input
                type="text"
                name="contactUsername"
                placeholder={t('submit.fieldUsernamePlaceholder', 'e.g. admin or booth_lead')}
                value={formData.contactUsername}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="form-label">{t('submit.fieldTags')}</label>
            <input
              type="text"
              name="tags"
              placeholder={t('submit.fieldTagsPlaceholder')}
              value={formData.tags}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <Link href="/" className="btn btn-secondary">
              {t('submit.cancelBtn')}
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.95rem' }}
            >
              {submitting ? t('submit.submitting') : t('submit.submitBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
