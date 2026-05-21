import axios from "axios"

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const assetUrl = (url) => {
  if (!url) return ""
  if (url.startsWith("http")) return url
  return API_BASE_URL.replace("/api/v1", "") + url
}

