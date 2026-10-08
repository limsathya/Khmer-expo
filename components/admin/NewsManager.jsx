'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  X, 
  Eye, 
  Calendar,
  CheckCircle2
} from 'lucide-react';

export default function NewsManager({ showToast }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Announcement',
    summary: '',
    content: '',
    author: 'Secretariat Press Office',
    is_featured: false
  });

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    setLoading(true);
    try {
      const res = await fetch('/api/news?status=all');
      if (res.ok) {
        const data = await res.json();
        setNews(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateNews = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        if (showToast) showToast('Article published successfully!');
        setIsModalOpen(false);
        setFormData({
          title: '',
          category: 'Announcement',
          summary: '',
          content: '',
          author: 'Secretariat Press Office',
          is_featured: false
        });
        loadNews();
      }
    } catch (err) {
      if (showToast) showToast('Error creating article', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
              News, Announcements & Press Releases
            </h2>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '2px 9px', borderRadius: '12px' }}>
              {news.length} articles
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Official bulletins, summit press briefings, bilateral trade reports, and public statements.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} />
            <span>Publish Article</span>
          </button>
          <button onClick={loadNews} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* News List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : news.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <FileText size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>No news articles found</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Publish announcements and press releases for the public.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {news.map(item => (
            <div key={item.id} className="glass-card" style={{ padding: '20px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                    {item.category}
                  </span>
                  {item.is_featured && (
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#f59e0b' }}>
                      ⭐ Featured Story
                    </span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    • {new Date(item.published_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5', maxWidth: '820px' }}>
                  {item.summary || (item.content.length > 180 ? item.content.substring(0, 180) + '...' : item.content)}
                </p>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                  Author: <strong>{item.author}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <a href={`/news/${item.slug}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '6px 10px', textDecoration: 'none' }} title="View Public Article">
                  <Eye size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Publish Article Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Publish Official Article</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNews} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Headline / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bilateral Trade Declaration Signed"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="form-input"
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Press Release">Press Release</option>
                    <option value="Operations">Operations</option>
                    <option value="Diplomatic">Diplomatic</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Author Desk</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Executive Summary</label>
                <input
                  type="text"
                  placeholder="Short 1-2 sentence lead summary..."
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Full Article Text *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Write full press bulletin or announcement body..."
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="featCheck"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                />
                <label htmlFor="featCheck" style={{ fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                  Pin as Featured Story on Public Homepage
                </label>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  Publish Now
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
