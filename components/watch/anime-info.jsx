"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BookmarkIcon } from "@heroicons/react/24/outline"
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid"
import { bookmarkAPI } from "@/services/index"

export function AnimeInfo({
  title,
  description,
  posterUrl,
  status,
  totalEpisodes,
  releaseDate,
  studio,
  uploadBy,
  updatedAt,
  videoId,
  animeSlug,
}) {
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkId, setBookmarkId] = useState(null)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)

  useEffect(() => {
    if (animeSlug) {
      checkBookmarkStatus()
    }
  }, [animeSlug])

  const checkBookmarkStatus = async () => {
    if (!animeSlug) return
    
    try {
      const response = await bookmarkAPI.checkBookmark({ slug: videoId })
      if (response.data.success) {
        setIsBookmarked(response.data.is_bookmarked)
        setBookmarkId(response.data.bookmark_id)
      }
    } catch (error) {
      setIsBookmarked(false)
      setBookmarkId(null)
    }
  }

  const handleBookmark = async () => {
    setBookmarkLoading(true)
    
    try {
      if (isBookmarked && bookmarkId) {
        await bookmarkAPI.deleteBookmark(bookmarkId)
        setIsBookmarked(false)
        setBookmarkId(null)
      } else {
        const response = await bookmarkAPI.createBookmark({ 
          slug: videoId 
        })
        
        if (response.data.success) {
          setIsBookmarked(true)
          setBookmarkId(response.data.data.id)
        }
      }
    } catch (error) {
      console.error("Bookmark error:", error)
      
      if (error.response?.status === 401) {
        alert("Please login to bookmark anime")
        router.push("/login")
      } else {
        alert("Failed to update bookmark")
      }
    } finally {
      setBookmarkLoading(false)
    }
  }

  return (
    <>
      <div className="flex flex-row gap-3 mb-4">
        <div className="w-32 sm:w-32 md:w-40 flex-shrink-0">
          <img
            src={posterUrl || "/placeholder.svg"}
            alt={`${title} Poster`}
            className="w-full aspect-[5/7] object-cover shadow-md mb-3"
          />
          
          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className={`w-full cursor-pointer flex items-center justify-center gap-2 px-3 py-2.5 border !rounded-none transition-all duration-300 text-sm font-medium ${
              isBookmarked 
                ? 'border-primary bg-primary/20 text-primary' 
                : 'border-gray-600 text-gray-200 hover:bg-gray-800'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isBookmarked ? (
              <BookmarkSolidIcon className="w-4 h-4" />
            ) : (
              <BookmarkIcon className="w-4 h-4" />
            )}
            <span>
              {bookmarkLoading ? "..." : isBookmarked ? "Bookmarked" : "Bookmark"}
            </span>
          </button>
        </div>
        
        <div className="flex-1 space-y-4">
          <p className="text-muted-foreground leading-relaxed max-md:max-h-60 overflow-y-auto">{description}</p>

          <div className="hidden sm:block bg-[#212121] border border-border p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-white">Status:</span>
                <Link
                  href="/status/completed"
                  className="text-green-500 hover:text-green-500/80 transition-colors cursor-pointer"
                >
                  {status}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white">Total Episode:</span>
                <Link
                  href={`/watch/${videoId}/episodes`}
                  className="text-green-500 hover:text-green-500/80 transition-colors cursor-pointer"
                >
                  {totalEpisodes}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white">Tanggal Rilis:</span>
                <Link
                  href="/release/2023"
                  className="text-green-500 hover:text-green-500/80 transition-colors cursor-pointer"
                >
                  {releaseDate}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white">Studio:</span>
                <Link
                  href="/studio/wit-studio"
                  className="text-green-500 hover:text-green-500/80 transition-colors cursor-pointer"
                >
                  {studio}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white">Upload By:</span>
                <Link
                  href="/uploader/admin"
                  className="text-green-500 hover:text-green-500/80 transition-colors cursor-pointer"
                >
                  {uploadBy}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="block sm:hidden bg-[#212121] border border-border p-4 space-y-3 mb-4">
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-white">Status:</span>
            <Link
              href="/status/completed"
              className="text-green-500 hover:text-green-500/80 transition-colors cursor-pointer"
            >
              {status}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white">Total Episode:</span>
            <Link
              href={`/watch/${videoId}/episodes`}
              className="text-green-500 hover:text-green-500/80 transition-colors cursor-pointer"
            >
              {totalEpisodes}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white">Tanggal Rilis:</span>
            <Link href="/release/2023" className="text-green-500 hover:text-green-500/80 transition-colors cursor-pointer">
              {releaseDate}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white">Studio:</span>
            <Link
              href="/studio/wit-studio"
              className="text-green-500 hover:text-green-500/80 transition-colors cursor-pointer"
            >
              {studio}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white">Upload By:</span>
            <Link
              href="/uploader/admin"
              className="text-green-500 hover:text-green-500/80 transition-colors cursor-pointer"
            >
              {uploadBy}
            </Link>
          </div>

          {updatedAt && (
            <div className="flex items-center gap-2">
              <span className="text-white">Updated At:</span>
              <Link
                href="/uploader/admin"
                className="text-green-500 hover:text-green-500/80 transition-colors cursor-pointer"
              >
                {updatedAt}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}