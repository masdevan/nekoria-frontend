import { Download } from "lucide-react"

export function BatchDownload() {
  const batches = [
    { title: "Episodes 1-5", size: "720p • 2.1 GB" },
    { title: "Episodes 6-10", size: "720p • 2.3 GB" },
    { title: "Episodes 11-15", size: "720p • 2.2 GB" },
    { title: "Episodes 16-20", size: "720p • 2.4 GB" },
    { title: "Episodes 21-25", size: "720p • 2.0 GB" },
    { title: "Complete Season", size: "720p • 11.0 GB", isComplete: true },
  ]

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Batch Download</h2>
      <div className="border border-border py-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch, index) => (
            <div key={index} className="bg-[#1c1c1c] p-4 border border-border">
              <h3 className="font-semibold text-foreground mb-2">{batch.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{batch.size}</p>
              <button className="w-full !rounded-none cursor-pointer items-center justify-center flex bg-green-700 py-2" size="sm">
                <Download className="w-4 h-4 mr-2" />
                {batch.isComplete ? "Download All" : "Download Batch"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
