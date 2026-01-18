"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { authAPI } from "@/services"

export default function RegisterPage() {
    const router = useRouter()

    const [username, setUsername] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!username) return

        try {
            setLoading(true)

            const res = await authAPI.register({ username })

            const blob = new Blob([res.data], { type: "text/plain" })
            const url = window.URL.createObjectURL(blob)

            const a = document.createElement("a")
            a.href = url
            a.download = "login-key.txt"
            document.body.appendChild(a)
            a.click()

            a.remove()
            window.URL.revokeObjectURL(url)

            setUsername("")

            setTimeout(() => {
                router.push("/auth/login")
            }, 800)
        } catch (err) {
            console.error("REGISTER ERROR:", err)
            alert("Username sudah dipakai atau error.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-grid pointer-events-none" />

            <div className="relative z-10 w-full max-w-sm bg-[#000000] border border-[#212121] rounded-none p-8 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
                <div className="flex flex-col items-center mb-6">
                    <Image
                        src="/icons/logo.png"
                        alt="Logo"
                        width={64}
                        height={64}
                        className="mb-3"
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <label
                        htmlFor="username"
                        className="text-sm mb-2 block text-[#666666]"
                    >
                        Username
                    </label>

                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-[#000000] border border-[#212121] rounded-none px-4 py-2 text-[#999999] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`
                            w-full bg-green-600 text-black font-semibold py-2 rounded-none transition
                            hover:bg-green-700
                            disabled:opacity-50
                            ${loading ? "!cursor-not-allowed" : "cursor-pointer"}
                        `}
                    >
                        {loading ? "Generating key..." : "Register"}
                    </button>
                </form>

                {loading && (
                    <p className="mt-4 text-xs text-center text-[#666666]">
                        Save your key carefully. You’ll need it to login.
                    </p>
                )}
            </div>
        </div>
    )
}