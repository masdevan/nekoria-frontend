"use client"

import { Navbar } from "@/components/navbar"
import { VideoCard } from "@/components/video-card"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useState, useEffect } from "react"

const generateSearchResults = (query) => {
  const allAnime = [
    "Attack on Titan",
    "Your Name",
    "One Piece",
    "Spirited Away",
    "Death Note",
    "My Hero Academia",
    "Demon Slayer",
    "Naruto",
    "Dragon Ball Z",
    "One Punch Man",
    "Tokyo Ghoul",
    "Fullmetal Alchemist",
    "Hunter x Hunter",
    "Bleach",
    "Jujutsu Kaisen",
    "Mob Psycho 100",
    "Cowboy Bebop",
    "Neon Genesis Evangelion",
    "Princess Mononoke",
    "Akira",
    "Ghost in the Shell",
    "Violet Evergarden",
    "Your Lie in April",
    "A Silent Voice",
    "Weathering with You",
    "The Garden of Words",
    "5 Centimeters Per Second",
    "Makoto Shinkai Collection",
    "Studio Ghibli Movies",
    "Hayao Miyazaki Films",
  ]

  const filteredAnime = allAnime.filter((anime) => anime.toLowerCase().includes(query.toLowerCase()))

  return filteredAnime.map((title, index) => ({
    title,
    image: "/placeholder.svg?height=300&width=200",
    duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
    isNew: Math.random() > 0.7,
    rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
  }))
}

export default function SearchPage({ params }) {
  const query = decodeURIComponent(params.query)
  const searchResults = generateSearchResults(query)

  const [maxColumns, setMaxColumns] = useState(8)
  const [shouldUseAutoFill, setShouldUseAutoFill] = useState(false)

  useEffect(() => {
    const calculateMaxColumns = () => {
      const screenWidth = window.innerWidth
      const itemWidth = screenWidth >= 640 ? 140 : 96 
      const gap = screenWidth >= 640 ? 16 : 12
      const padding = 32 
      const availableWidth = screenWidth - padding
      const columns = Math.floor((availableWidth + gap) / (itemWidth + gap))
      return Math.max(1, columns)
    }

    const updateGrid = () => {
      const cols = calculateMaxColumns()
      setMaxColumns(cols)
      setShouldUseAutoFill(searchResults.length < cols)
    }

    updateGrid()
    window.addEventListener("resize", updateGrid)
    return () => window.removeEventListener("resize", updateGrid)
  }, [searchResults.length])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mt-16 px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">Search Results</h1>
          {query && (
            <p className="text-muted-foreground">
              Showing results for "{query}" ({searchResults.length} found)
            </p>
          )}
        </div>

        {searchResults.length > 0 ? (
          <div className={shouldUseAutoFill ? "flex" : ""}>
            <div
              className={`grid gap-3 sm:gap-4 ${
                shouldUseAutoFill
                  ? "grid-cols-[repeat(auto-fill,minmax(96px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(140px,1fr))]"
                  : "grid-cols-[repeat(auto-fit,minmax(96px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]"
              }`}
              style={{
                maxWidth: shouldUseAutoFill
                  ? `${Math.min(searchResults.length, maxColumns) * (typeof window !== "undefined" && window.innerWidth >= 640 ? 156 : 108)}px`
                  : "none",
              }}
            >
              {searchResults.map((video, index) => (
                <VideoCard
                  key={index}
                  title={video.title}
                  image={video.image}
                  duration={video.duration}
                  isNew={video.isNew}
                  rating={video.rating}
                />
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No results found for "{query}"</p>
            <p className="text-muted-foreground">Try searching with different keywords or browse our popular genres.</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Enter a search term to find your favorite anime and movies.</p>
          </div>
        )}
      </div>
    </div>
  )
}
