import axios from "axios"
import { getSession } from "next-auth/react"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

let cachedToken = null

axiosInstance.interceptors.request.use(
  async (config) => {
    if (!cachedToken) {
      const session = await getSession()
      cachedToken = session?.accessToken || null
    }

    if (cachedToken) {
      config.headers.Authorization = `Bearer ${cachedToken}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      cachedToken = null 
      console.warn("Unauthorized – token expired / revoked")
    }
    return Promise.reject(err)
  }
)

export default axiosInstance
