'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Building, 
  Search, 
  Filter, 
  Edit3, 
  CheckCircle2, 
  Layers, 
  MapPin, 
  Tag, 
  DollarSign, 
  RefreshCw, 
  X,
  Plus
} from 'lucide-react';

export default function BoothsManager({ showToast }) {
  const [booths, setBooths] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    status: 'available',
    company_id: '',
    company_name: '',
    category: 'Standard',
    price: 500
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [bRes, cRes] = await Promise.all([
        fetch('/api/booths'),
        fetch('/api/companies')
      ]);
      if (bRes.ok) {
        const bData = await bRes.json();
        setBooths(Array.isArray(bData) ? bData : []);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        setCompanies(Array.isArray(cData) ? cData : []);
      }
    } catch (err) {
      console.error('Error loading booths:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredBooths = useMemo(() => {
    return booths.filter(b => {
      if (selectedZone !== 'all' && b.zone !== selectedZone) return false;
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      return true;
    });
  }, [booths, selectedZone, statusFilter]);

  const handleSelectBooth = (booth) => {
    setSelectedBooth(booth);
    setIsEditing(false);
    setEditForm({
      status: booth.status || 'available',
      company_id: booth.company_id || '',
      company_name: booth.company_name || '',
      category: booth.category || 'Standard',
      price: booth.price || 500
    });
  };

  const handleCompanyChange = (compId) => {
    if (!compId) {
      setEditForm(prev => ({
        ...prev,
        company_id: '',
        company_name: '',
        status: 'available'
      }));
      return;
    }
    const found = companies.find(c => c.id === compId);
    if (found) {
      setEditForm(prev => ({
        ...prev,
        company_id: found.id,
        company_name: found.name,
        status: 'occupied'
      }));
    }
  };

  const handleSaveBooth = async (e) => {
    e.preventDefault();
    if (!selectedBooth) return;

    try {
      const res = await fetch('/api/booths', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedBooth.id,
          ...editForm
        })
      });

      if (res.ok) {
        if (showToast) showToast(`Booth ${selectedBooth.booth_number} updated successfully!`);
        setIsEditing(false);
        loadData();
      } else {
        if (showToast) showToast('Failed to update booth', 'error');
      }
    } catch (err) {
      if (showToast) showToast('Error saving booth', 'error');
    }
  };

  const statusColorMap = {
    available: { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#10b981', label: 'Available' },
    reserved: { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', text: '#f59e0b', label: 'Reserved' },
    assigned: { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', text: '#3b82f6', label: 'Assigned' },
    occupied: { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#ef4444', label: 'Occupied' }
  };

  // Group booths by zones for the visual map
  const zoneGroups = useMemo(() => {
    const map = {};
    booths.forEach(b => {
      const z = b.zone || 'Hall A (Business & Tech)';
      if (!map[z]) map[z] = [];
      map[z].push(b);
    });
    return map;
  }, [booths]);

  return (
    <div>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Booth Management & Interactive Floor Map
            </h2>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '2px 9px', borderRadius: '12px' }}>
              75 Total (2m × 2m)
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Live exhibition floor plan for Tongde Kunming Plaza. Click any booth to inspect, reserve, or allocate exhibitors.
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {Object.entries(statusColorMap).map(([key, style]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: '700', color: style.text }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: style.bg, border: `1.5px solid ${style.border}` }} />
              <span>{style.label}</span>
            </div>
          ))}
          <button onClick={loadData} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '14px 20px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)} className="form-input" style={{ width: 'auto' }}>
            <option value="all">All Exhibition Zones</option>
            {Object.keys(zoneGroups).map(z => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-input" style={{ width: 'auto' }}>
            <option value="all">All Statuses</option>
            <option value="available">Available Only</option>
            <option value="occupied">Occupied</option>
            <option value="assigned">Assigned</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>

        <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredBooths.length}</strong> of <strong>{booths.length}</strong> booths
        </div>
      </div>

      {/* Main Layout: Visual Floor Plan + Side Inspector */}
      <div className={`grid gap-5 items-start ${selectedBooth ? 'grid-cols-1 xl:grid-cols-[1fr_340px]' : 'grid-cols-1'}`}>
        {/* Visual Map Canvas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {Object.entries(zoneGroups)
            .filter(([zoneName]) => selectedZone === 'all' || selectedZone === zoneName)
            .map(([zoneName, zBooths]) => (
              <div key={zoneName} className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} color="var(--primary)" />
                    <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-main)' }}>{zoneName}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {zBooths.length} booths
                  </span>
                </div>

                {/* Booth Grid (5 columns per row representing the physical exhibition layout) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                  gap: '10px'
                }}>
                  {zBooths.map(b => {
                    const isSelected = selectedBooth?.id === b.id;
                    const st = statusColorMap[b.status] || statusColorMap.available;

                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleSelectBooth(b)}
                        style={{
                          background: isSelected ? 'var(--primary)' : st.bg,
                          border: isSelected ? '2px solid #fff' : `1.5px solid ${st.border}`,
                          color: isSelected ? '#fff' : 'var(--text-main)',
                          padding: '10px 8px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          minHeight: '75px',
                          transition: 'all 0.15s ease',
                          transform: isSelected ? 'scale(1.04)' : 'none',
                          boxShadow: isSelected ? '0 6px 16px rgba(99, 102, 241, 0.4)' : 'none'
                        }}
                      >
                        <div style={{ fontWeight: '900', fontSize: '0.95rem', letterSpacing: '-0.02em' }}>
                          {b.booth_number}
                        </div>
                        <div style={{
                          fontSize: '0.7rem',
                          color: isSelected ? '#f8fafc' : 'var(--text-muted)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginTop: '2px'
                        }}>
                          {b.company_name || (b.category || 'Standard')}
                        </div>
                        <div style={{
                          fontSize: '0.65rem',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          marginTop: '4px',
                          color: isSelected ? '#fff' : st.text
                        }}>
                          {st.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>

        {/* Selected Booth Inspector Sidebar */}
        {selectedBooth && (
          <div className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase' }}>
                  Booth Inspector
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)', margin: '2px 0 0' }}>
                  {selectedBooth.booth_number}
                </h3>
              </div>
              <button onClick={() => setSelectedBooth(null)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {!isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</div>
                  <div style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    marginTop: '2px',
                    background: (statusColorMap[selectedBooth.status] || statusColorMap.available).bg,
                    color: (statusColorMap[selectedBooth.status] || statusColorMap.available).text,
                    border: `1px solid ${(statusColorMap[selectedBooth.status] || statusColorMap.available).border}`
                  }}>
                    {selectedBooth.status}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned Company</div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '2px' }}>
                    {selectedBooth.company_name || 'None (Unallocated)'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Zone & Category</div>
                  <div style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '2px' }}>
                    {selectedBooth.zone} • {selectedBooth.category} ({selectedBooth.size || '2m x 2m'})
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rental Rate</div>
                  <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#10b981', marginTop: '2px' }}>
                    ${selectedBooth.price || 500} USD
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => setIsEditing(true)} className="btn btn-primary btn-sm" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                    <Edit3 size={14} />
                    <span>Edit / Assign</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveBooth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label className="form-label">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                    className="form-input"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="assigned">Assigned</option>
                    <option value="occupied">Occupied</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Assign Exhibiting Company</label>
                  <select
                    value={editForm.company_id}
                    onChange={(e) => handleCompanyChange(e.target.value)}
                    className="form-input"
                  >
                    <option value="">-- No Company (Vacant) --</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.country})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Booth Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="form-input"
                  >
                    <option value="Standard">Standard (2m × 2m)</option>
                    <option value="Premium">Premium</option>
                    <option value="Corner Island">Corner Island</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Price (USD)</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    Save
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
