"use client"

import Link from "next/link"
import { HomeIcon, ArrowsRightLeftIcon, BookmarkIcon, ChatBubbleOvalLeftIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { FloatingChat } from "./floating-chat"

const dummyAnimes = [
  { id: 1, title: "Attack on Titan", slug: "attack-on-titan" },
  { id: 2, title: "Demon Slayer", slug: "demon-slayer" },
  { id: 3, title: "One Piece", slug: "one-piece" },
  { id: 4, title: "Naruto", slug: "naruto" },
  { id: 5, title: "Death Note", slug: "death-note" },
  { id: 6, title: "My Hero Academia", slug: "my-hero-academia" },
  { id: 7, title: "Dragon Ball Z", slug: "dragon-ball-z" },
  { id: 8, title: "Fullmetal Alchemist", slug: "fullmetal-alchemist" },
]

export function MobileBottomBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isChatOpen, setIsChatOpen] = useState(false)

  const isActive = (path) => pathname === path || pathname.startsWith(path)

  const handleRandomAnime = () => {
    const randomAnime = dummyAnimes[Math.floor(Math.random() * dummyAnimes.length)]
    router.push(`/watch/${randomAnime.id}`)
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border md:hidden">
        <div className="grid grid-cols-5 items-center px-2 py-2 max-w-md mx-auto">
          <button onClick={handleRandomAnime} className="flex justify-center cursor-pointer">
            <div className="p-2 rounded-xl hover:bg-muted/80 transition-all duration-200 active:scale-95">
              <ArrowsRightLeftIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          </button>

          <Link href="/bookmark" className="flex justify-center cursor-pointer">
            <div className="p-2 rounded-xl hover:bg-muted/80 transition-all duration-200 active:scale-95">
              <BookmarkIcon className={`h-5 w-5 ${isActive("/bookmark") ? "text-primary" : "text-muted-foreground"}`} />
            </div>
          </Link>

          <Link href="/" className="flex justify-center cursor-pointer">
            <div className="p-2.5 rounded-full bg-primary hover:bg-primary/90 transition-all duration-200 active:scale-95 shadow-lg">
              <HomeIcon className="h-6 w-6 text-primary-foreground" />
            </div>
          </Link>

          <button onClick={() => setIsChatOpen(true)} className="flex justify-center cursor-pointer">
            <div className="p-2 rounded-xl hover:bg-muted/80 transition-all duration-200 active:scale-95">
              <ChatBubbleOvalLeftIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          </button>

          <Link href="/help" className="flex justify-center cursor-pointer">
            <div className="p-2 rounded-xl hover:bg-muted/80 transition-all duration-200 active:scale-95">
              <QuestionMarkCircleIcon className={`h-5 w-5 ${isActive("/help") ? "text-primary" : "text-muted-foreground"}`} />
            </div>
          </Link>
        </div>
      </div>

      <FloatingChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}
