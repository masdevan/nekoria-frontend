import React from "react"
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
        <main className="pb-16 lg:pb-0">{children}</main>
      </body>
    </html>
  )
}
