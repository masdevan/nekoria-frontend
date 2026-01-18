import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export default async function middleware(req) {
    const { pathname } = req.nextUrl

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    })

    const isAuth = !!token?.accessToken

    if (
        isAuth &&
        (pathname === "/auth/login" || pathname === "/auth/register")
    ) {
        return NextResponse.redirect(new URL("/", req.url))
    }
    
    if (pathname.startsWith("/bookmark") && !isAuth) {
        return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/auth/login",
        "/auth/register",
        "/bookmark/:path*",
    ],
}
