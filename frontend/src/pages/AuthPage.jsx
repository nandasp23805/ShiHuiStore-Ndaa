import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"

export default function AuthPage() {
  const [mode, setMode] = useState("login")
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!form.email || form.password.length < 6 || (mode === "register" && !form.name)) {
      showToast("Lengkapi form dengan benar", "error")
      return
    }
    setLoading(true)
    try {
      if (mode === "login") await login(form.email, form.password)
      else await register(form.name, form.email, form.password)
      navigate("/")
    } catch (error) {
      showToast(error.response?.data?.message || "Autentikasi gagal", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container-page grid min-h-[70vh] place-items-center py-12">
      <form onSubmit={submit} className="w-full max-w-md rounded-md bg-white p-8 shadow-soft">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Account</p>
        <h1 className="mt-2 text-3xl font-black text-ink">{mode === "login" ? "Login" : "Register"}</h1>
        {mode === "register" && <input className="mt-6 w-full rounded-md border border-black/10 px-4 py-3 outline-none focus:border-gold" placeholder="Nama lengkap" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
        <input className="mt-4 w-full rounded-md border border-black/10 px-4 py-3 outline-none focus:border-gold" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="mt-4 w-full rounded-md border border-black/10 px-4 py-3 outline-none focus:border-gold" placeholder="Password minimal 6 karakter" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading} className="mt-6 w-full rounded-full bg-ink px-5 py-3 font-black text-white transition hover:bg-gold disabled:opacity-60">{loading ? "Memproses..." : mode === "login" ? "Login" : "Register"}</button>
        <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} className="mt-4 w-full text-sm font-bold text-neutral-600 hover:text-gold">
          {mode === "login" ? "Belum punya akun? Register" : "Sudah punya akun? Login"}
        </button>
      </form>
    </main>
  )
}

