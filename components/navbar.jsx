"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MobileSidebar } from "./mobile-sidebar"
import { FloatingChat } from "./floating-chat"
import { SearchModal } from "./search-modal"
import { Bars3Icon, BookmarkIcon, ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline"

export function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 lg:left-[60px] right-0 z-50 bg-background border-b border-border px-4 py-3">
        <div className="mx-auto flex items-center justify-between">
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 rounded hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <Bars3Icon className="w-5 h-5 text-foreground" />
              </button>

              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <Image src="/icons/logo.png" alt="Nekoria Logo" width={32} height={32} className="rounded-full" />
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                  Nekoria
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Link href="#" className="text-foreground hover:text-primary transition-colors">Home</Link>
              <Link href="#" className="text-foreground hover:text-primary transition-colors">Live</Link>
              <Link href="#" className="text-foreground hover:text-primary transition-colors">TV Show</Link>
              <Link href="#" className="text-foreground hover:text-primary transition-colors">Sports</Link>
              <Link href="#" className="text-foreground hover:text-primary transition-colors">Kids</Link>
              <Link href="#" className="text-foreground hover:text-primary transition-colors">News</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 md:space-x-4">
              <SearchModal />

              <Link href="/bookmarks" className="hidden md:block">
                <button className="p-2 rounded hover:bg-muted/50 transition-colors cursor-pointer">
                  <BookmarkIcon className="w-5 h-5 text-foreground" />
                </button>
              </Link>

              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="hidden md:flex p-2 rounded hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <ChatBubbleOvalLeftIcon className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <FloatingChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}