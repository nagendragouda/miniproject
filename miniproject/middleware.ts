import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Supabase database has been disconnected
// Authentication is now handled by Firebase only on the client side

export async function middleware(req: NextRequest) {
  // Allow all routes to pass through
  // Firebase authentication is handled client-side in FirebaseAuthProvider
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}