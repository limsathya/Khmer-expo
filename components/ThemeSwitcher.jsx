'use client';

import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, ChevronDown, Check } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useLanguage } from '@/components/LanguageProvider';

export default function ThemeSwitcher() {
  const { theme, resolvedTheme, setTheme, mounted } = useTheme();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation (Escape to close)
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const options = [
    {
      value: 'light',
      icon: Sun,
      color: 'text-amber-400',
      labelEn: 'Light',
      labelKm: 'ពន្លឺ (Light)',
      labelZh: '浅色 (Light)',
      descEn: 'Clean light appearance',
      descKm: 'ផ្ទៃពណ៌សភ្លឺច្បាស់',
      descZh: '明亮清晰界面',
    },
    {
      value: 'dark',
      icon: Moon,
      color: 'text-indigo-400',
      labelEn: 'Dark',
      labelKm: 'ងងឹត (Dark)',
      labelZh: '深色 (Dark)',
      descEn: 'Comfortable dark theme',
      descKm: 'ផ្ទៃពណ៌ខ្មៅងាយស្រួលមើល',
      descZh: '沉浸深色护眼模式',
    },
    {
      value: 'system',
      icon: Monitor,
      color: 'text-blue-400',
      labelEn: 'System',
      labelKm: 'ប្រព័ន្ធ (System)',
      labelZh: '跟随系统 (System)',
      descEn: `Follows device setting (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`,
      descKm: `ផ្អែកតាមឧបករណ៍ (${resolvedTheme === 'dark' ? 'ងងឹត' : 'ពន្លឺ'})`,
      descZh: `根据设备系统偏好 (${resolvedTheme === 'dark' ? '当前深色' : '当前浅色'})`,
    },
  ];

  const currentOption = options.find((opt) => opt.value === theme) || options[2];
  const CurrentIcon = currentOption.icon;

  const getLabel = (opt) => {
    if (language === 'km') return opt.labelKm;
    if (language === 'zh') return opt.labelZh;
    return opt.labelEn;
  };

  const getDesc = (opt) => {
    if (language === 'km') return opt.descKm;
    if (language === 'zh') return opt.descZh;
    return opt.descEn;
  };

  const buttonTitle = language === 'km' 
    ? `រូបរាង: ${getLabel(currentOption)}`
    : language === 'zh'
    ? `主题模式: ${getLabel(currentOption)}`
    : `Theme: ${getLabel(currentOption)}`;

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="btn btn-secondary btn-sm theme-toggle-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 10px',
          borderRadius: '9px',
          fontSize: '0.825rem',
          fontWeight: '700',
          minHeight: '36px',
        }}
        aria-label="Theme mode: Dark, Light, System"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        title={buttonTitle}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          {mounted ? (
            <CurrentIcon size={16} className={currentOption.color} />
          ) : (
            <Moon size={16} className="text-indigo-400" />
          )}
        </span>
        <span className="hidden sm:inline" style={{ fontSize: '0.8rem', lineHeight: 1 }}>
          {mounted ? currentOption.labelEn : 'Dark'}
        </span>
        <ChevronDown 
          size={13} 
          style={{ 
            opacity: 0.7, 
            transform: isOpen ? 'rotate(180deg)' : 'none', 
            transition: 'transform 0.2s ease', 
            flexShrink: 0 
          }} 
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Theme options"
          className="glass-panel dropdown-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            zIndex: 1000,
            minWidth: '220px',
            padding: '6px',
            borderRadius: '12px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }}
        >
          {options.map((opt) => {
            const isSelected = theme === opt.value;
            const Icon = opt.icon;

            return (
              <button
                key={opt.value}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={() => {
                  setTheme(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: isSelected ? '700' : '500',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Icon size={16} className={`${opt.color} shrink-0 mt-0.5`} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', lineHeight: 1.2 }}>{getLabel(opt)}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1.2, marginTop: '2px' }}>
                      {getDesc(opt)}
                    </span>
                  </div>
                </div>
                {isSelected && <Check size={14} color="var(--primary)" className="shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
