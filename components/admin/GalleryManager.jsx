'use client';

import { useState } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  FolderPlus, 
  Eye, 
  X, 
  Calendar,
  CheckCircle2,
  Tag
} from 'lucide-react';

const INITIAL_ALBUMS = [
  { id: 'alb-1', title: 'Opening Ceremony & Bilateral Plenary', category: 'Ceremony', count: 24, date: '2026-11-07' },
  { id: 'alb-2', title: 'International Business Pavilions (Hall A)', category: 'Business', count: 36, date: '2026-11-08' },
  { id: 'alb-3', title: 'Cultural Performances & Khmer Silk (Hall B)', category: 'Culture', count: 18, date: '2026-11-09' },
  { id: 'alb-4', title: 'Higher Education & University Forum', category: 'Education', count: 22, date: '2026-11-10' },
  { id: 'alb-5', title: 'Food & Agribusiness Pavilion', category: 'Gastronomy', count: 30, date: '2026-11-10' },
  { id: 'alb-6', title: 'Strategic MoUs & Contract Signings', category: 'B2B', count: 15, date: '2026-11-11' },
];

export default function GalleryManager({ showToast }) {
  const [albums, setAlbums] = useState(INITIAL_ALBUMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    category: 'Ceremony',
    date: '2026-11-07',
    description: ''
  });

  const handleCreateAlbum = (e) => {
    e.preventDefault();
    const created = {
      id: `alb-${Date.now()}`,
      title: newAlbum.title,
      category: newAlbum.category,
      count: 0,
      date: newAlbum.date
    };
    setAlbums([created, ...albums]);
    showToast?.('Album created successfully.');
    setIsModalOpen(false);
    setNewAlbum({ title: '', category: 'Ceremony', date: '2026-11-07', description: '' });
  };

  const handleDeleteAlbum = (id) => {
    if (!confirm('Are you sure you want to delete this media album?')) return;
    setAlbums(albums.filter(a => a.id !== id));
    showToast?.('Album removed.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon size={22} className="text-blue-400" />
            <span>Gallery & Multimedia Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize official photo albums, media releases, and documentation archives stored in Supabase Storage.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary btn-sm self-start sm:self-auto inline-flex items-center gap-1.5"
        >
          <FolderPlus size={15} />
          <span>Create New Album</span>
        </button>
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((alb) => (
          <div
            key={alb.id}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {alb.category}
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{alb.date}</span>
                </span>
              </div>

              <h3 className="font-bold text-white text-base mb-2">{alb.title}</h3>
              <div className="text-xs text-slate-400 mb-4">{alb.count} media assets archived</div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Supabase Storage</span>
              <button
                onClick={() => handleDeleteAlbum(alb.id)}
                className="text-red-400 hover:text-red-300 p-1"
                title="Delete Album"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Create Official Photo Album</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateAlbum} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Album Title *</label>
                <input
                  type="text"
                  required
                  value={newAlbum.title}
                  onChange={e => setNewAlbum({ ...newAlbum, title: e.target.value })}
                  placeholder="e.g. VIP Bilateral Signing Ceremony"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newAlbum.category}
                    onChange={e => setNewAlbum({ ...newAlbum, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="Ceremony">Opening Ceremony</option>
                    <option value="Business">Business Pavilion</option>
                    <option value="Culture">Culture & Arts</option>
                    <option value="Education">Education & Universities</option>
                    <option value="Gastronomy">Gastronomy & Agri</option>
                    <option value="B2B">B2B Trade</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={newAlbum.date}
                    onChange={e => setNewAlbum({ ...newAlbum, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  />
                </div>
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
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
