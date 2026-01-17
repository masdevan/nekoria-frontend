"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ShareModal } from "@/components/share-modal"
import { FloatingChat } from "@/components/floating-chat"
import { AnimeInfo } from "@/components/watch/anime-info"
import { EpisodesList } from "@/components/watch/episodes-list"
import { CommentsSection } from "@/components/watch/comments-section"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import {
  PlayIcon,
  ShareIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"
import { episodeAPI } from "@/services/index"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export default function EpisodePage() {
  const params = useParams()
  const animeSlug = params?.slug || params?.id
  const episodeId = params?.episodeId

  const [episodeData, setEpisodeData] = useState(null)
  const [animeData, setAnimeData] = useState(null)
  const [otherEpisodes, setOtherEpisodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  console.log("All params:", params)

  useEffect(() => {
    const fetchEpisodeData = async () => {
      if (!animeSlug || !episodeId) {
        console.log("Missing slug or episode ID", { animeSlug, episodeId })
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log("Fetching episode:", { animeSlug, episodeId: parseInt(episodeId) })
        
        const response = await episodeAPI.showEpisode({
          anime_slug: animeSlug,
          episode_id: parseInt(episodeId)
        })

        console.log("Episode API Response:", response)

        if (response.data.success && response.data.data) {
          const data = response.data.data
          console.log("Episode data:", data)
          setEpisodeData(data.episode)
          setAnimeData(data.anime)
          setOtherEpisodes(data.other_episodes || [])
        } else {
          console.log("API returned no data or unsuccessful")
        }
      } catch (error) {
        console.error("Error fetching episode data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEpisodeData()
  }, [animeSlug, episodeId])

  const handleShare = () => setIsShareModalOpen(true)

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

  const getCurrentEpisodeIndex = () => {
    return otherEpisodes.findIndex(ep => ep.id === parseInt(episodeId))
  }

  const getPrevEpisode = () => {
    const currentIndex = getCurrentEpisodeIndex()
    if (currentIndex > 0) {
      return otherEpisodes[currentIndex - 1]
    }
    return null
  }

  const getNextEpisode = () => {
    const currentIndex = getCurrentEpisodeIndex()
    if (currentIndex !== -1 && currentIndex < otherEpisodes.length - 1) {
      return otherEpisodes[currentIndex + 1]
    }
    return null
  }

  const formatEpisodes = () => {
    return otherEpisodes.map(ep => ({
      id: ep.id,
      episode_number: ep.order,
      title: ep.title,
      image: ep.thumbnail_url
    }))
  }

  const downloadLinks = episodeData?.batchs ? Object.entries(episodeData.batchs)
    .filter(([_, url]) => url !== null)
    .map(([quality, url]) => ({
      quality: quality.toUpperCase(),
      url
    })) : []

  if (loading) {
    return (
      <div className="min-h-screen bg-background sm:pt-16">
        <div className="hidden sm:block px-4 mb-4">
          <Skeleton width={200} height={32} className="rounded-none" baseColor="#000000" highlightColor="#111111" />
        </div>

        <div className="fixed top-0 left-0 right-0 z-50 sm:relative sm:z-auto sm:px-4">
          <div className="relative aspect-video bg-black overflow-hidden sm:aspect-[21/9] sm:mb-6">
            <Skeleton className="w-full h-full rounded-none" baseColor="#000000" highlightColor="#111111" />
          </div>
        </div>

        <div className="mt-[58.25vw] sm:mt-0 px-4">
          <Skeleton width={300} height={36} className="rounded-none mb-2" baseColor="#000000" highlightColor="#111111" />
          <div className="flex gap-4 mb-4">
            <Skeleton width={80} height={20} className="rounded-none" baseColor="#000000" highlightColor="#111111" />
            <Skeleton width={80} height={20} className="rounded-none" baseColor="#000000" highlightColor="#111111" />
          </div>
          <Skeleton count={3} className="rounded-none mb-2" baseColor="#000000" highlightColor="#111111" />
        </div>
      </div>
    )
  }

  if (!episodeData || !animeData) {
    return (
      <div className="min-h-screen bg-background pt-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Episode not found</h1>
          <p className="text-gray-400">The episode you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const prevEpisode = getPrevEpisode()
  const nextEpisode = getNextEpisode()

  return (
    <div className="min-h-screen bg-background sm:pt-16">
      <div className="hidden sm:block px-4 mb-4">
        <Link href={`/watch/${animeSlug}`}>
          <button className="flex cursor-pointer items-center p-2 text-sm text-white hover:text-gray-300 rounded-none">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to {animeData.title}
          </button>
        </Link>
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 sm:relative sm:z-auto sm:px-4">
        <div className="relative aspect-video bg-black overflow-hidden sm:aspect-[21/9] sm:mb-6">
          {episodeData.streaming_full_url ? (
            <iframe
              src={episodeData.streaming_full_url}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <img
                src={episodeData.thumbnail_full_url || animeData.poster_large_url}
                alt={episodeData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 py-6 transition-all duration-300">
                  <PlayIcon className="w-8 h-8" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-[58.25vw] sm:mt-0 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          {animeData.title} - {episodeData.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
          <span>{animeData.total_episodes} Episodes</span>
          {animeData.rating && (
            <div className="flex items-center gap-1">
              ⭐ <span>{parseFloat(animeData.rating).toFixed(1)}</span>
            </div>
          )}
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1 border border-gray-600 text-gray-200 rounded-none hover:bg-gray-800 transition-all duration-300 cursor-pointer"
          >
            <ShareIcon className="w-4 h-4" />
          </button>
          {animeData.release_date && <span>Released: {new Date(animeData.release_date).getFullYear()}</span>}
        </div>

        <div className="flex gap-2 mb-4">
          {prevEpisode && (
            <Link href={`/watch/${animeSlug}/episode/${prevEpisode.id}`}>
              <button className="flex items-center gap-1 px-2 py-1.5 text-sm border border-gray-600 text-gray-200 hover:bg-gray-700 rounded-none transition-all duration-300 cursor-pointer">
                <ChevronLeftIcon className="w-3 h-3" /> Previous
              </button>
            </Link>
          )}
          {nextEpisode && (
            <Link href={`/watch/${animeSlug}/episode/${nextEpisode.id}`}>
              <button className="flex items-center gap-1 px-2 py-1.5 text-sm border border-gray-600 text-gray-200 hover:bg-gray-700 rounded-none transition-all duration-300 cursor-pointer">
                Next <ChevronRightIcon className="w-3 h-3" />
              </button>
            </Link>
          )}
        </div>

        <AnimeInfo
          title={animeData.title}
          description={animeData.synopsis}
          posterUrl={animeData.poster_large_url || animeData.poster_url}
          status={getStatusText(animeData.status)}
          totalEpisodes={animeData.total_episodes}
          releaseDate={animeData.release_date}
          videoId={animeSlug}
        />

        <EpisodesList 
          episodes={formatEpisodes()} 
          videoId={animeSlug} 
          currentEpisodeId={parseInt(episodeId)}
          animeTitle={animeData.title}
        />

        {downloadLinks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Download Episode</h2>
            <div className="border border-border py-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {downloadLinks.map((link, index) => (
                  <div key={index} className="bg-[#1c1c1c] p-4 border border-border rounded-none">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {animeData.title} - {episodeData.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{link.quality}</p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-none cursor-pointer items-center justify-center flex bg-green-700 hover:bg-green-600 py-2 text-white gap-2 transition-colors duration-300"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      Download {link.quality}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <CommentsSection comments={[]} />
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={`${animeData.title} - ${episodeData.title}`}
        url={`${typeof window !== "undefined" ? window.location.origin : ""}/watch/${animeSlug}/episode/${episodeId}`}
      />

      <FloatingChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}