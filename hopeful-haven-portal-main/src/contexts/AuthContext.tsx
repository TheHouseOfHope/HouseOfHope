import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('hoh_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (username: string, password: string) => {
    // Mock authentication - in production this would call the API
    const found = mockUsers.find(u => u.username === username);
    if (found && password === 'password') {
      setUser(found);
      localStorage.setItem('hoh_user', JSON.stringify(found));
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('hoh_user');
  }, []);

  const hasRole = useCallback((role: UserRole) => user?.role === role, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
