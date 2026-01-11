import Link from "next/link"

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
}) {
  return (
    <>
      <div className="flex flex-row gap-3 mb-4">
        <div className="w-32 sm:w-32 md:w-40 flex-shrink-0">
          <img
            src={posterUrl || "/placeholder.svg"}
            alt={`${title} Poster`}
            className="w-full aspect-[5/7] object-cover shadow-md"
          />
        </div>
        <div className="flex-1 space-y-4">
          <p className="text-muted-foreground leading-relaxed">{description}</p>

          {/* Desktop version */}
          <div className="hidden sm:block bg-card border border-border p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                <Link
                  href="/status/completed"
                  className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
                >
                  {status}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Total Episode:</span>
                <Link
                  href={`/watch/${videoId}/episodes`}
                  className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
                >
                  {totalEpisodes}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Tanggal Rilis:</span>
                <Link
                  href="/release/2023"
                  className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
                >
                  {releaseDate}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Studio:</span>
                <Link
                  href="/studio/wit-studio"
                  className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
                >
                  {studio}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Upload By:</span>
                <Link
                  href="/uploader/admin"
                  className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
                >
                  {uploadBy}
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Updated At:</span>
                <Link
                  href="/uploader/admin"
                  className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
                >
                  {updatedAt}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <div className="block sm:hidden bg-card border border-border p-4 space-y-3 mb-4">
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Status:</span>
            <Link
              href="/status/completed"
              className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              {status}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total Episode:</span>
            <Link
              href={`/watch/${videoId}/episodes`}
              className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              {totalEpisodes}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Tanggal Rilis:</span>
            <Link href="/release/2023" className="text-primary hover:text-primary/80 transition-colors cursor-pointer">
              {releaseDate}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Studio:</span>
            <Link
              href="/studio/wit-studio"
              className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              {studio}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Upload By:</span>
            <Link
              href="/uploader/admin"
              className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              {uploadBy}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Updated At:</span>
            <Link
              href="/uploader/admin"
              className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
            >
              {updatedAt}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
