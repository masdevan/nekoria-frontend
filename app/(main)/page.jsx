"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ContentSection } from "@/components/content-section"
import { animeAPI, genreAPI, studioAPI } from "@/services/index"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export default function Home() {
  const [sections, setSections] = useState([])
  const [genres, setGenres] = useState([])
  const [studios, setStudios] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const observerRef = useRef(null)
  const loadingRef = useRef(false)
  const sectionCounterRef = useRef(0)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        const [genreResponse, studioResponse] = await Promise.all([
          genreAPI.getGenre({}),
          studioAPI.getStudio({})
        ])

        if (genreResponse.data.success && genreResponse.data.data) {
          setGenres(genreResponse.data.data)
        }

        if (studioResponse.data.success && studioResponse.data.data) {
          setStudios(studioResponse.data.data)
        }

        await loadInitialSections(
          genreResponse.data.data,
          studioResponse.data.data
        )
      } catch (error) {
        console.error("Error fetching initial data:", error)
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  const loadInitialSections = async (genreList, studioList) => {
    if (!genreList || !studioList || genreList.length === 0 || studioList.length === 0) {
      setLoading(false)
      return
    }

    try {
      const newSections = []
      const sectionsToLoad = 2

      for (let i = 0; i < sectionsToLoad; i++) {
        const currentIndex = sectionCounterRef.current % (genreList.length + studioList.length)
        const isGenre = currentIndex < genreList.length

        if (isGenre) {
          const genre = genreList[currentIndex]
          const response = await animeAPI.filterAnime({
            per_page: 25,
            page: 1,
            genre_ids: [genre.id],
            is_restricted: 0,
            sort_by: 'top'
          })

          if (response.data.success && response.data.data && response.data.data.length > 0) {
            const formattedData = response.data.data.map(anime => ({
              title: anime.title,
              image: anime.poster_large_url || anime.poster_url,
              href: `/watch/${anime.slug}`,
              rating: parseFloat(anime.rating) || 0,
              duration: "24:15",
              isNew: false
            }))

            newSections.push({
              id: `section-${sectionCounterRef.current}`,
              title: genre.name,
              type: 'genre',
              genreId: genre.id,
              videos: formattedData
            })
          }
        } else {
          const studioIndex = currentIndex - genreList.length
          const studio = studioList[studioIndex]
          const response = await animeAPI.filterAnime({
            per_page: 25,
            page: 1,
            studio_id: studio.id,
            is_restricted: 0,
            sort_by: 'top'
          })

          if (response.data.success && response.data.data && response.data.data.length > 0) {
            const formattedData = response.data.data.map(anime => ({
              title: anime.title,
              image: anime.poster_large_url || anime.poster_url,
              href: `/watch/${anime.slug}`,
              rating: parseFloat(anime.rating) || 0,
              duration: "24:15",
              isNew: false
            }))

            newSections.push({
              id: `section-${sectionCounterRef.current}`,
              title: `${studio.name} Studio`,
              type: 'studio',
              studioId: studio.id,
              videos: formattedData
            })
          }
        }

        sectionCounterRef.current++
      }

      setSections(newSections)
      setLoading(false)
    } catch (error) {
      console.error("Error loading initial sections:", error)
      setLoading(false)
    }
  }

  const loadMoreSections = async () => {
    if (loadingRef.current || genres.length === 0 || studios.length === 0) return

    loadingRef.current = true
    setLoadingMore(true)

    try {
      const newSections = []
      const sectionsToLoad = 2

      for (let i = 0; i < sectionsToLoad; i++) {
        const currentIndex = sectionCounterRef.current % (genres.length + studios.length)
        const isGenre = currentIndex < genres.length

        if (isGenre) {
          const genre = genres[currentIndex]
          const response = await animeAPI.filterAnime({
            per_page: 25,
            page: 1,
            genre_ids: [genre.id],
            is_restricted: 0,
            sort_by: 'top'
          })

          if (response.data.success && response.data.data && response.data.data.length > 0) {
            const formattedData = response.data.data.map(anime => ({
              title: anime.title,
              image: anime.poster_large_url || anime.poster_url,
              href: `/watch/${anime.slug}`,
              rating: parseFloat(anime.rating) || 0,
              duration: "24:15",
              isNew: false
            }))

            newSections.push({
              id: `section-${sectionCounterRef.current}`,
              title: genre.name,
              type: 'genre',
              genreId: genre.id,
              videos: formattedData
            })
          }
        } else {
          const studioIndex = currentIndex - genres.length
          const studio = studios[studioIndex]
          const response = await animeAPI.filterAnime({
            per_page: 25,
            page: 1,
            studio_id: studio.id,
            is_restricted: 0,
            sort_by: 'top'
          })

          if (response.data.success && response.data.data && response.data.data.length > 0) {
            const formattedData = response.data.data.map(anime => ({
              title: anime.title,
              image: anime.poster_large_url || anime.poster_url,
              href: `/watch/${anime.slug}`,
              rating: parseFloat(anime.rating) || 0,
              duration: "24:15",
              isNew: false
            }))

            newSections.push({
              id: `section-${sectionCounterRef.current}`,
              title: `${studio.name} Studio`,
              type: 'studio',
              studioId: studio.id,
              videos: formattedData
            })
          }
        }

        sectionCounterRef.current++
      }

      setSections(prev => [...prev, ...newSections])
    } catch (error) {
      console.error("Error loading more sections:", error)
    } finally {
      loadingRef.current = false
      setLoadingMore(false)
    }
  }

  const lastSectionRef = useCallback(node => {
    if (loading) return

    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loadingRef.current) {
        loadMoreSections()
      }
    }, {
      rootMargin: '400px'
    })

    if (node) observerRef.current.observe(node)
  }, [loading, genres, studios])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton
                width={200}
                height={32}
                className="!rounded-none"
                baseColor="#000000"
                highlightColor="#111111"
              />
              <div className="flex space-x-4 overflow-hidden">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                  <Skeleton
                    key={j}
                    width={150}
                    height={225}
                    className="!rounded-none flex-shrink-0"
                    baseColor="#000000"
                    highlightColor="#111111"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <div className="pb-12">
        {sections.map((section, index) => {
          const isLastSection = index === sections.length - 1

          return (
            <div
              key={section.id}
              ref={isLastSection ? lastSectionRef : null}
            >
              <ContentSection
                title={section.title}
                videos={section.videos}
              />
            </div>
          )
        })}

        {loadingMore && (
          <div className="px-4 sm:px-6 lg:px-8 space-y-8">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton
                  width={200}
                  height={32}
                  className="!rounded-none"
                  baseColor="#000000"
                  highlightColor="#111111"
                />
                <div className="flex space-x-4 overflow-hidden">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                    <Skeleton
                      key={j}
                      width={150}
                      height={225}
                      className="!rounded-none flex-shrink-0"
                      baseColor="#000000"
                      highlightColor="#111111"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}