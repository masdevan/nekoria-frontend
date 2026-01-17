import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"

export function BatchDownload({ batches, animeTitle }) {
  const getQualityLabel = (quality) => {
    const labels = {
      sd_safelink_url: "480p",
      hd_safelink_url: "720p",
      fhd_safelink_url: "1080p",
      qhd_safelink_url: "1440p",
      uhd_safelink_url: "4K"
    }
    return labels[quality] || quality
  }

  const availableBatches = []
  
  batches.forEach(batch => {
    Object.keys(batch).forEach(key => {
      if (key.includes('safelink_url') && batch[key]) {
        const quality = getQualityLabel(key)
        availableBatches.push({
          title: `${animeTitle} - Batch ${quality}`,
          quality: quality,
          url: batch[key]
        })
      }
    })
  })

  if (availableBatches.length === 0) {
    return null
  }

  return (
    <div className="mb-6" data-section="batch-download">
      <h2 className="text-xl font-bold text-foreground mb-4">Batch Download</h2>
      <div className="border border-border py-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableBatches.map((batch, index) => (
            <div key={index} className="bg-[#1c1c1c] p-4 border border-border rounded-none">
              <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{batch.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{batch.quality}</p>
              <a
                href={batch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-none cursor-pointer items-center justify-center flex bg-green-700 hover:bg-green-600 py-2 text-white gap-2 transition-colors duration-300"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Download Batch
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}