'use client';

import { useState, useEffect } from 'react';
import { 
  Award, 
  Plus, 
  Trash2, 
  RefreshCw, 
  X, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export default function VipManager({ showToast }) {
  const [vips, setVips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    organization: '',
    country: 'Cambodia',
    protocol_level: 'Head of Delegation (Level 1)',
    invitation_status: 'Confirmed',
    attendance_status: 'Attending',
    seating: '',
    notes: ''
  });

  useEffect(() => {
    loadVips();
  }, []);

  async function loadVips() {
    setLoading(true);
    try {
      const res = await fetch('/api/vip');
      if (res.ok) {
        const data = await res.json();
        setVips(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load VIPs:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateVip = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.position) return;

    try {
      const res = await fetch('/api/vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        if (showToast) showToast('VIP dignitary added to protocol list!');
        setIsModalOpen(false);
        setFormData({
          name: '',
          position: '',
          organization: '',
          country: 'Cambodia',
          protocol_level: 'Head of Delegation (Level 1)',
          invitation_status: 'Confirmed',
          attendance_status: 'Attending',
          seating: '',
          notes: ''
        });
        loadVips();
      }
    } catch (err) {
      if (showToast) showToast('Error saving VIP dignitary', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
              VIP & Diplomatic Protocol Management
            </h2>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '2px 9px', borderRadius: '12px' }}>
              {vips.length} dignitaries
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Restricted diplomatic protocol registry, seating arrangement charts, and delegation attendance verification.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} />
            <span>Add VIP Dignitary</span>
          </button>
          <button onClick={loadVips} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* VIP Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : vips.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <Award size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>No VIP guests recorded</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Add state dignitaries and bilateral delegation heads.</p>
        </div>
      ) : (
        <div className="glass-panel table-responsive" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--btn-secondary-bg)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 16px' }}>Dignitary</th>
                <th style={{ padding: '12px 16px' }}>Position & Ministry</th>
                <th style={{ padding: '12px 16px' }}>Protocol Rank</th>
                <th style={{ padding: '12px 16px' }}>Country</th>
                <th style={{ padding: '12px 16px' }}>Seating</th>
                <th style={{ padding: '12px 16px' }}>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {vips.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.1rem' }}>👑</span>
                      <span>{v.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>{v.position}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.organization}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                      {v.protocol_level}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-main)', fontWeight: '600' }}>
                    {v.country}
                  </td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: '700' }}>
                    {v.seating || 'Reserved Front Plenary'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                      ✓ {v.attendance_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add VIP Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Add VIP Dignitary</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateVip} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Honorific & Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. H.E. Pan Sorasak"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Position / Ministry *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Minister"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Organization / Government</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Government of Cambodia"
                    value={formData.organization}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Protocol Level</label>
                  <select
                    value={formData.protocol_level}
                    onChange={(e) => setFormData(prev => ({ ...prev, protocol_level: e.target.value }))}
                    className="form-input"
                  >
                    <option value="Head of Delegation (Level 1)">Head of Delegation (Level 1)</option>
                    <option value="Diplomatic (Level 1)">Diplomatic (Level 1)</option>
                    <option value="Ministerial (Level 2)">Ministerial (Level 2)</option>
                    <option value="Secretariat Special Guest">Secretariat Special Guest</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Plenary Seating Assignment</label>
                  <input
                    type="text"
                    placeholder="e.g. Row A, Seat 01"
                    value={formData.seating}
                    onChange={(e) => setFormData(prev => ({ ...prev, seating: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  Save VIP Dignitary
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
