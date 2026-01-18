"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { VideoCard } from "@/components/video-card"
import { bookmarkAPI } from "@/services/index"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export default function BookmarksPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalVideos, setTotalVideos] = useState(0)

  const observerTarget = useRef(null)

  const fetchBookmarks = async (pageNum) => {
    try {
      if (pageNum === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      setError(null)

      const response = await bookmarkAPI.getBookmark({
        page: pageNum,
        per_page: 24
      })

      if (response.data.success) {
        const newVideos = response.data.data.map(bookmark => ({
          bookmarkId: bookmark.id,
          title: bookmark.title,
          image: bookmark.poster_url || "/placeholder.png",
          duration: "24:15",
          rating: parseFloat(bookmark.rating) || 0,
          isNew: false,
          href: `/watch/${bookmark.slug}`,
          slug: bookmark.slug
        }))

        if (pageNum === 1) {
          setVideos(newVideos)
        } else {
          setVideos(prev => [...prev, ...newVideos])
        }

        setTotalVideos(response.data.meta.total)
        setHasMore(response.data.meta.current_page < response.data.meta.last_page)
      }
    } catch (err) {
      console.error("Error fetching bookmarks:", err)
      
      // Handle unauthorized (not logged in)
      if (err.response?.status === 401) {
        setError("Please login to view your bookmarks")
      } else {
        setError("Failed to load bookmarks. Please try again.")
      }
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchBookmarks(1)
  }, [])

  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchBookmarks(nextPage)
    }
  }, [hasMore, loadingMore, loading, page])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [loadMore])

  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      await bookmarkAPI.deleteBookmark(bookmarkId)
      
      // Remove from local state
      setVideos(prev => prev.filter(v => v.bookmarkId !== bookmarkId))
      setTotalVideos(prev => prev - 1)
      
    } catch (err) {
      console.error("Error removing bookmark:", err)
      alert("Failed to remove bookmark")
    }
  }

  const SkeletonCard = () => (
    <div className="flex flex-col">
      <Skeleton 
        className="!rounded-none aspect-[2/3] w-full"
        baseColor="#000000"
        highlightColor="#111111"
        containerClassName="flex-1"
      />
      <Skeleton 
        className="!rounded-none mt-2"
        baseColor="#000000"
        highlightColor="#111111"
        height={20} 
        count={1} 
      />
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-8 px-4">
          <div className="mb-6">
            <Skeleton 
              className="!rounded-none h-8 w-48 mb-2"
              baseColor="#000000"
              highlightColor="#111111"
            />
            <Skeleton 
              className="!rounded-none h-4 w-32"
              baseColor="#000000"
              highlightColor="#111111"
            />
          </div>
          <div
            className="
              grid gap-3 sm:gap-4
              grid-cols-[repeat(auto-fit,minmax(110px,1fr))]
              sm:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]
            "
          >
            {Array.from({ length: 24 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-8 px-4">
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-red-500 mb-4">{error}</div>
            {error !== "Please login to view your bookmarks" && (
              <button
                onClick={() => {
                  setPage(1)
                  fetchBookmarks(1)
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Retry
              </button>
            )}
          </div>
        </main>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 pb-8 px-4">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              My Bookmarks
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              0 saved videos
            </p>
          </div>
          <div className="flex flex-col justify-center items-center h-64">
            <p className="text-muted-foreground text-lg">No bookmarks yet</p>
            <p className="text-muted-foreground text-sm mt-2">
              Start adding anime to your bookmarks!
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-8 px-4">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            My Bookmarks
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {totalVideos} saved videos
          </p>
        </div>

        <div
          className="
            grid gap-3 sm:gap-4
            grid-cols-[repeat(auto-fit,minmax(110px,1fr))]
            sm:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]
          "
        >
          {videos.map((video, index) => (
            <div key={`${video.slug}-${index}`} className="relative group">
              <VideoCard
                title={video.title}
                image={video.image}
                duration={video.duration}
                rating={video.rating}
                isNew={video.isNew}
                href={video.href}
              />
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleRemoveBookmark(video.bookmarkId)
                }}
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                title="Remove bookmark"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {loadingMore && (
          <div
            className="
              grid gap-3 sm:gap-4 mt-3 sm:mt-4
              grid-cols-[repeat(auto-fit,minmax(110px,1fr))]
              sm:grid-cols-[repeat(auto-fit,minmax(160px,1fr))]
            "
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        <div ref={observerTarget} className="h-10" />

        {!hasMore && videos.length > 0 && (
          <div className="text-center mt-8 text-muted-foreground">
            No more bookmarks to load
          </div>
        )}
      </main>
    </div>
  )
}