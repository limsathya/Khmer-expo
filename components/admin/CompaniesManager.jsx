'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Globe, 
  Mail, 
  Phone, 
  RefreshCw,
  X,
  FileSpreadsheet
} from 'lucide-react';

export default function CompaniesManager({ showToast }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    country: 'Cambodia',
    industry: 'Technology & Innovation',
    description: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    contact_person: '',
    products: '',
    status: 'active'
  });

  useEffect(() => {
    loadData();
  }, [industryFilter]);

  async function loadData() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (industryFilter !== 'all') params.set('industry', industryFilter);
      const res = await fetch(`/api/companies?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCompanies(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenCreate = () => {
    setEditingCompany(null);
    setFormData({
      name: '',
      country: 'Cambodia',
      industry: 'Technology & Innovation',
      description: '',
      website: '',
      email: '',
      phone: '',
      address: '',
      contact_person: '',
      products: '',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comp) => {
    setEditingCompany(comp);
    setFormData({
      name: comp.name || '',
      country: comp.country || 'Cambodia',
      industry: comp.industry || 'Technology & Innovation',
      description: comp.description || '',
      website: comp.website || '',
      email: comp.email || '',
      phone: comp.phone || '',
      address: comp.address || '',
      contact_person: comp.contact_person || '',
      products: Array.isArray(comp.products) ? comp.products.join(', ') : (comp.products || ''),
      status: comp.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        products: formData.products ? formData.products.split(',').map(s => s.trim()).filter(Boolean) : []
      };

      if (editingCompany) {
        const res = await fetch(`/api/companies/${editingCompany.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast?.('Company profile updated successfully.');
          loadData();
          setIsModalOpen(false);
        } else {
          showToast?.('Failed to update company.', 'error');
        }
      } else {
        const res = await fetch('/api/companies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast?.('New company created successfully.');
          loadData();
          setIsModalOpen(false);
        } else {
          showToast?.('Failed to create company.', 'error');
        }
      }
    } catch (err) {
      console.error(err);
      showToast?.('Error saving company.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this company profile?')) return;
    try {
      const res = await fetch(`/api/companies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast?.('Company deleted.');
        loadData();
      } else {
        showToast?.('Failed to delete.', 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = companies.filter(c => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = c.name?.toLowerCase().includes(q);
      const matchInd = c.industry?.toLowerCase().includes(q);
      const matchCountry = c.country?.toLowerCase().includes(q);
      if (!matchName && !matchInd && !matchCountry) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 size={22} className="text-blue-400" />
            <span>Company Directory & Enterprise Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage participating bilateral corporate entities, products, and trade representatives.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="btn btn-primary btn-sm self-start sm:self-auto inline-flex items-center gap-1.5"
        >
          <Plus size={15} />
          <span>Add New Company</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search company or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadData} className="btn btn-secondary btn-sm">
            <RefreshCw size={13} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Companies Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-slate-500 text-xs">Loading companies...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs">No registered companies found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Country & Industry</th>
                  <th className="py-3 px-4">Contact Person</th>
                  <th className="py-3 px-4">Coordinates</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">/{c.slug}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-amber-400">{c.country}</div>
                      <div className="text-[11px] text-slate-400">{c.industry}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white">{c.contact_person || '—'}</div>
                    </td>
                    <td className="py-3 px-4 space-y-0.5">
                      {c.email && <div className="text-blue-400 text-[11px]">{c.email}</div>}
                      {c.phone && <div className="text-slate-400 text-[11px]">{c.phone}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {c.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1 rounded hover:bg-slate-800 text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingCompany ? 'Edit Company Profile' : 'Register New Company'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={e => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Products / Services (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.products}
                  onChange={e => setFormData({ ...formData, products: e.target.value })}
                  placeholder="e.g. Milled Jasmine Rice, Rubber, AI Hardware"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
