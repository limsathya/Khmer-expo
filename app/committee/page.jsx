'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  ShieldCheck, 
  User, 
  Layers, 
  Compass, 
  Flag, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Award,
  RefreshCw
} from 'lucide-react';
import { 
  MAIN_COMMITTEE as FALLBACK_MAIN, 
  SUB_COMMITTEES as FALLBACK_SUBS, 
  getSubCommitteeLocalizedName,
  localizeOfficeRole,
  COMMITTEE_STANDARD_PROVISION 
} from '@/lib/committees';
import { useLanguage } from '@/components/LanguageProvider';

export default function CommitteePage() {
  const { t, language } = useLanguage();
  const [mainCommittee, setMainCommittee] = useState(FALLBACK_MAIN);
  const [subCommittees, setSubCommittees] = useState(FALLBACK_SUBS);
  const [loading, setLoading] = useState(true);
  const [expandedSubs, setExpandedSubs] = useState({});

  useEffect(() => {
    fetchCommittees();
  }, []);

  async function fetchCommittees() {
    setLoading(true);
    try {
      const res = await fetch('/api/committees');
      if (res.ok) {
        const data = await res.json();
        if (data.mainCommittee) {
          setMainCommittee(data.mainCommittee);
        }
        if (Array.isArray(data.subCommittees) && data.subCommittees.length > 0) {
          setSubCommittees(data.subCommittees);
        }
      }
    } catch (err) {
      console.warn('Could not load committees from API, using default dataset:', err);
    } finally {
      setLoading(false);
    }
  }

  const getSubInfo = (sub) => {
    const locName = getSubCommitteeLocalizedName(sub.id || sub.key, language);
    const descDictionary = {
      sub_protocol: {
        km: 'ទទួលខុសត្រូវលើគណៈប្រតិភូជាន់ខ្ពស់ ពិធីការកិត្តិយស ការស្វាគមន៍ការទូត និងការសម្របសម្រួលពិធីបើក-បិទផ្លូវការ។',
        zh: '负责贵宾与代表团接待、礼仪规范、外交级礼宾服务以及重大仪式统筹协调。',
        en: 'Manages VIP delegations, ceremonial protocols, diplomatic reception, and welcoming coordination.'
      },
      sub_finance: {
        km: 'ត្រួតពិនិត្យការបែងចែកថវិកា គណនេយ្យភាពជំនួយឧបត្ថម្ភ ការទូទាត់ហិរញ្ញវត្ថុ និងថ្លៃស្តង់ពិព័រណ៍។',
        zh: '负责总体预算编制、赞助款项核算、财务支出审查及展位费用管理。',
        en: 'Oversees budget allocations, sponsorship auditing, financial disbursements, and booth fees.'
      },
      sub_design_booth: {
        km: 'ទទួលខុសត្រូវលើការរចនាស្ថាបត្យកម្មឆាក ប្លង់ទីតាំងស្តង់ តម្រូវការបណ្តាញអគ្គិសនី និងការគ្រប់គ្រងស្តង់ពិព័រណ៍។',
        zh: '统筹主舞台架构设计、展区平面规划、电力与弱电负荷规范以及展位现场运营管理。',
        en: 'Responsible for stage architecture, floor plan layouts, electrical power setups, and booth exhibition management.'
      },
      sub_food: {
        km: 'រៀបចំសម្របសម្រួលស្តង់ម្ហូបអាហារ បង្អែមឆ្ងាញ់ៗ អនាម័យចំណីអាហារ និងការគ្រប់គ្រងតំបន់អាហារដ្ឋាន។',
        zh: '负责特色美食与精品甜品展区筹备、食品卫生检疫及餐饮配套管理。',
        en: 'Coordinates gourmet culinary booths, dessert exhibitions, food hygiene inspections, and dining court management.'
      },
      sub_arts: {
        km: 'រៀបចំការសម្តែងសិល្បៈផ្ទាល់ ការប្រគំតន្ត្រី ចម្រៀងប្រពៃណី និងសម័យ និងកម្មវិធីកម្សាន្តលើឆាកធំ។',
        zh: '统筹现场文艺表演、音乐歌唱演出、多元文化艺术展演与大舞台娱乐节目录制。',
        en: 'Curates artistic live performances, musical showcases, cultural vocal performances, and main stage entertainment.'
      },
      sub_media: {
        km: 'ដឹកនាំការផ្សព្វផ្សាយព័ត៌មាន ប័ណ្ណសារព័ត៌មាន ការថតរូប និងវីដេអូឯកសារ ព្រមទាំងការផ្សាយបន្តផ្ទាល់។',
        zh: '负责媒体记者采编、新闻稿发布、现场摄影录像纪录、多平台宣发及全流程直播。',
        en: 'Directs press coverage, photography documentation, live broadcasting, and social media dissemination.'
      },
      sub_sports: {
        km: 'រៀបចំការប្រកួតកីឡា ល្បែងប្រជាប្រិយខ្មែរ ការប្រកួតកីឡាអេឡិចត្រូនិក និងសកម្មភាពអន្តរកម្មកម្សាន្ត។',
        zh: '组织各项体育赛事、民间传统趣味游戏、电竞对抗赛及互动游园挑战。',
        en: 'Organizes athletic competitions, traditional folk games, esports tournaments, and interactive crowd challenges.'
      },
      sub_translation: {
        km: 'ផ្តល់សេវាបកប្រែផ្ទាល់មាត់ ខ្មែរ-ចិន ការបកប្រែឯកសារ ផ្លាកសញ្ញាពិព័រណ៍ និងការសម្របសម្រួលទំនាក់ទំនងទ្វេភាសា។',
        zh: '提供高棉语与中文同声传译、展会双语文案翻译、双语指引标识及双边商贸沟通支持。',
        en: 'Provides simultaneous interpretation, trilingual signage translation, and bilateral dialogue coordination.'
      },
      sub_logistics: {
        km: 'គ្រប់គ្រងការដឹកជញ្ជូន ផែផ្ទុកទំនិញ ឃ្លាំងសម្ភារ បរិក្ខារទីតាំង និងខ្សែច្រវាក់ផ្គត់ផ្គង់រៀបចំពិព័រណ៍។',
        zh: '负责场馆物资运输、装卸货区调度、设备仓储管理及现场物资保障供应。',
        en: 'Manages freight transport, loading docks, equipment warehousing, venue facilities, and physical supply lines.'
      }
    };

    const desc = descDictionary[sub.id]?.[language] || sub.description;
    return {
      key: locName,
      name: locName,
      desc: desc
    };
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(12px, 3vw, 24px)' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
          <Users size={14} /> {t('committee.badge')}
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', fontWeight: '800', color: 'var(--text-main)', marginBottom: '14px', lineHeight: 'var(--line-height-heading)', letterSpacing: 'var(--letter-spacing-heading)', wordBreak: 'break-word' }}>
          {t('committee.title')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto', lineHeight: 'var(--line-height-base)' }}>
          {t('committee.subtitle')}
        </p>

        {/* Official Standard Provision Banner */}
        <div style={{
          marginTop: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '10px 22px',
          borderRadius: '999px',
          fontSize: '0.85rem',
          color: 'var(--text-main)',
          fontWeight: '700',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.12)'
        }}>
          <ShieldCheck size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
          <span>
            {COMMITTEE_STANDARD_PROVISION[language] || COMMITTEE_STANDARD_PROVISION.en}
          </span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)', marginTop: '14px', fontSize: '0.9rem' }}>
            {language === 'km' ? 'កំពុងទាញយកទិន្នន័យគណៈកម្មការ...' : language === 'zh' ? '正在加载委员会信息...' : 'Loading committees...'}
          </p>
        </div>
      ) : (
        <>
          {/* Main Executive Committee */}
          {mainCommittee && (
            <section style={{ marginBottom: '60px' }}>
              <div className="glass-panel" style={{
                padding: '36px',
                borderLeft: '5px solid var(--primary)',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.06) 100%)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {t('committee.mainCommittee.tag')}
                  </span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{t('committee.mainCommittee.scope')}</span>
                </div>

                <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                  {t('committee.mainCommittee.name')}
                </h2>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '780px', lineHeight: '1.6', marginBottom: '28px' }}>
                  {t('committee.mainCommittee.description')}
                </p>

                {/* Committee Head Card & Members */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '20px' }}>
                  {/* Lead */}
                  {mainCommittee.lead && (
                    <div className="glass-panel" style={{ padding: '24px', background: 'var(--btn-secondary-bg)', border: '1px solid var(--primary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>
                            {mainCommittee.lead.avatar || '👨‍💼'}
                          </div>
                          <div>
                            <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1.05rem', lineHeight: '1.2' }}>
                              {mainCommittee.lead.name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', marginTop: '2px', lineHeight: '1.3' }}>
                              {localizeOfficeRole(mainCommittee.lead.role, true, language)}
                            </div>
                          </div>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.55', marginBottom: '16px' }}>
                          {mainCommittee.lead.bio || mainCommittee.description}
                        </p>
                      </div>

                      {/* Committee Badge (Public Privacy: Committee Affiliation instead of username) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 12px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          background: 'rgba(99, 102, 241, 0.15)',
                          color: 'var(--primary)',
                          border: '1px solid rgba(99, 102, 241, 0.3)'
                        }}>
                          <Layers size={13} />
                          <span>{t('committee.mainCommittee.name')}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Other Members */}
                  {Array.isArray(mainCommittee.members) && mainCommittee.members.map((member, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '24px', background: 'var(--btn-secondary-bg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--btn-secondary-bg)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>
                            {member.avatar || '👤'}
                          </div>
                          <div>
                            <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1.05rem', lineHeight: '1.2' }}>
                              {member.name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px', lineHeight: '1.3' }}>
                              {localizeOfficeRole(member.role, true, language)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Committee Affiliations (Public Privacy: Shows Committee + Sub-committee without usernames) */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            background: 'rgba(99, 102, 241, 0.15)',
                            color: 'var(--primary)',
                            border: '1px solid rgba(99, 102, 241, 0.3)'
                          }}>
                            <Layers size={12} />
                            <span>{t('committee.mainCommittee.name')}</span>
                          </span>

                          {(member.subCommittee || member.alsoIn) && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              background: 'rgba(239, 68, 68, 0.12)',
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.3)'
                            }}>
                              <ShieldCheck size={12} />
                              <span>{getSubCommitteeLocalizedName(member.subCommittee || member.alsoIn, language)}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Sub-Committees Section */}
          <section>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                {t('committee.subCommitteesTitle')}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                {t('committee.subCommitteesSubtitle')}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px' }}>
              {subCommittees.map((sub) => {
                const localized = getSubInfo(sub);

                return (
                  <div
                    key={sub.id || sub.key}
                    className="glass-card"
                    style={{
                      padding: '28px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderTop: `4px solid ${sub.color || '#6366f1'}`
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          background: `${sub.color || '#6366f1'}20`,
                          color: sub.color || '#6366f1',
                          border: `1px solid ${sub.color || '#6366f1'}40`
                        }}>
                          {localized.key}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '600' }}>
                          {sub.memberCount ?? (sub.members?.length || 0)} {t('committee.officers')}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                        {localized.name}
                      </h3>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '20px' }}>
                        {localized.desc}
                      </p>

                      {/* Sub-Committee Lead (Full Name + Position + Committee) */}
                      {sub.lead && (
                        <div style={{ background: 'var(--btn-secondary-bg)', padding: '14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', border: '1px solid var(--border-subtle)' }}>
                          <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{sub.lead.avatar || '🏛️'}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.925rem' }}>
                              {sub.lead.name === 'To Be Appointed'
                                ? (language === 'km' ? 'រង់ចាំការចាត់តាំង' : language === 'zh' ? '待任命' : 'To Be Appointed')
                                : sub.lead.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: sub.color || 'var(--primary)', fontWeight: '700', marginTop: '2px' }}>
                              {localizeOfficeRole(sub.lead.role, false, language)}
                            </div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: sub.color || 'var(--primary)', fontWeight: '700', marginTop: '4px' }}>
                              <ShieldCheck size={12} />
                              <span>{localized.name}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sub-Committee Members */}
                      {Array.isArray(sub.members) && sub.members.length > 0 && (() => {
                        const subKey = sub.id || sub.key;
                        const isExpanded = !!expandedSubs[subKey];
                        const visible = isExpanded ? sub.members : sub.members.slice(0, 4);

                        return (
                          <div style={{ marginBottom: '16px' }}>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                maxHeight: isExpanded ? '420px' : 'none',
                                overflowY: isExpanded ? 'auto' : 'visible',
                                paddingRight: isExpanded ? '6px' : '0'
                              }}
                            >
                              {visible.map((sm, idx) => (
                                <div key={idx} style={{ background: 'var(--btn-secondary-bg)', padding: '12px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--border-subtle)' }}>
                                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{sm.avatar || '👤'}</span>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {sm.name}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '1px' }}>
                                      {localizeOfficeRole(sm.role, false, language)}
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                                      {(() => {
                                        const rLower = (sm.role || '').toLowerCase();
                                        const isCoPres = rLower.includes('co-pres') || rLower.includes('copres') || rLower.includes('សហប្រធាន') || rLower.includes('共同主席');
                                        if (isCoPres) {
                                          return (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#8b5cf6', fontWeight: '800', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.35)', padding: '1px 6px', borderRadius: '4px' }}>
                                              ⭐ {language === 'km' ? 'សហប្រធានអនុគណៈកម្មការ' : language === 'zh' ? '分委员会共同主席' : 'Co-President of the Subcommittee'}
                                            </span>
                                          );
                                        }
                                        return null;
                                      })()}
                                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: sub.color || 'var(--primary)', fontWeight: '700' }}>
                                        <ShieldCheck size={11} />
                                        <span>{localized.name}</span>
                                      </span>
                                      {sm.centralCommittee && (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '700', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '1px 6px', borderRadius: '4px' }}>
                                          <Layers size={11} />
                                          <span>{t('committee.mainCommittee.name')}</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {sub.members.length > 4 && (
                              <button
                                type="button"
                                onClick={() => setExpandedSubs(prev => ({ ...prev, [subKey]: !prev[subKey] }))}
                                className="btn btn-secondary btn-sm"
                                style={{
                                  width: '100%',
                                  marginTop: '10px',
                                  fontSize: '0.78rem',
                                  padding: '8px 12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '6px'
                                }}
                              >
                                {isExpanded 
                                  ? (language === 'km' ? '▲ បង្រួមបញ្ជី' : language === 'zh' ? '▲ 收起名单' : '▲ Show Less')
                                  : (language === 'km' ? `+ បង្ហាញសមាជិកទាំងអស់ (${sub.members.length} នាក់)` : language === 'zh' ? `+ 查看全部 ${sub.members.length} 位成员` : `+ Show All ${sub.members.length} Members`)}
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Actions & Routing */}
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={13} color={sub.color || 'var(--primary)'} />
                        <span style={{ fontWeight: '700', color: sub.color || 'var(--primary)' }}>{localized.name}</span>
                      </span>

                      <Link
                        href={`/submit?category=${(sub.categories && sub.categories[0]) || 'booth'}`}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.775rem' }}
                      >
                        <span>{t('committee.submitToSubBtn')}</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* Review Workflow Diagram */}
      <section style={{ marginTop: '60px' }}>
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
            {t('committee.protocolTitle')}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '620px', margin: '0 auto 28px' }}>
            {t('committee.protocolSubtitle')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '20px', textAlign: 'left' }}>
            <div style={{ padding: '18px', background: 'var(--btn-secondary-bg)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '6px' }}>{t('committee.step1Title')}</div>
              <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '4px' }}>{t('submit.title')}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('committee.step1Desc')}</div>
            </div>

            <div style={{ padding: '18px', background: 'var(--btn-secondary-bg)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: '#0284c7', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '6px' }}>{t('committee.step2Title')}</div>
              <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '4px' }}>{t('committee.subCommitteesTitle')}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('committee.step2Desc')}</div>
            </div>

            <div style={{ padding: '18px', background: 'var(--btn-secondary-bg)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: '#10b981', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '6px' }}>{t('committee.step3Title')}</div>
              <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '4px' }}>{t('admin.tabs.approved')}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('committee.step3Desc')}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
