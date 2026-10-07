'use client';

import { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  Check, 
  X, 
  Layers, 
  Sparkles, 
  Palette, 
  Building,
  Calendar,
  Smile
} from 'lucide-react';
import { useSettings } from '@/components/SettingsProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { SUB_COMMITTEES, MAIN_COMMITTEE, getSubCommitteeLocalizedName } from '@/lib/committees';

const ALL_COMMITTEES = [
  MAIN_COMMITTEE,
  ...SUB_COMMITTEES
];

const PRESET_EMOJIS = ['🎪', '🎯', '🏆', '💡', '🍽️', '🔬', '🎨', '🕹️', '🎵', '🤖', '💼', '🌿'];
const PRESET_COLORS = [
  '#0284c7', // Sky Blue
  '#9333ea', // Purple
  '#d97706', // Amber
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#ef4444'  // Red
];

export default function CategoriesManager({ showToast }) {
  const { categories, addCategory, updateCategory, deleteCategory, refreshCategories } = useSettings();
  const { language, t } = useLanguage();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [fallbackTargetKey, setFallbackTargetKey] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    key: '',
    nameEn: '',
    nameKm: '',
    nameZh: '',
    descEn: '',
    descKm: '',
    descZh: '',
    emoji: '🎪',
    color: '#0284c7',
    defaultSubCommittee: 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management'
  });

  function openCreateModal() {
    setFormData({
      key: '',
      nameEn: '',
      nameKm: '',
      nameZh: '',
      descEn: '',
      descKm: '',
      descZh: '',
      emoji: '🎪',
      color: '#0284c7',
      defaultSubCommittee: 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management'
    });
    setIsCreateModalOpen(true);
  }

  function openEditModal(cat) {
    setEditingCategory(cat);
    setFormData({
      key: cat.key,
      nameEn: cat.name?.en || '',
      nameKm: cat.name?.km || '',
      nameZh: cat.name?.zh || '',
      descEn: cat.description?.en || '',
      descKm: cat.description?.km || '',
      descZh: cat.description?.zh || '',
      emoji: cat.emoji || '📌',
      color: cat.color || '#0284c7',
      defaultSubCommittee: cat.defaultSubCommittee || 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management'
    });
  }

  function openDeleteModal(cat) {
    setDeletingCategory(cat);
    // Find first other category to default fallback to
    const other = categories.find(c => c.key !== cat.key);
    setFallbackTargetKey(other ? other.key : '');
  }

  async function handleSaveCategory(e) {
    e.preventDefault();
    if (!formData.nameEn.trim()) {
      showToast('English name is required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        key: formData.key.trim().toLowerCase(),
        name: {
          en: formData.nameEn.trim(),
          km: formData.nameKm.trim() || formData.nameEn.trim(),
          zh: formData.nameZh.trim() || formData.nameEn.trim()
        },
        description: {
          en: formData.descEn.trim(),
          km: formData.descKm.trim(),
          zh: formData.descZh.trim()
        },
        emoji: formData.emoji.trim() || '📌',
        color: formData.color,
        defaultSubCommittee: formData.defaultSubCommittee
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id || editingCategory.key, payload);
        showToast(
          language === 'km' 
            ? `ប្រភេទ "${payload.name.km}" ត្រូវបានកែប្រែដោយជោគជ័យ!` 
            : language === 'zh'
            ? `分类 "${payload.name.zh}" 更新成功！`
            : `Category "${payload.name.en}" updated successfully!`
        );
        setEditingCategory(null);
      } else {
        await addCategory(payload);
        showToast(
          language === 'km'
            ? `ប្រភេទថ្មី "${payload.name.km}" ត្រូវបានបង្កើតជោគជ័យ!`
            : language === 'zh'
            ? `新分类 "${payload.name.zh}" 创建成功！`
            : `Category "${payload.name.en}" created successfully!`
        );
        setIsCreateModalOpen(false);
      }
    } catch (err) {
      showToast(err.message || 'Error saving category', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteCategory() {
    if (!deletingCategory) return;
    setSubmitting(true);
    try {
      await deleteCategory(deletingCategory.id || deletingCategory.key, fallbackTargetKey);
      showToast(
        language === 'km'
          ? `បានលុបប្រភេទ "${deletingCategory.name?.[language] || deletingCategory.key}" ដោយជោគជ័យ!`
          : language === 'zh'
          ? `已成功删除分类 "${deletingCategory.name?.[language] || deletingCategory.key}"！`
          : `Category "${deletingCategory.name?.en || deletingCategory.key}" deleted successfully!`
      );
      setDeletingCategory(null);
    } catch (err) {
      showToast(err.message || 'Error deleting category', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
              {language === 'km' ? 'គ្រប់គ្រងប្រភេទព្រឹត្តិការណ៍ (Categories)' : language === 'zh' ? '活动与展位分类管理' : 'Event Categories & Classifications'}
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--btn-secondary-bg)', padding: '2px 8px', borderRadius: '6px' }}>
              {categories.length} {language === 'km' ? 'ប្រភេទ' : language === 'zh' ? '个类别' : 'categories'}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {language === 'km' 
              ? 'អាចបន្ថែម លុប និងប្តូរឈ្មោះប្រភេទទាំងអស់។ ទិន្នន័យត្រូវបានរក្សាទុកក្នុង Supabase DB ព្រមទាំងគាំទ្រ ៣ ភាសា (ខ្មែរ អង់គ្លេស ចិន)។'
              : language === 'zh'
              ? '支持新增、删除与重命名所有分类。数据实时同步至 Supabase 数据库，全量支持中英柬三语及关联分委员会。'
              : 'Add, delete, and rename event categories. Fully trilingual (Khmer, English, Chinese) and synchronized with Supabase DB.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={openCreateModal} className="btn btn-primary btn-sm">
            <Plus size={15} />
            <span>{language === 'km' ? 'បន្ថែមប្រភេទថ្មី' : language === 'zh' ? '新增分类' : 'Add Category'}</span>
          </button>
          <button onClick={refreshCategories} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} />
            <span>{t('admin.refreshBtn', 'Refresh')}</span>
          </button>
        </div>
      </div>

      {/* Categories Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '22px' }}>
        {categories.map((cat) => {
          const color = cat.color || '#0284c7';
          const localName = cat.name?.[language] || cat.name?.en || cat.key;
          const otherNames = [
            language !== 'en' && cat.name?.en ? `EN: ${cat.name.en}` : null,
            language !== 'km' && cat.name?.km ? `ខ្មែរ: ${cat.name.km}` : null,
            language !== 'zh' && cat.name?.zh ? `中文: ${cat.name.zh}` : null
          ].filter(Boolean).join(' • ');

          const localDesc = cat.description?.[language] || cat.description?.en || '';
          const commName = getSubCommitteeLocalizedName(cat.defaultSubCommittee, language) || cat.defaultSubCommittee;

          return (
            <div
              key={cat.id || cat.key}
              className="glass-card"
              style={{
                padding: '24px',
                borderTop: `4px solid ${color}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              <div>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '1.6rem',
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: `${color}1f`,
                      border: `1px solid ${color}4d`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {cat.emoji || '📌'}
                    </span>
                    <div>
                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: color,
                        fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase'
                      }}>
                        key: {cat.key}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <span style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: color,
                          display: 'inline-block'
                        }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                          {color}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Event Count Badge */}
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    background: `${color}1f`,
                    color: color,
                    border: `1px solid ${color}4d`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Calendar size={12} />
                    <span>{cat.eventCount || 0} {language === 'km' ? 'ព្រឹត្តិការណ៍' : language === 'zh' ? '个活动' : 'events'}</span>
                  </span>
                </div>

                {/* Localized Category Title */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px', lineHeight: '1.3' }}>
                  {localName}
                </h3>

                {/* Multilingual sub-titles */}
                {otherNames && (
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-dim)', marginBottom: '12px', lineHeight: '1.4' }}>
                    {otherNames}
                  </div>
                )}

                {/* Description */}
                {localDesc && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '16px' }}>
                    {localDesc}
                  </p>
                )}

                {/* Target Subcommittee assignment */}
                <div style={{
                  background: 'var(--btn-secondary-bg)',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <Building size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
                      {language === 'km' ? 'គណៈកម្មការទទួលបន្ទុកលំនាំដើម' : language === 'zh' ? '默认主管分委员会' : 'Default Assigned Committee'}
                    </div>
                    <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {commName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions row */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '14px',
                marginTop: '10px'
              }}>
                <button
                  onClick={() => openEditModal(cat)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit3 size={13} />
                  <span>{language === 'km' ? 'កែប្រែ / ប្តូរឈ្មោះ' : language === 'zh' ? '编辑 / 重命名' : 'Edit / Rename'}</span>
                </button>
                <button
                  onClick={() => openDeleteModal(cat)}
                  disabled={categories.length <= 1}
                  className="btn btn-outline btn-sm"
                  style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}
                  title={categories.length <= 1 ? 'Cannot delete the only category' : 'Delete category'}
                >
                  <Trash2 size={13} />
                  <span>{language === 'km' ? 'លុប' : language === 'zh' ? '删除' : 'Delete'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE & EDIT MODAL */}
      {(isCreateModalOpen || editingCategory) && (
        <div className="modal-overlay" onClick={() => { setIsCreateModalOpen(false); setEditingCategory(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}>
                  {editingCategory ? <Edit3 size={20} /> : <Plus size={20} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {editingCategory 
                      ? (language === 'km' ? 'កែប្រែ & ប្តូរឈ្មោះប្រភេទ' : language === 'zh' ? '编辑与重命名分类' : 'Edit & Rename Category') 
                      : (language === 'km' ? 'បង្កើតប្រភេទព្រឹត្តិការណ៍ថ្មី' : language === 'zh' ? '创建新活动分类' : 'Create New Event Category')}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
                    {editingCategory
                      ? (language === 'km' ? 'ប្រសិនបើប្តូរឈ្មោះ Key រាល់ព្រឹត្តិការណ៍ចាស់ៗនឹងត្រូវបានអាប់ដេតស្វ័យប្រវត្តក្នុង DB' : language === 'zh' ? '如果修改标识 Key，数据库中所有属于旧标识的活动将自动级联同步' : 'Renaming machine key will automatically cascade update all existing events in DB')
                      : (language === 'km' ? 'កំណត់ឈ្មោះជា ៣ ភាសា និមិត្តសញ្ញា និងពណ៌' : language === 'zh' ? '设置三语名称、专属 Emoji 及主题色彩' : 'Configure trilingual names, emoji, and theme color')}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setIsCreateModalOpen(false); setEditingCategory(null); }} 
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Machine Key & Emoji Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '14px' }}>
                <div>
                  <label className="form-label">
                    {language === 'km' ? 'កូដសម្គាល់ម៉ាស៊ីន (Machine Key)' : language === 'zh' ? '系统唯一标识 (Machine Key)' : 'Machine Key (Slug)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                    className="form-input"
                    placeholder="e.g. workshop, esports, booth"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    {language === 'km' ? 'អក្សរតូច និងសញ្ញា _ (ឧ. workshop)' : language === 'zh' ? '小写英文字母与下划线（如 workshop）' : 'Lowercase letters & underscores only'}
                  </div>
                </div>

                <div>
                  <label className="form-label">
                    {language === 'km' ? 'រូប Emoji' : language === 'zh' ? '图标 Emoji' : 'Emoji Icon'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.emoji}
                    onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                    className="form-input"
                    style={{ textAlign: 'center', fontSize: '1.4rem' }}
                  />
                </div>
              </div>

              {/* Quick Preset Emoji Selector */}
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {language === 'km' ? 'ជ្រើសរើស Emoji រហ័ស៖' : language === 'zh' ? '快速选择 Emoji：' : 'Quick Emoji Suggestions:'}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PRESET_EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setFormData({ ...formData, emoji: em })}
                      style={{
                        width: '36px',
                        height: '36px',
                        fontSize: '1.25rem',
                        borderRadius: '8px',
                        border: formData.emoji === em ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                        background: formData.emoji === em ? 'rgba(99, 102, 241, 0.2)' : 'var(--btn-secondary-bg)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trilingual Names */}
              <div style={{ background: 'var(--btn-secondary-bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🌐</span>
                  <span>{language === 'km' ? 'ឈ្មោះជា ៣ ភាសា (Trilingual Names)' : language === 'zh' ? '三语显示名称' : 'Trilingual Category Names'}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label className="form-label">
                      🇬🇧 English Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="form-input"
                      placeholder="e.g. Workshop & Seminar"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      🇰🇭 ភាសាខ្មែរ (Khmer Name)
                    </label>
                    <input
                      type="text"
                      value={formData.nameKm}
                      onChange={(e) => setFormData({ ...formData, nameKm: e.target.value })}
                      className="form-input"
                      placeholder="ឧ. សិក្ខាសាលា & ការបណ្តុះបណ្តាល"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      🇨🇳 中文 (Chinese Name)
                    </label>
                    <input
                      type="text"
                      value={formData.nameZh}
                      onChange={(e) => setFormData({ ...formData, nameZh: e.target.value })}
                      className="form-input"
                      placeholder="例：研讨会与实操工作坊"
                    />
                  </div>
                </div>
              </div>

              {/* Color Picker & Presets */}
              <div>
                <label className="form-label">
                  {language === 'km' ? 'ពណ៌សម្គាល់ (Theme Color)' : language === 'zh' ? '主题色彩 (Color)' : 'Theme Color'}
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    style={{ width: '42px', height: '42px', padding: '2px', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--border-subtle)', background: 'transparent' }}
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="form-input"
                    style={{ width: '120px', fontFamily: 'var(--font-mono)' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c })}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: c,
                        border: formData.color === c ? '3px solid #fff' : '2px solid transparent',
                        cursor: 'pointer',
                        boxShadow: formData.color === c ? '0 0 0 2px var(--primary)' : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Default Assigned Committee */}
              <div>
                <label className="form-label">
                  {language === 'km' ? 'គណៈកម្មការទទួលបន្ទុកលំនាំដើម' : language === 'zh' ? '默认主管分委员会' : 'Default Assigned Committee'}
                </label>
                <select
                  value={formData.defaultSubCommittee}
                  onChange={(e) => setFormData({ ...formData, defaultSubCommittee: e.target.value })}
                  className="form-select"
                >
                  {ALL_COMMITTEES.map((comm) => (
                    <option key={comm.key || comm.id} value={comm.key || comm.name}>
                      {getSubCommitteeLocalizedName(comm.key || comm.id, language) || comm.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Trilingual Description Accordion */}
              <div>
                <label className="form-label">
                  {language === 'km' ? 'ការពិពណ៌នាខ្លី (English Description)' : language === 'zh' ? '简介说明 (English Description)' : 'Description (English)'}
                </label>
                <input
                  type="text"
                  value={formData.descEn}
                  onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                  className="form-input"
                  placeholder="Short description of this category..."
                />
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => { setIsCreateModalOpen(false); setEditingCategory(null); }}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  {t('admin.modalCancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ minWidth: '130px' }}
                >
                  {submitting ? 'Saving...' : (editingCategory ? (language === 'km' ? 'រក្សាទុកការកែប្រែ' : language === 'zh' ? '保存更改' : 'Save Changes') : (language === 'km' ? 'បង្កើតប្រភេទ' : language === 'zh' ? '创建分类' : 'Create Category'))}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingCategory && (
        <div className="modal-overlay" onClick={() => setDeletingCategory(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Trash2 size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {language === 'km' ? 'បញ្ជាក់ការលុបប្រភេទ' : language === 'zh' ? '确认删除该分类' : 'Confirm Category Deletion'}
                </h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {deletingCategory.name?.[language] || deletingCategory.name?.en || deletingCategory.key} ({deletingCategory.emoji})
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px' }}>
              {language === 'km'
                ? `តើអ្នកប្រាកដជាចង់លុបប្រភេទ "${deletingCategory.name?.km || deletingCategory.key}" នេះឬ? ប្រសិនបើមានព្រឹត្តិការណ៍ដែលកំពុងប្រើប្រាស់ប្រភេទនេះ សូមជ្រើសរើសប្រភេទថ្មីដើម្បីផ្ទេរទៅ។`
                : language === 'zh'
                ? `您确定要永久删除分类 "${deletingCategory.name?.zh || deletingCategory.key}" 吗？如果当前有活动属于此分类，请选择重新归属的备选分类。`
                : `Are you sure you want to delete category "${deletingCategory.name?.en || deletingCategory.key}"? Any existing events linked to it will be safely reassigned.`}
            </p>

            {deletingCategory.eventCount > 0 && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '16px',
                borderRadius: '10px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f59e0b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={16} />
                  <span>
                    {language === 'km' 
                      ? `មាន ${deletingCategory.eventCount} ព្រឹត្តិការណ៍កំពុងប្រើប្រាស់ប្រភេទនេះ!` 
                      : language === 'zh'
                      ? `当前有 ${deletingCategory.eventCount} 个活动使用此分类！`
                      : `Notice: ${deletingCategory.eventCount} event(s) currently use this category!`}
                  </span>
                </div>

                <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
                  {language === 'km' ? 'ផ្ទេរព្រឹត្តិការណ៍ទាំងនេះទៅកាន់ប្រភេទ៖' : language === 'zh' ? '将这些活动重新指派归属至：' : 'Reassign these events to:'}
                </label>
                <select
                  value={fallbackTargetKey}
                  onChange={(e) => setFallbackTargetKey(e.target.value)}
                  className="form-select"
                >
                  {categories.filter(c => c.key !== deletingCategory.key).map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.emoji} {c.name?.[language] || c.name?.en || c.key}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="btn btn-secondary"
                disabled={submitting}
              >
                {t('admin.modalCancel', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
                disabled={submitting}
                className="btn btn-outline"
                style={{ background: '#ef4444', color: '#fff', borderColor: '#ef4444', minWidth: '120px' }}
              >
                {submitting ? 'Deleting...' : (language === 'km' ? 'បញ្ជាក់ការលុប' : language === 'zh' ? '确认删除' : 'Delete Category')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
