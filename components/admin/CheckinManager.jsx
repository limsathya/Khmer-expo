'use client';

import { useState, useEffect } from 'react';
import { 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  RefreshCw, 
  Users, 
  Clock, 
  Check, 
  X,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function CheckinManager({ showToast }) {
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkinResult, setCheckinResult] = useState(null);
  const [recentCheckins, setRecentCheckins] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    loadRecentCheckins();
  }, []);

  async function loadRecentCheckins() {
    setLoadingList(true);
    try {
      const res = await fetch('/api/check-in');
      if (res.ok) {
        const data = await res.json();
        setRecentCheckins(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load check-ins:', err);
    } finally {
      setLoadingList(false);
    }
  }

  const handleCheckinSubmit = async (e) => {
    e.preventDefault();
    const cleanToken = tokenInput.trim();
    if (!cleanToken) return;

    setLoading(true);
    setCheckinResult(null);

    try {
      const res = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: cleanToken, staffUsername: 'admin' })
      });

      const data = await res.json();

      if (res.ok) {
        setCheckinResult(data);
        if (data.alreadyCheckedIn) {
          if (showToast) showToast('Attendee was already checked in!', 'error');
        } else {
          if (showToast) showToast(`Verified & Checked In: ${data.registration.full_name}`);
          setTokenInput('');
          loadRecentCheckins();
        }
      } else {
        setCheckinResult({
          error: data.error || 'Registration record not found. Please verify token.'
        });
        if (showToast) showToast(data.error || 'Check-in failed', 'error');
      }
    } catch (err) {
      setCheckinResult({ error: 'Network error processing check-in.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Accreditation & QR Check-in Terminal
            </h2>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 9px', borderRadius: '12px' }}>
              {recentCheckins.length} Checked In
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            Scan attendee QR credential codes or input registration numbers for instant identity validation and access badging.
          </p>
        </div>

        <button onClick={loadRecentCheckins} className="btn btn-secondary btn-sm" title="Refresh">
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* Terminal Scan Box */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <QrCode size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Scan or Enter QR Pass Token
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Supports USB barcode scanners, webcam scanners, or manual input
              </p>
            </div>
          </div>

          <form onSubmit={handleCheckinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="form-label">Registration Number or QR Token</label>
              <input
                type="text"
                autoFocus
                required
                placeholder="e.g. EXP-2026-1001 or QR-EXP-2026-1001-XXXX"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="form-input"
                style={{ fontSize: '1.05rem', fontWeight: '700', fontFamily: 'monospace', letterSpacing: '0.04em' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !tokenInput.trim()}
              className="btn btn-primary"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px' }}
            >
              {loading ? (
                <div style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Verify & Check In Attendee</span>
                </>
              )}
            </button>
          </form>

          {/* Real-time Verification Result Banner */}
          {checkinResult && (
            <div style={{ marginTop: '20px' }}>
              {checkinResult.error ? (
                <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1.5px solid rgba(239, 68, 68, 0.4)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <AlertCircle size={22} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: '800', color: '#ef4444', fontSize: '0.95rem' }}>Validation Failed</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>{checkinResult.error}</div>
                  </div>
                </div>
              ) : checkinResult.alreadyCheckedIn ? (
                <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1.5px solid rgba(245, 158, 11, 0.4)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <AlertCircle size={22} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: '800', color: '#f59e0b', fontSize: '0.95rem' }}>Duplicate Check-in Prevented</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '2px' }}>
                      {checkinResult.message}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1.5px solid rgba(16, 185, 129, 0.4)', padding: '18px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <CheckCircle2 size={24} color="#10b981" />
                    <div>
                      <div style={{ fontWeight: '900', color: '#10b981', fontSize: '1.05rem' }}>Check-in Successful!</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Pass verified and credential accredited.</div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(16, 185, 129, 0.25)', paddingTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Attendee</div>
                      <div style={{ fontWeight: '800', color: 'var(--text-main)' }}>{checkinResult.registration.full_name}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Reg Number</div>
                      <div style={{ fontWeight: '700', fontFamily: 'monospace', color: 'var(--primary)' }}>{checkinResult.registration.reg_number}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Organization</div>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{checkinResult.registration.organization}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Category</div>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{checkinResult.registration.reg_type}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Check-in Stream */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Live Check-in Stream
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Latest entries
            </span>
          </div>

          {loadingList ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '2px solid rgba(99, 102, 241, 0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
            </div>
          ) : recentCheckins.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              No check-ins recorded yet today.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '480px', overflowY: 'auto' }}>
              {recentCheckins.map((chk, i) => (
                <div key={chk.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--btn-secondary-bg)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {chk.attendee_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {chk.organization} • <span style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{chk.reg_number}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                      {chk.reg_type || 'Verified'}
                    </span>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '3px' }}>
                      {new Date(chk.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
