'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3,
  Check, 
  Clock, 
  Layers, 
  Sparkles,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Info,
  X
} from 'lucide-react';
import { useSettings } from '@/components/SettingsProvider';
import { useLanguage } from '@/components/LanguageProvider';

export default function TimelineManager({ showToast }) {
  const { expoConfig, updateSettings, getTimelineDays } = useSettings();
  const { t, language } = useLanguage();

  const formatTimeString = (time, endTime) => {
    if (!time) return '';
    const to12h = (tStr) => {
      if (!tStr) return '';
      const [hStr, mStr] = tStr.split(':');
      let h = parseInt(hStr, 10);
      if (isNaN(h)) return tStr;
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h}:${mStr || '00'} ${ampm}`;
    };
    const s12 = to12h(time);
    const e12 = to12h(endTime);
    if (endTime) {
      return `${time} – ${endTime} (${s12} – ${e12})`;
    }
    return `${time} (${s12})`;
  };

  const [days, setDays] = useState(
    Array.isArray(expoConfig.timelineDays) && expoConfig.timelineDays.length > 0
      ? expoConfig.timelineDays
      : [
          {
            day: 1,
            date: '2026-10-12',
            startTime: '08:30',
            endTime: '18:00',
            label: { en: 'Day 1: Oct 12', km: 'ថ្ងៃទី១: ១២ តុលា', zh: '第1天：10月12日' },
            theme: { en: 'Grand Opening & Keynote Tech', km: 'ពិធីបើកសម្ពោធ និងបច្ចេកវិទ្យាសំខាន់ៗ', zh: '开幕盛典与主旨科技' }
          },
          {
            day: 2,
            date: '2026-10-13',
            startTime: '09:00',
            endTime: '18:00',
            label: { en: 'Day 2: Oct 13', km: 'ថ្ងៃទី២: ១៣ តុលា', zh: '第2天：10月13日' },
            theme: { en: 'Innovation Showcase & Contests', km: 'ការបង្ហាញនវានុវត្តន៍ និងការប្រកួតប្រជែង', zh: '创新展示与前沿竞赛' }
          },
          {
            day: 3,
            date: '2026-10-14',
            startTime: '09:00',
            endTime: '21:00',
            label: { en: 'Day 3: Oct 14', km: 'ថ្ងៃទី៣: ១៤ តុលា', zh: '第3天：10月14日' },
            theme: { en: 'Cultural Gala & Award Honors', km: 'ពិធីរាត្រីសមោសរសិល្បៈ និងប្រគល់ពានរង្វាន់', zh: '文化盛典与颁奖闭幕' }
          }
        ]
  );

  const [saving, setSaving] = useState(false);

  // Pop-up Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null = add, number = edit
  const [modalData, setModalData] = useState({
    day: 1,
    date: '2026-10-12',
    startTime: '08:30',
    endTime: '18:00',
    label: { en: '', km: '', zh: '' },
    theme: { en: '', km: '', zh: '' }
  });

  const openAddModal = () => {
    setEditingIndex(null);
    const nextDayNum = days.length + 1;
    let nextDateStr = '2026-10-15';
    if (days.length > 0) {
      const lastDate = days[days.length - 1]?.date || '2026-10-14';
      const [y, m, d] = lastDate.split('-').map(Number);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        const nextDateObj = new Date(y, m - 1, d + 1);
        nextDateStr = nextDateObj.toISOString().split('T')[0];
      }
    }
    setModalData({
      day: nextDayNum,
      date: nextDateStr,
      startTime: '09:00',
      endTime: '18:00',
      label: {
        en: `Day ${nextDayNum}: ${nextDateStr.slice(5)}`,
        km: `ថ្ងៃទី${nextDayNum}: ${nextDateStr.slice(5)}`,
        zh: `第${nextDayNum}天：${nextDateStr.slice(5)}`
      },
      theme: {
        en: 'Special Exhibition & Workshops',
        km: 'ពិព័រណ៍ពិសេស និងសិក្ខាសាលា',
        zh: '专题展览与深度工作坊'
      }
    });
    setIsModalOpen(true);
  };

  const openEditModal = (dayItem, index) => {
    setEditingIndex(index);
    setModalData({
      day: dayItem.day || index + 1,
      date: dayItem.date || '',
      startTime: dayItem.startTime || '08:30',
      endTime: dayItem.endTime || '18:00',
      label: {
        en: dayItem.label?.en || '',
        km: dayItem.label?.km || '',
        zh: dayItem.label?.zh || ''
      },
      theme: {
        en: dayItem.theme?.en || '',
        km: dayItem.theme?.km || '',
        zh: dayItem.theme?.zh || ''
      }
    });
    setIsModalOpen(true);
  };

  const handleModalSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let updatedDays;
      if (editingIndex === null) {
        // Add new day to list
        updatedDays = [...days, { ...modalData }];
      } else {
        // Update existing day
        updatedDays = [...days];
        updatedDays[editingIndex] = { ...modalData };
      }
      setDays(updatedDays);
      setIsModalOpen(false);

      // Save to Supabase Settings
      const ok = await updateSettings({ timelineDays: updatedDays });
      if (ok) {
        if (showToast) {
          showToast(
            editingIndex === null
              ? (language === 'km' ? `បានបន្ថែម និងរក្សាទុកថ្ងៃទី #${modalData.day} ដោយជោគជ័យ!` : language === 'zh' ? `第 ${modalData.day} 天日程已添加并保存至数据库！` : `Day #${modalData.day} added and saved to DB successfully!`)
              : (language === 'km' ? `បានកែសម្រួលថ្ងៃទី #${modalData.day} ដោយជោគជ័យ!` : language === 'zh' ? `第 ${modalData.day} 天日程已更新并保存至数据库！` : `Day #${modalData.day} updated and saved to DB successfully!`)
          );
        }
      } else {
        if (showToast) showToast('Saved locally, but failed to sync to DB.', 'error');
      }
    } catch (err) {
      console.error('Error saving timeline day modal:', err);
      if (showToast) showToast('Error saving timeline day', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleMoveDay = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= days.length) return;
    const copy = [...days];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    const renumbered = copy.map((d, i) => ({ ...d, day: i + 1 }));
    setDays(renumbered);
    await updateSettings({ timelineDays: renumbered });
    if (showToast) showToast('Order updated.');
  };

  const handleRemoveDay = async (index) => {
    if (days.length <= 1) {
      if (showToast) showToast('Must have at least 1 day in the expo timeline schedule.', 'error');
      return;
    }
    const dayItem = days[index];
    const confirmMsg = language === 'zh'
      ? `确定要删除第 ${dayItem.day || index + 1} 天 (${dayItem.date}) 吗？`
      : language === 'km'
      ? `តើអ្នកពិតជាចង់លុបថ្ងៃទី ${dayItem.day || index + 1} (${dayItem.date}) មែនទេ?`
      : `Are you sure you want to remove Day #${dayItem.day || index + 1} (${dayItem.date})?`;
    
    if (window.confirm(confirmMsg)) {
      const updated = days.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }));
      setDays(updated);
      await updateSettings({ timelineDays: updated });
      if (showToast) showToast(`Day removed successfully.`);
    }
  };

  const handleSaveAll = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const ok = await updateSettings({ timelineDays: days });
      if (ok) {
        if (showToast) showToast('All timeline schedule days saved to DB successfully!');
      } else {
        if (showToast) showToast('Failed to save timeline schedule', 'error');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Error saving timeline schedule', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header with Title and Add Pop-up Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={22} color="var(--primary)" />
            <span>{language === 'km' ? 'កាលវិភាគ Timeline & កាលបរិច្ឆេទថ្ងៃនីមួយៗ' : language === 'zh' ? '世博时间线日程与天数管理' : 'Expo Timeline Schedule & Days Manager'}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            {language === 'km' 
              ? 'ចុច "+ បន្ថែមថ្ងៃថ្មី" ដើម្បីបើកផ្ទាំង Pop-up កំណត់កាលបរិច្ឆេទ ម៉ោងបើក-បិទ ស្លាកពហុភាសា និងប្រធានបទប្រចាំថ្ងៃ។' 
              : language === 'zh' 
              ? '点击“+ 添加新日程天数”通过弹窗快捷配置公历日期、开放/闭幕时间、多语言标签与每日主题。' 
              : 'Click "+ Add Day" to configure dates, open/close hours, multilingual labels, and themes via modal popup.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={openAddModal}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: '700', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}
          >
            <Plus size={16} />
            <span>{language === 'km' ? '+ បន្ថែមថ្ងៃថ្មី (Pop-up)' : language === 'zh' ? '+ 添加新天数 (弹窗)' : '+ Add Day (Pop-up)'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="btn btn-secondary btn-sm"
            style={{ fontWeight: '700' }}
          >
            <Check size={15} />
            <span>{saving ? 'Saving...' : (language === 'km' ? 'រក្សាទុកទាំងអស់ទៅ DB' : language === 'zh' ? '保存全部至数据库' : 'Save to DB')}</span>
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
          <strong>{language === 'km' ? 'មុខងារ Pop-up ងាយស្រួល:' : language === 'zh' ? '弹窗管理说明:' : 'Pop-up Modal System:'}</strong>{' '}
          {language === 'km'
            ? 'ចុចប៊ូតុង "+ បន្ថែមថ្ងៃថ្មី" ឬចុច "កែសម្រួល" លើថ្ងៃនីមួយៗ ដើម្បីបើកផ្ទាំង Pop-up បញ្ចូលម៉ោង និងព័ត៌មានលម្អិត។'
            : language === 'zh'
            ? '点击右上角“+ 添加新天数”或卡片上的“编辑”按钮即可打开居中弹窗，输入每日日期、营业开放时段 (如 08:30–18:00) 及三语主题。'
            : 'Click "+ Add Day" or the "Edit" button on any day card to open the pop-up modal dialog for schedule hours and details.'}
        </div>
        <span style={{
          background: 'var(--primary)',
          color: '#fff',
          fontWeight: '800',
          fontSize: '0.75rem',
          padding: '3px 10px',
          borderRadius: '999px'
        }}>
          {days.length} {language === 'km' ? 'ថ្ងៃ' : language === 'zh' ? '个日程天' : 'Days'}
        </span>
      </div>

      {/* Days List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {days.map((dayItem, index) => {
          const displayLabel = dayItem.label?.[language] || dayItem.label?.en || `Day ${dayItem.day || index + 1}`;
          const displayTheme = dayItem.theme?.[language] || dayItem.theme?.en || '';

          return (
            <div
              key={dayItem.day || index}
              className="glass-card"
              style={{
                padding: '20px 24px',
                borderLeft: '5px solid var(--primary)',
                borderRadius: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Left Column: Badge, Date, Hours, Labels */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 320px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '900',
                  boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.85, lineHeight: 1 }}>Day</span>
                  <span style={{ fontSize: '1.15rem', lineHeight: 1 }}>{dayItem.day || index + 1}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                      {displayLabel}
                    </h3>

                    {/* Operating Schedule Badge */}
                    <span style={{
                      background: 'rgba(99, 102, 241, 0.12)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: 'var(--primary)',
                      fontWeight: '700',
                      fontSize: '0.78rem',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Clock size={12} />
                      <span>{formatTimeString(dayItem.startTime || '08:30', dayItem.endTime || '18:00')}</span>
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span>📅 <strong>{dayItem.date}</strong></span>
                    {displayTheme && (
                      <span style={{ color: 'var(--text-secondary)' }}>
                        • 💡 {displayTheme}
                      </span>
                    )}
                  </div>

                  {/* Multilingual pills */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap', fontSize: '0.72rem' }}>
                    {dayItem.label?.km && (
                      <span style={{ background: 'var(--bg-main)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                        🇰🇭 {dayItem.label.km}
                      </span>
                    )}
                    {dayItem.label?.en && (
                      <span style={{ background: 'var(--bg-main)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                        🇬🇧 {dayItem.label.en}
                      </span>
                    )}
                    {dayItem.label?.zh && (
                      <span style={{ background: 'var(--bg-main)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                        🇨🇳 {dayItem.label.zh}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Actions (Edit Modal, Reorder, Delete) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => openEditModal(dayItem, index)}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}
                  title="Edit day details via pop-up modal"
                >
                  <Edit3 size={14} />
                  <span>{language === 'km' ? 'កែសម្រួល' : language === 'zh' ? '编辑' : 'Edit'}</span>
                </button>

                <div style={{ display: 'flex', gap: '3px' }}>
                  <button
                    type="button"
                    onClick={() => handleMoveDay(index, -1)}
                    disabled={index === 0}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 8px', opacity: index === 0 ? 0.3 : 1 }}
                    title="Move earlier"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDay(index, 1)}
                    disabled={index === days.length - 1}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 8px', opacity: index === days.length - 1 ? 0.3 : 1 }}
                    title="Move later"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveDay(index)}
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#ef4444', padding: '6px 10px' }}
                  title="Remove day"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* POP-UP MODAL WINDOW FOR ADDING / EDITING DAY */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-card"
            style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    {editingIndex !== null
                      ? (language === 'km' ? `កែសម្រួលកាលវិភាគថ្ងៃទី #${modalData.day}` : language === 'zh' ? `编辑第 ${modalData.day} 天日程 (Day #${modalData.day})` : `Edit Timeline Day #${modalData.day}`)
                      : (language === 'km' ? 'បន្ថែមថ្ងៃថ្មីក្នុងកាលវិភាគពិព័រណ៍' : language === 'zh' ? '添加新展期日程天数 (Add New Day)' : 'Add New Timeline Day')}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: '2px 0 0' }}>
                    {language === 'km'
                      ? 'កំណត់កាលបរិច្ឆេទ ម៉ោង និងប្រធានបទប្រចាំថ្ងៃ'
                      : language === 'zh'
                      ? '设定展期公历日期、开放/闭幕时段与多语言展示主题'
                      : 'Configure date, operating hours, and multilingual display theme'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn btn-secondary btn-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleModalSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Row 1: Day Number & Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
                <div>
                  <label className="form-label">{language === 'km' ? 'លំដាប់ថ្ងៃ (Day #) *' : language === 'zh' ? '天数序号 (Day #) *' : 'Day Number *'}</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={modalData.day}
                    onChange={e => setModalData({ ...modalData, day: Number(e.target.value) })}
                    className="form-input"
                    style={{ fontWeight: '800', fontFamily: 'var(--font-mono)' }}
                  />
                </div>
                <div>
                  <label className="form-label">{language === 'km' ? 'កាលបរិច្ឆេទ (Date) *' : language === 'zh' ? '具体公历日期 (Date) *' : 'Calendar Date (YYYY-MM-DD) *'}</label>
                  <input
                    type="date"
                    required
                    value={modalData.date}
                    onChange={e => setModalData({ ...modalData, date: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Row 2: Schedule Time (24h) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} color="var(--primary)" />
                    <span>{language === 'km' ? 'ម៉ោងចាប់ផ្តើម (24h) *' : language === 'zh' ? '开放时间 (24h) *' : 'Start Time (24h) *'}</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={modalData.startTime}
                    onChange={e => setModalData({ ...modalData, startTime: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} color="var(--primary)" />
                    <span>{language === 'km' ? 'ម៉ោងបញ្ចប់ (24h) *' : language === 'zh' ? '闭幕时间 (24h) *' : 'End Time (24h) *'}</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={modalData.endTime}
                    onChange={e => setModalData({ ...modalData, endTime: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Live Time Format & Quick Presets */}
              <div style={{
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px dashed rgba(99, 102, 241, 0.3)',
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="var(--primary)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {language === 'km' ? 'ការបង្ហាញលើ Timeline:' : language === 'zh' ? '时间线日程预览:' : 'Timeline Display:'}
                  </span>
                  <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
                    {formatTimeString(modalData.startTime, modalData.endTime)}
                  </strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{language === 'zh' ? '预设:' : 'Presets:'}</span>
                  <button
                    type="button"
                    onClick={() => setModalData({ ...modalData, startTime: '08:30', endTime: '18:00' })}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                  >
                    08:30–18:00
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalData({ ...modalData, startTime: '09:00', endTime: '18:00' })}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                  >
                    09:00–18:00
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalData({ ...modalData, startTime: '09:00', endTime: '21:00' })}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                  >
                    09:00–21:00
                  </button>
                </div>
              </div>

              {/* Trilingual Day Labels */}
              <div>
                <label className="form-label">🇰🇭 {language === 'km' ? 'ស្លាកសម្គាល់ថ្ងៃជាភាសាខ្មែរ *' : language === 'zh' ? '高棉语日程标签 *' : 'Khmer Label *'}</label>
                <input
                  type="text"
                  required
                  placeholder="ឧ. ថ្ងៃទី១: ១២ តុលា"
                  value={modalData.label.km}
                  onChange={e => setModalData({ ...modalData, label: { ...modalData.label, km: e.target.value } })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">🇬🇧 English Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Day 1: Oct 12"
                  value={modalData.label.en}
                  onChange={e => setModalData({ ...modalData, label: { ...modalData.label, en: e.target.value } })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">🇨🇳 中文标签 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如：第1天：10月12日"
                  value={modalData.label.zh}
                  onChange={e => setModalData({ ...modalData, label: { ...modalData.label, zh: e.target.value } })}
                  className="form-input"
                />
              </div>

              {/* Trilingual Themes */}
              <div>
                <label className="form-label">🇰🇭 {language === 'km' ? 'ប្រធានបទ / គោលបំណងប្រចាំថ្ងៃ (ខ្មែរ)' : language === 'zh' ? '高棉语主题描述' : 'Khmer Theme'}</label>
                <input
                  type="text"
                  placeholder="ឧ. ពិធីបើកសម្ពោធ និងបច្ចេកវិទ្យាសំខាន់ៗ"
                  value={modalData.theme.km}
                  onChange={e => setModalData({ ...modalData, theme: { ...modalData.theme, km: e.target.value } })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">🇬🇧 English Daily Theme</label>
                <input
                  type="text"
                  placeholder="e.g. Grand Opening & Keynote Tech"
                  value={modalData.theme.en}
                  onChange={e => setModalData({ ...modalData, theme: { ...modalData.theme, en: e.target.value } })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">🇨🇳 中文主题亮点</label>
                <input
                  type="text"
                  placeholder="例如：开幕盛典与主旨科技论坛"
                  value={modalData.theme.zh}
                  onChange={e => setModalData({ ...modalData, theme: { ...modalData.theme, zh: e.target.value } })}
                  className="form-input"
                />
              </div>

              {/* Form Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                  style={{ fontWeight: '700' }}
                >
                  <Check size={16} />
                  <span>{saving ? 'Saving...' : (editingIndex !== null ? 'Save Changes' : '+ Add Day to Timeline')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
