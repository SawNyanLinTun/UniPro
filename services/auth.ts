import type { Session, User } from '@supabase/supabase-js';
import { getSupabase } from './supabase';

/** Row shape from public.students (subset used by the UI). */
export interface StudentRow {
  id: string;
  auth_user_id: string | null;
  full_name: string;
  university: string | null;
  degree: string | null;
  graduation_year: number | null;
  gpa: number | null;
  cv_file_path: string | null;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await getSupabase().auth.getSession();
  if (error) throw new AuthError(error.message);
  return data.session;
}

export async function signIn(email: string, password: string): Promise<{ user: User; session: Session }> {
  const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (error) throw new AuthError(error.message);
  if (!data.user || !data.session) throw new AuthError('Sign in failed: no session returned.');
  await ensureStudentProfile(data.user.id, displayNameFromUser(data.user));
  return { user: data.user, session: data.session };
}

export async function signUp(
  email: string,
  password: string,
  fullName: string,
): Promise<{ user: User; session: Session | null; needsEmailConfirmation: boolean }> {
  const trimmedName = fullName.trim();
  if (!trimmedName) throw new AuthError('Full name is required.');

  const { data, error } = await getSupabase().auth.signUp({
    email,
    password,
    options: { data: { full_name: trimmedName } },
  });
  if (error) throw new AuthError(error.message);
  if (!data.user) throw new AuthError('Sign up failed: no user returned.');

  // When email confirmation is off, a session is present — ensure the students row.
  if (data.session) {
    await ensureStudentProfile(data.user.id, trimmedName);
  }

  return {
    user: data.user,
    session: data.session,
    needsEmailConfirmation: !data.session,
  };
}

export async function signOut(): Promise<void> {
  const { error } = await getSupabase().auth.signOut();
  if (error) throw new AuthError(error.message);
}

function displayNameFromUser(user: User): string {
  const meta = user.user_metadata?.full_name;
  if (typeof meta === 'string' && meta.trim()) return meta.trim();
  if (user.email) return user.email.split('@')[0] ?? 'Student';
  return 'Student';
}

/**
 * Load the students row for an auth user, creating one if the signup trigger
 * was not applied or the row is missing (e.g. older test accounts).
 */
export async function ensureStudentProfile(authUserId: string, fullName: string): Promise<StudentRow> {
  const supabase = getSupabase();
  const { data: existing, error: selectError } = await supabase
    .from('students')
    .select('id, auth_user_id, full_name, university, degree, graduation_year, gpa, cv_file_path')
    .eq('auth_user_id', authUserId)
    .maybeSingle();

  if (selectError) throw new AuthError(selectError.message);
  if (existing) {
    // Upgrade stub name if the trigger used email local-part and we have a better name.
    if (fullName && existing.full_name !== fullName && !existing.university) {
      const { data: updated, error: updateError } = await supabase
        .from('students')
        .update({ full_name: fullName })
        .eq('id', existing.id)
        .select('id, auth_user_id, full_name, university, degree, graduation_year, gpa, cv_file_path')
        .single();
      if (!updateError && updated) return updated as StudentRow;
    }
    return existing as StudentRow;
  }

  const { data: created, error: insertError } = await supabase
    .from('students')
    .insert({
      auth_user_id: authUserId,
      full_name: fullName || 'Student',
    })
    .select('id, auth_user_id, full_name, university, degree, graduation_year, gpa, cv_file_path')
    .single();

  if (insertError) throw new AuthError(insertError.message);
  return created as StudentRow;
}

export async function fetchStudentForUser(authUserId: string): Promise<StudentRow | null> {
  const { data, error } = await getSupabase()
    .from('students')
    .select('id, auth_user_id, full_name, university, degree, graduation_year, gpa, cv_file_path')
    .eq('auth_user_id', authUserId)
    .maybeSingle();
  if (error) throw new AuthError(error.message);
  return (data as StudentRow | null) ?? null;
}
