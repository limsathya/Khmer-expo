'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  Layers, 
  Sparkles,
  ArrowUp,
  ArrowDown
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

  const handleDayFieldChange = (index, field, lang, value) => {
    setDays(prev => {
      const copy = [...prev];
      if (lang) {
        copy[index] = {
          ...copy[index],
          [field]: {
            ...(copy[index][field] || {}),
            [lang]: value
          }
        };
      } else {
        copy[index] = {
          ...copy[index],
          [field]: value
        };
      }
      return copy;
    });
  };

  const handleAddDay = () => {
    const nextDayNum = days.length + 1;
    const lastDate = days[days.length - 1]?.date || '2026-10-14';
    const [y, m, d] = lastDate.split('-').map(Number);
    const nextDateObj = new Date(y, m - 1, d + 1);
    const nextDateStr = nextDateObj.toISOString().split('T')[0];

    const newDay = {
      day: nextDayNum,
      date: nextDateStr,
      startTime: '09:00',
      endTime: '18:00',
      label: {
        en: `Day ${nextDayNum}: ${nextDateStr.slice(5)}`,
        km: `ថ្ងៃទី${nextDayNum}`,
        zh: `第${nextDayNum}天`
      },
      theme: {
        en: 'Special Exhibition & Workshops',
        km: 'ពិព័រណ៍ពិសេស និងសិក្ខាសាលា',
        zh: '专题展览与深度工作坊'
      }
    };
    setDays([...days, newDay]);
  };

  const handleRemoveDay = (index) => {
    if (days.length <= 1) {
      alert('Must have at least 1 day in the expo timeline schedule.');
      return;
    }
    setDays(days.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ok = await updateSettings({ timelineDays: days });
      if (ok) {
        if (showToast) showToast('Timeline schedule days saved to DB successfully!');
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
            {language === 'km' ? 'កាលវិភាគ Timeline & កាលបរិច្ឆេទថ្ងៃនីមួយៗ' : language === 'zh' ? '世博时间线日程与天数配置' : 'Expo Timeline Schedule & Days Manager'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            {language === 'km' 
              ? 'កំណត់កាលបរិច្ឆេទនៃថ្ងៃនីមួយៗ (Day 1, Day 2, Day 3), ស្លាកសម្គាល់ពហុភាសា និងប្រធានបទប្រចាំថ្ងៃ។ រក្សាទុកដោយផ្ទាល់ក្នុង Supabase DB។' 
              : language === 'zh' 
              ? '自定义每日日期 (YYYY-MM-DD)、多语言展示标签与每日主题亮点，实时保存并在时间线页面动态展示。' 
              : 'Configure timeline day numbers, dates, multilingual labels, and daily themes in Supabase DB.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleAddDay}
            className="btn btn-secondary btn-sm"
          >
            <Plus size={14} />
            <span>{language === 'km' ? '+ បន្ថែមថ្ងៃថ្មី' : language === 'zh' ? '+ 添加新天数' : '+ Add Day'}</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: '700' }}
          >
            <Check size={16} />
            <span>{saving ? 'Saving...' : (language === 'km' ? 'រក្សាទុកកាលវិភាគទៅ DB' : language === 'zh' ? '保存日程至数据库' : 'Save Timeline to DB')}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {days.map((dayItem, index) => (
          <div key={index} className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', pb: '12px', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem' }}>
                  {dayItem.day || index + 1}
                </div>
                <div>
                  <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1rem' }}>
                    {dayItem.label?.[language] || dayItem.label?.en || `Day ${dayItem.day || index + 1}`}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '3px' }}>
                    <span>📅 {dayItem.date}</span>
                    {(dayItem.startTime || dayItem.endTime) && (
                      <span style={{ 
                        color: 'var(--primary)', 
                        fontWeight: '700',
                        background: 'rgba(99, 102, 241, 0.12)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Clock size={12} />
                        <span>{formatTimeString(dayItem.startTime, dayItem.endTime)}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveDay(index)}
                className="btn btn-secondary btn-sm"
                style={{ color: '#ef4444', padding: '6px 10px' }}
                title="Remove Day"
              >
                <Trash2 size={14} />
                <span>Remove</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '16px' }}>
              {/* Date Input */}
              <div>
                <label className="form-label">{language === 'km' ? 'កាលបរិច្ឆេទ (YYYY-MM-DD)' : language === 'zh' ? '具体公历日期' : 'Date (YYYY-MM-DD)'}</label>
                <input
                  type="date"
                  required
                  value={dayItem.date}
                  onChange={(e) => handleDayFieldChange(index, 'date', null, e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Day Number */}
              <div>
                <label className="form-label">{language === 'km' ? 'លំដាប់ថ្ងៃ' : language === 'zh' ? '天数序号' : 'Day Number'}</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={dayItem.day || index + 1}
                  onChange={(e) => handleDayFieldChange(index, 'day', null, Number(e.target.value))}
                  className="form-input"
                />
              </div>

              {/* Day Start Time */}
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={13} color="var(--primary)" />
                  <span>{language === 'km' ? 'ម៉ោងចាប់ផ្តើមប្រចាំថ្ងៃ (24h)' : language === 'zh' ? '每日开放时间 (24小时制)' : 'Day Start Time (24h)'}</span>
                </label>
                <input
                  type="time"
                  value={dayItem.startTime || '08:30'}
                  onChange={(e) => handleDayFieldChange(index, 'startTime', null, e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Day End Time */}
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={13} color="var(--primary)" />
                  <span>{language === 'km' ? 'ម៉ោងបញ្ចប់ប្រចាំថ្ងៃ (24h)' : language === 'zh' ? '每日结束时间 (24小时制)' : 'Day End Time (24h)'}</span>
                </label>
                <input
                  type="time"
                  value={dayItem.endTime || '18:00'}
                  onChange={(e) => handleDayFieldChange(index, 'endTime', null, e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Live Time Preview & Presets banner */}
              <div style={{
                gridColumn: '1 / -1',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px dashed rgba(99, 102, 241, 0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '0.825rem',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <Clock size={15} color="var(--primary)" />
                  <span style={{ color: 'var(--text-muted)' }}>
                    {language === 'km' ? 'កាលវិភាគម៉ោងលើ Timeline:' : language === 'zh' ? '时间线日程展示时间:' : 'Public Timeline Schedule Display:'}
                  </span>
                  <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                    {formatTimeString(dayItem.startTime || '08:30', dayItem.endTime || '18:00')}
                  </strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{language === 'km' ? 'កំណត់រហ័ស:' : language === 'zh' ? '快捷预设:' : 'Presets:'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      handleDayFieldChange(index, 'startTime', null, '08:30');
                      handleDayFieldChange(index, 'endTime', null, '18:00');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                  >
                    08:30 - 18:00
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleDayFieldChange(index, 'startTime', null, '09:00');
                      handleDayFieldChange(index, 'endTime', null, '18:00');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                  >
                    09:00 - 18:00
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleDayFieldChange(index, 'startTime', null, '09:00');
                      handleDayFieldChange(index, 'endTime', null, '21:00');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                  >
                    09:00 - 21:00
                  </button>
                </div>
              </div>

              {/* Khmer Label */}
              <div>
                <label className="form-label">🇰🇭 {language === 'km' ? 'ស្លាកជាភាសាខ្មែរ' : language === 'zh' ? '高棉语标签' : 'Khmer Label'}</label>
                <input
                  type="text"
                  placeholder="e.g. ថ្ងៃទី១: ១២ តុលា"
                  value={dayItem.label?.km || ''}
                  onChange={(e) => handleDayFieldChange(index, 'label', 'km', e.target.value)}
                  className="form-input"
                />
              </div>

              {/* English Label */}
              <div>
                <label className="form-label">🇬🇧 English Label</label>
                <input
                  type="text"
                  placeholder="e.g. Day 1: Oct 12"
                  value={dayItem.label?.en || ''}
                  onChange={(e) => handleDayFieldChange(index, 'label', 'en', e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Chinese Label */}
              <div>
                <label className="form-label">🇨🇳 中文标签</label>
                <input
                  type="text"
                  placeholder="e.g. 第1天：10月12日"
                  value={dayItem.label?.zh || ''}
                  onChange={(e) => handleDayFieldChange(index, 'label', 'zh', e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Khmer Theme */}
              <div>
                <label className="form-label">🇰🇭 {language === 'km' ? 'ប្រធានបទប្រចាំថ្ងៃ (ខ្មែរ)' : language === 'zh' ? '高棉语主题' : 'Khmer Theme'}</label>
                <input
                  type="text"
                  placeholder="e.g. ពិធីបើកសម្ពោធ និងបច្ចេកវិទ្យាសំខាន់ៗ"
                  value={dayItem.theme?.km || ''}
                  onChange={(e) => handleDayFieldChange(index, 'theme', 'km', e.target.value)}
                  className="form-input"
                />
              </div>

              {/* English Theme */}
              <div>
                <label className="form-label">🇬🇧 English Theme</label>
                <input
                  type="text"
                  placeholder="e.g. Grand Opening & Keynote Tech"
                  value={dayItem.theme?.en || ''}
                  onChange={(e) => handleDayFieldChange(index, 'theme', 'en', e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Chinese Theme */}
              <div>
                <label className="form-label">🇨🇳 中文主题亮点</label>
                <input
                  type="text"
                  placeholder="e.g. 开幕盛典与主旨科技"
                  value={dayItem.theme?.zh || ''}
                  onChange={(e) => handleDayFieldChange(index, 'theme', 'zh', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontWeight: '800' }}
          >
            <Check size={16} />
            <span>{saving ? 'Saving...' : (language === 'km' ? 'រក្សាទុកកាលវិភាគថ្ងៃទាំងអស់ទៅ DB' : language === 'zh' ? '保存全部日程天数至数据库' : 'Save All Timeline Days to DB')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
