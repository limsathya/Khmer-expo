'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { canManageEverything, isReceptionAndProtocol, isCentralCommittee, canManageEvent } from '@/lib/permissions';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isAdmin: false,
  canManageEverything: false,
  isReceptionAndProtocol: false,
  canManageEvent: () => false,
  userCommittee: ''
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to verify session', err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setUser(data.user);
    return data.user;
  };

  const register = async ({ username, password, name }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, name })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    setUser(null);
    router.push('/');
  };

  const isExecutiveAdmin = isCentralCommittee(user);
  const isReceptionProtocol = isReceptionAndProtocol(user);
  const userCanManageEverything = canManageEverything(user);
  const isSubCommittee = user?.role === 'sub_committee' || (!isExecutiveAdmin && !!user?.committee);
  const isCommittee = isExecutiveAdmin || isReceptionProtocol || isSubCommittee;
  const isAdmin = isCommittee; // All committee members can access dashboard

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      isAdmin, 
      isExecutiveAdmin, 
      isReceptionAndProtocol: isReceptionProtocol,
      canManageEverything: userCanManageEverything,
      canManageEvent: (event) => canManageEvent(user, event),
      isSubCommittee, 
      isCommittee,
      userCommittee: user?.committee 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
