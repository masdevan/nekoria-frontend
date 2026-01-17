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

export function EpisodesList({ episodes, videoId, currentEpisodeId, animeTitle }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [watchedEpisodes, setWatchedEpisodes] = useState(new Set())
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

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

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Episodes</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="p-2 rounded bg-muted hover:bg-muted/80 transition-colors md:hidden"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
          <div className="relative w-64 hidden md:block">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search episodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 rounded border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex border border-border rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 cursor-pointer py-1 ${viewMode === "grid" ? "bg-primary/10" : ""}`}
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 cursor-pointer py-1 ${viewMode === "list" ? "bg-primary/10" : ""}`}
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

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

      <div className="h-96 overflow-y-auto border border-border custom-scrollbar">
        {viewMode === "grid" ? (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
              {filteredEpisodes.map((episode) => (
                <Link key={episode.id} href={`/watch/${videoId}/episode/${episode.id}`}>
                  <div className={`cursor-pointer group relative ${watchedEpisodes.has(episode.id) ? 'opacity-60' : ''}`}>
                    <div className="relative aspect-[16/9] bg-muted overflow-hidden mb-2 rounded-none">
                      <img
                        src={episode.image || "/placeholder.svg"}
                        alt={`${animeTitle} - ${episode.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {watchedEpisodes.has(episode.id) && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <CheckCircleIcon className="w-8 h-8 text-green-400" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-xs md:text-sm font-medium text-foreground line-clamp-2">
                      {animeTitle} - {episode.title}
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
                <div className={`flex items-center justify-between p-4 rounded-lg hover:bg-muted/60 transition-all duration-200 cursor-pointer group border border-transparent hover:border-border/50 ${watchedEpisodes.has(episode.id) ? 'opacity-60' : ''}`}>
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
                        {animeTitle} - {episode.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">Episode {episode.episode_number}</p>
                    </div>
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