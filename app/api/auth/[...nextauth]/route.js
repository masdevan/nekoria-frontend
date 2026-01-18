import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Login Key",
            credentials: {
                key: { label: "Login Key", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.key) return null

                const loginKey = credentials.key

                if (loginKey.length !== 16) return null

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BE_AUTH_URL}/auth/login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                        body: JSON.stringify({ key: loginKey }),
                    }
                )

                if (!res.ok) return null

                const data = await res.json()

                if (!data?.token) return null

                return {
                    id: "guest",
                    token: data.token,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.token
            }
            return token
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken
            return session
        },
    },
    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }