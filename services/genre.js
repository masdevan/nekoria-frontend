import axios from '@/services/axiosInstance'

export const genreAPI = {
    // GENRE ROUTES
    getGenre: (data) => axios.post('/public/genre', data)
}