'use client';

import { useState, useEffect } from 'react';
import { 
  Key, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Copy, 
  Check, 
  Trash2, 
  RefreshCw, 
  UserPlus, 
  ShieldCheck, 
  Building,
  User,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { ALL_COMMITTEES_LIST, getSubCommitteeLocalizedName } from '@/lib/committees';

export default function InvitesManager({ showToast }) {
  const { user, canManageEverything, userCommittee } = useAuth();
  const { t, language } = useLanguage();

  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  // Generate code modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetCommittee, setTargetCommittee] = useState(userCommittee || 'Subcommittee on Reception and Protocol');
  const [targetRole, setTargetRole] = useState('Committee Member');
  const [customCode, setCustomCode] = useState('');
  const [inviteNote, setInviteNote] = useState('');
  const [generating, setGenerating] = useState(false);

  // Reject modal state
  const [rejectingInvite, setRejectingInvite] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionProcessing, setActionProcessing] = useState(null);

  useEffect(() => {
    loadInvites();
  }, []);

  async function loadInvites() {
    setLoading(true);
    try {
      const res = await fetch('/api/invites');
      if (res.ok) {
        const data = await res.json();
        setInvites(data);
      }
    } catch (err) {
      console.error('Error fetching invites:', err);
    } finally {
      setLoading(false);
    }
  }

  function generateRandomCode() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let rand = '';
    for (let i = 0; i < 5; i++) {
      rand += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    const prefix = targetCommittee.toLowerCase().includes('protocol') ? 'PROTO' :
                   targetCommittee.toLowerCase().includes('finance') ? 'FIN' :
                   targetCommittee.toLowerCase().includes('booth') || targetCommittee.toLowerCase().includes('design') ? 'BOOTH' :
                   targetCommittee.toLowerCase().includes('central') ? 'CENTRAL' : 'EXP';
    setCustomCode(`EXP-${prefix}-${rand}`);
  }

  const handleOpenCreateModal = () => {
    generateRandomCode();
    setIsModalOpen(true);
  };

  const handleCreateInvite = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: customCode.trim(),
          targetCommittee,
          targetRole,
          generatedBy: user?.username || 'officer',
          note: inviteNote
        })
      });

      const data = await res.json();
      if (res.ok) {
        if (showToast) showToast(`Verification code "${data.invite.code}" generated successfully!`);
        setIsModalOpen(false);
        setCustomCode('');
        setInviteNote('');
        await loadInvites();
      } else {
        if (showToast) showToast(data.error || 'Failed to generate code', 'error');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Network error while generating code', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async (invite) => {
    setActionProcessing(invite.id);
    try {
      const res = await fetch(`/api/invites/${invite.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve',
          approvedBy: user?.username || 'President'
        })
      });

      const data = await res.json();
      if (res.ok) {
        if (showToast) showToast(`Approved! ${invite.applicantName} (@${invite.applicantUsername}) is now an active committee member.`);
        await loadInvites();
      } else {
        if (showToast) showToast(data.error || 'Failed to approve applicant', 'error');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Error approving applicant', 'error');
    } finally {
      setActionProcessing(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingInvite) return;
    setActionProcessing(rejectingInvite.id);

    try {
      const res = await fetch(`/api/invites/${rejectingInvite.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          approvedBy: user?.username || 'President',
          reason: rejectionReason.trim() || 'Registration declined by subcommittee president.'
        })
      });

      const data = await res.json();
      if (res.ok) {
        if (showToast) showToast(`Rejected application for @${rejectingInvite.applicantUsername}`);
        setRejectingInvite(null);
        setRejectionReason('');
        await loadInvites();
      } else {
        if (showToast) showToast(data.error || 'Failed to reject applicant', 'error');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Error rejecting applicant', 'error');
    } finally {
      setActionProcessing(null);
    }
  };

  const handleDeleteInvite = async (inviteId) => {
    if (!confirm('Are you sure you want to delete this unused verification code?')) return;
    try {
      const res = await fetch(`/api/invites/${inviteId}`, { method: 'DELETE' });
      if (res.ok) {
        if (showToast) showToast('Verification code deleted.');
        await loadInvites();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    if (showToast) showToast(`Copied code "${code}" to clipboard! Share it with the invitee.`);
  };

  // Determine if this user is allowed to approve a specific invite:
  // Central Committee and Reception & Protocol can approve any.
  // Other subcommittee presidents can approve for their own subcommittee!
  const canUserApproveInvite = (invite) => {
    if (canManageEverything) return true;
    if (!userCommittee) return false;
    return userCommittee.includes(invite.targetCommittee) || invite.targetCommittee.includes(userCommittee);
  };

  const pendingApprovals = invites.filter(i => i.status === 'pending_approval');
  const activeCodes = invites.filter(i => i.status === 'active');
  const pastRecords = invites.filter(i => i.status === 'approved' || i.status === 'rejected');

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
              {language === 'km' ? 'កូដផ្ទៀងផ្ទាត់ & ការអនុម័តសមាជិកគណៈកម្មការ' : language === 'zh' ? '验证码生成与分委员会成员审批' : 'Verification Codes & Member Approvals'}
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.12)', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
              {pendingApprovals.length} {language === 'km' ? 'រង់ចាំការអនុម័ត' : language === 'zh' ? '待审批' : 'Pending Approval'}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            {language === 'km' 
              ? 'បង្កើតកូដផ្ទៀងផ្ទាត់ដោយផ្ទាល់ (គ្មានអ៊ីមែល) សម្រាប់សមាជិកថ្មីចុះឈ្មោះ។ រាល់ការចុះឈ្មោះត្រូវអនុម័តដោយប្រធានអនុគណៈកម្មការ។' 
              : language === 'zh' 
              ? '由已有成员生成验证码提供给新人注册（无需邮箱）。新人注册后需经分委员会主席审批批准方可激活入列。' 
              : 'Generate verification codes for invitees (no email). Registrations must be reviewed and approved by the Subcommittee President.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={handleOpenCreateModal} className="btn btn-primary btn-sm">
            <Key size={14} />
            <span>{language === 'km' ? '+ បង្កើតកូដផ្ទៀងផ្ទាត់ថ្មី' : language === 'zh' ? '+ 生成专属验证码' : '+ Generate Verification Code'}</span>
          </button>
          <button onClick={loadInvites} className="btn btn-secondary btn-sm" title="Refresh">
            <RefreshCw size={14} />
            <span>{t('admin.refreshBtn', 'Refresh')}</span>
          </button>
        </div>
      </div>

      {/* PENDING APPROVALS SECTION (Subcommittee President Approval) */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px', borderLeft: '4px solid #f59e0b', background: 'var(--status-pending-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <Clock size={20} color="#f59e0b" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--status-pending)' }}>
            {language === 'km' ? 'បញ្ជីរង់ចាំការអនុម័តពីប្រធានអនុគណៈកម្មការ' : language === 'zh' ? '分委员会主席待审批列表' : 'Pending Approvals by Subcommittee President'}
          </h3>
          <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.25)', color: '#f59e0b', fontWeight: '800' }}>
            {pendingApprovals.length}
          </span>
        </div>

        {pendingApprovals.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '12px 0' }}>
            {language === 'km' ? '✓ មិនមានសំណើសុំចុះឈ្មោះដែលកំពុងរង់ចាំការអនុម័តនៅឡើយទេ។' : language === 'zh' ? '✓ 目前没有待审批的成员注册申请。' : '✓ No pending member registrations waiting for approval.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  <th>{language === 'km' ? 'បេក្ខជន' : language === 'zh' ? '申请人' : 'Applicant'}</th>
                  <th>{language === 'km' ? 'គណៈកម្មការគោលដៅ' : language === 'zh' ? '申请委员会' : 'Target Committee'}</th>
                  <th>{language === 'km' ? 'តួនាទី' : language === 'zh' ? '拟任职位' : 'Role'}</th>
                  <th>{language === 'km' ? 'កូដផ្ទៀងផ្ទាត់' : language === 'zh' ? '所用验证码' : 'Code Used'}</th>
                  <th>{language === 'km' ? 'កាលបរិច្ឆេទ' : language === 'zh' ? '提交时间' : 'Submitted At'}</th>
                  <th>{language === 'km' ? 'សកម្មភាព' : language === 'zh' ? '操作' : 'President Action'}</th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.map(inv => {
                  const allowedToApprove = canUserApproveInvite(inv);

                  return (
                    <tr key={inv.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.2rem' }}>👤</span>
                          <div>
                            <div style={{ fontWeight: '800', color: 'var(--text-main)' }}>{inv.applicantName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>@{inv.applicantUsername}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                          {getSubCommitteeLocalizedName(inv.targetCommittee, language) || inv.targetCommittee}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', background: 'var(--btn-secondary-bg)', padding: '3px 8px', borderRadius: '6px' }}>
                          {inv.targetRole}
                        </span>
                      </td>
                      <td>
                        <code style={{ fontWeight: '700', color: 'var(--primary)' }}>{inv.code}</code>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(inv.createdAt).toLocaleString(language === 'km' ? 'km-KH' : language === 'zh' ? 'zh-CN' : 'en-US')}
                        </span>
                      </td>
                      <td>
                        {allowedToApprove ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleApprove(inv)}
                              disabled={actionProcessing === inv.id}
                              className="btn btn-approve btn-sm"
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            >
                              <Check size={14} />
                              <span>{language === 'km' ? 'អនុម័ត' : language === 'zh' ? '批准' : 'Approve'}</span>
                            </button>
                            <button
                              onClick={() => { setRejectingInvite(inv); setRejectionReason(''); }}
                              disabled={actionProcessing === inv.id}
                              className="btn btn-reject btn-sm"
                              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                            >
                              <XCircle size={14} />
                              <span>{language === 'km' ? 'បដិសេធ' : language === 'zh' ? '拒绝' : 'Reject'}</span>
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                            {language === 'km' ? 'សម្រាប់ប្រធានអនុគណៈកម្មការនេះ' : language === 'zh' ? '仅本委员会主席可批' : 'Reserved for Committee President'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ACTIVE VERIFICATION CODES SECTION */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} color="var(--primary)" />
            <span>{language === 'km' ? 'កូដផ្ទៀងផ្ទាត់សកម្ម (រង់ចាំការចុះឈ្មោះ)' : language === 'zh' ? '当前有效验证码（待使用）' : 'Active Verification Codes (Ready to Share)'}</span>
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', fontWeight: '800' }}>
              {activeCodes.length}
            </span>
          </h3>
        </div>

        {activeCodes.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '16px 0' }}>
            {language === 'km' ? 'មិនមានកូដផ្ទៀងផ្ទាត់សកម្មទេ។ ចុច "បង្កើតកូដផ្ទៀងផ្ទាត់ថ្មី" ដើម្បីបង្កើតកូដ។' : language === 'zh' ? '暂无可用验证码。请点击“生成专属验证码”创建。' : 'No active verification codes. Click "Generate Verification Code" to create one.'}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '16px' }}>
            {activeCodes.map(inv => (
              <div 
                key={inv.id} 
                className="glass-card" 
                style={{ 
                  padding: '18px', 
                  borderLeft: '4px solid var(--primary)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  gap: '12px' 
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>
                      {getSubCommitteeLocalizedName(inv.targetCommittee, language) || inv.targetCommittee}
                    </span>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--status-approved-bg)', color: 'var(--status-approved)', fontWeight: '700' }}>
                      Active
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '0.08em', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                      {inv.code}
                    </div>
                    <button
                      type="button"
                      onClick={() => copyCode(inv.code)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      title="Copy Code"
                    >
                      {copiedCode === inv.code ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                      <span>{copiedCode === inv.code ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '600' }}>
                    {language === 'km' ? 'តួនាទី៖ ' : language === 'zh' ? '职位：' : 'Role: '} {inv.targetRole}
                  </div>

                  {inv.note && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                      "{inv.note}"
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  <span>By: @{inv.generatedBy}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteInvite(inv.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMPLETED & PAST REGISTRATIONS LOG */}
      {pastRecords.length > 0 && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '14px' }}>
            {language === 'km' ? 'ប្រវត្តិនៃការអនុម័ត និងបដិសេធកន្លងមក' : language === 'zh' ? '历史审批与使用记录' : 'Past Verification & Approval Log'}
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Applicant</th>
                  <th>Committee & Role</th>
                  <th>Status</th>
                  <th>Approved / Reviewed By</th>
                  <th>Reviewed At</th>
                </tr>
              </thead>
              <tbody>
                {pastRecords.map(inv => (
                  <tr key={inv.id}>
                    <td><code>{inv.code}</code></td>
                    <td>
                      {inv.applicantName ? (
                        <span><strong>{inv.applicantName}</strong> (@{inv.applicantUsername})</span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>Unclaimed</span>
                      )}
                    </td>
                    <td>
                      <div>{getSubCommitteeLocalizedName(inv.targetCommittee, language) || inv.targetCommittee}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inv.targetRole}</div>
                    </td>
                    <td>
                      {inv.status === 'approved' ? (
                        <span className="badge-status badge-approved">
                          <CheckCircle2 size={12} /> Approved
                        </span>
                      ) : (
                        <span className="badge-status badge-rejected">
                          <XCircle size={12} /> Rejected
                        </span>
                      )}
                    </td>
                    <td>@{inv.approvedBy || 'President'}</td>
                    <td>{inv.reviewedAt ? new Date(inv.reviewedAt).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE VERIFICATION CODE MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '520px' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>
              {language === 'km' ? 'បង្កើតកូដផ្ទៀងផ្ទាត់ថ្មី' : language === 'zh' ? '生成新专属验证码' : 'Generate Verification Code'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              {language === 'km' 
                ? 'កូដនេះនឹងត្រូវបានប្រើដោយបេក្ខជនចុះឈ្មោះ។ ក្រោយចុះឈ្មោះ ប្រធានអនុគណៈកម្មការនឹងពិនិត្យអនុម័ត។' 
                : language === 'zh' 
                ? '该验证码供被邀请人注册使用，注册后需由分委员会主席在后台审批。' 
                : 'This code will be entered by the invitee during registration. Requires subcommittee president approval.'}
            </p>

            <form onSubmit={handleCreateInvite} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">{language === 'km' ? 'គណៈកម្មការគោលដៅ' : language === 'zh' ? '目标分委员会' : 'Target Committee'}</label>
                <select
                  value={targetCommittee}
                  onChange={(e) => { setTargetCommittee(e.target.value); }}
                  className="form-input"
                >
                  {ALL_COMMITTEES_LIST.map(c => (
                    <option key={c.key} value={c.name}>
                      {getSubCommitteeLocalizedName(c.key, language)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">{language === 'km' ? 'តួនាទី / មុខតំណែង' : language === 'zh' ? '拟委派职位' : 'Designated Role / Position'}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Protocol Officer, Vice Chair, Specialist..."
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>{language === 'km' ? 'កូដផ្ទៀងផ្ទាត់' : language === 'zh' ? '专属验证码' : 'Verification Code'}</label>
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                  >
                    🎲 Regenerate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  className="form-input"
                  style={{ letterSpacing: '0.08em', fontWeight: '800', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label className="form-label">{language === 'km' ? 'កំណត់សម្គាល់ / ឈ្មោះអ្នកទទួល' : language === 'zh' ? '邀请备注 / 受邀人姓名' : 'Note / Invitee Name'}</label>
                <input
                  type="text"
                  placeholder="e.g. For VIP protocol team addition"
                  value={inviteNote}
                  onChange={(e) => setInviteNote(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  {t('admin.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="btn btn-primary btn-sm"
                >
                  <Key size={14} />
                  <span>{generating ? 'Generating...' : (language === 'km' ? 'បង្កើតកូដឥឡូវនេះ' : language === 'zh' ? '立即生成' : 'Generate Code')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT APPLICANT MODAL */}
      {rejectingInvite && (
        <div className="modal-overlay" onClick={() => setRejectingInvite(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px', maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ef4444', marginBottom: '8px' }}>
              {language === 'km' ? 'បដិសេធការចុះឈ្មោះ' : language === 'zh' ? '拒绝注册申请' : 'Reject Applicant Registration'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              {language === 'km' 
                ? `តើអ្នកប្រាកដថាចង់បដិសេធការចុះឈ្មោះរបស់ ${rejectingInvite.applicantName} (@${rejectingInvite.applicantUsername}) ដែរឬទេ?` 
                : language === 'zh' 
                ? `确定拒绝 ${rejectingInvite.applicantName} (@${rejectingInvite.applicantUsername}) 的加入申请吗？` 
                : `Are you sure you want to reject the application for ${rejectingInvite.applicantName} (@${rejectingInvite.applicantUsername})?`}
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">{language === 'km' ? 'មូលហេតុនៃការបដិសេធ' : language === 'zh' ? '拒绝原因' : 'Reason for Rejection'}</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="form-textarea"
                placeholder="e.g. Quota full for this role or verification mismatch."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRejectingInvite(null)}
                className="btn btn-secondary btn-sm"
              >
                {t('admin.cancel', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="btn btn-reject btn-sm"
              >
                <XCircle size={14} />
                <span>{language === 'km' ? 'បញ្ជាក់ការបដិសេធ' : language === 'zh' ? '确认拒绝' : 'Confirm Reject'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
