'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  QrCode, 
  RefreshCw, 
  Printer, 
  X,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import QRCode from 'qrcode';

export default function RegistrationsManager({ showToast }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');

  // QR Modal
  const [qrModalItem, setQrModalItem] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Selected for batch action
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadRegistrations();
  }, [statusFilter, typeFilter, countryFilter]);

  async function loadRegistrations() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (countryFilter !== 'all') params.set('country', countryFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/registrations?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load registrations:', err);
      if (showToast) showToast('Failed to load registrations', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadRegistrations();
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        if (showToast) showToast(`Registration status set to ${status}`);
        loadRegistrations();
      }
    } catch (err) {
      if (showToast) showToast('Error updating status', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete registration for ${name}?`)) return;
    try {
      const res = await fetch(`/api/registrations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (showToast) showToast('Registration deleted');
        loadRegistrations();
      }
    } catch (err) {
      if (showToast) showToast('Error deleting registration', 'error');
    }
  };

  const handleOpenQR = async (item) => {
    setQrModalItem(item);
    try {
      const url = await QRCode.toDataURL(item.qr_token || item.reg_number, {
        width: 280,
        margin: 2,
        color: { dark: '#0f2b5c', light: '#ffffff' }
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error('Failed to render QR:', err);
    }
  };

  const handleExportCSV = () => {
    window.open('/api/reports?type=registrations&format=csv', '_blank');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Registration & Accreditation Management
            </h2>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '2px 9px', borderRadius: '12px' }}>
              {registrations.length} total
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Manage international visitors, exhibitors, buyers, VIP guests, and issue digital QR passes.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button onClick={loadRegistrations} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <input
                type="text"
                placeholder="Search attendee, organization, email, reg #..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '34px' }}
              />
              <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-input" style={{ width: 'auto' }}>
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="form-input" style={{ width: 'auto' }}>
              <option value="all">All Registration Types</option>
              <option value="Visitor">Visitor</option>
              <option value="Exhibitor">Exhibitor</option>
              <option value="Business Buyer">Business Buyer</option>
              <option value="University / Education Institution">Education / University</option>
              <option value="Media">Media</option>
              <option value="VIP">VIP</option>
              <option value="Official Guest">Official Guest</option>
            </select>

            <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="form-input" style={{ width: 'auto' }}>
              <option value="all">All Countries</option>
              <option value="Cambodia">Cambodia</option>
              <option value="China">China</option>
              <option value="Other">Other International</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>
      </div>

      {/* Registrations Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : registrations.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <Users size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>No registrations found</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Try adjusting your search criteria or register a new participant.</p>
        </div>
      ) : (
        <div className="glass-panel table-responsive" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--btn-secondary-bg)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 16px' }}>Reg #</th>
                <th style={{ padding: '12px 16px' }}>Full Name</th>
                <th style={{ padding: '12px 16px' }}>Organization & Position</th>
                <th style={{ padding: '12px 16px' }}>Type</th>
                <th style={{ padding: '12px 16px' }}>Country</th>
                <th style={{ padding: '12px 16px' }}>Check-in</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--primary)', fontFamily: 'monospace' }}>
                    {reg.reg_number}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{reg.full_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{reg.email}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>{reg.organization}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{reg.position}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                      {reg.reg_type}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-main)' }}>
                    {reg.country}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {reg.checked_in ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#10b981', fontWeight: '700', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                        <CheckCircle2 size={12} /> Checked In
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>Not Yet</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      background: reg.status === 'approved' ? 'rgba(16, 185, 129, 0.15)' : reg.status === 'pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: reg.status === 'approved' ? '#10b981' : reg.status === 'pending' ? '#f59e0b' : '#ef4444'
                    }}>
                      {reg.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button onClick={() => handleOpenQR(reg)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }} title="View QR Pass">
                        <QrCode size={13} />
                      </button>
                      {reg.status !== 'approved' && (
                        <button onClick={() => handleUpdateStatus(reg.id, 'approved')} className="btn btn-sm" style={{ padding: '4px 8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }} title="Approve">
                          <CheckCircle2 size={13} />
                        </button>
                      )}
                      {reg.status !== 'rejected' && (
                        <button onClick={() => handleUpdateStatus(reg.id, 'rejected')} className="btn btn-sm" style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' }} title="Reject">
                          <XCircle size={13} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(reg.id, reg.full_name)} className="btn btn-outline btn-sm" style={{ color: '#ef4444', padding: '4px 8px' }} title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* QR Code Pass Modal */}
      {qrModalItem && (
        <div className="modal-overlay" onClick={() => setQrModalItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-main)' }}>Digital Credential Pass</div>
              <button onClick={() => setQrModalItem(null)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', display: 'inline-block', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', marginBottom: '16px' }}>
              {qrDataUrl && <img src={qrDataUrl} alt="QR Code" style={{ width: '220px', height: '220px', display: 'block' }} />}
            </div>

            <div style={{ fontWeight: '800', fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '4px' }}>
              {qrModalItem.full_name}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '6px' }}>
              {qrModalItem.organization} • {qrModalItem.position}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--btn-secondary-bg)', padding: '6px 12px', borderRadius: '6px', display: 'inline-block', marginBottom: '16px' }}>
              {qrModalItem.reg_number}
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button onClick={() => window.print()} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Printer size={14} />
                <span>Print Pass</span>
              </button>
              <button onClick={() => setQrModalItem(null)} className="btn btn-secondary btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
