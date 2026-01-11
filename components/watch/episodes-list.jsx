"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"

export function EpisodesList({ episodes, videoId, currentEpisodeId }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [maxColumns, setMaxColumns] = useState(8)
  const [viewMode, setViewMode] = useState("grid")
  const [watchedEpisodes, setWatchedEpisodes] = useState(new Set())
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const filteredEpisodes = episodes.filter((episode) =>
    episode.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    const stored = localStorage.getItem(`watched-${videoId}`)
    if (stored) setWatchedEpisodes(new Set(JSON.parse(stored)))
  }, [videoId])

  useEffect(() => {
    if (currentEpisodeId && episodes.some((ep) => ep.id === currentEpisodeId)) {
      setWatchedEpisodes((prev) => {
        const newSet = new Set(prev)
        newSet.add(currentEpisodeId)
        return newSet
      })
    }
  }, [currentEpisodeId, episodes])

  useEffect(() => {
    localStorage.setItem(`watched-${videoId}`, JSON.stringify([...watchedEpisodes]))
  }, [watchedEpisodes, videoId])

  const toggleWatched = (episodeId, e) => {
    e.preventDefault()
    e.stopPropagation()
    setWatchedEpisodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(episodeId)) newSet.delete(episodeId)
      else newSet.add(episodeId)
      return newSet
    })
  }

  // Calculate max columns for grid
  useEffect(() => {
    const calculateMaxColumns = () => {
      const containerWidth = window.innerWidth - 32
      const mobile = window.innerWidth < 640
      const minItemWidth = mobile ? 160 : 220
      const gap = mobile ? 12 : 16
      const columns = Math.floor((containerWidth + gap) / (minItemWidth + gap))
      setMaxColumns(Math.max(1, columns))
    }
    calculateMaxColumns()
    window.addEventListener("resize", calculateMaxColumns)
    return () => window.removeEventListener("resize", calculateMaxColumns)
  }, [])

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setViewMode("list")
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const shouldUseAutoFill = filteredEpisodes.length < maxColumns

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Episodes</h2>
        <div className="flex items-center gap-2">
          {isMobile ? (
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 rounded bg-muted hover:bg-muted/80 transition-colors"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          ) : (
            <div className="relative w-64">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search episodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-1.5 rounded border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer" />
            </div>
          )}
          <div className="flex border border-border rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 ${viewMode === "grid" ? "bg-primary/10" : ""}`}
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 ${viewMode === "list" ? "bg-primary/10" : ""}`}
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className="bg-background border border-border rounded-lg p-4 mx-4 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Search Episodes</h3>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="p-2 rounded hover:bg-muted transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search episodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-1.5 rounded border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {/* Episodes List */}
      <div className="h-96 overflow-y-auto border border-border custom-scrollbar">
        {viewMode === "grid" ? (
          <div className={shouldUseAutoFill ? "flex" : ""}>
            <div
              className="grid gap-3 sm:gap-4 w-full"
              style={{
                gridTemplateColumns: shouldUseAutoFill
                  ? `repeat(${Math.min(filteredEpisodes.length, maxColumns)}, minmax(160px, 1fr))`
                  : "repeat(auto-fit, minmax(160px, 1fr))",
                maxWidth: shouldUseAutoFill
                  ? `${Math.min(filteredEpisodes.length, maxColumns) * (160 + 12) - 12}px`
                  : "none",
              }}
            >
              {filteredEpisodes.map((episode) => (
                <Link key={episode.id} href={`/watch/${videoId}/episode/${episode.id}`}>
                  <div className="cursor-pointer group relative">
                    <div className="relative aspect-[8.5/5] bg-muted overflow-hidden mb-2">
                      <img
                        src={episode.image || "/placeholder.svg"}
                        alt={`Episode ${episode.id}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => toggleWatched(episode.id, e)}
                        className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-black/80 transition-colors"
                      >
                        {watchedEpisodes.has(episode.id) ? (
                          <CheckCircleIcon className="w-4 h-4 text-green-400" />
                        ) : (
                          <CheckCircleIcon className="w-4 h-4 text-white" />
                        )}
                      </button>
                    </div>
                    <h3 className="text-sm font-medium text-foreground line-clamp-2">
                      Episode {episode.id}: {episode.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-1 py-4">
            {filteredEpisodes.map((episode) => (
              <Link key={episode.id} href={`/watch/${videoId}/episode/${episode.id}`}>
                <div className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/60 transition-all duration-200 cursor-pointer group border border-transparent hover:border-border/50">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button
                      onClick={(e) => toggleWatched(episode.id, e)}
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      {watchedEpisodes.has(episode.id) ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      ) : (
                        <CheckCircleIcon className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {episode.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">Episode {episode.id}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}