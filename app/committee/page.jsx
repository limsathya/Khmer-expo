'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Users, 
  ShieldCheck, 
  User, 
  Layers, 
  Search,
  Table as TableIcon,
  LayoutGrid,
  FolderTree,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Award,
  RefreshCw,
  Copy,
  Check,
  Filter,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { 
  MAIN_COMMITTEE as FALLBACK_MAIN, 
  SUB_COMMITTEES as FALLBACK_SUBS, 
  getSubCommitteeLocalizedName,
  localizeOfficeRole,
  COMMITTEE_STANDARD_PROVISION,
  getWorkingGroupsForCommittee,
  getWorkingGroupLocalizedName
} from '@/lib/committees';
import { useLanguage } from '@/components/LanguageProvider';

export default function CommitteePage() {
  const { t, language } = useLanguage();
  const [mainCommittee, setMainCommittee] = useState(FALLBACK_MAIN);
  const [subCommittees, setSubCommittees] = useState(FALLBACK_SUBS);
  const [loading, setLoading] = useState(true);

  // Active view: 'all' for overview grid, or committee ID (e.g. 'sub_arts', 'main-committee') for deep-dive roster
  const [activeTab, setActiveTab] = useState('all');

  // Search, filter & view modes inside deep-dive roster (Built for 50+ to 100+ members)
  const [memberSearch, setMemberSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'leadership', 'members', 'cross'
  const [squadFilter, setSquadFilter] = useState('all'); // 'all' or specific squad key/name
  const [rosterViewMode, setRosterViewMode] = useState('grid'); // 'grid', 'table', 'squads'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [copiedRoster, setCopiedRoster] = useState(false);

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

  // Combined list of all 10 committees with normalized data
  const allCommittees = useMemo(() => {
    const list = [];
    if (mainCommittee) {
      list.push({ ...mainCommittee, id: 'main-committee', type: 'main' });
    }
    if (Array.isArray(subCommittees)) {
      subCommittees.forEach(s => list.push({ ...s, type: 'sub' }));
    }
    return list;
  }, [mainCommittee, subCommittees]);

  // Total metrics across the entire expo
  const totalStats = useMemo(() => {
    let totalPersonnel = 0;
    let totalPresidents = 0;
    let totalCoPresidents = 0;

    allCommittees.forEach(c => {
      const memCount = Array.isArray(c.members) ? c.members.length : 0;
      const hasLead = Boolean(c.lead && c.lead.name && c.lead.name !== 'To Be Appointed');
      totalPersonnel += memCount + (hasLead ? 1 : 0);

      if (hasLead) totalPresidents++;

      if (Array.isArray(c.members)) {
        c.members.forEach(m => {
          const r = (m.role || '').toLowerCase();
          if (r.includes('co-pres') || r.includes('copres') || r.includes('សហប្រធាន') || r.includes('共同主席')) {
            totalCoPresidents++;
          }
        });
      }
    });

    return {
      committees: allCommittees.length,
      personnel: totalPersonnel,
      presidents: totalPresidents,
      coPresidents: totalCoPresidents
    };
  }, [allCommittees]);

  // Selected committee when viewing in deep-dive mode
  const currentSelectedCommittee = useMemo(() => {
    if (activeTab === 'all') return null;
    return allCommittees.find(c => c.id === activeTab || c.key === activeTab) || null;
  }, [activeTab, allCommittees]);

  // Reset pagination & filters when switching committee tabs
  const handleSelectCommitteeTab = (tabId) => {
    setActiveTab(tabId);
    setMemberSearch('');
    setRoleFilter('all');
    setSquadFilter('all');
    setCurrentPage(1);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }
  };

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

  // Structured member lists for current selected committee
  const currentMembersList = useMemo(() => {
    if (!currentSelectedCommittee) return [];
    const list = [];

    // Lead (President)
    if (currentSelectedCommittee.lead && currentSelectedCommittee.lead.name && currentSelectedCommittee.lead.name !== 'To Be Appointed') {
      list.push({
        ...currentSelectedCommittee.lead,
        isLead: true,
        roleType: 'president',
        workingGroup: currentSelectedCommittee.lead.workingGroup || 'Executive Leadership'
      });
    }

    // Members
    if (Array.isArray(currentSelectedCommittee.members)) {
      currentSelectedCommittee.members.forEach(m => {
        const rLower = (m.role || '').toLowerCase();
        const isCoPres = rLower.includes('co-pres') || rLower.includes('copres') || rLower.includes('សហប្រធាន') || rLower.includes('共同主席');
        const isPres = !isCoPres && (rLower.includes('presid') || rLower.includes('chair') || rLower.includes('lead') || rLower.includes('ប្រធាន') || rLower.includes('主席'));

        list.push({
          ...m,
          isLead: false,
          roleType: isPres ? 'president' : isCoPres ? 'co_president' : 'member',
          workingGroup: m.workingGroup || m.team || ''
        });
      });
    }

    return list;
  }, [currentSelectedCommittee]);

  // Working squads for current committee
  const committeeSquads = useMemo(() => {
    if (!currentSelectedCommittee) return [];
    return getWorkingGroupsForCommittee(currentSelectedCommittee.id || currentSelectedCommittee.key, language);
  }, [currentSelectedCommittee, language]);

  // Filtered members inside current committee (Search + Role + Squad filters)
  const filteredCurrentMembers = useMemo(() => {
    let result = [...currentMembersList];

    // Search query
    if (memberSearch.trim()) {
      const q = memberSearch.toLowerCase().trim();
      result = result.filter(m => 
        (m.name || '').toLowerCase().includes(q) ||
        (m.role || '').toLowerCase().includes(q) ||
        (m.workingGroup || '').toLowerCase().includes(q)
      );
    }

    // Role Filter
    if (roleFilter === 'leadership') {
      result = result.filter(m => m.roleType === 'president' || m.roleType === 'co_president');
    } else if (roleFilter === 'members') {
      result = result.filter(m => m.roleType === 'member');
    } else if (roleFilter === 'cross') {
      result = result.filter(m => m.centralCommittee || m.subCommittee || m.alsoInCentralCommittee);
    }

    // Squad Filter
    if (squadFilter !== 'all') {
      result = result.filter(m => {
        if (!m.workingGroup) return false;
        return m.workingGroup.toLowerCase().includes(squadFilter.toLowerCase());
      });
    }

    return result;
  }, [currentMembersList, memberSearch, roleFilter, squadFilter]);

  // Pagination for 50+ to 100+ members
  const totalPages = Math.ceil(filteredCurrentMembers.length / pageSize) || 1;
  const paginatedMembers = useMemo(() => {
    if (pageSize === 0) return filteredCurrentMembers; // Show all
    const start = (currentPage - 1) * pageSize;
    return filteredCurrentMembers.slice(start, start + pageSize);
  }, [filteredCurrentMembers, currentPage, pageSize]);

  // Copy full roster to clipboard
  const handleCopyRoster = () => {
    if (!filteredCurrentMembers.length) return;
    const header = `${currentSelectedCommittee?.name || 'Committee'} Roster (${filteredCurrentMembers.length} members):\n`;
    const lines = filteredCurrentMembers.map((m, idx) => 
      `${idx + 1}. ${m.name} - ${localizeOfficeRole(m.role, currentSelectedCommittee?.type === 'main', language)}${m.workingGroup ? ` [${m.workingGroup}]` : ''}`
    ).join('\n');
    navigator.clipboard.writeText(header + lines);
    setCopiedRoster(true);
    setTimeout(() => setCopiedRoster(false), 2000);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(12px, 3vw, 24px)' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 16px',
          borderRadius: '9999px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.28)',
          color: 'var(--primary)',
          fontSize: '0.8rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '16px'
        }}>
          <Users size={14} /> {t('committee.badge')} • {totalStats.committees} Committees
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', fontWeight: '800', color: 'var(--text-main)', marginBottom: '14px', lineHeight: 'var(--line-height-heading)', letterSpacing: 'var(--letter-spacing-heading)', wordBreak: 'break-word' }}>
          {t('committee.title')}
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '720px', margin: '0 auto', lineHeight: 'var(--line-height-base)' }}>
          {t('committee.subtitle')}
        </p>

        {/* Official Standard Provision Banner (Trilingual Law) */}
        <div style={{
          marginTop: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.1) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          padding: '12px 24px',
          borderRadius: '999px',
          fontSize: '0.875rem',
          color: 'var(--text-main)',
          fontWeight: '700',
          boxShadow: '0 4px 16px rgba(99, 102, 241, 0.14)'
        }}>
          <ShieldCheck size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
          <span>
            {COMMITTEE_STANDARD_PROVISION[language] || COMMITTEE_STANDARD_PROVISION.en}
          </span>
        </div>

        {/* Macro Statistics Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          maxWidth: '820px',
          margin: '28px auto 0'
        }}>
          <div className="glass-panel" style={{ padding: '14px 18px', textAlign: 'center', background: 'var(--btn-secondary-bg)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>{totalStats.committees}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              {language === 'km' ? 'គណៈកម្មការ & អនុគណៈកម្មការ' : language === 'zh' ? '中央及分委员会' : 'Committees & Subs'}
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '14px 18px', textAlign: 'center', background: 'var(--btn-secondary-bg)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f59e0b' }}>👑 {totalStats.presidents}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              {language === 'km' ? 'ប្រធានគណៈកម្មការ' : language === 'zh' ? '委员会主席' : 'Presidents'}
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '14px 18px', textAlign: 'center', background: 'var(--btn-secondary-bg)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#8b5cf6' }}>⭐ {totalStats.coPresidents}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              {language === 'km' ? 'សហប្រធាន' : language === 'zh' ? '共同主席' : 'Co-Presidents'}
            </div>
          </div>
          <div className="glass-panel" style={{ padding: '14px 18px', textAlign: 'center', background: 'var(--btn-secondary-bg)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#10b981' }}>👥 {totalStats.personnel}+</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              {language === 'km' ? 'សមាជិកប្រតិបត្តិការសរុប' : language === 'zh' ? '登记在册人员总数' : 'Total Personnel'}
            </div>
          </div>
        </div>
      </div>

      {/* HORIZONTAL COMMITTEE SELECTOR / TABS NAVIGATION (Instant Switching for 50+ Members Scale) */}
      <div style={{
        position: 'sticky',
        top: '12px',
        zIndex: 30,
        marginBottom: '36px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        padding: '10px 14px',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'none'
        }}>
          {/* All Overview Pill */}
          <button
            type="button"
            onClick={() => handleSelectCommitteeTab('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.825rem',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              border: activeTab === 'all' ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
              background: activeTab === 'all' ? 'var(--primary)' : 'var(--btn-secondary-bg)',
              color: activeTab === 'all' ? '#fff' : 'var(--text-muted)'
            }}
          >
            <span>🏛️</span>
            <span>{language === 'km' ? 'ទិដ្ឋភាពរួម (All Committees)' : language === 'zh' ? '全部委员会总览' : 'All Committees Overview'}</span>
          </button>

          {/* Central Committee Pill */}
          {mainCommittee && (
            <button
              type="button"
              onClick={() => handleSelectCommitteeTab('main-committee')}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.825rem',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
                border: activeTab === 'main-committee' ? '1.5px solid #6366f1' : '1px solid var(--border-subtle)',
                background: activeTab === 'main-committee' ? 'rgba(99, 102, 241, 0.25)' : 'var(--btn-secondary-bg)',
                color: activeTab === 'main-committee' ? '#fff' : 'var(--text-muted)'
              }}
            >
              <span>👑</span>
              <span>{getSubCommitteeLocalizedName('Central Committee', language)}</span>
              <span style={{ fontSize: '0.72rem', background: 'rgba(99, 102, 241, 0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                {(Array.isArray(mainCommittee.members) ? mainCommittee.members.length : 0) + (mainCommittee.lead?.name ? 1 : 0)}
              </span>
            </button>
          )}

          {/* 9 Sub-Committees Pills */}
          {subCommittees.map(sub => {
            const hasLead = Boolean(sub.lead && sub.lead.name && sub.lead.name !== 'To Be Appointed');
            const count = (Array.isArray(sub.members) ? sub.members.length : 0) + (hasLead ? 1 : 0);
            const isSelected = activeTab === sub.id || activeTab === sub.key;

            return (
              <button
                key={sub.id || sub.key}
                type="button"
                onClick={() => handleSelectCommitteeTab(sub.id || sub.key)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.825rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                  border: isSelected ? `1.5px solid ${sub.color || 'var(--primary)'}` : '1px solid var(--border-subtle)',
                  background: isSelected ? `${sub.color || '#6366f1'}30` : 'var(--btn-secondary-bg)',
                  color: isSelected ? '#fff' : 'var(--text-muted)'
                }}
              >
                <span>{sub.lead?.avatar || '🏛️'}</span>
                <span>{getSubCommitteeLocalizedName(sub.id || sub.key, language)}</span>
                <span style={{
                  fontSize: '0.72rem',
                  background: count >= 50 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                  color: count >= 50 ? '#fca5a5' : 'inherit',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: '800'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)', marginTop: '14px', fontSize: '0.9rem' }}>
            {language === 'km' ? 'កំពុងទាញយកទិន្នន័យគណៈកម្មការ...' : language === 'zh' ? '正在加载委员会信息...' : 'Loading committees...'}
          </p>
        </div>
      ) : activeTab === 'all' ? (
        /* ========================================================
           MODE 1: ALL COMMITTEES EXECUTIVE OVERVIEW GRID
           ======================================================== */
        <>
          {/* Main Executive Committee */}
          {mainCommittee && (
            <section style={{ marginBottom: '60px' }}>
              <div className="glass-panel" style={{
                padding: '36px',
                borderLeft: '5px solid var(--primary)',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.06) 100%)',
                borderRadius: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

                  <button
                    onClick={() => handleSelectCommitteeTab('main-committee')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>{language === 'km' ? 'មើលរចនាសម្ព័ន្ធលម្អិត' : language === 'zh' ? '查看中央委名册' : 'View Full Roster'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px' }}>
                  {t('committee.mainCommittee.name')}
                </h2>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '820px', lineHeight: '1.6', marginBottom: '24px' }}>
                  {t('committee.mainCommittee.description')}
                </p>

                {/* Central Committee Functional Working Squads */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  {getWorkingGroupsForCommittee('main-committee', language).map(squad => (
                    <div key={squad.key} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      background: 'rgba(99, 102, 241, 0.12)',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      color: 'var(--text-main)'
                    }}>
                      <span>{squad.icon}</span>
                      <span>{squad.name}</span>
                    </div>
                  ))}
                </div>

                {/* Committee Head Card & Members */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
                  {/* Lead / President */}
                  {mainCommittee.lead && (
                    <div className="glass-panel" style={{ padding: '22px', background: 'var(--btn-secondary-bg)', border: '1.5px solid var(--primary)', borderRadius: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>
                            {mainCommittee.lead.avatar || '👨‍💼'}
                          </div>
                          <div>
                            <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1.1rem', lineHeight: '1.2' }}>
                              {mainCommittee.lead.name}
                            </div>
                            <div style={{ fontSize: '0.825rem', color: '#f59e0b', fontWeight: '800', marginTop: '3px' }}>
                              👑 {localizeOfficeRole(mainCommittee.lead.role, true, language)}
                            </div>
                          </div>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.55', marginBottom: '16px' }}>
                          {mainCommittee.lead.bio || mainCommittee.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)' }}>
                          🏛️ {t('committee.mainCommittee.name')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Members Preview */}
                  {Array.isArray(mainCommittee.members) && mainCommittee.members.map((member, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '22px', background: 'var(--btn-secondary-bg)', borderRadius: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
                          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--btn-secondary-bg)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>
                            {member.avatar || '👤'}
                          </div>
                          <div>
                            <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1.05rem', lineHeight: '1.2' }}>
                              {member.name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', marginTop: '3px' }}>
                              {localizeOfficeRole(member.role, true, language)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                          {member.workingGroup ? `🏢 ${member.workingGroup}` : `🏛️ ${t('committee.mainCommittee.name')}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Sub-Committees Overview Section */}
          <section>
            <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
                  {t('committee.subCommitteesTitle')}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  {t('committee.subCommitteesSubtitle')}
                </p>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: '700' }}>
                {language === 'km' ? 'ចុចលើកាតដើម្បីមើលបញ្ជីឈ្មោះសមាជិក ៥០+ នាក់' : language === 'zh' ? '点击各分会即可查看 50+ 完整名册' : 'Click any committee to explore 50+ member roster'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '24px' }}>
              {subCommittees.map((sub) => {
                const localized = getSubInfo(sub);
                const hasLead = Boolean(sub.lead && sub.lead.name && sub.lead.name !== 'To Be Appointed');
                const rawCount = (Array.isArray(sub.members) ? sub.members.length : 0) + (hasLead ? 1 : 0);
                const squads = getWorkingGroupsForCommittee(sub.id || sub.key, language);

                return (
                  <div
                    key={sub.id || sub.key}
                    className="glass-card"
                    style={{
                      padding: '28px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderTop: `4px solid ${sub.color || '#6366f1'}`,
                      borderRadius: '16px',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    <div>
                      {/* Top Badges */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          background: `${sub.color || '#6366f1'}20`,
                          color: sub.color || '#6366f1',
                          border: `1px solid ${sub.color || '#6366f1'}40`
                        }}>
                          {localized.key}
                        </span>

                        <span style={{
                          fontSize: '0.8rem',
                          fontWeight: '800',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          background: rawCount >= 50 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.12)',
                          color: rawCount >= 50 ? '#ef4444' : 'var(--primary)',
                          border: rawCount >= 50 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(99, 102, 241, 0.25)'
                        }}>
                          👥 {rawCount} {t('committee.officers')}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '10px', lineHeight: '1.3' }}>
                        {localized.name}
                      </h3>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '20px' }}>
                        {localized.desc}
                      </p>

                      {/* President / Leadership Card */}
                      {hasLead ? (
                        <div style={{ background: 'var(--btn-secondary-bg)', padding: '14px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', border: '1px solid var(--border-subtle)' }}>
                          <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{sub.lead.avatar || '🏛️'}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                              {sub.lead.name}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: '800', marginTop: '2px' }}>
                              👑 {localizeOfficeRole(sub.lead.role, false, language)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', border: '1px dashed var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                          <span>🏛️</span>
                          <span>{language === 'km' ? 'រង់ចាំការចាត់តាំងប្រធាន' : language === 'zh' ? '待任命分会主席' : 'President To Be Appointed'}</span>
                        </div>
                      )}

                      {/* 3 Functional Working Groups Pills */}
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
                          {language === 'km' ? 'ក្រុមការងារឯកទេស ៣ កម្រិត' : language === 'zh' ? '下设三大职能工作组' : '3 Functional Working Squads'}:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {squads.map(sq => (
                            <div key={sq.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.03)', padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                              <span>{sq.icon}</span>
                              <span style={{ fontWeight: '600', color: 'var(--text-main)', flex: 1 }}>{sq.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => handleSelectCommitteeTab(sub.id || sub.key)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.8rem', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Users size={13} />
                        <span>{language === 'km' ? `បញ្ជីឈ្មោះសមាជិក (${rawCount})` : language === 'zh' ? `打开完整花名册 (${rawCount})` : `Full Roster (${rawCount})`}</span>
                        <ArrowRight size={13} />
                      </button>

                      <Link
                        href={`/submit?category=${(sub.categories && sub.categories[0]) || 'booth'}`}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.775rem' }}
                      >
                        <span>{t('committee.submitToSubBtn')}</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      ) : (
        /* ========================================================
           MODE 2: DEDICATED DEEP-DIVE FOR 50+ TO 100+ MEMBERS
           ======================================================== */
        currentSelectedCommittee && (
          <section>
            {/* Back Button & Committee Banner */}
            <div style={{ marginBottom: '28px' }}>
              <button
                type="button"
                onClick={() => handleSelectCommitteeTab('all')}
                className="btn btn-secondary btn-sm"
                style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <ChevronLeft size={14} />
                <span>{language === 'km' ? '← ត្រឡប់ទៅទិដ្ឋភាពរួមគណៈកម្មការទាំងអស់' : language === 'zh' ? '← 返回全部委员会总览' : '← Back to All Committees Overview'}</span>
              </button>

              <div className="glass-panel" style={{
                padding: '36px',
                borderRadius: '18px',
                borderLeft: `6px solid ${currentSelectedCommittee.color || '#6366f1'}`,
                background: `linear-gradient(135deg, ${currentSelectedCommittee.color || '#6366f1'}15 0%, rgba(15, 23, 42, 0.6) 100%)`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
                  <div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      background: `${currentSelectedCommittee.color || '#6366f1'}30`,
                      color: currentSelectedCommittee.color || '#6366f1',
                      border: `1px solid ${currentSelectedCommittee.color || '#6366f1'}50`,
                      textTransform: 'uppercase'
                    }}>
                      {getSubCommitteeLocalizedName(currentSelectedCommittee.id || currentSelectedCommittee.key, language)}
                    </span>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px' }}>
                      {getSubCommitteeLocalizedName(currentSelectedCommittee.id || currentSelectedCommittee.key, language)}
                    </h2>
                  </div>

                  {/* Personnel Badge */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)' }}>
                      {currentMembersList.length}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>
                      {language === 'km' ? 'សមាជិកប្រតិបត្តិការសរុប' : language === 'zh' ? '在册成员总人数' : 'Registered Personnel'}
                    </div>
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '880px', lineHeight: '1.6', marginBottom: '24px' }}>
                  {getSubInfo(currentSelectedCommittee).desc}
                </p>

                {/* Provision Banner */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.28)',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.825rem',
                  fontWeight: '700',
                  color: 'var(--text-main)'
                }}>
                  <ShieldCheck size={16} color="var(--primary)" />
                  <span>{COMMITTEE_STANDARD_PROVISION[language] || COMMITTEE_STANDARD_PROVISION.en}</span>
                </div>
              </div>
            </div>

            {/* TIER 1: EXECUTIVE LEADERSHIP (Presidents & Co-Presidents) */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.2rem' }}>👑</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {language === 'km' ? 'ថ្នាក់ដឹកនាំគណៈកម្មការ (Executive Leadership)' : language === 'zh' ? '分会主席与共同主席 (领导核心)' : 'Executive Leadership (Presidents & Co-Presidents)'}
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '18px' }}>
                {currentMembersList
                  .filter(m => m.roleType === 'president' || m.roleType === 'co_president')
                  .map((leader, i) => {
                    const isPres = leader.roleType === 'president';
                    const isMain = currentSelectedCommittee.type === 'main';
                    const locRole = localizeOfficeRole(leader.role, isMain, language);

                    return (
                      <div
                        key={leader.id || `${leader.name}-${i}`}
                        className="glass-card"
                        style={{
                          padding: '24px',
                          border: isPres ? '2px solid #f59e0b' : '1.5px solid #8b5cf6',
                          background: isPres ? 'rgba(245, 158, 11, 0.05)' : 'rgba(139, 92, 246, 0.05)',
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '18px'
                        }}
                      >
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '16px',
                          background: isPres ? 'rgba(245, 158, 11, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2rem',
                          flexShrink: 0
                        }}>
                          {leader.avatar || (isPres ? '👨‍💼' : '⭐')}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: '900', fontSize: '1.15rem', color: 'var(--text-main)' }}>
                            {leader.name}
                          </div>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.825rem',
                            fontWeight: '800',
                            color: isPres ? '#f59e0b' : '#8b5cf6',
                            marginTop: '4px'
                          }}>
                            <span>{isPres ? '👑' : '⭐'}</span>
                            <span>{locRole}</span>
                          </div>
                          {leader.workingGroup && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                              🏢 {leader.workingGroup}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* TIER 2: FUNCTIONAL WORKING SQUADS (3 Squads per Committee) */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '1.2rem' }}>🏢</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {language === 'km' ? 'ក្រុមការងារឯកទេសទាំង ៣ (Functional Working Squads)' : language === 'zh' ? '三大职能工作组架构' : '3 Functional Working Squads'}
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '18px' }}>
                {committeeSquads.map((squad) => {
                  const assignedCount = currentMembersList.filter(m => m.workingGroup && m.workingGroup.toLowerCase().includes(squad.key.toLowerCase())).length;
                  const isFiltered = squadFilter.toLowerCase() === squad.key.toLowerCase();

                  return (
                    <div
                      key={squad.key}
                      onClick={() => setSquadFilter(isFiltered ? 'all' : squad.key)}
                      className="glass-card"
                      style={{
                        padding: '22px',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        border: isFiltered ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                        background: isFiltered ? 'rgba(99, 102, 241, 0.12)' : 'var(--card-bg)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <span style={{ fontSize: '1.8rem' }}>{squad.icon}</span>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: isFiltered ? 'var(--primary)' : 'var(--btn-secondary-bg)',
                          color: isFiltered ? '#fff' : 'var(--text-muted)'
                        }}>
                          {isFiltered ? 'Filter Active' : `${assignedCount} Members`}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
                        {squad.name}
                      </h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', lineHeight: '1.5' }}>
                        {squad.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TIER 3: FULL MEMBER DIRECTORY (Engineered for 50+ to 100+ Members) */}
            <div style={{ marginBottom: '60px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>👥</span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {language === 'km' ? 'បញ្ជីរាយនាមសមាជិកពេញលេញ (Full Directory)' : language === 'zh' ? '完整委员花名册 (支持50+成员检阅)' : 'Complete Personnel Directory (50+ Supported)'}
                  </h3>
                  <span style={{ fontSize: '0.825rem', fontWeight: '800', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.12)', padding: '2px 10px', borderRadius: '999px' }}>
                    {filteredCurrentMembers.length} {language === 'km' ? 'នាក់' : language === 'zh' ? '人' : 'members'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* View Mode Switcher */}
                  <div style={{ display: 'flex', background: 'var(--btn-secondary-bg)', borderRadius: '10px', padding: '3px', border: '1px solid var(--border-subtle)' }}>
                    <button
                      type="button"
                      onClick={() => setRosterViewMode('grid')}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: rosterViewMode === 'grid' ? 'var(--primary)' : 'transparent',
                        color: rosterViewMode === 'grid' ? '#fff' : 'var(--text-muted)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        fontWeight: '700'
                      }}
                    >
                      <LayoutGrid size={14} /> <span>Grid</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRosterViewMode('table')}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: rosterViewMode === 'table' ? 'var(--primary)' : 'transparent',
                        color: rosterViewMode === 'table' ? '#fff' : 'var(--text-muted)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        fontWeight: '700'
                      }}
                    >
                      <TableIcon size={14} /> <span>Table</span>
                    </button>
                  </div>

                  {/* Copy Roster Button */}
                  <button
                    type="button"
                    onClick={handleCopyRoster}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                    title="Copy roster to clipboard"
                  >
                    {copiedRoster ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    <span>{copiedRoster ? 'Copied!' : 'Copy Roster'}</span>
                  </button>
                </div>
              </div>

              {/* SEARCH & FILTERS BAR */}
              <div style={{
                background: 'var(--btn-secondary-bg)',
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Instant Search Bar */}
                  <div style={{ flex: '1 1 280px', position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={(e) => { setMemberSearch(e.target.value); setCurrentPage(1); }}
                      placeholder={language === 'km' ? 'ស្វែងរកឈ្មោះសមាជិក ឬតួនាទី...' : language === 'zh' ? '快速搜索成员姓名或职务...' : 'Search members by name or title...'}
                      className="form-input"
                      style={{ paddingLeft: '38px', height: '40px', fontSize: '0.875rem' }}
                    />
                  </div>

                  {/* Role Filter Pills */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[
                      { key: 'all', label: language === 'km' ? 'ទាំងអស់ (All)' : language === 'zh' ? '全部' : 'All' },
                      { key: 'leadership', label: language === 'km' ? '👑 ថ្នាក់ដឹកនាំ' : language === 'zh' ? '👑 主席/共同主席' : '👑 Leadership' },
                      { key: 'members', label: language === 'km' ? '👤 សមាជិក' : language === 'zh' ? '👤 委员' : '👤 Members' },
                      { key: 'cross', label: language === 'km' ? '🛡️ គណៈកម្មការកណ្តាល' : language === 'zh' ? '🛡️ 中央兼任' : '🛡️ Central Dual' }
                    ].map(f => (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => { setRoleFilter(f.key); setCurrentPage(1); }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          border: roleFilter === f.key ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                          background: roleFilter === f.key ? 'rgba(99, 102, 241, 0.2)' : 'var(--card-bg)',
                          color: roleFilter === f.key ? 'var(--primary)' : 'var(--text-muted)',
                          cursor: 'pointer'
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Squad Filter Pills */}
                {committeeSquads.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-dim)' }}>
                      {language === 'km' ? 'ចម្រាញ់តាមក្រុមការងារ:' : language === 'zh' ? '工作组筛选:' : 'Squad Filter:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => { setSquadFilter('all'); setCurrentPage(1); }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: squadFilter === 'all' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                        background: squadFilter === 'all' ? 'var(--primary)' : 'transparent',
                        color: squadFilter === 'all' ? '#fff' : 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {language === 'km' ? 'ក្រុមទាំងអស់' : language === 'zh' ? '全部分组' : 'All Squads'}
                    </button>
                    {committeeSquads.map(sq => (
                      <button
                        key={sq.key}
                        type="button"
                        onClick={() => { setSquadFilter(sq.key); setCurrentPage(1); }}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          border: squadFilter === sq.key ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                          background: squadFilter === sq.key ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                          color: squadFilter === sq.key ? 'var(--primary)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>{sq.icon}</span>
                        <span>{sq.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ROSTER DISPLAY */}
              {filteredCurrentMembers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-dim)' }}>
                  <Users size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.95rem' }}>
                    {language === 'km' ? 'មិនមានសមាជិកត្រូវតាមការស្វែងរកនេះឡើយ' : language === 'zh' ? '没有匹配搜索条件的成员' : 'No members matched this search filter.'}
                  </p>
                </div>
              ) : rosterViewMode === 'table' ? (
                /* TABLE DIRECTORY VIEW */
                <div style={{ overflowX: 'auto', background: 'var(--card-bg)', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--btn-secondary-bg)' }}>
                        <th style={{ padding: '12px 16px', color: 'var(--text-dim)', width: '40px' }}>#</th>
                        <th style={{ padding: '12px 16px', color: 'var(--text-dim)' }}>{language === 'km' ? 'ឈ្មោះសមាជិក' : language === 'zh' ? '成员姓名' : 'Member Name'}</th>
                        <th style={{ padding: '12px 16px', color: 'var(--text-dim)' }}>{language === 'km' ? 'តួនាទីផ្លូវការ' : language === 'zh' ? '官方职务' : 'Official Role'}</th>
                        <th style={{ padding: '12px 16px', color: 'var(--text-dim)' }}>{language === 'km' ? 'ក្រុមការងារឯកទេស' : language === 'zh' ? '所属工作组' : 'Working Squad'}</th>
                        <th style={{ padding: '12px 16px', color: 'var(--text-dim)' }}>{language === 'km' ? 'គណៈកម្មការកណ្តាល' : language === 'zh' ? '兼职情况' : 'Affiliation'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedMembers.map((mem, index) => {
                        const globalIndex = (currentPage - 1) * pageSize + index + 1;
                        const isMain = currentSelectedCommittee.type === 'main';
                        const locRole = localizeOfficeRole(mem.role, isMain, language);
                        const isPres = mem.roleType === 'president';
                        const isCoPres = mem.roleType === 'co_president';
                        const isCross = !!(mem.centralCommittee || mem.subCommittee || mem.alsoInCentralCommittee);

                        return (
                          <tr key={mem.id || `${mem.name}-${index}`} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s ease' }}>
                            <td style={{ padding: '12px 16px', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                              {globalIndex}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '1.3rem' }}>{mem.avatar || '👤'}</span>
                                <span style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.925rem' }}>{mem.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              {isPres ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: '800', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '2px 8px', borderRadius: '6px' }}>
                                  👑 {locRole}
                                </span>
                              ) : isCoPres ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: '800', color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '2px 8px', borderRadius: '6px' }}>
                                  ⭐ {locRole}
                                </span>
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{locRole}</span>
                              )}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              {mem.workingGroup ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                                  <span>🏢</span> {mem.workingGroup}
                                </span>
                              ) : (
                                <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>—</span>
                              )}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              {isCross ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '2px 7px', borderRadius: '4px', fontWeight: '700' }}>
                                  <ShieldCheck size={11} />
                                  <span>{language === 'km' ? 'គណៈកម្មការកណ្តាល' : language === 'zh' ? '中央兼任' : 'Central Dual'}</span>
                                </span>
                              ) : (
                                <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* GRID CARD DIRECTORY VIEW (Engineered for High-Density 50+ to 100+ Members) */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '14px' }}>
                  {paginatedMembers.map((mem, index) => {
                    const globalIndex = (currentPage - 1) * pageSize + index + 1;
                    const isMain = currentSelectedCommittee.type === 'main';
                    const locRole = localizeOfficeRole(mem.role, isMain, language);
                    const isPres = mem.roleType === 'president';
                    const isCoPres = mem.roleType === 'co_president';
                    const isCross = !!(mem.centralCommittee || mem.subCommittee || mem.alsoInCentralCommittee);

                    return (
                      <div
                        key={mem.id || `${mem.name}-${index}`}
                        className="glass-card"
                        style={{
                          padding: '16px 18px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          border: isPres ? '1.5px solid #f59e0b' : isCoPres ? '1.5px solid #8b5cf6' : '1px solid var(--border-subtle)',
                          background: isPres ? 'rgba(245, 158, 11, 0.05)' : isCoPres ? 'rgba(139, 92, 246, 0.05)' : 'var(--card-bg)'
                        }}
                      >
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          background: 'var(--btn-secondary-bg)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.4rem',
                          flexShrink: 0
                        }}>
                          {mem.avatar || '👤'}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                            <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.925rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {mem.name}
                            </div>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '700' }}>#{globalIndex}</span>
                          </div>

                          <div style={{ fontSize: '0.78rem', color: isPres ? '#f59e0b' : isCoPres ? '#8b5cf6' : 'var(--text-muted)', fontWeight: isPres || isCoPres ? '800' : '600', marginTop: '2px' }}>
                            {isPres ? '👑 ' : isCoPres ? '⭐ ' : ''}{locRole}
                          </div>

                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                            {mem.workingGroup && (
                              <span style={{ fontSize: '0.68rem', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                                🏢 {mem.workingGroup}
                              </span>
                            )}
                            {isCross && (
                              <span style={{ fontSize: '0.68rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.12)', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                                🛡️ Central
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* PAGINATION CONTROLS (Seamlessly manages 50 to 100+ members) */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '24px', padding: '12px 18px', background: 'var(--btn-secondary-bg)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {language === 'km' ? 'កំពុងបង្ហាញ ' : language === 'zh' ? '正在显示 ' : 'Showing '}
                    <strong>{(currentPage - 1) * pageSize + 1}</strong> – <strong>{Math.min(currentPage * pageSize, filteredCurrentMembers.length)}</strong> {language === 'km' ? 'នៃសរុប ' : language === 'zh' ? '共 ' : 'of '} <strong>{filteredCurrentMembers.length}</strong> {language === 'km' ? 'នាក់' : language === 'zh' ? '位' : 'members'}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px 12px' }}
                    >
                      <ChevronLeft size={14} /> <span>Previous</span>
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', padding: '0 8px' }}>
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px 12px' }}
                    >
                      <span>Next</span> <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )
      )}

      {/* Review Protocol Diagram (Step 1 -> Step 2 -> Step 3) */}
      <section style={{ marginTop: '60px' }}>
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', borderRadius: '18px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
            {t('committee.protocolTitle')}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '640px', margin: '0 auto 28px' }}>
            {t('committee.protocolSubtitle')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '20px', textAlign: 'left' }}>
            <div style={{ padding: '20px', background: 'var(--btn-secondary-bg)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '6px' }}>{t('committee.step1Title')}</div>
              <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1rem', marginBottom: '4px' }}>{t('submit.title')}</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{t('committee.step1Desc')}</div>
            </div>

            <div style={{ padding: '20px', background: 'var(--btn-secondary-bg)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: '#0284c7', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '6px' }}>{t('committee.step2Title')}</div>
              <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1rem', marginBottom: '4px' }}>{t('committee.subCommitteesTitle')}</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{t('committee.step2Desc')}</div>
            </div>

            <div style={{ padding: '20px', background: 'var(--btn-secondary-bg)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: '#10b981', fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '6px' }}>{t('committee.step3Title')}</div>
              <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1rem', marginBottom: '4px' }}>{t('admin.tabs.approved')}</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{t('committee.step3Desc')}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
