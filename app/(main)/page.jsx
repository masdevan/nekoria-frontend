import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ContentSection } from "@/components/content-section"

const vidioOriginalsData = Array.from({ length: 25 }, (_, index) => ({
  title: `Demon Slayer Adventure ${index + 1}`,
  image: "/placeholder.svg?height=300&width=200",
  duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
  isNew: Math.random() > 0.7, // Random new badges for some items
  rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10, // Random rating between 7.0-9.5
}))

const actionData = Array.from({ length: 25 }, (_, index) => ({
  title: `Action Movie ${index + 1}`,
  image: "/placeholder.svg?height=300&width=200",
  duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
  isNew: Math.random() > 0.7,
  rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
}))

const dramaData = Array.from({ length: 25 }, (_, index) => ({
  title: `Drama Series ${index + 1}`,
  image: "/placeholder.svg?height=300&width=200",
  duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
  isNew: Math.random() > 0.7,
  rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
}))

const comedyData = Array.from({ length: 25 }, (_, index) => ({
  title: `Comedy Show ${index + 1}`,
  image: "/placeholder.svg?height=300&width=200",
  duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
  isNew: Math.random() > 0.7,
  rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
}))

const crimeData = Array.from({ length: 25 }, (_, index) => ({
  title: `Crime Thriller ${index + 1}`,
  image: "/placeholder.svg?height=300&width=200",
  duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
  isNew: Math.random() > 0.7,
  rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
}))

const romanceData = Array.from({ length: 25 }, (_, index) => ({
  title: `Romance Story ${index + 1}`,
  image: "/placeholder.svg?height=300&width=200",
  duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
  isNew: Math.random() > 0.7,
  rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
}))

const ecchiData = Array.from({ length: 25 }, (_, index) => ({
  title: `Ecchi Anime ${index + 1}`,
  image: "/placeholder.svg?height=300&width=200",
  duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
  isNew: Math.random() > 0.7,
  rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
}))

const sliceOfLifeData = Array.from({ length: 25 }, (_, index) => ({
  title: `Slice of Life ${index + 1}`,
  image: "/placeholder.svg?height=300&width=200",
  duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
  isNew: Math.random() > 0.7,
  rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
}))

const shoujoData = Array.from({ length: 25 }, (_, index) => ({
  title: `Shoujo Anime ${index + 1}`,
  image: "/placeholder.svg?height=300&width=200",
  duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
  isNew: Math.random() > 0.7,
  rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
}))

const horrorData = Array.from({ length: 25 }, (_, index) => ({
  title: `Horror Movie ${index + 1}`,
  image: "/placeholder.svg?height=300&width=200",
  duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
  isNew: Math.random() > 0.7,
  rating: Math.round((Math.random() * 2.5 + 7.0) * 10) / 10,
}))

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <div>
        <ContentSection title="Adventures" videos={vidioOriginalsData} />
        <ContentSection title="Action" videos={actionData} />
        <ContentSection title="Drama" videos={dramaData} />
        <ContentSection title="Comedy" videos={comedyData} />
        <ContentSection title="Crime" videos={crimeData} />
        <ContentSection title="Romance" videos={romanceData} />
        <ContentSection title="Ecchi" videos={ecchiData} />
        <ContentSection title="Slice of Life" videos={sliceOfLifeData} />
        <ContentSection title="Shoujo" videos={shoujoData} />
        <ContentSection title="Horror" videos={horrorData} />
      </div>

      {/* Footer spacing removed since footer is now in layout */}
    </div>
  )
}
