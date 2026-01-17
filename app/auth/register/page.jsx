"use client"

import Image from "next/image"
import { useState } from "react"

export default function RegisterPage() {
    const [username, setUsername] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Register username:", username)
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
                    <label htmlFor="username" className="text-sm mb-2 block text-[#666666]">Username</label>
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
                        className="w-full bg-green-600 cursor-pointer text-black font-semibold py-2 rounded-none hover:bg-green-700 transition"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    )
}