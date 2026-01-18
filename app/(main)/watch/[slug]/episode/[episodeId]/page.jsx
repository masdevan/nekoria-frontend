"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ShareModal } from "@/components/share-modal"
import { FloatingChat } from "@/components/floating-chat"
import { AnimeInfo } from "@/components/anime-info"
import { EpisodesList } from "@/components/episodes-list"
import { CommentsSection } from "@/components/comments-section"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import { PlayIcon, ShareIcon, ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { episodeAPI } from "@/services/index"

export default function EpisodePage() {
  const params = useParams()
  const animeSlug = params?.slug || params?.id
  const episodeId = params?.episodeId

  const [episodeData, setEpisodeData] = useState(null)
  const [animeData, setAnimeData] = useState(null)
  const [otherEpisodes, setOtherEpisodes] = useState([])
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    const fetchEpisodeData = async () => {
      if (!animeSlug || !episodeId) return

      try {
        const response = await episodeAPI.showEpisode({
          anime_slug: animeSlug,
          episode_id: parseInt(episodeId)
        })

        if (response.data.success && response.data.data) {
          const data = response.data.data
          setEpisodeData(data.episode)
          setAnimeData(data.anime)
          setOtherEpisodes(data.other_episodes || [])
        }
      } catch (error) {
        console.error("Error fetching episode data:", error)
      }
    }

    fetchEpisodeData()
  }, [animeSlug, episodeId])

  const handleShare = () => setIsShareModalOpen(true)
  const getStatusText = (status) => status === 0 ? "Ongoing" : status === 1 ? "Completed" : status === 2 ? "Upcoming" : "Unknown"
  const getCurrentEpisodeIndex = () => otherEpisodes.findIndex(ep => ep.id === parseInt(episodeId))
  const getPrevEpisode = () => { const idx = getCurrentEpisodeIndex(); return idx > 0 ? otherEpisodes[idx - 1] : null }
  const getNextEpisode = () => { const idx = getCurrentEpisodeIndex(); return idx !== -1 && idx < otherEpisodes.length - 1 ? otherEpisodes[idx + 1] : null }
  const formatEpisodes = () => otherEpisodes.map(ep => ({ id: ep.id, episode_number: ep.order, title: ep.title, image: ep.thumbnail_url }))
  const downloadLinks = episodeData?.batchs ? Object.entries(episodeData.batchs).filter(([_, url]) => url).map(([quality, url]) => ({ quality: quality.toUpperCase(), url })) : []

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
          <button className="flex items-center gap-2 cursor-pointer p-2 text-sm text-white hover:text-gray-300 rounded-none">
            <ArrowLeftIcon className="w-4 h-4" /> Back to {animeData.title}
          </button>
        </Link>
      </div>

      <div className="fixed top-0 left-0 right-0 z-50 sm:relative sm:z-auto sm:px-4">
        <div className="relative aspect-video sm:aspect-[21/9] bg-black overflow-hidden sm:mb-6">
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
                <button className="bg-primary hover:bg-primary/90 text-white rounded-full p-4 sm:p-6 transition-all duration-300">
                  <PlayIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-[58.25vw] sm:mt-0 px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 break-words">
          {animeData.title} - {episodeData.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mb-4">
          <span>{animeData.total_episodes} Episodes</span>
          {animeData.rating && <div className="flex items-center gap-1">⭐ {parseFloat(animeData.rating).toFixed(1)}</div>}
          {animeData.release_date && <span>Released: {new Date(animeData.release_date).getFullYear()}</span>}

          <button
            onClick={handleShare}
            className="flex items-center cursor-pointer gap-1 px-2 py-1 sm:px-3 sm:py-2 border border-gray-600 text-gray-200 hover:bg-gray-800 transition-all duration-300 rounded-none"
          >
            <ShareIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>

          {animeData.genres?.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
              {animeData.genres.map(g => (
                <Link
                  key={g.name}
                  href={`/genre/${g.name.toLowerCase()}`}
                  className="bg-primary/20 text-primary px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium hover:bg-primary/30 transition-colors whitespace-nowrap"
                >
                  {g.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {prevEpisode && (
            <Link href={`/watch/${animeSlug}/episode/${prevEpisode.id}`}>
              <button className="flex cursor-pointer items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-sm border border-gray-600 text-gray-200 hover:bg-gray-700 rounded-none transition-all duration-300">
                <ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4" /> Previous
              </button>
            </Link>
          )}
          {nextEpisode && (
            <Link href={`/watch/${animeSlug}/episode/${nextEpisode.id}`}>
              <button className="flex cursor-pointer items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-sm border border-gray-600 text-gray-200 hover:bg-gray-700 rounded-none transition-all duration-300">
                Next <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />
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
          animeSlug={animeSlug}
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
                      className="w-full flex items-center justify-center bg-green-700 hover:bg-green-600 py-2 gap-2 text-white transition-colors duration-300 rounded-none"
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

        <CommentsSection
          animeSlug={animeSlug}
          episodeId={parseInt(episodeId)}
        />
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
