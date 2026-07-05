import type { AdminSession } from './types'

/**
 * Check whether a Supabase Auth session belongs to an admin.
 * The session must have a user email, and it must match (case-insensitive)
 * one of the emails in adminEmails. Never throws — returns false on any
 * missing/invalid input.
 */
export function verifyAdmin(session: AdminSession | null | undefined, adminEmails: string[]): boolean {
  const email = session?.user?.email
  if (!email) return false

  return adminEmails.some((adminEmail) => adminEmail.toLowerCase() === email.toLowerCase())
}
