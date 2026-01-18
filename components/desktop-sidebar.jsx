"use client"

import { usePathname } from "next/navigation"
import { SearchModal } from "@/components/search-modal"
import { sidebarMenu } from "@/utils/sidebar"
import Link from "next/link"

export function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[60px] bg-[#008C00] flex-col items-center justify-center py-4 z-40">
      <div className="flex flex-col gap-2">
        {sidebarMenu.map((item) => {
          const Icon = item.icon
          const isActive = item.href && pathname === item.href
          const base = "flex items-center justify-center w-10 h-10 transition-colors rounded-none"
          const active = isActive ? "bg-green-900" : "hover:bg-green-900"

          if (item.type === "link") {
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`${base} ${active}`}
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
                className={`${base} hover:bg-green-900`}
                title={item.label}
              >
                <SearchModal />
              </div>
            )
          }

          return (
            <button
              key={item.label}
              onClick={() => handleAction(item)}
              className={`${base} ${active} cursor-pointer`}
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