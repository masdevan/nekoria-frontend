"use client"

import { XMarkIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import { navbarMenu } from "@/utils/header"

export function MobileSidebar({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div>
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      <div className="fixed left-0 top-0 h-full w-64 bg-background border-r border-border z-50 md:hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Image
              src="/icons/logo.png"
              alt="Nekoria Logo"
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Nekoria
            </span>
          </div>

          <button
            onClick={onClose}
            className="hover:text-primary hover:bg-transparent p-1 rounded cursor-pointer"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <nav className="space-y-2">
            {navbarMenu.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block text-foreground hover:text-primary transition-colors py-1"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}