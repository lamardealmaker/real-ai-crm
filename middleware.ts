import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check auth condition
  const isAuthPage = req.nextUrl.pathname.startsWith('/sign-in') || 
                    req.nextUrl.pathname.startsWith('/sign-up') ||
                    req.nextUrl.pathname.startsWith('/reset-password')
  const isApiPage = req.nextUrl.pathname.startsWith('/api')
  
  if (!session && !isAuthPage && !isApiPage) {
    // Redirect to login if accessing protected route without session
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  if (session && isAuthPage) {
    // Redirect to appropriate dashboard if accessing auth pages while logged in
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single()

    if (profile?.role) {
      return NextResponse.redirect(new URL(`/${profile.role}/dashboard`, req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}