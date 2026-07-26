import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import {
  AuthError,
  ensureStudentProfile,
  fetchStudentForUser,
  signIn as authSignIn,
  signOut as authSignOut,
  signUp as authSignUp,
  type StudentRow,
} from '../services/auth';
import { getSupabase, isSupabaseConfigured } from '../services/supabase';

export type AuthModalMode = 'signin' | 'join' | null;

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  student: StudentRow | null;
  loading: boolean;
  configured: boolean;
  authModal: AuthModalMode;
  openAuthModal: (mode: 'signin' | 'join') => void;
  closeAuthModal: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const configured = isSupabaseConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<StudentRow | null>(null);
  const [loading, setLoading] = useState(configured);
  const [authModal, setAuthModal] = useState<AuthModalMode>(null);

  const loadStudent = useCallback(async (nextUser: User | null) => {
    if (!nextUser) {
      setStudent(null);
      return;
    }
    try {
      const name =
        (typeof nextUser.user_metadata?.full_name === 'string' && nextUser.user_metadata.full_name) ||
        nextUser.email?.split('@')[0] ||
        'Student';
      const row = await ensureStudentProfile(nextUser.id, name);
      setStudent(row);
    } catch {
      try {
        setStudent(await fetchStudentForUser(nextUser.id));
      } catch {
        setStudent(null);
      }
    }
  }, []);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const supabase = getSupabase();

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      void loadStudent(data.session?.user ?? null).finally(() => {
        if (!cancelled) setLoading(false);
      });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      void loadStudent(nextSession?.user ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [configured, loadStudent]);

  const openAuthModal = useCallback((mode: 'signin' | 'join') => {
    setAuthModal(mode);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModal(null);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!configured) throw new AuthError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.');
    const { user: nextUser, session: nextSession } = await authSignIn(email, password);
    setUser(nextUser);
    setSession(nextSession);
    await loadStudent(nextUser);
    setAuthModal(null);
  }, [configured, loadStudent]);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      if (!configured) {
        throw new AuthError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.');
      }
      const result = await authSignUp(email, password, fullName);
      if (result.session) {
        setUser(result.user);
        setSession(result.session);
        await loadStudent(result.user);
        setAuthModal(null);
      }
      return { needsEmailConfirmation: result.needsEmailConfirmation };
    },
    [configured, loadStudent],
  );

  const signOut = useCallback(async () => {
    if (!configured) return;
    await authSignOut();
    setSession(null);
    setUser(null);
    setStudent(null);
  }, [configured]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      student,
      loading,
      configured,
      authModal,
      openAuthModal,
      closeAuthModal,
      signIn,
      signUp,
      signOut,
    }),
    [
      session,
      user,
      student,
      loading,
      configured,
      authModal,
      openAuthModal,
      closeAuthModal,
      signIn,
      signUp,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
