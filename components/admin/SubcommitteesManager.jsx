'use client';

import { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  CheckSquare, 
  Calendar, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw,
  X
} from 'lucide-react';

export default function SubcommitteesManager({ showToast }) {
  const [subcommittees, setSubcommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadSubcommittees();
  }, []);

  async function loadSubcommittees() {
    setLoading(true);
    try {
      const res = await fetch('/api/subcommittees');
      if (res.ok) {
        const data = await res.json();
        setSubcommittees(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load subcommittees:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Sub-Committee Management & Workspaces
            </h2>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '2px 9px', borderRadius: '12px' }}>
              13 Domain Subcommittees
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Operational units overseeing exhibitions, VIP protocol, logistics, technical infrastructure, and media relations.
          </p>
        </div>

        <button onClick={loadSubcommittees} className="btn btn-secondary btn-sm" title="Refresh">
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Subcommittees Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '18px' }}>
          {subcommittees.map(sub => (
            <div
              key={sub.id}
              className="glass-card"
              style={{
                padding: '22px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                borderLeft: '4px solid var(--primary)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)' }}>
                    Unit #{sub.display_order || 1}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '800' }}>
                    ✓ Active
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px', lineHeight: '1.3' }}>
                  {sub.name}
                </h3>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '14px' }}>
                  {sub.description}
                </p>

                <div style={{ background: 'var(--btn-secondary-bg)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Head:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{sub.head_name || 'To Be Appointed'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Deputy:</span>
                    <span style={{ color: 'var(--text-main)' }}>{sub.deputy_head_name || 'Unassigned'}</span>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                <button
                  onClick={() => {
                    setSelectedSub(sub);
                    setActiveTab('overview');
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                >
                  <span>Open Workspace</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Committee Workspace Modal */}
      {selectedSub && (
        <div className="modal-overlay" onClick={() => setSelectedSub(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase' }}>
                  Dedicated Committee Workspace
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', margin: '4px 0 0' }}>
                  {selectedSub.name}
                </h3>
              </div>
              <button onClick={() => setSelectedSub(null)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Workspace Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', marginBottom: '18px', overflowX: 'auto' }}>
              {['overview', 'responsibilities', 'tasks', 'meetings', 'announcements'].map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === tab ? 'var(--primary)' : 'var(--btn-secondary-bg)',
                    color: activeTab === tab ? '#fff' : 'var(--text-muted)',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Workspace Content */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: 'var(--btn-secondary-bg)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>Mandate & Scope</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    {selectedSub.description}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ background: 'var(--btn-secondary-bg)', padding: '14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Committee Head</div>
                    <div style={{ fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>👑 {selectedSub.head_name}</div>
                  </div>
                  <div style={{ background: 'var(--btn-secondary-bg)', padding: '14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Deputy Head</div>
                    <div style={{ fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>⭐ {selectedSub.deputy_head_name}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'responsibilities' && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                <p>1. Formulate operational plans and safety protocols for this domain.</p>
                <p>2. Coordinate with Central Secretariat regarding resource allocation and budget.</p>
                <p>3. Submit weekly progress updates and ensure timely task execution on the Kanban board.</p>
                <p>4. Conduct operational dry-runs 48 hours prior to Expo opening ceremony.</p>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <CheckSquare size={28} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
                <div>All tasks assigned to this subcommittee are synchronized with the central Kanban Task board.</div>
              </div>
            )}

            {activeTab === 'meetings' && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Calendar size={28} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
                <div>Weekly standing meeting: Every Tuesday at 14:00 (Tongde Plaza Secretariat Office).</div>
              </div>
            )}

            {activeTab === 'announcements' && (
              <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '14px', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                📢 <strong>Latest Notice:</strong> All equipment requisition orders must be finalized and submitted to the Logistics Subcommittee by October 5, 2026.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
