import { Navbar } from "@/components/navbar"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mt-16 px-4 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading search results...</p>
        </div>
      </div>
    </div>
  )
}
