"use client"

import { Navbar } from "@/components/navbar"
import { VideoCard } from "@/components/video-card"
import { Footer } from "@/components/footer"

export default function BookmarksPage() {
  const bookmarkedVideos = Array.from({ length: 50 }, (_, index) => ({
    title: "Attack on Titan: Final Season",
    duration: "24:15",
    rating: 9.2,
    isNew: true,
    thumbnail: "/attack-on-titan-anime-scene.png",
  }))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-8 px-4">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            My Bookmarks
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {bookmarkedVideos.length} saved videos
          </p>
        </div>

        <div
          className="grid gap-3 sm:gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          }}
        >
          {bookmarkedVideos.map((video, index) => (
            <VideoCard
              key={index}
              title={video.title}
              duration={video.duration}
              rating={video.rating}
              isNew={video.isNew}
              thumbnail={video.thumbnail}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
