import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { api } from "../lib/api"
import { useToast } from "./ToastContext"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"))
  const [token, setToken] = useState(() => localStorage.getItem("token"))
  const { showToast } = useToast()

  useEffect(() => {
    if (!token) return
    api.get("/auth/me").then(({ data }) => {
      setUser(data)
      localStorage.setItem("user", JSON.stringify(data))
    }).catch(() => logout(false))
  }, [token])

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password })
    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    showToast("Login berhasil")
  }

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password })
    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    showToast("Register berhasil")
  }

  const logout = (notify = true) => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
    if (notify) showToast("Logout berhasil")
  }

  const value = useMemo(() => ({ user, token, login, register, logout, isAdmin: user?.role === "admin" }), [user, token])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

