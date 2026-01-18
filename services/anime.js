import axios from '@/services/axiosInstance'

export const animeAPI = {
    // ANIME ROUTES
    getAnime: (data) => axios.post('/public/anime/index', data),
    filterAnime: (data) => axios.post('/public/anime/filter', data),
    showAnime: (data) => axios.post('/public/anime/show', data),
    searchAnime: (data) => axios.post('/public/anime/search', data),
    topAnime: (data) => axios.post('/public/anime/top', data),
    randomAnime: (data) => axios.post('/public/anime/random', data),
    similarAnime: (data) => axios.post('/public/anime/similar', data),
}