"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { PlayIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { animeAPI } from "@/services/index"

export function HeroSection() {
  const router = useRouter()
  const [slides, setSlides] = useState([])
  const [current, setCurrent] = useState(0)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const moved = useRef(false)

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await animeAPI.topAnime({ limit: 5, order: "desc", is_restricted: 0 })
        if (res.data.success && res.data.data?.length) {
          setSlides(res.data.data.map(a => ({
            id: a.id,
            title: a.title,
            desc: a.synopsis,
            image: a.poster_large_url,
            slug: a.slug,
            rating: a.rating,
            totalEpisodes: a.total_episodes
          })))
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchTop()
  }, [])

  useEffect(() => {
    if (!slides.length) return
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 10000)
    return () => clearInterval(timer)
  }, [slides.length])

  const next = useCallback(() => slides.length && setCurrent(prev => (prev + 1) % slides.length), [slides.length])
  const prev = useCallback(() => slides.length && setCurrent(prev => (prev - 1 + slides.length) % slides.length), [slides.length])

  if (!slides.length) return null
  const slide = slides[current]

  const handleTouchStart = e => {
    isDragging.current = true
    moved.current = false
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
  }

  const handleTouchMove = e => {
    if (!isDragging.current) return
    const dx = e.touches[0].clientX - startX.current
    const dy = e.touches[0].clientY - startY.current
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) moved.current = true
  }

  const handleTouchEnd = e => {
    if (!isDragging.current) return
    const endX = e.changedTouches[0].clientX
    const diff = startX.current - endX

    if (!moved.current) {
      router.push(`/watch/${slide.slug}`)
    } else {
      if (diff > 50) next()
      else if (diff < -50) prev()
    }
    isDragging.current = false
  }

  const handleMouseStart = x => { isDragging.current = true; startX.current = x; moved.current = false }
  const handleMouseMove = x => { if (!isDragging.current) return; if (Math.abs(x - startX.current) > 10) moved.current = true }
  const handleMouseEnd = x => {
    if (!isDragging.current) return
    const diff = startX.current - x
    if (!moved.current) router.push(`/watch/${slide.slug}`)
    else if (diff > 50) next()
    else if (diff < -50) prev()
    isDragging.current = false
  }

  return (
    <div
      className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-gradient-to-r from-background/90 to-transparent overflow-hidden select-none mt-[3.75rem]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={e => handleMouseStart(e.clientX)}
      onMouseMove={e => handleMouseMove(e.clientX)}
      onMouseUp={e => handleMouseEnd(e.clientX)}
      onMouseLeave={e => handleMouseEnd(e.clientX)}
      style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url('${slide.image}')` }}
      >
        <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-background via-background/70 to-transparent" />
      </div>

      <button onClick={prev} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-background/20 hover:bg-background/40 p-2 rounded">
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <button onClick={next} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-background/20 hover:bg-background/40 p-2 rounded">
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="hidden sm:block w-2/5 sm:w-3/5 lg:max-w-2xl ml-12">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-4">{slide.title}</h1>
          <div className="flex items-center space-x-4 mb-3">
            <span className="text-yellow-400 text-sm sm:text-base font-semibold">⭐ {slide.rating}</span>
            <span className="text-muted-foreground text-sm sm:text-base">{slide.totalEpisodes} Episodes</span>
          </div>
          <p className="text-muted-foreground text-xs sm:text-base lg:text-lg mb-3 sm:mb-6 leading-relaxed line-clamp-4">{slide.desc}</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => router.push(`/watch/${slide.slug}`)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-6 py-1.5 sm:py-3 flex items-center space-x-2 w-full sm:w-auto rounded-none"
            >
              <PlayIcon className="w-5 h-5" />
              <span className="text-xs sm:text-base">Watch Now</span>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all duration-500 ${i === current ? "bg-primary w-8" : "bg-white/50 hover:bg-white/70"}`} />
        ))}
      </div>
    </div>
  )
}