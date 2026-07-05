import { createServerClient } from '@supabase/ssr'
import type { CookieMethodsServer } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { NextRequest, NextResponse } from 'next/server'
import type { AdminSession } from '../types'

export interface SupabaseServerClientOptions {
  supabaseUrl: string
  supabaseAnonKey: string
}

/**
 * Create a Supabase server client from a caller-supplied cookie adapter.
 * Use in Server Components / Route Handlers with the cookie store returned
 * by `cookies()` from `next/headers`.
 */
export function createSupabaseServerClient(
  cookies: CookieMethodsServer,
  options: SupabaseServerClientOptions
): SupabaseClient {
  return createServerClient(options.supabaseUrl, options.supabaseAnonKey, { cookies })
}

/**
 * Create a Supabase server client wired to a Next.js middleware's
 * request/response pair, so a refreshed session is written back to both —
 * required for session cookies to stay in sync across requests.
 */
export function createSupabaseMiddlewareClient(
  request: NextRequest,
  response: NextResponse,
  options: SupabaseServerClientOptions
): SupabaseClient {
  return createServerClient(options.supabaseUrl, options.supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        cookiesToSet.forEach(({ name, value, options: cookieOptions }) =>
          response.cookies.set(name, value, cookieOptions)
        )
      },
    },
  })
}

/**
 * Read the current session from a Next.js request's cookies, in the
 * AdminSession shape expected by verifyAdmin. Uses `getUser()` internally
 * so the email is validated against the Supabase Auth server rather than
 * trusted from a locally-decoded, unverified cookie.
 */
export async function getServerSession(
  request: NextRequest,
  options: SupabaseServerClientOptions
): Promise<AdminSession | null> {
  const supabase = createServerClient(options.supabaseUrl, options.supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
    },
  })

  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null

  return { user: { email: data.user.email } }
}
