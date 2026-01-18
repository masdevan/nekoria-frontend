"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ContentSection } from "@/components/content-section"
import { genreAPI, studioAPI } from "@/services"
import { fetchSection } from "@/helpers/anime"

export default function Home() {
  const [sections, setSections] = useState([])
  const [genres, setGenres] = useState([])
  const [studios, setStudios] = useState([])
  const [loading, setLoading] = useState(true)

  const observerRef = useRef(null)
  const loadingRef = useRef(false)
  const sectionCounterRef = useRef(0)
  const sourcesRef = useRef([])

  const loadSections = async (count = 2) => {
    const sources = sourcesRef.current
    if (!sources.length) return []

    const promises = []

    for (let i = 0; i < count; i++) {
      const idx = sectionCounterRef.current % sources.length
      const item = sources[idx]
      promises.push(
        fetchSection({ source: item, type: item.type, index: sectionCounterRef.current })
      )
      sectionCounterRef.current++
    }

    const results = await Promise.all(promises)
    return results.filter(Boolean)
  }

  useEffect(() => {
    const init = async () => {
      try {
        const [genreRes, studioRes] = await Promise.all([
          genreAPI.getGenre({}),
          studioAPI.getStudio({}),
        ])

        const g = genreRes.data?.data || []
        const s = studioRes.data?.data || []

        setGenres(g)
        setStudios(s)

        const sources = [...g.map((x) => ({ ...x, type: "genre" })), ...s.map((x) => ({ ...x, type: "studio" }))]
        sourcesRef.current = sources

        const initialSections = await loadSections(2)
        setSections(initialSections)
      } catch (err) {
        console.error("Init error:", err)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  const loadMore = async () => {
    if (loadingRef.current) return
    loadingRef.current = true

    try {
      const more = await loadSections(2)
      setSections((prev) => [...prev, ...more])
    } catch (err) {
      console.error("Load more error:", err)
    } finally {
      loadingRef.current = false
    }
  }

  const lastSectionRef = useCallback((node) => {
    if (loading) return

    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: "400px" }
    )

    if (node) observerRef.current.observe(node)
  }, [loading])

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div className="pb-12 px-4">
        {sections.map((section, index) => {
          const isLast = index === sections.length - 1
          return (
            <div key={section.id} ref={isLast ? lastSectionRef : null}>
              <ContentSection title={section.title} items={section.videos} />
            </div>
          )
        })}
      </div>
    </div>
  )
}