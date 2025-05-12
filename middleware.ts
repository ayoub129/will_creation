import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createMiddlewareClient({ req: request, res: response })

  const {
    data: { session },
    error
  } = await supabase.auth.getSession()

  if (error) console.error("Supabase session error:", error)

  const pathname = request.nextUrl.pathname
  const protectedRoutes = ["/dashboard", "/account"]
  const authRoutes = ["/auth", "/login", "/register"]

  const isAuthenticated = !!session?.user

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    const url = new URL("/auth", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}


export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*", "/auth", "/login", "/register"],
}
