import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // DEMO MODE: Allow all access, no auth checks
  // Just pass through to the next handler
  return NextResponse.next({
    request,
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

