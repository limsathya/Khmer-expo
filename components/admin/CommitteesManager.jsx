'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building, 
  Users, 
  Edit3, 
  Check, 
  X, 
  RefreshCw, 
  ShieldCheck, 
  Award, 
  Search, 
  UserPlus, 
  ChevronRight, 
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { 
  ALL_COMMITTEES_LIST, 
  getSubCommitteeLocalizedName, 
  localizeOfficeRole, 
  COMMITTEE_STANDARD_PROVISION, 
  OFFICIAL_OFFICE_TITLES,
  getWorkingGroupsForCommittee 
} from '@/lib/committees';

export default function CommitteesManager({ showToast }) {
  const { user, canManageEverything } = useAuth();
  const { t, language } = useLanguage();

  const [committees, setCommittees] = useState(ALL_COMMITTEES_LIST);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Setup / Edit Committee Modal
  const [editingCommittee, setEditingCommittee] = useState(null);
  const [formData, setFormData] = useState({
    selectedLeadMemberId: '',
    leadName: '',
    leadRole: '',
    leadAvatar: '👨‍💼',
    selectedCoLeadMemberId: '',
    coLeadName: '',
    coLeadRole: '',
    description: '',
    memberCount: 0
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [commRes, memRes] = await Promise.all([
        fetch('/api/committees'),
        fetch('/api/committees/members')
      ]);

      if (commRes.ok) {
        const commData = await commRes.json();
        if (Array.isArray(commData.all) && commData.all.length > 0) {
          setCommittees(commData.all);
        } else if (Array.isArray(commData.subCommittees)) {
          const main = commData.mainCommittee || ALL_COMMITTEES_LIST[0];
          setCommittees([main, ...commData.subCommittees]);
        }
      }

      if (memRes.ok) {
        const memData = await memRes.json();
        setAllMembers(Array.isArray(memData) ? memData : []);
      }
    } catch (err) {
      console.error('Error loading committees data:', err);
      if (showToast) showToast('Failed to load committees data', 'error');
    } finally {
      setLoading(false);
    }
  }

  // Filter committees by search query
  const filteredCommittees = useMemo(() => {
    if (!searchQuery.trim()) return committees;
    const q = searchQuery.toLowerCase().trim();
    return committees.filter(c => 
      (c.name || '').toLowerCase().includes(q) ||
      (c.key || '').toLowerCase().includes(q) ||
      (c.id || '').toLowerCase().includes(q) ||
      getSubCommitteeLocalizedName(c.key || c.id, language).toLowerCase().includes(q)
    );
  }, [committees, searchQuery, language]);

  // Open Edit/Setup Committee Modal
  const openSetupModal = (comm) => {
    setEditingCommittee(comm);

    // Find if the current lead exists in the roster
    const commKey = comm.key || comm.id;
    const commMembers = allMembers.filter(m => 
      m.committeeKey === commKey || 
      m.committeeId === comm.id || 
      m.committee === commKey ||
      m.committeeName === commKey
    );

    const existingLeadInRoster = commMembers.find(m => 
      m.name === comm.lead?.name || 
      (m.roleType === 'president') ||
      ((m.role || '').toLowerCase().includes('presid') && !(m.role || '').toLowerCase().includes('co-pres'))
    );

    const existingCoLeadInRoster = commMembers.find(m => 
      (m.role || '').toLowerCase().includes('co-pres') || 
      (m.role || '').toLowerCase().includes('copres') || 
      (m.role || '').toLowerCase().includes('សហប្រធាន') || 
      (m.role || '').toLowerCase().includes('共同主席')
    );

    const isMain = comm.type === 'main' || comm.id === 'main-committee';
    const defaultLeadRole = isMain ? 'President of the Committee' : 'President of the Subcommittee';
    const defaultCoRole = isMain ? 'Co-President of the Committee' : 'Co-President of the Subcommittee';

    setFormData({
      selectedLeadMemberId: existingLeadInRoster ? (existingLeadInRoster.id || existingLeadInRoster.name) : '',
      leadName: comm.lead?.name || '',
      leadRole: comm.lead?.role || defaultLeadRole,
      leadAvatar: comm.lead?.avatar || '👨‍💼',
      selectedCoLeadMemberId: existingCoLeadInRoster ? (existingCoLeadInRoster.id || existingCoLeadInRoster.name) : '',
      coLeadName: existingCoLeadInRoster ? existingCoLeadInRoster.name : '',
      coLeadRole: defaultCoRole,
      description: comm.description || '',
      memberCount: commMembers.length > 0 ? commMembers.length : (comm.memberCount ?? (comm.members?.length || 0))
    });
  };

  // When a member is chosen from the roster for President
  const handleSelectLeadMember = (memberId) => {
    if (!memberId) {
      setFormData(prev => ({
        ...prev,
        selectedLeadMemberId: '',
        leadName: '',
        leadAvatar: '👨‍💼'
      }));
      return;
    }

    const selectedMem = allMembers.find(m => (m.id === memberId || m.name === memberId));
    if (selectedMem) {
      const isMain = editingCommittee?.type === 'main' || editingCommittee?.id === 'main-committee';
      const officialRole = isMain ? 'President of the Committee' : 'President of the Subcommittee';

      setFormData(prev => ({
        ...prev,
        selectedLeadMemberId: memberId,
        leadName: selectedMem.name,
        leadAvatar: selectedMem.avatar || '👨‍💼',
        leadRole: officialRole
      }));
    }
  };

  // When a member is chosen from the roster for Co-President
  const handleSelectCoLeadMember = (memberId) => {
    if (!memberId) {
      setFormData(prev => ({
        ...prev,
        selectedCoLeadMemberId: '',
        coLeadName: ''
      }));
      return;
    }

    const selectedMem = allMembers.find(m => (m.id === memberId || m.name === memberId));
    if (selectedMem) {
      const isMain = editingCommittee?.type === 'main' || editingCommittee?.id === 'main-committee';
      const officialRole = isMain ? 'Co-President of the Committee' : 'Co-President of the Subcommittee';

      setFormData(prev => ({
        ...prev,
        selectedCoLeadMemberId: memberId,
        coLeadName: selectedMem.name,
        coLeadRole: officialRole
      }));
    }
  };

  // Save Committee Setup
  const handleSaveSetup = async (e) => {
    e.preventDefault();
    if (!editingCommittee) return;

    if (!formData.leadName) {
      if (showToast) showToast('Please select a President from the Member Roster.', 'error');
      return;
    }

    setSaving(true);
    try {
      const commId = editingCommittee.id || editingCommittee.key;
      const isMain = editingCommittee.type === 'main' || editingCommittee.id === 'main-committee';

      // 1. Update committee record in /api/committees
      const res = await fetch('/api/committees', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: commId,
          description: formData.description,
          memberCount: Number(formData.memberCount) >= 0 ? Number(formData.memberCount) : 0,
          lead: {
            name: formData.leadName,
            role: formData.leadRole || (isMain ? 'President of the Committee' : 'President of the Subcommittee'),
            avatar: formData.leadAvatar || '👨‍💼',
            username: editingCommittee.lead?.username || '',
            committee: editingCommittee.key || editingCommittee.id
          }
        })
      });

      if (!res.ok) {
        throw new Error('Failed to update committee in database');
      }

      // 2. Synchronize the selected President role in the members roster if selected from roster
      if (formData.selectedLeadMemberId) {
        try {
          await fetch('/api/committees/members', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              committeeId: commId,
              memberId: formData.selectedLeadMemberId,
              updates: {
                role: isMain ? 'President of the Committee' : 'President of the Subcommittee',
                avatar: formData.leadAvatar
              }
            })
          });
        } catch (_) {}
      }

      // 3. Synchronize Co-President role in members roster if chosen
      if (formData.selectedCoLeadMemberId) {
        try {
          await fetch('/api/committees/members', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              committeeId: commId,
              memberId: formData.selectedCoLeadMemberId,
              updates: {
                role: isMain ? 'Co-President of the Committee' : 'Co-President of the Subcommittee'
              }
            })
          });
        } catch (_) {}
      }

      if (showToast) showToast(`Successfully updated committee setup! Appointed "${formData.leadName}" as President from Member Roster.`);
      setEditingCommittee(null);
      await loadData();
    } catch (err) {
      console.error(err);
      if (showToast) showToast(err.message || 'Error saving committee setup', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Get members belonging to the committee currently being edited (deduplicated by name)
  const committeeRosterMembers = useMemo(() => {
    if (!editingCommittee) return [];
    const commKey = editingCommittee.key || editingCommittee.id;
    const commName = editingCommittee.name || commKey;
    const seen = new Set();
    return allMembers.filter(m => {
      const nameKey = (m.name || '').trim().toLowerCase();
      if (!nameKey || seen.has(nameKey)) return false;

      const commList = Array.isArray(m.committees) ? m.committees : [m.committee, m.committeeName, m.committeeKey, m.committeeId].filter(Boolean);
      const matches = commList.some(c => 
        c === commKey || 
        c === commName || 
        c.toLowerCase() === commKey.toLowerCase() || 
        c.toLowerCase() === commName.toLowerCase() ||
        (commKey === 'main-committee' && (m.centralCommittee || m.alsoInCentralCommittee))
      );

      if (matches) {
        seen.add(nameKey);
        return true;
      }
      return false;
    });
  }, [editingCommittee, allMembers]);

  // Other members from outside this committee (deduplicated by name, excluding those in committeeRosterMembers)
  const otherRosterMembers = useMemo(() => {
    if (!editingCommittee) return allMembers;
    const seen = new Set(committeeRosterMembers.map(m => (m.name || '').trim().toLowerCase()));
    return allMembers.filter(m => {
      const nameKey = (m.name || '').trim().toLowerCase();
      if (!nameKey || seen.has(nameKey)) return false;
      seen.add(nameKey);
      return true;
    });
  }, [editingCommittee, allMembers, committeeRosterMembers]);

  return (
    <div>
      {/* Top Header & Provision Banner */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Building size={18} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
                {language === 'km' ? 'ការរៀបចំរចនាសម្ព័ន្ធគណៈកម្មការ (Committees Setup)' : language === 'zh' ? '委员会架构与领导层配置 (Committees Setup)' : 'Committees & Subcommittees Setup'}
              </h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {language === 'km' 
                ? 'កំណត់រចនាសម្ព័ន្ធគណៈកម្មការ និងជ្រើសរើសប្រធាន/សហប្រធានដោយផ្ទាល់ពីបញ្ជីសមាជិក (Choose from Member Roster)' 
                : language === 'zh' 
                ? '配置各委员会领导班子，主席与共同主席必须直接从正式成员名册中指派 (Must choose from Member Roster)' 
                : 'Configure governance committees. Leaders and Co-Presidents must be appointed directly from the Member Roster.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={loadData} className="btn btn-secondary btn-sm" disabled={loading}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>{t('admin.refreshBtn', 'Refresh')}</span>
            </button>
            <Link href="/committee" target="_blank" className="btn btn-outline btn-sm">
              <ExternalLink size={14} />
              <span>{language === 'km' ? 'ទំព័រគណៈកម្មការសាធារណៈ' : language === 'zh' ? '查看官网公开页面' : 'View Public Page'}</span>
            </Link>
          </div>
        </div>

        {/* Standard Provision Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.28)',
          padding: '12px 18px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.85rem',
          color: 'var(--text-main)',
          fontWeight: '700'
        }}>
          <ShieldCheck size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
          <span>
            {COMMITTEE_STANDARD_PROVISION[language] || COMMITTEE_STANDARD_PROVISION.en}
          </span>
        </div>
      </div>

      {/* Search Input Bar */}
      <div style={{
        background: 'var(--card-bg)',
        padding: '14px 18px',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Search size={16} color="var(--text-dim)" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'km' ? 'ស្វែងរកគណៈកម្មការ...' : language === 'zh' ? '搜索委员会名称或代号...' : 'Filter committees by name or ID...'}
          className="form-input"
          style={{ flex: 1, height: '36px', fontSize: '0.85rem' }}
        />
        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: '700' }}>
          {filteredCommittees.length} / {committees.length}
        </span>
      </div>

      {/* Committees Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)', marginTop: '12px', fontSize: '0.875rem' }}>Loading committees and roster...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
          {filteredCommittees.map((comm) => {
            const isMain = comm.type === 'main' || comm.id === 'main-committee';
            const localName = getSubCommitteeLocalizedName(comm.key || comm.id, language);
            const squads = getWorkingGroupsForCommittee(comm.id || comm.key, language);
            const commKey = comm.key || comm.id;
            const rosterCount = allMembers.filter(m => 
              m.committeeKey === commKey || 
              m.committeeId === comm.id || 
              m.committee === commKey ||
              m.committeeName === commKey
            ).length;

            return (
              <div
                key={comm.id || comm.key}
                className="glass-card"
                style={{
                  padding: '24px',
                  borderTop: `4px solid ${comm.color || 'var(--primary)'}`,
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  {/* Top Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: `${comm.color || '#6366f1'}20`,
                      color: comm.color || 'var(--primary)',
                      border: `1px solid ${comm.color || '#6366f1'}40`,
                      fontFamily: 'var(--font-mono)'
                    }}>
                      {comm.id}
                    </span>

                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      padding: '3px 9px',
                      borderRadius: '999px',
                      background: rosterCount >= 50 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.12)',
                      color: rosterCount >= 50 ? '#ef4444' : 'var(--primary)',
                      border: rosterCount >= 50 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(99, 102, 241, 0.25)'
                    }}>
                      👥 {rosterCount} {language === 'km' ? 'សមាជិកក្នុងបញ្ជី' : language === 'zh' ? '在册成员' : 'in Roster'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px', lineHeight: '1.3' }}>
                    {localName}
                  </h3>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '16px', minHeight: '40px' }}>
                    {comm.description}
                  </p>

                  {/* President / Lead Card (Appointed from Roster) */}
                  <div style={{
                    background: 'var(--btn-secondary-bg)',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '14px',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      flexShrink: 0
                    }}>
                      {comm.lead?.avatar || '👨‍💼'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: '800', textTransform: 'uppercase' }}>
                        👑 {localizeOfficeRole(comm.lead?.role || 'President', isMain, language)}
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {comm.lead?.name || (language === 'km' ? 'រង់ចាំការជ្រើសតាំង' : language === 'zh' ? '待指派' : 'Unappointed')}
                      </div>
                    </div>
                  </div>

                  {/* Functional Working Squads */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {squads.map(s => (
                      <span key={s.key} style={{
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        color: 'var(--text-muted)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        padding: '2px 7px',
                        borderRadius: '6px'
                      }}>
                        {s.icon} {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Setup Button */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {isMain ? 'Governing Central Board' : 'Domain Subcommittee'}
                  </div>

                  <button
                    onClick={() => openSetupModal(comm)}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Edit3 size={13} />
                    <span>{language === 'km' ? 'រៀបចំគណៈកម្មការ (Setup)' : language === 'zh' ? '配置领导班子 (Setup)' : 'Committee Setup'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          SETUP COMMITTEE MODAL (MUST CHOOSE FROM MEMBER ROSTER)
          ========================================================================= */}
      {editingCommittee && (
        <div className="modal-overlay" onClick={() => setEditingCommittee(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '30px', maxWidth: '620px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Building size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    {language === 'km' ? 'ការរៀបចំរចនាសម្ព័ន្ធគណៈកម្មការ' : language === 'zh' ? '委员会领导与架构配置' : 'Committee Setup & Leadership'}
                  </h3>
                  <div style={{ fontSize: '0.825rem', color: 'var(--primary)', fontWeight: '700' }}>
                    {getSubCommitteeLocalizedName(editingCommittee.key || editingCommittee.id, language)} ({editingCommittee.id})
                  </div>
                </div>
              </div>
              <button onClick={() => setEditingCommittee(null)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Roster Rule Reminder Banner */}
            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.825rem',
              color: 'var(--text-main)',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldCheck size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
              <span>
                {language === 'km'
                  ? 'ការតែងតាំងប្រធាន និងសហប្រធាន ត្រូវតែជ្រើសរើសដោយផ្ទាល់ពីបញ្ជីសមាជិក (Member Roster)។'
                  : language === 'zh'
                  ? '合规规定：委员会主席与共同主席必须直接从成员名册中选取指派。'
                  : 'Policy: Committee President and Co-President must be appointed directly from the Member Roster.'}
              </span>
            </div>

            <form onSubmit={handleSaveSetup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 1. PRESIDENT (CHOOSE FROM MEMBER ROSTER) */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.05)',
                border: '1.5px solid rgba(245, 158, 11, 0.3)',
                padding: '16px',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ marginBottom: 0, color: '#f59e0b', fontWeight: '800' }}>
                    👑 {language === 'km' ? 'ជ្រើសរើសប្រធានគណៈកម្មការពីបញ្ជីសមាជិក' : language === 'zh' ? '指派委员会主席 (从成员名册选取)' : 'Appoint President (Choose from Member Roster)'} *
                  </label>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {committeeRosterMembers.length} {language === 'km' ? 'នាក់ក្នុងបញ្ជីនេះ' : language === 'zh' ? '位本会成员' : 'in this committee'}
                  </span>
                </div>

                <select
                  required
                  value={formData.selectedLeadMemberId}
                  onChange={(e) => handleSelectLeadMember(e.target.value)}
                  className="form-input"
                  style={{ fontWeight: '700' }}
                >
                  <option value="">
                    {language === 'km' ? '-- សូមជ្រើសរើសសមាជិកក្នុងបញ្ជី --' : language === 'zh' ? '-- 请从成员名册中选择人员 --' : '-- Choose from Member Roster --'}
                  </option>

                  {/* Members in this committee */}
                  {committeeRosterMembers.length > 0 && (
                    <optgroup label={language === 'km' ? `សមាជិកក្នុងគណៈកម្មការនេះ (${committeeRosterMembers.length} នាក់)` : language === 'zh' ? `本委员会在册成员 (${committeeRosterMembers.length} 人)` : `Members in this Committee (${committeeRosterMembers.length})`}>
                      {committeeRosterMembers.map(m => (
                        <option key={m.id || m.name} value={m.id || m.name}>
                          {m.avatar || '👤'} {m.name} — ({m.role || 'Member'})
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {/* All other members in the expo */}
                  {otherRosterMembers.length > 0 && (
                    <optgroup label={language === 'km' ? `សមាជិកពីគណៈកម្មការផ្សេង (${otherRosterMembers.length} នាក់)` : language === 'zh' ? `其他委员会成员 (${otherRosterMembers.length} 人)` : `Members from Other Committees (${otherRosterMembers.length})`}>
                      {otherRosterMembers.map(m => (
                        <option key={m.id || m.name} value={m.id || m.name}>
                          {m.avatar || '👤'} {m.name} — [{getSubCommitteeLocalizedName(m.committeeKey || m.committee, language)}]
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>

                {/* Warning if no members registered */}
                {committeeRosterMembers.length === 0 && (
                  <div style={{ marginTop: '8px', fontSize: '0.78rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={14} />
                    <span>
                      {language === 'km'
                        ? 'គណៈកម្មការនេះមិនទាន់មានសមាជិកក្នុងបញ្ជីឡើយ។ អ្នកអាចជ្រើសរើសសមាជិកពីគណៈកម្មការផ្សេង ឬបន្ថែមសមាជិកក្នុងផ្ទាំង Members Roster ជាមុន។'
                        : language === 'zh'
                        ? '本委员会名册暂无登记人员。您可以从其他分会选取人员，或前往“成员名册”先录入成员。'
                        : 'No members in this committee yet. You can pick from other committees or add members in Members Roster first.'}
                    </span>
                  </div>
                )}

                {/* Appointed President Preview Card */}
                {formData.leadName && (
                  <div style={{
                    marginTop: '12px',
                    background: 'var(--card-bg)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                  }}>
                    <span style={{ fontSize: '1.6rem' }}>{formData.leadAvatar || '👨‍💼'}</span>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: '800' }}>
                        👑 {formData.leadRole}
                      </div>
                      <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        {formData.leadName}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. CO-PRESIDENT (CHOOSE FROM MEMBER ROSTER) */}
              <div style={{
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1.5px solid rgba(139, 92, 246, 0.3)',
                padding: '16px',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ marginBottom: 0, color: '#8b5cf6', fontWeight: '800' }}>
                    ⭐ {language === 'km' ? 'ជ្រើសរើសសហប្រធានពីបញ្ជីសមាជិក (Co-President)' : language === 'zh' ? '指派共同主席 (从成员名册选取)' : 'Appoint Co-President (Choose from Member Roster)'}
                  </label>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {language === 'km' ? 'ជម្រើសបន្ថែម' : language === 'zh' ? '可选' : 'Optional'}
                  </span>
                </div>

                <select
                  value={formData.selectedCoLeadMemberId}
                  onChange={(e) => handleSelectCoLeadMember(e.target.value)}
                  className="form-input"
                  style={{ fontWeight: '700' }}
                >
                  <option value="">
                    {language === 'km' ? '-- មិនទាន់តែងតាំង (None / Unassigned) --' : language === 'zh' ? '-- 暂不指定共同主席 --' : '-- None / Not Appointed --'}
                  </option>

                  {/* Members in this committee */}
                  {committeeRosterMembers.length > 0 && (
                    <optgroup label={language === 'km' ? `សមាជិកក្នុងគណៈកម្មការនេះ (${committeeRosterMembers.length} នាក់)` : language === 'zh' ? `本委员会在册成员 (${committeeRosterMembers.length} 人)` : `Members in this Committee`}>
                      {committeeRosterMembers
                        .filter(m => (m.id || m.name) !== formData.selectedLeadMemberId)
                        .map(m => (
                          <option key={m.id || m.name} value={m.id || m.name}>
                            {m.avatar || '👤'} {m.name} — ({m.role || 'Member'})
                          </option>
                        ))}
                    </optgroup>
                  )}

                  {/* Other members */}
                  {otherRosterMembers.length > 0 && (
                    <optgroup label={language === 'km' ? 'សមាជិកពីគណៈកម្មការផ្សេង' : language === 'zh' ? '其他委员会成员' : 'Members from Other Committees'}>
                      {otherRosterMembers
                        .filter(m => (m.id || m.name) !== formData.selectedLeadMemberId)
                        .map(m => (
                          <option key={m.id || m.name} value={m.id || m.name}>
                            {m.avatar || '👤'} {m.name} — [{getSubCommitteeLocalizedName(m.committeeKey || m.committee, language)}]
                          </option>
                        ))}
                    </optgroup>
                  )}
                </select>

                {/* Appointed Co-President Preview Card */}
                {formData.coLeadName && (
                  <div style={{
                    marginTop: '12px',
                    background: 'var(--card-bg)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                  }}>
                    <span style={{ fontSize: '1.6rem' }}>⭐</span>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#8b5cf6', fontWeight: '800' }}>
                        ⭐ {formData.coLeadRole}
                      </div>
                      <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        {formData.coLeadName}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. MANDATE & DESCRIPTION */}
              <div>
                <label className="form-label">{t('admin.committeesSection.description', 'Committee Mandate & Description')} *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              {/* 4. ROSTER METRICS SYNC */}
              <div style={{
                background: 'var(--btn-secondary-bg)',
                padding: '12px 16px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.85rem'
              }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  {language === 'km' ? 'ចំនួនសមាជិកជាក់ស្តែងក្នុងបញ្ជី Roster:' : language === 'zh' ? '花名册当前实际在编成员数：' : 'Live Registered Roster Personnel:'}
                </span>
                <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1rem' }}>
                  👥 {committeeRosterMembers.length} {language === 'km' ? 'នាក់' : language === 'zh' ? '人' : 'members'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setEditingCommittee(null)} className="btn btn-secondary btn-sm">
                  {t('admin.cancel', 'Cancel')}
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                  <Check size={14} />
                  <span>{saving ? 'Saving...' : (language === 'km' ? 'រក្សាទុកការរៀបចំគណៈកម្មការ' : language === 'zh' ? '确认保存配置' : 'Save Committee Setup')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
