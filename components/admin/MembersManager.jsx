'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Layers, 
  ShieldCheck, 
  RefreshCw, 
  UserPlus, 
  Search,
  Table as TableIcon,
  LayoutGrid,
  UploadCloud,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { ALL_COMMITTEES_LIST, getSubCommitteeLocalizedName } from '@/lib/committees';

export default function MembersManager({ showToast }) {
  const { user, canManageEverything, userCommittee } = useAuth();
  const { t, language } = useLanguage();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommittee, setSelectedCommittee] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // Default to table for large lists (100+ members)
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  // Add/Edit Member Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Committee Member',
    avatar: '👤',
    committee: 'Subcommittee on Reception and Protocol',
    alsoInCentralCommittee: false
  });
  const [saving, setSaving] = useState(false);

  // Bulk Import Modal (For sub-committees with 100+ members)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkFormData, setBulkFormData] = useState({
    committee: 'Subcommittee on Reception and Protocol',
    role: 'Committee Member',
    namesText: '',
    avatar: '👤',
    alsoInCentralCommittee: false
  });
  const [bulkImporting, setBulkImporting] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    setLoading(true);
    try {
      const res = await fetch('/api/committees/members');
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  }

  const openCreateModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: 'Committee Member',
      avatar: '👤',
      committee: userCommittee && userCommittee !== 'Central Committee' ? userCommittee : 'Subcommittee on Reception and Protocol',
      alsoInCentralCommittee: false
    });
    setIsModalOpen(true);
  };

  const openBulkModal = () => {
    setBulkFormData({
      committee: userCommittee && userCommittee !== 'Central Committee' ? userCommittee : (selectedCommittee !== 'all' ? selectedCommittee : 'Subcommittee on Reception and Protocol'),
      role: 'Committee Member',
      namesText: '',
      avatar: '👤',
      alsoInCentralCommittee: false
    });
    setIsBulkModalOpen(true);
  };

  const openEditModal = (mem) => {
    setEditingMember(mem);
    setFormData({
      name: mem.name,
      role: mem.role,
      avatar: mem.avatar || '👤',
      committee: mem.committee || mem.committeeName || mem.committeeKey,
      alsoInCentralCommittee: !!(mem.centralCommittee || mem.alsoInCentralCommittee || mem.subCommittee)
    });
    setIsModalOpen(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingMember) {
        const commId = editingMember.committeeId || editingMember.committeeKey || editingMember.committee;
        const res = await fetch('/api/committees/members', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            committeeId: commId,
            memberId: editingMember.id || editingMember.name,
            memberIndex: editingMember.memberIndex,
            updates: {
              name: formData.name,
              role: formData.role,
              avatar: formData.avatar,
              alsoInCentralCommittee: formData.alsoInCentralCommittee
            }
          })
        });

        if (res.ok) {
          if (showToast) showToast(`Updated member "${formData.name}" successfully!`);
          setIsModalOpen(false);
          await loadMembers();
        } else {
          const errData = await res.json().catch(() => ({}));
          if (showToast) showToast(errData.error || 'Failed to update member', 'error');
        }
      } else {
        const res = await fetch('/api/committees/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            committeeId: formData.committee,
            name: formData.name,
            role: formData.role,
            avatar: formData.avatar,
            alsoInCentralCommittee: formData.alsoInCentralCommittee
          })
        });

        if (res.ok) {
          if (showToast) showToast(`Added member "${formData.name}" to committee!`);
          setIsModalOpen(false);
          await loadMembers();
        } else {
          const errData = await res.json().catch(() => ({}));
          if (showToast) showToast(errData.error || 'Failed to add member', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Network error while saving member', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Bulk Import Handler (Handles 100+ members in 1 click)
  const handleBulkImportSubmit = async (e) => {
    e.preventDefault();
    const parsedNames = bulkFormData.namesText
      .split(/[\n,]/)
      .map(n => n.trim())
      .filter(n => n.length > 0);

    if (parsedNames.length === 0) {
      if (showToast) showToast('Please enter at least one member name to import.', 'error');
      return;
    }

    setBulkImporting(true);
    try {
      const payload = {
        committeeId: bulkFormData.committee,
        members: parsedNames.map(name => ({
          name,
          role: bulkFormData.role || 'Committee Member',
          avatar: bulkFormData.avatar || '👤',
          alsoInCentralCommittee: bulkFormData.alsoInCentralCommittee
        }))
      };

      const res = await fetch('/api/committees/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (showToast) showToast(`Successfully imported ${data.count || parsedNames.length} members!`);
        setIsBulkModalOpen(false);
        await loadMembers();
      } else {
        const errData = await res.json().catch(() => ({}));
        if (showToast) showToast(errData.error || 'Failed to bulk import members', 'error');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Network error during bulk import', 'error');
    } finally {
      setBulkImporting(false);
    }
  };

  const handleDeleteMember = async (mem) => {
    if (!confirm(`Are you sure you want to remove ${mem.name} from this committee?`)) return;
    try {
      const commId = mem.committeeId || mem.committeeKey || mem.committee;
      const res = await fetch('/api/committees/members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          committeeId: commId,
          memberId: mem.id || mem.name,
          memberIndex: mem.memberIndex
        })
      });

      if (res.ok) {
        if (showToast) showToast(`Removed ${mem.name} from committee.`);
        await loadMembers();
      } else {
        const errData = await res.json().catch(() => ({}));
        if (showToast) showToast(errData.error || 'Failed to remove member', 'error');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Error deleting member', 'error');
    }
  };

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      if (selectedCommittee !== 'all' && m.committee !== selectedCommittee && m.committeeName !== selectedCommittee && m.committeeKey !== selectedCommittee && m.committeeId !== selectedCommittee) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = m.name?.toLowerCase().includes(q);
        const matchRole = m.role?.toLowerCase().includes(q);
        const matchComm = m.committeeName?.toLowerCase().includes(q);
        if (!matchName && !matchRole && !matchComm) return false;
      }
      return true;
    });
  }, [members, selectedCommittee, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredMembers.length / pageSize) || 1;
  const paginatedMembers = useMemo(() => {
    if (pageSize >= 1000) return filteredMembers;
    const start = (currentPage - 1) * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [filteredMembers, currentPage, pageSize]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCommittee, searchQuery, pageSize]);

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
              {language === 'km' ? 'បញ្ជីរាយនាមសមាជិកគណៈកម្មការ' : language === 'zh' ? '委员会成员名册管理' : 'Committee Members Roster'}
            </h2>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '2px 9px', borderRadius: '12px' }}>
              {members.length} {language === 'km' ? 'នាក់' : language === 'zh' ? '位成员' : 'members'}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            {language === 'km' 
              ? 'គ្រប់គ្រងសមាជិកគណៈកម្មការទាំងអស់ (គាំទ្រលើសពី ១០០+ នាក់ក្នុងមួយអនុគណៈកម្មការ) ដោយផ្ទាល់ក្នុង Supabase DB។' 
              : language === 'zh' 
              ? '全面支持各分委员会管理 100+ 名以上成员，支持单人新增及批量快捷导入。' 
              : 'Directly manage members across all committees in Supabase DB (supports 100+ members per committee).'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={openBulkModal} className="btn btn-secondary btn-sm" title="Bulk Import Multiple Members">
            <UploadCloud size={14} />
            <span>{language === 'km' ? '+ បញ្ចូលច្រើននាក់ (Bulk)' : language === 'zh' ? '+ 批量导入' : '+ Bulk Import'}</span>
          </button>
          <button onClick={openCreateModal} className="btn btn-primary btn-sm">
            <UserPlus size={14} />
            <span>{language === 'km' ? '+ បន្ថែមសមាជិក' : language === 'zh' ? '+ 添加成员' : '+ Add Member'}</span>
          </button>
          <button onClick={loadMembers} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} />
            <span>{t('admin.refreshBtn', 'Refresh')}</span>
          </button>
        </div>
      </div>

      {/* Filter, Search & View Controls Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Committee Filter */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>
              {language === 'km' ? 'គណៈកម្មការ៖' : language === 'zh' ? '分委员会：' : 'Committee:'}
            </span>
            <select
              value={selectedCommittee}
              onChange={(e) => setSelectedCommittee(e.target.value)}
              className="form-input"
              style={{ width: 'auto', minWidth: '220px', padding: '6px 12px', fontSize: '0.85rem' }}
            >
              <option value="all">{language === 'km' ? 'ទាំងអស់ (១០ គណៈកម្មការ)' : language === 'zh' ? '全部委员会 (10个)' : 'All Committees (10 total)'}</option>
              {ALL_COMMITTEES_LIST.map(c => {
                const count = members.filter(m => m.committee === c.key || m.committeeName === c.name || m.committeeId === c.id).length;
                return (
                  <option key={c.key} value={c.key}>
                    {getSubCommitteeLocalizedName(c.key, language)} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px', flex: '1', maxWidth: '340px' }}>
            <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={language === 'km' ? 'ស្វែងរកតាមឈ្មោះ ឬតួនាទី...' : language === 'zh' ? '搜索成员姓名或职位...' : 'Search by name or role...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', paddingRight: '12px', fontSize: '0.85rem', width: '100%' }}
            />
          </div>

          {/* View Mode & Page Size Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="form-input"
                style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={1000}>All</option>
              </select>
            </div>

            <div style={{ display: 'flex', border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                style={{
                  padding: '6px 10px',
                  background: viewMode === 'table' ? 'var(--primary)' : 'var(--btn-secondary-bg)',
                  color: viewMode === 'table' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer'
                }}
                title="Table View"
              >
                <TableIcon size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 10px',
                  background: viewMode === 'grid' ? 'var(--primary)' : 'var(--btn-secondary-bg)',
                  color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer'
                }}
                title="Cards Grid View"
              >
                <LayoutGrid size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Members Content View */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <Users size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
            {language === 'km' ? 'រកមិនឃើញសមាជិកទេ' : language === 'zh' ? '未找到匹配的成员' : 'No members found'}
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {language === 'km' ? 'សូមកែសម្រួលលក្ខខណ្ឌស្វែងរក ឬបន្ថែមសមាជិកថ្មី។' : language === 'zh' ? '请尝试重置筛选或点击“添加新成员”。' : 'Try adjusting your search or click "+ Add Member".'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* COMPACT HIGH-VOLUME TABLE VIEW (BEST FOR 100+ MEMBERS) */
        <div className="glass-panel table-responsive" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--btn-secondary-bg)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 16px' }}>#</th>
                <th style={{ padding: '12px 16px' }}>Member Name</th>
                <th style={{ padding: '12px 16px' }}>Role / Position</th>
                <th style={{ padding: '12px 16px' }}>Assigned Committee</th>
                <th style={{ padding: '12px 16px' }}>Dual Affiliation</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.map((mem, index) => {
                const globalIndex = (currentPage - 1) * pageSize + index + 1;
                const isCross = !!(mem.centralCommittee || mem.subCommittee || mem.alsoInCentralCommittee);

                return (
                  <tr key={mem.id || `${mem.name}-${index}`} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--text-dim)', fontSize: '0.75rem', width: '40px' }}>
                      {globalIndex}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{mem.avatar || '👤'}</span>
                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{mem.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                      {mem.role || 'Member'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '600' }}>
                        {getSubCommitteeLocalizedName(mem.committee || mem.committeeName || mem.committeeKey, language)}
                      </span>
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
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button onClick={() => openEditModal(mem)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }} title="Edit">
                          <Edit3 size={13} />
                        </button>
                        <button onClick={() => handleDeleteMember(mem)} className="btn btn-outline btn-sm" style={{ color: '#ef4444', padding: '4px 8px' }} title="Remove">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* CARDS GRID VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '18px' }}>
          {paginatedMembers.map((mem, index) => {
            const isCross = !!(mem.centralCommittee || mem.subCommittee || mem.alsoInCentralCommittee);

            return (
              <div 
                key={mem.id || `${mem.name}-${index}`} 
                className="glass-card" 
                style={{ 
                  padding: '20px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between', 
                  gap: '14px',
                  borderTop: isCross ? '3px solid #ef4444' : '3px solid var(--primary)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--btn-secondary-bg)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                        {mem.avatar || '👤'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-main)' }}>
                          {mem.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>
                          {mem.role}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => openEditModal(mem)} className="btn btn-secondary btn-sm" style={{ padding: '6px 8px' }} title="Edit Member">
                        <Edit3 size={13} />
                      </button>
                      <button onClick={() => handleDeleteMember(mem)} className="btn btn-outline btn-sm" style={{ color: '#ef4444', padding: '6px 8px' }} title="Delete Member">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Affiliation Badges */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      background: 'rgba(99, 102, 241, 0.12)',
                      color: 'var(--primary)',
                      border: '1px solid rgba(99, 102, 241, 0.25)'
                    }}>
                      {getSubCommitteeLocalizedName(mem.committee || mem.committeeName || mem.committeeKey, language)}
                    </span>

                    {isCross && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        background: 'rgba(239, 68, 68, 0.12)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.25)'
                      }}>
                        <ShieldCheck size={11} />
                        <span>{language === 'km' ? 'គណៈកម្មការកណ្តាល' : language === 'zh' ? '中央委员会' : 'Central Committee'}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Verified Officer</span>
                  <span style={{ color: 'var(--status-approved)', fontWeight: '600' }}>✓ Active in DB</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {filteredMembers.length > pageSize && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '20px', padding: '12px 16px', background: 'var(--btn-secondary-bg)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> – <strong>{Math.min(currentPage * pageSize, filteredMembers.length)}</strong> of <strong>{filteredMembers.length}</strong> members
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px 10px' }}
            >
              <ChevronLeft size={14} /> <span>Previous</span>
            </button>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', padding: '0 8px' }}>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px 10px' }}
            >
              <span>Next</span> <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT SINGLE MEMBER MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '520px' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
              {editingMember 
                ? (language === 'km' ? 'កែសម្រួលព័ត៌មានសមាជិក' : language === 'zh' ? '编辑委员会成员' : 'Edit Committee Member') 
                : (language === 'km' ? 'បន្ថែមសមាជិកថ្មីទៅគណៈកម្មការ' : language === 'zh' ? '添加新委员会成员' : 'Add New Committee Member')}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              {language === 'km' ? 'ការផ្លាស់ប្តូរនឹងត្រូវរក្សាទុកដោយផ្ទាល់ក្នុង Supabase DB និងបង្ហាញលើទំព័រ Committee។' : language === 'zh' ? '修改将直接保存至 Supabase 数据库并在官网公开委员会页面展示。' : 'Changes save directly to Supabase DB and appear on public committee pages.'}
            </p>

            <form onSubmit={handleSaveMember} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">{language === 'km' ? 'ឈ្មោះពេញរបស់សមាជិក' : language === 'zh' ? '成员真实姓名' : 'Full Name'}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sok Piseth, Dr. Robert Chen..."
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">{language === 'km' ? 'មុខតំណែង / តួនាទី' : language === 'zh' ? '担任职务 / 职位' : 'Role / Position'}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Protocol Lead, Member, Coordinator..."
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">{language === 'km' ? 'គណៈកម្មការចម្បង' : language === 'zh' ? '所属分委员会' : 'Primary Committee'}</label>
                <select
                  value={formData.committee}
                  onChange={(e) => setFormData(prev => ({ ...prev, committee: e.target.value }))}
                  disabled={!!editingMember}
                  className="form-input"
                >
                  {ALL_COMMITTEES_LIST.map(c => (
                    <option key={c.key} value={c.key}>
                      {getSubCommitteeLocalizedName(c.key, language)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">{language === 'km' ? 'រូបតំណាង Avatar Emoji' : language === 'zh' ? '头像图标 Emoji' : 'Avatar Emoji'}</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                    className="form-input"
                    style={{ width: '80px', textAlign: 'center', fontSize: '1.25rem' }}
                  />
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['👨‍💼', '👩‍💼', '👤', '🧑‍🔬', '🎪', '💼', '🍲', '📸', '🏅', '🌐'].map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatar: emoji }))}
                        style={{ padding: '6px 10px', borderRadius: '8px', background: 'var(--btn-secondary-bg)', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '1.1rem' }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cross-assignment Checkbox */}
              <div style={{
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                padding: '12px 14px',
                borderRadius: '10px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                  <input
                    type="checkbox"
                    checked={formData.alsoInCentralCommittee}
                    onChange={(e) => setFormData(prev => ({ ...prev, alsoInCentralCommittee: e.target.checked }))}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                  />
                  <span>
                    {language === 'km' 
                      ? 'សមាជិកនេះស្ថិតក្នុងគណៈកម្មការកណ្តាលផងដែរ (Dual Affiliation)' 
                      : language === 'zh' 
                      ? '同时兼任中央委员会成员 (Dual Affiliation)' 
                      : 'Also member of Central Committee (Dual Affiliation)'}
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  {t('admin.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary btn-sm"
                >
                  <Check size={14} />
                  <span>{saving ? 'Saving...' : (editingMember ? (language === 'km' ? 'រក្សាទុកការកែប្រែ' : language === 'zh' ? '保存更改' : 'Save Changes') : (language === 'km' ? 'បន្ថែមសមាជិក' : language === 'zh' ? '确认添加' : 'Add Member'))}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK IMPORT MODAL (SPECIALLY DESIGNED FOR 100+ MEMBERS) */}
      {isBulkModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBulkModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <UploadCloud size={20} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
                {language === 'km' ? 'បញ្ចូលសមាជិកជាក្រុម (Bulk Import 100+)' : language === 'zh' ? '批量导入成员 (支持 100+)' : 'Bulk Import Members (100+ Supported)'}
              </h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '18px' }}>
              {language === 'km' 
                ? 'ចម្លង ឬវាយបញ្ចូលឈ្មោះសមាជិកច្រើននាក់ (១ ឈ្មោះក្នុង ១ បន្ទាត់ ឬបំបែកដោយសញ្ញាក្បៀស)។ ប្រព័ន្ធនឹងបញ្ចូលទាំងអស់ក្នុងពេលតែមួយ។' 
                : language === 'zh' 
                ? '粘贴或输入多个成员姓名（每行一个姓名，或逗号分隔），系统将在单次事务中快速批量录入所有成员。' 
                : 'Paste multiple member names (one per line or comma-separated). Perfect for sub-committees with 100+ members.'}
            </p>

            <form onSubmit={handleBulkImportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">{language === 'km' ? 'គណៈកម្មការគោលដៅ' : language === 'zh' ? '目标委员会' : 'Target Committee'} *</label>
                  <select
                    value={bulkFormData.committee}
                    onChange={(e) => setBulkFormData(prev => ({ ...prev, committee: e.target.value }))}
                    className="form-input"
                  >
                    {ALL_COMMITTEES_LIST.map(c => (
                      <option key={c.key} value={c.key}>
                        {getSubCommitteeLocalizedName(c.key, language)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">{language === 'km' ? 'តួនាទីរួម' : language === 'zh' ? '默认职务' : 'Default Role'}</label>
                  <input
                    type="text"
                    value={bulkFormData.role}
                    onChange={(e) => setBulkFormData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g. Volunteer, Member"
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    {language === 'km' ? 'បញ្ជីឈ្មោះសមាជិក (១ ឈ្មោះក្នុង ១ បន្ទាត់)' : language === 'zh' ? '成员姓名列表（每行一位）' : 'Member Names (One per line)'} *
                  </label>
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary)' }}>
                    {language === 'km' ? 'រកឃើញ៖ ' : language === 'zh' ? '已识别：' : 'Detected: '} 
                    {bulkFormData.namesText.split(/[\n,]/).filter(n => n.trim().length > 0).length} 
                    {language === 'km' ? ' នាក់' : language === 'zh' ? ' 人' : ' names'}
                  </span>
                </div>
                <textarea
                  rows={8}
                  required
                  value={bulkFormData.namesText}
                  onChange={(e) => setBulkFormData(prev => ({ ...prev, namesText: e.target.value }))}
                  placeholder={"Sok Piseth\nKeo Pich\nChan Vanna\nLy Heng\nSeng Rath\n..."}
                  className="form-input"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: '1.5' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  {t('admin.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={bulkImporting}
                  className="btn btn-primary btn-sm"
                >
                  <UploadCloud size={14} />
                  <span>{bulkImporting ? 'Importing...' : (language === 'km' ? 'បញ្ចូលទាំងអស់ (Import All)' : language === 'zh' ? '确认批量导入' : 'Import All')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
