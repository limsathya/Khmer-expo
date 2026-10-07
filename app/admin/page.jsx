'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Layers, 
  Compass, 
  Flag, 
  Search, 
  Filter, 
  RotateCcw, 
  Trash2, 
  AlertCircle, 
  Eye, 
  Edit3, 
  Plus, 
  Calendar, 
  MapPin, 
  User, 
  Check, 
  X,
  ExternalLink,
  Table as TableIcon,
  LayoutGrid,
  RefreshCw,
  Sparkles,
  Lock,
  LogIn,
  Users,
  Building,
  Database,
  Key,
  Shield,
  Award,
  ChevronRight,
  Globe,
  Tag,
  Menu
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { useSettings } from '@/components/SettingsProvider';
import { SUB_COMMITTEES, MAIN_COMMITTEE, COMMITTEES_MAP, getSubCommitteeLocalizedName } from '@/lib/committees';
import { canManageEverything as checkCanManageEverything, isReceptionAndProtocol, isCentralCommittee } from '@/lib/permissions';
import AdminSidebar from '@/components/admin/AdminSidebar';
import InvitesManager from '@/components/admin/InvitesManager';
import MembersManager from '@/components/admin/MembersManager';
import IdentityManager from '@/components/admin/IdentityManager';
import TimelineManager from '@/components/admin/TimelineManager';
import TranslationsManager from '@/components/admin/TranslationsManager';
import CategoriesManager from '@/components/admin/CategoriesManager';
import CommitteesManager from '@/components/admin/CommitteesManager';

const ALL_DEFAULT_COMMITTEES = [
  { ...MAIN_COMMITTEE, type: 'main' },
  ...SUB_COMMITTEES.map(s => ({ ...s, type: 'sub' }))
];

export default function AdminDashboardPage() {
  const { user, isAdmin, isExecutiveAdmin, isReceptionAndProtocol: userIsProtocol, canManageEverything, canManageEvent, userCommittee, loading: authLoading, login } = useAuth();
  const { t, language } = useLanguage();
  const { categories, getCategoryMeta, getCategoryName } = useSettings();

  // Active Section Tab & Sidebar State
  const [activeSection, setActiveSection] = useState('events');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // --- EVENTS STATE ---
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [committeeFilter, setCommitteeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Modals for Events
  const [rejectingEvent, setRejectingEvent] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [previewEvent, setPreviewEvent] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    category: 'booth',
    date: '2026-10-12',
    time: '10:00',
    endTime: '16:00',
    location: 'Hall B Exhibition Center',
    boothNumber: 'B-01',
    organizer: '',
    contactUsername: '',
    status: 'approved',
    subCommittee: 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management',
    featured: false,
    tags: 'Tech, Innovation'
  });

  // --- COMMITTEES STATE ---
  const [committeesList, setCommitteesList] = useState(ALL_DEFAULT_COMMITTEES);


  // --- USERS STATE ---
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'sub_committee',
    committee: 'Subcommittee on Reception and Protocol',
    avatar: '👨‍💼'
  });
  const [savingUser, setSavingUser] = useState(false);

  // --- DATABASE & SYSTEM STATE ---
  const [dbStatus, setDbStatus] = useState(null);
  const [dbRefreshing, setDbRefreshing] = useState(false);

  // Login form state for inline admin authentication
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
      loadUsersData();
    }
  }, [isAdmin]);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const [eventsRes, statsRes, dbRes, commRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/stats'),
        fetch('/api/db/status'),
        fetch('/api/committees')
      ]);

      if (eventsRes.ok) {
        const eData = await eventsRes.json();
        setEvents(eData);
      }
      if (statsRes.ok) {
        const sData = await statsRes.json();
        setStats(sData);
      }
      if (dbRes.ok) {
        const dbData = await dbRes.json();
        setDbStatus(dbData);
      }
      if (commRes.ok) {
        const cData = await commRes.json();
        if (cData && Array.isArray(cData.all) && cData.all.length > 0) {
          setCommitteesList(cData.all);
        } else if (cData && Array.isArray(cData.subCommittees)) {
          const main = cData.mainCommittee || MAIN_COMMITTEE;
          setCommitteesList([main, ...cData.subCommittees]);
        }
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
      showToast(language === 'km' ? 'កំហុសក្នុងការទាញយកទិន្នន័យ' : language === 'zh' ? '加载数据出错' : 'Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function loadUsersData() {
    setUsersLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.value || []);
        setUsersList(list);
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setUsersLoading(false);
    }
  }

  function showToast(msg, type = 'success') {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  }

  async function handleInlineAdminLogin(e) {
    if (e) e.preventDefault();
    setAdminAuthError('');
    setAdminAuthLoading(true);
    try {
      const loggedUser = await login(adminUsername, adminPassword);
      if (loggedUser.role !== 'admin' && loggedUser.role !== 'sub_committee') {
        setAdminAuthError('Logged in account does not have administrator privileges.');
      }
    } catch (err) {
      setAdminAuthError(err.message || 'Login failed');
    } finally {
      setAdminAuthLoading(false);
    }
  }

  // --- RECEPTION & PROTOCOL / CENTRAL COMMITTEE AUTHORITY HELPER ---
  const userHasUniversalAuthority = Boolean(canManageEverything);

  const canUserManageEventItem = (ev) => {
    if (userHasUniversalAuthority) return true;
    return Boolean(canManageEvent(ev));
  };

  // --- EVENT MANAGEMENT HANDLERS ---
  function openCreateModal() {
    setEventFormData({
      title: '',
      description: '',
      category: 'booth',
      date: '2026-10-12',
      time: '10:00',
      endTime: '16:00',
      location: 'Hall B Exhibition Center',
      boothNumber: 'B-01',
      organizer: 'EXPO Committee / Exhibitor',
      contactUsername: user?.username || 'admin',
      status: 'approved',
      subCommittee: userCommittee || 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management',
      featured: false,
      tags: 'Tech, Innovation'
    });
    setIsCreateModalOpen(true);
  }

  function openEditModal(event) {
    if (!canUserManageEventItem(event)) {
      showToast(t('admin.authority.unauthorizedEvent', 'Assigned to {committee} — Read-only for your role').replace('{committee}', getSubCommitteeLocalizedName(event.subCommittee, language)), 'error');
      return;
    }
    setEditingEvent(event);
    setEventFormData({
      title: event.title || '',
      description: event.description || '',
      category: event.category || 'booth',
      date: event.date || '2026-10-12',
      time: event.time || '10:00',
      endTime: event.endTime || '16:00',
      location: event.location || '',
      boothNumber: event.boothNumber || '',
      organizer: event.organizer || '',
      contactUsername: event.contactUsername || event.contactEmail || '',
      status: event.status || 'approved',
      subCommittee: event.subCommittee || 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management',
      featured: Boolean(event.featured),
      tags: Array.isArray(event.tags) ? event.tags.join(', ') : (event.tags || '')
    });
  }

  async function handleSaveEvent(e) {
    e.preventDefault();
    try {
      if (editingEvent) {
        const res = await fetch(`/api/events/${editingEvent.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventFormData)
        });
        if (res.ok) {
          showToast(`Event "${eventFormData.title}" updated successfully!`);
          setEditingEvent(null);
          await loadDashboardData();
        } else {
          showToast('Failed to update event', 'error');
        }
      } else {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventFormData)
        });
        if (res.ok) {
          showToast(`New event "${eventFormData.title}" created successfully!`);
          setIsCreateModalOpen(false);
          await loadDashboardData();
        } else {
          showToast('Failed to create event', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while saving', 'error');
    }
  }

  async function handleApprove(event) {
    if (!canUserManageEventItem(event)) return;
    setProcessingId(event.id);
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      if (res.ok) {
        showToast(`Approved: "${event.title}" is live!`);
        await loadDashboardData();
      } else {
        showToast('Failed to approve event', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while approving', 'error');
    } finally {
      setProcessingId(null);
    }
  }

  function openRejectModal(event) {
    if (!canUserManageEventItem(event)) return;
    setRejectingEvent(event);
    setRejectionReason(presetReasons[0]);
  }

  async function handleConfirmReject() {
    if (!rejectingEvent) return;
    setProcessingId(rejectingEvent.id);
    try {
      const res = await fetch(`/api/events/${rejectingEvent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'rejected',
          reason: rejectionReason.trim() || 'Submission rejected by expo committee.'
        })
      });
      if (res.ok) {
        showToast(`Rejected: "${rejectingEvent.title}".`);
        setRejectingEvent(null);
        await loadDashboardData();
      } else {
        showToast('Failed to reject event', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while rejecting', 'error');
    } finally {
      setProcessingId(null);
    }
  }

  async function handleSetPending(event) {
    if (!canUserManageEventItem(event)) return;
    setProcessingId(event.id);
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending' })
      });
      if (res.ok) {
        showToast(`Moved "${event.title}" back to pending review.`);
        await loadDashboardData();
      } else {
        showToast('Failed to update status', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error', 'error');
    } finally {
      setProcessingId(null);
    }
  }

  async function handleDelete(event) {
    if (!canUserManageEventItem(event)) return;
    if (!confirm(`Are you sure you want to permanently delete "${event.title}"?`)) return;
    setProcessingId(event.id);
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast(`Deleted: "${event.title}" removed.`);
        await loadDashboardData();
      } else {
        showToast('Failed to delete event', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while deleting', 'error');
    } finally {
      setProcessingId(null);
    }
  }

  async function handleResetData() {
    if (!confirm('Clear all events from database?')) return;
    try {
      const res = await fetch('/api/events/reset', { method: 'POST' });
      if (res.ok) {
        showToast('All events cleared from database.');
        await loadDashboardData();
      }
    } catch (err) {
      console.error(err);
      showToast('Error clearing events data', 'error');
    }
  }



  // --- USER / OFFICER MANAGEMENT HANDLERS ---
  function openCreateUserModal() {
    setUserFormData({
      name: '',
      username: '',
      password: '',
      role: 'sub_committee',
      committee: 'Subcommittee on Reception and Protocol',
      avatar: '👨‍💼'
    });
    setIsCreateUserModalOpen(true);
  }

  function openEditUserModal(targetUser) {
    setEditingUser(targetUser);
    setUserFormData({
      name: targetUser.name || '',
      username: targetUser.username || '',
      password: '',
      role: targetUser.role || 'sub_committee',
      committee: targetUser.committee || 'Subcommittee on Reception and Protocol',
      avatar: targetUser.avatar || '👨‍💼'
    });
  }

  async function handleSaveUser(e) {
    e.preventDefault();
    setSavingUser(true);
    try {
      if (editingUser) {
        const payload = {
          name: userFormData.name,
          role: userFormData.role,
          committee: userFormData.committee,
          avatar: userFormData.avatar
        };
        if (userFormData.password && userFormData.password.trim()) {
          payload.password = userFormData.password.trim();
        }

        const res = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          showToast(`Officer "${userFormData.name}" updated successfully!`);
          setEditingUser(null);
          await loadUsersData();
        } else {
          showToast('Failed to update officer', 'error');
        }
      } else {
        if (!userFormData.username || !userFormData.password) {
          showToast('Username and password are required', 'error');
          setSavingUser(false);
          return;
        }

        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userFormData)
        });

        if (res.ok) {
          showToast(`Created officer "${userFormData.name}" (@${userFormData.username}) successfully!`);
          setIsCreateUserModalOpen(false);
          await loadUsersData();
        } else {
          const errData = await res.json();
          showToast(errData.error || 'Failed to create officer', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while saving user', 'error');
    } finally {
      setSavingUser(false);
    }
  }

  async function handleDeleteUser(targetUser) {
    if (user?.id === targetUser.id || user?.username === targetUser.username) {
      alert(language === 'km' ? 'មិនអាចលុបគណនីដែលកំពុងចូលប្រើបានទេ!' : language === 'zh' ? '无法删除当前已登录的账号！' : 'Cannot delete your currently logged-in account.');
      return;
    }
    const confirmMsg = t('admin.usersSection.deleteConfirm', 'Are you sure you want to delete user "{name}" (@{username})? This action cannot be undone.')
      .replace('{name}', targetUser.name)
      .replace('{username}', targetUser.username);

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/users/${targetUser.id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`User @${targetUser.username} deleted.`);
        await loadUsersData();
      } else {
        showToast('Failed to delete user', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting user', 'error');
    }
  }

  // Preset rejection comments
  const presetReasonsByLang = {
    en: [
      'Schedule or venue capacity limitation. Please contact the expo committee.',
      'Safety hazard: Violates convention center fire or chemical safety codes.',
      'Duplicate booth submission or conflicting exhibition space.',
      'Incomplete technical setup description and power requirements.',
      'Proposal not aligned with EXPO 2026 tech & innovation themes.'
    ],
    km: [
      'កាលវិភាគ ឬទំហំទីតាំងមានកម្រិតកំណត់។ សូមទាក់ទងគណៈកម្មការពិព័រណ៍។',
      'បញ្ហាសុវត្ថិភាព៖ បំពានបទប្បញ្ញត្តិសុវត្ថិភាពអគ្គីភ័យ ឬសារធាតុគីមីរបស់មជ្ឈមណ្ឌល។',
      'ការដាក់ស្នើស្តង់ជាន់គ្នា ឬទីតាំងតាំងពិព័រណ៍មានទំនាស់។',
      'ការពិពណ៌នាអំពីការដំឡើងបច្ចេកទេស និងតម្រូវការអគ្គិសនីមិនពេញលេញ។',
      'សំណើមិនស្របតាមប្រធានបទបច្ចេកវិទ្យា និងនវានុវត្តន៍នៃ EXPO 2026។'
    ],
    zh: [
      '日程安排或场馆容量受限，请联系世博组委会协调。',
      '安全隐患：不符合会展中心消防或化学品安全规范。',
      '展位申请重复或展区空间存在冲突。',
      '技术搭建说明及电力负荷需求描述不完整。',
      '方案内容不符合 2026 世博会科技创新主题。'
    ]
  };
  const presetReasons = presetReasonsByLang[language] || presetReasonsByLang.en;

  // If user is not admin or committee officer, show Authentication Gate
  if (authLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>
          {language === 'km' ? 'កំពុងផ្ទៀងផ្ទាត់សិទ្ធិអ្នកគ្រប់គ្រង...' : language === 'zh' ? '正在验证管理员权限...' : 'Checking administrator credentials...'}
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '520px', margin: '60px auto', padding: '0 24px' }}>
        <div className="glass-panel" style={{ padding: '40px 32px', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Lock size={32} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
            {language === 'km' ? 'តម្រូវឱ្យមានសិទ្ធិអ្នកគ្រប់គ្រង' : language === 'zh' ? '需要管理员访问权限' : 'Administrator Access Required'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.6' }}>
            {language === 'km' 
              ? 'ផ្ទាំងគ្រប់គ្រង Dashboard អនុញ្ញាតឱ្យគ្រប់គ្រងទិន្នន័យព្រឹត្តិការណ៍ គណៈកម្មការទាំង ១០ និងគណនីមន្ត្រី។ សូមចូលប្រើដោយប្រើគណនីអ្នកគ្រប់គ្រង ឬមន្ត្រីគណៈកម្មការ។'
              : language === 'zh'
              ? '管理后台支持完整数据管理、10个分委员会架构以及官员账号权限配置。请使用管理员或委员会凭据登录。'
              : 'The Admin Dashboard manages events, all 10 specialized committees, and officer accounts. Please sign in with committee credentials.'}
          </p>

          {/* Admin Login Form */}
          <form onSubmit={handleInlineAdminLogin} style={{ background: 'var(--btn-secondary-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <ShieldCheck size={15} color="var(--primary)" />
              <span>{language === 'km' ? 'ចូលប្រើប្រព័ន្ធគ្រប់គ្រង' : language === 'zh' ? '登录管理系统' : 'Sign In to Dashboard'}</span>
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '4px' }}>{t('auth.usernameLabel', 'Username')}</label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={e => setAdminUsername(e.target.value)}
                placeholder="Username"
                className="form-input"
                style={{ fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '4px' }}>{t('auth.passwordLabel', 'Password')}</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ fontSize: '0.875rem' }}
              />
            </div>
            <button
              type="submit"
              disabled={adminAuthLoading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '10px 14px', fontWeight: '700', marginTop: '6px' }}
            >
              <LogIn size={15} />
              <span>
                {adminAuthLoading 
                  ? t('auth.signingIn', 'Authenticating...') 
                  : (language === 'km' ? 'ចូលប្រើប្រាស់' : language === 'zh' ? '立即登录' : 'Sign In')}
              </span>
            </button>
          </form>

          {adminAuthError && (
            <div style={{ background: 'var(--status-rejected-bg)', border: '1px solid var(--status-rejected-border)', color: 'var(--status-rejected)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
              {adminAuthError}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <Link href="/" className="btn btn-secondary btn-sm">
              {language === 'km' ? 'ត្រឡប់ទៅទំព័រដើម' : language === 'zh' ? '返回首页' : 'Return to Homepage'}
            </Link>
            <Link href="/login" className="btn btn-outline btn-sm">
              <LogIn size={14} />
              <span>{t('auth.signInLink', 'Login Page')}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Events (Optimized with useMemo)
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
      if (committeeFilter !== 'all' && e.subCommittee !== committeeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = e.title?.toLowerCase().includes(q);
        const matchOrg = e.organizer?.toLowerCase().includes(q);
        const matchUser = (e.contactUsername || e.contactEmail)?.toLowerCase().includes(q);
        const matchBooth = e.boothNumber?.toLowerCase().includes(q);
        const matchLoc = e.location?.toLowerCase().includes(q);
        const matchComm = e.subCommittee?.toLowerCase().includes(q);
        if (!matchTitle && !matchOrg && !matchUser && !matchBooth && !matchLoc && !matchComm) {
          return false;
        }
      }
      return true;
    });
  }, [events, statusFilter, categoryFilter, committeeFilter, searchQuery]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="badge-status badge-approved">
            <CheckCircle2 size={12} /> {t('statuses.approved', 'Approved')}
          </span>
        );
      case 'pending':
        return (
          <span className="badge-status badge-pending">
            <Clock size={12} /> {t('statuses.pending', 'Pending Review')}
          </span>
        );
      case 'rejected':
        return (
          <span className="badge-status badge-rejected">
            <XCircle size={12} /> {t('statuses.rejected', 'Rejected')}
          </span>
        );
      default:
        return <span className="badge-status">{status}</span>;
    }
  };

  const getCategoryBadge = (cat) => {
    const meta = getCategoryMeta(cat, language);
    return (
      <span 
        className="badge-category"
        style={{
          background: meta.bg,
          color: meta.color,
          border: `1px solid ${meta.border}`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px'
        }}
      >
        <span>{meta.emoji}</span>
        <span>{meta.label}</span>
      </span>
    );
  };

  return (
    <div className="admin-layout-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          padding: '12px 20px',
          borderRadius: '12px',
          background: toastMessage.type === 'error' ? 'var(--status-rejected)' : 'var(--status-approved)',
          color: '#fff',
          fontWeight: '600',
          fontSize: '0.9rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'scaleUp 0.2s ease'
        }}>
          {toastMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* Modern Collapsible Admin Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        eventsCount={events.length}
        categoriesCount={categories.length}
        committeesCount={committeesList.length}
        usersCount={usersList.length}
        dbConnected={Boolean(dbStatus?.connected)}
        user={user}
        userHasUniversalAuthority={userHasUniversalAuthority}
        language={language}
        t={t}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Viewport */}
      <main className="admin-main-content">
        {/* Mobile Top Navigation Trigger */}
        <div className="admin-mobile-topbar">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="btn btn-secondary btn-sm"
          >
            <Menu size={16} />
            <span>{language === 'km' ? 'ម៉ឺនុយ Menu' : language === 'zh' ? '管理菜单' : 'Sidebar Menu'}</span>
          </button>
          <span style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-muted)' }}>
            {activeSection.toUpperCase()}
          </span>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <ShieldCheck size={20} />
              </div>
              <h1 style={{ fontSize: '1.95rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                {t('admin.badge', 'Admin Control & Data Manager')}
              </h1>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {t('admin.subtitle', 'Full administrator authority: approve, reject, create, edit, and manage all expo events, committees, and users.')}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => setActiveSection('database')}
              className="btn btn-secondary btn-sm"
              style={{
                borderColor: dbStatus?.connected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)',
                background: dbStatus?.connected ? 'var(--status-approved-bg)' : 'var(--status-pending-bg)',
                color: dbStatus?.connected ? 'var(--status-approved)' : 'var(--status-pending)',
                fontWeight: '700'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dbStatus?.connected ? '#10b981' : '#f59e0b' }} />
              <span>{dbStatus?.connected ? t('admin.dbConnected', 'Supabase: Direct Connected') : t('admin.dbReady', 'Supabase Direct (.env ready)')}</span>
            </button>

            <Link href="/timeline" className="btn btn-secondary btn-sm">
              <Calendar size={14} />
              <span>{t('admin.viewTimelineBtn', 'View Timeline')}</span>
            </Link>
            <Link href="/committee" className="btn btn-secondary btn-sm">
              <Building size={14} />
              <span>{t('nav.committees', 'Committees Page')}</span>
            </Link>
          </div>
        </div>

        {/* AUTHORITY & ROLE BANNER */}
        <div style={{
          background: userHasUniversalAuthority 
            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(245, 158, 11, 0.12) 100%)'
            : 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(99, 102, 241, 0.1) 100%)',
          border: userHasUniversalAuthority ? '1.5px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(6, 182, 212, 0.35)',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: userHasUniversalAuthority ? '0 10px 25px -5px rgba(245, 158, 11, 0.15)' : 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: userHasUniversalAuthority ? 'rgba(245, 158, 11, 0.2)' : 'rgba(6, 182, 212, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              color: userHasUniversalAuthority ? '#f59e0b' : '#06b6d4',
              flexShrink: 0
            }}>
              {userHasUniversalAuthority ? '⭐' : '🏛️'}
            </div>
            <div>
              <div style={{ fontSize: '0.975rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span>
                  {userHasUniversalAuthority 
                    ? t('admin.authority.fullBadge', '⭐ Full Authority: Central Committee & Reception & Protocol (Can Manage Everything)')
                    : t('admin.authority.committeeScope', '🏛️ Committee Scope: {committee}').replace('{committee}', getSubCommitteeLocalizedName(userCommittee, language) || userCommittee || 'Assigned Domain')}
                </span>
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', background: 'var(--btn-secondary-bg)', color: 'var(--text-muted)' }}>
                  @{user?.username || 'officer'} ({user?.name})
                </span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.825rem', marginTop: '3px', lineHeight: '1.4' }}>
                {userHasUniversalAuthority 
                  ? t('admin.authority.canManageEverythingDesc', 'As a member of Central Committee or Reception & Protocol, you have universal authority to approve, reject, edit, and create events across all 10 committees.')
                  : t('admin.authority.scopedDesc', 'You have management authority over proposals submitted to your designated committee.')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: '20px',
              background: userHasUniversalAuthority ? 'rgba(245, 158, 11, 0.2)' : 'rgba(6, 182, 212, 0.2)',
              color: userHasUniversalAuthority ? '#f59e0b' : '#06b6d4',
              border: '1px solid currentColor'
            }}>
              {userHasUniversalAuthority ? (language === 'km' ? 'សិទ្ធិពេញលេញ' : language === 'zh' ? '超级全权' : 'Super-Admin') : (language === 'km' ? 'សិទ្ធិតាមផ្នែក' : language === 'zh' ? '委员会专属' : 'Domain Scoped')}
            </span>
          </div>
        </div>

      {/* =========================================================================
          SECTION 1: EVENTS & PROPOSALS
          ========================================================================= */}
      {activeSection === 'events' && (
        <div>
          {/* Action Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
                {t('admin.sections.events', 'Events & Proposals')}
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--btn-secondary-bg)', padding: '2px 8px', borderRadius: '6px' }}>
                {filteredEvents.length} {language === 'km' ? 'ធាតុ' : language === 'zh' ? '条' : 'items'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={openCreateModal} className="btn btn-primary btn-sm">
                <Plus size={15} />
                <span>{t('admin.addEventBtn', 'Add New Event')}</span>
              </button>
              <button onClick={loadDashboardData} className="btn btn-secondary btn-sm" title={t('admin.refreshBtn', 'Refresh')}>
                <RefreshCw size={14} />
                <span>{t('admin.refreshBtn', 'Refresh')}</span>
              </button>
              <button onClick={handleResetData} className="btn btn-outline btn-sm" title={language === 'km' ? 'ជម្រះព្រឹត្តិការណ៍ទាំងអស់' : language === 'zh' ? '清空所有活动数据' : 'Clear All Events'}>
                <Trash2 size={14} />
                <span>{language === 'km' ? 'ជម្រះព្រឹត្តិការណ៍' : language === 'zh' ? '清空活动' : 'Clear Events'}</span>
              </button>
            </div>
          </div>

          {/* KPI Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '18px', marginBottom: '32px' }}>
            <div className="glass-card" style={{ padding: '22px', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>
                  {t('admin.stats.total', 'Total Events')}
                </span>
                <Layers size={18} color="var(--primary)" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '8px' }}>
                {stats ? stats.total : '...'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                {t('admin.stats.totalSub', 'Managed in Expo database')}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '22px', borderLeft: '4px solid #f59e0b', background: 'var(--status-pending-bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--status-pending)', fontSize: '0.85rem', fontWeight: '700' }}>
                  {t('admin.stats.pending', 'Pending Action')}
                </span>
                <Clock size={18} color="#f59e0b" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--status-pending)', marginTop: '8px' }}>
                {stats ? stats.pending : '...'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--status-pending)', opacity: 0.85, marginTop: '4px' }}>
                {t('admin.stats.pendingSub', 'Awaiting committee decision')}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '22px', borderLeft: '4px solid #10b981', background: 'var(--status-approved-bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--status-approved)', fontSize: '0.85rem', fontWeight: '700' }}>
                  {t('admin.stats.approved', 'Approved & Live')}
                </span>
                <CheckCircle2 size={18} color="#10b981" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--status-approved)', marginTop: '8px' }}>
                {stats ? stats.approved : '...'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--status-approved)', opacity: 0.85, marginTop: '4px' }}>
                {t('admin.stats.approvedSub', 'Published on public timeline')}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '22px', borderLeft: '4px solid #ef4444', background: 'var(--status-rejected-bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--status-rejected)', fontSize: '0.85rem', fontWeight: '700' }}>
                  {t('admin.stats.rejected', 'Rejected')}
                </span>
                <XCircle size={18} color="#ef4444" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--status-rejected)', marginTop: '8px' }}>
                {stats ? stats.rejected : '...'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--status-rejected)', opacity: 0.85, marginTop: '4px' }}>
                {t('admin.stats.rejectedSub', 'Declined proposals')}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Status Tabs & View Switcher */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { key: 'all', label: t('admin.tabs.all', 'All Events'), count: stats?.total },
                    { key: 'pending', label: t('admin.tabs.pending', 'Pending Review'), count: stats?.pending, color: '#f59e0b' },
                    { key: 'approved', label: t('admin.tabs.approved', 'Approved'), count: stats?.approved, color: '#10b981' },
                    { key: 'rejected', label: t('admin.tabs.rejected', 'Rejected'), count: stats?.rejected, color: '#ef4444' },
                  ].map(tab => {
                    const isActive = statusFilter === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setStatusFilter(tab.key)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          border: '1px solid',
                          borderColor: isActive ? 'var(--primary)' : 'var(--border-subtle)',
                          background: isActive ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'var(--btn-secondary-bg)',
                          color: isActive ? '#fff' : 'var(--text-muted)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                          <span style={{
                            padding: '2px 7px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                            color: tab.color && !isActive ? tab.color : (isActive ? '#fff' : 'var(--text-main)')
                          }}>
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '4px', background: 'var(--btn-secondary-bg)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <button
                    onClick={() => setViewMode('table')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: viewMode === 'table' ? 'var(--primary)' : 'transparent',
                      color: viewMode === 'table' ? '#fff' : 'var(--text-muted)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}
                  >
                    <TableIcon size={14} />
                    <span>{t('admin.viewTable', 'Table')}</span>
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                      color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}
                  >
                    <LayoutGrid size={14} />
                    <span>{t('admin.viewCards', 'Cards')}</span>
                  </button>
                </div>
              </div>

              {/* Search & Committee Filters */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                  <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder={t('admin.searchPlaceholder', 'Search events by title, organizer, username, booth code...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px', paddingRight: '36px' }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', minWidth: '150px' }}
                >
                  <option value="all">{t('admin.filterCategories', 'All Categories')}</option>
                  {categories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.emoji} {c.name?.[language] || c.name?.en || c.key}
                    </option>
                  ))}
                </select>

                <select
                  value={committeeFilter}
                  onChange={(e) => setCommitteeFilter(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', minWidth: '220px' }}
                >
                  <option value="all">{t('admin.filterCommittees', 'All Sub-Committees')}</option>
                  {committeesList.map(sc => (
                    <option key={sc.id || sc.key} value={sc.key}>
                      {getSubCommitteeLocalizedName(sc.key, language)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Events Data Content */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '0.9rem' }}>
                {t('admin.loading', 'Loading expo data...')}
              </p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--btn-secondary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-dim)' }}>
                <Filter size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
                {t('admin.noMatchTitle', 'No events match your current filter')}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
                {t('admin.noMatchSubtitle', 'Try resetting filters or clear your search keyword.')}
              </p>
              <button onClick={() => { setStatusFilter('all'); setCategoryFilter('all'); setCommitteeFilter('all'); setSearchQuery(''); }} className="btn btn-secondary btn-sm">
                {t('timeline.clearFilters', 'Reset Filters')}
              </button>
            </div>
          ) : viewMode === 'table' ? (
            /* TABLE VIEW */
            <div className="glass-panel table-responsive" style={{ padding: '0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--btn-secondary-bg)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: language === 'en' ? 'uppercase' : 'none', letterSpacing: language === 'en' ? '0.05em' : 'normal' }}>
                    <th style={{ padding: '16px 20px' }}>{t('admin.table.proposal', 'Event Proposal')}</th>
                    <th style={{ padding: '16px 20px' }}>{t('admin.table.schedule', 'Schedule & Booth')}</th>
                    <th style={{ padding: '16px 20px' }}>{t('admin.table.submitter', 'Submitter')}</th>
                    <th style={{ padding: '16px 20px' }}>{t('admin.table.status', 'Status')}</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right' }}>{t('admin.table.actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => {
                    const isProcessing = processingId === event.id;
                    const canManage = canUserManageEventItem(event);

                    return (
                      <tr key={event.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s ease' }}>
                        {/* Title & Category & Committee */}
                        <td style={{ padding: '16px 20px', maxWidth: '340px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            {getCategoryBadge(event.category)}
                            {event.subCommittee && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>
                                {getSubCommitteeLocalizedName(event.subCommittee, language)}
                              </span>
                            )}
                            {event.featured && (
                              <span style={{ fontSize: '0.7rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                                {t('admin.featuredBadge', 'Featured')}
                              </span>
                            )}
                          </div>
                          <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '4px', wordBreak: 'break-word' }}>
                            {event.title}
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px' }}>
                            {event.description}
                          </div>
                        </td>

                        {/* Schedule & Booth */}
                        <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', fontWeight: '600', marginBottom: '3px' }}>
                            <Calendar size={13} color="var(--primary)" />
                            <span>{event.date}</span>
                            <span style={{ color: 'var(--text-dim)' }}>•</span>
                            <span>{event.time} – {event.endTime}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <MapPin size={13} color="#06b6d4" />
                            <span>{event.location}</span>
                            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>({event.boothNumber})</span>
                          </div>
                        </td>

                        {/* Submitter */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={13} color="#a855f7" />
                            <span>{event.organizer}</span>
                          </div>
                          {(event.contactUsername || event.contactEmail) && (
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.775rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <User size={11} color="var(--primary)" />
                              <span style={{ fontFamily: 'var(--font-mono)' }}>@{event.contactUsername || event.contactEmail}</span>
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                          <div>{getStatusBadge(event.status)}</div>
                          {event.status === 'rejected' && event.rejectedReason && (
                            <div style={{ fontSize: '0.725rem', color: 'var(--status-rejected)', maxWidth: '200px', marginTop: '4px', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={event.rejectedReason}>
                              {t('admin.rejectionReasonPrefix', 'Reason:')} {event.rejectedReason}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', flexWrap: 'wrap', minWidth: '180px' }}>
                            {/* View Preview Button (Always available) */}
                            <button
                              onClick={() => setPreviewEvent(event)}
                              className="btn btn-outline btn-sm"
                              title={t('admin.actions.preview', 'View Details')}
                              style={{ padding: '6px 8px' }}
                            >
                              <Eye size={13} />
                            </button>

                            {/* If user CANNOT manage this event, show lock */}
                            {!canManage ? (
                              <span
                                title={t('admin.authority.unauthorizedEvent', 'Assigned to {committee} — Read-only for your committee role').replace('{committee}', getSubCommitteeLocalizedName(event.subCommittee, language))}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  background: 'var(--btn-secondary-bg)',
                                  color: 'var(--text-dim)',
                                  fontSize: '0.75rem',
                                  cursor: 'not-allowed'
                                }}
                              >
                                <Lock size={12} />
                                <span>{language === 'km' ? 'បានចាក់សោ' : language === 'zh' ? '只读' : 'Read-only'}</span>
                              </span>
                            ) : (
                              <>
                                {/* Edit */}
                                <button
                                  onClick={() => openEditModal(event)}
                                  className="btn btn-secondary btn-sm"
                                  title={t('admin.actions.edit', 'Edit Event Details')}
                                  style={{ padding: '6px 8px' }}
                                >
                                  <Edit3 size={13} />
                                </button>

                                {/* Approve */}
                                {event.status !== 'approved' && (
                                  <button
                                    onClick={() => handleApprove(event)}
                                    disabled={isProcessing}
                                    className="btn btn-approve btn-sm"
                                    title={t('admin.actions.approve', 'Approve & Publish to Timeline')}
                                  >
                                    <Check size={14} />
                                    <span>{t('admin.actions.approve', 'Approve')}</span>
                                  </button>
                                )}

                                {/* Reject */}
                                {event.status !== 'rejected' && (
                                  <button
                                    onClick={() => openRejectModal(event)}
                                    disabled={isProcessing}
                                    className="btn btn-reject btn-sm"
                                    title={t('admin.actions.reject', 'Reject Proposal')}
                                  >
                                    <X size={14} />
                                    <span>{t('admin.actions.reject', 'Reject')}</span>
                                  </button>
                                )}

                                {/* Revert to pending */}
                                {event.status !== 'pending' && (
                                  <button
                                    onClick={() => handleSetPending(event)}
                                    disabled={isProcessing}
                                    className="btn btn-secondary btn-sm"
                                    title={t('admin.actions.revertPending', 'Move back to Pending Review')}
                                  >
                                    <RotateCcw size={12} />
                                  </button>
                                )}

                                {/* Delete */}
                                <button
                                  onClick={() => handleDelete(event)}
                                  disabled={isProcessing}
                                  className="btn btn-outline btn-sm"
                                  style={{ color: '#ef4444', padding: '6px 8px' }}
                                  title={t('admin.actions.delete', 'Delete Event')}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* CARD GRID VIEW */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
              {filteredEvents.map((event) => {
                const isProcessing = processingId === event.id;
                const canManage = canUserManageEventItem(event);

                return (
                  <div
                    key={event.id}
                    className="glass-card"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderTop: event.status === 'approved' ? '3px solid #10b981' : event.status === 'rejected' ? '3px solid #ef4444' : '3px solid #f59e0b'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          {getCategoryBadge(event.category)}
                          {event.subCommittee && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)', padding: '2px 7px', borderRadius: '4px', fontWeight: '600' }}>
                              {getSubCommitteeLocalizedName(event.subCommittee, language)}
                            </span>
                          )}
                        </div>
                        {getStatusBadge(event.status)}
                      </div>

                      <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px', lineHeight: '1.3' }}>
                        {event.title}
                      </h3>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '16px' }}>
                        {event.description}
                      </p>

                      <div style={{ background: 'var(--btn-secondary-bg)', padding: '12px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}>
                          <Calendar size={13} color="var(--primary)" />
                          <span>{event.date} • {event.time} – {event.endTime}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                          <MapPin size={13} color="#06b6d4" />
                          <span>{event.location} (Booth {event.boothNumber})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                          <User size={13} color="#a855f7" />
                          <span>{event.organizer}</span>
                        </div>
                      </div>

                      {event.status === 'rejected' && event.rejectedReason && (
                        <div style={{ background: 'var(--status-rejected-bg)', border: '1px solid var(--status-rejected-border)', borderRadius: '8px', padding: '10px', fontSize: '0.8rem', color: 'var(--status-rejected)', marginBottom: '16px' }}>
                          <strong>{t('admin.rejectionReasonPrefix', 'Reason:')}</strong> {event.rejectedReason}
                        </div>
                      )}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => setPreviewEvent(event)} className="btn btn-outline btn-sm" title={t('admin.actions.preview', 'Preview')}>
                          <Eye size={13} />
                        </button>
                        {canManage && (
                          <button onClick={() => openEditModal(event)} className="btn btn-secondary btn-sm" title={t('admin.actions.edit', 'Edit')}>
                            <Edit3 size={13} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        {!canManage ? (
                          <span
                            title={t('admin.authority.unauthorizedEvent', 'Assigned to {committee} — Read-only for your committee role').replace('{committee}', getSubCommitteeLocalizedName(event.subCommittee, language))}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 8px', borderRadius: '6px', background: 'var(--btn-secondary-bg)', color: 'var(--text-dim)', fontSize: '0.75rem' }}
                          >
                            <Lock size={12} />
                            <span>{language === 'km' ? 'បានចាក់សោ' : language === 'zh' ? '只读' : 'Read-only'}</span>
                          </span>
                        ) : (
                          <>
                            {event.status !== 'approved' && (
                              <button onClick={() => handleApprove(event)} disabled={isProcessing} className="btn btn-approve btn-sm">
                                <Check size={14} />
                                <span>{t('admin.actions.approve', 'Approve')}</span>
                              </button>
                            )}

                            {event.status !== 'rejected' && (
                              <button onClick={() => openRejectModal(event)} disabled={isProcessing} className="btn btn-reject btn-sm">
                                <X size={14} />
                                <span>{t('admin.actions.reject', 'Reject')}</span>
                              </button>
                            )}

                            <button onClick={() => handleDelete(event)} disabled={isProcessing} className="btn btn-outline btn-sm" style={{ color: '#ef4444' }} title={t('admin.actions.delete', 'Delete')}>
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION: VERIFICATION CODES & MEMBER INVITATIONS (PRESIDENT APPROVAL)
          ========================================================================= */}
      {activeSection === 'invites' && (
        <InvitesManager showToast={showToast} />
      )}

      {/* =========================================================================
          SECTION: COMMITTEE MEMBERS ROSTER
          ========================================================================= */}
      {activeSection === 'members' && (
        <MembersManager showToast={showToast} />
      )}

      {/* =========================================================================
          SECTION: EXPO IDENTITY & BRAND LOGO
          ========================================================================= */}
      {activeSection === 'identity' && (
        <IdentityManager showToast={showToast} />
      )}

      {/* =========================================================================
          SECTION: TIMELINE SCHEDULE & DAYS
          ========================================================================= */}
      {activeSection === 'timeline' && (
        <TimelineManager showToast={showToast} />
      )}

      {/* =========================================================================
          SECTION: MULTILINGUAL TRANSLATIONS CENTER
          ========================================================================= */}
      {activeSection === 'translations' && (
        <TranslationsManager showToast={showToast} />
      )}

      {/* =========================================================================
          SECTION: CATEGORIES & CLASSIFICATIONS MANAGER
          ========================================================================= */}
      {activeSection === 'categories' && (
        <CategoriesManager showToast={showToast} />
      )}

      {/* =========================================================================
          SECTION 2: COMMITTEES & SUBCOMMITTEES SETUP (Must choose from Member roster)
          ========================================================================= */}
      {activeSection === 'committees' && (
        <CommitteesManager showToast={showToast} />
      )}

      {/* =========================================================================
          SECTION 3: USER ACCOUNTS & COMMITTEE ROLES
          ========================================================================= */}
      {activeSection === 'users' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                {t('admin.usersSection.title', 'User Accounts & Committee Assignments')}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {t('admin.usersSection.subtitle', 'Manage administrative officers, usernames, assigned committees, and access privileges.')}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={openCreateUserModal} className="btn btn-primary btn-sm">
                <Plus size={15} />
                <span>{t('admin.usersSection.addOfficerBtn', 'Add New Officer')}</span>
              </button>
              <button onClick={loadUsersData} className="btn btn-secondary btn-sm">
                <RefreshCw size={14} />
                <span>{t('admin.refreshBtn', 'Refresh')}</span>
              </button>
            </div>
          </div>

          {usersLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : (
            <div className="glass-panel table-responsive" style={{ padding: '0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--btn-secondary-bg)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: language === 'en' ? 'uppercase' : 'none' }}>
                    <th style={{ padding: '16px 20px' }}>{t('admin.usersSection.fullName', 'Officer / Full Name')}</th>
                    <th style={{ padding: '16px 20px' }}>{t('admin.usersSection.username', 'Username')}</th>
                    <th style={{ padding: '16px 20px' }}>{t('admin.usersSection.committee', 'Committee Assignment')}</th>
                    <th style={{ padding: '16px 20px' }}>{t('admin.usersSection.role', 'Role')}</th>
                    <th style={{ padding: '16px 20px' }}>{t('admin.usersSection.authorityCol', 'Authority Scope')}</th>
                    <th style={{ padding: '16px 20px', textAlign: 'right' }}>{t('admin.table.actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => {
                    const isSuper = checkCanManageEverything(u);

                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        {/* Name & Avatar */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                              {u.avatar || '👨‍💼'}
                            </div>
                            <div>
                              <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                                {u.name}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                {u.id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Username */}
                        <td style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: '600' }}>
                          @{u.username}
                        </td>

                        {/* Committee */}
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 9px',
                            borderRadius: '6px',
                            background: 'rgba(99, 102, 241, 0.12)',
                            color: 'var(--text-main)',
                            fontSize: '0.8rem',
                            fontWeight: '600'
                          }}>
                            <span>🏛️</span>
                            <span>{getSubCommitteeLocalizedName(u.committee, language) || u.committee || 'None'}</span>
                          </span>
                        </td>

                        {/* Role */}
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            background: u.role === 'admin' ? 'rgba(99, 102, 241, 0.2)' : 'var(--btn-secondary-bg)',
                            color: u.role === 'admin' ? 'var(--primary)' : 'var(--text-muted)'
                          }}>
                            {u.role}
                          </span>
                        </td>

                        {/* Authority Scope */}
                        <td style={{ padding: '16px 20px' }}>
                          {isSuper ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              background: 'rgba(245, 158, 11, 0.18)',
                              color: '#f59e0b',
                              fontSize: '0.75rem',
                              fontWeight: '800',
                              border: '1px solid rgba(245, 158, 11, 0.35)'
                            }}>
                              ⭐ {t('admin.usersSection.superAdminBadge', 'Full Authority (Super-Admin)')}
                            </span>
                          ) : (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              background: 'var(--btn-secondary-bg)',
                              color: 'var(--text-muted)',
                              fontSize: '0.75rem',
                              fontWeight: '600'
                            }}>
                              🏛️ {t('admin.usersSection.officerBadge', 'Committee Officer')}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                            <button
                              onClick={() => openEditUserModal(u)}
                              className="btn btn-secondary btn-sm"
                              title={t('admin.usersSection.editUserBtn', 'Edit Officer')}
                              style={{ padding: '6px 8px' }}
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="btn btn-outline btn-sm"
                              style={{ color: '#ef4444', padding: '6px 8px' }}
                              title={t('admin.usersSection.deleteUserBtn', 'Delete Account')}
                              disabled={user?.id === u.id || user?.username === u.username}
                            >
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
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION 4: DATABASE & SYSTEM
          ========================================================================= */}
      {activeSection === 'database' && (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Database size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {language === 'km' ? 'ការកំណត់រចនាសម្ព័ន្ធមូលដ្ឋានទិន្នន័យ Supabase PostgreSQL' : language === 'zh' ? 'Supabase PostgreSQL 数据库系统配置' : 'Supabase PostgreSQL Database Configuration'}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {language === 'km' ? 'ទិន្នន័យទាំងអស់ត្រូវបានផ្ទុកដោយផ្ទាល់ពី DB Supabase ដោយគ្មាន mock seed data' : language === 'zh' ? '所有数据均由 Supabase 数据库实时提供，已完全移除任何本地 mock 数据' : 'All events, committees, and user accounts are directly connected to live Supabase PostgreSQL.'}
                </p>
              </div>
            </div>

            <div style={{ background: 'var(--btn-secondary-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                  {language === 'km' ? 'ស្ថានភាពការតភ្ជាប់ផ្ទាល់៖' : language === 'zh' ? '实时连接状态：' : 'Live Connection Status:'}
                </span>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontWeight: '800',
                  fontSize: '0.8rem',
                  background: dbStatus?.connected ? 'var(--status-approved-bg)' : 'var(--status-pending-bg)',
                  color: dbStatus?.connected ? 'var(--status-approved)' : 'var(--status-pending)'
                }}>
                  {dbStatus?.connected ? '✓ Direct Connected' : '⚡ Local Fallback'}
                </span>
              </div>

              <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '16px' }}>
                {dbStatus?.message}
              </div>

              {/* Counters */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ background: 'var(--input-bg)', padding: '14px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{dbStatus?.eventsCount ?? events.length}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{language === 'km' ? 'ព្រឹត្តិការណ៍ក្នុង DB' : language === 'zh' ? '数据库活动记录' : 'Events in DB'}</div>
                </div>
                <div style={{ background: 'var(--input-bg)', padding: '14px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{dbStatus?.usersCount ?? usersList.length}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{language === 'km' ? 'មន្ត្រី/អ្នកប្រើក្នុង DB' : language === 'zh' ? '数据库用户记录' : 'Officers & Users in DB'}</div>
                </div>
                <div style={{ background: 'var(--input-bg)', padding: '14px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#8b5cf6' }}>{dbStatus?.committeesCount ?? committeesList.length}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{language === 'km' ? 'គណៈកម្មការក្នុង DB' : language === 'zh' ? '数据库委员会记录' : 'Committees in DB'}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={async () => {
                  setDbRefreshing(true);
                  await loadDashboardData();
                  setDbRefreshing(false);
                  showToast('Database connection tested and synchronized.');
                }}
                disabled={dbRefreshing}
                className="btn btn-secondary btn-sm"
              >
                <RefreshCw size={14} />
                <span>{dbRefreshing ? 'Checking...' : (language === 'km' ? 'សាកល្បងការតភ្ជាប់ឡើងវិញ' : language === 'zh' ? '测试并刷新连接' : 'Test & Refresh Connection')}</span>
              </button>
              <button onClick={handleResetData} className="btn btn-outline btn-sm">
                <Trash2 size={14} />
                <span>{language === 'km' ? 'ជម្រះព្រឹត្តិការណ៍' : language === 'zh' ? '清空活动' : 'Clear Events'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      </main>

      {/* =========================================================================
          MODALS
          ========================================================================= */}

      {/* CREATE & EDIT EVENT MODAL */}
      {(isCreateModalOpen || editingEvent) && (
        <div className="modal-overlay" onClick={() => { setIsCreateModalOpen(false); setEditingEvent(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  {editingEvent ? <Edit3 size={20} /> : <Plus size={20} />}
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {editingEvent ? t('admin.modalEditTitle', 'Edit Event Details') : t('admin.modalCreateTitle', 'Add New Expo Event')}
                </h3>
              </div>
              <button onClick={() => { setIsCreateModalOpen(false); setEditingEvent(null); }} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">{t('submit.fieldTitle', 'Event or Booth Title')} *</label>
                <input
                  type="text"
                  required
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Robotics Center of Excellence"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div>
                  <label className="form-label">{t('submit.fieldCategory', 'Category')}</label>
                  <select
                    value={eventFormData.category}
                    onChange={(e) => {
                      const newCatKey = e.target.value;
                      const catObj = categories.find(c => c.key === newCatKey);
                      setEventFormData({
                        ...eventFormData,
                        category: newCatKey,
                        subCommittee: catObj?.defaultSubCommittee || eventFormData.subCommittee
                      });
                    }}
                    className="form-select"
                  >
                    {categories.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.emoji} {c.name?.[language] || c.name?.en || c.key}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">{t('submit.fieldSubCommittee', 'Target Committee')}</label>
                  <select
                    value={eventFormData.subCommittee}
                    onChange={(e) => setEventFormData({ ...eventFormData, subCommittee: e.target.value })}
                    className="form-select"
                  >
                    {committeesList.map(sc => (
                      <option key={sc.id || sc.key} value={sc.key}>
                        {sc.lead?.avatar || '🏛️'} {getSubCommitteeLocalizedName(sc.key, language)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">{t('admin.table.status', 'Status')}</label>
                  <select
                    value={eventFormData.status}
                    onChange={(e) => setEventFormData({ ...eventFormData, status: e.target.value })}
                    className="form-select"
                  >
                    <option value="approved">{t('statuses.approved', 'Approved & Live')}</option>
                    <option value="pending">{t('statuses.pending', 'Pending Review')}</option>
                    <option value="rejected">{t('statuses.rejected', 'Rejected')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">{t('submit.fieldDescription', 'Description')}</label>
                <textarea
                  rows={3}
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                  className="form-textarea"
                  placeholder={t('submit.fieldDescriptionPlaceholder', 'Detail what attendees will see and experience...')}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div>
                  <label className="form-label">{t('submit.fieldDate', 'Expo Date')}</label>
                  <select
                    value={eventFormData.date}
                    onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                    className="form-select"
                  >
                    <option value="2026-10-12">{language === 'km' ? 'ថ្ងៃទី១: ១២ តុលា' : language === 'zh' ? '第1天：10月12日' : 'Day 1: Oct 12'}</option>
                    <option value="2026-10-13">{language === 'km' ? 'ថ្ងៃទី២: ១៣ តុលា' : language === 'zh' ? '第2天：10月13日' : 'Day 2: Oct 13'}</option>
                    <option value="2026-10-14">{language === 'km' ? 'ថ្ងៃទី៣: ១៤ តុលា' : language === 'zh' ? '第3天：10月14日' : 'Day 3: Oct 14'}</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">{t('submit.fieldStartTime', 'Start Time')}</label>
                  <input
                    type="text"
                    value={eventFormData.time}
                    onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })}
                    className="form-input"
                    placeholder="10:00"
                  />
                </div>
                <div>
                  <label className="form-label">{t('submit.fieldEndTime', 'End Time')}</label>
                  <input
                    type="text"
                    value={eventFormData.endTime}
                    onChange={(e) => setEventFormData({ ...eventFormData, endTime: e.target.value })}
                    className="form-input"
                    placeholder="16:00"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label className="form-label">{t('submit.fieldLocation', 'Location / Zone')}</label>
                  <input
                    type="text"
                    value={eventFormData.location}
                    onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                    className="form-input"
                    placeholder="Hall A Pavilion"
                  />
                </div>
                <div>
                  <label className="form-label">{t('submit.fieldBooth', 'Booth Number')}</label>
                  <input
                    type="text"
                    value={eventFormData.boothNumber}
                    onChange={(e) => setEventFormData({ ...eventFormData, boothNumber: e.target.value })}
                    className="form-input"
                    placeholder="A-12"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label className="form-label">{t('submit.fieldOrganizer', 'Host / Organizer')}</label>
                  <input
                    type="text"
                    value={eventFormData.organizer}
                    onChange={(e) => setEventFormData({ ...eventFormData, organizer: e.target.value })}
                    className="form-input"
                    placeholder="Company or Organizers"
                  />
                </div>
                <div>
                  <label className="form-label">{t('submit.fieldUsername', 'Submitter Username')}</label>
                  <input
                    type="text"
                    value={eventFormData.contactUsername}
                    onChange={(e) => setEventFormData({ ...eventFormData, contactUsername: e.target.value })}
                    className="form-input"
                    placeholder="e.g. admin or booth_lead"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">{t('submit.fieldTags', 'Tags')}</label>
                  <input
                    type="text"
                    value={eventFormData.tags}
                    onChange={(e) => setEventFormData({ ...eventFormData, tags: e.target.value })}
                    className="form-input"
                    placeholder="AI, Robotics, Showcase"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
                  <input
                    type="checkbox"
                    id="featuredCheck"
                    checked={eventFormData.featured}
                    onChange={(e) => setEventFormData({ ...eventFormData, featured: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="featuredCheck" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }}>
                    {t('admin.featuredCheckbox', 'Featured Spotlight')}
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => { setIsCreateModalOpen(false); setEditingEvent(null); }} className="btn btn-secondary btn-sm">
                  {t('admin.cancel', 'Cancel')}
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Check size={14} />
                  <span>{editingEvent ? t('admin.saveChanges', 'Save Changes') : t('admin.createEvent', 'Create Event')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* CREATE & EDIT OFFICER MODAL */}
      {(isCreateUserModalOpen || editingUser) && (
        <div className="modal-overlay" onClick={() => { setIsCreateUserModalOpen(false); setEditingUser(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '30px', maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  {editingUser ? <Edit3 size={20} /> : <Plus size={20} />}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {editingUser ? t('admin.usersSection.modalEditTitle', 'Edit Officer Details') : t('admin.usersSection.modalCreateTitle', 'Add New Committee Officer')}
                </h3>
              </div>
              <button onClick={() => { setIsCreateUserModalOpen(false); setEditingUser(null); }} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">{t('admin.usersSection.fullName', 'Full Name')} *</label>
                  <input
                    type="text"
                    required
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Sothea Chea"
                  />
                </div>
                <div>
                  <label className="form-label">{t('admin.usersSection.avatar', 'Avatar Emoji')}</label>
                  <input
                    type="text"
                    value={userFormData.avatar}
                    onChange={(e) => setUserFormData({ ...userFormData, avatar: e.target.value })}
                    className="form-input"
                    placeholder="👨‍💼"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">{t('admin.usersSection.username', 'Username')} *</label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editingUser)}
                    value={userFormData.username}
                    onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    className="form-input"
                    placeholder="e.g. protocol_officer"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                </div>
                <div>
                  <label className="form-label">
                    {editingUser ? t('admin.usersSection.passwordOptional', 'New Password (Optional)') : t('admin.usersSection.password', 'Password') + ' *'}
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    className="form-input"
                    placeholder={editingUser ? '••••••••' : 'Secret password'}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">{t('admin.usersSection.role', 'System Role')}</label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                    className="form-select"
                  >
                    <option value="sub_committee">{t('admin.usersSection.roleSubCommittee', 'Committee Officer')}</option>
                    <option value="admin">{t('admin.usersSection.roleAdmin', 'System Administrator')}</option>
                    <option value="user">{t('admin.usersSection.roleUser', 'General User')}</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">{t('admin.usersSection.committee', 'Assigned Committee')}</label>
                  <select
                    value={userFormData.committee}
                    onChange={(e) => setUserFormData({ ...userFormData, committee: e.target.value })}
                    className="form-select"
                  >
                    {committeesList.map(sc => (
                      <option key={sc.id || sc.key} value={sc.key}>
                        {sc.lead?.avatar || '🏛️'} {getSubCommitteeLocalizedName(sc.key, language)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => { setIsCreateUserModalOpen(false); setEditingUser(null); }} className="btn btn-secondary btn-sm">
                  {t('admin.cancel', 'Cancel')}
                </button>
                <button type="submit" disabled={savingUser} className="btn btn-primary btn-sm">
                  <Check size={14} />
                  <span>{savingUser ? 'Saving...' : editingUser ? t('admin.usersSection.saveOfficerBtn', 'Save Officer') : t('admin.usersSection.createOfficerBtn', 'Create Officer')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectingEvent && (
        <div className="modal-overlay" onClick={() => setRejectingEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--status-rejected-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-rejected)' }}>
                  <XCircle size={20} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {t('admin.rejectModalTitle', 'Reject Proposal')}
                </h3>
              </div>
              <button onClick={() => setRejectingEvent(null)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '18px' }}>
              {language === 'km' ? 'បដិសេធ' : language === 'zh' ? '拒绝' : 'Decline'} <strong>"{rejectingEvent.title}"</strong> {language === 'km' ? 'ដាក់ស្នើដោយ' : language === 'zh' ? '提交方：' : 'submitted by'} <em>{rejectingEvent.organizer}</em>.
            </p>

            {/* Quick Reason Presets */}
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">{t('admin.rejectReasonLabel', 'Select Common Rejection Reason:')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {presetReasons.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRejectionReason(p)}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: rejectionReason === p ? 'rgba(99, 102, 241, 0.15)' : 'var(--btn-secondary-bg)',
                      border: '1px solid',
                      borderColor: rejectionReason === p ? 'var(--primary)' : 'var(--border-subtle)',
                      color: rejectionReason === p ? 'var(--text-main)' : 'var(--text-muted)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    • {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Notes */}
            <div style={{ marginBottom: '24px' }}>
              <label className="form-label">{t('admin.rejectNoteLabel', 'Feedback / Reason Note for Submitter:')}</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="form-textarea"
                placeholder={language === 'km' ? 'ពន្យល់ពីមូលហេតុនៃការបដិសេធ...' : language === 'zh' ? '说明拒绝的具体原因与建议...' : 'Explain reason for rejection...'}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setRejectingEvent(null)} className="btn btn-secondary btn-sm">
                {t('admin.cancel', 'Cancel')}
              </button>
              <button onClick={handleConfirmReject} className="btn btn-reject btn-sm">
                <X size={14} />
                <span>{t('admin.confirmReject', 'Confirm Rejection')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW DETAILS MODAL */}
      {previewEvent && (
        <div className="modal-overlay" onClick={() => setPreviewEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  {getCategoryBadge(previewEvent.category)}
                  {getStatusBadge(previewEvent.status)}
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1.3' }}>
                  {previewEvent.title}
                </h2>
              </div>
              <button onClick={() => setPreviewEvent(null)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
              {previewEvent.description}
            </div>

            <div className="glass-panel" style={{ padding: '16px', background: 'var(--btn-secondary-bg)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px', fontSize: '0.85rem' }}>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>
                  {t('timeline.detailsModal.schedule', 'Schedule')}
                </div>
                <div style={{ color: 'var(--text-main)', fontWeight: '600', marginTop: '2px' }}>
                  {previewEvent.date} ({previewEvent.time} – {previewEvent.endTime})
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>
                  {t('timeline.detailsModal.location', 'Location & Booth')}
                </div>
                <div style={{ color: 'var(--text-main)', fontWeight: '600', marginTop: '2px' }}>
                  {previewEvent.location} (Booth: {previewEvent.boothNumber})
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>
                  {t('timeline.detailsModal.organizer', 'Submitter / Organization')}
                </div>
                <div style={{ color: 'var(--text-main)', fontWeight: '600', marginTop: '2px' }}>
                  {previewEvent.organizer}
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>
                  {t('submit.fieldUsername', 'Submitter Username')}
                </div>
                <div style={{ color: 'var(--primary)', fontWeight: '600', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  {(previewEvent.contactUsername || previewEvent.contactEmail) ? `@${previewEvent.contactUsername || previewEvent.contactEmail}` : (language === 'km' ? 'មិនបានផ្តល់' : language === 'zh' ? '未提供' : 'None provided')}
                </div>
              </div>
              <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>
                  {t('timeline.detailsModal.managingCommittee', 'Reviewing Sub-Committee')}
                </div>
                <div style={{ color: 'var(--text-main)', fontWeight: '700', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1rem' }}>🏛️</span>
                  <span>{previewEvent.subCommittee ? getSubCommitteeLocalizedName(previewEvent.subCommittee, language) : (language === 'km' ? 'គណៈកម្មការរៀបចំទូទៅ' : language === 'zh' ? '综合组委会' : 'General Organizing Committee')}</span>
                </div>
              </div>
            </div>

            {previewEvent.status === 'rejected' && previewEvent.rejectedReason && (
              <div style={{ background: 'var(--status-rejected-bg)', border: '1px solid var(--status-rejected-border)', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
                <div style={{ color: 'var(--status-rejected)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '4px' }}>
                  {t('admin.rejectionReasonPrefix', 'Reason:')}
                </div>
                <div style={{ color: 'var(--status-rejected)', fontSize: '0.85rem' }}>
                  {previewEvent.rejectedReason}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                ID: {previewEvent.id}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {canUserManageEventItem(previewEvent) && (
                  <>
                    <button
                      onClick={() => { const target = previewEvent; setPreviewEvent(null); openEditModal(target); }}
                      className="btn btn-secondary btn-sm"
                    >
                      <Edit3 size={13} />
                      <span>{t('admin.actions.edit', 'Edit')}</span>
                    </button>
                    {previewEvent.status !== 'approved' && (
                      <button
                        onClick={() => { handleApprove(previewEvent); setPreviewEvent(null); }}
                        className="btn btn-approve btn-sm"
                      >
                        <Check size={14} />
                        <span>{t('admin.actions.approve', 'Approve')}</span>
                      </button>
                    )}
                    {previewEvent.status !== 'rejected' && (
                      <button
                        onClick={() => { const target = previewEvent; setPreviewEvent(null); openRejectModal(target); }}
                        className="btn btn-reject btn-sm"
                      >
                        <X size={14} />
                        <span>{t('admin.actions.reject', 'Reject')}</span>
                      </button>
                    )}
                  </>
                )}
                <button onClick={() => setPreviewEvent(null)} className="btn btn-secondary btn-sm">
                  {t('timeline.detailsModal.close', 'Close Window')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
