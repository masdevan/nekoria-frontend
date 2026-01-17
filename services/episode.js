import axios from '@/services/axiosInstance'

export const episodeAPI = {
    // EPISODE ROUTES
    showEpisode: (data) => axios.post('/public/episode/show', data)
}