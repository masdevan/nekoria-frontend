"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  PlayIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"

const slides = [
  {
    id: 1,
    title: "Roman Dendam",
    description:
      "Harta yang tidak diketahui asal usul, membuat perbedaan pandangan yang berujung kepada sebuah dendam. Dendam yang berujung kepada sebuah pembunuhan.",
    image: "/placeholder.svg?height=600&width=1200",
  },
  {
    id: 2,
    title: "Keluarga Cemara",
    description:
      "Kisah keluarga sederhana yang penuh dengan cinta dan perjuangan. Mengajarkan nilai-nilai kehidupan yang sesungguhnya melalui setiap episode yang menyentuh hati.",
    image: "/placeholder.svg?height=600&width=1200",
  },
  {
    id: 3,
    title: "Imperfect",
    description:
      "Drama romantis yang mengisahkan tentang cinta yang tidak sempurna namun tulus. Sebuah perjalanan emosional yang akan membuat Anda merenungkan arti cinta sejati.",
    image: "/placeholder.svg?height=600&width=1200",
  },
  {
    id: 4,
    title: "Dilan 1990",
    description:
      "Kisah cinta remaja yang penuh dengan kenangan manis dan pahit. Menghadirkan nostalgia masa SMA yang tak terlupakan dengan cerita yang mengharukan.",
    image: "/placeholder.svg?height=600&width=1200",
  },
  {
    id: 5,
    title: "Pengabdi Setan",
    description:
      "Film horor Indonesia yang mencekam dan penuh dengan ketegangan. Kisah keluarga yang dilanda teror supernatural yang menguji keberanian penonton.",
    image: "/placeholder.svg?height=600&width=1200",
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [mouseStart, setMouseStart] = useState(0)
  const [mouseEnd, setMouseEnd] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextSlide, 10000)
    return () => clearInterval(interval)
  }, [nextSlide])

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
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
        style={{ backgroundImage: `url('${currentSlideData.image}')` }}
      >
        <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-background via-background/70 to-transparent" />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-background/20 hover:bg-background/40 text-white p-1 sm:p-2 transition-colors cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-background/20 hover:bg-background/40 text-white p-1 sm:p-2 transition-colors cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* Content */}
      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="hidden sm:block w-2/5 sm:w-3/5 lg:max-w-2xl ml-12">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-4 transition-all duration-500">
            {currentSlideData.title}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-base lg:text-lg mb-3 sm:mb-6 leading-relaxed line-clamp-4 transition-all duration-500">
            {currentSlideData.description}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-6 py-1.5 sm:py-3 flex items-center space-x-2 w-full sm:w-auto rounded-none cursor-pointer">
              <PlayIcon className="w-3 h-3 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-base">Watch Now</span>
            </button>

            <button className="border border-border hover:bg-card hover:text-white px-3 sm:px-6 py-1.5 sm:py-3 flex items-center space-x-2 bg-transparent w-auto rounded-none cursor-pointer">
              <PlusIcon className="w-3 h-3 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-base">My List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-primary w-8" : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}