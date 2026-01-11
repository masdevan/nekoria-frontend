"use client"

import { useState } from "react"
import { XMarkIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline"

export function ShareModal({ isOpen, onClose, title, url }) {
  const [showCopyTooltip, setShowCopyTooltip] = useState(false)

  if (!isOpen) return null

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setShowCopyTooltip(true)
      setTimeout(() => setShowCopyTooltip(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const handleSocialShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(title)

    let socialShareUrl = ""
    switch (platform) {
      case "facebook":
        socialShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case "twitter":
        socialShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
        break
    }

    if (socialShareUrl) {
      window.open(socialShareUrl, "_blank", "width=600,height=400")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border p-6 w-full max-w-md relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Share this video</h3>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-muted/50 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-4 py-2 border border-border rounded hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <DocumentDuplicateIcon className="w-5 h-5" />
              Copy Link
            </button>
            {showCopyTooltip && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-green-600 text-white text-sm whitespace-nowrap z-10 rounded">
                Link copied to clipboard!
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-green-600"></div>
              </div>
            )}
          </div>

          <button
            onClick={() => handleSocialShare("facebook")}
            className="w-full flex items-center gap-3 px-4 py-2 border border-border rounded hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <span className="font-bold text-blue-600">f</span>
            Share on Facebook
          </button>

          <button
            onClick={() => handleSocialShare("twitter")}
            className="w-full flex items-center gap-3 px-4 py-2 border border-border rounded hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <span className="font-bold text-blue-400">t</span>
            Share on Twitter
          </button>
        </div>
      </div>
    </div>
  )
}