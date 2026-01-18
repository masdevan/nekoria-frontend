"use client"

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
  animeSlug,
}) {
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkId, setBookmarkId] = useState(null)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)

  useEffect(() => {
    if (animeSlug) checkBookmarkStatus()
  }, [animeSlug])

  const checkBookmarkStatus = async () => {
    if (!animeSlug) return
    try {
      const response = await bookmarkAPI.checkBookmark({ slug: animeSlug })
      console.log("Bookmark API response:", response.data)

      const bookmarked = response.data.data.is_bookmarked
      setIsBookmarked(Boolean(bookmarked))
      setBookmarkId(null)
    } catch (error) {
      console.error("Check bookmark error:", error)
      setIsBookmarked(false)
      setBookmarkId(null)
    }
  }

  const handleBookmark = async () => {
    if (!animeSlug) return
    setBookmarkLoading(true)

    try {
      if (isBookmarked && bookmarkId) {
        await bookmarkAPI.deleteBookmark(bookmarkId)
        setIsBookmarked(false)
        setBookmarkId(null)
      } else {
        const response = await bookmarkAPI.createBookmark({ slug: animeSlug })
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
            className={`w-full cursor-pointer flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2.5 border !rounded-none transition-all duration-300 text-xs sm:text-sm font-medium ${isBookmarked
                ? 'border-primary bg-primary/20 text-primary'
                : 'border-gray-600 text-gray-200 hover:bg-gray-800'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isBookmarked ? (
              <BookmarkSolidIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <BookmarkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            <span>{bookmarkLoading ? "..." : isBookmarked ? "Bookmarked" : "Bookmark"}</span>
          </button>
        </div>

        <div className="flex-1 space-y-4">
          <p className="text-muted-foreground leading-relaxed max-md:max-h-60 overflow-y-auto">{description}</p>

          <div className="block bg-[#212121] border border-border p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {status && (
                <div className="flex items-center gap-2 w-full">
                  <span className="text-white">Status:</span>
                  <span className="text-green-500">{status}</span>
                </div>
              )}
              {totalEpisodes && (
                <div className="flex items-center gap-2 w-full">
                  <span className="text-white">Total Episode:</span>
                  <span className="text-green-500">{totalEpisodes}</span>
                </div>
              )}
              {releaseDate && (
                <div className="flex items-center gap-2 w-full">
                  <span className="text-white">Tanggal Rilis:</span>
                  <span className="text-green-500">{releaseDate}</span>
                </div>
              )}
              {studio && (
                <div className="flex items-center gap-2 w-full">
                  <span className="text-white">Studio:</span>
                  <span className="text-green-500">{studio}</span>
                </div>
              )}
              {uploadBy && (
                <div className="flex items-center gap-2 w-full">
                  <span className="text-white">Upload By:</span>
                  <span className="text-green-500">{uploadBy}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
