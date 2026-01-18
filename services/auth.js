import axios from '@/services/axiosInstance'

export const authAPI = {
    // AUTH ROUTES 
    register: (data) => axios.post("/public/auth/register", data, {responseType: "blob"}),
    login: (data) => axios.post('/public/auth/login', data),
}