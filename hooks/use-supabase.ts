import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function useSupabase() {
  return createClientComponentClient()
} 