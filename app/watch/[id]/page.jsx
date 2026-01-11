"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { ShareModal } from "@/components/share-modal"
import { CommentsSection } from "@/components/watch/comments-section"
import { EpisodesList } from "@/components/watch/episodes-list"
import { BatchDownload } from "@/components/watch/batch-download"
import { RecommendedAnime } from "@/components/watch/recommended-anime"
import { AnimeInfo } from "@/components/watch/anime-info"
import { PlayIcon, ThumbUpIcon, ShareIcon } from "@heroicons/react/24/outline"

export default function WatchPage() {
  const params = useParams()
  const videoId = params.id 

  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(1247)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => (isLiked ? prev - 1 : prev + 1))
  }

  const handleShare = () => setIsShareModalOpen(true)

  const handleDownload = () => {
    const downloadSection = document.querySelector('[data-section="batch-download"]')
    if (downloadSection) downloadSection.scrollIntoView({ behavior: "smooth" })
  }

  const videoData = {
    id: videoId,
    title: "Attack on Titan: Final Season",
    description: "The final battle for humanity begins as Eren's true intentions are revealed. The Survey Corps must face their greatest challenge yet in this epic conclusion to the Attack on Titan saga.",
    duration: "24:15",
    rating: 9.2,
    year: "2023",
    genre: ["Action", "Drama", "Anime"],
    thumbnail: "/attack-on-titan-final-season.png",
    cast: ["Yuki Kaji", "Marina Inoue", "Yui Ishikawa"],
    director: "Tetsuro Araki",
  }

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

  const recommendations = Array.from({ length: 20 }, (_, i) => ({
    title: [
      "Demon Slayer: Kimetsu no Yaiba",
      "Jujutsu Kaisen",
      "My Hero Academia",
      "One Piece",
      "Naruto Shippuden",
      "Death Note",
      "Fullmetal Alchemist",
      "Tokyo Ghoul",
      "Hunter x Hunter",
      "Mob Psycho 100",
      "One Punch Man",
      "Chainsaw Man",
      "Spy x Family",
      "Tokyo Revengers",
      "Bleach",
      "Dragon Ball Super",
      "Violet Evergarden",
      "Your Name",
      "Spirited Away",
      "Princess Mononoke",
    ][i] || `Anime Recommendation ${i + 1}`,
    image: `/placeholder.svg?height=400&width=300&query=anime-${i + 1}`,
    duration: `${Math.floor(Math.random() * 30) + 15}:${Math.floor(Math.random() * 60).toString().padStart(2,"0")}`,
    rating: Math.random() * 2 + 7,
    isNew: Math.random() > 0.7,
  }))

  const comments = [
    { id: 1, user: "AnimeOtaku2023", avatar: "/user-avatar-1.png", comment: "This episode was absolutely incredible! The animation quality is top-notch and the story development is amazing.", timestamp: "2 hours ago", likes: 24, replies: 3 },
    { id: 2, user: "TitanFan99", avatar: "/diverse-user-avatar-set-2.png", comment: "I can't believe how this series ended. So many emotions! Definitely one of the best anime of all time.", timestamp: "5 hours ago", likes: 18, replies: 1 },
    { id: 3, user: "MangaReader", avatar: "/diverse-user-avatars-3.png", comment: "The manga was great but this adaptation really brought it to life. The voice acting is phenomenal.", timestamp: "1 day ago", likes: 31, replies: 5 },
    { id: 4, user: "NewbieFan", avatar: "/user-avatar-4.png", comment: "Just started watching this series and I'm already hooked! Can't wait to binge the rest.", timestamp: "2 days ago", likes: 12, replies: 2 },
    { id: 5, user: "AnimeCritic", avatar: "/user-avatar-5.png", comment: "The character development throughout this season has been outstanding. Every episode keeps getting better.", timestamp: "3 days ago", likes: 27, replies: 4 },
  ]

  return (
    <div className="min-h-screen bg-background pt-16 px-4">
      {/* Video Player */}
      <div className="relative aspect-video sm:aspect-[21/9] bg-black overflow-hidden mb-6">
        <img src={videoData.thumbnail} alt={videoData.title} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <button className="bg-primary hover:bg-primary/90 text-white rounded-full p-6">
            <PlayIcon className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Info */}
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{videoData.title}</h1>
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
        <span>{videoData.year}</span>
        <span>{videoData.duration}</span>
        <div className="flex items-center gap-1">⭐ <span>{videoData.rating.toFixed(1)}</span></div>
        <div className="flex gap-2">
          {videoData.genre.map(g => (
            <Link key={g} href={`/genre/${g.toLowerCase()}`} className="bg-primary/20 text-primary px-3 py-1.5 text-sm font-medium hover:bg-primary/30 transition-colors">
              {g}
            </Link>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button onClick={handleLike} className={`flex items-center gap-1 px-3 py-1 border ${isLiked ? "bg-primary text-white" : "border-gray-600 text-gray-200"} rounded-none`}>
          <ThumbUpIcon className="w-4 h-4"/> {likeCount}
        </button>
        <button onClick={handleShare} className="flex items-center gap-1 px-3 py-1 border border-gray-600 text-gray-200 rounded-none">
          <ShareIcon className="w-4 h-4"/>
        </button>
        <button onClick={handleDownload} className="px-3 py-1 border border-gray-600 text-gray-200 rounded-none">
          Download
        </button>
      </div>

      {/* Sections */}
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
        videoId={videoId}
      />

      <EpisodesList episodes={episodes} videoId={videoId} />
      <BatchDownload />
      <RecommendedAnime recommendations={recommendations} />
      <CommentsSection comments={comments} />

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} title={videoData.title} />
    </div>
  )
}