import { animeAPI } from "@/services"

export const mapAnime = (anime) => ({
  title: anime.title,
  image: anime.poster_large_url || anime.poster_url,
  href: `/watch/${anime.slug}`,
  rating: parseFloat(anime.rating) || 0,
  duration: "24:15",
  isNew: false,
})

export const fetchSection = async ({ source, type, index }) => {
  const params =
    type === "genre"
      ? { genre_ids: [source.id] }
      : { studio_id: source.id }

  const res = await animeAPI.filterAnime({
    per_page: 25,
    page: 1,
    is_restricted: 0,
    sort_by: "top",
    ...params,
  })

  if (!res.data?.success || !res.data.data?.length) return null

  return {
    id: `section-${index}`,
    title: type === "genre" ? source.name : `${source.name} Studio`,
    type,
    videos: res.data.data.map(mapAnime),
  }
}
