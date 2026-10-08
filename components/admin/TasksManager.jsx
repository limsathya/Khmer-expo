'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  AlertCircle, 
  User, 
  Trash2, 
  RefreshCw, 
  X,
  Filter,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export default function TasksManager({ showToast }) {
  const [tasks, setTasks] = useState([]);
  const [subcommittees, setSubcommittees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subcommitteeFilter, setSubcommitteeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subcommittee_id: '',
    assignee: '',
    priority: 'medium',
    status: 'todo',
    due_date: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [tRes, sRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/subcommittees')
      ]);
      if (tRes.ok) {
        const tData = await tRes.json();
        setTasks(Array.isArray(tData) ? tData : []);
      }
      if (sRes.ok) {
        const sData = await sRes.json();
        setSubcommittees(Array.isArray(sData) ? sData : []);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (subcommitteeFilter !== 'all' && t.subcommittee_id !== subcommitteeFilter) return false;
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      return true;
    });
  }, [tasks, subcommitteeFilter, priorityFilter]);

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        if (showToast) showToast('Task updated');
      }
    } catch (err) {
      if (showToast) showToast('Error updating task', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (res.ok) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        if (showToast) showToast('Task removed');
      }
    } catch (err) {
      if (showToast) showToast('Error deleting task', 'error');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks(prev => [newTask, ...prev]);
        setIsModalOpen(false);
        setFormData({
          title: '',
          description: '',
          subcommittee_id: '',
          assignee: '',
          priority: 'medium',
          status: 'todo',
          due_date: ''
        });
        if (showToast) showToast('Task added to Kanban board');
      }
    } catch (err) {
      if (showToast) showToast('Failed to create task', 'error');
    }
  };

  const columns = [
    { key: 'todo', title: 'TO DO', color: '#6366f1' },
    { key: 'in_progress', title: 'IN PROGRESS', color: '#f59e0b' },
    { key: 'blocked', title: 'BLOCKED', color: '#ef4444' },
    { key: 'completed', title: 'COMPLETED', color: '#10b981' }
  ];

  const priorityStyles = {
    urgent: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
    high: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
    medium: { bg: 'rgba(99, 102, 241, 0.15)', text: '#6366f1', border: 'rgba(99, 102, 241, 0.3)' },
    low: { bg: 'rgba(100, 116, 139, 0.15)', text: '#94a3b8', border: 'rgba(100, 116, 139, 0.3)' }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Committee Task Management (Kanban)
            </h2>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '2px 9px', borderRadius: '12px' }}>
              {tasks.length} tasks
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Coordinate mission-critical assignments across the organizing secretariat and 13 domain sub-committees.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} />
            <span>Create Task</span>
          </button>
          <button onClick={loadData} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '14px 20px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select value={subcommitteeFilter} onChange={(e) => setSubcommitteeFilter(e.target.value)} className="form-input" style={{ width: 'auto' }}>
            <option value="all">All Subcommittees</option>
            {subcommittees.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="form-input" style={{ width: 'auto' }}>
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredTasks.length}</strong> tasks
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', alignItems: 'start' }}>
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => (t.status || 'todo') === col.key);

          return (
            <div key={col.key} className="glass-panel" style={{ padding: '16px', borderRadius: '14px', background: 'var(--btn-secondary-bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '10px', borderBottom: `2px solid ${col.color}` }}>
                <span style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
                  {col.title}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', background: `${col.color}25`, color: col.color, padding: '2px 8px', borderRadius: '10px' }}>
                  {colTasks.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '180px' }}>
                {colTasks.map(t => {
                  const pr = priorityStyles[t.priority] || priorityStyles.medium;
                  const subObj = subcommittees.find(s => s.id === t.subcommittee_id);

                  return (
                    <div
                      key={t.id}
                      className="glass-card"
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        background: 'var(--bg-card-solid)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: pr.bg,
                          color: pr.text,
                          border: `1px solid ${pr.border}`
                        }}>
                          {t.priority}
                        </span>

                        <button onClick={() => handleDeleteTask(t.id)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }} title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.3' }}>
                        {t.title}
                      </div>

                      {t.description && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                          {t.description}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-dim)', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)', marginTop: '2px' }}>
                        <span>👤 {t.assignee || 'Unassigned'}</span>
                        {t.due_date && <span>📅 {t.due_date}</span>}
                      </div>

                      {subObj && (
                        <div style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: '600' }}>
                          🏛️ {subObj.name}
                        </div>
                      )}

                      {/* Move Column Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', marginTop: '4px', paddingTop: '6px', borderTop: '1px dashed var(--border-subtle)' }}>
                        {col.key !== 'todo' && (
                          <button
                            onClick={() => handleUpdateStatus(t.id, col.key === 'completed' ? 'in_progress' : col.key === 'blocked' ? 'in_progress' : 'todo')}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '3px' }}
                          >
                            <ArrowLeft size={11} /> Move Back
                          </button>
                        )}
                        <div style={{ flex: 1 }} />
                        {col.key !== 'completed' && (
                          <button
                            onClick={() => handleUpdateStatus(t.id, col.key === 'todo' ? 'in_progress' : 'completed')}
                            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: '700' }}
                          >
                            Advance <ArrowRight size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                    No tasks in this lane
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Create Committee Task</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Confirm VIP Motorcade Escort"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Responsible Sub-Committee</label>
                <select
                  value={formData.subcommittee_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, subcommittee_id: e.target.value }))}
                  className="form-input"
                >
                  <option value="">-- General Secretariat --</option>
                  {subcommittees.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Assignee Name</label>
                <input
                  type="text"
                  placeholder="e.g. H.E. Suon Kamsan"
                  value={formData.assignee}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="form-input"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Description / Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Enter details, requirements, or deliverables..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  Create Task
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
