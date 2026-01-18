import axios from '@/services/axiosInstance'

export const bookmarkAPI = {
    // BOOKMARK ROUTES
    getBookmark: (data) => axios.post('/public/bookmark/index', data),
    createBookmark: (data) => axios.post('/public/bookmark', data),
    checkBookmark: (data) => axios.post('/public/bookmark/check', data),
    deleteBookmark: (id) => axios.delete(`/public/bookmark/${id}/delete`),
}