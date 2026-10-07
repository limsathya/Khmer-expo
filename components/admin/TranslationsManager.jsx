'use client';

import { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Check, 
  RefreshCw, 
  Edit3, 
  Save, 
  Filter, 
  Layers, 
  Sparkles 
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

function flattenObject(obj, prefix = '') {
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(result, flattenObject(obj[key], fullKey));
      } else {
        result[fullKey] = String(obj[key]);
      }
    }
  }
  return result;
}

export default function TranslationsManager({ showToast }) {
  const { language, refreshTranslations } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [baseTranslations, setBaseTranslations] = useState({ en: {}, km: {}, zh: {} });
  const [customTranslations, setCustomTranslations] = useState({ en: {}, km: {}, zh: {} });
  
  const [flatEn, setFlatEn] = useState({});
  const [flatKm, setFlatKm] = useState({});
  const [flatZh, setFlatZh] = useState({});

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingRowKey, setEditingRowKey] = useState(null);
  const [rowEdits, setRowEdits] = useState({ en: '', km: '', zh: '' });
  const [savingKey, setSavingKey] = useState(null);

  useEffect(() => {
    loadTranslationsData();
  }, []);

  async function loadTranslationsData() {
    setLoading(true);
    try {
      const res = await fetch('/api/translations');
      if (res.ok) {
        const data = await res.json();
        setBaseTranslations(data.base || {});
        setCustomTranslations(data.custom || { en: {}, km: {}, zh: {} });

        const fEn = flattenObject(data.base?.en || {});
        const fKm = flattenObject(data.base?.km || {});
        const fZh = flattenObject(data.base?.zh || {});

        // Merge custom overrides
        if (data.custom?.en) Object.assign(fEn, data.custom.en);
        if (data.custom?.km) Object.assign(fKm, data.custom.km);
        if (data.custom?.zh) Object.assign(fZh, data.custom.zh);

        setFlatEn(fEn);
        setFlatKm(fKm);
        setFlatZh(fZh);
      }
    } catch (err) {
      console.error('Error loading translations:', err);
    } finally {
      setLoading(false);
    }
  }

  const allKeys = Array.from(new Set([
    ...Object.keys(flatEn),
    ...Object.keys(flatKm),
    ...Object.keys(flatZh)
  ])).sort();

  const categories = [
    { key: 'all', label: 'All Keys' },
    { key: 'nav', label: 'Navigation (nav.*)' },
    { key: 'home', label: 'Home & Hero (home.*)' },
    { key: 'timeline', label: 'Timeline (timeline.*)' },
    { key: 'committee', label: 'Committees (committee.*)' },
    { key: 'categories', label: 'Categories (categories.*)' },
    { key: 'auth', label: 'Auth & Login (auth.*)' },
    { key: 'admin', label: 'Admin (admin.*)' }
  ];

  const filteredKeys = allKeys.filter(k => {
    if (selectedCategory !== 'all' && !k.startsWith(selectedCategory)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchKey = k.toLowerCase().includes(q);
      const matchEn = flatEn[k]?.toLowerCase().includes(q);
      const matchKm = flatKm[k]?.toLowerCase().includes(q);
      const matchZh = flatZh[k]?.toLowerCase().includes(q);
      if (!matchKey && !matchEn && !matchKm && !matchZh) return false;
    }
    return true;
  });

  const handleStartEdit = (key) => {
    setEditingRowKey(key);
    setRowEdits({
      en: flatEn[key] || '',
      km: flatKm[key] || '',
      zh: flatZh[key] || ''
    });
  };

  const handleSaveRow = async (key) => {
    setSavingKey(key);
    try {
      const [resEn, resKm, resZh] = await Promise.all([
        fetch('/api/translations', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lang: 'en', key, value: rowEdits.en })
        }),
        fetch('/api/translations', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lang: 'km', key, value: rowEdits.km })
        }),
        fetch('/api/translations', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lang: 'zh', key, value: rowEdits.zh })
        }),
      ]);

      if (resEn.ok && resKm.ok && resZh.ok) {
        setFlatEn(prev => ({ ...prev, [key]: rowEdits.en }));
        setFlatKm(prev => ({ ...prev, [key]: rowEdits.km }));
        setFlatZh(prev => ({ ...prev, [key]: rowEdits.zh }));
        setEditingRowKey(null);
        if (showToast) showToast(`Saved translations for "${key}" to DB!`);
        if (refreshTranslations) refreshTranslations();
      } else {
        if (showToast) showToast('Failed to save translation to DB', 'error');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Network error while saving translation', 'error');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
            {language === 'km' ? 'មជ្ឈមណ្ឌលបកប្រែពហុភាសា (Translations Manager)' : language === 'zh' ? '全站多语言字典实时编辑中心' : 'Multilingual Translations Manager'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            {language === 'km' 
              ? 'កែសម្រួលពាក្យ និងឃ្លាសម្រាប់ភាសាខ្មែរ, អង់គ្លេស, និងចិន។ រាល់ការកែប្រែនឹងត្រូវរក្សាទុកក្នុង Supabase DB និងអនុវត្តផ្ទាល់លើគេហទំព័រ។' 
              : language === 'zh' 
              ? '可视化检索与编辑高棉语、英语、中文全站词条。修改实时写入 Supabase 数据库，全站即刻生效。' 
              : 'Search and edit translation strings across Khmer, English, and Chinese. Changes persist to Supabase DB.'}
          </p>
        </div>

        <button
          onClick={loadTranslationsData}
          className="btn btn-secondary btn-sm"
        >
          <RefreshCw size={14} />
          <span>{language === 'km' ? 'ផ្ទុកទិន្នន័យឡើងវិញ' : language === 'zh' ? '重新载入' : 'Reload from DB'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={language === 'km' ? 'ស្វែងរកតាមកូដ Key ឬអត្ថបទបកប្រែ...' : language === 'zh' ? '搜索翻译词条 Key 或任何语言的文本内容...' : 'Search by translation key or text in any language...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '40px' }}
            />
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: selectedCategory === cat.key ? 'var(--primary)' : 'var(--border-subtle)',
                  background: selectedCategory === cat.key ? 'var(--primary)' : 'var(--btn-secondary-bg)',
                  color: selectedCategory === cat.key ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Translations Rows */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Showing {filteredKeys.length} translation keys</span>
          </div>

          {filteredKeys.map(k => {
            const isEditing = editingRowKey === k;

            return (
              <div
                key={k}
                className="glass-card"
                style={{
                  padding: '18px 22px',
                  borderLeft: isEditing ? '4px solid var(--primary)' : '4px solid transparent',
                  background: isEditing ? 'rgba(99, 102, 241, 0.05)' : undefined
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <code style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.12)', padding: '3px 8px', borderRadius: '6px' }}>
                    {k}
                  </code>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSaveRow(k)}
                          disabled={savingKey === k}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '5px 12px', fontSize: '0.8rem' }}
                        >
                          <Save size={13} />
                          <span>{savingKey === k ? 'Saving...' : 'Save to DB'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingRowKey(null)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(k)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Values in 3 Languages */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '14px' }}>
                  {/* Khmer */}
                  <div style={{ background: 'var(--btn-secondary-bg)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      🇰🇭 ភាសាខ្មែរ (Khmer)
                    </div>
                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={rowEdits.km}
                        onChange={(e) => setRowEdits(prev => ({ ...prev, km: e.target.value }))}
                        className="form-textarea"
                        style={{ fontSize: '0.85rem' }}
                      />
                    ) : (
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: '1.5', minHeight: '24px' }}>
                        {flatKm[k] || <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>None</span>}
                      </div>
                    )}
                  </div>

                  {/* English */}
                  <div style={{ background: 'var(--btn-secondary-bg)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      🇬🇧 English
                    </div>
                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={rowEdits.en}
                        onChange={(e) => setRowEdits(prev => ({ ...prev, en: e.target.value }))}
                        className="form-textarea"
                        style={{ fontSize: '0.85rem' }}
                      />
                    ) : (
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: '1.5', minHeight: '24px' }}>
                        {flatEn[k] || <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>None</span>}
                      </div>
                    )}
                  </div>

                  {/* Chinese */}
                  <div style={{ background: 'var(--btn-secondary-bg)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      🇨🇳 中文 (Chinese)
                    </div>
                    {isEditing ? (
                      <textarea
                        rows={2}
                        value={rowEdits.zh}
                        onChange={(e) => setRowEdits(prev => ({ ...prev, zh: e.target.value }))}
                        className="form-textarea"
                        style={{ fontSize: '0.85rem' }}
                      />
                    ) : (
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: '1.5', minHeight: '24px' }}>
                        {flatZh[k] || <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>None</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
