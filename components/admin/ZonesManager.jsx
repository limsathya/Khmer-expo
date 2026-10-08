'use client';

import { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  RotateCcw, 
  Users, 
  Sparkles,
  Layers,
  ArrowUp,
  ArrowDown,
  Building,
  Info
} from 'lucide-react';
import { useSettings } from '@/components/SettingsProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { DEFAULT_ZONES } from '@/lib/expo-config';

export default function ZonesManager({ showToast }) {
  const { expoConfig, updateSettings, getZones } = useSettings();
  const { t, language } = useLanguage();

  const [zones, setZones] = useState(
    Array.isArray(expoConfig.zones) && expoConfig.zones.length > 0
      ? expoConfig.zones
      : DEFAULT_ZONES
  );

  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalData, setModalData] = useState({
    id: '',
    code: '',
    icon: '🏛️',
    color: '#6366f1',
    capacity: '',
    name: { en: '', km: '', zh: '' },
    description: { en: '', km: '', zh: '' }
  });

  const EMOJI_OPTIONS = ['🏛️', '🎪', '🍲', '🎯', '💼', '🤝', '📍', '🏢', '🎙️', '🏆', '🌐', '📦'];
  const COLOR_OPTIONS = ['#6366f1', '#0284c7', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

  const openCreateModal = () => {
    setEditingIndex(null);
    const nextNum = zones.length + 1;
    setModalData({
      id: `zone-${Date.now()}`,
      code: `ZONE-${nextNum}`,
      icon: '🏛️',
      color: '#6366f1',
      capacity: '500',
      name: {
        en: `Exhibition Zone ${nextNum}`,
        km: `តំបន់ពិព័រណ៍ទី ${nextNum}`,
        zh: `第${nextNum}展区`
      },
      description: {
        en: 'Dedicated zone for curated displays and presentations.',
        km: 'តំបន់សម្រាប់ស្តង់តាំងពិព័រណ៍ និងការធ្វើបទបង្ហាញ។',
        zh: '用于特色展示与现场演示的专属区域。'
      }
    });
    setIsModalOpen(true);
  };

  const openEditModal = (zone, index) => {
    setEditingIndex(index);
    setModalData({
      id: zone.id || `zone-${index}`,
      code: zone.code || '',
      icon: zone.icon || '🏛️',
      color: zone.color || '#6366f1',
      capacity: zone.capacity || '',
      name: {
        en: zone.name?.en || '',
        km: zone.name?.km || '',
        zh: zone.name?.zh || ''
      },
      description: {
        en: zone.description?.en || '',
        km: zone.description?.km || '',
        zh: zone.description?.zh || ''
      }
    });
    setIsModalOpen(true);
  };

  const handleModalSave = (e) => {
    e.preventDefault();
    if (!modalData.code.trim()) {
      if (showToast) showToast('Zone code is required', 'error');
      return;
    }

    const updated = [...zones];
    if (editingIndex !== null) {
      updated[editingIndex] = modalData;
    } else {
      updated.push(modalData);
    }

    setZones(updated);
    setIsModalOpen(false);
  };

  const handleRemoveZone = (index) => {
    if (zones.length <= 1) {
      if (showToast) showToast('Must keep at least 1 zone/hall', 'error');
      return;
    }
    const zoneName = zones[index]?.name?.[language] || zones[index]?.name?.en || zones[index]?.code;
    if (confirm(`Remove "${zoneName}"?`)) {
      setZones(zones.filter((_, i) => i !== index));
    }
  };

  const handleMove = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= zones.length) return;
    const copy = [...zones];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setZones(copy);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset to standard expo halls & zones?')) {
      setZones(DEFAULT_ZONES);
    }
  };

  const handleSaveToDB = async () => {
    setSaving(true);
    try {
      const ok = await updateSettings({ zones });
      if (ok) {
        if (showToast) showToast(language === 'km' ? 'បានរក្សាទុកទីតាំង & សាលពិព័រណ៍ទៅ DB ដោយជោគជ័យ!' : language === 'zh' ? '展区与展厅设置已成功保存至数据库！' : 'Zones & Halls saved to database successfully!');
      } else {
        if (showToast) showToast('Failed to save zones to database', 'error');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Error saving zones to DB', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={20} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
                {language === 'km' ? 'គ្រប់គ្រងទីតាំង & សាលពិព័រណ៍ (Requested Zone / Hall)' : language === 'zh' ? '申请区域与展厅管理（Requested Zone / Hall）' : 'Requested Zone / Hall Manager'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                {language === 'km'
                  ? 'កំណត់សាលពិព័រណ៍ តំបន់ស្តង់ និងទីតាំងផ្លូវការ។ ជម្រើសទាំងនេះនឹងបង្ហាញដោយផ្ទាល់ក្នុងទម្រង់ស្នើសុំ (Submit Proposal) និងប្រព័ន្ធ Admin។'
                  : language === 'zh'
                  ? '自定义设置展区、主展厅与室外活动场地。配置结果将实时同步至参展提案申请表与管理员活动管理后台。'
                  : 'Configure exhibition halls, zones, and pavilions. Directly powers the "Requested Zone / Hall" dropdown on proposals and admin events.'}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="btn btn-secondary btn-sm"
            title="Reset to default expo zones"
          >
            <RotateCcw size={14} />
            <span>{language === 'km' ? 'កំណត់លំនាំដើម' : language === 'zh' ? '恢复默认' : 'Reset Defaults'}</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="btn btn-secondary btn-sm"
          >
            <Plus size={15} />
            <span>{language === 'km' ? '+ បន្ថែមសាល/តំបន់ថ្មី' : language === 'zh' ? '+ 添加新展区/展厅' : '+ Add Zone/Hall'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveToDB}
            disabled={saving}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: '700' }}
          >
            <Check size={16} />
            <span>{saving ? 'Saving...' : (language === 'km' ? 'រក្សាទុកទីតាំងទាំងអស់ទៅ DB' : language === 'zh' ? '保存全部区域至数据库' : 'Save Zones to DB')}</span>
          </button>
        </div>
      </div>

      {/* Info Notice Banner */}
      <div style={{
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: '12px',
        padding: '14px 18px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.85rem',
        color: 'var(--text-main)'
      }}>
        <Info size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <strong>{language === 'km' ? 'កំណត់ចំណាំ:' : language === 'zh' ? '提示说明:' : 'How it works:'}</strong>{' '}
          {language === 'km'
            ? 'ទីតាំងដែលបានកំណត់ខាងក្រោមនឹងក្លាយជាជម្រើសក្នុងបញ្ជីទម្លាក់ចុះ (Dropdown) សម្រាប់អ្នកដាក់ពាក្យស្នើសុំស្តង់ និងអ្នកគ្រប់គ្រងពិព័រណ៍។'
            : language === 'zh'
            ? '下方配置的所有展厅与区域将自动作为预选列表，供展位申请者与管理员在“申请区域/展厅（Requested Zone / Hall）”字段中快捷选择。'
            : 'All zones configured here populate the "Requested Zone / Hall" selection dropdown in proposal submissions and admin event forms.'}
        </div>
        <span style={{
          background: 'var(--primary)',
          color: '#fff',
          fontWeight: '800',
          fontSize: '0.75rem',
          padding: '3px 10px',
          borderRadius: '999px'
        }}>
          {zones.length} {language === 'km' ? 'ទីតាំង' : language === 'zh' ? '个展区' : 'Zones'}
        </span>
      </div>

      {/* Zones List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
        {zones.map((z, index) => {
          const localName = z.name?.[language] || z.name?.en || z.code;
          const localDesc = z.description?.[language] || z.description?.en || '';
          const color = z.color || '#6366f1';

          return (
            <div
              key={z.id || index}
              className="glass-card"
              style={{
                padding: '22px',
                borderTop: `4px solid ${color}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '14px',
                position: 'relative'
              }}
            >
              <div>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: `${color}20`,
                      border: `1px solid ${color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem'
                    }}>
                      {z.icon || '🏛️'}
                    </div>
                    <div>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        color: color,
                        background: `${color}18`,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: `1px solid ${color}33`
                      }}>
                        {z.code}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                        Zone #{index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Reorder, Edit, Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 6px', opacity: index === 0 ? 0.3 : 1 }}
                      title="Move up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 1)}
                      disabled={index === zones.length - 1}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 6px', opacity: index === zones.length - 1 ? 0.3 : 1 }}
                      title="Move down"
                    >
                      <ArrowDown size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(z, index)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 8px' }}
                      title="Edit"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveZone(index)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 8px', color: '#ef4444' }}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Name */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px', lineHeight: '1.3' }}>
                  {localName}
                </h3>

                {/* Description */}
                {localDesc && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '16px' }}>
                    {localDesc}
                  </p>
                )}
              </div>

              {/* Bottom Metadata */}
              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '12px',
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.78rem',
                color: 'var(--text-dim)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={13} color="var(--primary)" />
                  <span>{language === 'km' ? 'ចំណុះ:' : language === 'zh' ? '设计容量:' : 'Capacity:'}</span>
                  <strong style={{ color: 'var(--text-main)' }}>{z.capacity || 'Flexible'}</strong>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {z.name?.km && <span style={{ opacity: 0.8 }}>🇰🇭</span>}
                  {z.name?.en && <span style={{ opacity: 0.8 }}>🇬🇧</span>}
                  {z.name?.zh && <span style={{ opacity: 0.8 }}>🇨🇳</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div 
            className="modal-card" 
            style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }} 
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {editingIndex !== null 
                    ? (language === 'km' ? 'កែសម្រួលទីតាំង / សាលពិព័រណ៍' : language === 'zh' ? '编辑区域 / 展厅' : 'Edit Zone / Hall')
                    : (language === 'km' ? 'បន្ថែមទីតាំង / សាលពិព័រណ៍ថ្មី' : language === 'zh' ? '添加新区域 / 展厅' : 'Add New Zone / Hall')}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>

            <form onSubmit={handleModalSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Code & Capacity */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label">{language === 'km' ? 'កូដសម្គាល់ (Code / Prefix) *' : language === 'zh' ? '区域代号 (Code) *' : 'Zone Code / ID *'}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HALL-A or ZONE-1"
                    value={modalData.code}
                    onChange={e => setModalData({ ...modalData, code: e.target.value.toUpperCase() })}
                    className="form-input"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}
                  />
                </div>
                <div>
                  <label className="form-label">{language === 'km' ? 'ចំណុះប៉ាន់ស្មាន (Capacity)' : language === 'zh' ? '容纳人数 / 规模' : 'Estimated Capacity'}</label>
                  <input
                    type="text"
                    placeholder="e.g. 1,500 people"
                    value={modalData.capacity}
                    onChange={e => setModalData({ ...modalData, capacity: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Icon & Color Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label">{language === 'km' ? 'រូបតំណាង (Emoji / Icon)' : language === 'zh' ? '图标 Emoji' : 'Icon / Emoji'}</label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {EMOJI_OPTIONS.map(em => (
                      <button
                        type="button"
                        key={em}
                        onClick={() => setModalData({ ...modalData, icon: em })}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          fontSize: '1.2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          background: modalData.icon === em ? 'var(--primary)' : 'var(--btn-secondary-bg)',
                          border: modalData.icon === em ? '2px solid #fff' : '1px solid var(--border-subtle)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label">{language === 'km' ? 'ពណ៌សម្គាល់ (Theme Color)' : language === 'zh' ? '主题颜色' : 'Theme Color'}</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {COLOR_OPTIONS.map(c => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setModalData({ ...modalData, color: c })}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: c,
                          border: modalData.color === c ? '3px solid #fff' : '2px solid transparent',
                          cursor: 'pointer',
                          boxShadow: modalData.color === c ? '0 0 10px ' + c : 'none'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Trilingual Names */}
              <div>
                <label className="form-label">🇰🇭 {language === 'km' ? 'ឈ្មោះសាលជាភាសាខ្មែរ *' : language === 'zh' ? '高棉语名称 *' : 'Khmer Name *'}</label>
                <input
                  type="text"
                  required
                  placeholder="ឧ. សាលធំ A (ឆាកធំ និងពិធីការ)"
                  value={modalData.name.km}
                  onChange={e => setModalData({ ...modalData, name: { ...modalData.name, km: e.target.value } })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">🇬🇧 English Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Hall A (Grand Stage & Ceremony)"
                  value={modalData.name.en}
                  onChange={e => setModalData({ ...modalData, name: { ...modalData.name, en: e.target.value } })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">🇨🇳 中文展区名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如：A号主展厅（主舞台与庆典区）"
                  value={modalData.name.zh}
                  onChange={e => setModalData({ ...modalData, name: { ...modalData.name, zh: e.target.value } })}
                  className="form-input"
                />
              </div>

              {/* Trilingual Descriptions */}
              <div>
                <label className="form-label">🇰🇭 {language === 'km' ? 'ការពិពណ៌នា (ខ្មែរ)' : language === 'zh' ? '高棉语说明' : 'Khmer Description'}</label>
                <input
                  type="text"
                  placeholder="ការពិពណ៌នាអំពីសាល..."
                  value={modalData.description.km}
                  onChange={e => setModalData({ ...modalData, description: { ...modalData.description, km: e.target.value } })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">🇬🇧 English Description</label>
                <input
                  type="text"
                  placeholder="Short description of activities or booths in this hall..."
                  value={modalData.description.en}
                  onChange={e => setModalData({ ...modalData, description: { ...modalData.description, en: e.target.value } })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">🇨🇳 中文展区功能描述</label>
                <input
                  type="text"
                  placeholder="简述该展区主要功能与活动..."
                  value={modalData.description.zh}
                  onChange={e => setModalData({ ...modalData, description: { ...modalData.description, zh: e.target.value } })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontWeight: '700' }}
                >
                  <Check size={16} />
                  <span>{editingIndex !== null ? 'Update Zone' : 'Add Zone'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
