import type { AdminSession } from './types'

interface SupabaseAuthSession {
  user: { email: string | null } | null
}

// Minimal duck-typed shape of the Supabase Auth client this package needs —
// the package never creates the client itself, it's always injected by the consumer.
interface SupabaseAuthClient {
  auth: {
    signInWithOtp: (credentials: {
      email: string
      options?: { emailRedirectTo?: string }
    }) => Promise<{ error: { message: string } | null }>
    signInWithPassword: (credentials: {
      email: string
      password: string
    }) => Promise<{
      data: { session: SupabaseAuthSession | null }
      error: { message: string } | null
    }>
  }
}

export interface MagicLinkOptions {
  /** URL Supabase redirects to after the user clicks the magic link. */
  emailRedirectTo?: string
}

export interface SignInResult {
  session: AdminSession | null
  error: string | null
}

/**
 * Send a passwordless sign-in (magic link) email via Supabase Auth.
 * No session is available yet at this point — it's only established once
 * the user clicks the link and lands back on the consumer's redirect URL.
 */
export async function signInWithMagicLink(
  supabase: SupabaseAuthClient,
  email: string,
  options: MagicLinkOptions = {}
): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: options.emailRedirectTo ? { emailRedirectTo: options.emailRedirectTo } : undefined,
  })

  return { error: error?.message ?? null }
}

/** Sign in with email + password via Supabase Auth. */
export async function signInWithPassword(
  supabase: SupabaseAuthClient,
  email: string,
  password: string
): Promise<SignInResult> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { session: null, error: error.message }

  return { session: { user: { email: data.session?.user?.email ?? null } }, error: null }
}
