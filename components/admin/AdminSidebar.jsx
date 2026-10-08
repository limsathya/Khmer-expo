'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Tag, 
  Calendar, 
  Key, 
  Users, 
  Building, 
  Shield, 
  Sparkles, 
  Database, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  X,
  QrCode,
  Building2,
  Award,
  CheckSquare,
  FileText,
  BarChart3,
  LayoutDashboard,
  Briefcase,
  Image as ImageIcon
} from 'lucide-react';

export default function AdminSidebar({
  activeSection,
  setActiveSection,
  eventsCount = 0,
  categoriesCount = 0,
  zonesCount = 6,
  committeesCount = 10,
  usersCount = 1,
  dbConnected = false,
  user = null,
  userHasUniversalAuthority = false,
  language = 'en',
  t,
  collapsed = false,
  setCollapsed = () => {},
  mobileOpen = false,
  setMobileOpen = () => {}
}) {
  const navGroups = [
    {
      groupTitle: 'OVERVIEW',
      items: [
        {
          key: 'events',
          label: language === 'km' ? 'ផ្ទាំងគ្រប់គ្រង (Dashboard)' : language === 'zh' ? '总览看板 (Dashboard)' : 'Overview Dashboard',
          icon: LayoutDashboard
        }
      ]
    },
    {
      groupTitle: 'EVENT',
      items: [
        { 
          key: 'registrations', 
          label: language === 'km' ? 'ការចុះឈ្មោះ (Registrations)' : language === 'zh' ? '参会注册 (Registrations)' : 'Registrations', 
          icon: Users 
        },
        { 
          key: 'exhibitors', 
          label: language === 'km' ? 'អ្នកតាំងពិព័រណ៍ (Exhibitors)' : language === 'zh' ? '参展商 (Exhibitors)' : 'Exhibitors', 
          icon: Building2 
        },
        { 
          key: 'companies', 
          label: language === 'km' ? 'ក្រុមហ៊ុន & សហគ្រាស (Companies)' : language === 'zh' ? '参展企业 (Companies)' : 'Companies Directory', 
          icon: Briefcase 
        },
        { 
          key: 'booths', 
          label: language === 'km' ? 'ប្លង់ស្តង់ពិព័រណ៍ (Booths Map)' : language === 'zh' ? '展位平面图 (Booths)' : 'Booths Floor Map', 
          icon: MapPin 
        },
        { 
          key: 'program', 
          label: language === 'km' ? 'កម្មវិធី & កាលវិភាគ' : language === 'zh' ? '活动日程 (Program)' : 'Program & Schedule', 
          icon: Calendar 
        },
        { 
          key: 'speakers', 
          label: language === 'km' ? 'វាគ្មិនកិត្តិយស' : language === 'zh' ? '主讲嘉宾 (Speakers)' : 'Speakers & Guests', 
          icon: Award 
        },
        { 
          key: 'vip', 
          label: language === 'km' ? 'គណៈប្រតិភូ VIP' : language === 'zh' ? 'VIP贵宾 (VIP)' : 'VIP & Guests', 
          icon: ShieldCheck 
        },
      ]
    },
    {
      groupTitle: 'ORGANIZATION',
      items: [
        { 
          key: 'committees', 
          label: language === 'km' ? 'គណៈកម្មការរៀបចំ' : language === 'zh' ? '组委会架构' : 'Organizing Committee', 
          icon: Building, 
          count: committeesCount 
        },
        { 
          key: 'subcommittees', 
          label: language === 'km' ? 'អនុគណៈកម្មការទាំង១៣' : language === 'zh' ? '13个工作分会' : 'Sub-Committees', 
          icon: Layers 
        },
        { 
          key: 'tasks', 
          label: language === 'km' ? 'កិច្ចការងារ Kanban' : language === 'zh' ? '看板任务 (Tasks)' : 'Tasks (Kanban)', 
          icon: CheckSquare 
        },
        { 
          key: 'members', 
          label: language === 'km' ? 'បញ្ជីសមាជិក Roster' : language === 'zh' ? '正式成员名册' : 'Members Roster', 
          icon: Users 
        },
        { 
          key: 'invites', 
          label: language === 'km' ? 'កូដផ្ទៀងផ្ទាត់សមាជិក' : language === 'zh' ? '入会邀请与验证' : 'Codes & Approvals', 
          icon: Key 
        },
      ]
    },
    {
      groupTitle: 'OPERATIONS',
      items: [
        { 
          key: 'checkin', 
          label: language === 'km' ? 'ស្កេន QR Check-in' : language === 'zh' ? '现场核销签到' : 'QR Check-in', 
          icon: QrCode 
        },
        { 
          key: 'sponsors', 
          label: language === 'km' ? 'ដៃគូឧបត្ថម្ភ (Sponsors)' : language === 'zh' ? '赞助商合作' : 'Sponsors & Partners', 
          icon: Award 
        },
        { 
          key: 'news', 
          label: language === 'km' ? 'ព័ត៌មាន & សេចក្តីជូនដំណឹង' : language === 'zh' ? '新闻与动态' : 'News & Releases', 
          icon: FileText 
        },
        { 
          key: 'gallery', 
          label: language === 'km' ? 'វិចិត្រសាលរូបភាព (Gallery)' : language === 'zh' ? '活动画廊 (Gallery)' : 'Gallery & Media', 
          icon: ImageIcon 
        },
        { 
          key: 'categories', 
          label: language === 'km' ? 'ប្រភេទព្រឹត្តិការណ៍' : language === 'zh' ? '展会分类' : 'Categories', 
          icon: Tag, 
          count: categoriesCount 
        },
        { 
          key: 'zones', 
          label: language === 'km' ? 'សាល & ទីតាំងស្តង់' : language === 'zh' ? '展区展厅管理' : 'Zones & Halls', 
          icon: MapPin, 
          count: zonesCount 
        },
      ]
    },
    {
      groupTitle: 'ANALYTICS',
      items: [
        { 
          key: 'reports', 
          label: language === 'km' ? 'របាយការណ៍ & ទិន្នន័យ CSV' : language === 'zh' ? '数据统计与导出' : 'Reports & Analytics', 
          icon: BarChart3 
        },
      ]
    },
    {
      groupTitle: 'SYSTEM',
      items: [
        { 
          key: 'users', 
          label: language === 'km' ? 'គណនីអ្នកប្រើប្រាស់' : language === 'zh' ? '系统用户与角色' : 'User Accounts (RBAC)', 
          icon: Shield, 
          count: usersCount 
        },
        { 
          key: 'identity', 
          label: language === 'km' ? 'អត្តសញ្ញាណ & ឡូហ្គោ' : language === 'zh' ? '品牌与标识' : 'Identity & Logo', 
          icon: Sparkles 
        },
        { 
          key: 'database', 
          label: language === 'km' ? 'មូលដ្ឋានទិន្នន័យ Supabase' : language === 'zh' ? '数据库状态' : 'Database Status', 
          icon: Database,
          statusDot: dbConnected ? '#10b981' : '#f59e0b'
        },
      ]
    }
  ];

  const handleSelect = (key) => {
    setActiveSection(key);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', key === 'events' ? '/admin' : `/admin/${key}`);
    }
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="admin-sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Element */}
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Top: User profile badge & collapse toggle */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            paddingBottom: '14px',
            marginBottom: '10px',
            borderBottom: '1px solid var(--border-subtle)',
            gap: '8px'
          }}>
            {!collapsed ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: userHasUniversalAuthority ? 'rgba(245, 158, 11, 0.18)' : 'rgba(99, 102, 241, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}>
                  {user?.avatar || '👨‍💼'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    color: 'var(--text-main)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {user?.name || (user?.role === 'admin' ? 'Admin' : 'User')}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: userHasUniversalAuthority ? '#f59e0b' : 'var(--primary)',
                    fontWeight: '700'
                  }}>
                    {userHasUniversalAuthority 
                      ? (language === 'km' ? 'សិទ្ធិពេញលេញ ⭐' : language === 'zh' ? '超级全权 ⭐' : 'Super-Admin ⭐')
                      : (language === 'km' ? 'មន្ត្រីគណៈកម្មការ' : language === 'zh' ? '分会管理员' : 'Officer')}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                {user?.avatar || '👨‍💼'}
              </div>
            )}

            {/* Desktop Collapse Toggle Button */}
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'var(--btn-secondary-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                flexShrink: 0
              }}
              className="desktop-only-btn"
            >
              {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>

            {/* Mobile Close Button */}
            {mobileOpen && (
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: 'var(--btn-secondary-bg)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Nav Items Grouped */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {navGroups.map((group, gIdx) => (
              <div key={gIdx}>
                {!collapsed && (
                  <div className="admin-sidebar-group-title">
                    {group.groupTitle}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {group.items.map((item) => {
                    const isActive = activeSection === item.key;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => handleSelect(item.key)}
                        className={`admin-sidebar-btn ${isActive ? 'active' : ''}`}
                        title={collapsed ? item.label : undefined}
                        style={{
                          justifyContent: collapsed ? 'center' : 'space-between',
                          padding: collapsed ? '10px 0' : '9px 12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                          <Icon size={17} style={{ flexShrink: 0, color: isActive ? 'var(--primary)' : 'inherit' }} />
                          {!collapsed && (
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.label}
                            </span>
                          )}
                        </div>

                        {!collapsed && item.count !== undefined && (
                          <span style={{
                            padding: '1px 7px',
                            borderRadius: '9999px',
                            fontSize: '0.725rem',
                            fontWeight: '800',
                            background: isActive ? 'rgba(99, 102, 241, 0.25)' : 'var(--btn-secondary-bg)',
                            color: isActive ? 'var(--primary)' : 'var(--text-dim)',
                            border: '1px solid',
                            borderColor: isActive ? 'rgba(99, 102, 241, 0.4)' : 'transparent',
                            flexShrink: 0
                          }}>
                            {item.count}
                          </span>
                        )}

                        {item.statusDot && (
                          <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: item.statusDot,
                            boxShadow: `0 0 6px ${item.statusDot}`,
                            flexShrink: 0
                          }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Bottom: Public site shortcuts */}
        <div style={{
          paddingTop: '16px',
          marginTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {!collapsed ? (
            <>
              <Link 
                href="/timeline" 
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '0.78rem' }}
              >
                <Calendar size={14} />
                <span>{language === 'km' ? 'មើល Timeline សាធារណៈ' : language === 'zh' ? '查看公开时间线' : 'Public Timeline'}</span>
              </Link>
              <Link 
                href="/" 
                className="btn btn-outline btn-sm"
                style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '0.78rem' }}
              >
                <ExternalLink size={14} />
                <span>{language === 'km' ? 'ទៅទំព័រដើម' : language === 'zh' ? '返回展会首页' : 'Return to Site'}</span>
              </Link>
            </>
          ) : (
            <Link 
              href="/" 
              title="Return to Public Site"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: '8px',
                color: 'var(--text-muted)'
              }}
            >
              <ExternalLink size={16} />
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
