import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthError } from '../services/auth';

const AuthModal: React.FC = () => {
  const { authModal, closeAuthModal, openAuthModal, signIn, signUp, configured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isOpen = authModal !== null;
  const isJoin = authModal === 'join';

  useEffect(() => {
    if (!isOpen) return;
    setEmail('');
    setPassword('');
    setFullName('');
    setError(null);
    setInfo(null);
    setSubmitting(false);
  }, [isOpen, authModal]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeAuthModal]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!configured) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.');
      return;
    }

    setSubmitting(true);
    try {
      if (isJoin) {
        const { needsEmailConfirmation } = await signUp(email.trim(), password, fullName.trim());
        if (needsEmailConfirmation) {
          setInfo('Account created. Check your email to confirm, then sign in.');
          setPassword('');
        }
      } else {
        await signIn(email.trim(), password);
      }
    } catch (err) {
      const message = err instanceof AuthError || err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={closeAuthModal}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-surface shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border">
          <h2 id="auth-modal-title" className="font-display text-lg font-semibold text-text">
            {isJoin ? 'Create your account' : 'Sign in'}
          </h2>
          <button
            type="button"
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-elevated transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {isJoin && (
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-text-secondary">Full name</span>
              <input
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Your name"
              />
            </label>
          )}

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="you@university.ac.th"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-text-secondary">Password</span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={isJoin ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder={isJoin ? 'At least 6 characters' : 'Your password'}
            />
          </label>

          {error && (
            <p className="text-sm text-error" role="alert">
              {error}
            </p>
          )}
          {info && (
            <p className="text-sm text-primary" role="status">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors disabled:opacity-60"
          >
            {submitting ? 'Please wait…' : isJoin ? 'Join free' : 'Sign in'}
          </button>

          <p className="text-center text-sm text-text-secondary">
            {isJoin ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                New here?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('join')}
                  className="font-medium text-primary hover:underline"
                >
                  Join free
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
