"use client"

import React from "react"

import { useState, useRef } from "react"
import { VideoCard } from "@/components/video-card"

export function RecommendedAnime({ recommendations }) {
  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (scrollRef.current) {
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

  const handleMouseUp = (e) => {
    e.preventDefault()
    e.stopPropagation()
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
    e.preventDefault()
    e.stopPropagation()
    if (scrollRef.current) {
      setIsDragging(true)
      setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft)
      setScrollLeft(scrollRef.current.scrollLeft)
    }
  }

  const handleTouchMove = (e) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    e.stopPropagation()
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Recommended Anime</h2>
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-4 cursor-grab select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDragStart={(e) => e.preventDefault()}
      >
        {recommendations.map((video, index) => (
          <div key={index} className="flex-shrink-0 w-32 sm:w-40">
            <VideoCard
              title={video.title}
              image={video.image}
              duration={video.duration}
              rating={video.rating}
              isNew={video.isNew}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
