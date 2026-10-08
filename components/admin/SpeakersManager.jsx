'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  X, 
  Sparkles,
  MapPin,
  Building
} from 'lucide-react';

export default function SpeakersManager({ showToast }) {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    organization: '',
    country: 'Cambodia',
    bio: '',
    photo_url: '',
    featured: true,
    display_order: 1
  });

  useEffect(() => {
    loadSpeakers();
  }, []);

  async function loadSpeakers() {
    setLoading(true);
    try {
      const res = await fetch('/api/speakers');
      if (res.ok) {
        const data = await res.json();
        setSpeakers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load speakers:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateSpeaker = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.position) return;

    try {
      const res = await fetch('/api/speakers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        if (showToast) showToast('Speaker profile created successfully!');
        setIsModalOpen(false);
        setFormData({
          name: '',
          position: '',
          organization: '',
          country: 'Cambodia',
          bio: '',
          photo_url: '',
          featured: true,
          display_order: 1
        });
        loadSpeakers();
      }
    } catch (err) {
      if (showToast) showToast('Error saving speaker', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Speaker & Keynote Dignitary Management
            </h2>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '2px 9px', borderRadius: '12px' }}>
              {speakers.length} speakers
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Maintain keynote biographies, institutional credentials, headshot portraits, and plenary sessions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} />
            <span>Add Speaker</span>
          </button>
          <button onClick={loadSpeakers} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Speakers Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : speakers.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <User size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>No speakers found</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Add keynote dignitaries and session presenters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px' }}>
          {speakers.map(s => (
            <div key={s.id} className="glass-card" style={{ padding: '22px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0, border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                    👨‍💼
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1.05rem', lineHeight: '1.2' }}>
                      {s.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: '700', marginTop: '3px' }}>
                      {s.position}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '8px' }}>
                  🏢 {s.organization} ({s.country})
                </div>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {s.bio}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <span style={{ color: s.featured ? '#10b981' : 'var(--text-dim)', fontWeight: '700' }}>
                  {s.featured ? '⭐ Featured Keynote' : 'Standard Presenter'}
                </span>
                <span style={{ color: 'var(--text-dim)' }}>Order #{s.display_order}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Speaker Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Add Speaker Profile</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSpeaker} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Full Name & Honorific *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. H.E. Dr. Sreng Sokha"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Position / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Secretary of State for Commerce"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Ministry of Commerce"
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

              <div>
                <label className="form-label">Short Biography</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  Save Speaker
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
