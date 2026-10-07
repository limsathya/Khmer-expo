'use client';

import { useState, useEffect } from 'react';
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
  Search 
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

  const openEditModal = (mem) => {
    setEditingMember(mem);
    setFormData({
      name: mem.name,
      role: mem.role,
      avatar: mem.avatar || '👤',
      committee: mem.committee,
      alsoInCentralCommittee: !!(mem.centralCommittee || mem.alsoInCentralCommittee || mem.subCommittee)
    });
    setIsModalOpen(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingMember) {
        const res = await fetch('/api/committees/members', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            committeeId: editingMember.committee,
            memberId: editingMember.id || editingMember.name,
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
          if (showToast) showToast('Failed to update member', 'error');
        }
      } else {
        const res = await fetch('/api/committees/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            committeeId: formData.committee,
            member: {
              name: formData.name,
              role: formData.role,
              avatar: formData.avatar,
              alsoInCentralCommittee: formData.alsoInCentralCommittee
            }
          })
        });

        if (res.ok) {
          if (showToast) showToast(`Added member "${formData.name}" to committee!`);
          setIsModalOpen(false);
          await loadMembers();
        } else {
          if (showToast) showToast('Failed to add member', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Network error while saving member', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (mem) => {
    if (!confirm(`Are you sure you want to remove ${mem.name} from this committee?`)) return;
    try {
      const res = await fetch('/api/committees/members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          committeeId: mem.committee,
          memberId: mem.id || mem.name
        })
      });

      if (res.ok) {
        if (showToast) showToast(`Removed ${mem.name} from committee.`);
        await loadMembers();
      } else {
        if (showToast) showToast('Failed to remove member', 'error');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Error deleting member', 'error');
    }
  };

  const filteredMembers = members.filter(m => {
    if (selectedCommittee !== 'all' && m.committee !== selectedCommittee && m.committeeName !== selectedCommittee) {
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

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
              {language === 'km' ? 'បញ្ជីរាយនាមសមាជិកគណៈកម្មការ' : language === 'zh' ? '委员会成员名册管理' : 'Committee Members Roster'}
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--btn-secondary-bg)', padding: '2px 8px', borderRadius: '6px' }}>
              {members.length} {language === 'km' ? 'នាក់' : language === 'zh' ? '位成员' : 'members'}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            {language === 'km' 
              ? 'គ្រប់គ្រងសមាជិកគណៈកម្មការកណ្តាល និងអនុគណៈកម្មការទាំង ៩ ដោយផ្ទាល់ក្នុង Supabase DB។ គាំទ្រសមាជិកដែលមានតួនាទីទាំងក្នុងគណៈកម្មការកណ្តាល និងអនុគណៈកម្មការ។' 
              : language === 'zh' 
              ? '实时管理中央委员会及9个分委员会成员，支持兼任中央委员会与分委员会双重身份。' 
              : 'Directly manage members across the Central Committee and all 9 subcommittees in Supabase DB.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={openCreateModal} className="btn btn-primary btn-sm">
            <UserPlus size={14} />
            <span>{language === 'km' ? '+ បន្ថែមសមាជិកថ្មី' : language === 'zh' ? '+ 添加新成员' : '+ Add New Member'}</span>
          </button>
          <button onClick={loadMembers} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} />
            <span>{t('admin.refreshBtn', 'Refresh')}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Committee Filter */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>
              {language === 'km' ? 'ជ្រើសរើសគណៈកម្មការ៖' : language === 'zh' ? '分委员会筛选：' : 'Filter by Committee:'}
            </span>
            <select
              value={selectedCommittee}
              onChange={(e) => setSelectedCommittee(e.target.value)}
              className="form-input"
              style={{ width: 'auto', minWidth: '220px', padding: '6px 12px', fontSize: '0.85rem' }}
            >
              <option value="all">{language === 'km' ? 'ទាំងអស់ (១០ គណៈកម្មការ)' : language === 'zh' ? '全部委员会 (10个)' : 'All Committees (10 total)'}</option>
              {ALL_COMMITTEES_LIST.map(c => (
                <option key={c.key} value={c.name}>
                  {getSubCommitteeLocalizedName(c.key, language)}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
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
        </div>
      </div>

      {/* Members Grid / Cards */}
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
            {language === 'km' ? 'សូមកែសម្រួលលក្ខខណ្ឌស្វែងរក ឬបន្ថែមសមាជិកថ្មី។' : language === 'zh' ? '请尝试重置筛选或点击“添加新成员”。' : 'Try adjusting your search or click "+ Add New Member".'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '18px' }}>
          {filteredMembers.map((mem, index) => {
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
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', marginTop: '2px' }}>
                          {mem.role}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => openEditModal(mem)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '5px 8px' }}
                        title="Edit Member"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(mem)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '5px 8px', color: '#ef4444' }}
                        title="Remove Member"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Committee Badges */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '700' }}>
                      {language === 'km' ? 'គណៈកម្មការដែលសមាជិកស្ថិតនៅ៖' : language === 'zh' ? '所属委员会：' : 'Committee Affiliation:'}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        background: 'rgba(99, 102, 241, 0.12)',
                        color: 'var(--primary)',
                        border: '1px solid rgba(99, 102, 241, 0.25)'
                      }}>
                        <Layers size={11} />
                        <span>{getSubCommitteeLocalizedName(mem.committee, language) || mem.committeeName || mem.committee}</span>
                      </span>

                      {isCross && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          background: 'rgba(239, 68, 68, 0.12)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.25)'
                        }}>
                          <ShieldCheck size={11} />
                          <span>{language === 'km' ? 'គណៈកម្មការកណ្តាល (兼)' : language === 'zh' ? '中央委员会 (兼任)' : 'Central Committee (Dual)'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Privacy: Username hidden publicly</span>
                  <span style={{ color: 'var(--status-approved)', fontWeight: '600' }}>✓ Active in DB</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MEMBER MODAL */}
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
                    <option key={c.key} value={c.name}>
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
                      ? 'សមាជិកនេះស្ថិតក្នុងគណៈកម្មការកណ្តាលផងដែរ (Also in Central Committee)' 
                      : language === 'zh' 
                      ? '同时兼任中央委员会成员 (Also in Central Committee)' 
                      : 'Also member of Central Committee (Dual Affiliation)'}
                  </span>
                </label>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', paddingLeft: '28px' }}>
                  {language === 'km' ? 'សមាជិកនឹងបង្ហាញទាំងក្នុងអនុគណៈកម្មការ និងក្នុងគណៈកម្មការកណ្តាល។' : language === 'zh' ? '勾选后该成员将同时显示在中央委员会与分委员会名册中。' : 'Member will be synced and displayed in both Central Committee and the Subcommittee.'}
                </div>
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
    </div>
  );
}
