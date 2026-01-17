"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ShareModal } from "@/components/share-modal"
import { CommentsSection } from "@/components/watch/comments-section"
import { EpisodesList } from "@/components/watch/episodes-list"
import { BatchDownload } from "@/components/watch/batch-download"
import { RecommendedAnime } from "@/components/watch/recommended-anime"
import { AnimeInfo } from "@/components/watch/anime-info"
import { PlayIcon, ShareIcon } from "@heroicons/react/24/outline"
import { animeAPI } from "@/services/index"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export default function WatchPage() {
  const params = useParams()
  const slug = params?.id || params?.slug

  const [animeData, setAnimeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  useEffect(() => {
    const fetchAnimeData = async () => {
      if (!slug) {
        console.log("No slug found in params:", params)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log("Fetching anime with slug:", slug)
        const response = await animeAPI.showAnime({ slug })
        console.log("API Response:", response)

        if (response.data.success && response.data.data) {
          const anime = response.data.data
          console.log("Anime data:", anime)
          setAnimeData(anime)
        }
      } catch (error) {
        console.error("Error fetching anime data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnimeData()
  }, [slug, params])

  const handleShare = () => setIsShareModalOpen(true)

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-16 px-4">
        <div className="relative aspect-video sm:aspect-[21/9] bg-black overflow-hidden mb-6">
          <Skeleton
            className="w-full h-full !rounded-none"
            baseColor="#000000"
            highlightColor="#111111"
          />
        </div>

        <Skeleton
          width={300}
          height={36}
          className="rounded-none mb-2"
          baseColor="#000000"
          highlightColor="#111111"
        />

        <div className="flex gap-4 mb-4">
          <Skeleton width={60} height={20} className="rounded-none" baseColor="#000000" highlightColor="#111111" />
          <Skeleton width={60} height={20} className="rounded-none" baseColor="#000000" highlightColor="#111111" />
          <Skeleton width={80} height={20} className="rounded-none" baseColor="#000000" highlightColor="#111111" />
        </div>

        <div className="flex gap-3 mb-6">
          <Skeleton width={80} height={32} className="rounded-none" baseColor="#000000" highlightColor="#111111" />
          <Skeleton width={80} height={32} className="rounded-none" baseColor="#000000" highlightColor="#111111" />
          <Skeleton width={100} height={32} className="rounded-none" baseColor="#000000" highlightColor="#111111" />
        </div>

        <Skeleton
          count={3}
          className="rounded-none mb-2"
          baseColor="#000000"
          highlightColor="#111111"
        />
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
      />

      <EpisodesList episodes={episodes} videoId={slug} animeTitle={animeData.title} />
      <BatchDownload batches={batches} animeTitle={animeData.title} />
      <RecommendedAnime recommendations={[]} />
      <CommentsSection comments={[]} />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={animeData.title}
      />
    </div>
  )
}