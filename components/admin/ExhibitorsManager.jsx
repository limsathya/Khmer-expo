'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Tag, 
  RefreshCw,
  X
} from 'lucide-react';

export default function ExhibitorsManager({ showToast }) {
  const [exhibitors, setExhibitors] = useState([]);
  const [booths, setBooths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    booth_number: 'A-01',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    status: 'approved',
    featured: false
  });

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  async function loadData() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      const [eRes, bRes] = await Promise.all([
        fetch(`/api/exhibitors?${params.toString()}`),
        fetch('/api/booths')
      ]);
      if (eRes.ok) {
        const eData = await eRes.json();
        setExhibitors(Array.isArray(eData) ? eData : []);
      }
      if (bRes.ok) {
        const bData = await bRes.json();
        setBooths(Array.isArray(bData) ? bData : []);
      }
    } catch (err) {
      console.error('Failed to load exhibitors:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateExhibitor = async (e) => {
    e.preventDefault();
    if (!formData.company_name) return;

    try {
      const res = await fetch('/api/exhibitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        if (showToast) showToast(`Exhibitor ${formData.company_name} added successfully!`);
        setIsModalOpen(false);
        setFormData({
          company_name: '',
          booth_number: 'A-01',
          contact_name: '',
          contact_email: '',
          contact_phone: '',
          status: 'approved',
          featured: false
        });
        loadData();
      }
    } catch (err) {
      if (showToast) showToast('Error creating exhibitor', 'error');
    }
  };

  const filtered = exhibitors.filter(e => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (e.company_name || '').toLowerCase().includes(q) ||
      (e.booth_number || '').toLowerCase().includes(q) ||
      (e.industry || '').toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Exhibitors & Booth Allocations
            </h2>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '2px 9px', borderRadius: '12px' }}>
              {exhibitors.length} total
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Manage participating enterprises, allocated booth locations, contact persons, and directory visibility.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} />
            <span>Add Exhibitor</span>
          </button>
          <button onClick={loadData} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '14px 20px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1, minWidth: '260px' }}>
          <input
            type="text"
            placeholder="Search company, booth #, industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ maxWidth: '320px' }}
          />

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-input" style={{ width: 'auto' }}>
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Exhibitors Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <Building2 size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>No exhibitors found</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Add your first exhibiting enterprise or adjust filters.</p>
        </div>
      ) : (
        <div className="glass-panel table-responsive" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--btn-secondary-bg)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 16px' }}>Booth</th>
                <th style={{ padding: '12px 16px' }}>Company Name</th>
                <th style={{ padding: '12px 16px' }}>Industry & Origin</th>
                <th style={{ padding: '12px 16px' }}>Primary Contact</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(exh => (
                <tr key={exh.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '900', color: 'var(--primary)', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                    {exh.booth_number || 'TBD'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{exh.company_name}</div>
                    {exh.website && <a href={exh.website} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none' }}>{exh.website}</a>}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>{exh.industry || 'General Exhibition'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{exh.country || 'International'}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{exh.contact_name || 'N/A'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{exh.contact_email}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', background: exh.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: exh.status === 'approved' ? '#10b981' : '#f59e0b' }}>
                      {exh.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Exhibitor Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Add Exhibitor</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateExhibitor} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Phnom Penh Organic Rice"
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Allocated Booth</label>
                <select
                  value={formData.booth_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, booth_number: e.target.value }))}
                  className="form-input"
                >
                  {booths.map(b => (
                    <option key={b.id} value={b.booth_number}>
                      {b.booth_number} ({b.zone} - {b.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Contact Person</label>
                <input
                  type="text"
                  placeholder="e.g. Mr. Seng Visal"
                  value={formData.contact_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Contact Email</label>
                <input
                  type="email"
                  placeholder="e.g. contact@company.kh"
                  value={formData.contact_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  Save Exhibitor
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
