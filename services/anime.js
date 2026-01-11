import axios from '@/services/axiosInstance'

export const animeAPI = {
    // ANIME ROUTES (ADMIN & STAFF AUTHENTICATION REQUIRED)
    getAllAnime: (data) => axios.post('/anime/index', data),
    searchAnime: (data) => axios.post('/anime/search', data),
    filterAnime: (data) => axios.post('/anime/filter', data),
    showAnime: (data) => axios.post('/anime/show', data),
    countAnime: (data) => axios.post('/anime/count', data),
    createAnime: (data) => axios.post('/anime', data),
    updateAnime: (id, data) => axios.post(`/anime/update/${id}`, data),
    deleteAnime: (id) => axios.delete(`/anime/delete/${id}`),
}