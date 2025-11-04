import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("API Request:", config.method.toUpperCase(), config.url)
    console.log("withCredentials:", config.withCredentials)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.config.url, response.status)
    return response
  },
  (error) => {
    if (error.response) {
      console.error(
        "API Error:",
        error.response.config.url,
        error.response.status,
        error.response.data
      )
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
