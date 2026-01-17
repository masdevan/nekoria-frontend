import axios from '@/services/axiosInstance'

export const studioAPI = {
    // STUDIO ROUTES
    getStudio: (data) => axios.post('/public/studio', data)
}