import React from "react"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { MobileBottomBar } from "@/components/mobile-bottom-bar"
import { ClientOnly } from "@/components/client-only"
import CookieConsent from "@/components/cookie-consent"
import "../styles/globals.css"

export const metadata = {
  title: "Nekoria - Watch Anime Online Free",
  icons: {
    icon: "/icons/favicon.png",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans" suppressHydrationWarning={true}>
        <DesktopSidebar />
        <div className="lg:ml-[60px]">
          <Navbar />
          <main className="pb-16 lg:pb-0">{children}</main>
          <Footer className="hidden lg:block" />
        </div>
        <MobileBottomBar />
        <ClientOnly>
          <CookieConsent />
        </ClientOnly>
      </body>
    </html>
  )
}
