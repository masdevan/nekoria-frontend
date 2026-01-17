"use client"

import { Navbar } from "@/components/navbar"
import { VideoCard } from "@/components/video-card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowLeftIcon } from "@heroicons/react/24/outline" 

const genreData = {
  adventures: Array.from({ length: 1 }, (_, index) => ({
    title: `Demon Slayer Adventure ${index + 1}`,
    image: "/placeholder.svg?height=300&width=200",
    duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
    isNew: Math.random() > 0.7,
    rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
  })),
  action: Array.from({ length: 50 }, (_, index) => ({
    title: `Action Movie ${index + 1}`,
    image: "/placeholder.svg?height=300&width=200",
    duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
    isNew: Math.random() > 0.7,
    rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
  })),
  drama: Array.from({ length: 50 }, (_, index) => ({
    title: `Drama Series ${index + 1}`,
    image: "/placeholder.svg?height=300&width=200",
    duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
    isNew: Math.random() > 0.7,
    rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
  })),
  comedy: Array.from({ length: 50 }, (_, index) => ({
    title: `Comedy Show ${index + 1}`,
    image: "/placeholder.svg?height=300&width=200",
    duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
    isNew: Math.random() > 0.7,
    rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
  })),
  crime: Array.from({ length: 50 }, (_, index) => ({
    title: `Crime Thriller ${index + 1}`,
    image: "/placeholder.svg?height=300&width=200",
    duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
    isNew: Math.random() > 0.7,
    rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
  })),
  romance: Array.from({ length: 50 }, (_, index) => ({
    title: `Romance Story ${index + 1}`,
    image: "/placeholder.svg?height=300&width=200",
    duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
    isNew: Math.random() > 0.7,
    rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
  })),
  ecchi: Array.from({ length: 50 }, (_, index) => ({
    title: `Ecchi Anime ${index + 1}`,
    image: "/placeholder.svg?height=300&width=200",
    duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
    isNew: Math.random() > 0.7,
    rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
  })),
  "slice-of-life": Array.from({ length: 50 }, (_, index) => ({
    title: `Slice of Life ${index + 1}`,
    image: "/placeholder.svg?height=300&width=200",
    duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
    isNew: Math.random() > 0.7,
    rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
  })),
  shoujo: Array.from({ length: 50 }, (_, index) => ({
    title: `Shoujo Anime ${index + 1}`,
    image: "/placeholder.svg?height=300&width=200",
    duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
    isNew: Math.random() > 0.7,
    rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
  })),
  horror: Array.from({ length: 50 }, (_, index) => ({
    title: `Horror Movie ${index + 1}`,
    image: "/placeholder.svg?height=300&width=200",
    duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
    isNew: Math.random() > 0.7,
    rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
  })),
}

const genreNames = {
  adventures: "Adventures",
  action: "Action",
  drama: "Drama",
  comedy: "Comedy",
  crime: "Crime",
  romance: "Romance",
  ecchi: "Ecchi",
  "slice-of-life": "Slice of Life",
  shoujo: "Shoujo",
  horror: "Horror",
}

export default function GenrePage({ params }) {
  const videos = genreData[params.slug] || []
  const genreName = genreNames[params.slug] || "Unknown Genre"

  const [maxColumns, setMaxColumns] = useState(8)

  useEffect(() => {
    const calculateMaxColumns = () => {
      const screenWidth = window.innerWidth
      const padding = 32
      const gap = screenWidth >= 640 ? 16 : 12
      const minItemWidth = screenWidth >= 640 ? 140 : 96
      const availableWidth = screenWidth - padding
      const columns = Math.floor((availableWidth + gap) / (minItemWidth + gap))
      setMaxColumns(Math.max(1, columns))
    }

    calculateMaxColumns()
    window.addEventListener("resize", calculateMaxColumns)
    return () => window.removeEventListener("resize", calculateMaxColumns)
  }, [])

  const shouldUseAutoFill = videos.length < maxColumns

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mt-16 px-4 py-8">
        {/* Back button and title */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-8">{genreName}</h1>

        <div className={shouldUseAutoFill ? "flex" : ""}>
          <div
            className={`grid gap-3 sm:gap-4 ${
              shouldUseAutoFill
                ? "grid-cols-[repeat(auto-fill,minmax(96px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(140px,1fr))]"
                : "grid-cols-[repeat(auto-fit,minmax(96px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]"
            }`}
            style={{
              maxWidth: shouldUseAutoFill
                ? `${Math.min(videos.length, maxColumns) * (window.innerWidth >= 640 ? 156 : 108)}px`
                : "none",
            }}
          >
            {videos.map((video, index) => (
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
      </div>
    </div>
  )
}