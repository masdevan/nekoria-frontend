import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
    session: {
        strategy: "jwt",
    },

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_BE_AUTH_URL}/auth/login`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                email: credentials?.email,
                                password: credentials?.password,
                            }),
                        }
                    )

                    if (!res.ok) return null

                    const data = await res.json()

                    if (!data?.user || !data?.token) return null

                    return {
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email,
                        token: data.token,
                    }
                } catch (error) {
                    console.error("AUTH ERROR:", error)
                    return null
                }
            }
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.token
                token.user = user
            }
            return token
        },

        async session({ session, token }) {
            if (!token?.accessToken) return null

            session.user = token.user
            session.accessToken = token.accessToken
            return session
        }
    },

    pages: {
        signIn: "/auth/login",
    },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }