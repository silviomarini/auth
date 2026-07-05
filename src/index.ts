export type { AdminSession } from './types'
export { verifyAdmin } from './verify-admin'

export type { MagicLinkOptions, SignInResult } from './login'
export { signInWithMagicLink, signInWithPassword } from './login'

export type { SupabaseServerClientOptions } from './adapters/nextjs'
export {
  createSupabaseServerClient,
  createSupabaseMiddlewareClient,
  getServerSession,
} from './adapters/nextjs'
