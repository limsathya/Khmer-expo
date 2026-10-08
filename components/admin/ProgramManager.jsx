'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  RefreshCw, 
  X,
  Sparkles,
  Users
} from 'lucide-react';

export default function ProgramManager({ showToast }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('all');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '2026-10-12',
    start_time: '09:00',
    end_time: '11:00',
    venue: 'Grand Ballroom & Main Plenary Stage',
    category: 'Opening Ceremony',
    description: '',
    speaker_names: '',
    organizer: 'Organizing Committee',
    featured: true
  });

  useEffect(() => {
    loadPrograms();
  }, [selectedDate, selectedCat]);

  async function loadPrograms() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDate !== 'all') params.set('date', selectedDate);
      if (selectedCat !== 'all') params.set('category', selectedCat);
      const res = await fetch(`/api/programs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPrograms(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load programs:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    try {
      const payload = {
        ...formData,
        speaker_names: formData.speaker_names ? formData.speaker_names.split(',').map(s => s.trim()) : []
      };
      const res = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        if (showToast) showToast('Program session added successfully!');
        setIsModalOpen(false);
        setFormData({
          title: '',
          date: '2026-10-12',
          start_time: '09:00',
          end_time: '11:00',
          venue: 'Grand Ballroom & Main Plenary Stage',
          category: 'Opening Ceremony',
          description: '',
          speaker_names: '',
          organizer: 'Organizing Committee',
          featured: true
        });
        loadPrograms();
      }
    } catch (err) {
      if (showToast) showToast('Error creating session', 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete program session "${title}"?`)) return;
    try {
      const res = await fetch(`/api/programs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (showToast) showToast('Session removed');
        loadPrograms();
      }
    } catch (err) {
      if (showToast) showToast('Error removing session', 'error');
    }
  };

  const categories = [
    'Opening Ceremony', 'Business', 'Education', 'B2B', 'Culture', 'Food', 'Tourism', 'Networking', 'Closing Ceremony'
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Program & Schedule Management
            </h2>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '2px 9px', borderRadius: '12px' }}>
              {programs.length} sessions
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Curate timeline sessions, plenary summits, bilateral forums, cultural stages, and networking events.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} />
            <span>Add Program Session</span>
          </button>
          <button onClick={loadPrograms} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '14px 20px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="form-input" style={{ width: 'auto' }}>
            <option value="all">All Expo Days</option>
            <option value="2026-10-12">Day 1: Oct 12, 2026</option>
            <option value="2026-10-13">Day 2: Oct 13, 2026</option>
            <option value="2026-10-14">Day 3: Oct 14, 2026</option>
          </select>

          <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} className="form-input" style={{ width: 'auto' }}>
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Programs List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : programs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <Calendar size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>No program sessions found</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Click &quot;Add Program Session&quot; to schedule an event.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '16px' }}>
          {programs.map(p => (
            <div key={p.id} className="glass-card" style={{ padding: '20px', borderRadius: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                    {p.category}
                  </span>

                  <button onClick={() => handleDelete(p.id, p.title)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px', lineHeight: '1.3' }}>
                  {p.title}
                </h3>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '14px' }}>
                  {p.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={13} color="var(--primary)" />
                  <span>{p.date} • {p.start_time} – {p.end_time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={13} color="var(--primary)" />
                  <span>{p.venue}</span>
                </div>
                {p.speaker_names && p.speaker_names.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', fontWeight: '600' }}>
                    <Users size={13} color="var(--primary)" />
                    <span>{p.speaker_names.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Session Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Add Program Session</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProgram} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Session Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cambodia-China Trade Plenary"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label">Date</label>
                  <select
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="form-input"
                  >
                    <option value="2026-10-12">Day 1: Oct 12</option>
                    <option value="2026-10-13">Day 2: Oct 13</option>
                    <option value="2026-10-14">Day 3: Oct 14</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="form-input"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Venue Location</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Keynote Speakers (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. H.E. Dr. Sreng Sokha, Prof. Li Weidong"
                  value={formData.speaker_names}
                  onChange={(e) => setFormData(prev => ({ ...prev, speaker_names: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Description / Summary</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  Save Session
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
