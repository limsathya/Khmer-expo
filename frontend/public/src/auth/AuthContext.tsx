import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";

export interface Member {
  email: string;
  name: string;
  loggedInAt: number;
}

interface AuthContextValue {
  member: Member | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const STORAGE_KEY = "expo.member";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Member) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (member) localStorage.setItem(STORAGE_KEY, JSON.stringify(member));
    else localStorage.removeItem(STORAGE_KEY);
  }, [member]);

  const login = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return { ok: false, error: "Enter a valid email." };
    }
    if (password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }
    await new Promise((r) => setTimeout(r, 600));
    const local = trimmedEmail.split("@")[0].replace(/[._-]/g, " ");
    const display = local.charAt(0).toUpperCase() + local.slice(1);
    setMember({ email: trimmedEmail, name: display, loggedInAt: Date.now() });
    return { ok: true };
  }, []);

  const logout = useCallback(() => setMember(null), []);

  return (
    <AuthContext.Provider value={{ member, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}