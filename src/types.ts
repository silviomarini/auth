/** Minimal shape of a Supabase Auth session — only the fields this package reads. */
export interface AdminSession {
  user: {
    email: string | null | undefined
  } | null | undefined
}
