import { PlayIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

export function Postcard({ title, image, isNew, rating, href, disableLink }) {
  const videoId = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  const cardContent = (
    <div className="relative">
      <img
        src={image || "/placeholder.svg"}
        alt={title}
        className="w-full aspect-[5/7] object-cover transition-transform duration-300"
      />

      {rating && (
        <div className="absolute top-2 left-2 bg-black/80 text-white text-[10px] sm:text-xs px-1 py-0.5 sm:px-2 sm:py-1 flex items-center gap-0.5 sm:gap-1">
          <span>⭐</span>
          <span>{rating.toFixed(1)}</span>
        </div>
      )}

      {isNew && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] sm:text-xs px-1 py-0.5 sm:px-2 sm:py-1">
          NEW
        </div>
      )}

      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <PlayIcon className="w-8 h-8 sm:w-12 sm:h-12 text-white fill-white" />
      </div>
    </div>
  )

  const titleElement = (
    <div className="mt-2">
      <h3 className="text-foreground font-medium text-xs sm:text-sm line-clamp-2">{title}</h3>
    </div>
  )

  if (disableLink) {
    return (
      <div className="cursor-pointer group block">
        {cardContent}
        {titleElement}
      </div>
    )
  }

  return (
    <Link href={href || `/watch/${videoId}`} className="cursor-pointer group block">
      {cardContent}
      {titleElement}
    </Link>
  )
}
