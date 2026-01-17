import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export default async function middleware(req) {
  const pathname = req.nextUrl.pathname

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuth = !!token?.accessToken

  if (isAuth && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/anime", req.url))
  }

  const protectedPaths = [
    "/anime",
    "/genre",
    "/studio",
    "/public-chat",
    "/anime-chat",
    "/user",
    "/security",
  ]

  if (
    protectedPaths.some((path) => pathname.startsWith(path)) &&
    !isAuth
  ) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/anime/:path*",
    "/genre/:path*",
    "/studio/:path*",
    "/public-chat/:path*",
    "/anime-chat/:path*",
    "/user/:path*",
    "/security/:path*",
  ],
}