"use client"

import React, { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from "@heroicons/react/24/outline"

export function ContentSection({ title, videos }) {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const getSlugFromTitle = (title) =>
    title.toLowerCase().replace(/\s+/g, "-")

  const checkScrollPosition = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }

  const scroll = (value) => {
    scrollRef.current?.scrollBy({ left: value, behavior: "smooth" })
  }

  const startDrag = (pageX) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
    scrollRef.current.style.cursor = "grabbing"
  }

  const onDrag = (pageX) => {
    if (!isDragging || !scrollRef.current) return
    const x = pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const stopDrag = () => {
    setIsDragging(false)
    scrollRef.current && (scrollRef.current.style.cursor = "grab")
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
            className="ml-5 text-xs font-normal sm:text-sm text-muted-foreground hover:text-primary"
          >
            View More
          </Link>
        </h2>

        <div className="flex gap-2">
          {canScrollLeft && (
            <ChevronLeftIcon
              className="w-4 h-4 sm:w-6 sm:h-6 cursor-pointer"
              onClick={() => scroll(-200)}
            />
          )}
          {canScrollRight && (
            <ChevronRightIcon
              className="w-4 h-4 sm:w-6 sm:h-6 cursor-pointer"
              onClick={() => scroll(200)}
            />
          )}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 cursor-grab select-none"
        onScroll={checkScrollPosition}
        onMouseDown={(e) => startDrag(e.pageX)}
        onMouseMove={(e) => onDrag(e.pageX)}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={(e) => startDrag(e.touches[0].pageX)}
        onTouchMove={(e) => onDrag(e.touches[0].pageX)}
        onTouchEnd={stopDrag}
        onDragStart={(e) => e.preventDefault()}
      >
        {videos.map((video, i) => {
          const slug = video.title
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "")

          return (
            <Link
              key={i}
              href={video.href || `/watch/${slug}`}
              className="group block flex-shrink-0 w-28 sm:w-40"
            >
              <div className="relative">
                <img
                  src={video.image || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full aspect-[5/7] object-cover"
                />

                {video.rating && (
                  <div className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-1 py-0.5">
                    ⭐ {video.rating.toFixed(1)}
                  </div>
                )}

                {video.isNew && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-1 py-0.5">
                    NEW
                  </div>
                )}

                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <PlayIcon className="w-8 h-8 text-white" />
                </div>
              </div>

              <h3 className="mt-2 text-xs sm:text-sm line-clamp-2">
                {video.title}
              </h3>
            </Link>
          )
        })}
      </div>
    </section>
  )
}