'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  Filter, 
  Layers, 
  Compass, 
  Flag, 
  Tag, 
  X, 
  Sparkles, 
  PlusCircle,
  ExternalLink,
  ChevronRight,
  User
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { useSettings } from '@/components/SettingsProvider';
import { getSubCommitteeLocalizedName } from '@/lib/committees';

export default function TimelinePage() {
  const { t, language } = useLanguage();
  const { getTimelineDays, getExpoDatesRange, getExpoShortName, expoConfig, categories: dynamicCategories, getCategoryMeta } = useSettings();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalEvent, setActiveModalEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await fetch('/api/events?status=approved');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Error fetching approved events', err);
    } finally {
      setLoading(false);
    }
  }

  const timelineDays = getTimelineDays();
  const days = [
    { key: 'all', label: t('timeline.allDays'), sublabel: getExpoDatesRange(language) },
    ...(timelineDays && timelineDays.length > 0
      ? timelineDays.map((d, index) => ({
          key: d.date,
          label: d.label?.[language] || d.label?.en || `Day ${d.day || index + 1}`,
          sublabel: d.date
        }))
      : [
          { key: '2026-10-12', label: t('timeline.day1', 'Day 1'), sublabel: 'Oct 12' },
          { key: '2026-10-13', label: t('timeline.day2', 'Day 2'), sublabel: 'Oct 13' },
          { key: '2026-10-14', label: t('timeline.day3', 'Day 3'), sublabel: 'Oct 14' },
        ])
  ];

  const categories = [
    { key: 'all', label: t('timeline.allTypes'), emoji: '✨', color: '#6366f1' },
    ...dynamicCategories.map(c => ({
      key: c.key,
      label: c.name?.[language] || c.name?.en || c.key,
      emoji: c.emoji || '📌',
      color: c.color || '#6366f1'
    }))
  ];

  const filteredEvents = events.filter(event => {
    if (selectedDay !== 'all' && event.date !== selectedDay) return false;
    if (selectedCategory !== 'all' && event.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = event.title?.toLowerCase().includes(q);
      const matchDesc = event.description?.toLowerCase().includes(q);
      const matchLoc = event.location?.toLowerCase().includes(q);
      const matchOrg = event.organizer?.toLowerCase().includes(q);
      const matchBooth = event.boothNumber?.toLowerCase().includes(q);
      const matchTags = event.tags?.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchLoc && !matchOrg && !matchBooth && !matchTags) {
        return false;
      }
    }
    return true;
  });

  // Group by date
  const groupedEvents = filteredEvents.reduce((acc, curr) => {
    if (!acc[curr.date]) acc[curr.date] = [];
    acc[curr.date].push(curr);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedEvents).sort();

  sortedDates.forEach(date => {
    groupedEvents[date].sort((a, b) => a.time.localeCompare(b.time));
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(12px, 3vw, 24px)' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 14px',
          borderRadius: '9999px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          color: 'var(--primary)',
          fontSize: '0.8rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '16px'
        }}>
          <Calendar size={14} /> EXPO 2026
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px', lineHeight: 'var(--line-height-heading)', letterSpacing: 'var(--letter-spacing-heading)', wordBreak: 'break-word' }}>
          {t('timeline.title')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto', lineHeight: 'var(--line-height-base)' }}>
          {t('timeline.subtitle')}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={t('timeline.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '46px' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            {/* Day Selector */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {days.map((day) => {
                const isSelected = selectedDay === day.key;
                return (
                  <button
                    key={day.key}
                    onClick={() => setSelectedDay(day.key)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border-subtle)',
                      background: isSelected ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'var(--btn-secondary-bg)',
                      color: isSelected ? '#fff' : 'var(--text-muted)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      lineHeight: 'var(--line-height-base)'
                    }}
                  >
                    <span>{day.label}</span>
                    <span style={{ fontSize: '0.7rem', opacity: isSelected ? 0.9 : 0.6 }}>{day.sublabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.key;
                const catColor = cat.color || 'var(--primary)';
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '0.825rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: isSelected ? catColor : 'var(--border-subtle)',
                      background: isSelected ? `${catColor}26` : 'var(--btn-secondary-bg)',
                      color: isSelected ? catColor : 'var(--text-muted)',
                      transition: 'all 0.2s ease',
                      lineHeight: 'var(--line-height-base)'
                    }}
                  >
                    <span>{cat.emoji || '📌'}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 'var(--line-height-base)' }}>
          {t('timeline.showingEvents', 'Showing {count} approved events').replace('{count}', filteredEvents.length)}
        </div>
        <Link href="/submit" className="btn btn-secondary btn-sm">
          <PlusCircle size={14} />
          <span>{t('nav.submitEvent')}</span>
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '0.9rem', lineHeight: 'var(--line-height-base)' }}>
            {t('timeline.loading', 'Loading timeline program...')}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredEvents.length === 0 && (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', margin: '40px 0' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--btn-secondary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--text-dim)' }}>
            <Calendar size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
            {t('timeline.emptyTitle')}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 24px' }}>
            {t('timeline.emptySubtitle')}
          </p>
          <button
            onClick={() => { setSelectedDay('all'); setSelectedCategory('all'); setSearchQuery(''); }}
            className="btn btn-secondary btn-sm"
          >
            {t('timeline.clearFilters')}
          </button>
        </div>
      )}

      {/* Timeline Render grouped by date */}
      {!loading && sortedDates.map((date) => {
        const dateObj = new Date(date + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString(language === 'km' ? 'km-KH' : language === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        const matchedDay = timelineDays.find(d => d.date === date);
        const dayNumber = matchedDay
          ? (matchedDay.label?.[language] || matchedDay.label?.en)
          : (date === '2026-10-12' 
            ? (language === 'km' ? 'ថ្ងៃទី ១' : language === 'zh' ? '第一天' : 'Day 1') 
            : date === '2026-10-13' 
            ? (language === 'km' ? 'ថ្ងៃទី ២' : language === 'zh' ? '第二天' : 'Day 2') 
            : (language === 'km' ? 'ថ្ងៃទី ៣' : language === 'zh' ? '第三天' : 'Day 3'));
        const dayTheme = matchedDay ? (matchedDay.theme?.[language] || matchedDay.theme?.en) : null;

        return (
          <div key={date} style={{ marginBottom: '50px' }}>
            {/* Date Header Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
              <div style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                color: '#fff',
                padding: '8px 18px',
                borderRadius: '9999px',
                fontWeight: '800',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
              }}>
                <Calendar size={16} />
                <span>{dayNumber}</span>
                <span style={{ opacity: 0.7, fontWeight: '400' }}>•</span>
                <span>{formattedDate}</span>
              </div>
              {dayTheme && (
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  background: 'var(--btn-secondary-bg)',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontStyle: 'italic'
                }}>
                  {dayTheme}
                </div>
              )}
              <div style={{ flex: 1, minWidth: '40px', height: '1px', background: 'var(--border-subtle)' }} />
            </div>

            {/* Events for this day */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '24px', borderLeft: '2px solid rgba(99, 102, 241, 0.25)' }}>
              {groupedEvents[date].map((event) => {
                const meta = getCategoryMeta(event.category, language);

                return (
                  <div
                    key={event.id}
                    className="glass-card"
                    onClick={() => setActiveModalEvent(event)}
                    style={{
                      padding: '22px 26px',
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {/* Node dot on timeline line with live radar pulse */}
                    <div
                      className="radar-node"
                      style={{
                        position: 'absolute',
                        left: '-32px',
                        top: '28px',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: meta.color,
                        border: '3px solid var(--bg-main)',
                        boxShadow: `0 0 14px ${meta.color}`
                      }}
                    />

                    {/* Top Row: Time, Category Badge, Booth Number */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: 'var(--text-main)',
                          fontWeight: '700',
                          fontSize: '0.95rem',
                          background: 'var(--btn-secondary-bg)',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-subtle)'
                        }}>
                          <Clock size={15} color="var(--primary)" />
                          <span>{event.time} – {event.endTime}</span>
                        </div>

                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            background: meta.bg,
                            color: meta.color,
                            border: `1px solid ${meta.border}`
                          }}
                        >
                          <span>{meta.emoji || '📌'}</span>
                          <span>{meta.label}</span>
                        </span>

                        {event.subCommittee && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }}>
                            {getSubCommitteeLocalizedName(event.subCommittee, language)}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--status-approved)', background: 'var(--status-approved-bg)', border: '1px solid var(--status-approved-border)', padding: '3px 9px', borderRadius: '6px', fontWeight: '700' }}>
                          {t('timeline.boothCode')}: {event.boothNumber}
                        </span>
                        <ChevronRight size={18} color="var(--text-dim)" />
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px', lineHeight: 'var(--line-height-heading)', wordBreak: 'break-word' }}>
                        {event.title}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 'var(--line-height-base)', wordBreak: 'break-word' }}>
                        {event.description}
                      </p>
                    </div>

                    {/* Bottom Row: Location, Organizer, Tags */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.825rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-main)' }}>
                          <MapPin size={14} color="#06b6d4" />
                          <span>{event.location}</span>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
                          <User size={14} color="#a855f7" />
                          <span>{event.organizer}</span>
                        </span>
                      </div>

                      {event.tags && event.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {event.tags.map(t => (
                            <span key={t} style={{ fontSize: '0.725rem', background: 'var(--btn-secondary-bg)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Event Details Modal */}
      {activeModalEvent && (
        <div className="modal-overlay" onClick={() => setActiveModalEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                {(() => {
                  const modalMeta = getCategoryMeta(activeModalEvent.category, language);
                  return (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        background: modalMeta.bg,
                        color: modalMeta.color,
                        border: `1px solid ${modalMeta.border}`,
                        marginBottom: '8px'
                      }}
                    >
                      <span>{modalMeta.emoji || '📌'}</span>
                      <span>{modalMeta.label}</span>
                    </span>
                  );
                })()}
                <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.3' }}>
                  {activeModalEvent.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveModalEvent(null)}
                style={{ background: 'var(--btn-secondary-bg)', border: 'none', color: 'var(--text-muted)', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
              {activeModalEvent.description}
            </div>

            <div className="glass-panel" style={{ padding: '16px', background: 'var(--btn-secondary-bg)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '24px', fontSize: '0.85rem' }}>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>{t('timeline.detailsModal.schedule')}</div>
                <div style={{ color: 'var(--text-main)', fontWeight: '600', marginTop: '2px' }}>
                  {activeModalEvent.date} ({activeModalEvent.time} – {activeModalEvent.endTime})
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>{t('timeline.boothCode')}</div>
                <div style={{ color: 'var(--status-approved)', fontWeight: '600', marginTop: '2px' }}>
                  {activeModalEvent.boothNumber}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>{t('timeline.detailsModal.location')}</div>
                <div style={{ color: 'var(--text-main)', fontWeight: '600', marginTop: '2px' }}>
                  {activeModalEvent.location}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>{t('timeline.detailsModal.organizer')}</div>
                <div style={{ color: 'var(--text-main)', fontWeight: '600', marginTop: '2px' }}>
                  {activeModalEvent.organizer}
                </div>
              </div>
              <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>{t('timeline.detailsModal.managingCommittee')}</div>
                <div style={{ color: 'var(--primary)', fontWeight: '700', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🏛️</span>
                  <span>{activeModalEvent.subCommittee || 'Organizing Steering Committee'}</span>
                </div>
              </div>
            </div>

            {activeModalEvent.tags && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '8px' }}>{t('timeline.detailsModal.tags')}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {activeModalEvent.tags.map(tag => (
                    <span key={tag} style={{ background: 'var(--btn-secondary-bg)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid var(--border-subtle)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setActiveModalEvent(null)} className="btn btn-secondary btn-sm">
                {t('timeline.detailsModal.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
