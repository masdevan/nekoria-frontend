import axios from '@/services/axiosInstance'

export const commentAPI = {
    // COMMENT ROUTES
    getComment: (data) => axios.post('/public/comment/index', data),
    createComment: (data) => axios.post('/public/comment/store', data)
}