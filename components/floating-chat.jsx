"use client"

import { useEffect } from "react"

export function FloatingChat({ isOpen, onClose }) {
  useEffect(() => {
    const handleBodyScroll = () => {
      if (isOpen && window.innerWidth < 768) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = "unset"
      }
    }

    handleBodyScroll()
    window.addEventListener("resize", handleBodyScroll)

    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("resize", handleBodyScroll)
    }
  }, [isOpen])

  return (
    <div
      className={`fixed top-0 md:top-[60px] right-0 h-screen md:h-[calc(100vh-3.5rem)] w-full md:w-80 bg-[#111111] border-l border-border z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-lg">Public Chat</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-primary text-xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-3">
            {Array.from({ length: 50 }, (_, i) => (
              <div key={`user123-${i}`} className="flex flex-col space-y-1">
                <div className="text-sm font-medium text-primary">User123</div>
                <div className="text-sm text-muted-foreground">
                  Hello everyone! 👋 Message #{i + 1}
                </div>
              </div>
            ))}
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium text-primary">MovieFan</div>
              <div className="text-sm text-muted-foreground">Great stream today!</div>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium text-primary">ChatMaster</div>
              <div className="text-sm text-muted-foreground">
                Anyone watching the new episode?
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 text-sm bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
            />
            <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm rounded-sm">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}