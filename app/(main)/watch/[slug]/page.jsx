"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ShareModal } from "@/components/share-modal"
import { CommentsSection } from "@/components/comments-section"
import { EpisodesList } from "@/components/episodes-list"
import { BatchDownload } from "@/components/batch-download"
import { AnimeInfo } from "@/components/anime-info"
import { PlayIcon, ShareIcon } from "@heroicons/react/24/outline"
import { animeAPI } from "@/services/index"
import { ContentSection } from "@/components/content-section"

export default function WatchPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.id || params?.slug

  const [animeData, setAnimeData] = useState(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    if (!slug) return

    const fetchAnimeData = async () => {
      try {
        const res = await animeAPI.showAnime({ slug })
        if (res.data.success && res.data.data) {
          setAnimeData(res.data.data)
          fetchRecommendations()
        }
      } catch (e) {
        console.error(e)
      }
    }

    const fetchRecommendations = async () => {
      try {
        const res = await animeAPI.similarAnime({ slug, limit: 24, is_restricted: 0 })
        if (res.data.success && res.data.data) {
          setRecommendations(res.data.data.map(a => ({
            title: a.title,
            image: a.poster_url,
            href: `/watch/${a.slug}`,
            rating: parseFloat(a.rating) || 0,
            duration: "24:15",
          })))
        }
      } catch (e) {
        console.error(e)
      }
    }

    fetchAnimeData()
  }, [slug])

  const handleShare = () => setIsShareModalOpen(true)

  if (!animeData) {
    return null
  }

  const episodes = animeData.episodes?.map(ep => ({
    id: ep.id,
    episode_number: ep.order,
    title: ep.title,
    image: ep.thumbnail_full_url || animeData.poster_url
  })) || []

  const batches = animeData.batches || []
  const genres = animeData.genres?.map(g => g.name) || []

  const getStatusText = status => {
    switch (status) {
      case 0: return "Ongoing"
      case 1: return "Completed"
      case 2: return "Upcoming"
      default: return "Unknown"
    }
  }

  return (
    <div className="min-h-screen bg-background pt-16 px-4">
      <div className="relative aspect-video bg-black overflow-hidden mb-6">
        {animeData.trailer_url && (
          <iframe
            src={animeData.trailer_url}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 break-words">
        {animeData.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
        {animeData.release_date && <span>{new Date(animeData.release_date).getFullYear()}</span>}
        {animeData.total_episodes && <span>{animeData.total_episodes} Episodes</span>}
        {animeData.rating && (
          <div className="flex items-center gap-1">⭐ <span>{parseFloat(animeData.rating).toFixed(1)}</span></div>
        )}

        <button
          onClick={handleShare}
          className="flex cursor-pointer items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 border border-gray-600 text-gray-200 hover:bg-gray-800 transition-all duration-300"
        >
          <ShareIcon className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>

        {genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {genres.map(g => (
              <Link
                key={g}
                href={`/genre/${g.toLowerCase()}`}
                className="bg-primary/20 text-primary px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-medium hover:bg-primary/30 transition-colors whitespace-nowrap"
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

      {episodes.length > 0 && <EpisodesList episodes={episodes} videoId={slug} animeTitle={animeData.title} />}

      {batches.length > 0 && <BatchDownload batches={batches} animeTitle={animeData.title} />}

      {recommendations.length > 0 && (
        <ContentSection
          title="You Might Also Like"
          items={recommendations}
        />
      )}

      <CommentsSection
        animeSlug={slug}
        episodeId={null}
      />

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} title={animeData.title} />
    </div>
  )
}