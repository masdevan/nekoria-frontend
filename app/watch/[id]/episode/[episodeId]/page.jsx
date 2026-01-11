"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState, useRef } from "react"
import { ShareModal } from "@/components/share-modal"
import { FloatingChat } from "@/components/floating-chat"
import { AnimeInfo } from "@/components/watch/anime-info"
import { EpisodesList } from "@/components/watch/episodes-list"
import {
  PlayIcon,
  ThumbUpIcon,
  ShareIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"

export default function EpisodePage() {
  const params = useParams()
  const seriesId = params.id
  const episodeId = params.episodeId

  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(1247)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const episodes = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    title:
      i === 0
        ? "The Final Battle Begins"
        : i === 1
        ? "Eren's True Intentions Revealed"
        : i === 2
        ? "The Survey Corps' Last Stand"
        : i === 3
        ? "Memories of the Past"
        : i === 4
        ? "The Rumbling Continues"
        : `The Path to Freedom - Part ${i - 4}`,
    image: `/attack-on-titan-episode-${i + 1}.png`,
  }))

  const currentEpisodeIndex = Number.parseInt(episodeId) - 1
  const episodeData = {
    id: Number.parseInt(episodeId),
    title: episodes[currentEpisodeIndex]?.title || "Episode Not Found",
    season: 4,
    episode: Number.parseInt(episodeId),
    duration: "24:15",
    airDate: "March 2023",
    thumbnail: `/attack-on-titan-episode-${episodeId}.png`,
    description:
      "In this intense episode, the fate of humanity hangs in the balance as our heroes face their greatest challenge yet. The Survey Corps must make difficult decisions that will determine the future of Paradis Island.",
    prevEpisode: Number.parseInt(episodeId) > 1 ? (Number.parseInt(episodeId) - 1).toString() : null,
    nextEpisode: Number.parseInt(episodeId) < 25 ? (Number.parseInt(episodeId) + 1).toString() : null,
  }

  const seriesInfo = {
    title: "Attack on Titan: Final Season",
    totalEpisodes: 25,
  }

  const handleDragStart = (x) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(x - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
    scrollRef.current.style.cursor = "grabbing"
  }

  const handleDragMove = (x) => {
    if (!isDragging || !scrollRef.current) return
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (scrollRef.current) scrollRef.current.style.cursor = "grab"
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleShare = () => setIsShareModalOpen(true)

  const videoData = {
    id: seriesId,
    title: "Attack on Titan: Final Season",
    description:
      "The final battle for humanity begins as Eren's true intentions are revealed. The Survey Corps must face their greatest challenge yet in this epic conclusion.",
    duration: "24:15",
    rating: 9.2,
    year: "2023",
    genre: ["Action", "Drama", "Anime"],
    thumbnail: "/attack-on-titan-final-season.png",
    cast: ["Yuki Kaji", "Marina Inoue", "Yui Ishikawa"],
    director: "Tetsuro Araki",
  }

  return (
    <div className="min-h-screen bg-background sm:pt-16">
      {/* Back Navigation */}
      <div className="hidden sm:block px-4 mb-4">
        <Link href={`/watch/${seriesId}`}>
          <button className="flex items-center p-2 text-sm text-white hover:text-gray-300 !rounded-none">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to {seriesInfo.title}
          </button>
        </Link>
      </div>

      {/* Video Player */}
      <div className="fixed top-0 left-0 right-0 z-50 sm:relative sm:z-auto sm:px-4">
        <div className="relative aspect-video bg-black overflow-hidden sm:aspect-[21/9] sm:mb-6">
          <img
            src={episodeData.thumbnail || "/placeholder.svg"}
            alt={episodeData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <button className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 py-6">
              <PlayIcon className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-[58.25vw] sm:mt-0 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{episodeData.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
          <span>Season {episodeData.season}</span>
          <span>Episode {episodeData.episode}</span>
          <span>{episodeData.duration}</span>
          <span>Aired: {episodeData.airDate}</span>
        </div>

        {/* Episode Navigation */}
        <div className="flex gap-2 mb-4">
          {episodeData.prevEpisode && (
            <Link href={`/watch/${seriesId}/episode/${episodeData.prevEpisode}`}>
              <button className="flex items-center gap-1 px-2 py-1 border border-gray-600 text-gray-200 hover:bg-gray-700 rounded-none">
                <ChevronLeftIcon className="w-4 h-4" /> Previous
              </button>
            </Link>
          )}
          {episodeData.nextEpisode && (
            <Link href={`/watch/${seriesId}/episode/${episodeData.nextEpisode}`}>
              <button className="flex items-center gap-1 px-2 py-1 border border-gray-600 text-gray-200 hover:bg-gray-700 rounded-none">
                Next <ChevronRightIcon className="w-4 h-4" />
              </button>
            </Link>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={handleLike}
            className={`flex items-center p-2 border ${isLiked ? "bg-primary text-white" : "border-gray-600 text-gray-200"} rounded-none`}
          >
            <ThumbUpIcon className="w-4 h-4" />
            <span className="ml-1">{likeCount}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center p-2 border border-gray-600 text-gray-200 rounded-none"
          >
            <ShareIcon className="w-4 h-4" />
          </button>
        </div>

        <AnimeInfo
          title={videoData.title}
          description={videoData.description}
          posterUrl={`/abstract-geometric-shapes.png?key=nflon&height=280&width=200&query=${encodeURIComponent(videoData.title + " poster")}`}
          status="Completed"
          totalEpisodes={25}
          releaseDate="Jun 28, 2023"
          studio="WIT Studio"
          uploadBy="AdminAnime"
          updatedAt="Jun 28, 2023"
          videoId={seriesId}
        />

        <EpisodesList episodes={episodes} videoId={seriesId} currentEpisodeId={Number.parseInt(episodeId)} />
      </div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={`${episodeData.title} - Episode ${episodeData.episode}`}
        url={`${typeof window !== "undefined" ? window.location.origin : ""}/watch/${seriesId}/episode/${episodeId}`}
      />

      <FloatingChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}