import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req: any) => {
  const isLoggedIn = !!req.auth
  const isAdminPath = req.nextUrl.pathname.startsWith("/admin")
  const isAuthPath = req.nextUrl.pathname.startsWith("/auth")

  // Redirect to signin if not logged in and trying to access protected routes
  if (!isLoggedIn && (isAdminPath || req.nextUrl.pathname.startsWith("/profile"))) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  // Check if user is admin for admin routes
  if (isAdminPath && req.auth?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Redirect to home if logged in and trying to access auth pages
  if (isLoggedIn && isAuthPath) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.png|logo.jpg|uploads).*)"
  ],
}
