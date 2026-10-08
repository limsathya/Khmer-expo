'use client';

import { useState, useEffect } from 'react';
import { 
  Award, 
  Plus, 
  Trash2, 
  RefreshCw, 
  X, 
  ExternalLink,
  ShieldCheck,
  Star
} from 'lucide-react';

export default function SponsorsManager({ showToast }) {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    level: 'Gold',
    website: '',
    description: '',
    display_order: 1
  });

  useEffect(() => {
    loadSponsors();
  }, []);

  async function loadSponsors() {
    setLoading(true);
    try {
      const res = await fetch('/api/sponsors');
      if (res.ok) {
        const data = await res.json();
        setSponsors(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load sponsors:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateSponsor = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      const res = await fetch('/api/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        if (showToast) showToast('Sponsor partner added successfully!');
        setIsModalOpen(false);
        setFormData({
          name: '',
          level: 'Gold',
          website: '',
          description: '',
          display_order: 1
        });
        loadSponsors();
      }
    } catch (err) {
      if (showToast) showToast('Error creating sponsor', 'error');
    }
  };

  const levelBadges = {
    'Strategic Partner': { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: '#f59e0b' },
    'Platinum': { bg: 'rgba(99, 102, 241, 0.15)', text: '#6366f1', border: '#6366f1' },
    'Gold': { bg: 'rgba(234, 179, 8, 0.15)', text: '#eab308', border: '#eab308' },
    'Silver': { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', border: '#94a3b8' },
    'Supporting Partner': { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: '#10b981' },
    'Media Partner': { bg: 'rgba(236, 72, 153, 0.15)', text: '#ec4899', border: '#ec4899' }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Sponsor & Strategic Partner Management
            </h2>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '2px 9px', borderRadius: '12px' }}>
              {sponsors.length} partners
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Manage strategic partners across Platinum, Gold, Silver, Supporting, and Media Partner tiers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} />
            <span>Add Sponsor</span>
          </button>
          <button onClick={loadSponsors} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : sponsors.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <Award size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>No sponsors recorded</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Add official corporate partners and supporting institutions.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '18px' }}>
          {sponsors.map(sp => {
            const bStyle = levelBadges[sp.level] || levelBadges.Gold;

            return (
              <div key={sp.id} className="glass-card" style={{ padding: '20px', borderRadius: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', padding: '3px 8px', borderRadius: '4px', background: bStyle.bg, color: bStyle.text, border: `1px solid ${bStyle.border}` }}>
                      {sp.level}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      #{sp.display_order}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
                    {sp.name}
                  </h3>

                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '12px' }}>
                    {sp.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                  {sp.website ? (
                    <a href={sp.website} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                      <span>Visit Website</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-dim)' }}>No URL specified</span>
                  )}
                  <span style={{ color: '#10b981', fontWeight: '700' }}>✓ Active</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Add Official Partner</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSponsor} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Sponsor / Enterprise Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bank of China (Cambodia)"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Partnership Tier</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  className="form-input"
                >
                  <option value="Strategic Partner">Strategic Partner</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Supporting Partner">Supporting Partner</option>
                  <option value="Media Partner">Media Partner</option>
                </select>
              </div>

              <div>
                <label className="form-label">Official Website</label>
                <input
                  type="url"
                  placeholder="https://company.com"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Description / Scope of Support</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  Save Sponsor
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
