"use client"

import Image from "next/image"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

export default function LoginPage() {
    const router = useRouter()

    const [key, setKey] = useState("")
    const [loading, setLoading] = useState(false)
    const [fileName, setFileName] = useState("")
    const [showKey, setShowKey] = useState(false)

    const handleKeyChange = (e) => {
        const value = e.target.value.toUpperCase().slice(0, 16)
        setKey(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!key) return

        if (key.length !== 16) {
            alert("Key must be exactly 16 characters")
            return
        }

        try {
            setLoading(true)

            const res = await signIn("credentials", {
                key: key,
                redirect: false,
            })

            if (res?.error) {
                alert("Invalid key")
                return
            }

            router.push("/")
        } catch (err) {
            console.error("Login Failed:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleFileUpload = (file) => {
        if (!file) return

        setFileName(file.name)
        setShowKey(false)

        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target.result
                ?.toString()
                .replace(/\s+/g, "")
                .toUpperCase()
                .slice(0, 16)

            if (text?.length === 16) {
                setKey(text)
            } else {
                alert("Invalid key file")
            }
        }
        reader.readAsText(file)
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
                    <div>
                        <label className="text-sm mb-2 block text-[#666666]">
                            Your Login Key
                        </label>

                        <div className="relative">
                            <input
                                type={showKey ? "text" : "password"}
                                placeholder="Paste your key here"
                                value={key}
                                onChange={handleKeyChange}
                                maxLength={16}
                                className="w-full bg-[#000000] border border-[#212121] rounded-none px-4 py-2 pr-10 text-[#999999] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                                required
                            />

                            {key && (
                                <button
                                    type="button"
                                    onClick={() => setShowKey(!showKey)}
                                    className="absolute inset-y-0 right-3 flex items-center text-[#666666] hover:text-[#999999]"
                                >
                                    {showKey ? (
                                        <EyeSlashIcon className="w-5 h-5 cursor-pointer" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5 cursor-pointer" />
                                    )}
                                </button>
                            )}
                        </div>

                        {key && (
                            <p className="text-xs text-[#666666] mt-1">
                                {key.length}/16 characters
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm mb-2 block text-[#666666]">
                            Or upload key file
                        </label>

                        <input
                            type="file"
                            accept=".txt"
                            id="file"
                            className="hidden"
                            onChange={(e) =>
                                handleFileUpload(e.target.files?.[0])
                            }
                        />

                        <label
                            htmlFor="file"
                            className="block bg-[#000000] border border-[#212121] px-4 py-2 text-[#999999] cursor-pointer hover:bg-[#111111] transition truncate"
                        >
                            {fileName || "Choose file"}
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || key.length !== 16}
                        className={`
                            w-full bg-green-600 text-black font-semibold py-2 rounded-none transition
                            hover:bg-green-700
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        {loading ? "Authenticating..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-[#666666]">
                    Don't have an account?{" "}
                    <Link
                        href="/auth/register"
                        className="text-green-500 hover:underline"
                    >
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    )
}