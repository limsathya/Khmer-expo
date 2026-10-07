'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  User, 
  Lock, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  Key,
  Shield,
  Clock
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t, language } = useLanguage();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Register fields (username only, no email, with verification code)
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regCode, setRegCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const loggedUser = await login(username, password);
      if (loggedUser.role === 'admin' || loggedUser.role === 'sub_committee') {
        router.push('/admin');
      } else {
        router.push('/timeline');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!regCode.trim()) {
      setErrorMsg(language === 'km' ? 'សូមបញ្ចូលកូដផ្ទៀងផ្ទាត់ (Verification Code) ដែលបានផ្តល់ដោយសមាជិកគណៈកម្មការ' : language === 'zh' ? '请输入由委员会成员生成的验证码' : 'Please provide a verification code given by a committee member.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/invites/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: regCode.trim(),
          username: regUsername.trim(),
          name: regName.trim(),
          password: regPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccessMsg(data.message || (language === 'km' 
        ? 'បានបញ្ជូនសំណើសុំចុះឈ្មោះ! កំពុងរង់ចាំការអនុម័តពីប្រធានអនុគណៈកម្មការក្នុងផ្ទាំងគ្រប់គ្រង Dashboard។' 
        : language === 'zh' 
        ? '注册申请已提交！正在等待分委员会主席在管理后台审核批准。' 
        : 'Registration submitted! Waiting for approval by the Subcommittee President in the Dashboard.'));
      
      setRegCode('');
      setRegUsername('');
      setRegName('');
      setRegPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (usr, pwd) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const loggedUser = await login(usr, pwd);
      if (loggedUser.role === 'admin' || loggedUser.role === 'sub_committee') {
        router.push('/admin');
      } else {
        router.push('/timeline');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '540px', margin: '40px auto', padding: '0 clamp(12px, 3vw, 24px)' }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          margin: '0 auto 16px',
          boxShadow: '0 6px 18px rgba(99, 102, 241, 0.4)'
        }}>
          <ShieldCheck size={28} />
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px', lineHeight: 'var(--line-height-heading)', letterSpacing: 'var(--letter-spacing-heading)', wordBreak: 'break-word' }}>
          {mode === 'login' ? t('auth.signInTitle', 'Committee Sign In') : (language === 'km' ? 'ចុះឈ្មោះសមាជិកគណៈកម្មការ' : language === 'zh' ? '委员会成员注册' : 'Register Committee Member')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 'var(--line-height-base)' }}>
          {mode === 'login' 
            ? t('auth.signInDesc', 'Enter your committee username and password') 
            : (language === 'km' 
              ? 'ប្រើប្រាស់កូដផ្ទៀងផ្ទាត់ដែលបង្កើតដោយសមាជិក ដើម្បីចុះឈ្មោះ និងរង់ចាំការអនុម័តពីប្រធានអនុគណៈកម្មការ' 
              : language === 'zh' 
              ? '输入由其他成员生成的专属验证码进行注册，需由分委员会主席审核批准' 
              : 'Enter verification code generated by a committee member. Requires approval by the Subcommittee President.')}
        </p>
      </div>

      <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
        {/* Administrator Fast Login */}
        {mode === 'login' && (
          <div style={{ marginBottom: '24px', background: 'var(--btn-secondary-bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: language === 'en' ? 'uppercase' : 'none', letterSpacing: language === 'en' ? '0.05em' : 'normal', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', lineHeight: 'var(--line-height-base)' }}>
              <ShieldCheck size={14} color="var(--primary)" />
              <span>{language === 'km' ? '⚡ ចូលប្រើជាអ្នកគ្រប់គ្រង Administrator (១-Click)' : language === 'zh' ? '⚡ 一键登录管理员账号' : '⚡ Chief Administrator Sign-In (1-Click)'}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin123')}
                disabled={loading}
                className="btn btn-primary btn-sm"
                style={{ justifyContent: 'space-between', padding: '10px 14px', fontSize: '0.85rem', flexWrap: 'wrap', gap: '8px', lineHeight: 'var(--line-height-base)' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                  <span>👨‍💼</span>
                  <strong>Administrator (Central Committee)</strong>
                </span>
                <span style={{ fontSize: '0.725rem', opacity: 0.85 }}>admin / admin123</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '10px',
              background: 'none',
              border: 'none',
              borderBottom: mode === 'login' ? '2px solid var(--primary)' : '2px solid transparent',
              color: mode === 'login' ? 'var(--text-main)' : 'var(--text-dim)',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            {t('nav.signIn', 'Sign In')}
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              flex: 1,
              padding: '10px',
              background: 'none',
              border: 'none',
              borderBottom: mode === 'register' ? '2px solid var(--primary)' : '2px solid transparent',
              color: mode === 'register' ? 'var(--text-main)' : 'var(--text-dim)',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            {language === 'km' ? 'ចុះឈ្មោះតាមកូដផ្ទៀងផ្ទាត់' : language === 'zh' ? '凭验证码注册' : 'Register with Code'}
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--status-rejected-bg)', border: '1px solid var(--status-rejected-border)', color: 'var(--status-rejected)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '18px' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'var(--status-approved-bg)', border: '1px solid var(--status-approved-border)', color: 'var(--status-approved)', padding: '14px 16px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '18px', lineHeight: '1.5' }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: '700', marginBottom: '4px' }}>
                {language === 'km' ? 'សំណើត្រូវបានកត់ត្រាជោគជ័យ!' : language === 'zh' ? '申请已成功提交！' : 'Application Submitted!'}
              </div>
              <div>{successMsg}</div>
            </div>
          </div>
        )}

        {/* Forms */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="form-label">{t('auth.usernameLabel', 'Username (No email)')}</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="admin, sarah_lin, finance_lead..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>

            <div>
              <label className="form-label">{t('auth.passwordLabel', 'Password')}</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ marginTop: '8px', padding: '12px' }}
            >
              <LogIn size={16} />
              <span>{loading ? t('auth.signingIn', 'Signing In...') : t('auth.signInBtn', 'Sign In to Dashboard')}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Verification Code Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  <span style={{ color: 'var(--primary)', fontWeight: '800' }}>* </span>
                  {language === 'km' ? 'កូដផ្ទៀងផ្ទាត់ (Verification Code)' : language === 'zh' ? '专属验证码 (Verification Code)' : 'Verification Code (Given by Member)'}
                </label>
              </div>
              
              <div style={{ position: 'relative' }}>
                <Key size={16} color="var(--primary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. EXP-PROTO-2026"
                  value={regCode}
                  onChange={(e) => setRegCode(e.target.value.toUpperCase())}
                  className="form-input"
                  style={{ paddingLeft: '40px', letterSpacing: '0.08em', fontWeight: '700', textTransform: 'uppercase' }}
                />
              </div>

              {/* Code Verification Guidance */}
              <div style={{ marginTop: '8px', fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: '1.45', background: 'var(--btn-secondary-bg)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                {language === 'km' 
                  ? '💡 កូដផ្ទៀងផ្ទាត់ត្រូវបានបង្កើតដោយផ្ទាល់ដោយប្រធាន ឬសមាជិកគណៈកម្មការក្នុង Dashboard (មិនផ្ញើតាមអ៊ីមែលឡើយ)។' 
                  : language === 'zh' 
                  ? '💡 验证码由分委员会主席或成员在管理后台直接生成（不通过电子邮件发送）。' 
                  : '💡 Verification code is generated directly by a committee officer or president in Dashboard (no email needed).'}
              </div>
            </div>

            <div>
              <label className="form-label">{t('auth.fullNameLabel', 'Full Name')}</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>

            <div>
              <label className="form-label">{t('auth.usernameLabel', 'Desired Username (No email)')}</label>
              <input
                type="text"
                required
                placeholder="e.g. alex_morgan"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value.toLowerCase().trim())}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">{t('auth.passwordLabel', 'Password')}</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Information Notice */}
            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              lineHeight: '1.45',
              display: 'flex',
              gap: '8px'
            }}>
              <Shield size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                {language === 'km' 
                  ? 'គ្មានអ៊ីមែលពាក់ព័ន្ធទេ។ បន្ទាប់ពីការចុះឈ្មោះ ប្រធានអនុគណៈកម្មការត្រូវតែចុចអនុម័ត (Approve) ក្នុង Dashboard មុនពេលគណនីរបស់អ្នកអាចចូលប្រើបាន។' 
                  : language === 'zh' 
                  ? '无需邮箱。提交后需由对应分委员会主席在后台审核批准，批准后方可凭用户名与密码登录。' 
                  : 'No email required. Upon submission, the President of the designated subcommittee will review and approve your account in the Dashboard before you can log in.'}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ marginTop: '8px', padding: '12px' }}
            >
              <UserPlus size={16} />
              <span>{loading ? (language === 'km' ? 'កំពុងផ្ទៀងផ្ទាត់...' : language === 'zh' ? '正在提交...' : 'Submitting with Code...') : (language === 'km' ? 'ដាក់ស្នើចុះឈ្មោះសមាជិក' : language === 'zh' ? '提交注册申请' : 'Submit Registration with Code')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
