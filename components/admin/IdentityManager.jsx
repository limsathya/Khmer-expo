'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Type, 
  Calendar, 
  MapPin, 
  Check, 
  RefreshCw, 
  Eye, 
  Layers,
  Award,
  Shield,
  Building,
  Flag
} from 'lucide-react';
import { useSettings } from '@/components/SettingsProvider';
import { useLanguage } from '@/components/LanguageProvider';

export default function IdentityManager({ showToast }) {
  const { expoConfig, updateSettings } = useSettings();
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    name: {
      en: expoConfig.name?.en || 'EXPO Week 2026',
      km: expoConfig.name?.km || 'សប្តាហ៍ពិព័រណ៍ ២០២៦',
      zh: expoConfig.name?.zh || '2026 世博周'
    },
    shortName: {
      en: expoConfig.shortName?.en || 'EXPO Week',
      km: expoConfig.shortName?.km || 'សប្តាហ៍ពិព័រណ៍',
      zh: expoConfig.shortName?.zh || '世博周'
    },
    tagline: {
      en: expoConfig.tagline?.en || 'Tech & Innovation Fair',
      km: expoConfig.tagline?.km || 'ពិព័រណ៍បច្ចេកវិទ្យា និងនវានុវត្តន៍',
      zh: expoConfig.tagline?.zh || '科技与创新博览会'
    },
    logoType: expoConfig.logoType || 'icon',
    logoIcon: expoConfig.logoIcon || 'Sparkles',
    logoText: expoConfig.logoText || 'E',
    logoUrl: expoConfig.logoUrl || '',
    datesBadge: {
      en: expoConfig.datesBadge?.en || 'October 12–14, 2026 • Phnom Penh Convention Center',
      km: expoConfig.datesBadge?.km || 'ថ្ងៃទី ១២–១៤ ខែតុលា ឆ្នាំ ២០២៦ • មជ្ឈមណ្ឌលសន្និបាតភ្នំពេញ',
      zh: expoConfig.datesBadge?.zh || '2026年10月12日至14日 • 金边国际会展中心'
    },
    datesRange: {
      en: expoConfig.datesRange?.en || 'October 12–14, 2026',
      km: expoConfig.datesRange?.km || 'ថ្ងៃទី ១២–១៤ ខែតុលា ឆ្នាំ ២០២៦',
      zh: expoConfig.datesRange?.zh || '2026年10月12日–14日'
    },
    venue: {
      en: expoConfig.venue?.en || 'Phnom Penh Convention Center',
      km: expoConfig.venue?.km || 'មជ្ឈមណ្ឌលសន្និបាតភ្នំពេញ',
      zh: expoConfig.venue?.zh || '金边国际会展中心'
    },
    heroTitle1: {
      en: expoConfig.heroTitle1?.en || 'EXPO Week',
      km: expoConfig.heroTitle1?.km || 'សប្តាហ៍ពិព័រណ៍',
      zh: expoConfig.heroTitle1?.zh || '世博周'
    },
    heroTitle2: {
      en: expoConfig.heroTitle2?.en || '2026',
      km: expoConfig.heroTitle2?.km || '២០២៦',
      zh: expoConfig.heroTitle2?.zh || '2026'
    },
    heroSubtitle: {
      en: expoConfig.heroSubtitle?.en || 'Three days of groundbreaking technology, global innovation, and creative discovery.',
      km: expoConfig.heroSubtitle?.km || 'បីថ្ងៃនៃបច្ចេកវិទ្យាឈានមុខគេ នវានុវត្តន៍សកល និងការរកឃើញប្រកបដោយភាពច្នៃប្រឌិត។',
      zh: expoConfig.heroSubtitle?.zh || '为期三天的前沿科技、全球创新与创意探索盛会。'
    }
  });

  const [saving, setSaving] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState('km'); // 'km' | 'en' | 'zh'

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ok = await updateSettings(formData);
      if (ok) {
        if (showToast) showToast('Expo Identity & Logo saved to DB and applied live across site!');
      } else {
        if (showToast) showToast('Failed to save settings', 'error');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Network error while saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
            {language === 'km' ? 'អត្តសញ្ញាណពិព័រណ៍ & ឡូហ្គោ (Expo Identity & Logo)' : language === 'zh' ? '世博名称、LOGO与品牌标识管理' : 'Expo Identity & Brand Logo Manager'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            {language === 'km' 
              ? 'កែសម្រួលឈ្មោះពិព័រណ៍ (ខ្មែរ, អង់គ្លេស, ចិន), រចនាប័ទ្មឡូហ្គោ, ពាក្យស្លោក, ទីតាំង និងអត្ថបទ Hero។ រក្សាទុកដោយផ្ទាល់ក្នុង Supabase DB។' 
              : language === 'zh' 
              ? '自定义世博名称（中英高棉三语）、LOGO展现形式（图标/文字/图片URL）、口号标语、举办场馆与主视觉文案，全部实时保存至数据库。' 
              : 'Customize Expo Name (Khmer, English, Chinese), Logo (Icon/Text/Image), Taglines, Dates & Hero texts in Supabase DB.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary btn-sm"
          style={{ padding: '9px 18px', fontWeight: '700' }}
        >
          <Check size={16} />
          <span>{saving ? 'Saving to DB...' : (language === 'km' ? 'រក្សាទុកការកំណត់ទៅ DB' : language === 'zh' ? '保存设置至数据库' : 'Save Identity to DB')}</span>
        </button>
      </div>

      {/* LIVE PREVIEW BANNER */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.1) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Eye size={14} />
          <span>{language === 'km' ? 'ការមើលជាមុនផ្ទាល់ (Live Brand Preview)' : language === 'zh' ? '实时品牌视觉预览' : 'Live Brand Preview'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Logo Preview */}
          {formData.logoType === 'image' && formData.logoUrl ? (
            <img 
              src={formData.logoUrl} 
              alt="Logo Preview" 
              style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}
            />
          ) : formData.logoType === 'text' ? (
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.4rem', fontWeight: '900', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}>
              {formData.logoText || 'E'}
            </div>
          ) : (
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}>
              <Sparkles size={24} />
            </div>
          )}

          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.2' }}>
              {formData.name[language] || formData.name.en}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: '600' }}>
              {formData.tagline[language] || formData.tagline.en} • {formData.venue[language] || formData.venue.en}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* LOGO CONFIGURATION */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--primary)" />
            <span>{language === 'km' ? 'ការកំណត់ឡូហ្គោ (Logo Settings)' : language === 'zh' ? 'LOGO 展现形式设置' : 'Logo Settings'}</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '20px' }}>
            {/* Logo Type Selector */}
            <div>
              <label className="form-label">{language === 'km' ? 'ទម្រង់ឡូហ្គោ' : language === 'zh' ? 'LOGO类型' : 'Logo Type'}</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { key: 'icon', label: 'Icon Sparkle', icon: Sparkles },
                  { key: 'text', label: 'Text Character', icon: Type },
                  { key: 'image', label: 'Custom Image URL', icon: ImageIcon }
                ].map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, logoType: opt.key }))}
                    style={{
                      flex: 1,
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: formData.logoType === opt.key ? 'var(--primary)' : 'var(--border-subtle)',
                      background: formData.logoType === opt.key ? 'var(--btn-secondary-bg)' : 'transparent',
                      color: formData.logoType === opt.key ? 'var(--primary)' : 'var(--text-muted)',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <opt.icon size={16} />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Field depending on Type */}
            {formData.logoType === 'text' && (
              <div>
                <label className="form-label">{language === 'km' ? 'តួអក្សរឡូហ្គោ (អតិបរមា ៣ តួ)' : language === 'zh' ? 'LOGO文字（最多3字）' : 'Logo Text / Monogram (max 3 chars)'}</label>
                <input
                  type="text"
                  maxLength={3}
                  value={formData.logoText}
                  onChange={(e) => setFormData(prev => ({ ...prev, logoText: e.target.value.toUpperCase() }))}
                  className="form-input"
                  style={{ fontWeight: '800', letterSpacing: '0.1em' }}
                />
              </div>
            )}

            {formData.logoType === 'image' && (
              <div>
                <label className="form-label">{language === 'km' ? 'តំណភ្ជាប់រូបភាពឡូហ្គោ URL' : language === 'zh' ? '图片LOGO网址 (URL)' : 'Logo Image URL'}</label>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                  className="form-input"
                />
              </div>
            )}
          </div>
        </div>

        {/* MULTILINGUAL IDENTITY SETTINGS */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
              {language === 'km' ? 'ឈ្មោះពិព័រណ៍ និងខ្លឹមសារពហុភាសា' : language === 'zh' ? '世博名称与多语言文案配置' : 'Expo Name & Multilingual Texts'}
            </h3>

            {/* Language Switch Tabs */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--btn-secondary-bg)', padding: '4px', borderRadius: '8px' }}>
              {[
                { key: 'km', label: '🇰🇭 ភាសាខ្មែរ (Khmer)' },
                { key: 'en', label: '🇬🇧 English' },
                { key: 'zh', label: '🇨🇳 中文 (Chinese)' }
              ].map(lt => (
                <button
                  key={lt.key}
                  type="button"
                  onClick={() => setActiveLangTab(lt.key)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeLangTab === lt.key ? 'var(--primary)' : 'transparent',
                    color: activeLangTab === lt.key ? '#fff' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {lt.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '18px' }}>
            {/* Full Expo Name */}
            <div>
              <label className="form-label">
                {language === 'km' ? 'ឈ្មោះពេញពិព័រណ៍' : language === 'zh' ? '完整世博名称' : 'Full Expo Name'} ({activeLangTab.toUpperCase()})
              </label>
              <input
                type="text"
                required
                value={formData.name[activeLangTab] || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: { ...prev.name, [activeLangTab]: e.target.value }
                }))}
                className="form-input"
              />
            </div>

            {/* Short Expo Name */}
            <div>
              <label className="form-label">
                {language === 'km' ? 'ឈ្មោះកាត់' : language === 'zh' ? '简短名称' : 'Short Name'} ({activeLangTab.toUpperCase()})
              </label>
              <input
                type="text"
                required
                value={formData.shortName[activeLangTab] || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  shortName: { ...prev.shortName, [activeLangTab]: e.target.value }
                }))}
                className="form-input"
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="form-label">
                {language === 'km' ? 'ពាក្យស្លោក' : language === 'zh' ? '标语/口号' : 'Tagline'} ({activeLangTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={formData.tagline[activeLangTab] || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  tagline: { ...prev.tagline, [activeLangTab]: e.target.value }
                }))}
                className="form-input"
              />
            </div>

            {/* Venue */}
            <div>
              <label className="form-label">
                {language === 'km' ? 'ទីតាំងរៀបចំពិព័រណ៍' : language === 'zh' ? '会展场馆名称' : 'Venue'} ({activeLangTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={formData.venue[activeLangTab] || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  venue: { ...prev.venue, [activeLangTab]: e.target.value }
                }))}
                className="form-input"
              />
            </div>

            {/* Dates Badge */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">
                {language === 'km' ? 'កាលបរិច្ឆេទ & ទីតាំងលើ Hero Badge' : language === 'zh' ? '主页顶部日期与场馆徽章' : 'Dates Badge (Hero Header)'} ({activeLangTab.toUpperCase()})
              </label>
              <input
                type="text"
                value={formData.datesBadge[activeLangTab] || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  datesBadge: { ...prev.datesBadge, [activeLangTab]: e.target.value }
                }))}
                className="form-input"
              />
            </div>

            {/* Hero Subtitle */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">
                {language === 'km' ? 'អត្ថបទពណ៌នាលើ Hero Subtitle' : language === 'zh' ? '主页大标题下副文本' : 'Hero Subtitle Description'} ({activeLangTab.toUpperCase()})
              </label>
              <textarea
                rows={3}
                value={formData.heroSubtitle[activeLangTab] || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  heroSubtitle: { ...prev.heroSubtitle, [activeLangTab]: e.target.value }
                }))}
                className="form-textarea"
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontWeight: '800' }}
          >
            <Check size={16} />
            <span>{saving ? 'Saving...' : (language === 'km' ? 'រក្សាទុកការកំណត់អត្តសញ្ញាណទាំងអស់' : language === 'zh' ? '保存所有品牌与名称设置' : 'Save All Identity Settings to DB')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
