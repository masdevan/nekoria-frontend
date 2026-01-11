"use client"

import { usePathname, useRouter } from "next/navigation"
import { SearchModal } from "@/components/search-modal"
import Link from "next/link"

// Heroicons
import {
  HomeIcon,
  BookmarkIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline"

const sidebarItems = [
  {
    icon: HomeIcon,
    href: "/",
    label: "Home",
    type: "link",
  },
  {
    icon: BookmarkIcon,
    href: "/bookmarks",
    label: "Bookmarks",
    type: "link",
  },
  {
    icon: MagnifyingGlassIcon,
    href: "/search",
    label: "Search",
    type: "modal",
  },
  {
    icon: ArrowPathIcon,
    href: "/random",
    label: "Random",
    type: "action",
  },
  {
    icon: QuestionMarkCircleIcon,
    href: "/help",
    label: "Help",
    type: "link",
  },
]

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

export function DesktopSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleRandomAnime = () => {
    const randomAnime = dummyAnimes[Math.floor(Math.random() * dummyAnimes.length)]
    router.push(`/watch/${randomAnime.id}`)
  }

  const handleItemClick = (item) => {
    if (item.type === "action") {
      handleRandomAnime()
    }
  }

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[60px] bg-[#008C00] flex-col items-center justify-center py-4 z-40">
      <div className="flex flex-col gap-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const baseClasses = "flex items-center justify-center w-10 h-10 transition-colors rounded-none"
          const activeClasses = isActive ? "bg-green-900" : "hover:bg-green-900"

          if (item.type === "link") {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${baseClasses} ${activeClasses}`}
                title={item.label}
              >
                <Icon className="w-5 h-5 text-white" />
              </Link>
            )
          }

          if (item.type === "modal") {
            return (
              <div
                key={item.label}
                className={`flex items-center justify-center w-10 h-10 transition-colors !rounded-none hover:!bg-green-900`}
              >
                <SearchModal />
              </div>
            )
          }

          return (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className={`${baseClasses} ${activeClasses} cursor-pointer`}
              title={item.label}
            >
              <Icon className="w-5 h-5 text-white" />
            </button>
          )
        })}
      </div>
    </aside>
  )
}