"use client"

import React from "react"
import { VideoCard } from "./video-card"
import { useRef, useState, useEffect } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

export function ContentSection({ title, videos }) {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const getSlugFromTitle = (title) => {
    return title.toLowerCase().replace(/\s+/g, "-")
  }

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scrollToLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollToRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  const handleMouseDown = (e) => {
    if (scrollRef.current) {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
      setStartX(e.pageX - scrollRef.current.offsetLeft)
      setScrollLeft(scrollRef.current.scrollLeft)
      scrollRef.current.style.cursor = "grabbing"
    }
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    e.stopPropagation()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab"
    }
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab"
    }
  }

  const handleTouchStart = (e) => {
    if (scrollRef.current) {
      e.preventDefault()
      setIsDragging(true)
      setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft)
      setScrollLeft(scrollRef.current.scrollLeft)
    }
  }

  const handleTouchMove = (e) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    checkScrollPosition()
  }, [])

  return (
    <section className="px-4 py-4">
      <div className="flex items-center justify-between mb-4 pr-2">
        <h2 className="text-lg sm:text-2xl font-bold text-foreground">
          {title}
          <Link
            href={`/genre/${getSlugFromTitle(title)}`}
            className="ml-5 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer font-normal"
          >
            View More
          </Link>
        </h2>
        <div className="flex items-center gap-2">
          {canScrollLeft && (
            <ChevronLeftIcon
              className="w-4 h-4 sm:w-6 sm:h-6 text-muted-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={scrollToLeft}
            />
          )}
          {canScrollRight && (
            <ChevronRightIcon
              className="w-4 h-4 sm:w-6 sm:h-6 text-muted-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={scrollToRight}
            />
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 cursor-grab select-none"
        onScroll={checkScrollPosition}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDragStart={(e) => e.preventDefault()}
      >
        {videos.map((video, index) => (
          <div key={index} className="flex-shrink-0 w-28 sm:w-40">
            <VideoCard
              title={video.title}
              image={video.image}
              duration={video.duration}
              isNew={video.isNew}
              rating={video.rating}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
