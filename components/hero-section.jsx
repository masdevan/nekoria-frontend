"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  PlayIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { animeAPI } from "@/services/index"

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [mouseStart, setMouseStart] = useState(0)
  const [mouseEnd, setMouseEnd] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [slideDirection, setSlideDirection] = useState("right")

  useEffect(() => {
    const fetchTopAnime = async () => {
      try {
        setLoading(true)
        const response = await animeAPI.topAnime({
          limit: 5,
          order: "desc",
          is_restricted: 0
        })
        
        if (response.data.success && response.data.data) {
          const formattedSlides = response.data.data.map(anime => ({
            id: anime.id,
            title: anime.title,
            description: anime.synopsis,
            image: anime.poster_large_url,
            slug: anime.slug,
            rating: anime.rating,
            totalEpisodes: anime.total_episodes
          }))
          setSlides(formattedSlides)
        }
      } catch (error) {
        console.error("Error fetching top anime:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopAnime()
  }, [])

  const nextSlide = useCallback(() => {
    if (slides.length > 0) {
      setSlideDirection("right")
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }
  }, [slides.length])

  const prevSlide = useCallback(() => {
    if (slides.length > 0) {
      setSlideDirection("left")
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }
  }, [slides.length])

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(nextSlide, 10000)
      return () => clearInterval(interval)
    }
  }, [nextSlide, slides.length])

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX)
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > 50) nextSlide()
    else if (distance < -50) prevSlide()
  }

  const handleMouseDown = (e) => {
    setMouseStart(e.clientX)
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    setMouseEnd(e.clientX)
    e.preventDefault()
  }

  const handleMouseUp = () => {
    if (!isDragging || !mouseStart || !mouseEnd) {
      setIsDragging(false)
      return
    }
    const distance = mouseStart - mouseEnd
    if (distance > 50) nextSlide()
    else if (distance < -50) prevSlide()
    setIsDragging(false)
    setMouseStart(0)
    setMouseEnd(0)
  }

  const handleMouseLeave = () => {
    if (isDragging) handleMouseUp()
  }

  if (loading) {
    return (
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-background overflow-hidden mt-[3.75rem]">
        <div className="absolute inset-0">
          <Skeleton 
            className="w-full h-full !rounded-none" 
            baseColor="#000000" 
            highlightColor="#111111"
          />
        </div>
        <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="hidden sm:block w-2/5 sm:w-3/5 lg:max-w-2xl ml-12">
            <Skeleton 
              height={48} 
              width="80%" 
              className="mb-4 !rounded-none"
              baseColor="#000000" 
              highlightColor="#111111"
            />
            <div className="flex items-center space-x-4 mb-3">
              <Skeleton 
                width={80} 
                height={24}
                className="!rounded-none"
                baseColor="#000000" 
                highlightColor="#111111"
              />
              <Skeleton 
                width={120} 
                height={24}
                className="!rounded-none"
                baseColor="#000000" 
                highlightColor="#111111"
              />
            </div>
            <Skeleton 
              count={3} 
              className="mb-2 !rounded-none"
              baseColor="#000000" 
              highlightColor="#111111"
            />
            <div className="flex space-x-4 mt-6">
              <Skeleton 
                width={140} 
                height={48}
                className="!rounded-none"
                baseColor="#000000" 
                highlightColor="#111111"
              />
              <Skeleton 
                width={140} 
                height={48}
                className="!rounded-none"
                baseColor="#000000" 
                highlightColor="#111111"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (slides.length === 0) {
    return (
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-gradient-to-r from-background/90 to-transparent overflow-hidden mt-[3.75rem] flex items-center justify-center">
        <div className="text-muted-foreground">No anime available</div>
      </div>
    )
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div
      className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-gradient-to-r from-background/90 to-transparent overflow-hidden select-none mt-[3.75rem]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url('${currentSlideData.image}')` }}
      >
        <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-background via-background/70 to-transparent" />
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-background/20 hover:bg-background/40 text-white p-1 sm:p-2 transition-all duration-300 cursor-pointer rounded"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-background/20 hover:bg-background/40 text-white p-1 sm:p-2 transition-all duration-300 cursor-pointer rounded"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div 
          className="hidden sm:block w-2/5 sm:w-3/5 lg:max-w-2xl ml-12"
          key={currentSlide}
        >
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-4 transition-all duration-700 animate-fade-in">
            {currentSlideData.title}
          </h1>
          
          <div className="flex items-center space-x-4 mb-3 animate-fade-in-delay-1">
            <span className="text-yellow-400 text-sm sm:text-base font-semibold">
              ⭐ {currentSlideData.rating}
            </span>
            <span className="text-muted-foreground text-sm sm:text-base">
              {currentSlideData.totalEpisodes} Episodes
            </span>
          </div>

          <p className="text-muted-foreground text-xs sm:text-base lg:text-lg mb-3 sm:mb-6 leading-relaxed line-clamp-4 transition-all duration-700 animate-fade-in-delay-2">
            {currentSlideData.description}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 animate-fade-in-delay-3">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-6 py-1.5 sm:py-3 flex items-center space-x-2 w-full sm:w-auto rounded-none cursor-pointer transition-all duration-300">
              <PlayIcon className="w-3 h-3 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-base">Watch Now</span>
            </button>

            <button className="border border-border hover:bg-card hover:text-white px-3 sm:px-6 py-1.5 sm:py-3 flex items-center space-x-2 bg-transparent w-auto rounded-none cursor-pointer transition-all duration-300">
              <PlusIcon className="w-3 h-3 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-base">My List</span>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setSlideDirection(index > currentSlide ? "right" : "left")
              setCurrentSlide(index)
            }}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              index === currentSlide ? "bg-primary w-8" : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}