import axios from '@/services/axiosInstance'

export const chatAPI = {
    // CHAT ROUTES
    getChat: (data) => axios.post('/public/chat/index', data),
    createChat: (data) => axios.post('/public/chat/store', data)
}