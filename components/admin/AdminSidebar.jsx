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
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';

export default function AdminSidebar({
  activeSection,
  setActiveSection,
  eventsCount = 0,
  categoriesCount = 0,
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
      groupTitle: language === 'km' ? 'ប្រតិបត្តិការ' : language === 'zh' ? '展会运营' : 'Operations',
      items: [
        { 
          key: 'events', 
          label: language === 'km' ? 'ព្រឹត្តិការណ៍ & សំណើ' : language === 'zh' ? '活动与提案' : 'Events & Proposals', 
          icon: Layers, 
          count: eventsCount 
        },
        { 
          key: 'categories', 
          label: language === 'km' ? 'ប្រភេទព្រឹត្តិការណ៍' : language === 'zh' ? '分类管理' : 'Categories', 
          icon: Tag, 
          count: categoriesCount 
        },
        { 
          key: 'timeline', 
          label: language === 'km' ? 'កាលវិភាគ Timeline' : language === 'zh' ? '时间线日程' : 'Timeline Schedule', 
          icon: Calendar 
        },
      ]
    },
    {
      groupTitle: language === 'km' ? 'គណៈកម្មការ & សិទ្ធិ' : language === 'zh' ? '委员会与成员' : 'Personnel & Roster',
      items: [
        { 
          key: 'invites', 
          label: language === 'km' ? 'កូដផ្ទៀងផ្ទាត់ & អនុម័ត' : language === 'zh' ? '验证码与审批' : 'Codes & Approvals', 
          icon: Key 
        },
        { 
          key: 'members', 
          label: language === 'km' ? 'បញ្ជីសមាជិក' : language === 'zh' ? '成员名册' : 'Members Roster', 
          icon: Users 
        },
        { 
          key: 'committees', 
          label: language === 'km' ? 'រចនាសម្ព័ន្ធគណៈកម្មការ' : language === 'zh' ? '委员会架构' : 'Committees Setup', 
          icon: Building, 
          count: committeesCount 
        },
        { 
          key: 'users', 
          label: language === 'km' ? 'គណនីអ្នកប្រើប្រាស់' : language === 'zh' ? '系统用户' : 'User Accounts', 
          icon: Shield, 
          count: usersCount 
        },
      ]
    },
    {
      groupTitle: language === 'km' ? 'ការកំណត់ប្រព័ន្ធ' : language === 'zh' ? '系统与设置' : 'System Settings',
      items: [
        { 
          key: 'identity', 
          label: language === 'km' ? 'អត្តសញ្ញាណ & ឡូហ្គោ' : language === 'zh' ? '品牌与标识' : 'Identity & Logo', 
          icon: Sparkles 
        },
        { 
          key: 'database', 
          label: language === 'km' ? 'មូលដ្ឋានទិន្នន័យ' : language === 'zh' ? '数据库系统' : 'Database & Status', 
          icon: Database,
          statusDot: dbConnected ? '#10b981' : '#f59e0b'
        },
      ]
    }
  ];

  const handleSelect = (key) => {
    setActiveSection(key);
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
                    {user?.name || 'Administrator'}
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
