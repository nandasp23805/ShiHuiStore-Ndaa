import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../lib/api"
import { useCart } from "../context/CartContext"
import { useToast } from "../context/ToastContext"
import { formatPrice } from "../lib/format"

export default function CheckoutPage() {
  const [form, setForm] = useState({ shipping_name: "", shipping_address: "", shipping_phone: "" })
  const [loading, setLoading] = useState(false)
  const { total, fetchCart } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!form.shipping_name || !form.shipping_address || !form.shipping_phone) {
      showToast("Data pengiriman wajib lengkap", "error")
      return
    }
    setLoading(true)
    try {
      await api.post("/checkout", form)
      showToast("Checkout berhasil")
      await fetchCart()
      navigate("/")
    } catch (error) {
      showToast(error.response?.data?.message || "Checkout gagal", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container-page grid min-h-[70vh] place-items-center py-12">
      <form onSubmit={submit} className="w-full max-w-xl rounded-md bg-white p-8 shadow-soft">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Checkout</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Pengiriman</h1>
        <input className="mt-6 w-full rounded-md border border-black/10 px-4 py-3 outline-none focus:border-gold" placeholder="Nama penerima" value={form.shipping_name} onChange={(e) => setForm({ ...form, shipping_name: e.target.value })} />
        <textarea className="mt-4 min-h-28 w-full rounded-md border border-black/10 px-4 py-3 outline-none focus:border-gold" placeholder="Alamat lengkap" value={form.shipping_address} onChange={(e) => setForm({ ...form, shipping_address: e.target.value })} />
        <input className="mt-4 w-full rounded-md border border-black/10 px-4 py-3 outline-none focus:border-gold" placeholder="Nomor telepon" value={form.shipping_phone} onChange={(e) => setForm({ ...form, shipping_phone: e.target.value })} />
        <div className="mt-5 flex justify-between rounded-md bg-mist p-4 font-black"><span>Total</span><span>{formatPrice(total)}</span></div>
        <button disabled={loading} className="mt-6 w-full rounded-full bg-ink px-5 py-3 font-black text-white transition hover:bg-gold disabled:opacity-60">{loading ? "Memproses..." : "Bayar Sekarang"}</button>
      </form>
    </main>
  )
}

