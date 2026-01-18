"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ShareModal } from "@/components/share-modal"
import { CommentsSection } from "@/components/watch/comments-section"
import { EpisodesList } from "@/components/watch/episodes-list"
import { BatchDownload } from "@/components/watch/batch-download"
import { RecommendedAnime } from "@/components/watch/recommended-anime"
import { AnimeInfo } from "@/components/watch/anime-info"
import { PlayIcon, ShareIcon, BookmarkIcon } from "@heroicons/react/24/outline"
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid"
import { animeAPI, bookmarkAPI } from "@/services/index"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export default function WatchPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.id || params?.slug

  const [animeData, setAnimeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkId, setBookmarkId] = useState(null)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)

  useEffect(() => {
    const fetchAnimeData = async () => {
      if (!slug) {
        console.log("No slug found in params:", params)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await animeAPI.showAnime({ slug })

        if (response.data.success && response.data.data) {
          const anime = response.data.data
          setAnimeData(anime)
          
          // Check bookmark status
          checkBookmarkStatus()
          
          // Fetch similar anime
          fetchRecommendations()
        }
      } catch (error) {
        console.error("Error fetching anime data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnimeData()
  }, [slug, params])

  const checkBookmarkStatus = async () => {
    try {
      const response = await bookmarkAPI.checkBookmark({ slug })
      if (response.data.success) {
        setIsBookmarked(response.data.is_bookmarked)
        setBookmarkId(response.data.bookmark_id)
      }
    } catch (error) {
      // User not logged in or other error
      setIsBookmarked(false)
      setBookmarkId(null)
    }
  }

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true)
      const response = await animeAPI.similarAnime({ 
        slug,
        limit: 12,
        is_restricted: 0
      })
      
      if (response.data.success && response.data.data) {
        const formattedRecs = response.data.data.map(anime => ({
          title: anime.title,
          image: anime.poster_url,
          href: `/watch/${anime.slug}`,
          rating: parseFloat(anime.rating) || 0,
          duration: "24:15",
          isNew: false
        }))
        setRecommendations(formattedRecs)
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    } finally {
      setLoadingRecommendations(false)
    }
  }

  const handleBookmark = async () => {
    setBookmarkLoading(true)
    
    try {
      if (isBookmarked && bookmarkId) {
        // Remove bookmark
        await bookmarkAPI.deleteBookmark(bookmarkId)
        setIsBookmarked(false)
        setBookmarkId(null)
      } else {
        // Add bookmark
        const response = await bookmarkAPI.createBookmark({ 
          anime_id: animeData.id 
        })
        
        if (response.data.success) {
          setIsBookmarked(true)
          setBookmarkId(response.data.data.id)
        }
      }
    } catch (error) {
      console.error("Bookmark error:", error)
      
      // If 401, user not logged in
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

  const handleShare = () => setIsShareModalOpen(true)

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16 px-4 pb-8">
        <div className="relative aspect-video sm:aspect-[21/9] bg-black overflow-hidden mb-6">
          <Skeleton
            className="w-full h-full !rounded-none"
            baseColor="#000000"
            highlightColor="#111111"
          />
        </div>

        <Skeleton
          height={40}
          className="!rounded-none mb-4 max-w-xl"
          baseColor="#000000"
          highlightColor="#111111"
        />

        <div className="flex gap-4 mb-6">
          <Skeleton width={80} height={24} className="!rounded-none" baseColor="#000000" highlightColor="#111111" />
          <Skeleton width={100} height={24} className="!rounded-none" baseColor="#000000" highlightColor="#111111" />
          <Skeleton width={90} height={24} className="!rounded-none" baseColor="#000000" highlightColor="#111111" />
        </div>

        <div className="flex gap-3 mb-8">
          <Skeleton width={120} height={40} className="!rounded-none" baseColor="#000000" highlightColor="#111111" />
          <Skeleton width={100} height={40} className="!rounded-none" baseColor="#000000" highlightColor="#111111" />
          <Skeleton width={80} height={40} className="!rounded-none" baseColor="#000000" highlightColor="#111111" />
        </div>

        <div className="mb-8">
          <Skeleton
            count={4}
            height={20}
            className="!rounded-none mb-2"
            baseColor="#000000"
            highlightColor="#111111"
          />
        </div>

        <div className="mb-8">
          <Skeleton height={32} width={200} className="!rounded-none mb-4" baseColor="#000000" highlightColor="#111111" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i}>
                <Skeleton className="!rounded-none aspect-[2/3] w-full mb-2" baseColor="#000000" highlightColor="#111111" />
                <Skeleton height={20} className="!rounded-none" baseColor="#000000" highlightColor="#111111" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!animeData) {
    return (
      <div className="min-h-screen bg-background pt-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Anime not found</h1>
          <p className="text-gray-400">The anime you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const episodes = animeData.episodes?.map((ep) => ({
    id: ep.id,
    episode_number: ep.order,
    title: ep.title,
    image: ep.thumbnail_full_url || animeData.poster_url,
  })) || []

  const batches = animeData.batches || []

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Ongoing"
      case 1:
        return "Completed"
      case 2:
        return "Upcoming"
      default:
        return "Unknown"
    }
  }

  const genres = animeData.genres?.map(g => g.name) || []

  return (
    <div className="min-h-screen bg-background pt-16 px-4">
      <div className="relative aspect-video sm:aspect-[21/9] bg-black overflow-hidden mb-6">
        {animeData.trailer_url ? (
          <iframe
            src={animeData.trailer_url}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={animeData.banner_url || animeData.poster_large_url || animeData.poster_url}
              alt={animeData.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <button className="bg-primary hover:bg-primary/90 text-white rounded-full p-6 transition-all duration-300">
                <PlayIcon className="w-8 h-8" />
              </button>
            </div>
          </>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{animeData.title}</h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
        {animeData.release_date && <span>{new Date(animeData.release_date).getFullYear()}</span>}
        {animeData.total_episodes && <span>{animeData.total_episodes} Episodes</span>}
        {animeData.rating && (
          <div className="flex items-center gap-1">
            ⭐ <span>{parseFloat(animeData.rating).toFixed(1)}</span>
          </div>
        )}
        
        <button
          onClick={handleBookmark}
          disabled={bookmarkLoading}
          className={`flex cursor-pointer items-center gap-2 px-3 py-2 border rounded-none transition-all duration-300 ${
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
          <span className="hidden sm:inline">
            {bookmarkLoading ? "..." : isBookmarked ? "Bookmarked" : "Bookmark"}
          </span>
        </button>

        <button
          onClick={handleShare}
          className="flex cursor-pointer items-center gap-1 px-3 py-2 border border-gray-600 text-gray-200 rounded-none hover:bg-gray-800 transition-all duration-300"
        >
          <ShareIcon className="w-4 h-4" />
        </button>
        
        {genres.length > 0 && (
          <div className="flex gap-2">
            {genres.map(g => (
              <Link
                key={g}
                href={`/genre/${g.toLowerCase()}`}
                className="bg-primary/20 text-primary px-3 py-1.5 text-sm font-medium hover:bg-primary/30 transition-colors rounded-none"
              >
                {g}
              </Link>
            ))}
          </div>
        )}
      </div>

      <AnimeInfo
        title={animeData.title}
        description={animeData.synopsis}
        posterUrl={animeData.poster_large_url || animeData.poster_url}
        status={getStatusText(animeData.status)}
        totalEpisodes={animeData.total_episodes}
        releaseDate={animeData.release_date}
        studio={animeData.studio?.name}
        uploadBy={animeData.uploaded_by || "Admin"}
        videoId={slug}
        animeSlug={slug}
      />

      {episodes.length > 0 && (
        <EpisodesList episodes={episodes} videoId={slug} animeTitle={animeData.title} />
      )}
      
      {batches.length > 0 && (
        <BatchDownload batches={batches} animeTitle={animeData.title} />
      )}
      
      <RecommendedAnime 
        recommendations={recommendations} 
        loading={loadingRecommendations}
      />
      
      <CommentsSection 
        animeId={animeData.id}
        animeSlug={slug}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={animeData.title}
      />
    </div>
  )
}