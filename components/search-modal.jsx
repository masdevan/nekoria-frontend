"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { animeAPI, genreAPI } from "@/services/index"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [genres, setGenres] = useState([])
  const [popularAnime, setPopularAnime] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const modalRef = useRef(null)
  const scrollRef = useRef(null)
  const observerRef = useRef(null)
  const debounceTimerRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      fetchInitialData()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (searchQuery.trim()) {
      setIsSearching(true)
      debounceTimerRef.current = setTimeout(() => {
        setPage(1)
        setSearchResults([])
        setHasMore(true)
        performSearch(1)
      }, 800)
    } else {
      setSearchResults([])
      setIsSearching(false)
      setHasMore(true)
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const fetchInitialData = async () => {
    try {
      setIsLoadingInitial(true)
      const [genreResponse, popularResponse] = await Promise.all([
        genreAPI.getGenre({}),
        animeAPI.topAnime({ limit: 10, order: 'desc', is_restricted: 0 })
      ])

      if (genreResponse.data.success && genreResponse.data.data) {
        setGenres(genreResponse.data.data)
      }

      if (popularResponse.data.success && popularResponse.data.data) {
        setPopularAnime(popularResponse.data.data)
      }
    } catch (error) {
      console.error("Error fetching initial data:", error)
    } finally {
      setIsLoadingInitial(false)
    }
  }

  const performSearch = async (pageNum = 1) => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    try {
      if (pageNum === 1) {
        setIsSearching(true)
      } else {
        setIsLoadingMore(true)
      }

      const response = await animeAPI.searchAnime({
        query: searchQuery.trim(),
        per_page: 10,
        page: pageNum
      })

      if (response.data.success && response.data.data) {
        const newResults = response.data.data
        if (pageNum === 1) {
          setSearchResults(newResults)
        } else {
          setSearchResults(prev => [...prev, ...newResults])
        }
        setHasMore(newResults.length === 10)
      } else {
        if (pageNum === 1) {
          setSearchResults([])
        }
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error searching anime:", error)
      if (pageNum === 1) {
        setSearchResults([])
      }
      setHasMore(false)
    } finally {
      setIsSearching(false)
      setIsLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (!isLoadingMore && hasMore && searchQuery.trim()) {
      const nextPage = page + 1
      setPage(nextPage)
      performSearch(nextPage)
    }
  }

  const lastResultRef = useCallback(node => {
    if (isLoadingMore) return
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore()
      }
    })

    if (node) observerRef.current.observe(node)
  }, [isLoadingMore, hasMore, page])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      handleClose()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch()
  }

  const handleClose = () => {
    setIsOpen(false)
    setSearchQuery("")
    setSearchResults([])
    setPage(1)
    setHasMore(true)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 transition-colors cursor-pointer"
        aria-label="Open search"
      >
        <MagnifyingGlassIcon className="w-5 h-5 text-white" />
      </button>

      {isOpen && (
        <div className="fixed top-0 -right-5 left-0 bottom-0 bg-black/50 z-50 flex items-start justify-center">
          <div ref={modalRef} className="bg-card p-4 sm:p-6 w-full max-w-2xl min-h-screen overflow-hidden flex flex-col rounded-none">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold">Search</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-muted/50 transition-colors cursor-pointer rounded-none"
                aria-label="Close search"
              >
                <XMarkIcon className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center bg-background px-3 py-2 flex-1 rounded-none">
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
                className="px-3 sm:px-4 py-2 text-sm cursor-pointer bg-green-500 hover:bg-green-500/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-none"
              >
                Search
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              {searchQuery.trim() ? (
                isSearching && searchResults.length === 0 ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3">
                        <Skeleton width={48} height={64} className="rounded-none flex-shrink-0" baseColor="#000000" highlightColor="#111111" />
                        <div className="flex-1">
                          <Skeleton width="60%" height={16} className="rounded-none mb-2" baseColor="#000000" highlightColor="#111111" />
                          <Skeleton width="40%" height={12} className="rounded-none" baseColor="#000000" highlightColor="#111111" />
                        </div>
                        <Skeleton width={40} height={16} className="rounded-none" baseColor="#000000" highlightColor="#111111" />
                      </div>
                    ))}
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Search Results
                    </h3>
                    <div className="space-y-2">
                      {searchResults.map((anime, index) => (
                        <Link
                          key={anime.id}
                          href={`/watch/${anime.slug}`}
                          onClick={handleClose}
                          ref={index === searchResults.length - 1 ? lastResultRef : null}
                          className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-muted/50 transition-colors cursor-pointer rounded-none"
                        >
                          <div className="w-10 h-12 sm:w-12 sm:h-16 flex-shrink-0">
                            <img
                              src={anime.poster_url || "/placeholder.svg"}
                              alt={`${anime.title} poster`}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-xs sm:text-sm truncate">{anime.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {anime.total_episodes} Episodes
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                            <span>⭐</span>
                            <span>{parseFloat(anime.rating).toFixed(1)}</span>
                          </div>
                        </Link>
                      ))}
                      {isLoadingMore && (
                        <div className="space-y-2">
                          {[1, 2].map((i) => (
                            <div key={i} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3">
                              <Skeleton width={48} height={64} className="rounded-none flex-shrink-0" baseColor="#000000" highlightColor="#111111" />
                              <div className="flex-1">
                                <Skeleton width="60%" height={16} className="rounded-none mb-2" baseColor="#000000" highlightColor="#111111" />
                                <Skeleton width="40%" height={12} className="rounded-none" baseColor="#000000" highlightColor="#111111" />
                              </div>
                              <Skeleton width={40} height={16} className="rounded-none" baseColor="#000000" highlightColor="#111111" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : !isSearching ? (
                  <div className="text-sm text-muted-foreground text-center py-8">
                    No results found for "{searchQuery}"
                  </div>
                ) : null
              ) : isLoadingInitial ? (
                <div>
                  <Skeleton width={120} height={20} className="rounded-none mb-3" baseColor="#000000" highlightColor="#111111" />
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} width={80} height={32} className="rounded-none flex-shrink-0" baseColor="#000000" highlightColor="#111111" />
                    ))}
                  </div>
                  <Skeleton width={120} height={20} className="rounded-none mb-3" baseColor="#000000" highlightColor="#111111" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3">
                        <Skeleton width={48} height={64} className="rounded-none flex-shrink-0" baseColor="#000000" highlightColor="#111111" />
                        <div className="flex-1">
                          <Skeleton width="60%" height={16} className="rounded-none mb-2" baseColor="#000000" highlightColor="#111111" />
                          <Skeleton width="40%" height={12} className="rounded-none" baseColor="#000000" highlightColor="#111111" />
                        </div>
                        <Skeleton width={40} height={16} className="rounded-none" baseColor="#000000" highlightColor="#111111" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {genres.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Popular Genres</h3>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {genres.map((genre) => (
                          <Link
                            key={genre.id}
                            href={`/genre/${genre.slug}`}
                            onClick={handleClose}
                            className="bg-primary/20 text-primary px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium hover:bg-primary/30 transition-colors cursor-pointer rounded-none flex-shrink-0"
                          >
                            {genre.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {popularAnime.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Popular Anime</h3>
                      <div className="space-y-2">
                        {popularAnime.map((anime) => (
                          <Link
                            key={anime.id}
                            href={`/watch/${anime.slug}`}
                            onClick={handleClose}
                            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-muted/50 transition-colors cursor-pointer rounded-none"
                          >
                            <div className="w-10 h-12 sm:w-12 sm:h-16 flex-shrink-0">
                              <img
                                src={anime.poster_url || "/placeholder.svg"}
                                alt={`${anime.title} poster`}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-xs sm:text-sm truncate">{anime.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {anime.total_episodes} Episodes
                              </div>
                            </div>

                            <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                              <span>⭐</span>
                              <span>{parseFloat(anime.rating).toFixed(1)}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}