"use client"

import { useState, useEffect } from "react"
import { CookieIcon } from "@heroicons/react/24/outline"

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!hasMounted) return

    const hasAccepted = localStorage.getItem("cookieConsent")
    if (!hasAccepted) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [hasMounted])

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-500 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-card/95 backdrop-blur-sm border-t border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Icon + Text */}
            <div className="flex items-start gap-3 flex-1">
              <CookieIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">We use cookies</p>
                <p>
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our
                  traffic. By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
            </div>

            {/* Accept Button */}
            <div className="flex items-center flex-shrink-0 w-full sm:w-auto justify-center sm:justify-end">
              <button
                onClick={acceptCookies}
                className="text-xs px-4 py-2 h-auto bg-primary hover:bg-primary/90 cursor-pointer rounded-none transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}