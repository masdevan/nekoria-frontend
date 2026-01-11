"use client"

import Image from "next/image"
import Link from "next/link"

export function Footer({ className }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`bg-background border-t border-border mt-8 ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-8">

          {/* Logo & Description */}
          <div className="space-y-4 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Image src="/icons/logo.png" alt="Nekoria Logo" width={28} height={28} className="rounded-full" />
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                  Nekoria
                </span>
              </div>
              <div className="flex-1 h-0.5 bg-primary/30"></div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              The leading streaming platform that delivers high-quality content with an unforgettable viewing experience
              for the whole family.
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-4 sm:space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Legal</h3>
              <div className="flex-1 h-0.5 bg-primary/30"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 sm:gap-2">
              <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Cookie Policy
              </Link>
              <Link href="/content-guidelines" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Content Guidelines
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4 sm:space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Follow Us</h3>
              <div className="flex-1 h-0.5 bg-primary/30"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 sm:gap-2">
              <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Cookie Policy
              </Link>
              <Link href="/content-guidelines" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Content Guidelines
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border py-10 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-xs sm:text-sm">
            Copyright © {currentYear} Nekoria Streaming. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
