"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline"

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const genres = ["Action", "Romance", "Comedy", "Drama", "Fantasy"]

  const allAnime = [
    { id: 1, title: "Attack on Titan", genre: "Action", rating: 9.0 },
    { id: 2, title: "Your Name", genre: "Romance", rating: 8.4 },
    { id: 3, title: "One Piece", genre: "Adventure", rating: 9.2 },
    { id: 4, title: "Spirited Away", genre: "Fantasy", rating: 9.3 },
    { id: 5, title: "Death Note", genre: "Thriller", rating: 8.6 },
    { id: 6, title: "My Hero Academia", genre: "Action", rating: 8.5 },
    { id: 7, title: "Demon Slayer", genre: "Action", rating: 8.7 },
    { id: 8, title: "Naruto", genre: "Action", rating: 8.4 },
    { id: 9, title: "Dragon Ball Z", genre: "Action", rating: 8.8 },
    { id: 10, title: "One Punch Man", genre: "Comedy", rating: 8.9 },
  ]

  const randomAnime = allAnime.slice(0, 10)

  const getSearchResults = () => {
    if (!searchQuery.trim()) return []
    return allAnime
      .filter((anime) => anime.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 10)
  }

  const searchResults = getSearchResults()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search/${encodeURIComponent(searchQuery.trim())}`)
      setIsOpen(false)
      setSearchQuery("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded hover:bg-muted/50 transition-colors cursor-pointer"
        aria-label="Open search"
      >
        <MagnifyingGlassIcon className="w-5 h-5 text-white" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-4 sm:pt-20 pl-2 sm:px-4">
          <div className="bg-card p-4 sm:p-6 w-full max-w-2xl sm:mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold">Search</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded hover:bg-muted/50 transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <XMarkIcon className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center bg-background rounded-lg px-3 py-2 flex-1">
                <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground mr-2" />
                <input
                  type="text"
                  placeholder="What to watch today?"
                  className="bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none w-full"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
                className="px-3 sm:px-4 py-2 text-sm cursor-pointer rounded bg-primary hover:bg-primary/90 disabled:opacity-50"
              >
                Search
              </button>
            </div>

            {searchQuery && searchResults.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Search Results ({searchResults.length})
                </h3>
                <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
                  {searchResults.map((anime) => (
                    <Link
                      key={anime.id}
                      href={`/watch/${anime.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-12 sm:w-12 sm:h-16 flex-shrink-0">
                        <img
                          src={`/abstract-geometric-shapes.png?key=8lkpn&height=64&width=48&query=${encodeURIComponent(
                            anime.title + " poster"
                          )}`}
                          alt={`${anime.title} poster`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs sm:text-sm truncate">{anime.title}</div>
                        <div className="text-xs text-muted-foreground">{anime.genre}</div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                        <span>⭐</span>
                        <span>{anime.rating}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : searchQuery && searchResults.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-8">
                No results found for "{searchQuery}"
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Popular Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <Link
                        key={genre}
                        href={`/genre/${genre.toLowerCase()}`}
                        onClick={() => setIsOpen(false)}
                        className="bg-primary/20 text-primary px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium hover:bg-primary/30 transition-colors cursor-pointer"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Popular Anime</h3>
                  <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
                    {randomAnime.map((anime) => (
                      <Link
                        key={anime.id}
                        href={`/watch/${anime.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                      >
                        <div className="w-10 h-12 sm:w-12 sm:h-16 flex-shrink-0">
                          <img
                            src={`/abstract-geometric-shapes.png?key=8lkpn&height=64&width=48&query=${encodeURIComponent(
                              anime.title + " poster"
                            )}`}
                            alt={`${anime.title} poster`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs sm:text-sm truncate">{anime.title}</div>
                          <div className="text-xs text-muted-foreground">{anime.genre}</div>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                          <span>⭐</span>
                          <span>{anime.rating}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}